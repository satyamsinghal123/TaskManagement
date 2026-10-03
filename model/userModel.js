let mongoose = require('mongoose')
let schema = mongoose.Schema

let usermodel = new schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        unique : true,
        required : true,
        trim : true,
        lowercase : true
    },
    password : {
        type : String,
        required : true,
        minlength : 6

    },
} , {
    timestamps : true
})

module.exports = mongoose.model("User" , usermodel)