const dinosaurDexModel = require("../models/dinosaurDexModel.js");

module.exports.readAllDinosaurDex = (req, res) => {

    const callback = (error, results) => {

        if (error) {
            console.error("readAllDinosaurDex error:", error);
            return res.status(500).json(error);
        }

        return res.status(200).json(results);
    };

    dinosaurDexModel.selectAll(callback);
};


module.exports.readDinosaurDexByNumber = (req, res) => {

    const data = {
        number: req.params.number
    };

    const callback = (error, results) => {

        if (error) {
            console.error("readDinosaurDexByNumber error:", error);
            return res.status(500).json(error);
        }

        if (results.length == 0) {
            return res.status(404).json({
                message: "DinosaurDex not found"
            });
        }

        return res.status(200).json(results[0]);
    }

    dinosaurDexModel.selectByNumber(data, callback);
};


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
        })
        
    }

    const checkData = {
        name: data.name
    };

    const checkCallback = (error, results) => {

        if (error) {
            console.error("selectByName error:", error);
            return res.status(500).json(error);
        }

        if (results.length > 0) {
            return res.status(409).json({
                message: "Dinosaur already exist"
            });
        }

        const insertCallback = (error, results) => {

            if (error) {

                if (error.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({
                        message: "Dinosaur already exists"
                    });
                }

                console.error("createDinosaurDex error:", error);
                return res.status(500).json(error);
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
                    message: "Dinosaur already exist"
                });
            }

            console.error("updateDinosaurDexByNumber error:", error);
            return res.status(500).json(error);
        }

        if (results.affectedRows == 0) {
            return res.status(404).json({
                message: "DinosaurDex not found"
            });
        }

        return res.status(200).json({
            message: "DinosaurDex updated",
            number: Number(data.number),
            name: data.name,
            diet: data.diet,
            rarity: data.rarity
        });
    };

    dinosaurDexModel.updateByNumber(data, callback);
};


module.exports.deleteDinosaurDexByNumber = (req, res) => {

    const data = {
        number: req.params.number
    };

    const callback = (error, results) => {

        if (error) {
            console.error("deleteDinosaurDexByNumber error:", error);
            return res.status(500).json(error);
        }

        if (results.affectedRows == 0) {
            return res.status(404).json({
                message: "DinosaurDex not found"
            });
        }

        return res.status(204).send();
    };

    dinosaurDexModel.deleteByNumber(data, callback);
};

console.log("dinosaurDex controller loaded");

