const wellnessChallengeModel = require("../models/wellnessChallengeModel.js");
const userModel = require("../models/userModel.js");

module.exports.checkChallengeBody = (req, res, next) => {

    if (req.body.user_id == undefined || req.body.description == undefined || req.body.points == undefined) {

        return res.status(400).json({
            message: "Missing user_id or description or points"
        });
    }

    next();
};


// ##############################################################
// CREATE CHALLENGE MIDDLEWARE
// ##############################################################

// Middleware 1: Check Creator Exists
module.exports.checkCreatorExists = (req, res, next) => {
    const userData = {
        user_id: req.body.user_id
    };

    userModel.selectByUserId(userData, (error, results) => {
        if (error) {
            console.error("selectByUserId error:", error);
            return res.status(500).json(error);
        }

        if (results.length == 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        next();
    });
};

// Middleware 2: Insert Challenge
module.exports.insertChallenge = (req, res, next) => {
    const data = {
        user_id: req.body.user_id,
        description: req.body.description,
        points: req.body.points
    };

    wellnessChallengeModel.insertChallenge(data, (error, results) => {
        if (error) {
            console.error("insertChallenge error:", error);
            return res.status(500).json(error);
        }

        res.locals.challenge_id = results.insertId;
        next();
    });
};


module.exports.readChallengeAfterCreation = (req, res, next) => {

    const data = { 
        challenge_id: res.locals.challenge_id 
    };

    const callback = (error, results) => {

        if (error) {
            return res.status(500).json(error);
        }

        return res.status(201).json(results[0]);
    };

    wellnessChallengeModel.selectChallengeById(data, callback);
};


module.exports.getAllChallenges = (req, res) => {

    const callback = (error, results) => {

        if (error) {
            console.error("selectAllChallenges error:", error);
            return res.status(500).json(error);
        }

        return res.status(200).json(results);
    };

    wellnessChallengeModel.selectAllChallenges(callback);
};


module.exports.getChallengeById = (req, res, next) => {

    const data = { 
        challenge_id: req.params.challenge_id 
    };

    const callback = (error, results) => {

        if (error) {
            console.error("selectChallengeById error:", error);
            return res.status(500).json(error);
        }

        if (results.length === 0) {
            return res.status(404).json({ 
                message: "Challenge not found" 
            });
        }

        res.locals.challenge = results[0];
        next();
    };

    wellnessChallengeModel.selectChallengeById(data, callback);
};


module.exports.checkOwnership = (req, res, next) => {

    const challenge = res.locals.challenge;

    const userId = req.body.user_id ?? req.query.user_id;

    if (userId == undefined) {
        return res.status(400).json({
            message: "Missing user_id for ownership check"
        });
    }

    if (Number(challenge.creator_id) != Number(userId)) {
        return res.status(403).json({ 
            message: "Forbidden" 
        });
    }

    next();
};


module.exports.updateChallengeById = (req, res) => {

    const data = {
        challenge_id: req.params.challenge_id,
        user_id: req.body.user_id,
        description: req.body.description,
        points: req.body.points
    };

    const callback = (error, results) => {
        if (error) {
            console.error("updateChallengeById error:", error);
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


module.exports.deleteChallengeById = (req, res) => {

    const data = { 
        challenge_id: req.params.challenge_id 
    }

    const callback = (error, results) => {
        if (error) {
            console.error("deleteChallengeById error:", error);
            return res.status(500).json(error);
        }

        return res.status(204).send();
    };

    wellnessChallengeModel.deleteChallengeById(data, callback);
};

console.log("wellnessChallenge controller loaded");
