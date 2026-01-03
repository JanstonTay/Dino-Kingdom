const dinosaurDexModel = require("../models/dinosaurDexModel.js");

module.exports.readAllDinosaurDex = (req, res) => {

    const callback = (error, results) => {

        if (error) {
            console.error("Error readAllDinosaurDex:", error);
            return res.status(500).json(error);
        }

        return res.status(200).json(results);
    };

    dinosaurDexModel.selectAll(callback);
};


module.exports.readDinosaurDexByNumber = (req, res) => {

    const data = { number: req.params.number };

    const callback = (error, results) => {

        if (error) {
            console.error("Error readDinosaurDexByNumber:", error);
            return res.status(500).json(error);
        }

        if (results.length === 0) {
            return res.status(404).send("DinosaurDex entry not found");
        }

        return res.status(200).json(results[0]);
    };

    dinosaurDexModel.selectByNumber(data, callback);
};
