const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.get("/", userController.getAllUsers);
router.post("/", [userController.checkForExistingUsername, userController.createNewUser]);

router.get("/:user_id", userController.getUserById);
router.put("/:user_id", [userController.checkUserExists, userController.checkUsernameAvailability, userController.performUpdateUser]);

module.exports = router;