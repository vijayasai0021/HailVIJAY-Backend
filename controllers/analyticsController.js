const DailyLog=require('../models/DailyLog');

const getAnalytics = async(req,res)=>{
    try{

        const logs= await DailyLog.find({
            userId:req.user._id
        }).sort({createdAt:-1}).limit(7);

        const averageScore = logs.length > 0 ? Math.round(logs.reduce((sum,item)=>sum+item.productivityScore,0)/logs) : 0;

        res.status(200).json({
            success:true,
            data:{
                daysTracked:logs.length,
                averageScore,
                weeklyLogs:logs
            }
        });

    }catch(error){
        console.log(error);

        res.status(500).json({
            success:false,
            message:'server Error',
        });
    }
};

module.exports = {
    getAnalytics
};