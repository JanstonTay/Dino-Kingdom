const pool = require("../services/db");

// ##############################################################
// BASIC READS
// ##############################################################

module.exports.selectAll = (callback) => {

    const SQLSTATEMENT = `
        SELECT feed_id, dinosaur_id, food_type_id, quantity, used_on
        FROM DinosaurFeed;
    `;

    pool.query(SQLSTATEMENT, callback);
};


module.exports.selectByDinosaurId = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT feed_id, dinosaur_id, food_type_id, quantity, used_on
        FROM DinosaurFeed
        WHERE dinosaur_id = ?;
    `;

    const VALUES = [data.dinosaur_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


// ##############################################################
// CONTEXT QUERIES (DINO, FOOD, INVENTORY)
// ##############################################################

// Dinosaur + its diet (from DinosaurDex)
module.exports.selectDinosaurWithDiet = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT 
            d.id,
            d.owner_id,
            d.level,
            d.xp,
            d.height,
            d.weight,
            dx.diet AS dinosaur_diet
        FROM Dinosaur d
        JOIN DinosaurDex dx
            ON d.dex_num = dx.number
        WHERE d.id = ?;
    `;

    const VALUES = [data.dinosaur_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


// FoodType (diet + xp_gain)
module.exports.selectFoodTypeById = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT food_type_id, diet, xp_gain
        FROM FoodType
        WHERE food_type_id = ?;
    `;

    const VALUES = [data.food_type_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


// Inventory row for a given user + food_type
module.exports.selectInventoryRow = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT quantity
        FROM UserFoodInventory
        WHERE user_id = ? AND food_type_id = ?;
    `;

    const VALUES = [data.user_id, data.food_type_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


// ##############################################################
// WRITE OPERATIONS (LOG FEED, UPDATE INVENTORY, UPDATE DINO)
// ##############################################################

// Log the feed event
module.exports.insertFeedEvent = (data, callback) => {

    const SQLSTATEMENT = `
        INSERT INTO DinosaurFeed (dinosaur_id, food_type_id, quantity, used_on)
        VALUES (?, ?, ?, NOW());
    `;

    const VALUES = [
        data.dinosaur_id,
        data.food_type_id,
        data.quantity
    ];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


// Decrease inventory (with safety check)
module.exports.decrementInventory = (data, callback) => {

    const SQLSTATEMENT = `
        UPDATE UserFoodInventory
        SET quantity = quantity - ?
        WHERE user_id = ?
          AND food_type_id = ?
          AND quantity >= ?;
    `;

    const VALUES = [
        data.quantity,
        data.user_id,
        data.food_type_id,
        data.quantity
    ];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


// Update dinosaur level, xp, height, weight
module.exports.updateDinosaurStats = (data, callback) => {

    const SQLSTATEMENT = `
        UPDATE Dinosaur
        SET level = ?, xp = ?, height = ?, weight = ?
        WHERE id = ?;
    `;

    const VALUES = [
        data.level,
        data.xp,
        data.height,
        data.weight,
        data.dinosaur_id
    ];

    pool.query(SQLSTATEMENT, VALUES, callback);
};
