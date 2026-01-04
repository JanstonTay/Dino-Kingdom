const express = require("express");
const router = express.Router();
const controller = require("../controllers/dinosaurDexController.js");

router.get("/", controller.readAllDinosaurDex);
router.post("/", controller.createDinosaurDex);

router.get("/:number", controller.readDinosaurDexByNumber);
router.put("/:number", controller.updateDinosaurDexByNumber);
router.delete("/:number", controller.deleteDinosaurDexByNumber);

module.exports = router;

