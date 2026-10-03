require("dotenv").config();

let express = require("express")
let app = express()
const port = process.env.PORT || 8080;
let connectDB = require("./config/db")


let authroute = require("./routes/authRoutes")
let taskroute = require("./routes/taskRoute")

app.use(express.json())

app.use("/api/auth" , authroute)
app.use("/api/tasks" , taskroute)






const startServer = async () => {
  try {
    await connectDB()

    app.listen(port, () => {
      console.log(`Server running on port ${port}`)
    });
  } catch (error) {
    console.error("Failed to start server")
  }
};

startServer();