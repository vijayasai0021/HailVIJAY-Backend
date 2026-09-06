const express = require('express');

const protect = require('../middleware/authMiddleware');

const {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
  updateGoalProgress,
} = require('../controllers/goalController');

const router = express.Router();


// PROTECT ALL ROUTES
router.use(protect);


// CREATE + GET ALL
router.route('/')
  .post(createGoal)
  .get(getGoals);


// SINGLE GOAL
router.route('/:id')
  .get(getGoalById)
  .put(updateGoal)
  .delete(deleteGoal);


// UPDATE PROGRESS
router.put('/:id/progress', updateGoalProgress);

module.exports = router;