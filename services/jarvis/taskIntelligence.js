const {askGemini}  = require('./aiProvider');

const analyzeTaskIntent = async({
    rawInput,
    userContext
})=>{
    const prompt = `
    You are JARVIS,
    an autonomous AI Productivity operating system.

    
    
    Your job:
    - understand user intent
    - analyze productivity context
    - understand goals/tasks/history
    - intelligently classify actions

    -----------------------------------
    CURRENT DATE
    -----------------------------------
    ${new Date().toISOString()}
    -----------------------------------
    USER CONTEXT
    -----------------------------------

    ${JSON.stringify(userContext,null,2)}

    -----------------------------------
    CURRENT INPUT
    -----------------------------------

    ${rawInput}

    -----------------------------------
    ALLOWED ACTIONS
    -----------------------------------

    CREATE_TASK
    CREATE_GOAL
    LINK_GOAL
    SAVE_MOTIVATION 
    SCHEDULE_REMINDER
    ASK_CLARIFICATION
    IGNORE

    -----------------------------------
    RULES
    -----------------------------------

    1. Return ONLY valid JSON
    2. No markdown
    3. No explanations outside JSON
    4. Choose ONLY one allowed action
    5. The "suggestedAction" field MUST always contain exactly one allowed action
    6. Never leave "suggestedAction" null
    7. The "type" field should describe the intent type, but "suggestedAction" controls backend execution
    8. Use context heavily
    9. Infer user intent deeply
    10. Extract structured details whenever possible.
    11. For CREATE_GOAL, provide targetValue, unit, and dailyTarget when they can be reasonably inferred.
    12. For SCHEDULE_REMINDER, provide dueDate in YYYY-MM-DD format when a date can be inferred.
    13. Provide dueTime in HH:mm 24-hour format when a time is specified.
    14. Use null when information cannot be determined.
    15. Do not invent deadlines or exact times that the user did not provide or that cannot be reasonably inferred.
    16. If the user requests a reminder but provides neither a usable date nor a usable time, choose ASK_CLARIFICATION instead of SCHEDULE_REMINDER.
    17. If only one of date or time is provided for a reminder, choose ASK_CLARIFICATION and ask for the missing scheduling information.
    18. For CREATE_TASK, extract useful optional details such as dueDate, dueTime, reminderMinutesBefore, and tags.
    19. Use IGNORE when the user's input does not require any productivity action.
    20. Use SAVE_MOTIVATION when the user expresses a meaningful personal commitment, motivation, determination, or statement they may benefit from remembering later.
    -----------------------------------
    OUTPUT FORMAT
    -----------------------------------

    {
    "type":"",
    "title":"",
    "intent":"",
    "category":"",
    "priority":"",
    "suggestedAction":"",
    "confidence":0.0,
    "entities":[],
    "details":{
        "targetValue":null,
        "unit":null,
        "dailyTarget":null,
        "dueDate":null,
        "dueTime":null,
        "reminderMinutesBefore":null,
        "tags":[]
    },
    "reasoning":"",
    "summary":""
    }
    
    `;

    const response = await askGemini(prompt);

    const cleaned = response.replace(/```json/g,'').replace(/```/g,'').trim();
    try{
        return JSON.parse(cleaned);
    }catch(error){
        return{
            type:"fallback",
            intent:"unknown",
            category:"general",
            priority:"medium",
            suggestedAction:"manual_review",
            reasoning:"JSON parsing failed",
            summary:"Fallback generated"
        };
    }
};

module.exports = {analyzeTaskIntent};