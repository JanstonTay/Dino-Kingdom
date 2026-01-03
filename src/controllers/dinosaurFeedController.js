// src/controllers/dinosaurFeedController.js
const dinosaurFeedModel = require("../models/dinosaurFeedModel.js");
const dinosaurModel = require("../models/dinosaurModel.js");
const userFoodInventoryModel = require("../models/userFoodInventoryModel.js");


// ##############################################################
// GET: ALL FEED EVENTS
// ##############################################################
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


// ##############################################################
// GET: FEED EVENTS BY DINOSAUR_ID
// ##############################################################
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
                message: "No feed events found for this dinosaur"
            });
        }

        return res.status(200).json(results);
    };

    dinosaurFeedModel.selectByDinosaurId(data, callback);
};


// ##############################################################
// MIDDLEWARE 1: CHECK BODY FOR FEED
// ##############################################################
module.exports.checkFeedBody = (req, res, next) => {

    if (req.body.dinosaur_id == undefined ||
        req.body.food_type_id == undefined ||
        req.body.quantity == undefined) {

        return res.status(400).json({
            message: "Missing dinosaur_id or food_type_id or quantity"
        });
    }

    if (req.body.quantity <= 0) {
        return res.status(400).json({
            message: "Quantity must be greater than 0"
        });
    }

    next();
};


// ##############################################################
// MIDDLEWARE 2: CHECK DINOSAUR + CONSUME INVENTORY
//  - verifies dinosaur exists
//  - checks owner's UserFoodInventory
//  - reduces quantity or deletes row
//  - stores info in res.locals for next middleware
// ##############################################################
module.exports.checkAndConsumeFood = (req, res, next) => {

    const dinosaurId = req.body.dinosaur_id;
    const foodTypeId = req.body.food_type_id;
    const quantityToUse = req.body.quantity;

    const dinoData = { id: dinosaurId };

    const dinoCallback = (error, dinoResults) => {

        if (error) {
            console.error("Error checkAndConsumeFood (select dinosaur):", error);
            return res.status(500).json(error);
        }

        if (dinoResults.length === 0) {
            return res.status(404).json({
                message: "Dinosaur not found"
            });
        }

        const dinosaur = dinoResults[0];
        const ownerId = dinosaur.owner_id;

        const invSelectData = {
            user_id: ownerId,
            food_type_id: foodTypeId
        };

        const invSelectCallback = (error2, invResults) => {

            if (error2) {
                console.error("Error checkAndConsumeFood (select inventory):", error2);
                return res.status(500).json(error2);
            }

            if (invResults.length === 0) {
                return res.status(400).json({
                    message: "User has no such food in inventory"
                });
            }

            const inventoryRow = invResults[0];

            if (inventoryRow.quantity < quantityToUse) {
                return res.status(400).json({
                    message: "Not enough food quantity in inventory"
                });
            }

            const newQuantity = inventoryRow.quantity - quantityToUse;

            // store info for next middleware
            res.locals.feed_dinosaur_id = dinosaurId;
            res.locals.feed_food_type_id = foodTypeId;
            res.locals.feed_quantity = quantityToUse;
            res.locals.feed_user_id = ownerId;
            res.locals.remaining_quantity = newQuantity;

            if (newQuantity > 0) {

                const updateData = {
                    user_id: ownerId,
                    food_type_id: foodTypeId,
                    quantity: newQuantity
                };

                const updateCallback = (error3, updateResults) => {

                    if (error3) {
                        console.error("Error checkAndConsumeFood (update inventory):", error3);
                        return res.status(500).json(error3);
                    }

                    next();
                };

                userFoodInventoryModel.updateQuantity(updateData, updateCallback);

            } else {

                const deleteData = {
                    user_id: ownerId,
                    food_type_id: foodTypeId
                };

                const deleteCallback = (error3, deleteResults) => {

                    if (error3) {
                        console.error("Error checkAndConsumeFood (delete inventory):", error3);
                        return res.status(500).json(error3);
                    }

                    next();
                };

                userFoodInventoryModel.deleteSingle(deleteData, deleteCallback);
            }
        };

        userFoodInventoryModel.selectSingle(invSelectData, invSelectCallback);
    };

    dinosaurModel.selectById(dinoData, dinoCallback);
};


// ##############################################################
// MIDDLEWARE 3: CREATE FEED EVENT (AFTER INVENTORY CONSUMED)
// ##############################################################
module.exports.createFeedEvent = (req, res) => {

    const data = {
        dinosaur_id: res.locals.feed_dinosaur_id,
        food_type_id: res.locals.feed_food_type_id,
        quantity: res.locals.feed_quantity
    };

    const callback = (error, results) => {

        if (error) {
            console.error("Error createFeedEvent (insert feed):", error);
            return res.status(500).json(error);
        }

        const newFeedId = results.insertId;

        return res.status(201).json({
            message: "Feed event created",
            feed_id: newFeedId,
            dinosaur_id: data.dinosaur_id,
            food_type_id: data.food_type_id,
            quantity: data.quantity,
            user_id: res.locals.feed_user_id,
            remaining_quantity: res.locals.remaining_quantity
        });
    };

    dinosaurFeedModel.insertSingle(data, callback);
};

console.log("dinosaurFeed controller loaded");
