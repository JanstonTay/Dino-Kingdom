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


module.exports.createFeedEvent = (req, res) => {

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

    const dinoData = {
        dinosaur_id: data.dinosaur_id
    };

    const dinoCallback = (error, dinoResults) => {

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

        if (Number(dinosaur.owner_id) !== Number(data.user_id)) {
            return res.status(403).json({
                message: "Forbidden: dinosaur does not belong to this user"
            });
        }

        const foodData = {
            food_type_id: data.food_type_id
        };

        const foodCallback = (error2, foodResults) => {

            if (error2) {
                console.error("Error selectFoodTypeById:", error2);
                return res.status(500).json(error2);
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

            const inventoryData = {
                user_id: data.user_id,
                food_type_id: data.food_type_id
            };

            const inventoryCallback = (error3, invResults) => {

                if (error3) {
                    console.error("Error selectInventoryRow:", error3);
                    return res.status(500).json(error3);
                }

                if (invResults.length === 0) {
                    return res.status(400).json({
                        message: "No such food in inventory"
                    });
                }

                const inventory = invResults[0];

                if (inventory.quantity < data.quantity) {
                    return res.status(400).json({
                        message: "Not enough food in inventory"
                    });
                }

                //  Calculate XP gain + new stats
                const gainedXp = Number(food.xp_gain) * Number(data.quantity);
                const updatedStats = applyXpAndLevel(dinosaur, gainedXp);

                //  Insert feed event
                const feedData = {
                    dinosaur_id: data.dinosaur_id,
                    food_type_id: data.food_type_id,
                    quantity: data.quantity
                };

                const insertCallback = (error4, feedResults) => {

                    if (error4) {
                        console.error("Error insertFeedEvent:", error4);
                        return res.status(500).json(error4);
                    }

                    const feed_id = feedResults.insertId;

                    //  Decrement inventory
                    const decData = {
                        user_id: data.user_id,
                        food_type_id: data.food_type_id,
                        quantity: data.quantity
                    };

                    const decCallback = (error5, decResults) => {

                        if (error5) {
                            console.error("Error decrementInventory:", error5);
                            return res.status(500).json(error5);
                        }

                        if (decResults.affectedRows === 0) {
                            return res.status(409).json({
                                message: "Failed to update inventory"
                            });
                        }

                        // Update dinosaur stats (level, xp, height, weight)
                        const statsData = {
                            dinosaur_id: data.dinosaur_id,
                            level: updatedStats.level,
                            xp: updatedStats.xp,
                            height: updatedStats.height,
                            weight: updatedStats.weight
                        };

                        const statsCallback = (error6, statsResults) => {

                            if (error6) {
                                console.error("Error updateDinosaurStats:", error6);
                                return res.status(500).json(error6);
                            }

                            return res.status(201).json({
                                feed_id: feed_id,
                                dinosaur_id: Number(data.dinosaur_id),
                                food_type_id: Number(data.food_type_id),
                                quantity: Number(data.quantity),
                                xp_gained: gainedXp,
                                new_level: updatedStats.level,
                                new_xp: updatedStats.xp,
                                new_height: updatedStats.height,
                                new_weight: updatedStats.weight,
                                message: "Dinosaur fed, inventory updated, stats updated"
                            });
                        };

                        dinosaurFeedModel.updateDinosaurStats(statsData, statsCallback);
                    };

                    dinosaurFeedModel.decrementInventory(decData, decCallback);
                };

                dinosaurFeedModel.insertFeedEvent(feedData, insertCallback);
            };

            dinosaurFeedModel.selectInventoryRow(inventoryData, inventoryCallback);
        };

        dinosaurFeedModel.selectFoodTypeById(foodData, foodCallback);
    };

    dinosaurFeedModel.selectDinosaurWithDiet(dinoData, dinoCallback);
};

console.log("dinosaurFeed controller loaded");

