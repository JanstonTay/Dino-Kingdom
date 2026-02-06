const express = require("express");
const router = express.Router();
const controller = require("../controllers/wellnessChallengeController.js");
const jwtMiddleware = require("../middlewares/jwtMiddleware");

router.get("/", controller.getAllChallenges);
router.post("/", jwtMiddleware.verifyToken, [
    controller.checkChallengeBody,
    controller.checkCreatorExists,
    controller.insertChallenge,
    controller.readChallengeAfterCreation
]);

router.put("/:challenge_id", jwtMiddleware.verifyToken, controller.checkChallengeBody, controller.getChallengeById, controller.checkOwnership, controller.updateChallengeById);
router.delete("/:challenge_id", jwtMiddleware.verifyToken, controller.getChallengeById, controller.deleteChallengeById);

module.exports = router;

