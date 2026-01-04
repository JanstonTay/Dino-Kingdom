const pool = require("../services/db");

module.exports.selectByUserAndEgg = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT quantity
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

module.exports.decrementEgg = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE UserEggInventory
        SET quantity = quantity - 1
        WHERE user_id = ? AND egg_type_id = ? AND quantity > 0;
    `;
    const VALUES = [data.user_id, data.egg_type_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.selectAllByUser = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT egg_type_id, quantity
        FROM UserEggInventory
        WHERE user_id = ?;
    `;
    const VALUES = [data.user_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};
