const express = require('express');
const router = express.Router();
const { generateNgramPlot } = require('../controllers/ngramController');

router.post('/plot', generateNgramPlot);

module.exports = router;
