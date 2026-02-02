const pool = require("../services/db");

module.exports.selectAll = (callback) => {

    const SQLSTATEMENT = `
        SELECT user_id, egg_type_id, quantity
        FROM UserEggInventory;
    `;

    pool.query(SQLSTATEMENT, callback);
};


module.exports.selectByUserId = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT u.user_id, u.egg_type_id, u.quantity, e.name, e.rarity
        FROM UserEggInventory u
        JOIN EggType e ON u.egg_type_id = e.egg_type_id
        WHERE u.user_id = ?;
    `;

    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


module.exports.selectSingle = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT user_id, egg_type_id, quantity
        FROM UserEggInventory
        WHERE user_id = ? AND egg_type_id = ?;
    `;

    const VALUES = [data.user_id, data.egg_type_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


module.exports.insertSingle = (data, callback) => {

    const SQLSTATEMENT = `
        INSERT INTO UserEggInventory (user_id, egg_type_id, quantity)
        VALUES (?, ?, ?);
    `;

    const VALUES = [data.user_id, data.egg_type_id, data.quantity];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


module.exports.updateQuantity = (data, callback) => {

    const SQLSTATEMENT = `
        UPDATE UserEggInventory
        SET quantity = ?
        WHERE user_id = ? AND egg_type_id = ?;
    `;

    const VALUES = [data.quantity, data.user_id, data.egg_type_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


module.exports.deleteSingle = (data, callback) => {

    const SQLSTATEMENT = `
        DELETE FROM UserEggInventory
        WHERE user_id = ? AND egg_type_id = ?;
    `;

    const VALUES = [data.user_id, data.egg_type_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};
