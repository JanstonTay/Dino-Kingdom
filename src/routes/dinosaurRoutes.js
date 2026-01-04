const express = require("express");
const router = express.Router();

const controller = require("../controllers/dinosaurController.js");

// Basic CRUD
router.get("/", controller.readAllDinosaurs);
router.post("/", controller.createDinosaur);

router.get("/:id", controller.readDinosaurById);
router.put("/:id", controller.updateDinosaurById);
router.delete("/:id", controller.deleteDinosaurById);

// Extra: dinosaur + dex info
router.get("/:id/dex", controller.readDinosaurByIdWithDexInfo);

// NOTE: /owner/:owner_id route removed as requested

module.exports = router;
