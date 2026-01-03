const express = require("express");
const router = express.Router();
const wellnessChallengeController = require("../controllers/wellnessChallengeController.js");

router.post("/", wellnessChallengeController.checkChallengeBody, wellnessChallengeController.createChallenge, wellnessChallengeController.readChallengeAfterCreation);

router.get("/", wellnessChallengeController.getAllChallenges);

router.put("/:challenge_id", wellnessChallengeController.checkChallengeBody, wellnessChallengeController.getChallengeById, wellnessChallengeController.checkOwnership, wellnessChallengeController.updateChallengeById);

router.delete("/:challenge_id", wellnessChallengeController.getChallengeById, wellnessChallengeController.deleteChallengeById);

module.exports = router;
