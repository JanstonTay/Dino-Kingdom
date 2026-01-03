const userFoodInventoryModel = require("../models/userFoodInventoryModel.js");

// ##############################################################
// GET ALL INVENTORY (ALL USERS)
// ##############################################################
module.exports.readAllUserFoodInventory = (req, res) => {

    const callback = (error, results) => {
        if (error) {
            console.error("Error readAllUserFoodInventory:", error);
            return res.status(500).json(error);
        }

        return res.status(200).json(results);
    };

    userFoodInventoryModel.selectAll(callback);
};

// ##############################################################
// GET INVENTORY BY USER_ID (WITH FOOD DETAILS)
// ##############################################################
module.exports.readUserFoodInventoryByUserId = (req, res) => {

    const data = {
        user_id: req.params.user_id
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error readUserFoodInventoryByUserId:", error);
            return res.status(500).json(error);
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "No food inventory found for this user"
            });
        }

        return res.status(200).json(results);
    };

    userFoodInventoryModel.selectByUserId(data, callback);
};

// ##############################################################
// CREATE OR UPDATE INVENTORY ROW
// ##############################################################
module.exports.createOrUpdateUserFoodInventory = (req, res) => {

    const data = {
        user_id: req.body.user_id,
        food_type_id: req.body.food_type_id,
        quantity: req.body.quantity
    };

    if (data.user_id == null || data.food_type_id == null || data.quantity == null) {
        return res.status(400).json({
            message: "Missing user_id or food_type_id or quantity"
        });
    }

    const checkData = {
        user_id: data.user_id,
        food_type_id: data.food_type_id
    };

    const checkCallback = (error, results) => {
        if (error) {
            console.error("Error check inventory row:", error);
            return res.status(500).json(error);
        }

        // Row exists -> update
        if (results.length > 0) {

            const updateCallback = (error2, results2) => {
                if (error2) {
                    console.error("Error updateUserFoodInventory:", error2);
                    return res.status(500).json(error2);
                }

                return res.status(200).json({
                    message: "Inventory updated",
                    user_id: data.user_id,
                    food_type_id: data.food_type_id,
                    quantity: data.quantity
                });
            };

            userFoodInventoryModel.updateQuantity(data, updateCallback);
        }
        // Row does NOT exist -> insert
        else {

            const insertCallback = (error2, results2) => {
                if (error2) {
                    console.error("Error createUserFoodInventory:", error2);
                    return res.status(500).json(error2);
                }

                return res.status(201).json({
                    message: "Inventory created",
                    user_id: data.user_id,
                    food_type_id: data.food_type_id,
                    quantity: data.quantity
                });
            };

            userFoodInventoryModel.insertSingle(data, insertCallback);
        }
    };

    userFoodInventoryModel.selectSingle(checkData, checkCallback);
};

// ##############################################################
// DELETE ONE INVENTORY ROW
// ##############################################################
module.exports.deleteUserFoodInventoryItem = (req, res) => {

    const data = {
        user_id: req.body.user_id,
        food_type_id: req.body.food_type_id
    };

    if (data.user_id == null || data.food_type_id == null) {
        return res.status(400).json({
            message: "Missing user_id or food_type_id"
        });
    }

    const callback = (error, results) => {
        if (error) {
            console.error("Error deleteUserFoodInventoryItem:", error);
            return res.status(500).json(error);
        }

        // optional: check affectedRows and return 404 if nothing deleted
        // if (results.affectedRows === 0) {
        //     return res.status(404).json({ message: "Inventory row not found" });
        // }

        return res.status(204).send();
    };

    userFoodInventoryModel.deleteSingle(data, callback);
};
