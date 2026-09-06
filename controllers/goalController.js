const Goal = require('../models/Goal');


// CREATE GOAL
const createGoal = async (req, res) => {
  try {

    const {
      title,
      description,
      category,
      targetValue,
      unit,
      dailyTarget,
      endDate,
      milestones,
    } = req.body;

    if (!title || !targetValue) {
      return res.status(400).json({
        success: false,
        message: 'Title and targetValue are required',
      });
    }

    const goal = await Goal.create({
      userId: req.user._id,
      title,
      description,
      category,
      targetValue,
      unit,
      dailyTarget,
      endDate,
      milestones,
    });

    res.status(201).json({
      success: true,
      message: 'Goal created successfully',
      goal,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: 'Server Error',
    });

  }
};


// GET ALL GOALS
const getGoals = async (req, res) => {
  try {

    const goals = await Goal.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: goals.length,
      goals,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: 'Server Error',
    });

  }
};


// GET SINGLE GOAL
const getGoalById = async (req, res) => {
  try {

    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found',
      });
    }

    res.status(200).json({
      success: true,
      goal,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: 'Server Error',
    });

  }
};


// UPDATE GOAL
const updateGoal = async (req, res) => {
  try {

    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found',
      });
    }

    const updatedGoal = await Goal.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Goal updated',
      goal: updatedGoal,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: 'Server Error',
    });

  }
};


// DELETE GOAL
const deleteGoal = async (req, res) => {
  try {

    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found',
      });
    }

    await goal.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Goal deleted',
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: 'Server Error',
    });

  }
};


// UPDATE GOAL PROGRESS
const updateGoalProgress = async (req, res) => {
  try {

    const { value } = req.body;

    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found',
      });
    }

    // update progress
    goal.currentValue += value;

    // calculate percentage
    goal.completionPercentage = Math.round(
      (goal.currentValue / goal.targetValue) * 100
    );
      

    // limit max to 100
    if (goal.completionPercentage > 100) {
      goal.completionPercentage = 100;
    }

    // mark completed
    if (goal.currentValue >= goal.targetValue) {
      goal.status = 'completed';
    }

    // streak logic
    const today = new Date();

    const lastDate = goal.streak.lastActivityDate;

    if (!lastDate) {

      goal.streak.current = 1;

    } else {

      const diffTime = today - lastDate;

      const diffDays = Math.floor(
        diffTime / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        goal.streak.current += 1;
      }

      else if (diffDays > 1) {
        goal.streak.current = 1;
      }

    }

    // update longest streak
    if (goal.streak.current > goal.streak.longest) {
      goal.streak.longest = goal.streak.current;
    }

    // save activity date
    goal.streak.lastActivityDate = today;

    // milestone checking
    goal.milestones.forEach((milestone) => {
      if (goal.currentValue >= milestone.value) {
        milestone.achieved = true;
      }
    });

    await goal.save();

    res.status(200).json({
      success: true,
      message: 'Goal progress updated',
      goal,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: 'Server Error',
    });

  }
};


module.exports = {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
  updateGoalProgress,
};