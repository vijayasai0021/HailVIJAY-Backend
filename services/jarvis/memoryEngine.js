const Memory = require('../../models/Memory');

const saveMemory = async({
    userId,
    type,
    content,
    tags=[],
    importance=5
})=>{
    try{
        //check existing
        const existing = await Memory.findOne({
            userId,
            content
        });

        if(existing){
            existing.referenceCount +=1;
            existing.lastReferenced = new Date();

            await existing.save();
            return existing;
        }

        //create new memory

        const memory = await Memory.create({
            userId,
            type,
            content,
            tags,
            importance
        });

        return memory;
    }catch(error){
        console.log(error);
    }
};

const getRelevantMemories = async(userId)=>{
    try{
        const memories = await Memory.find({
            userId,
        }).sort({
            importance:-1,
            referenceCount:-1
        }).limit(10);

        return memories;
    }catch(error){  
        console.log(error);

        return[];
    }
};

module.exports = {
    saveMemory,
    getRelevantMemories
};