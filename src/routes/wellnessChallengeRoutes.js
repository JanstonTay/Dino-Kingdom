const express = require("express");
const router = express.Router();
const controller = require("../controllers/wellnessChallengeController.js");

router.post("/", controller.checkChallengeBody, controller.createChallenge, controller.readChallengeAfterCreation);

router.get("/", controller.getAllChallenges);

router.put("/:challenge_id", controller.checkChallengeBody, controller.getChallengeById, controller.checkOwnership, controller.updateChallengeById);

router.delete("/:challenge_id", controller.getChallengeById, controller.deleteChallengeById);

module.exports = router;
