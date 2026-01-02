const wellnessChallengeModel = require("../models/wellnessChallengeModel.js");

// ##############################################################
// CHECK BODY (POST + PUT)
// ##############################################################
module.exports.checkChallengeBody = (req, res, next) => {
    if (
        req.body.user_id == undefined ||
        req.body.description == undefined ||
        req.body.points == undefined
    ) {
        return res.status(400).json({
            message: "Missing user_id or description or points"
        });
    }

    next();
};


// ##############################################################
// CREATE CHALLENGE  (POST /challenges)
// ##############################################################
module.exports.createChallenge = (req, res, next) => {

    const data = {
        user_id: req.body.user_id,        // becomes creator_id
        description: req.body.description,
        points: req.body.points
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error insertChallenge:", error);
            return res.status(500).json(error);
        }

        res.locals.challenge_id = results.insertId;
        next();
    };

    wellnessChallengeModel.insertChallenge(data, callback);
};


// ##############################################################
// READ CHALLENGE AFTER CREATION (201)
// ##############################################################
module.exports.readChallengeAfterCreation = (req, res) => {

    const data = { challenge_id: res.locals.challenge_id };

    const callback = (error, results) => {
        if (error) {
            console.error("Error selectChallengeById (after create):", error);
            return res.status(500).json(error);
        }

        return res.status(201).json(results[0]);
    };

    wellnessChallengeModel.selectChallengeById(data, callback);
};


// ##############################################################
// GET ALL CHALLENGES (GET /challenges)
// ##############################################################
module.exports.getAllChallenges = (req, res) => {
    console.log("getAllChallenges HIT");   // <--- debug

    const callback = (error, results) => {
        if (error) {
            console.error("Error selectAllChallenges:", error);
            return res.status(500).json(error);
        }

        return res.status(200).json(results);
    };

    wellnessChallengeModel.selectAllChallenges(callback);
    // IMPORTANT: selectAllChallenges MUST accept only (callback)
    // If yours expects (data, callback), use: wellnessChallengeModel.selectAllChallenges({}, callback);
};


// ##############################################################
// LOAD CHALLENGE BY ID (middleware for PUT + DELETE)
// ##############################################################
module.exports.getChallengeById = (req, res, next) => {

    console.log("getChallengeById HIT, id =", req.params.challenge_id);  // <--- debug

    const data = { challenge_id: req.params.challenge_id };

    const callback = (error, results) => {
        if (error) {
            console.error("Error selectChallengeById:", error);
            return res.status(500).json(error);
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Challenge not found" });
        }

        res.locals.challenge = results[0];
        next();
    };

    wellnessChallengeModel.selectChallengeById(data, callback);
};


// ##############################################################
// CHECK OWNERSHIP (PUT + DELETE)
// ##############################################################
module.exports.checkOwnership = (req, res, next) => {

    const challenge = res.locals.challenge;

    const userId = req.body.user_id ?? req.query.user_id;

    if (userId == undefined) {
        return res.status(400).json({
            message: "Missing user_id for ownership check"
        });
    }

    if (Number(challenge.creator_id) !== Number(userId)) {
        return res.status(403).json({ message: "Forbidden" });
    }

    next();
};


// ##############################################################
// UPDATE CHALLENGE (PUT /challenges/:challenge_id)
// ##############################################################
module.exports.updateChallengeById = (req, res) => {

    const data = {
        challenge_id: req.params.challenge_id,
        user_id: req.body.user_id,
        description: req.body.description,
        points: req.body.points
    };

    const callback = (error, results) => {
        if (error) {
            console.error("Error updateChallengeById:", error);
            return res.status(500).json(error);
        }

        return res.status(200).json({
            challenge_id: Number(data.challenge_id),
            description: data.description,
            creator_id: Number(data.user_id),
            points: data.points
        });
    };

    wellnessChallengeModel.updateChallengeById(data, callback);
};


// ##############################################################
// DELETE CHALLENGE (DELETE /challenges/:challenge_id)
// ##############################################################
module.exports.deleteChallengeById = (req, res) => {

    const data = { challenge_id: req.params.challenge_id };

    const callback = (error, results) => {
        if (error) {
            console.error("Error deleteChallengeById:", error);
            return res.status(500).json(error);
        }

        return res.status(204).send();
    };

    wellnessChallengeModel.deleteChallengeById(data, callback);
};

console.log("wellnessChallenge controller loaded");
