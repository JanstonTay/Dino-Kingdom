const express = require("express");
const router = express.Router();

const controller = require("../controllers/dinosaurFeedController.js");
const jwtMiddleware = require("../middlewares/jwtMiddleware");

router.get("/", controller.readAllDinosaurFeed);
router.post("/", jwtMiddleware.verifyToken, [
    controller.validateFeedRequest,
    controller.checkDinosaurOwnership,
    controller.checkFoodAndDiet,
    controller.checkInventory,
    controller.insertFeedLog,
    controller.decrementUserInventory,
    controller.updateStatsAndRespond
]);

router.get("/:dinosaur_id", controller.readFeedByDinosaurId);

module.exports = router;