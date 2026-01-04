const dinosaurDexModel = require("../models/dinosaurDexModel.js");


// ##############################################################
// READ ALL DEX ENTRIES
// ##############################################################
module.exports.readAllDinosaurDex = (req, res) => {

    const callback = (error, results) => {

        if (error) {
            console.error("Error readAllDinosaurDex:", error);
            return res.status(500).json(error);
        }

        return res.status(200).json(results);
    };

    dinosaurDexModel.selectAll(callback);
};


// ##############################################################
// READ DEX ENTRY BY NUMBER
// ##############################################################
module.exports.readDinosaurDexByNumber = (req, res) => {

    const data = {
        number: req.params.number
    };

    const callback = (error, results) => {

        if (error) {
            console.error("Error readDinosaurDexByNumber:", error);
            return res.status(500).json(error);
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "DinosaurDex entry not found"
            });
        }

        return res.status(200).json(results[0]);
    };

    dinosaurDexModel.selectByNumber(data, callback);
};


// ##############################################################
// CREATE DEX ENTRY (POST)
// ##############################################################
module.exports.createDinosaurDex = (req, res) => {

    const data = {
        number: req.body.number,
        name: req.body.name,
        diet: req.body.diet,
        rarity: req.body.rarity
    };

    if (data.number == null || !data.name || !data.diet || !data.rarity) {

        return res.status(400).json({
            message: "Missing number or name or diet or rarity"
        });
    }

    const checkData = {
        name: data.name
    };

    const checkCallback = (error, results) => {

        if (error) {
            console.error("Error selectByName (createDinosaurDex):", error);
            return res.status(500).json(error);
        }

        // If a dino with this name already exists, reject
        if (results.length > 0) {
            return res.status(409).json({
                message: "Dinosaur already exists in Dex"
            });
        }

        const insertCallback = (error2, results2) => {

            if (error2) {

                // Extra safety if you later make name or number UNIQUE
                if (error2.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({
                        message: "Dinosaur already exists in Dex"
                    });
                }

                console.error("Error createDinosaurDex:", error2);
                return res.status(500).json(error2);
            }

            return res.status(201).json({
                number: data.number,
                name: data.name,
                diet: data.diet,
                rarity: data.rarity
            });
        };

        dinosaurDexModel.insertSingle(data, insertCallback);
    };

    dinosaurDexModel.selectByName(checkData, checkCallback);
};


// ##############################################################
// UPDATE DEX ENTRY (PUT)
// ##############################################################
module.exports.updateDinosaurDexByNumber = (req, res) => {

    const data = {
        number: req.params.number,
        name: req.body.name,
        diet: req.body.diet,
        rarity: req.body.rarity
    };

    if (!data.name || !data.diet || !data.rarity) {

        return res.status(400).json({
            message: "Missing name or diet or rarity"
        });
    }

    const callback = (error, results) => {

        if (error) {

            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    message: "Dinosaur already exists in Dex"
                });
            }

            console.error("Error updateDinosaurDexByNumber:", error);
            return res.status(500).json(error);
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({
                message: "DinosaurDex entry not found"
            });
        }

        return res.status(200).json({
            message: "DinosaurDex entry updated",
            number: Number(data.number),
            name: data.name,
            diet: data.diet,
            rarity: data.rarity
        });
    };

    dinosaurDexModel.updateByNumber(data, callback);
};


// ##############################################################
// DELETE DEX ENTRY (DELETE)
// ##############################################################
module.exports.deleteDinosaurDexByNumber = (req, res) => {

    const data = {
        number: req.params.number
    };

    const callback = (error, results) => {

        if (error) {
            console.error("Error deleteDinosaurDexByNumber:", error);
            return res.status(500).json(error);
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({
                message: "DinosaurDex entry not found"
            });
        }

        return res.status(204).send();
    };

    dinosaurDexModel.deleteByNumber(data, callback);
};

console.log("dinosaurDex controller loaded");
