const pool = require("../services/db");

module.exports.selectAll = (callback) => {

    const SQLSTATEMENT = `
        SELECT user_id, food_type_id, quantity
        FROM UserFoodInventory;
    `;

    pool.query(SQLSTATEMENT, callback);
};


module.exports.selectByUserId = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT u.user_id, u.food_type_id, u.quantity, f.name, f.diet, f.xp_gain
        FROM UserFoodInventory u
        JOIN FoodType f ON u.food_type_id = f.food_type_id
        WHERE u.user_id = ?;
    `;

    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


module.exports.selectSingle = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT user_id, food_type_id, quantity
        FROM UserFoodInventory
        WHERE user_id = ? AND food_type_id = ?;
    `;

    const VALUES = [data.user_id, data.food_type_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


module.exports.insertSingle = (data, callback) => {

    const SQLSTATEMENT = `
        INSERT INTO UserFoodInventory (user_id, food_type_id, quantity)
        VALUES (?, ?, ?);
    `;

    const VALUES = [data.user_id, data.food_type_id, data.quantity];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


module.exports.updateQuantity = (data, callback) => {

    const SQLSTATEMENT = `
        UPDATE UserFoodInventory
        SET quantity = ?
        WHERE user_id = ? AND food_type_id = ?;
    `;

    const VALUES = [data.quantity, data.user_id, data.food_type_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


module.exports.deleteSingle = (data, callback) => {

    const SQLSTATEMENT = `
        DELETE FROM UserFoodInventory
        WHERE user_id = ? AND food_type_id = ?;
    `;

    const VALUES = [data.user_id, data.food_type_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};
