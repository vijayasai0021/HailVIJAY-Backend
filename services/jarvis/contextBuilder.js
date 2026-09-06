const Task = require('../../models/Task');
const Goal = require('../../models/Goal');
const DailyLog = require('../../models/DailyLog');


const buildUserContext = async(userId)=>{

    //RECENT TASKS
    const tasks =  await Task.find({
        userId
    }).sort({createdAt:-1}).limit(10);

    //ACTIVE GOALS
    const goals = await Goal.find({
        userId,
        status:'active'
    }).limit(10);

    //RECENT LOGS
    const logs = await DailyLog.find({
        userId
    }).sort({createdAt:-1}).limit(7);


    //PRODUCTIVITY AVERAGE
    const averageProductivity = logs.length > 0 ? 
    Math.round(logs.reduce((sum,item)=>sum+item.productivityScore,0)/logs.length) : 0;

    //COMPLETED TASKS
    const completedTasks = tasks.filter(
        task=>task.status === 'completed'
    ).length;

    //PENDING TASKS
    const pendingTasks = tasks.filter(
        task=> task.status !== 'completed'
    ).length;

    return{
        summary:{
            totalTasks:tasks.length,
            completedTasks,
            pendingTasks,
            activeGoals:goals.length,
            averageProductivity
        },

        tasks:tasks.map(task=>({
            title:task.title,
            category:task.category,
            priority:task.priority,
            status:task.status
        })),

        goals:goals.map(goal=>({
            title:goal.title,
            category:goal.category,
            progress:goal.completionPercentage,
            streak:goal.streak.current
        })),

        recentLogs:logs.map(log=>({
            score:log.productivityScore,
            tasksCompleted:log.tasksCompleted
        }))
    };

};

module.exports={
    buildUserContext
};