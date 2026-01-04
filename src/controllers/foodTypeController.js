const foodTypeModel = require("../models/foodTypeModel.js");


// ##############################################################
// READ ALL FOOD TYPES
// ##############################################################
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


// ##############################################################
// READ FOOD TYPE BY ID
// ##############################################################
module.exports.readFoodTypeById = (req, res) => {

    const data = {
        food_type_id: req.params.food_type_id
    };

    const callback = (error, results) => {

        if (error) {
            console.error("Error readFoodTypeById:", error);
            return res.status(500).json(error);
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Food type not found"
            });
        }

        return res.status(200).json(results[0]);
    };

    foodTypeModel.selectById(data, callback);
};


// ##############################################################
// CREATE FOOD TYPE (POST)
// ##############################################################
module.exports.createFoodType = (req, res) => {

    const data = {
        name: req.body.name,
        diet: req.body.diet,
        xp_gain: req.body.xp_gain,
        price_points: req.body.price_points
    };

    if (!data.name || !data.diet || data.xp_gain == null || data.price_points == null) {

        return res.status(400).json({
            message: "Missing name or diet or xp_gain or price_points"
        });
    }

    const checkData = {
        name: data.name
    };

    const checkCallback = (error, results) => {

        if (error) {
            console.error("Error selectByName (createFoodType):", error);
            return res.status(500).json(error);
        }

        // If a food with this name already exists, reject
        if (results.length > 0) {
            return res.status(409).json({
                message: "Food type already exists"
            });
        }

        const insertCallback = (error2, results2) => {

            if (error2) {

                // Extra safety in case DB has UNIQUE(name)
                if (error2.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({
                        message: "Food type already exists"
                    });
                }

                console.error("Error createFoodType:", error2);
                return res.status(500).json(error2);
            }

            return res.status(201).json({
                food_type_id: results2.insertId,
                name: data.name,
                diet: data.diet,
                xp_gain: data.xp_gain,
                price_points: data.price_points
            });
        };

        foodTypeModel.insertSingle(data, insertCallback);
    };

    foodTypeModel.selectByName(checkData, checkCallback);
};


// ##############################################################
// UPDATE FOOD TYPE (PUT)
// ##############################################################
module.exports.updateFoodTypeById = (req, res) => {

    const data = {
        food_type_id: req.params.food_type_id,
        name: req.body.name,
        diet: req.body.diet,
        xp_gain: req.body.xp_gain,
        price_points: req.body.price_points
    };

    if (!data.name || !data.diet || data.xp_gain == null || data.price_points == null) {

        return res.status(400).json({
            message: "Missing name or diet or xp_gain or price_points"
        });
    }

    const callback = (error, results) => {

        if (error) {

            if (error.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    message: "Food type already exists"
                });
            }

            console.error("Error updateFoodTypeById:", error);
            return res.status(500).json(error);
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({
                message: "Food type not found"
            });
        }

        return res.status(200).json({
            message: "Food type updated",
            food_type_id: Number(data.food_type_id),
            name: data.name,
            diet: data.diet,
            xp_gain: data.xp_gain,
            price_points: data.price_points
        });
    };

    foodTypeModel.updateById(data, callback);
};


// ##############################################################
// DELETE FOOD TYPE (DELETE)
// ##############################################################
module.exports.deleteFoodTypeById = (req, res) => {

    const data = {
        food_type_id: req.params.food_type_id
    };

    const callback = (error, results) => {

        if (error) {
            console.error("Error deleteFoodTypeById:", error);
            return res.status(500).json(error);
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({
                message: "Food type not found"
            });
        }

        return res.status(204).send();
    };

    foodTypeModel.deleteById(data, callback);
};

console.log("foodType controller loaded");
