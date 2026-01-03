const pool = require("../services/db");

module.exports.selectAll = (callback) => {

    const SQLSTATEMENT = `
        SELECT *
        FROM UserFoodInventory
        ORDER BY user_id, food_type_id;
    `;

    pool.query(SQLSTATEMENT, callback);
};


module.exports.selectSingle = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT *
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
