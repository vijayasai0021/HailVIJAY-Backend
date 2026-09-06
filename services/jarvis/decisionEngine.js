const Task = require("../../models/Task");
const Goal = require('../../models/Goal');

const {saveMemory} = require('./memoryEngine');

const {normalizeTaskCategory,normalizeGoalCategory,normalizePriority} = require('./normalizers');

const processAIAction = async({
    userId,
    analysis,
    rawInput
})=>{
    let result = {
        taskCreated:false,
        goalCreated:false,
        goalLinked : false,
        clarificationRequired:false,
        memorySaved: false,
        actions:[]
    };

    try{
        //auto task creation
        const action = analysis.suggestedAction?.toLowerCase().trim();
        
        //ignore
        if(action == 'ignore'){
            result.actions.push("No action required");
            return result;
        }

        //save motivation
        if(action === 'save_motivation'){
            const motivation = analysis.summary || analysis.title || rawInput;
            const memory = await saveMemory({
                userId,
                type:'motivation',
                content:motivation,
                tags: analysis.details?.tags || [],
                importance: normalizePriority(analysis.priority) === 'high'? 8 : 5
            });

            result.actions.push("motivation saved to memory");
            result.memorySaved = true;
            result.memory = memory;

            return result;
        }

        //Create task
        if(action==='create_task'){
            const task = await Task.create({
                userId,
                title: analysis.title || analysis.summary,
                description: rawInput,
                category: normalizeTaskCategory(analysis.category),
                priority: normalizePriority(analysis.priority),
                dueDate:analysis.details?.dueDate ? new Date(analysis.details.dueDate):undefined,
                dueTime: analysis.details?.dueTime || undefined,
                reminderMinutesBefore: analysis.details?.reminderMinutesBefore ?? 30,
                tags:analysis.details?.tags || []
            });

            result.taskCreated = true;

            result.task = task;

            result.actions.push(
                "Task created automatically"
            );

            //try goal linking
            const goals = await Goal.find({
                userId,
                status:'active'
            });

            const taskText = (`${analysis.title||''} ${analysis.summary|| ''} ${rawInput || ''}`).toLowerCase();

            const entitiesText = (analysis.entities || []).map(entity=>{
                if(typeof entity === 'string'){
                    return entity;
                }

                return entity.name || entity.entity || '';
            }).join(' ').toLowerCase();

            const combinedText = `${taskText} ${entitiesText}`;
            
            const matchingGoal = goals.find(goal=>{
                const goalWords = goal.title.toLowerCase().split(/\s+/).filter(word=>word.length>2);
                
                const matchedWords = goalWords.filter(word =>combinedText.includes(word));

                return matchedWords.length>=2;
            });
              

            if(matchingGoal){
                task.goalId = matchingGoal._id;
                await task.save();


                result.goalLinked = true;
                result.linkedGoal = matchingGoal.title;

                result.actions.push(
                    `Linked with goal:${matchingGoal.title}`
                );
            }

        }

        // create a goal

        if(action === 'create_goal'){
            const targetValue = analysis.details?.targetValue;

            //Goal model requires targetValue
            if(!targetValue || Number(targetValue)<=0){
                result.actions.push(
                    "Goal not created:target value is required"
                );
                return result;
            }

            const goal  = await Goal.create({
                userId,
                title: analysis.title || analysis.summary,
                description:rawInput,
                category: normalizeGoalCategory(analysis.category),
                targetValue:Number(targetValue),
                currentValue:0,
                unit: analysis.details.unit || 'tasks',
                dailyTarget:Number(analysis.details?.dailyTarget) || 1,
                startDate:new Date(),
                endDate: analysis.details?.dueDate ? new Date(analysis.details.dueDate):undefined
            });

            result.goalCreated = true;
            result.goal = goal;
            result.actions.push("Goal Created automatically");
        }

        // Ask Clarification
        if(action === 'ask_clarification'){
            result.clarificationRequired = true;

            result.message = analysis.summary  || "I need a little more information before I can do that.";

            result.actions.push("clarification required");

            return result;
        }




        // Schedule Reminder
        if(action==='schedule_reminder'){
            const details = analysis.details || {};

            const dueDate = details.dueDate;
            const dueTime = details.dueTime;

            if(!dueDate || !dueTime){
                result.clarificationRequired = true;

                result.message = `when should i remind you to ${analysis.title||'do this'}? Please provide both a Date and Time.`;
                result.actions.push("Reminder requires date and Time");

                return result;
            }

            const reminderMinutes = Number(details.reminderMinutesBefore) || 30;

            //Search for an existing matching task
            const tasks = await Task.find({
                userId,
                status:{
                    $in:['pending','in_progress']
                }
            });

            const searchText = (analysis.title||analysis.summary||rawInput).toLowerCase();

            const matchingTask = tasks.find(task =>{
                const taskText = (
                    `${task.title} ${task.description}`
                ).toLowerCase();
                return(taskText.includes(searchText)||searchText.includes(task.title.toLowerCase()));
            });

            //Existing task found
            if(matchingTask){
                if(dueDate){
                    matchingTask.dueDate = new Date(dueDate);
                }

                if(dueTime){
                    matchingTask.dueTime = dueTime;
                }

                matchingTask.reminderMinutesBefore = reminderMinutes;
                await matchingTask.save();

                result.actions.push(
                    `Reminder scheduled for task:${matchingTask.title}`
                );


                result.task= matchingTask;
                return result;
            }

            //No existing task
            const task =await Task.create({
                userId,
                title: analysis.title || analysis.summary,
                description: rawInput,
                category: normalizeTaskCategory(analysis.category),
                priority: normalizePriority(analysis.priority),
                dueDate: dueDate ? new Date(dueDate):undefined,
                dueTime:dueTime || undefined,
                reminderMinutesBefore:reminderMinutes,

                tags:details.tags || []
                
            });

            result.taskCreated=true;
            result.task=task;
            result.actions.push("Task created with reminder");
        }

        return result;
        
    }catch(error){
        console.log(error);

        return{
            error:true,
            Message:"Decision engine failed"
        };
    }
};

module.exports = {processAIAction};