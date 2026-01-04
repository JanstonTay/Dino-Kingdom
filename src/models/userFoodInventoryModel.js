const pool = require("../services/db");

// SELECT all rows
module.exports.selectAll = (callback) => {

    const SQLSTATEMENT = `
        SELECT user_id, food_type_id, quantity
        FROM UserFoodInventory;
    `;

    pool.query(SQLSTATEMENT, callback);
};


// SELECT all food for one user
module.exports.selectByUserId = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT user_id, food_type_id, quantity
        FROM UserFoodInventory
        WHERE user_id = ?;
    `;

    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


// SELECT one specific row (user + food_type)
module.exports.selectSingle = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT user_id, food_type_id, quantity
        FROM UserFoodInventory
        WHERE user_id = ? AND food_type_id = ?;
    `;

    const VALUES = [data.user_id, data.food_type_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


// INSERT new row
module.exports.insertSingle = (data, callback) => {

    const SQLSTATEMENT = `
        INSERT INTO UserFoodInventory (user_id, food_type_id, quantity)
        VALUES (?, ?, ?);
    `;

    const VALUES = [data.user_id, data.food_type_id, data.quantity];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


// UPDATE quantity (set to exact value)
module.exports.updateQuantity = (data, callback) => {

    const SQLSTATEMENT = `
        UPDATE UserFoodInventory
        SET quantity = ?
        WHERE user_id = ? AND food_type_id = ?;
    `;

    const VALUES = [data.quantity, data.user_id, data.food_type_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


// DELETE one row
module.exports.deleteSingle = (data, callback) => {

    const SQLSTATEMENT = `
        DELETE FROM UserFoodInventory
        WHERE user_id = ? AND food_type_id = ?;
    `;

    const VALUES = [data.user_id, data.food_type_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};
