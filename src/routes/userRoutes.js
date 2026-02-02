const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const bcryptMiddleware = require("../middlewares/bcryptMiddleware");
const jwtMiddleware = require("../middlewares/jwtMiddleware");

// Get all users
router.get("/", userController.getAllUsers);

// Get user by ID
router.get("/:user_id", userController.getUserById);

// Update user by ID
router.put("/:user_id", userController.updateUserById);

// Register new user
router.post("/register",
    userController.checkRegisterBody,
    userController.checkEmailExists,
    userController.checkUsernameExists,
    bcryptMiddleware.hashPassword,
    userController.createUser,
    jwtMiddleware.generateToken,
    jwtMiddleware.sendToken
);

// Login user
router.post("/login",
    userController.checkLoginBody,
    userController.getUserByEmail,
    bcryptMiddleware.comparePassword,
    jwtMiddleware.generateToken,
    jwtMiddleware.sendToken
);

module.exports = router;