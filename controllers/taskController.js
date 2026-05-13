const Task = require('../models/Task');

//create  a task
const createTask = async(req,res)=>{
    try{
        const{title,description,category,priority,dueDate,dueTime,tags} = req.body;

        if(!title){
            return res.status(400).json({
                success:false,
                message:"Title is required",
            });
        }

        const task = await Task.create({
            userId:req.user._id,
            title,
            description,
            category,
            priority,
            dueDate,
            dueTime,
            tags,
        });

        res.status(201).json({
            success:true,
            message: 'Task created successfully',
            task,
        });
    }catch(error){
        console.log(error);

        res.status(500).json({
            success:false,
            message:"server error",
        });
    }
};

//get all tasks
const getTasks = async(req,res)=>{
    try{
        const tasks = await Task.find({
            userId:req.user._id,
        }).sort({createdAt:-1});

        res.status(200).json({
            success:true,
            count: tasks.length,
            tasks,
        });
    }catch(error){
        console.log(error);

        res.status(500).json({
            success:false,
            message:'server Error',
        });
    }

};

//get single task
const getTaskById = async(req,res)=>{
    try{
        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if(!task){
            return res.status(404).json({
                success:false,
                message: 'Task not found'
            });
        }

        res.status(200).json({
            success:true,
            task,
        });
    }catch(error){
        console.log(error);

        res.status(500).json({
            success:false,
            message:'server error'
        });
    }
};

//update a task
const updateTask = async(req,res)=>{
    try{
        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if(!task){
            return res.status(404).json({
                success:false,
                message:'Task not found',
            });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new:true,
            }
        );

        res.status(200).json({
            success:true,
            message:'Task updated',
            task:updatedTask,
        });
    }catch(error){
        console.log(error);

        res.status(500).json({
            success:false,
            message:'server error',
        });
    }
};

//delete a task
const deleteTask = async(req,res)=>{
    try{
        const task = await Task.findOne({
            _id:req.params.id,
            userId: req.user._id,
        });

        if(!task){
            return res.status(404).json({
                success:false,
                message: 'Task not found',
            });
        }

        await task.deleteOne();

        res.status(200).json({
            success:true,
            message:'Task Deleted',
        });
    }catch(error){
        console.log(error);

        res.status(500).json({
            success:false,
            message:'server error',
        });
    }
};


//complete a task
const completeTask = async(req,res)=>{
    try{
        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if(!task){
            return res.status(404).json({
                success:false,
                message:'Task not found',
            });
        }

        task.status = 'completed';
        task.completedAt = new Date();
        await task.save();

        res.status(200).json({
            success:true,
            message:"Task completed",
            task,
        });
    }catch(error){
        console.log(error);

        res.status(500).json({
            success:false,
            message:'server error',
        });
    }
};


module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    completeTask,
};