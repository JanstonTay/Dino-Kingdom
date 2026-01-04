const express = require("express");
const router = express.Router();

const controller = require("../controllers/userEggInventoryController.js");

router.get("/", controller.readAllUserEggInventory);
router.post("/", controller.addUserEggInventory);
router.put("/", controller.updateUserEggInventory);
router.delete("/", controller.deleteUserEggInventoryItem);

router.get("/user/:user_id", controller.readUserEggInventoryByUserId);

module.exports = router;
