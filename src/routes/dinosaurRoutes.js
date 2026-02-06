const express = require("express");
const router = express.Router();

const controller = require("../controllers/dinosaurController.js");
const jwtMiddleware = require("../middlewares/jwtMiddleware");

router.get("/", controller.readAllDinosaurs);
router.post("/", jwtMiddleware.verifyToken, controller.createDinosaur);

router.get("/:id", controller.readDinosaurById);
router.put("/:id", jwtMiddleware.verifyToken, [controller.checkUpdateRequestAndFetchDino, controller.performDinosaurUpdate]);
router.delete("/:id", jwtMiddleware.verifyToken, controller.deleteDinosaurById);

router.get("/:id/dex", [controller.fetchDinosaurForDex, controller.fetchDexInfoAndRespond]);

module.exports = router;

