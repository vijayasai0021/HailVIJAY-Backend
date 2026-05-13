require('dotenv').config();

const express = require("express");
const cors = require('cors');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());


//routes
app.use('/api/auth',authRoutes);
app.use('/api/tasks',taskRoutes);

app.get('/',(req,res)=>{
    res.json({
        success: true,
        message: 'HailVIJAY Backend Running'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
});