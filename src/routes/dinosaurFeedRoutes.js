const express = require("express");
const router = express.Router();

const controller = require("../controllers/dinosaurFeedController.js");

router.get("/", controller.readAllDinosaurFeed);
router.post("/", controller.createFeedEvent);

router.get("/:dinosaur_id", controller.readFeedByDinosaurId);

module.exports = router;