const jwt = require('jsonwebtoken');

const User = require('../models/User');

const protect = async(req,res,next)=>{
    let token;

    try{
        //check authorization header
        if(req.headers.authorization && 
            req.headers.authorization.startsWith('Bearer')
        ){
            //extract token
            token = req.headers.authorization.split(' ')[1];

            //verify token
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            //attach user to request
            req.user = await User.findById(decoded.id).select('-password');

            next();
        }else{
            return res.status(401).json({
                success:false,
                message:'No token provided',
            });
        }
    }catch(error){
        console.log(error);

        return res.status(401).json({
            success:false,
            message: 'Token Invalid',
        });
    }
};

module.exports = protect;