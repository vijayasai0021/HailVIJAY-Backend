const bcrypt = require('bcryptjs');

const User = require('../models/User');
const generateToken = require('../utils/generateToken');

//register a user
const registerUser = async(req,res)=>{
    try{
        const{name,email,password} = req.body;

        //validation
        if(!name||!email||!password){
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }

        //check existing user
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"user already exists",
            });
        }

        //hashing password
        const salt  = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password,salt);

        //create user
        const user = await User.create({
            name,
            email,
            password:hashedPassword,
        });

        res.status(201).json({
            success:true,
            message: 'User registered successfully',
            token: generateToken(user._id),
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
            },
        });
    }catch(error){
        console.log(error);

        res.status(500).json({
            success:false,
            message:'Server Error',
        });
    }
};


//user login
const loginUser = async(req,res)=>{
    try{
        const{email,password} = req.body;

        //check user
        const user = await User.findOne({email});

        if(!user){
            return res.status(401).json({
                success:false,
                message:"user doesn't exist or invalid credentials",
            });
        }

        //compare Passwords
        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(401).json({
                success:false,
                message:"the password is not correct",
            });
        }


        res.status(200).json({
            success:true,
            message:"Login successful",
            token:generateToken(user._id),
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
            },
        });
    }catch(error){
        console.log(error);

        res.status(500).json({
            success:false,
            message:'Server Error',
        });
    }
};

const getMe = async (req,res)=>{
    res.status(200).json({
        success:true,
        user:req.user,
    });
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
};