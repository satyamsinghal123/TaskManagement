const jwt = require("jsonwebtoken")

let authmiddleware = (req ,res , next)=>{
    try{

        const header = req.headers.authorization
        
        if (!header){
            return res.status(401).json({
                message : "Authentication is required "
            })
        }

        const token = header.split(" ")[1]

        if(!token){
            return res.status(401).json({
                message : "invalid format"
            })
        }

        let decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        )

        req.userId = decoded.user_id

        console.log("pass")

        next()

    }catch(err){
        return res.status(401).json({
            message : "expired or invalid token "
        })
    }
}

module.exports = authmiddleware