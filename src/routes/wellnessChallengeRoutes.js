const express = require("express");
const router = express.Router();
const wellnessChallengeController = require("../controllers/wellnessChallengeController.js");

// POST /challenges
router.post(
    "/",
    wellnessChallengeController.checkChallengeBody,
    wellnessChallengeController.createChallenge,
    wellnessChallengeController.readChallengeAfterCreation
);

// GET /challenges
router.get(
    "/",
    wellnessChallengeController.getAllChallenges
);

// PUT /challenges/:challenge_id
router.put(
    "/:challenge_id",
    wellnessChallengeController.checkChallengeBody,
    wellnessChallengeController.getChallengeById,
    wellnessChallengeController.checkOwnership,
    wellnessChallengeController.updateChallengeById
);

// DELETE /challenges/:challenge_id
router.delete(
    "/:challenge_id",
    wellnessChallengeController.getChallengeById,
    wellnessChallengeController.checkOwnership,
    wellnessChallengeController.deleteChallengeById
);

module.exports = router;
