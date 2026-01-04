const hatchEventModel = require("../models/hatchEventModel.js");
const userEggInventoryModel = require("../models/userEggInventoryModel.js");
const dinosaurModel = require("../models/dinosaurModel.js");

// ##############################################################
// GET /hatchEvents
// ##############################################################
module.exports.readAllHatchEvents = (req, res) => {

    const callback = (error, results) => {

        if (error) {
            console.error("Error readAllHatchEvents:", error);
            return res.status(500).json(error);
        }

        return res.status(200).json(results);
    };

    hatchEventModel.selectAll(callback);
};


// ##############################################################
// GET /hatchEvents/user/:user_id
// ##############################################################
module.exports.readHatchEventsByUserId = (req, res) => {

    const data = { user_id: req.params.user_id };

    const callback = (error, results) => {

        if (error) {
            console.error("Error readHatchEventsByUserId:", error);
            return res.status(500).json(error);
        }

        return res.status(200).json(results);
    };

    hatchEventModel.selectByUserId(data, callback);
};


// ##############################################################
// POST /hatchEvents
// body: { user_id, egg_type_id, dex_num, height, weight }
// Steps:
//  1) Check user has this egg in UserEggInventory (quantity > 0)
//  2) Create Dinosaur (level 1, xp 0)
//  3) Decrease egg quantity by 1
//  4) Insert HatchEvent log
// ##############################################################
module.exports.createHatchEvent = (req, res) => {

    const data = {
        user_id: req.body.user_id,
        egg_type_id: req.body.egg_type_id,
        dex_num: req.body.dex_num,
        height: req.body.height,
        weight: req.body.weight
    };

    if (
        data.user_id == null ||
        data.egg_type_id == null ||
        data.dex_num == null ||
        data.height == null ||
        data.weight == null
    ) {
        return res.status(400).json({
            message: "Missing user_id or egg_type_id or dex_num or height or weight"
        });
    }

    // 1) Check egg inventory
    const invData = {
        user_id: data.user_id,
        egg_type_id: data.egg_type_id
    };

    const invCallback = (error, results) => {

        if (error) {
            console.error("Error selectSingle (createHatchEvent - inventory):", error);
            return res.status(500).json(error);
        }

        if (results.length === 0 || Number(results[0].quantity) <= 0) {
            return res.status(400).json({
                message: "User does not have this egg to hatch"
            });
        }

        const currentQty = Number(results[0].quantity);

        // 2) Create dinosaur
        const dinoData = {
            owner_id: data.user_id,
            dex_num: data.dex_num,
            level: 1,
            xp: 0,
            height: data.height,
            weight: data.weight
        };

        const dinoCallback = (error2, dinoResults) => {

            if (error2) {
                console.error("Error insertSingle (createHatchEvent - dinosaur):", error2);
                return res.status(500).json(error2);
            }

            const dinosaur_id = dinoResults.insertId;
            const newQty = currentQty - 1;

            // 3) Decrease egg quantity by 1
            const updatedInvData = {
                user_id: data.user_id,
                egg_type_id: data.egg_type_id,
                quantity: newQty
            };

            const updateInvCallback = (error3) => {

                if (error3) {
                    console.error("Error updateQuantity (createHatchEvent - inventory):", error3);
                    return res.status(500).json(error3);
                }

                // 4) Insert hatch event log
                const hatched_on = new Date();

                const hatchData = {
                    user_id: data.user_id,
                    egg_type_id: data.egg_type_id,
                    dinosaur_id: dinosaur_id,
                    hatched_on: hatched_on
                };

                const hatchCallback = (error4, hatchResults) => {

                    if (error4) {
                        console.error("Error insertSingle (createHatchEvent - hatch):", error4);
                        return res.status(500).json(error4);
                    }

                    return res.status(201).json({
                        hatch_id: hatchResults.insertId,
                        user_id: data.user_id,
                        egg_type_id: data.egg_type_id,
                        dinosaur_id: dinosaur_id,
                        hatched_on: hatched_on
                    });
                };

                hatchEventModel.insertSingle(hatchData, hatchCallback);
            };

            userEggInventoryModel.updateQuantity(updatedInvData, updateInvCallback);
        };

        dinosaurModel.insertSingle(dinoData, dinoCallback);
    };

    userEggInventoryModel.selectSingle(invData, invCallback);
};

console.log("hatchEvent controller loaded");
