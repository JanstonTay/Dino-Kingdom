const express = require("express");
const router = express.Router();

const controller = require("../controllers/dinosaurFeedController.js");

// GET /dinosaurFeed           -> all feed events
router.get("/", controller.readAllDinosaurFeed);

// GET /dinosaurFeed/:dinosaur_id   -> feed events for one dinosaur
router.get("/:dinosaur_id", controller.readFeedByDinosaurId);

// POST /dinosaurFeed          -> feed a dinosaur (uses middleware chain)
router.post("/", controller.checkFeedBody, controller.checkAndConsumeFood, controller.createFeedEvent);

module.exports = router;
