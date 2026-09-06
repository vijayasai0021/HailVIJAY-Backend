const Task = require('../models/Task');
const Goal = require('../models/Goal');

//get Dashboard data
const getDashboardData = async(req,res)=>{
    try{
        const userId = req.user._id;

        //today's date
        const today = new Date();

        const startOfDay = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );

        const endOfDay = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()+1
        );

        //today tasks
        const todayTasks = await Task.find({
            userId,
            createdAt:{
                $gte:startOfDay,
                $lt: endOfDay,
            },
        }).sort({createdAt: -1});

        //active goals
        const activeGoals = await Goal.find({
            userId,
            status: 'active',
        }).sort({createdAt:-1});

        //Task counts
        const completedTasks = todayTasks.filter(
            task => task.status === 'completed'
        ).length;

        const pendingTasks = todayTasks.filter(
            task=> task.status !== 'completed'
        ).length;

        //productivity score

        let productivityScore = 0;

        if(todayTasks.length > 0){
            productivityScore = Math.round(
                (completedTasks / todayTasks.length) * 100
            );
        }

        //streak data
        const currentStreaks = activeGoals.map(goal => ({
            goalTitle: goal.title,
            current: goal.streak.current,
            longest: goal.streak.longest,
        }));

        //summary
        const summary  = {
            totalTasksToday: todayTasks.length,
            activeGoals: activeGoals.length,
            completedTasks,
            pendingTasks,
            productivityScore,
        };

        res.status(200).json({
            success: true,

            data:{
                user:{
                    id: req.user._id,
                    name: req.user.name,
                    email: req.user.email,
                },

                todayTasks,
                activeGoals,
                productivityScore,
                completedTasks,
                pendingTasks,
                currentStreaks,
                summary,
            },
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
    getDashboardData,
};