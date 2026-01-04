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

        else if (results.length == 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        
        else {
            return res.status(200).json(results[0]);
        }

    })
};


module.exports.createUser = (req, res) => {

    const data = {
        username: req.body.username
    };

    if (!data.username || data.username == undefined) {
        return res.status(400).json({
            message: "Missing username"
        });
    }

    const checkUsername = {
        username: data.username
    };

    // check if username already exist
    userModel.selectByUsername(checkUsername, (error, results) => {

        if (error) {
            return res.status(500).json(error);
        }

        if (results.length > 0) {
            return res.status(409).json({
                message: "Username taken"
            });
        }

        userModel.insertSingle(data, (error, results) => {

            if (error) {
                return res.status(500).json(error);
            } 
            else {
                return res.status(201).json({
                    user_id: results.insertId,
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

    if (data.username == undefined || data.points == undefined) {
        return res.status(400).json({
            message: "Missing username or points"
        });
    }

    const checkUserId = {
        user_id: data.user_id
    };

    // check that the user exist
    userModel.selectByUserId(checkUserId, (error, userResults) => {

        if (error) {
            return res.status(500).json(error);
        }

        if (userResults.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const checkUsername = {
            username: data.username
        };

        // check if another user already has this username
        userModel.selectByUsername(checkUsername, (error, usernameResults) => {

            if (error) {
                return res.status(500).json(error);
            }

            if (usernameResults.length > 0 && usernameResults[0].user_id != data.user_id) {
                return res.status(409).json({
                    message: "Username taken"
                });
            }

            userModel.updateById(data, (error, result) => {

                if (error) {
                    return res.status(500).json(error);
                }

                return res.status(200).json({
                    user_id: Number(data.user_id),
                    username: data.username,
                    points: data.points
                })

            })

        });

    });
};

console.log("user controller loaded");
