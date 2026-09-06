const { default: mongoose } = require('mongoose');
const Memory = require('mongoose');
const user = require('./User');

const memorySchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },

    type:{
        type:String,
        enum:[
            'interest',
            'goal',
            'habit',
            'preference',
            'motivation',
            'behavior'
        ],
        required:true
    },

    content:{
        type:String,
        required:true
    },

    importance:{
        type:Number,
        default:5
    },

    tags:{
        type:[String],
        default:[]
    },

    lastReference:{
        type:Date,
        default:Date.now
    },

    referenceCount:{
        type:Number,
        default:1
    }
    
},
    {
        timestamps:true
    }
);

module.exports = mongoose.model('Memory',memorySchema);