const express = require("express");
const router = express.Router();
const controller = require("../controllers/userPurchaseController.js");
const jwtMiddleware = require("../middlewares/jwtMiddleware");

router.get("/", controller.readAllUserPurchases);
router.post("/", jwtMiddleware.verifyToken, controller.createUserPurchase);

router.get("/user/:user_id", controller.readUserPurchasesByUserId);

module.exports = router;
