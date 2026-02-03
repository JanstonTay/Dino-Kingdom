const express = require("express");
const router = express.Router();

const controller = require("../controllers/dinosaurFeedController.js");

router.get("/", controller.readAllDinosaurFeed);
router.post("/", [
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