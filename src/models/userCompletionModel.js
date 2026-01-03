const pool = require("../services/db");

module.exports.selectUserById = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT user_id FROM User
        WHERE user_id = ?;
    `;

    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


module.exports.selectChallengeById = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT challenge_id, points FROM WellnessChallenge
        WHERE challenge_id = ?;
    `;

    const VALUES = [data.challenge_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


module.exports.insertCompletion = (data, callback) => {

    const SQLSTATEMENT = `
        INSERT INTO UserCompletion (challenge_id, user_id, details)
        VALUES (?, ?, ?);
    `;

    const VALUES = [data.challenge_id, data.user_id, data.details];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


module.exports.addPointsToUser = (data, callback) => {

    const SQLSTATEMENT = `
        UPDATE User
        SET points = points + ?
        WHERE user_id = ?;
    `;

    // NOTE: property name matches controller: points_to_add
    const VALUES = [data.points_to_add, data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


module.exports.selectAttemptsByChallengeId = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT user_id, details FROM UserCompletion
        WHERE challenge_id = ?;
    `;

    const VALUES = [data.challenge_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};
