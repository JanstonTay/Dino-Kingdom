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
// CREATE HATCH EVENT MIDDLEWARE
// ##############################################################

// 1. Validate Request
module.exports.validateHatchRequest = (req, res, next) => {
    const data = {
        user_id: req.body.user_id,
        egg_type_id: req.body.egg_type_id
    };

    if (data.user_id == null || data.egg_type_id == null) {
        return res.status(400).json({
            message: "Missing user_id or egg_type_id"
        });
    }

    res.locals.hatchData = data;
    next();
};

// 2. Check Egg Inventory
module.exports.checkEggInventory = (req, res, next) => {
    const { user_id, egg_type_id } = res.locals.hatchData;
    const invData = { user_id, egg_type_id };

    userEggInventoryModel.selectSingle(invData, (error, invResults) => {
        if (error) {
            console.error("Error selectSingle (createHatchEvent - inventory):", error);
            return res.status(500).json(error);
        }

        if (invResults.length === 0 || Number(invResults[0].quantity) <= 0) {
            return res.status(400).json({
                message: "User does not have this egg to hatch"
            });
        }

        res.locals.currentEggQty = Number(invResults[0].quantity);
        next();
    });
};

// 3. Look up Egg Rarity
module.exports.lookUpEggRarity = (req, res, next) => {
    const { egg_type_id } = res.locals.hatchData;
    const eggData = { egg_type_id };

    eggTypeModel.selectById(eggData, (error, eggResults) => {
        if (error) {
            console.error("Error selectById (createHatchEvent - eggType):", error);
            return res.status(500).json(error);
        }

        if (eggResults.length === 0) {
            return res.status(400).json({
                message: "Egg type not found"
            });
        }

        res.locals.eggRarity = eggResults[0].rarity;
        next();
    });
};

// 4. Choose Dinosaur from Dex
module.exports.chooseDinosaurFromDex = (req, res, next) => {
    const { eggRarity } = res.locals;
    const dexData = { rarity: eggRarity };

    dinosaurDexModel.selectByRarity(dexData, (error, dexResults) => {
        if (error) {
            console.error("Error selectByRarity (createHatchEvent - dinosaurDex):", error);
            return res.status(500).json(error);
        }

        if (dexResults.length === 0) {
            return res.status(400).json({
                message: "No dinosaurs available for this egg rarity"
            });
        }

        const randomIndex = Math.floor(Math.random() * dexResults.length);
        const chosenDex = dexResults[randomIndex];
        const chosenDexNum = chosenDex.number;
        
        // Generate random stats
        const randomHeight = Number((Math.random() * 2.5).toFixed(2));
        const randomWeight = Number((Math.random() * 250).toFixed(2));

        res.locals.chosenDexNum = chosenDexNum;
        res.locals.randomHeight = randomHeight;
        res.locals.randomWeight = randomWeight;
        next();
    });
};

// 5. Hatch Dinosaur (Create Dino Instance)
module.exports.hatchDinosaur = (req, res, next) => {
    const { user_id } = res.locals.hatchData;
    const { chosenDexNum, randomHeight, randomWeight } = res.locals;

    const dinoData = {
        owner_id: user_id,
        dex_num: chosenDexNum,
        level: 1,
        xp: 0,
        height: randomHeight,
        weight: randomWeight
    };

    dinosaurModel.insertSingle(dinoData, (error, dinoResults) => {
        if (error) {
            console.error("Error insertSingle (createHatchEvent - dinosaur):", error);
            return res.status(500).json(error);
        }

        res.locals.newDinosaurId = dinoResults.insertId;
        next();
    });
};

// 6. Decrement Egg Inventory
module.exports.decrementEggInventory = (req, res, next) => {
    const { user_id, egg_type_id } = res.locals.hatchData;
    const { currentEggQty } = res.locals;

    const newQty = currentEggQty - 1;
    const updatedInvData = {
        user_id,
        egg_type_id,
        quantity: newQty
    };

    userEggInventoryModel.updateQuantity(updatedInvData, (error) => {
        if (error) {
            console.error("Error updateQuantity (createHatchEvent - inventory):", error);
            return res.status(500).json(error);
        }
        next();
    });
};

// 7. Log Hatch Event and Respond
module.exports.logHatchEvent = (req, res) => {
    const { user_id, egg_type_id } = res.locals.hatchData;
    const { newDinosaurId, chosenDexNum, eggRarity, randomHeight, randomWeight } = res.locals;
    const hatched_on = new Date();

    const hatchData = {
        user_id,
        egg_type_id,
        dinosaur_id: newDinosaurId,
        hatched_on
    };

    hatchEventModel.insertSingle(hatchData, (error, hatchResults) => {
        if (error) {
            console.error("Error insertSingle (createHatchEvent - hatch):", error);
            return res.status(500).json(error);
        }

        return res.status(201).json({
            hatch_id: hatchResults.insertId,
            user_id,
            egg_type_id,
            dinosaur_id: newDinosaurId,
            hatched_on,
            dex_num: chosenDexNum,
            rarity: eggRarity,
            height: randomHeight,
            weight: randomWeight
        });
    });
};

console.log("hatchEvent controller loaded");
