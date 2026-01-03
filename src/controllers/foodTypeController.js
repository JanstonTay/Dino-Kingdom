const foodTypeModel = require("../models/foodTypeModel.js");

// GET /foodTypes
module.exports.readAllFoodTypes = (req, res) => {

    const callback = (error, results) => {
        if (error) {
            console.error("Error readAllFoodTypes:", error);
            return res.status(500).json(error);
        }

        return res.status(200).json(results);
    };

    foodTypeModel.selectAll(callback);
};


// GET /foodTypes/:food_type_id
module.exports.readFoodTypeById = (req, res) => {

    const data = { food_type_id: req.params.food_type_id };

    const callback = (error, results) => {
        if (error) {
            console.error("Error readFoodTypeById:", error);
            return res.status(500).json(error);
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Food type not found" });
        }

        return res.status(200).json(results[0]);
    };

    foodTypeModel.selectById(data, callback);
};


// POST /foodTypes
module.exports.createFoodType = (req, res) => {

    const data = {
        name: req.body.name,
        diet: req.body.diet,
        xp_gain: req.body.xp_gain,
        price_points: req.body.price_points
    };

    if (data.name == null || data.diet == null || data.xp_gain == null || data.price_points == null) {
        return res.status(400).json({
            message: "Missing name or diet or xp_gain or price_points"
        });
    }

    const callback = (error, results) => {
        if (error) {
            console.error("Error createFoodType:", error);
            return res.status(500).json(error);
        }

        const newId = results.insertId;

        return res.status(201).json({
            message: "Food type created",
            food_type_id: newId,
            name: data.name,
            diet: data.diet,
            xp_gain: data.xp_gain,
            price_points: data.price_points
        });
    };

    foodTypeModel.insertSingle(data, callback);
};


// PUT /foodTypes/:food_type_id
module.exports.updateFoodTypeById = (req, res) => {

    const data = {
        food_type_id: req.params.food_type_id,
        name: req.body.name,
        diet: req.body.diet,
        x_gain: req.body.xp_gain,
        price_points: req.body.price_points
    };

    if (data.name == null || data.diet == null || data.x_gain == null || data.price_points == null) {
        return res.status(400).json({
            message: "Missing name or diet or xp_gain or price_points"
        });
    }

    const callback = (error, results) => {
        if (error) {
            console.error("Error updateFoodTypeById:", error);
            return res.status(500).json(error);
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Food type not found" });
        }

        return res.status(200).json({
            message: "Food type updated",
            food_type_id: data.food_type_id,
            name: data.name,
            diet: data.diet,
            xp_gain: data.x_gain,
            price_points: data.price_points
        });
    };

    foodTypeModel.updateById(data, callback);
};


// DELETE /foodTypes/:food_type_id
module.exports.deleteFoodTypeById = (req, res) => {

    const data = { food_type_id: req.params.food_type_id };

    const callback = (error, results) => {
        if (error) {
            console.error("Error deleteFoodTypeById:", error);
            return res.status(500).json(error);
        }

        return res.status(204).send();
    };

    foodTypeModel.deleteById(data, callback);
};
