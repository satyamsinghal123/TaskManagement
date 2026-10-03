let task = require("../model/taskmodel")

const createTask = async (req,res)=>{
    try{

        let {title , description , dueDate , status , priority} = req.body

        console.log(req.body)

        if(!title || !description || !dueDate){
            return res.status(400).json({
                message : "title description and duedate are mandatory"
            })
        }

        const newTask = await task.create({
            user: req.userId,
            title,
            description,
            status,
            priority,
            dueDate
        });

        return res.status(201).json({
            message : "task created successfully ",
            newTask
        })


    }catch(err){
        return res.status(500).json({
            message : `internal server error ${err}`
        })
    }
}

const getTask = async (req, res) => {
    try {

        const {
            search,
            status,
            priority,
            page = 1,
            limit = 10
        } = req.query;


        const pageNumber = Number(page);
        const limitNumber = Number(limit);


        if (
            !Number.isInteger(pageNumber) ||
            !Number.isInteger(limitNumber) ||
            pageNumber < 1 ||
            limitNumber < 1
        ) {
            return res.status(400).json({
                message: "Page and limit must be valid positive numbers"
            });
        }


        const skip = (pageNumber - 1) * limitNumber;


        const query = {
            user: req.userId
        };


        if (search) {
            query.$or = [
                {
                    title: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    description: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];
        }


        if (status) {
            query.status = status;
        }


        if (priority) {
            query.priority = priority;
        }


        const existtasks = await task.find(query)
            .skip(skip)
            .limit(limitNumber)
            .sort({ createdAt: -1 });


        const totalTasks = await task.countDocuments(query);


        const totalPages = Math.ceil(totalTasks / limitNumber);


        return res.status(200).json({
            message: "Tasks fetched successfully",

            tasks: existtasks,

            pagination: {
                currentPage: pageNumber,
                limit: limitNumber,
                totalTasks: totalTasks,
                totalPages: totalPages
            }
        });


    } catch (err) {

        console.error("GET TASK ERROR:", err);

        return res.status(500).json({
            message: `Internal server error: ${err.message}`
        });
    }
};


const getsingleTask = async (req,res)=>{
    try{
        const existTask = await task.findOne({user : req.userId , _id : req.params.id})

        if (!existTask){
            return res.status(404).json({
                message : "task not exist"
            })
        }
    
        return res.status(200).json({
            message : "tasks fetch successfully",
            existTask
        })
    }catch(err){
        return res.status(500).json({
            message : `internal server error ${err}`
        })
    }
}

const updateTask = async (req,res)=>{
    try{

        let {title , description , dueDate , status , priority} = req.body
        
        
        const existTask = await task.findOne({user : req.userId , _id : req.params.id})



        if (!existTask){
            return res.status(404).json({
                message : "task not exist"
            })
        }

        

        if(title!==undefined){
            existTask.title = title
        }
        if(description!==undefined){
            existTask.description = description
        }
        if(dueDate!==undefined){
            existTask.dueDate = dueDate
        }
        if(status!==undefined){
            existTask.status = status
        }
        if(priority!==undefined){
            existTask.priority = priority
        }

        await existTask.save()

        

        
        return res.status(200).json({
            message : "task updated successfully "
        })


    }catch(err){
        return res.status(500).json({
            message : `internal server error ${err}`
        })
    }
}


const deleteTask = async (req,res)=>{
    try{
        
        const deleteTask = await task.findOneAndDelete({user : req.userId , _id : req.params.id})

        if (!deleteTask){
            return res.status(404).json({
                message : "task not exist"
            })
        }
            
        
        return res.status(200).json({
            message : "task deleted successfully "
        })


    }catch(err){
        return res.status(500).json({
            message : `internal server error ${err}`
        })
    }
}


module.exports = {createTask , getTask , getsingleTask ,updateTask , deleteTask }