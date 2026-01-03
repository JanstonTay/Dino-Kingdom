const dinosaurModel = require("../models/dinosaurModel.js");
const dinosaurDexModel = require("../models/dinosaurDexModel.js");


module.exports.readAllDinosaurs = (req, res) => {

    const callback = (error, results) => {

        if (error) {
            console.error("Error readAllDinosaurs:", error);
            return res.status(500).json(error);
        }

        return res.status(200).json(results);
    };

    dinosaurModel.selectAll(callback);
};


module.exports.createDinosaur = (req, res) => {

    const dinosaurData = {
        owner_id: req.body.owner_id,
        dex_num: req.body.dex_num,
        height: req.body.height,
        weight: req.body.weight
    };

    if (dinosaurData.owner_id == null || dinosaurData.dex_num == null) {

        return res.status(400).json({
            message: "Missing owner_id or dex_num"
        });

    }

    const data = {
        owner_id: dinosaurData.owner_id,
        dex_num: dinosaurData.dex_num,
        level: 1,
        xp: 0,
        height: dinosaurData.height,
        weight: dinosaurData.weight
    };

    const callback = (error, results) => {

        if (error) {
            console.error("Error createDinosaur:", error);
            return res.status(500).json(error);

        }

        const newId = results.insertId;

        return res.status(201).json({
            message: "Dinosaur created",
            dinosaur_id: newId,
            owner_id: data.owner_id,
            dex_num: data.dex_num,
            level: data.level,
            xp: data.xp,
            height: data.height,
            weight: data.weight
        });
    };

    dinosaurModel.insertSingle(data, callback);
};


module.exports.readDinosaurById = (req, res) => {

    const data = { 
        id: req.params.id 
    };

    const callback = (error, results) => {

        if (error) {
            console.error("Error readDinosaurById:", error);
            return res.status(500).json(error);
        }

        if (results.length === 0) {
            return res.status(404).send("Dinosaur not found");
        }

        return res.status(200).json(results[0]);
    };

    dinosaurModel.selectById(data, callback);
};


module.exports.readDinosaurByIdWithDexInfo = (req, res) => {

    const data = { 
        id: req.params.id 
    };

    const dinoCallback = (error, results) => {
        
        if (error) {
            console.error("Error readDinosaurByIdWithDexInfo (dino):", error);
            return res.status(500).json(error);
        }

        if (results.length === 0) {
            return res.status(404).send("Dinosaur not found");
        }

        const dinosaur = results[0];
        const dexData = { number: dinosaur.dex_num };

        const dexCallback = (error2, dexResults) => {
            if (error2) {
                console.error("Error readDinosaurByIdWithDexInfo (dex):", error2);
                return res.status(500).json(error2);
            }

            const dexInfo = dexResults[0] || null;

            const combined = {
                id: dinosaur.id,
                owner_id: dinosaur.owner_id,
                dex_num: dinosaur.dex_num,
                level: dinosaur.level,
                xp: dinosaur.xp,
                height: dinosaur.height,
                weight: dinosaur.weight,
                dexInfo: dexInfo || "No additional dex info available"
            };

            return res.status(200).json(combined);
        };

        dinosaurDexModel.selectByNumber(dexData, dexCallback);
    };

    dinosaurModel.selectById(data, dinoCallback);
};
