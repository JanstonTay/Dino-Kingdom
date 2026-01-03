const pool = require("../services/db");
const dinosaurFeedModel = require("../models/dinosaurFeedModel.js");

module.exports.checkFeedBody = (req, res, next) => {

    if (req.body.user_id == undefined ||
        req.body.dinosaur_id == undefined ||
        req.body.food_type_id == undefined ||
        req.body.quantity == undefined) {

        return res.status(400).json({
            message: "Missing user_id or dinosaur_id or food_type_id or quantity"
        });
    }

    next();
};


// helper: check if this dinosaur diet can eat this food diet
const isDietCompatible = (dinoDiet, foodDiet) => {

    if (!dinoDiet || !foodDiet) return false;

    const d = dinoDiet.trim().toLowerCase();
    const f = foodDiet.trim().toLowerCase();

    if (d === "omnivore") {
        // omnivore can eat anything
        return true;
    }

    if (d === "herbivore" && f === "herbivore") {
        return true;
    }

    if (d === "carnivore" && f === "carnivore") {
        return true;
    }

    return false;
};


module.exports.verifyFeedRequest = (req, res, next) => {

    const data = {
        user_id: req.body.user_id,
        dinosaur_id: req.body.dinosaur_id,
        food_type_id: req.body.food_type_id,
        quantity: req.body.quantity
    };

    // 1) get dinosaur + its owner + its diet (via DinosaurDex)
    const dinoSQL = `
        SELECT d.id, d.owner_id, dx.diet AS dinosaur_diet
        FROM Dinosaur d
        JOIN DinosaurDex dx ON d.dex_num = dx.number
        WHERE d.id = ?;
    `;

    pool.query(dinoSQL, [data.dinosaur_id], (error, dinoResults) => {

        if (error) {
            console.error("Error verifyFeedRequest (dinosaur query):", error);
            return res.status(500).json(error);
        }

        if (dinoResults.length === 0) {
            return res.status(404).json({ message: "Dinosaur not found" });
        }

        const dinosaur = dinoResults[0];

        // check ownership
        if (Number(dinosaur.owner_id) !== Number(data.user_id)) {
            return res.status(403).json({ message: "Forbidden: dinosaur does not belong to this user" });
        }

        // 2) get food type (including its diet)
        const foodSQL = `
            SELECT food_type_id, diet
            FROM FoodType
            WHERE food_type_id = ?;
        `;

        pool.query(foodSQL, [data.food_type_id], (error2, foodResults) => {

            if (error2) {
                console.error("Error verifyFeedRequest (food query):", error2);
                return res.status(500).json(error2);
            }

            if (foodResults.length === 0) {
                return res.status(404).json({ message: "Food type not found" });
            }

            const food = foodResults[0];

            // 3) diet compatibility check
            if (!isDietCompatible(dinosaur.dinosaur_diet, food.diet)) {
                return res.status(400).json({
                    message: "Diet mismatch: this dinosaur cannot eat this type of food"
                });
            }

            // 4) make sure user has enough food in inventory
            const inventorySQL = `
                SELECT quantity
                FROM UserFoodInventory
                WHERE user_id = ? AND food_type_id = ?;
            `;

            const inventoryValues = [data.user_id, data.food_type_id];

            pool.query(inventorySQL, inventoryValues, (error3, invResults) => {

                if (error3) {
                    console.error("Error verifyFeedRequest (inventory query):", error3);
                    return res.status(500).json(error3);
                }

                if (invResults.length === 0 || invResults[0].quantity < data.quantity) {
                    return res.status(400).json({
                        message: "Not enough food in inventory"
                    });
                }

                // all checks passed → store info for next handler
                res.locals.feedData = {
                    dinosaur_id: data.dinosaur_id,
                    food_type_id: data.food_type_id,
                    quantity: data.quantity
                };
                res.locals.user_id = data.user_id;

                next();
            });
        });
    });
};


module.exports.createFeedEvent = (req, res) => {

    const feedData = res.locals.feedData;

    const insertCallback = (error, results) => {

        if (error) {
            console.error("Error createFeedEvent (insert feed):", error);
            return res.status(500).json(error);
        }

        const feed_id = results.insertId;

        // after inserting feed event, decrement inventory
        const updateInvSQL = `
            UPDATE UserFoodInventory
            SET quantity = quantity - ?
            WHERE user_id = ? AND food_type_id = ?;
        `;

        const updateInvValues = [
            feedData.quantity,
            res.locals.user_id,
            feedData.food_type_id
        ];

        pool.query(updateInvSQL, updateInvValues, (error2) => {

            if (error2) {
                console.error("Error createFeedEvent (update inventory):", error2);
                return res.status(500).json(error2);
            }

            return res.status(201).json({
                feed_id: feed_id,
                dinosaur_id: feedData.dinosaur_id,
                food_type_id: feedData.food_type_id,
                quantity: feedData.quantity,
                // client can ignore this if they want; DB has the exact value
                used_on: new Date().toISOString()
            });
        });
    };

    dinosaurFeedModel.insertFeedEvent(feedData, insertCallback);
};


module.exports.readAllDinosaurFeed = (req, res) => {

    const callback = (error, results) => {

        if (error) {
            console.error("Error readAllDinosaurFeed:", error);
            return res.status(500).json(error);
        }

        return res.status(200).json(results);
    };

    dinosaurFeedModel.selectAllDinosaurFeed(callback);
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

        return res.status(200).json(results);
    };

    dinosaurFeedModel.selectFeedByDinosaurId(data, callback);
};


module.exports.deleteFeedById = (req, res) => {

    const data = {
        feed_id: req.params.feed_id
    };

    const callback = (error, results) => {

        if (error) {
            console.error("Error deleteFeedById:", error);
            return res.status(500).json(error);
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Feed event not found" });
        }

        return res.status(204).send();
    };

    dinosaurFeedModel.deleteFeedById(data, callback);
};

console.log("dinosaurFeed controller loaded");
