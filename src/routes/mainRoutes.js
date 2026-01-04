const express = require('express');
const router = express.Router();


const userRoutes = require('./userRoutes');
router.use("/users", userRoutes);


const wellnessChallengeRoutes = require("./wellnessChallengeRoutes");
router.use("/challenges", wellnessChallengeRoutes);


const userCompletionRoutes = require("./userCompletionRoutes");
router.use("/challenges", userCompletionRoutes);


const dinosaurRoutes = require('./dinosaurRoutes');
router.use("/dinosaurs", dinosaurRoutes);


const dinosaurDexRoutes = require('./dinosaurDexRoutes');
router.use("/dinosaurDex", dinosaurDexRoutes);


const foodTypeRoutes = require("./foodTypeRoutes");
router.use("/foodTypes", foodTypeRoutes);


const userFoodInventoryRoutes = require("./userFoodInventoryRoutes");
router.use("/userFoodInventory", userFoodInventoryRoutes);


const dinosaurFeedRoutes = require("./dinosaurFeedRoutes");
router.use("/dinosaurFeed", dinosaurFeedRoutes);


const eggTypeRoutes = require("./eggTypeRoutes");
router.use("/eggTypes", eggTypeRoutes);

const userEggInventoryRoutes = require("./userEggInventoryRoutes");
router.use("/userEggInventory", userEggInventoryRoutes);

const hatchEventRoutes = require("./hatchEventRoutes");
router.use("/hatchEvents", hatchEventRoutes);



module.exports = router;
