const express = require("express");
const router = express.Router();
const exploreController = require('../controllers/exploreController');

router.get('/',exploreController.getExplore);

router.post('/addToBook',exploreController.postAddToBook);

module.exports = router;

