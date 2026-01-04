const pool = require("../services/db");
const userPurchaseModel = require("../models/userPurchaseModel.js");
const eggTypeModel = require("../models/eggTypeModel.js");
const foodTypeModel = require("../models/foodTypeModel.js");
const userEggInventoryModel = require("../models/userEggInventoryModel.js");
const userFoodInventoryModel = require("../models/userFoodInventoryModel.js");

// ##############################################################
// GET /userPurchases
// ##############################################################
module.exports.readAllUserPurchases = (req, res) => {

    const callback = (error, results) => {

        if (error) {
            console.error("Error readAllUserPurchases:", error);
            return res.status(500).json(error);
        }

        return res.status(200).json(results);
    };

    userPurchaseModel.selectAll(callback);
};


// ##############################################################
// GET /userPurchases/user/:user_id
// ##############################################################
module.exports.readUserPurchasesByUserId = (req, res) => {

    const data = { user_id: req.params.user_id };

    const callback = (error, results) => {

        if (error) {
            console.error("Error readUserPurchasesByUserId:", error);
            return res.status(500).json(error);
        }

        return res.status(200).json(results);
    };

    userPurchaseModel.selectByUserId(data, callback);
};


// ##############################################################
// POST /userPurchases
// body: { user_id, item_type: "egg"|"food", item_id, quantity }
//
// Steps:
//  1) Validate body & item_type
//  2) Get price_points from EggType / FoodType
//  3) Check user's current points
//  4) Deduct points if enough
//  5) Add to UserEggInventory / UserFoodInventory
//  6) Insert purchase log
// ##############################################################
module.exports.createUserPurchase = (req, res) => {

    const data = {
        user_id: req.body.user_id,
        item_type: req.body.item_type,   // "egg" or "food"
        item_id: req.body.item_id,
        quantity: req.body.quantity
    };

    if (
        data.user_id == null ||
        data.item_type == null ||
        data.item_id == null ||
        data.quantity == null
    ) {
        return res.status(400).json({
            message: "Missing user_id or item_type or item_id or quantity"
        });
    }

    if (Number(data.quantity) <= 0) {
        return res.status(400).json({
            message: "Quantity must be greater than 0"
        });
    }

    if (data.item_type !== "egg" && data.item_type !== "food") {
        return res.status(400).json({
            message: "item_type must be 'egg' or 'food'"
        });
    }

    // ------------------------------------------------------------------
    // 2) Get price_points based on item_type
    // ------------------------------------------------------------------
    const quantity = Number(data.quantity);

    const handlePrice = (pricePerUnit) => {

        const totalCost = pricePerUnit * quantity;

        // ------------------------------------------------------------------
        // 3) Check user's current points
        // ------------------------------------------------------------------
        const userSQL = `
            SELECT user_id, username, points
            FROM User
            WHERE user_id = ?;
        `;

        pool.query(userSQL, [data.user_id], (userErr, userResults) => {

            if (userErr) {
                console.error("Error reading User (createUserPurchase):", userErr);
                return res.status(500).json(userErr);
            }

            if (userResults.length === 0) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            const userRow = userResults[0];

            if (userRow.points < totalCost) {
                return res.status(400).json({
                    message: "Not enough points to complete purchase",
                    current_points: userRow.points,
                    total_cost: totalCost
                });
            }

            const newPoints = userRow.points - totalCost;

            // ------------------------------------------------------------------
            // 4) Deduct points
            // ------------------------------------------------------------------
            const updateUserSQL = `
                UPDATE User
                SET points = ?
                WHERE user_id = ?;
            `;

            pool.query(updateUserSQL, [newPoints, data.user_id], (updErr) => {

                if (updErr) {
                    console.error("Error updating User points (createUserPurchase):", updErr);
                    return res.status(500).json(updErr);
                }

                // ------------------------------------------------------------------
                // 5) Add to inventory
                // ------------------------------------------------------------------
                if (data.item_type === "egg") {

                    const invKey = {
                        user_id: data.user_id,
                        egg_type_id: data.item_id
                    };

                    const invCheckCallback = (invErr, invResults) => {

                        if (invErr) {
                            console.error("Error selectSingle (egg inventory):", invErr);
                            return res.status(500).json(invErr);
                        }

                        if (invResults.length > 0) {
                            const currentQty = Number(invResults[0].quantity);
                            const newQty = currentQty + quantity;

                            const updateData = {
                                user_id: data.user_id,
                                egg_type_id: data.item_id,
                                quantity: newQty
                            };

                            userEggInventoryModel.updateQuantity(updateData, (uErr) => {

                                if (uErr) {
                                    console.error("Error updateQuantity (egg inventory):", uErr);
                                    return res.status(500).json(uErr);
                                }

                                // move on to logging purchase
                                insertPurchase(totalCost, newPoints);
                            });

                        } else {

                            const insertData = {
                                user_id: data.user_id,
                                egg_type_id: data.item_id,
                                quantity: quantity
                            };

                            userEggInventoryModel.insertSingle(insertData, (iErr) => {

                                if (iErr) {
                                    console.error("Error insertSingle (egg inventory):", iErr);
                                    return res.status(500).json(iErr);
                                }

                                insertPurchase(totalCost, newPoints);
                            });
                        }
                    };

                    userEggInventoryModel.selectSingle(invKey, invCheckCallback);

                } else if (data.item_type === "food") {

                    const invKey = {
                        user_id: data.user_id,
                        food_type_id: data.item_id
                    };

                    const invCheckCallback = (invErr, invResults) => {

                        if (invErr) {
                            console.error("Error selectSingle (food inventory):", invErr);
                            return res.status(500).json(invErr);
                        }

                        if (invResults.length > 0) {
                            const currentQty = Number(invResults[0].quantity);
                            const newQty = currentQty + quantity;

                            const updateData = {
                                user_id: data.user_id,
                                food_type_id: data.item_id,
                                quantity: newQty
                            };

                            userFoodInventoryModel.updateQuantity(updateData, (uErr) => {

                                if (uErr) {
                                    console.error("Error updateQuantity (food inventory):", uErr);
                                    return res.status(500).json(uErr);
                                }

                                insertPurchase(totalCost, newPoints);
                            });

                        } else {

                            const insertData = {
                                user_id: data.user_id,
                                food_type_id: data.item_id,
                                quantity: quantity
                            };

                            userFoodInventoryModel.insertSingle(insertData, (iErr) => {

                                if (iErr) {
                                    console.error("Error insertSingle (food inventory):", iErr);
                                    return res.status(500).json(iErr);
                                }

                                insertPurchase(totalCost, newPoints);
                            });
                        }
                    };

                    userFoodInventoryModel.selectSingle(invKey, invCheckCallback);
                }
            });
        });
    };

    // helper to actually insert into UserPurchase and respond
    const insertPurchase = (totalCost, newPoints) => {

        const purchased_on = new Date();

        const purchaseData = {
            user_id: data.user_id,
            item_type: data.item_type,
            item_id: data.item_id,
            quantity: quantity,
            purchased_on: purchased_on
        };

        const purchaseCallback = (pErr, pResults) => {

            if (pErr) {
                console.error("Error insertSingle (UserPurchase):", pErr);
                return res.status(500).json(pErr);
            }

            return res.status(201).json({
                purchase_id: pResults.insertId,
                user_id: data.user_id,
                item_type: data.item_type,
                item_id: data.item_id,
                quantity: quantity,
                purchased_on: purchased_on,
                total_cost: totalCost,
                remaining_points: newPoints
            });
        };

        userPurchaseModel.insertSingle(purchaseData, purchaseCallback);
    };

    // Decide which price lookup to use
    if (data.item_type === "egg") {

        const eggData = { egg_type_id: data.item_id };

        const eggCallback = (err, results) => {

            if (err) {
                console.error("Error selectById (EggType):", err);
                return res.status(500).json(err);
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: "Egg type not found"
                });
            }

            const price = Number(results[0].price_points);
            handlePrice(price);
        };

        eggTypeModel.selectById(eggData, eggCallback);

    } else { // food

        const foodData = { food_type_id: data.item_id };

        const foodCallback = (err, results) => {

            if (err) {
                console.error("Error selectById (FoodType):", err);
                return res.status(500).json(err);
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: "Food type not found"
                });
            }

            const price = Number(results[0].price_points);
            handlePrice(price);
        };

        foodTypeModel.selectById(foodData, foodCallback);
    }
};

console.log("userPurchase controller loaded");
