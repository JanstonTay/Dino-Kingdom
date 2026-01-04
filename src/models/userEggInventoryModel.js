const pool = require("../services/db");

// SELECT all rows
module.exports.selectAll = (callback) => {

    const SQLSTATEMENT = `
        SELECT user_id, egg_type_id, quantity
        FROM UserEggInventory;
    `;

    pool.query(SQLSTATEMENT, callback);
};


// SELECT all eggs for one user
module.exports.selectByUserId = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT user_id, egg_type_id, quantity
        FROM UserEggInventory
        WHERE user_id = ?;
    `;

    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


// SELECT one row (user + egg_type)
module.exports.selectSingle = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT user_id, egg_type_id, quantity
        FROM UserEggInventory
        WHERE user_id = ? AND egg_type_id = ?;
    `;

    const VALUES = [data.user_id, data.egg_type_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


// INSERT one row
module.exports.insertSingle = (data, callback) => {

    const SQLSTATEMENT = `
        INSERT INTO UserEggInventory (user_id, egg_type_id, quantity)
        VALUES (?, ?, ?);
    `;

    const VALUES = [data.user_id, data.egg_type_id, data.quantity];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


// UPDATE quantity (set exact value)
module.exports.updateQuantity = (data, callback) => {

    const SQLSTATEMENT = `
        UPDATE UserEggInventory
        SET quantity = ?
        WHERE user_id = ? AND egg_type_id = ?;
    `;

    const VALUES = [data.quantity, data.user_id, data.egg_type_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


// DELETE one row
module.exports.deleteSingle = (data, callback) => {

    const SQLSTATEMENT = `
        DELETE FROM UserEggInventory
        WHERE user_id = ? AND egg_type_id = ?;
    `;

    const VALUES = [data.user_id, data.egg_type_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};
