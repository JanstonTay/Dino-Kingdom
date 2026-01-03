const pool = require('../services/db');

module.exports.selectAll = (callback) => {

    const SQLSTATEMENT = `
        SELECT * FROM Dinosaur;
    `;

    pool.query(SQLSTATEMENT, callback);

};


module.exports.selectById = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT * FROM Dinosaur
        WHERE id = ?;
    `;
    const VALUES = [data.id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


module.exports.insertSingle = (data, callback) => {

    const SQLSTATEMENT = `
        INSERT INTO Dinosaur (owner_id, dex_num, level, xp, height, weight)
        VALUES (?, ?, ?, ?, ?, ?);
    `;
    const VALUES = [data.owner_id, data.dex_num, data.level, data.xp, data.height, data.weight];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


module.exports.updateById = (data, callback) => {

    const SQLSTATEMENT = `
        UPDATE Dinosaur
        SET owner_id = ?, dex_num = ?, level = ?, xp = ?, height = ?, weight = ?
        WHERE id = ?;
    `;

    const VALUES = [data.owner_id, data.dex_num, data.level, data.xp, data.height, data.weight, data.id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


module.exports.deleteById = (data, callback) => {

    const SQLSTATEMENT = `
        DELETE FROM Dinosaur
        WHERE id = ?;
    `;

    const VALUES = [data.id];
    
    pool.query(SQLSTATEMENT, VALUES, callback);
};
