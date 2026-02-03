const pool = require('../services/db');

module.exports.selectAll = (callback) => {

    const SQLSTATEMENT = `
        SELECT user_id, username, email, points FROM User;
    `;

    pool.query(SQLSTATEMENT, callback);
}


module.exports.selectByUserId = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT user_id, username, email, points FROM User
        WHERE user_id = ?;
    `;

    const VALUES = [data.user_id]

    pool.query(SQLSTATEMENT, VALUES, callback);
}


module.exports.selectByUsername = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT user_id, username, email, points FROM User
        WHERE username = ?;
    `;

    const VALUES = [data.username];

    pool.query(SQLSTATEMENT, VALUES, callback);
}


module.exports.selectByEmail = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT user_id, username, email, password, points FROM User
        WHERE email = ?;
    `;

    const VALUES = [data.email];

    pool.query(SQLSTATEMENT, VALUES, callback);
}


module.exports.insertSingle = (data, callback) => {

    const SQLSTATEMENT = `
        INSERT INTO User (username, email, password, points)
        VALUES (?, ?, ?, 0);
    `;

    const VALUES = [data.username, data.email, data.password];

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

module.exports.selectByUsernameOrEmail = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT user_id, username, email, password, points FROM User
        WHERE username = ? OR email = ?;
    `;

    const VALUES = [data.username, data.email];

    pool.query(SQLSTATEMENT, VALUES, callback);
}
