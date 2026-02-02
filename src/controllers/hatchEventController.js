const hatchEventModel = require("../models/hatchEventModel.js");
const userEggInventoryModel = require("../models/userEggInventoryModel.js");
const dinosaurModel = require("../models/dinosaurModel.js");
const eggTypeModel = require("../models/eggTypeModel.js");
const dinosaurDexModel = require("../models/dinosaurDexModel.js");


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


module.exports.readHatchEventsByUserId = (req, res) => {

    const data = {
        user_id: req.params.user_id
    };

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
// body: { "user_id": 1, "egg_type_id": 1 }
//
// Logic:
//  1) Check user has this egg in UserEggInventory (quantity > 0)
//  2) Look up egg rarity from EggType
//  3) Find all DinosaurDex with that rarity
//  4) Randomly choose one dex entry
//  5) Generate random height (0–2.5) and weight (0–250)
//  6) Create Dinosaur (level 1, xp 0)
//  7) Decrease egg quantity by 1
//  8) Insert HatchEvent log
// ##############################################################

module.exports.createHatchEvent = (req, res) => {

    const data = {
        user_id: req.body.user_id,
        egg_type_id: req.body.egg_type_id
    };

    if (data.user_id == null || data.egg_type_id == null) {
        return res.status(400).json({
            message: "Missing user_id or egg_type_id"
        });
    }

    // 1) Check egg inventory
    const invData = {
        user_id: data.user_id,
        egg_type_id: data.egg_type_id
    };

    const invCallback = (error, invResults) => {

        if (error) {
            console.error("Error selectSingle (createHatchEvent - inventory):", error);
            return res.status(500).json(error);
        }

        if (invResults.length === 0 || Number(invResults[0].quantity) <= 0) {
            return res.status(400).json({
                message: "User does not have this egg to hatch"
            });
        }

        const currentQty = Number(invResults[0].quantity);

        // 2) Look up egg rarity
        const eggData = { egg_type_id: data.egg_type_id };

        const eggCallback = (error2, eggResults) => {

            if (error2) {
                console.error("Error selectById (createHatchEvent - eggType):", error2);
                return res.status(500).json(error2);
            }

            if (eggResults.length === 0) {
                return res.status(400).json({
                    message: "Egg type not found"
                });
            }

            const eggRarity = eggResults[0].rarity;

            // 3) Find all dinos with this rarity
            const dexData = { rarity: eggRarity };

            const dexCallback = (error3, dexResults) => {

                if (error3) {
                    console.error("Error selectByRarity (createHatchEvent - dinosaurDex):", error3);
                    return res.status(500).json(error3);
                }

                if (dexResults.length === 0) {
                    return res.status(400).json({
                        message: "No dinosaurs available for this egg rarity"
                    });
                }

                // 4) Randomly choose one dex entry
                const randomIndex = Math.floor(Math.random() * dexResults.length);
                const chosenDex = dexResults[randomIndex];

                const chosenDexNum = chosenDex.number;

                // 5) Generate random height & weight (unless you want to allow override)
                const randomHeight = Number((Math.random() * 2.5).toFixed(2));   // 0–2.50
                const randomWeight = Number((Math.random() * 250).toFixed(2));   // 0–250.00

                // 6) Create dinosaur
                const dinoData = {
                    owner_id: data.user_id,
                    dex_num: chosenDexNum,
                    level: 1,
                    xp: 0,
                    height: randomHeight,
                    weight: randomWeight
                };

                const dinoCallback = (error4, dinoResults) => {

                    if (error4) {
                        console.error("Error insertSingle (createHatchEvent - dinosaur):", error4);
                        return res.status(500).json(error4);
                    }

                    const dinosaur_id = dinoResults.insertId;
                    const newQty = currentQty - 1;

                    // 7) Decrease egg quantity by 1
                    const updatedInvData = {
                        user_id: data.user_id,
                        egg_type_id: data.egg_type_id,
                        quantity: newQty
                    };

                    const updateInvCallback = (error5) => {

                        if (error5) {
                            console.error("Error updateQuantity (createHatchEvent - inventory):", error5);
                            return res.status(500).json(error5);
                        }

                        // 8) Insert hatch event log
                        const hatched_on = new Date();

                        const hatchData = {
                            user_id: data.user_id,
                            egg_type_id: data.egg_type_id,
                            dinosaur_id: dinosaur_id,
                            hatched_on: hatched_on
                        };

                        const hatchCallback = (error6, hatchResults) => {

                            if (error6) {
                                console.error("Error insertSingle (createHatchEvent - hatch):", error6);
                                return res.status(500).json(error6);
                            }

                            return res.status(201).json({
                                hatch_id: hatchResults.insertId,
                                user_id: data.user_id,
                                egg_type_id: data.egg_type_id,
                                dinosaur_id: dinosaur_id,
                                hatched_on: hatched_on,
                                dex_num: chosenDexNum,
                                name: chosenDex.name,
                                rarity: eggRarity,
                                diet: chosenDex.diet,
                                height: randomHeight,
                                weight: randomWeight
                            });
                        };

                        hatchEventModel.insertSingle(hatchData, hatchCallback);
                    };

                    userEggInventoryModel.updateQuantity(updatedInvData, updateInvCallback);
                };

                dinosaurModel.insertSingle(dinoData, dinoCallback);
            };

            dinosaurDexModel.selectByRarity(dexData, dexCallback);
        };

        eggTypeModel.selectById(eggData, eggCallback);
    };

    userEggInventoryModel.selectSingle(invData, invCallback);
};


console.log("hatchEvent controller loaded");

