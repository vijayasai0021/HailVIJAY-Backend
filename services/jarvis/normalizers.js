const normalizeTaskCategory = (category)=>{
    if(!category) return 'other';

    const value = category.toLowerCase();

    if(value.includes('learning')||
        value.includes('education')||
        value.includes('development') ||
        value.includes('dsa') ||
        value.includes('study') || value.includes('career') || value.includes('placement') || value.includes("interview")
    ){
        return 'learning';
    }

    if(value.includes('college') || 
        value.includes('university')
    ){
        return 'college';
    }

    if(
        value.includes('health') ||
        value.includes('fitness') ||
        value.includes('gym')
    ){
        return 'health';
    }

    if(
        value.includes('personal')
    ){
        return 'personal';
    }

    return 'other';
};


//NOrmalize category for Goal model
const normalizeGoalCategory = (category)=>{
    if(!category) return 'personal';

    const value = category.toLowerCase();

    if(value.includes('learning')||
        value.includes('education')||
        value.includes('study')||
        value.includes('dsa')
    ){
        return 'learning';
    }

    if(value.includes('career')||
        value.includes('placement')||
        value.includes('interview')||
        value.includes('professional')
    ){
        return 'career';
    }

    if(value.includes('fitness')||
        value.includes('gym')||
        value.includes('workout')||
        value.includes('exercise') ||
        value.includes('running')
    ){
        return 'fitness';
    }

    if(value.includes('health')){
        return 'health';
    }
    return 'personal';
}

const normalizePriority = (priority)=>{
    if(!priority) return 'medium';

    const value = priority.toLowerCase();

    if(value.includes('high')){
        return 'high';
    }

    if(value.includes('low')){
        return 'low';
    }

    return 'medium';
};

module.exports = {
    normalizeTaskCategory,
    normalizeGoalCategory,
    normalizePriority
};