const pool = require("../services/db");

module.exports.selectAllDinosaurFeed = (callback) => {

    const SQLSTATEMENT = `
        SELECT feed_id, dinosaur_id, food_type_id, quantity, used_on
        FROM DinosaurFeed;
    `;

    pool.query(SQLSTATEMENT, callback);
};


module.exports.insertFeedEvent = (data, callback) => {

    const SQLSTATEMENT = `
        INSERT INTO DinosaurFeed (dinosaur_id, food_type_id, quantity, used_on)
        VALUES (?, ?, ?, NOW());
    `;

    const VALUES = [data.dinosaur_id, data.food_type_id, data.quantity];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


module.exports.selectFeedByDinosaurId = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT feed_id, dinosaur_id, food_type_id, quantity, used_on
        FROM DinosaurFeed
        WHERE dinosaur_id = ?;
    `;

    const VALUES = [data.dinosaur_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


module.exports.deleteFeedById = (data, callback) => {

    const SQLSTATEMENT = `
        DELETE FROM DinosaurFeed
        WHERE feed_id = ?;
    `;

    const VALUES = [data.feed_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};
