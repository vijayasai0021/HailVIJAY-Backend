const{askGemini} = require('../jarvis/aiProvider');

const generateMorningBriefing = async({
    user,
    context,
    memories
})=>{
    const prompt = `
        You are JARVIS,
        an elite AI productivity operating system.

        Generate a short,
        highly personalized
        morning briefing.

        -----------------------------------
        USER
        -----------------------------------

        Name:
        ${user.name}

        -----------------------------------
        MEMORIES
        -----------------------------------

        ${JSON.stringify(memories,null,2)}

        -----------------------------------
        CURRENT CONTEXT
        -----------------------------------

        ${JSON.stringify(context,null,2)}

        -----------------------------------
        RULES
        -----------------------------------

        1. Keep it concise
        2. Sound intelligent
        3. Mention goals/tasks naturally
        4. Be motivational but realistic
        5. Mention streaks if important
        6. Mention overload if detected
        7. No markdown
        8. 5-8 lines maximum
    `;

    const response = await askGemini(prompt);

    return response;
};

module.exports = {
    generateMorningBriefing
};