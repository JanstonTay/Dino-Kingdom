const userModel = require("../models/userModel.js");

module.exports.getAllUsers = (req, res) => {
    try {
        userModel.selectAll = (error, results) => {

            if (error) {
                return res.status(500).json(error);
            }
            else {
                return res.status(200).json(results);
            }
            
        } 
    }
    catch (error) {
        return res.status(500).json({
            message : "Internal server error." 
        });
    }
}

module.exports.getUserById = (req, res) => {
    try {

        const data = { 
            user_id: req.params.user_id 
        }

        userModel.selectByUserId( {data}, (error, results) => {

            if (error) {
                return res.status(500).json(error);
            }
            else if (results.length == 0) {
                return res.status(404).json({
                    message : "User not found"
                });
            }
            else {
                return res.status(200).json(results[0]);
            }
        })

    }
    catch (error) {
        return res.status(500).json({
            message : "Internal server error."
        });
    }
}