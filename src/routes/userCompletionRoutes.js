const express = require("express");
const router = express.Router();
const controller = require("../controllers/userCompletionController");

router.post("/:challenge_id/completions", controller.checkCompletionBody, controller.checkUserAndChallenge, controller.completeChallengeAndAddPoints);

router.get("/:challenge_id/completions", controller.getCompletionsByChallengeId);

module.exports = router;
