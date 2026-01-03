const express = require('express');
const router = express.Router();

const controller = require('../controllers/dinosaurController');

router.get('/', controller.readAllDinosaurs);
router.post('/', controller.createDinosaur);
router.get('/:id', controller.readDinosaurById);
router.get('/:id/dex', controller.readDinosaurByIdWithDexInfo);

module.exports = router;
