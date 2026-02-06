const express = require("express");
const router = express.Router();

const controller = require("../controllers/userPurchaseController.js");
const jwtMiddleware = require("../middlewares/jwtMiddleware");

router.get("/", controller.readAllUserPurchases);
router.post("/", jwtMiddleware.verifyToken, [
    controller.validatePurchaseRequest,
    controller.fetchItemPrice,
    controller.checkUserBalance,
    controller.deductUserPoints,
    controller.updateUserInventory,
    controller.logPurchaseTransaction
]);

router.get("/user/:user_id", jwtMiddleware.verifyToken, controller.readUserPurchasesByUserId);

module.exports = router;
