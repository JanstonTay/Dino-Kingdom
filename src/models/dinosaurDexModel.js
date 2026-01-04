const pool = require("../services/db");

// SELECT all dinosaur dex entries
module.exports.selectAll = (callback) => {

    const SQLSTATEMENT = `
        SELECT number, name, diet, rarity
        FROM DinosaurDex;
    `;

    pool.query(SQLSTATEMENT, callback);
};


// SELECT by number (primary key)
module.exports.selectByNumber = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT number, name, diet, rarity
        FROM DinosaurDex
        WHERE number = ?;
    `;

    const VALUES = [data.number];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


// SELECT by name (for duplicate-check)
module.exports.selectByName = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT number, name, diet, rarity
        FROM DinosaurDex
        WHERE name = ?;
    `;

    const VALUES = [data.name];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


// 🔹 NEW: SELECT all dinos of a given rarity
module.exports.selectByRarity = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT number, name, diet, rarity
        FROM DinosaurDex
        WHERE rarity = ?;
    `;

    const VALUES = [data.rarity];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


// INSERT a new dinosaur dex entry
module.exports.insertSingle = (data, callback) => {

    const SQLSTATEMENT = `
        INSERT INTO DinosaurDex (number, name, diet, rarity)
        VALUES (?, ?, ?, ?);
    `;

    const VALUES = [data.number, data.name, data.diet, data.rarity];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


// UPDATE by number
module.exports.updateByNumber = (data, callback) => {

    const SQLSTATEMENT = `
        UPDATE DinosaurDex
        SET name = ?, diet = ?, rarity = ?
        WHERE number = ?;
    `;

    const VALUES = [
        data.name,
        data.diet,
        data.rarity,
        data.number
    ];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


// DELETE by number
module.exports.deleteByNumber = (data, callback) => {

    const SQLSTATEMENT = `
        DELETE FROM DinosaurDex
        WHERE number = ?;
    `;

    const VALUES = [data.number];

    pool.query(SQLSTATEMENT, VALUES, callback);
};
