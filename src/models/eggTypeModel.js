const pool = require("../services/db");

// SELECT all egg types
module.exports.selectAll = (callback) => {

    const SQLSTATEMENT = `
        SELECT egg_type_id, name, rarity, price_points
        FROM EggType;
    `;

    pool.query(SQLSTATEMENT, callback);
};


// SELECT egg type by id
module.exports.selectById = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT egg_type_id, name, rarity, price_points
        FROM EggType
        WHERE egg_type_id = ?;
    `;

    const VALUES = [data.egg_type_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


// SELECT egg type by name (for duplicate check)
module.exports.selectByName = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT egg_type_id, name, rarity, price_points
        FROM EggType
        WHERE name = ?;
    `;

    const VALUES = [data.name];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


// INSERT egg type
module.exports.insertSingle = (data, callback) => {

    const SQLSTATEMENT = `
        INSERT INTO EggType (name, rarity, price_points)
        VALUES (?, ?, ?);
    `;

    const VALUES = [data.name, data.rarity, data.price_points];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


// UPDATE egg type by id
module.exports.updateById = (data, callback) => {

    const SQLSTATEMENT = `
        UPDATE EggType
        SET name = ?, rarity = ?, price_points = ?
        WHERE egg_type_id = ?;
    `;

    const VALUES = [
        data.name,
        data.rarity,
        data.price_points,
        data.egg_type_id
    ];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


// DELETE egg type by id
module.exports.deleteById = (data, callback) => {

    const SQLSTATEMENT = `
        DELETE FROM EggType
        WHERE egg_type_id = ?;
    `;

    const VALUES = [data.egg_type_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};
