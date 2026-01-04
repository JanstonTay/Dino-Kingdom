const eggTypeModel = require("../models/eggTypeModel.js");

// ##############################################################
// GET /eggTypes
// ##############################################################
module.exports.readAllEggTypes = (req, res) => {

    const callback = (error, results) => {

        if (error) {
            console.error("Error readAllEggTypes:", error);
            return res.status(500).json(error);
        }

        return res.status(200).json(results);
    };

    eggTypeModel.selectAll(callback);
};


// ##############################################################
// GET /eggTypes/:egg_type_id
// ##############################################################
module.exports.readEggTypeById = (req, res) => {

    const data = { egg_type_id: req.params.egg_type_id };

    const callback = (error, results) => {

        if (error) {
            console.error("Error readEggTypeById:", error);
            return res.status(500).json(error);
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Egg type not found" });
        }

        return res.status(200).json(results[0]);
    };

    eggTypeModel.selectById(data, callback);
};


// ##############################################################
// POST /eggTypes
// body: { "name": "...", "rarity": "...", "price_points": 100 }
// ##############################################################
module.exports.createEggType = (req, res) => {

    const data = {
        name: req.body.name,
        rarity: req.body.rarity,
        price_points: req.body.price_points
    };

    if (data.name == null || data.rarity == null || data.price_points == null) {
        return res.status(400).json({
            message: "Missing name or rarity or price_points"
        });
    }

    const checkData = { name: data.name };

    const checkCallback = (error, results) => {

        if (error) {
            console.error("Error selectByName (createEggType):", error);
            return res.status(500).json(error);
        }

        if (results.length > 0) {
            return res.status(400).json({
                message: "Egg type name already exists"
            });
        }

        const insertCallback = (error2, results2) => {

            if (error2) {
                console.error("Error insertSingle (createEggType):", error2);
                return res.status(500).json(error2);
            }

            return res.status(201).json({
                egg_type_id: results2.insertId,
                name: data.name,
                rarity: data.rarity,
                price_points: data.price_points
            });
        };

        eggTypeModel.insertSingle(data, insertCallback);
    };

    eggTypeModel.selectByName(checkData, checkCallback);
};


// ##############################################################
// PUT /eggTypes/:egg_type_id
// ##############################################################
module.exports.updateEggTypeById = (req, res) => {

    const data = {
        egg_type_id: req.params.egg_type_id,
        name: req.body.name,
        rarity: req.body.rarity,
        price_points: req.body.price_points
    };

    if (data.name == null || data.rarity == null || data.price_points == null) {
        return res.status(400).json({
            message: "Missing name or rarity or price_points"
        });
    }

    const callback = (error, results) => {

        if (error) {
            console.error("Error updateEggTypeById:", error);
            return res.status(500).json(error);
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Egg type not found" });
        }

        return res.status(200).json({
            egg_type_id: Number(data.egg_type_id),
            name: data.name,
            rarity: data.rarity,
            price_points: data.price_points
        });
    };

    eggTypeModel.updateById(data, callback);
};


// ##############################################################
// DELETE /eggTypes/:egg_type_id
// ##############################################################
module.exports.deleteEggTypeById = (req, res) => {

    const data = { egg_type_id: req.params.egg_type_id };

    const callback = (error, results) => {

        if (error) {
            console.error("Error deleteEggTypeById:", error);
            return res.status(500).json(error);
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Egg type not found" });
        }

        return res.status(204).send();
    };

    eggTypeModel.deleteById(data, callback);
};

console.log("eggType controller loaded");
