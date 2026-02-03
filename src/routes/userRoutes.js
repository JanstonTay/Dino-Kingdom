const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const bcryptMiddleware = require("../middlewares/bcryptMiddleware");
const jwtMiddleware = require("../middlewares/jwtMiddleware");

router.get("/", userController.getAllUsers);
router.post("/", [userController.checkForExistingUsername, userController.createNewUser]);

router.post("/register", [
    userController.checkForExistingUsername,
    bcryptMiddleware.hashPassword,
    userController.createNewUser,
    jwtMiddleware.generateToken,
    jwtMiddleware.sendToken
]);

router.get("/:user_id", userController.getUserById);
router.put("/:user_id", [userController.checkUserExists, userController.checkUsernameAvailability, userController.performUpdateUser]);

module.exports = router;