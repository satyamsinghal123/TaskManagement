let mongoose = require("mongoose")
let user = require("../model/userModel")
let bcrypt = require("bcrypt")
let jwt = require("jsonwebtoken")

const registerUser = async(req ,res)=>{
    const {name , email , password} = req.body

    try{

        if (!name || !email || !password){
        return res.status(400).json({
            message : "name , email and password field are madatory"
        })
    }

    let existUser = await user.findOne({email})

    if(existUser){
        return res.status(409).json({
            message : "this email is already registered"
        })
    }

    const hashpassword = await bcrypt.hash(password , 10)

    const createUser = await user.create({
        name,
        email,
        password : hashpassword
    })

    return res.status(201).json({
        message : "user created successfully"
    })

    }catch(err){
       return res.status(500).json({
        message : "internal server error",
        error : err
       })
    }
    
}

const loginUser = async(req,res)=>{
    try{

        let {email , password} = req.body

        if(!email || !password){
            return res.status(400).json({
                message : "email and password both are required"
            })
        }

        const existUser = await user.findOne({email})

        if(!existUser){
            return res.status(401).json({
                message : "user not exists"
            })
        }
        console.log("pass")
        const isPasswordCorrect = await bcrypt.compare(
            password,
            existUser.password
        ) 

        console.log("pass2")


        if(!isPasswordCorrect){
            return res.status(401).json({
                message : "password or email are invalid"
            })
        }

        const token = jwt.sign(
            {user_id : existUser._id},
            process.env.JWT_SECRET,
            {expiresIn : "7d"}
        )

        return res.status(200).json({
            message : "Login successfully",
            token
        })

    }catch(err){
        return res.status(500).json({
            message : `internal login server error ${err}`,
            
        })
    }
}

const userProfile = async(req, res)=>{
    try{

        const existuser = await user.findById(req.userId).select("-password");

        if(!existuser){
            return res.status(404).json({
                message : "user not found"
            })
        }

        return res.status(200).json({
            message : "user profile fetch successfully ",
            existuser
        })

    }catch(err){
        return res.status(500).json({
            message: `Internal server error ${err}`,
        });
    }
}

module.exports = { 
    registerUser,
    loginUser,
    userProfile
}