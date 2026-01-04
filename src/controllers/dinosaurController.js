const dinosaurModel = require("../models/dinosaurModel.js");
const dinosaurDexModel = require("../models/dinosaurDexModel.js");

module.exports.readAllDinosaurs = (req, res) => {

    const callback = (error, results) => {

        if (error) {
            console.error("readAllDinosaurs error:", error);
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
            console.error("createDinosaur error:", error);
            return res.status(500).json(error);
        }

        const newId = results.insertId;

        return res.status(201).json({
            message: "Dinosaur created",
            
            id: newId,
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
            console.error("readDinosaurById error:", error);
            return res.status(500).json(error);
        }

        if (results.length == 0) {
            return res.status(404).send("Dinosaur not found");
        }

        return res.status(200).json(results[0]);
    };

    dinosaurModel.selectById(data, callback);
};


module.exports.readDinosaurByIdWithDexInfo = (req, res) => {

    const data = { 
        id: req.params.id 
    }

    const dinoCallback = (error, results) => {

        if (error) {
            console.error("readDinosaurByIdWithDexInfo error:", error);
            return res.status(500).json(error);
        }

        if (results.length == 0) {
            return res.status(404).send("Dinosaur not found");
        }

        const dinosaur = results[0];

        const dexData = { 
            number: dinosaur.dex_num 
        }

        const dexCallback = (error, dexResults) => {

            if (error) {
                console.error("readDinosaurByIdWithDexInfo error:", error);
                return res.status(500).json(error);
            }

            let combined;

            if (dexResults.length == 0) {

                combined = {
                    id: dinosaur.id,
                    owner_id: dinosaur.owner_id,
                    dex_num: dinosaur.dex_num,
                    level: dinosaur.level,
                    xp: dinosaur.xp,
                    height: dinosaur.height,
                    weight: dinosaur.weight,
                    dexInfo: "No additional dex info available"
                };

            } 
            else {

                const dexInfo = dexResults[0];

                combined = {
                    id: dinosaur.id,
                    owner_id: dinosaur.owner_id,
                    dex_num: dinosaur.dex_num,
                    level: dinosaur.level,
                    xp: dinosaur.xp,
                    height: dinosaur.height,
                    weight: dinosaur.weight,

                    dexInfo: {
                        number: dexInfo.number,
                        name: dexInfo.name,
                        diet: dexInfo.diet,
                        rarity: dexInfo.rarity
                    }
                };
            }

            return res.status(200).json(combined);
        };

        dinosaurDexModel.selectByNumber(dexData, dexCallback);
    };

    dinosaurModel.selectById(data, dinoCallback);
};



module.exports.updateDinosaurById = (req, res) => {

    const id = req.params.id;

    // What client is trying to update (can be partial)
    const incoming = {
        owner_id: req.body.owner_id,
        dex_num: req.body.dex_num,
        level: req.body.level,
        xp: req.body.xp,
        height: req.body.height,
        weight: req.body.weight
    };

    // If nothing is provided
    if (
        incoming.owner_id == null &&
        incoming.dex_num == null &&
        incoming.level == null &&
        incoming.xp == null &&
        incoming.height == null &&
        incoming.weight == null
    ) {
        return res.status(400).json({
            message: "No fields provided to update"
        });
    }

    const findCallback = (error, results) => {

        if (error) {
            console.error("updateDinosaurById error:", error);
            return res.status(500).json(error);
        }

        if (results.length == 0) {
            return res.status(404).json({ 
                message: "Dinosaur not found" 
            });
        }

        const current = results[0];


        const dataToUpdate = {

            id: current.id,

            owner_id: (incoming.owner_id != null) ? incoming.owner_id : current.owner_id,

            dex_num: (incoming.dex_num != null) ? incoming.dex_num : current.dex_num,

            level: (incoming.level != null) ? incoming.level : current.level,

            xp: (incoming.xp != null) ? incoming.xp : current.xp,

            height: (incoming.height != null) ? incoming.height : current.height,

            weight: (incoming.weight != null) ? incoming.weight : current.weight

        };


        const updateCallback = (error, results) => {

            if (error) {
                console.error("updateDinosaurById error:", error);
                return res.status(500).json(error);
            }

            if (results.affectedRows == 0) {
                return res.status(404).json({ 
                    message: "Dinosaur not found" 
                });
            }

            return res.status(200).json({
                message: "Dinosaur updated",

                id: dataToUpdate.id,
                owner_id: dataToUpdate.owner_id,
                dex_num: dataToUpdate.dex_num,
                level: dataToUpdate.level,
                xp: dataToUpdate.xp,
                height: dataToUpdate.height,
                weight: dataToUpdate.weight
            });
        };

        dinosaurModel.updateById(dataToUpdate, updateCallback);
    };

    dinosaurModel.selectById({ id: id }, findCallback);
};


module.exports.deleteDinosaurById = (req, res) => {

    const data = { 
        id: req.params.id 
    }

    const callback = (error, results) => {

        if (error) {
            console.error("deleteDinosaurById error:", error);
            return res.status(500).json(error);
        }

        if (results.affectedRows == 0) {
            return res.status(404).json({ 
                message: "Dinosaur not found" 
            });
        }

        return res.status(204).send();
    };

    dinosaurModel.deleteById(data, callback);
};

console.log("dinosaur controller loaded");
