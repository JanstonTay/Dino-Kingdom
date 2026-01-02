const userModel = require("../models/userModel.js");

module.exports.getAllUsers = (req, res) => {

    try {

        userModel.selectAll((error, results) => {

            if (error) {
                return res.status(500).json(error);
            }
            else {
                return res.status(200).json(results);
            }

        });
    }
    catch (error) {

        return res.status(500).json({
            message: "Internal server error."
        });

    }

}

module.exports.getUserById = (req, res) => {

    try {

        const data = {
            user_id: req.params.user_id
        }

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

    }
    catch (error) {

        return res.status(500).json({
            message: "Internal server error."
        });

    }

}

module.exports.createUser = (req, res) => {
    try {
        const data = {
            username: req.body.username
        };

        if (!data.username || data.username == undefined) {
            return res.status(400).json({
                message: "Missing username"
            });
        }

        userModel.insertSingle(data, (error, results) => {
            if (error) {

                if (error.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({ message: "Username taken" });
                }
                else {
                    return res.status(500).json(error);
                }
            }
            else {

                return res.status(201).json({
                    user_id: results.insertId,
                    username: data.username,
                    points: 0
                });

            }

        });

    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error." });
    }
};


module.exports.updateUserById = (req, res) => {

    try {

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

        userModel.updateById(data, (error, result) => {

            if (error) {

                if (error.code === "ER_DUP_ENTRY") {

                    return res.status(409).json({
                        message: "Username taken"
                    });

                }
                else {
                    return res.status(500).json(error);
                }

            }
            else if (result.affectedRows === 0) {

                return res.status(404).json({
                    message: "User not found"
                });

            }
            else {

                return res.status(200).json({
                    message: "User updated successfully"
                });

            }

        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error."
        });
    }
};

console.log("user controller loaded");