const express = require("express");
const router = express.Router();

const controller = require("../controllers/dinosaurFeedController.js");

router.get("/", controller.readAllDinosaurFeed);
router.post("/", controller.checkFeedBody, controller.verifyFeedRequest, controller.createFeedEvent);

router.get("/:dinosaur_id", controller.readFeedByDinosaurId);
router.delete("/:feed_id", controller.deleteFeedById);

module.exports = router;
