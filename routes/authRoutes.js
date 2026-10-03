let express = require("express")
let authmiddleware = require("../middleware/authMiddleware")
let {registerUser , loginUser , userProfile} = require("../controller/authController")

const router = express.Router()

router.post("/register" , registerUser)
router.post("/login" , loginUser)
router.get("/profile" , authmiddleware , userProfile)

module.exports = router