const express = require('express');

const protect = require('../middleware/authMiddleware');

const {chatWithJarvis,analyzeInput,processInput,getMorningBriefing} = require('../controllers/aiController');


const router = express.Router();

router.post('/chat',protect,chatWithJarvis);
router.post('/analyze',protect,analyzeInput);
router.post('/process',protect,processInput);
router.get('/morning-briefing',protect,getMorningBriefing);

module.exports = router;