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


// ##############################################################
// CREATE USER MIDDLEWARE
// ##############################################################

module.exports.checkForExistingUsername = (req, res, next) => {
    const data = {
        username: req.body.username,
        email: req.body.email
    };

    if (!data.username || !data.email || !req.body.password) {
        return res.status(400).json({
            message: "Missing username, email or password"
        });
    }

    userModel.selectByUsernameOrEmail(data, (error, results) => {
        if (error) {
            console.error("selectByUsernameOrEmail error:", error);
            return res.status(500).json(error);
        }

        if (results.length > 0) {
            return res.status(409).json({
                message: "Username or email already taken"
            });
        }

        next();
    });
};

module.exports.createNewUser = (req, res, next) => {
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

        res.locals.userId = results.insertId;
        res.locals.message = "Registration successful";
        next();
    });
};


// ##############################################################
// UPDATE USER MIDDLEWARE
// ##############################################################

module.exports.checkUserExists = (req, res, next) => {
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

        res.locals.user_id = data.user_id;
        res.locals.username = data.username;
        res.locals.points = data.points;
        next();
    });
};

module.exports.checkUsernameAvailability = (req, res, next) => {
    const checkUsername = {
        username: res.locals.username
    };

    userModel.selectByUsername(checkUsername, (error, usernameResults) => {
        if (error) {
            console.error("selectByUsername error:", error);
            return res.status(500).json(error);
        }

        if (usernameResults.length > 0 && usernameResults[0].user_id != res.locals.user_id) {
            return res.status(409).json({
                message: "Username taken"
            });
        }

        next();
    });
};

module.exports.performUpdateUser = (req, res, next) => {
    const data = {
        user_id: res.locals.user_id,
        username: res.locals.username,
        points: res.locals.points
    };

    userModel.updateById(data, (error, result) => {
        if (error) {
            console.error("updateById error:", error);
            return res.status(500).json(error);
        }

        return res.status(200).json({
            user_id: Number(data.user_id),
            username: data.username,
            points: data.points
        });
    });
};

module.exports.login = (req, res, next) => {
    const data = {
        username: req.body.username || req.body.email,
        email: req.body.email || req.body.username
    };

    if (!data.username && !data.email) {
        return res.status(400).json({
            message: "Missing username or email"
        });
    }

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

        res.locals.hash = results[0].password;
        res.locals.message = "Login successful";
        next();
    });
};

module.exports.verifyOwnership = (req, res, next) => {
    // If user is admin (e.g. userId 1), allow update? Or strictly own profile.
    // For this brief, likely own profile only.
    if (res.locals.userId != req.params.user_id) {
        return res.status(403).json({
            message: "Forbidden: You do not have permission to modify this user account"
        });
    }
    next();
};

console.log("user controller loaded");
