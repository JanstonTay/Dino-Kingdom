const express = require("express");
const router = express.Router();
const controller = require("../controllers/userCompletionController");
const jwtMiddleware = require("../middlewares/jwtMiddleware");

router.post("/:challenge_id/completions", jwtMiddleware.verifyToken, [
    controller.checkCompletionBody,
    controller.checkUserExists,
    controller.checkChallengeExists,
    controller.insertCompletionRecord,
    controller.addPointsToUser
]);

router.get("/:challenge_id/completions", controller.getCompletionsByChallengeId);

module.exports = router;

