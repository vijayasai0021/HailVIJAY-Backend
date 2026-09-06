const {askGemini} = require('../jarvis/aiProvider');

const generateIntervention = async({
    context,
    memories
})=>{
    try{
        const{summary} = context;

        //No intervention needed
        if(summary.averageProductivity >= 70 && summary.pendingTasks <=5){
            return null;
        }

        const prompt = `
        You are JARVIS,
        an adaptive AI productivity coach.

        Analyze the user's current state
        and generate a short intervention.

        -----------------------------------
        USER CONTEXT
        -----------------------------------

        ${JSON.stringify(context,null,2)}

        -----------------------------------
        MEMORIES
        -----------------------------------

        ${JSON.stringify(memories,null,2)}

        -----------------------------------
        RULES
        -----------------------------------

        1. Keep response short
        2. Be intelligent and realistic
        3. Do NOT sound generic
        4. If overloaded:
        suggest simplification
        5. If low productivity:
        suggest focus
        6. If streak broken:
        encourage recovery
        7. Max 5 lines
        8. No markdown

        `;

        const response = await askGemini(prompt);
        
        return response;
    }catch(error){
        console.log(error);

        return null;
    }
};

module.exports = {generateIntervention};