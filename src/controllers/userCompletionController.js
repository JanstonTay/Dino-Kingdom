const userCompletionModel = require("../models/userCompletionModel.js");

module.exports.checkCompletionBody = (req, res, next) => {

    if (req.body.user_id == undefined || req.body.details == undefined) {

        return res.status(400).json({
            message: "Missing user_id or details"
        });
    }

    next();
};


module.exports.checkUserAndChallenge = (req, res, next) => {

    const userData = {
        user_id: req.body.user_id
    };

    const userCallback = (error, results) => {

        if (error) {
            console.error("Error selectUserById:", error);
            return res.status(500).json(error);
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const challengeData = {
            challenge_id: req.params.challenge_id
        };

        const challengeCallback = (error2, results2) => {

            if (error2) {
                console.error("Error selectChallengeById:", error2);
                return res.status(500).json(error2);
            }

            if (results2.length === 0) {
                return res.status(404).json({
                    message: "Challenge not found"
                });
            }

            // store how many points this challenge is worth
            res.locals.points_to_add = results2[0].points;
            next();
        };

        userCompletionModel.selectChallengeById(challengeData, challengeCallback);
    };

    userCompletionModel.selectUserById(userData, userCallback);
};


module.exports.completeChallengeAndAddPoints = (req, res) => {

    const data = {
        challenge_id: req.params.challenge_id,
        user_id: req.body.user_id,
        details: req.body.details
    };

    const insertCallback = (error, results) => {

        if (error) {
            console.error("Error insertCompletion:", error);
            return res.status(500).json(error);
        }

        const complete_id = results.insertId;

        const rewardData = {
            user_id: data.user_id,
            points_to_add: res.locals.points_to_add   // <- matches model
        };

        const rewardCallback = (error2) => {

            if (error2) {
                console.error("Error addPointsToUser:", error2);
                return res.status(500).json(error2);
            }

            return res.status(201).json({
                complete_id: complete_id,
                challenge_id: Number(data.challenge_id),
                user_id: data.user_id,
                details: data.details
            });
        };

        userCompletionModel.addPointsToUser(rewardData, rewardCallback);
    };

    userCompletionModel.insertCompletion(data, insertCallback);
};


module.exports.getCompletionsByChallengeId = (req, res) => {

    const data = {
        challenge_id: req.params.challenge_id
    };

    const callback = (error, results) => {

        if (error) {
            console.error("Error selectAttemptsByChallengeId:", error);
            return res.status(500).json(error);
        }

        if (results.length === 0) {

            return res.status(404).json({
                message: "No attempts found"
            });
        }

        return res.status(200).json(results);
    };

    userCompletionModel.selectAttemptsByChallengeId(data, callback);
};

console.log("userCompletion controller loaded");
