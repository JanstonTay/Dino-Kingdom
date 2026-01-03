const pool = require("../services/db");

module.exports.selectAll = (callback) => {

    const SQLSTATEMENT = `
        SELECT * FROM FoodType;
    `;

    pool.query(SQLSTATEMENT, callback);
};


module.exports.selectById = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT * FROM FoodType
        WHERE food_type_id = ?;
    `;

    const VALUES = [data.food_type_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


module.exports.insertSingle = (data, callback) => {

    const SQLSTATEMENT = `
        INSERT INTO FoodType (name, diet, xp_gain, price_points)
        VALUES (?, ?, ?, ?);
    `;

    const VALUES = [data.name, data.diet, data.xp_gain, data.price_points];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


module.exports.updateById = (data, callback) => {

    const SQLSTATEMENT = `
        UPDATE FoodType
        SET name = ?, diet = ?, xp_gain = ?, price_points = ?
        WHERE food_type_id = ?;
    `;

    const VALUES = [data.name, data.diet, data.x_gain, data.price_points, data.food_type_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


module.exports.deleteById = (data, callback) => {

    const SQLSTATEMENT = `
        DELETE FROM FoodType
        WHERE food_type_id = ?;
    `;

    const VALUES = [data.food_type_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};
