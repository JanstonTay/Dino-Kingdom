const userModel = require("../models/userModel.js");

module.exports.getAllUsers = (req, res) => {

    userModel.selectAll((error, results) => {

        if (error) {
            return res.status(500).json(error);
        } 
        else {
            return res.status(200).json(results);
        }

    });
};


module.exports.getUserById = (req, res) => {

    const data = {
        user_id: req.params.user_id
    };

    userModel.selectByUserId(data, (error, results) => {

        if (error) {
            return res.status(500).json(error);
        }
        else if (results.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        else {
            return res.status(200).json(results[0]);
        }

    });
};


module.exports.createUser = (req, res) => {

    const data = {
        username: req.body.username
    };

    if (!data.username || data.username === undefined) {
        return res.status(400).json({
            message: "Missing username"
        });
    }

    const checkData = {
        username: data.username
    };

    // First check if username already exists
    userModel.selectByUsername(checkData, (error, results) => {

        if (error) {
            return res.status(500).json(error);
        }

        if (results.length > 0) {
            // Someone already has this username
            return res.status(409).json({
                message: "Username taken"
            });
        }

        // Safe to insert
        userModel.insertSingle(data, (error2, results2) => {

            if (error2) {
                return res.status(500).json(error2);
            } 
            else {
                return res.status(201).json({
                    user_id: results2.insertId,
                    username: data.username,
                    points: 0
                });
            }

        });
    });
};


module.exports.updateUserById = (req, res) => {

    const data = {
        user_id: req.params.user_id,
        username: req.body.username,
        points: req.body.points
    };

    if (data.username === undefined || data.points === undefined) {
        return res.status(400).json({
            message: "Missing username or points"
        });
    }

    const userIdData = {
        user_id: data.user_id
    };

    // 1) Check that the user exists
    userModel.selectByUserId(userIdData, (error, userResults) => {

        if (error) {
            return res.status(500).json(error);
        }

        if (userResults.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const checkData = {
            username: data.username
        };

        // 2) Check if some *other* user already has this username
        userModel.selectByUsername(checkData, (error2, usernameResults) => {

            if (error2) {
                return res.status(500).json(error2);
            }

            if (usernameResults.length > 0 && usernameResults[0].user_id != data.user_id) {
                return res.status(409).json({
                    message: "Username taken"
                });
            }

            // 3) Safe to update
            userModel.updateById(data, (error3, result) => {

                if (error3) {
                    return res.status(500).json(error3);
                }

                return res.status(200).json({
                    user_id: Number(data.user_id),
                    username: data.username,
                    points: data.points
                });

            });

        });

    });
};

console.log("user controller loaded");
