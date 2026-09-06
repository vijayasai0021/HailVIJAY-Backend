const {GoogleGenerativeAI} = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
    model:"gemini-2.5-flash"
});

const askGemini = async(prompt)=>{
    try{
        const result = await model.generateContent(prompt);
        const response = await result.response;

        return response.text();
    }catch(error){
        console.log("Gemini Error",error.message);

        return `
        {
            "type":"fallback",
            "intent":"unknown",
            "category":"general",
            "priority":"medium",
            "suggestedAction":"manual_review",
            "reasoning":"AI service temporarily unavailable",
            "summary":"Fallback response generated"
        }
        `;

    }
};

module.exports = {
    askGemini
};