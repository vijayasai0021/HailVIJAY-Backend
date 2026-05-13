const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true,
        },

        email:{
            type:String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password:{
            type: String,
            required: true,
            minlength: 6,
        },

        avatar:{
            type: String,
            default: '',
        },

        timezone:{
            type: String,
            default: 'Asia/Kolkata',
        },

        preferences:{
            morningBriefingTime:{
                type:String,
                default:'07:00',
            },

            theme:{
                type:String,
                default:'dark',
            },

            motivationStyle:{
                type:String,
                default:'aggressive',
            },
            
            aiPersonality:{
                type:String,
                default:'jarvis'
            },
        },
    },
    {
        timestamps:true,
    }
);

module.exports = mongoose.model('User',userSchema);