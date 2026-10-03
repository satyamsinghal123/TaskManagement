let mongoose = require("mongoose")

const connectDB = async()=>{
    
    try{
        await mongoose.connect(process.env.URI)
        console.log("DB connect successfully")
    }catch(err){
        console.log(`DB connection error ${err}`)
    }
    
    
}

module.exports = connectDB