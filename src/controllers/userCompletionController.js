const userCompletionModel = require("../models/userCompletionModel.js");

module.exports.checkCompletionBody = (req, res, next) => {

    if (req.body.user_id == undefined || req.body.details == undefined) {

        return res.status(400).json({
            message: "Missing user_id or details"
        });
    }

    next();
};


// ##############################################################
// CHECK USER AND CHALLENGE MIDDLEWARE
// ##############################################################

// Middleware 1: Check User Exists
module.exports.checkUserExists = (req, res, next) => {
    const userData = { user_id: req.body.user_id };

    userCompletionModel.selectUserById(userData, (error, results) => {
        if (error) {
            console.error("selectUserById error:", error);
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

// Middleware 2: Check Challenge Exists
module.exports.checkChallengeExists = (req, res, next) => {
    const challengeData = { challenge_id: req.params.challenge_id };

    userCompletionModel.selectChallengeById(challengeData, (error, results) => {
        if (error) {
            console.error("selectChallengeById error:", error);
            return res.status(500).json(error);
        }

        if (results.length == 0) {
            return res.status(404).json({
                message: "Challenge not found"
            });
        }

        res.locals.points_to_add = results[0].points;
        next();
    });
};


// ##############################################################
// COMPLETE CHALLENGE MIDDLEWARE
// ##############################################################

// Middleware 1: Insert Completion Record
module.exports.insertCompletionRecord = (req, res, next) => {
    const data = {
        challenge_id: req.params.challenge_id,
        user_id: req.body.user_id,
        details: req.body.details
    };

    userCompletionModel.insertCompletion(data, (error, results) => {
        if (error) {
            console.error("insertCompletion error:", error);
            return res.status(500).json(error);
        }

        res.locals.complete_id = results.insertId;
        next();
    });
};

// Middleware 2: Add Points to User
module.exports.addPointsToUser = (req, res) => {
    const rewardData = {
        user_id: req.body.user_id,
        points_to_add: res.locals.points_to_add
    };

    userCompletionModel.addPointsToUser(rewardData, (error) => {
        if (error) {
            console.error("addPointsToUser error:", error);
            return res.status(500).json(error);
        }

        return res.status(201).json({
            complete_id: res.locals.complete_id,
            challenge_id: Number(req.params.challenge_id),
            user_id: req.body.user_id,
            details: req.body.details
        });
    });
};


module.exports.getCompletionsByChallengeId = (req, res) => {

    const data = {
        challenge_id: req.params.challenge_id
    };

    const callback = (error, results) => {

        if (error) {
            console.error("selectAttemptsByChallengeId error:", error);
            return res.status(500).json(error);
        }

        if (results.length == 0) {

            return res.status(404).json({
                message: "No attempts found"
            });
        }

        return res.status(200).json(results);
    };

    userCompletionModel.selectAttemptsByChallengeId(data, callback);
};

console.log("userCompletion controller loaded");

