const express = require("express");
const router = express.Router();
const controller = require("../controllers/foodTypeController.js");

router.get("/", controller.readAllFoodTypes);
router.post("/", controller.createFoodType);

router.get("/:food_type_id", controller.readFoodTypeById);
router.put("/:food_type_id", controller.updateFoodTypeById);
router.delete("/:food_type_id", controller.deleteFoodTypeById);

module.exports = router;
