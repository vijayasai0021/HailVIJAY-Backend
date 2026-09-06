const Task = require('../models/Task');
const Goal = require('../models/Goal');


const {analyzeTaskIntent} = require('../services/jarvis/taskIntelligence');
const {processAIAction} = require('../services/jarvis/decisionEngine');
const { buildUserContext } = require('../services/jarvis/contextBuilder');
const {saveMemory,getRelevantMemories} = require('../services/jarvis/memoryEngine.js');
const {generateMorningBriefing} = require('../services/jarvis/briefingEngine.js');
const {generateIntervention} = require('../services/jarvis/interventionEngine.js');


const chatWithJarvis = async(req,res)=>{
    try{
        const{message} = req.body;

        if(!message){
            return res.status(400).json({
                success:false,
                message:"message required",
            });
        }

        const tasks = await Task.find({
            userId:req.user._id
        }).limit(5);

        const goals = await Goal.find({
            userId:req.user._id
        }).limit(5);

        let response = "";

        const lower = message.toLowerCase();

        if(lower.includes("today")){
            response =  `you currently have ${tasks.length} recent tasks and ${goals.length} active goals. stay focused and keep moving.`;
        }else if(lower.includes("goal")){
            response = `you currently have ${goals.length} active goals. Progress compounds. keep building momentum.`;
        }else if(lower.includes("lazy")){
            response = `you already started building HailVIJAY from scratch. People talk about ideas. You're building One, Continue.`;
        }else{
            response = `I'm Jarvis. I can already see your tasks and goals. AI brain coming online soon.`
        }
        res.status(200).json({
            success:true,
            data:{
                message:response,
                context:{
                    tasks:tasks.length,
                    goals:goals.length
                }
            }
        });
    }catch(error){
        console.log(error);

        res.status(500).json({
            success: false,
            message:"server error",
        });
    }
};

const analyzeInput = async(req,res)=>{
    try{
        const {input} = req.body;

        if(!input){
            return res.status(400).json({
                success:false,
                message:"Input required"
            });
        }

        // step1 Build user context
        const userContext = await buildUserContext(req.user._id);

        //step2 analyze input with context
        const analytics = await analyzeTaskIntent({
            rawInput: input,
            userContext
        });

        res.status(200).json({
            success:true,
            analytics
        });
    }catch(error){
        console.log(error);

        res.status(500).json({
            success:false,
            message:"server Error"
        });
    }
};


const processInput = async(req,res)=>{
    try{
        const {input} = req.body;

        if(!input){
            return res.status(400).json({
                success:false,
                message:'Input required',
            });
        }

        //step-1 BUILD CONTEXT
        const userContext = await buildUserContext(
            req.user._id
        );

        //step-2 AI ANALYSIS
        const analysis = await analyzeTaskIntent({
            rawInput:input,
            userContext
        });


        //step-3 Decision engine
        const automationResult = await processAIAction({
            userId:req.user._id,
            analysis,
            rawInput:input
        });

        if(analysis.category){
            await saveMemory({
                userId:req.user._id,
                type:'interest',
                content:analysis.category,
                tags:analysis.entitles || [],
                importance: analysis.priority === 'High' ? 8:5
            });
        }

        res.status(200).json({
            success:true,
            analysis,
            automationResult
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"server Error",
        });
    }
};

const getMorningBriefing = async(req,res)=>{
    try{
        //user context
        const userContext = await buildUserContext(
            req.user._id
        );

        //memories
        const memories = await getRelevantMemories(
            req.user._id
        );

        //AI briefing
        const briefing = await generateMorningBriefing({
            user:req.user,
            context:userContext,
            memories
        });

        const intervention = await generateIntervention({
            context:userContext,
            memories
        });

        res.status(200).json({
            success:true,
            briefing,
            intervention
        });
    }catch(error){
        console.log(error);

        res.status(500).json({
            success:false,
            message:'server error'
        });
    }
};

module.exports = {
    chatWithJarvis,
    analyzeInput,
    processInput,
    getMorningBriefing
};

