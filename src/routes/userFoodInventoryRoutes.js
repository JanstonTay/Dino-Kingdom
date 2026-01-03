const express = require("express");
const router = express.Router();

const controller = require("../controllers/userFoodInventoryController.js");

router.get("/", controller.readAllUserFoodInventory);
router.post("/", controller.createOrUpdateUserFoodInventory);
router.delete("/", controller.deleteUserFoodInventoryItem);

module.exports = router;
