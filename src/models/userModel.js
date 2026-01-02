const pool = require('../services/db');

module.exports.selectAll = (callback) => {

    const SQLSTATEMENT = `
        SELECT user_id, username, points FROM User;
    `;

    pool.query(SQLSTATEMENT, callback);
}


module.exports.selectByUserId = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT user_id, username, points FROM User
        WHERE user_id = ?;
    `;

    const VALUES = [data.user_id]

    pool.query(SQLSTATEMENT, VALUES, callback);
}


module.exports.insertSingle = (data, callback) => {

    const SQLSTATEMENT = `
        INSERT INTO User (username, points)
        VALUES (?, 0);
    `;

    const VALUES = [data.username];

    pool.query(SQLSTATEMENT, VALUES, callback);
}


module.exports.updateById = (data, callback) => {

    const SQLSTATEMENT = `
        UPDATE User
        SET username = ?, points = ?
        WHERE user_id = ?;
    `;

    const VALUES = [data.username, data.points, data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);

}
