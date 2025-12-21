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

module.exports.insertSingle = (data, callback) {

}

module.exports.updateById = (data, callback) {
    
}