const express = require('express');

const protect = require('../middleware/authMiddleware');

const{
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    completeTask,
} = require('../controllers/taskController');

const router = express.Router();

//all routes are protected
router.use(protect);

//create + get all
router.route('/').post(createTask).get(getTasks);

//get one + update +delete
router.route('/:id').get(getTaskById).put(updateTask).delete(deleteTask);

//complete Task
router.put('/:id/complete',completeTask);

module.exports  = router;