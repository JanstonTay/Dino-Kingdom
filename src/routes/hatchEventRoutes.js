const express = require("express");
const router = express.Router();

const controller = require("../controllers/hatchEventController.js");
const jwtMiddleware = require("../middlewares/jwtMiddleware");

router.get("/", controller.readAllHatchEvents);
router.post("/", jwtMiddleware.verifyToken, [
    controller.validateHatchRequest,
    controller.checkEggInventory,
    controller.lookUpEggRarity,
    controller.chooseDinosaurFromDex,
    controller.hatchDinosaur,
    controller.decrementEggInventory,
    controller.logHatchEvent
]);

router.get("/user/:user_id", jwtMiddleware.verifyToken, controller.readHatchEventsByUserId);

module.exports = router;
