const express = require('express');

const protect = require('../middleware/authMiddleware');

const { getDashboardData} = require('../controllers/dashboardController');

const router = express.Router();

//protected route
router.get('/',protect,getDashboardData);

module.exports = router;