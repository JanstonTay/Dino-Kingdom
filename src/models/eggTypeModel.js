const pool = require("../services/db");

module.exports.selectAll = (callback) => {

    const SQLSTATEMENT = `
        SELECT egg_type_id, name, rarity, price_points
        FROM EggType;
    `;

    pool.query(SQLSTATEMENT, callback);
};


module.exports.selectById = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT egg_type_id, name, rarity, price_points
        FROM EggType
        WHERE egg_type_id = ?;
    `;

    const VALUES = [data.egg_type_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


module.exports.selectByName = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT egg_type_id, name, rarity, price_points
        FROM EggType
        WHERE name = ?;
    `;

    const VALUES = [data.name];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


module.exports.insertSingle = (data, callback) => {

    const SQLSTATEMENT = `
        INSERT INTO EggType (name, rarity, price_points)
        VALUES (?, ?, ?);
    `;

    const VALUES = [data.name, data.rarity, data.price_points];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


module.exports.updateById = (data, callback) => {

    const SQLSTATEMENT = `
        UPDATE EggType
        SET name = ?, rarity = ?, price_points = ?
        WHERE egg_type_id = ?;
    `;

    const VALUES = [data.name, data.rarity, data.price_points, data.egg_type_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


module.exports.deleteById = (data, callback) => {

    const SQLSTATEMENT = `
        DELETE FROM EggType
        WHERE egg_type_id = ?;
    `;

    const VALUES = [data.egg_type_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

