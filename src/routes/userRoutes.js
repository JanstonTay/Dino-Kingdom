const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);

router.get("/:user_id", userController.getUserById);
router.put("/:user_id", userController.updateUserById);

module.exports = router;