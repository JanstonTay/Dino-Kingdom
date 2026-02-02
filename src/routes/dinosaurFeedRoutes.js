const express = require("express");
const router = express.Router();
const controller = require("../controllers/dinosaurFeedController.js");
const jwtMiddleware = require("../middlewares/jwtMiddleware");

router.get("/", controller.readAllDinosaurFeed);
router.post("/", jwtMiddleware.verifyToken, controller.createFeedEvent);

router.get("/:dinosaur_id", controller.readFeedByDinosaurId);

module.exports = router;