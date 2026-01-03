const dinosaurDexModel = require("../models/dinosaurDexModel.js");


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


module.exports.readDinosaurDexByNumber = (req, res) => {
    const data = { number: req.params.number };

    const callback = (error, results) => {
        if (error) {
            console.error("Error readDinosaurDexByNumber:", error);
            return res.status(500).json(error);
        }

        if (results.length === 0) {
            return res.status(404).send("Dex entry not found");
        }

        return res.status(200).json(results[0]);
    };

    dinosaurDexModel.selectByNumber(data, callback);
};


module.exports.createDinosaurDex = (req, res) => {

    const data = {
        number: req.body.number,
        name: req.body.name,
        diet: req.body.diet,
        rarity: req.body.rarity
    };

    if (data.number == null || data.name == null) {

        return res.status(400).json({
            message: "Missing number or name"
        });

    }

    const checkData = { 
        number: data.number 
    };

    const checkCallback = (error, results) => {

        if (error) {
            console.error("Error check existing DinosaurDex number:", error);
            return res.status(500).json(error);
        }

        if (results.length > 0) {
            return res.status(400).json({
                message: "Dex number already exists"
            });
        }

        const insertCallback = (error, results) => {

            if (error) {
                console.error("Error createDinosaurDex:", error);
                return res.status(500).json(error);
            }

            return res.status(201).json({
                message: "DinosaurDex entry created",
                number: data.number,
                name: data.name,
                diet: data.diet,
                rarity: data.rarity
            });
        };

        dinosaurDexModel.insertSingle(data, insertCallback);
    };

    dinosaurDexModel.selectByNumber(checkData, checkCallback);
};


module.exports.updateDinosaurDex = (req, res) => {

    const data = {
        old_number: req.params.number,
        new_number: req.body.number,
        name: req.body.name,
        diet: req.body.diet,
        rarity: req.body.rarity
    };

    if (data.new_number == null) {
        data.new_number = data.old_number;
    }

    if (data.name == null) {
        return res.status(400).json({
            message: "Missing name"
        });
    }

    const callback = (error, results) => {
        if (error) {
            console.error("Error updateDinosaurDex:", error);
            return res.status(500).json(error);
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({
                message: "Dex entry not found"
            });
        }

        return res.status(200).json({
            message: "DinosaurDex entry updated",
            number: data.new_number,
            name: data.name,
            diet: data.diet,
            rarity: data.rarity
        });
    };

    dinosaurDexModel.updateByNumber(data, callback);
};


module.exports.deleteDinosaurDex = (req, res) => {

    const data = { number: req.params.number };

    const callback = (error, results) => {
        if (error) {
            console.error("Error deleteDinosaurDex:", error);
            return res.status(500).json(error);
        }

        return res.status(204).send();
    };

    dinosaurDexModel.deleteByNumber(data, callback);
};
