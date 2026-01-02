const express = require("express");
const router = express.Router();
const controller = require("../controllers/userCompletionController");

// POST /challenges/:challenge_id/attempts
router.post(
    "/:challenge_id/completions",
    controller.checkCompletionBody,
    controller.checkUserAndChallenge,
    controller.completeChallengeAndAddPoints
);

// GET /challenges/:challenge_id/attempts
router.get(
    "/:challenge_id/completions",
    controller.getCompletionsByChallengeId
);

module.exports = router;
