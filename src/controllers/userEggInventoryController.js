const userEggInventoryModel = require("../models/userEggInventoryModel.js");

// ##############################################################
// GET /userEggInventory
// ##############################################################
module.exports.readAllUserEggInventory = (req, res) => {

    const callback = (error, results) => {

        if (error) {
            console.error("Error readAllUserEggInventory:", error);
            return res.status(500).json(error);
        }

        return res.status(200).json(results);
    };

    userEggInventoryModel.selectAll(callback);
};


// ##############################################################
// GET /userEggInventory/user/:user_id
// ##############################################################
module.exports.readUserEggInventoryByUserId = (req, res) => {

    const data = { user_id: req.params.user_id };

    const callback = (error, results) => {

        if (error) {
            console.error("Error readUserEggInventoryByUserId:", error);
            return res.status(500).json(error);
        }

        return res.status(200).json(results);
    };

    userEggInventoryModel.selectByUserId(data, callback);
};


// ##############################################################
// POST /userEggInventory
// → add eggs (10 + 10 → 20)
// ##############################################################
module.exports.addUserEggInventory = (req, res) => {

    const data = {
        user_id: req.body.user_id,
        egg_type_id: req.body.egg_type_id,
        quantity: req.body.quantity
    };

    if (data.user_id == null || data.egg_type_id == null || data.quantity == null) {

        return res.status(400).json({
            message: "Missing user_id or egg_type_id or quantity"
        });
    }

    if (Number(data.quantity) <= 0) {
        return res.status(400).json({
            message: "Quantity must be greater than 0"
        });
    }

    const checkData = {
        user_id: data.user_id,
        egg_type_id: data.egg_type_id
    };

    const checkCallback = (error, results) => {

        if (error) {
            console.error("Error selectSingle (addUserEggInventory):", error);
            return res.status(500).json(error);
        }

        if (results.length > 0) {

            const current = results[0];
            const newQuantity = Number(current.quantity) + Number(data.quantity);

            const updateData = {
                user_id: data.user_id,
                egg_type_id: data.egg_type_id,
                quantity: newQuantity
            };

            const updateCallback = (error2, results2) => {

                if (error2) {
                    console.error("Error updateQuantity (addUserEggInventory):", error2);
                    return res.status(500).json(error2);
                }

                return res.status(200).json({
                    message: "Egg inventory updated (quantity added)",
                    user_id: updateData.user_id,
                    egg_type_id: updateData.egg_type_id,
                    quantity: updateData.quantity
                });
            };

            userEggInventoryModel.updateQuantity(updateData, updateCallback);
        }
        else {

            const insertCallback = (error2, results2) => {

                if (error2) {
                    console.error("Error insertSingle (addUserEggInventory):", error2);
                    return res.status(500).json(error2);
                }

                return res.status(201).json({
                    message: "Egg inventory created",
                    user_id: data.user_id,
                    egg_type_id: data.egg_type_id,
                    quantity: data.quantity
                });
            };

            userEggInventoryModel.insertSingle(data, insertCallback);
        }
    };

    userEggInventoryModel.selectSingle(checkData, checkCallback);
};


// ##############################################################
// PUT /userEggInventory
// → set egg quantity to exact value
// ##############################################################
module.exports.updateUserEggInventory = (req, res) => {

    const data = {
        user_id: req.body.user_id,
        egg_type_id: req.body.egg_type_id,
        quantity: req.body.quantity
    };

    if (data.user_id == null || data.egg_type_id == null || data.quantity == null) {

        return res.status(400).json({
            message: "Missing user_id or egg_type_id or quantity"
        });
    }

    const checkData = {
        user_id: data.user_id,
        egg_type_id: data.egg_type_id
    };

    const checkCallback = (error, results) => {

        if (error) {
            console.error("Error selectSingle (updateUserEggInventory):", error);
            return res.status(500).json(error);
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Egg inventory row not found"
            });
        }

        const updateCallback = (error2, results2) => {

            if (error2) {
                console.error("Error updateQuantity (updateUserEggInventory):", error2);
                return res.status(500).json(error2);
            }

            return res.status(200).json({
                message: "Egg inventory quantity set",
                user_id: data.user_id,
                egg_type_id: data.egg_type_id,
                quantity: data.quantity
            });
        };

        userEggInventoryModel.updateQuantity(data, updateCallback);
    };

    userEggInventoryModel.selectSingle(checkData, checkCallback);
};


// ##############################################################
// DELETE /userEggInventory
// ##############################################################
module.exports.deleteUserEggInventoryItem = (req, res) => {

    const data = {
        user_id: req.body.user_id,
        egg_type_id: req.body.egg_type_id
    };

    if (data.user_id == null || data.egg_type_id == null) {
        return res.status(400).json({
            message: "Missing user_id or egg_type_id"
        });
    }

    const callback = (error, results) => {

        if (error) {
            console.error("Error deleteUserEggInventoryItem:", error);
            return res.status(500).json(error);
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({
                message: "Egg inventory row not found"
            });
        }

        return res.status(204).send();
    };

    userEggInventoryModel.deleteSingle(data, callback);
};

console.log("userEggInventory controller loaded");
