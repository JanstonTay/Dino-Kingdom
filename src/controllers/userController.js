const userModel = require("../models/userModel.js");

module.exports.getAllUsers = (req, res) => {

    userModel.selectAll((error, results) => {

        if (error) {
            console.error("selectAll error:", error);
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
            console.error("selectByUserId error:", error);
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


// Check registration body
module.exports.checkRegisterBody = (req, res, next) => {
    if (!req.body.username || !req.body.email || !req.body.password) {
        return res.status(400).json({
            message: "Missing username, email, or password"
        });
    }
    next();
};


// Check if email already exists
module.exports.checkEmailExists = (req, res, next) => {
    const data = { email: req.body.email };

    userModel.selectByEmail(data, (error, results) => {
        if (error) {
            console.error("selectByEmail error:", error);
            return res.status(500).json(error);
        }
        if (results.length > 0) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }
        next();
    });
};


// Check if username already exists
module.exports.checkUsernameExists = (req, res, next) => {
    const data = { username: req.body.username };

    userModel.selectByUsername(data, (error, results) => {
        if (error) {
            console.error("selectByUsername error:", error);
            return res.status(500).json(error);
        }
        if (results.length > 0) {
            return res.status(409).json({
                message: "Username already taken"
            });
        }
        next();
    });
};


// Create new user (after password hash)
module.exports.createUser = (req, res, next) => {

    const data = {
        username: req.body.username,
        email: req.body.email,
        password: res.locals.hash
    };

    userModel.insertSingle(data, (error, results) => {

        if (error) {
            console.error("insertSingle error:", error);
            return res.status(500).json(error);
        }
        else {
            res.locals.userId = results.insertId;
            res.locals.message = "Registration successful";
            next();
        }

    });
};


// Check login body
module.exports.checkLoginBody = (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
            message: "Missing email or password"
        });
    }
    next();
};


// Get user by username or email for login
module.exports.getUserByEmail = (req, res, next) => {
    const data = {
        username: req.body.email, // "email" field in body might contain username or email
        email: req.body.email
    };

    userModel.selectByUsernameOrEmail(data, (error, results) => {
        if (error) {
            console.error("selectByUsernameOrEmail error:", error);
            return res.status(500).json(error);
        }
        if (results.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.locals.userId = results[0].user_id;
        res.locals.hash = results[0].password;
        res.locals.message = "Login successful";
        next();
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
            console.error("selectByUserId error:", error);
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
                console.error("selectByUsername error:", error);
                return res.status(500).json(error);
            }

            if (usernameResults.length > 0 && usernameResults[0].user_id != data.user_id) {
                return res.status(409).json({
                    message: "Username taken"
                });
            }

            userModel.updateById(data, (error, result) => {

                if (error) {
                    console.error("updateById error:", error);
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
