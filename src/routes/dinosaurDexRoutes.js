const express = require('express');
const router = express.Router();

const controller = require('../controllers/dinosaurDexController');

router.get('/', controller.readAllDinosaurDex);
router.get('/:number', controller.readDinosaurDexByNumber);

module.exports = router;
