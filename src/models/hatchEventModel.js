const pool = require("../services/db");

module.exports.selectAll = (callback) => {

    const SQLSTATEMENT = `
        SELECT hatch_id, user_id, egg_type_id, dinosaur_id, hatched_on
        FROM HatchEvent;
    `;

    pool.query(SQLSTATEMENT, callback);
};


module.exports.selectByUserId = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT hatch_id, user_id, egg_type_id, dinosaur_id, hatched_on
        FROM HatchEvent
        WHERE user_id = ?;
    `;

    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


module.exports.insertSingle = (data, callback) => {

    const SQLSTATEMENT = `
        INSERT INTO HatchEvent (user_id, egg_type_id, dinosaur_id, hatched_on)
        VALUES (?, ?, ?, ?);
    `;

    const VALUES = [data.user_id, data.egg_type_id, data.dinosaur_id, data.hatched_on];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

