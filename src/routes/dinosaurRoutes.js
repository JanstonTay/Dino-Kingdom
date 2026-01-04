const express = require("express");
const router = express.Router();

const controller = require("../controllers/dinosaurController.js");

router.get("/", controller.readAllDinosaurs);
router.post("/", controller.createDinosaur);

router.get("/:id", controller.readDinosaurById);
router.put("/:id", controller.updateDinosaurById);
router.delete("/:id", controller.deleteDinosaurById);

router.get("/:id/dex", controller.readDinosaurByIdWithDexInfo);

module.exports = router;

