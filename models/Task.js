const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
    {
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required: true,
        },

        goalId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Goal',
            default:null,
        },

        title:{
            type:String,
            required: true,
            trim:true,
        },

        description:{
            type:String,
            default: '',
        },

        category:{
            type: String,
            enum: ['learning','college','personal','health','other'],
            default:'other',
        },

        priority:{
            type: String,
            enum: ['high','medium','low'],
            default: 'medium',
        },

        status:{
            type:String,
            enum:['pending','in_progress','completed','missed'],
            default:'pending',
        },

        dueDate:{
            type:Date,
        },

        dueTime:{
            type:String,
        },

        reminderMinutesBefore:{
            type:Number,
            default: 30,
        },

        completedAt:{
            type:Date,
            default:null,
        },

        tags:{
            type:[String],
            default:[],
        },

    },
    {
        timestamps:true,
    }
);

module.exports = mongoose.model('Task',taskSchema);