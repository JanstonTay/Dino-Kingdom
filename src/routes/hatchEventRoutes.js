const express = require("express");
const router = express.Router();

const controller = require("../controllers/hatchEventController.js");

router.get("/", controller.readAllHatchEvents);
router.post("/", controller.createHatchEvent);

router.get("/user/:user_id", controller.readHatchEventsByUserId);

module.exports = router;
