const express = require("express");
const router = express.Router();

const controller = require("../controllers/userPurchaseController.js");

router.get("/", controller.readAllUserPurchases);
router.post("/", controller.createUserPurchase);

router.get("/user/:user_id", controller.readUserPurchasesByUserId);

module.exports = router;
