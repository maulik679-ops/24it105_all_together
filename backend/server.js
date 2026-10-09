const bcrypt = require("bcryptjs");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/authMiddleware");
const validateTask = require("./middleware/validateTask");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
require("./listeners");
const taskEvents = require("./events");

const Task = require("./models/Task");
const cache = require("./cache");

const app = express();
const PORT = 5000;

// Cache statistics
let cacheHits = 0;
let cacheMisses = 0;

app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
        console.log("Connected database:", mongoose.connection.name);
        console.log("Tasks collection:", mongoose.connection.collection("tasks").collectionName);
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err);
    });

// Parse JSON request body
app.use(express.json());

// Content-Type validation middleware
app.use((req, res, next) => {
    if (req.method === "POST" || req.method === "PUT") {
        if (!req.is("application/json")) {
            return res.status(400).json({
                error: "Content-Type must be application/json"
            });
        }
    }

    next();
});

// Global Request Logging Middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
});

// ==================== REGISTER ====================

app.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
});

// ==================== LOGIN ====================

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login successful",
            token
        });
    } catch (error) {
        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
});

// ==================== GET CURRENT USER ====================

app.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get user"
        });
    }
});

// ==================== HOME ROUTE ====================

app.get("/", (req, res) => {
    res.send("Task Manager API is running...");
});

// ==================== GET ALL TASKS - CACHED ====================

app.get("/tasks", authMiddleware, async (req, res, next) => {
    try {
        const cachedTasks = cache.get("all_tasks");

        // Cache HIT
        if (cachedTasks) {
            cacheHits++;

            console.log("Cache HIT: all_tasks");

            return res.status(200).json(cachedTasks);
        }

        // Cache MISS
        cacheMisses++;

        console.log("Cache MISS: all_tasks");

        const tasks = await Task.find();

        // Store tasks in cache
        cache.set("all_tasks", tasks);

        res.status(200).json(tasks);
    } catch (err) {
        next(err);
    }
});

// ==================== GET TASK BY ID - CACHED ====================

app.get("/tasks/:id", authMiddleware, async (req, res, next) => {
    try {
        const cacheKey = `task_${req.params.id}`;

        const cachedTask = cache.get(cacheKey);

        // Cache HIT
        if (cachedTask) {
            cacheHits++;

            console.log(`Cache HIT: ${cacheKey}`);

            return res.status(200).json(cachedTask);
        }

        // Cache MISS
        cacheMisses++;

        console.log(`Cache MISS: ${cacheKey}`);

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        // Store individual task in cache
        cache.set(cacheKey, task);

        res.status(200).json(task);
    } catch (err) {
        next(err);
    }
});

// ==================== CREATE TASK ====================


app.post("/tasks", authMiddleware, validateTask, async (req, res, next) => {
    try {
        const task = await Task.create(req.body);

        // Invalidate cache (Practical 9)
        cache.del("all_tasks");
        console.log("Cache invalidated: all_tasks");

        // Log when the API response is sent
        console.log("[API] Response sent at:", new Date().toISOString());

        // Respond immediately
        res.status(201).json(task);

        // Trigger background notification
        setImmediate(() => {
            taskEvents.emit("task-created", task);
        });

    } catch (err) {
        next(err);
    }
});

// ==================== UPDATE TASK ====================

app.put("/tasks/:id", authMiddleware, validateTask, async (req, res, next) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        // Invalidate all tasks cache
        cache.del("all_tasks");

        // Invalidate individual task cache
        cache.del(`task_${req.params.id}`);

        console.log("Cache invalidated: all_tasks");
        console.log(`Cache invalidated: task_${req.params.id}`);

        res.status(200).json(task);
    } catch (err) {
        next(err);
    }
});

// ==================== DELETE TASK ====================

app.delete("/tasks/:id", authMiddleware, async (req, res, next) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        // Invalidate all tasks cache
        cache.del("all_tasks");

        // Invalidate individual task cache
        cache.del(`task_${req.params.id}`);

        console.log("Cache invalidated: all_tasks");
        console.log(`Cache invalidated: task_${req.params.id}`);

        
        console.log("[API] Task deletion response at:", new Date().toISOString());

        res.status(200).json({
            message: "Task deleted successfully"
        });

        setImmediate(() => {
            taskEvents.emit("task-deleted", task);
        });
    } catch (err) {
        next(err);
    }
});

// ==================== CACHE STATISTICS ====================

app.get("/cache/stats", authMiddleware, (req, res) => {
    res.status(200).json({
        cacheHits,
        cacheMisses
    });
});

// ==================== TEST ERROR ROUTE ====================

app.get("/error", (req, res, next) => {
    next(new Error("Test error"));
});

// ==================== 404 HANDLER ====================

app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});

// ==================== GLOBAL ERROR HANDLER ====================

app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        error: "Something went wrong"
    });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});