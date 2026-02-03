const dinosaurFeedModel = require("../models/dinosaurFeedModel.js");


// Diet compatibility:
// - Herbivore dinosaur -> only Herbivore food
// - Carnivore dinosaur -> only Carnivore food
// - Omnivore dinosaur -> can eat both

const dietsCompatible = (dinoDietRaw, foodDietRaw) => {

    if (!dinoDietRaw || !foodDietRaw) {
        return false;
    }

    const dinoDiet = dinoDietRaw.trim().toLowerCase();
    const foodDiet = foodDietRaw.trim().toLowerCase();

    if (dinoDiet === "omnivore") {
        return true;
    }

    if (dinoDiet === "herbivore" && foodDiet === "herbivore") {
        return true;
    }

    if (dinoDiet === "carnivore" && foodDiet === "carnivore") {
        return true;
    }

    return false;
};


// Apply XP + level rules and return updated stats
function applyXpAndLevel(dinosaur, gainedXp) {

    let level = Number(dinosaur.level) || 1;
    let xp = Number(dinosaur.xp) || 0;
    let height = Number(dinosaur.height);
    let weight = Number(dinosaur.weight);

    // XP needed from level N -> N+1
    const xpToNext = {
        1: 200,   // 1 -> 2
        2: 500,   // 2 -> 3
        3: 1000,  // 3 -> 4
        4: 2000   // 4 -> 5
        // 5 is max in this scheme
    };

    xp += gainedXp;

    // allow overflow and multiple level-ups
    while (level < 5) {

        const needed = xpToNext[level];
        if (needed == null) break;

        if (xp >= needed) {
            xp -= needed;
            level += 1;
            height = height * 1.5;
            weight = weight * 1.5;
        }
        else {
            break;
        }
    }

    // round to 2 s.f.
    height = Number(height.toFixed(2));
    weight = Number(weight.toFixed(2));

    return {
        level, xp, height, weight
    };

}


module.exports.readAllDinosaurFeed = (req, res) => {

    const callback = (error, results) => {

        if (error) {
            console.error("Error readAllDinosaurFeed:", error);
            return res.status(500).json(error);
        }

        return res.status(200).json(results);

    };

    dinosaurFeedModel.selectAll(callback);
};


module.exports.readFeedByDinosaurId = (req, res) => {

    const data = {
        dinosaur_id: req.params.dinosaur_id
    };

    const callback = (error, results) => {

        if (error) {
            console.error("Error readFeedByDinosaurId:", error);
            return res.status(500).json(error);
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "No feed history for this dinosaur"
            });
        }

        return res.status(200).json(results);
    };

    dinosaurFeedModel.selectByDinosaurId(data, callback);
};


// ##############################################################
// CREATE FEED EVENT MIDDLEWARE
// ##############################################################

// 1. Validate Request Body
module.exports.validateFeedRequest = (req, res, next) => {
    const data = {
        user_id: req.body.user_id,
        dinosaur_id: req.body.dinosaur_id,
        food_type_id: req.body.food_type_id,
        quantity: req.body.quantity
    };

    if (
        data.user_id == undefined ||
        data.dinosaur_id == undefined ||
        data.food_type_id == undefined ||
        data.quantity == undefined
    ) {
        return res.status(400).json({
            message: "Missing user_id or dinosaur_id or food_type_id or quantity"
        });
    }

    if (Number(data.quantity) <= 0) {
        return res.status(400).json({
            message: "Quantity must be greater than 0"
        });
    }

    res.locals.feedData = data;
    next();
};

// 2. Check Dinosaur Ownership
module.exports.checkDinosaurOwnership = (req, res, next) => {
    const { dinosaur_id, user_id } = res.locals.feedData;

    dinosaurFeedModel.selectDinosaurWithDiet({ dinosaur_id }, (error, dinoResults) => {
        if (error) {
            console.error("Error selectDinosaurWithDiet:", error);
            return res.status(500).json(error);
        }

        if (dinoResults.length === 0) {
            return res.status(404).json({
                message: "Dinosaur not found"
            });
        }

        const dinosaur = dinoResults[0];

        if (Number(dinosaur.owner_id) !== Number(user_id)) {
            return res.status(403).json({
                message: "Forbidden: dinosaur does not belong to this user"
            });
        }

        res.locals.dinosaur = dinosaur;
        next();
    });
};

// 3. Check Food and Diet Compatibility
module.exports.checkFoodAndDiet = (req, res, next) => {
    const { food_type_id } = res.locals.feedData;
    const { dinosaur } = res.locals;

    dinosaurFeedModel.selectFoodTypeById({ food_type_id }, (error, foodResults) => {
        if (error) {
            console.error("Error selectFoodTypeById:", error);
            return res.status(500).json(error);
        }

        if (foodResults.length === 0) {
            return res.status(404).json({
                message: "Food type not found"
            });
        }

        const food = foodResults[0];

        if (!dietsCompatible(dinosaur.dinosaur_diet, food.diet)) {
            return res.status(403).json({
                message: "Food diet not compatible with dinosaur diet"
            });
        }

        res.locals.food = food;
        next();
    });
};

// 4. Check Inventory
module.exports.checkInventory = (req, res, next) => {
    const { user_id, food_type_id, quantity } = res.locals.feedData;

    const inventoryData = { user_id, food_type_id };

    dinosaurFeedModel.selectInventoryRow(inventoryData, (error, invResults) => {
        if (error) {
            console.error("Error selectInventoryRow:", error);
            return res.status(500).json(error);
        }

        if (invResults.length === 0) {
            return res.status(400).json({
                message: "No such food in inventory"
            });
        }

        const inventory = invResults[0];

        if (inventory.quantity < quantity) {
            return res.status(400).json({
                message: "Not enough food in inventory"
            });
        }

        next();
    });
};

// 5. Insert Feed Feed Log
module.exports.insertFeedLog = (req, res, next) => {
    const { dinosaur_id, food_type_id, quantity } = res.locals.feedData;
    const feedData = {
        dinosaur_id,
        food_type_id,
        quantity
    };

    dinosaurFeedModel.insertFeedEvent(feedData, (error, feedResults) => {
        if (error) {
            console.error("Error insertFeedEvent:", error);
            return res.status(500).json(error);
        }

        res.locals.feed_id = feedResults.insertId;
        next();
    });
};

// 6. Decrement Inventory
module.exports.decrementUserInventory = (req, res, next) => {
    const { user_id, food_type_id, quantity } = res.locals.feedData;
    const decData = {
        user_id,
        food_type_id,
        quantity
    };

    dinosaurFeedModel.decrementInventory(decData, (error, decResults) => {
        if (error) {
            console.error("Error decrementInventory:", error);
            return res.status(500).json(error);
        }

        if (decResults.affectedRows === 0) {
            // Ideally we should rollback the feed log here, but for this exercise we move forward
            // Realistically, transactional integrity is needed.
            return res.status(409).json({
                message: "Failed to update inventory"
            });
        }

        next();
    });
};

// 7. Update Stats and Respond
module.exports.updateStatsAndRespond = (req, res) => {
    const { dinosaur, food, feedData, feed_id } = res.locals;
    const { quantity } = feedData;

    const gainedXp = Number(food.xp_gain) * Number(quantity);
    const updatedStats = applyXpAndLevel(dinosaur, gainedXp);

    const statsData = {
        dinosaur_id: dinosaur.id, // Fixed: use .id instead of .dinosaur_id
        level: updatedStats.level,
        xp: updatedStats.xp,
        height: updatedStats.height,
        weight: updatedStats.weight
    };

    dinosaurFeedModel.updateDinosaurStats(statsData, (error, statsResults) => {
        if (error) {
            console.error("Error updateDinosaurStats:", error);
            return res.status(500).json(error);
        }

        return res.status(201).json({
            feed_id: feed_id,
            dinosaur_id: Number(dinosaur.dinosaur_id),
            food_type_id: Number(food.food_type_id),
            quantity: Number(quantity),
            xp_gained: gainedXp,
            new_level: updatedStats.level,
            new_xp: updatedStats.xp,
            new_height: updatedStats.height,
            new_weight: updatedStats.weight,
            message: "Dinosaur fed, inventory updated, stats updated"
        });
    });
};

console.log("dinosaurFeed controller loaded");

