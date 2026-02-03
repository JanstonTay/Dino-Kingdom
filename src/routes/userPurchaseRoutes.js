const express = require("express");
const router = express.Router();

const controller = require("../controllers/userPurchaseController.js");

router.get("/", controller.readAllUserPurchases);
router.post("/", [
    controller.validatePurchaseRequest, 
    controller.fetchItemPrice, 
    controller.checkUserBalance, 
    controller.deductUserPoints, 
    controller.updateUserInventory, 
    controller.logPurchaseTransaction
]);

router.get("/user/:user_id", controller.readUserPurchasesByUserId);

module.exports = router;
