const express = require("express");
const router = express.Router();
const controller = require("../controllers/hatchEventController.js");
const jwtMiddleware = require("../middlewares/jwtMiddleware");

router.get("/", controller.readAllHatchEvents);
router.post("/", jwtMiddleware.verifyToken, controller.createHatchEvent);
router.get("/user/:user_id", controller.readHatchEventsByUserId);

module.exports = router;
