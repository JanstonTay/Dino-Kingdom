const pool = require("../services/db");

module.exports.selectAll = (callback) => {

    const SQLSTATEMENT = `
        SELECT purchase_id, user_id, item_type, item_id, quantity, purchased_on
        FROM UserPurchase;
    `;

    pool.query(SQLSTATEMENT, callback);
};


module.exports.selectByUserId = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT purchase_id, user_id, item_type, item_id, quantity, purchased_on
        FROM UserPurchase
        WHERE user_id = ?;
    `;

    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


module.exports.insertSingle = (data, callback) => {

    const SQLSTATEMENT = `
        INSERT INTO UserPurchase (user_id, item_type, item_id, quantity, purchased_on)
        VALUES (?, ?, ?, ?, ?);
    `;

    const VALUES = [data.user_id, data.item_type, data.item_id, data.quantity, data.purchased_on];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

