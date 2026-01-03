const pool = require('../services/db');


module.exports.selectAll = (callback) => {

    const SQLSTATEMENT = `
        SELECT * FROM DinosaurDex;
    `;

    pool.query(SQLSTATEMENT, callback);
};


module.exports.selectByNumber = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT * FROM DinosaurDex
        WHERE number = ?;
    `;

    const VALUES = [data.number];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


module.exports.insertSingle = (data, callback) => {

    const SQLSTATEMENT = `
        INSERT INTO DinosaurDex (number, name, diet, rarity)
        VALUES (?, ?, ?, ?);
    `;

    const VALUES = [data.number, data.name, data.diet, data.rarity];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


module.exports.updateByNumber = (data, callback) => {

    const SQLSTATEMENT = `
        UPDATE DinosaurDex
        SET number = ?, name = ?, diet = ?, rarity = ?
        WHERE number = ?;
    `;

    const VALUES = [data.new_number, data.name, data.diet, data.rarity, data.old_number];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


module.exports.deleteByNumber = (data, callback) => {

    const SQLSTATEMENT = `
        DELETE FROM DinosaurDex
        WHERE number = ?;
    `;

    const VALUES = [data.number];

    pool.query(SQLSTATEMENT, VALUES, callback);
};
