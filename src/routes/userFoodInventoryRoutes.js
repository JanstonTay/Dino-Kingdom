const express = require("express");
const router = express.Router();

const controller = require("../controllers/userFoodInventoryController.js");

router.get("/", controller.readAllUserFoodInventory);
router.post("/", controller.addUserFoodInventory);
router.put("/", controller.updateUserFoodInventory);
router.delete("/", controller.deleteUserFoodInventoryItem);

router.get("/user/:user_id", controller.readUserFoodInventoryByUserId);


module.exports = router;
