const pool = require("../services/db");

module.exports.selectAll = (callback) => {

    const SQLSTATEMENT = `
        SELECT *
        FROM UserFoodInventory
        ORDER BY user_id, food_type_id;
    `;

    pool.query(SQLSTATEMENT, callback);
};

// ##############################################################
// SELECT INVENTORY BY USER (with food details)
// ##############################################################
module.exports.selectByUserId = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT 
ufi.user_id,
ufi.food_type_id,
ufi.quantity,
ft.name,
ft.diet,
ft.xp_gain,
ft.price_points
        FROM UserFoodInventory ufi
        JOIN FoodType ft
            ON ufi.food_type_id = ft.food_type_id
        WHERE ufi.user_id = ?;
    `;

    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

// ##############################################################
// CHECK IF A ROW EXISTS (user_id + food_type_id)
// ##############################################################
module.exports.selectSingle = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT *
        FROM UserFoodInventory
        WHERE user_id = ? AND food_type_id = ?;
    `;

    const VALUES = [data.user_id, data.food_type_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

// ##############################################################
// INSERT NEW INVENTORY ROW
// ##############################################################
module.exports.insertSingle = (data, callback) => {

    const SQLSTATEMENT = `
        INSERT INTO UserFoodInventory (user_id, food_type_id, quantity)
        VALUES (?, ?, ?);
    `;

    const VALUES = [data.user_id, data.food_type_id, data.quantity];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

// ##############################################################
// UPDATE QUANTITY
// ##############################################################
module.exports.updateQuantity = (data, callback) => {

    const SQLSTATEMENT = `
        UPDATE UserFoodInventory
        SET quantity = ?
        WHERE user_id = ? AND food_type_id = ?;
    `;

    const VALUES = [data.quantity, data.user_id, data.food_type_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

// ##############################################################
// DELETE ONE INVENTORY ROW
// ##############################################################
module.exports.deleteSingle = (data, callback) => {

    const SQLSTATEMENT = `
        DELETE FROM UserFoodInventory
        WHERE user_id = ? AND food_type_id = ?;
    `;

    const VALUES = [data.user_id, data.food_type_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};
