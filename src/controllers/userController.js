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
        username: req.body.username
    };

    if (!data.username) {
        return res.status(400).json({
            message: "Missing username"
        });
    }

    const checkUsername = {
        username: data.username
    };

    userModel.selectByUsername(checkUsername, (error, results) => {
        if (error) {
            console.error("selectByUsername error:", error);
            return res.status(500).json(error);
        }

        if (results.length > 0) {
            return res.status(409).json({
                message: "Username taken"
            });
        }

        // Pass data to next middleware
        res.locals.username = data.username;
        next();
    });
};

module.exports.createNewUser = (req, res, next) => {
    const data = {
        username: res.locals.username
    };

    userModel.insertSingle(data, (error, results) => {
        if (error) {
            console.error("insertSingle error:", error);
            return res.status(500).json(error);
        } 
        
        return res.status(201).json({
            user_id: results.insertId,
            username: data.username,
            points: 0
        });
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

console.log("user controller loaded");
