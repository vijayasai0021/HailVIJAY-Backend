const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },

    date:{
        type:String,
        required:true
    },

    tasksCompleted:{
        type:Number,
        default:0
    },

    tasksMissed:{
        type:Number,
        default:0
    },

    productivityScore:{
        type:Number,
        default:0
    },

    goalsUpdated:{
        type:Number,
        default:0
    },

    moodRating:{
        type:Number,
        default:null
    },

    notes:{
        type:String,
        default:''
    }
},
{
    timestamps:true
});

module.exports = mongoose.model('DailyLog',dailyLogSchema);