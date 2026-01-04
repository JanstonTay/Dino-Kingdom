const express = require("express");
const router = express.Router();

const controller = require("../controllers/eggTypeController.js");

router.get("/", controller.readAllEggTypes);
router.post("/", controller.createEggType);

router.get("/:egg_type_id", controller.readEggTypeById);
router.put("/:egg_type_id", controller.updateEggTypeById);
router.delete("/:egg_type_id", controller.deleteEggTypeById);

module.exports = router;
