// src/models/dinosaurFeedModel.js
const pool = require("../services/db");

// ##############################################################
// SELECT ALL FEED EVENTS
// ##############################################################
module.exports.selectAll = (callback) => {

    const SQLSTATEMENT = `
        SELECT *
        FROM DinosaurFeed
        ORDER BY used_on DESC;
    `;

    pool.query(SQLSTATEMENT, callback);
};

// ##############################################################
// SELECT FEED EVENTS BY DINOSAUR_ID
// ##############################################################
module.exports.selectByDinosaurId = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT *
        FROM DinosaurFeed
        WHERE dinosaur_id = ?
        ORDER BY used_on DESC;
    `;

    const VALUES = [data.dinosaur_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

// ##############################################################
// INSERT ONE FEED EVENT
// ##############################################################
module.exports.insertSingle = (data, callback) => {

    const SQLSTATEMENT = `
        INSERT INTO DinosaurFeed (dinosaur_id, food_type_id, quantity, used_on)
        VALUES (?, ?, ?, NOW());
    `;

    const VALUES = [data.dinosaur_id, data.food_type_id, data.quantity];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

console.log("dinosaurFeed model loaded");
