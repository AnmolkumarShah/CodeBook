const express = require("express");
const router = express.Router();
const compilerController = require('../controllers/compilerController');

router.get('/',compilerController.getCompile);

router.post('/rerun',compilerController.reRun);

router.post('/',compilerController.compileRun);

module.exports = router;

