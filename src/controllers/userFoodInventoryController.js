const userFoodInventoryModel = require("../models/userFoodInventoryModel.js");

module.exports.readAllUserFoodInventory = (req, res) => {

    const callback = (error, results) => {

        if (error) {
            console.error("error readAllUserFoodInventory:", error);
            return res.status(500).json(error);
        }

        return res.status(200).json(results);

    };

    userFoodInventoryModel.selectAll(callback);
};


module.exports.readUserFoodInventoryByUserId = (req, res) => {

    const data = {
        user_id: req.params.user_id
    }

    const callback = (error, results) => {

        if (error) {
            console.error("error readUserFoodInventoryByUserId:", error);
            return res.status(500).json(error);
        }

        return res.status(200).json(results);
    };

    userFoodInventoryModel.selectByUserId(data, callback);
};


module.exports.addUserFoodInventory = (req, res) => {

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

    if (Number(data.quantity) <= 0) {
        return res.status(400).json({
            message: "Quantity must be greater than 0"
        });
    }

    const checkData = {
        user_id: data.user_id,
        food_type_id: data.food_type_id
    };

    const checkCallback = (error, results) => {

        if (error) {
            console.error("error selectSingle:", error);
            return res.status(500).json(error);
        }

        if (results.length > 0) {
            const current = results[0];
            const newQuantity = Number(current.quantity) + Number(data.quantity);

            const updateData = {
                user_id: data.user_id,
                food_type_id: data.food_type_id,
                quantity: newQuantity
            };

            const updateCallback = (error, results) => {

                if (error) {
                    console.error("error updateQuantity:", error);
                    return res.status(500).json(error);
                }

                return res.status(200).json({
                    message: "Inventory updated",

                    user_id: updateData.user_id,
                    food_type_id: updateData.food_type_id,
                    quantity: updateData.quantity
                });
            };

            userFoodInventoryModel.updateQuantity(updateData, updateCallback);
        }
        else {

            const insertCallback = (error, results) => {

                if (error) {
                    console.error("error insertSingle:", error);
                    return res.status(500).json(error);
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


module.exports.updateUserFoodInventory = (req, res) => {

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
            console.error("error selectSingle:", error);
            return res.status(500).json(error);
        }

        if (results.length == 0) {
            return res.status(404).json({
                message: "Inventory row not found"
            });
        }

        const updateCallback = (error, results) => {

            if (error) {
                console.error("Error updateQuantity:", error);
                return res.status(500).json(error);
            }

            return res.status(200).json({
                message: "Inventory quantity set",
                user_id: data.user_id,
                food_type_id: data.food_type_id,
                quantity: data.quantity
            });

        };

        userFoodInventoryModel.updateQuantity(data, updateCallback);
    };

    userFoodInventoryModel.selectSingle(checkData, checkCallback);
};


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

        if (results.affectedRows == 0) {
            return res.status(404).json({
                message: "Inventory row not found"
            });
        }

        return res.status(204).send();
    };

    userFoodInventoryModel.deleteSingle(data, callback);
};

console.log("userFoodInventory controller loaded");

