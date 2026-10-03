const express = require("express");

const {
    createTask , getTask , getsingleTask ,updateTask , deleteTask 
} = require("../controller/taskController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createTask);
router.get("/", authMiddleware, getTask);
router.get("/:id", authMiddleware, getsingleTask);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

module.exports = router;