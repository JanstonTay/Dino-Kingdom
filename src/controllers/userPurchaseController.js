const pool = require("../services/db");

const userPurchaseModel = require("../models/userPurchaseModel.js");
const eggTypeModel = require("../models/eggTypeModel.js");
const foodTypeModel = require("../models/foodTypeModel.js");
const userEggInventoryModel = require("../models/userEggInventoryModel.js");
const userFoodInventoryModel = require("../models/userFoodInventoryModel.js");

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


module.exports.readUserPurchasesByUserId = (req, res) => {

    const data = { 
        user_id: req.params.user_id 
    };

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
// CREATE USER PURCHASE MIDDLEWARE
// ##############################################################

module.exports.validatePurchaseRequest = (req, res, next) => {
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

    // Store in res.locals for subsequent middlewares
    res.locals.purchaseData = data;
    next();
};

module.exports.fetchItemPrice = (req, res, next) => {
    const { item_type, item_id } = res.locals.purchaseData;

    const priceCallback = (err, results) => {
        if (err) {
            console.error("Error fetching price:", err);
            return res.status(500).json(err);
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: `${item_type} type not found`
            });
        }

        res.locals.pricePerUnit = Number(results[0].price_points);
        next();
    };

    if (item_type === "egg") {
        eggTypeModel.selectById({ egg_type_id: item_id }, priceCallback);
    } else { // food
        foodTypeModel.selectById({ food_type_id: item_id }, priceCallback);
    }
};

module.exports.checkUserBalance = (req, res, next) => {
    const { user_id, quantity } = res.locals.purchaseData;
    const pricePerUnit = res.locals.pricePerUnit;
    const totalCost = pricePerUnit * Number(quantity);

    res.locals.totalCost = totalCost;

    const userSQL = `
        SELECT user_id, username, points
        FROM User
        WHERE user_id = ?;
    `;

    pool.query(userSQL, [user_id], (userErr, userResults) => {
        if (userErr) {
            console.error("Error reading User (checkUserBalance):", userErr);
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

        res.locals.currentPoints = userRow.points;
        res.locals.newPoints = userRow.points - totalCost;
        next();
    });
};

module.exports.deductUserPoints = (req, res, next) => {
    const { user_id } = res.locals.purchaseData;
    const newPoints = res.locals.newPoints;

    const updateUserSQL = `
        UPDATE User
        SET points = ?
        WHERE user_id = ?;
    `;

    pool.query(updateUserSQL, [newPoints, user_id], (updErr) => {
        if (updErr) {
            console.error("Error updating User points (deductUserPoints):", updErr);
            return res.status(500).json(updErr);
        }
        next();
    });
};

module.exports.updateUserInventory = (req, res, next) => {
    const { user_id, item_type, item_id, quantity } = res.locals.purchaseData;
    const qty = Number(quantity);

    if (item_type === "egg") {
        const invKey = { user_id: user_id, egg_type_id: item_id };
        
        userEggInventoryModel.selectSingle(invKey, (invErr, invResults) => {
            if (invErr) {
                console.error("Error selectSingle (egg inventory):", invErr);
                return res.status(500).json(invErr);
            }

            if (invResults.length > 0) {
                const newQty = Number(invResults[0].quantity) + qty;
                const updateData = { user_id, egg_type_id: item_id, quantity: newQty };
                
                userEggInventoryModel.updateQuantity(updateData, (uErr) => {
                    if (uErr) {
                        console.error("Error updateQuantity (egg inventory):", uErr);
                        return res.status(500).json(uErr);
                    }
                    next();
                });
            } else {
                const insertData = { user_id, egg_type_id: item_id, quantity: qty };
                
                userEggInventoryModel.insertSingle(insertData, (iErr) => {
                    if (iErr) {
                        console.error("Error insertSingle (egg inventory):", iErr);
                        return res.status(500).json(iErr);
                    }
                    next();
                });
            }
        });

    } else { // food
        const invKey = { user_id: user_id, food_type_id: item_id };

        userFoodInventoryModel.selectSingle(invKey, (invErr, invResults) => {
            if (invErr) {
                console.error("Error selectSingle (food inventory):", invErr);
                return res.status(500).json(invErr);
            }

            if (invResults.length > 0) {
                const newQty = Number(invResults[0].quantity) + qty;
                const updateData = { user_id, food_type_id: item_id, quantity: newQty };

                userFoodInventoryModel.updateQuantity(updateData, (uErr) => {
                    if (uErr) {
                        console.error("Error updateQuantity (food inventory):", uErr);
                        return res.status(500).json(uErr);
                    }
                    next();
                });
            } else {
                const insertData = { user_id, food_type_id: item_id, quantity: qty };

                userFoodInventoryModel.insertSingle(insertData, (iErr) => {
                    if (iErr) {
                        console.error("Error insertSingle (food inventory):", iErr);
                        return res.status(500).json(iErr);
                    }
                    next();
                });
            }
        });
    }
};

module.exports.logPurchaseTransaction = (req, res, next) => {
    const { user_id, item_type, item_id, quantity } = res.locals.purchaseData;
    const { totalCost, newPoints } = res.locals;
    const purchased_on = new Date();

    const purchaseData = {
        user_id,
        item_type,
        item_id,
        quantity,
        purchased_on
    };

    userPurchaseModel.insertSingle(purchaseData, (pErr, pResults) => {
        if (pErr) {
            console.error("Error insertSingle (UserPurchase):", pErr);
            return res.status(500).json(pErr);
        }

        return res.status(201).json({
            purchase_id: pResults.insertId,
            user_id: user_id,
            item_type: item_type,
            item_id: item_id,
            quantity: quantity,
            purchased_on: purchased_on,
            total_cost: totalCost,
            remaining_points: newPoints
        });
    });
};

console.log("userPurchase controller loaded");
