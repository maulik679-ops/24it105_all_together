const bcrypt = require("bcryptjs");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/authMiddleware");
const validateTask = require("./middleware/validateTask");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const Task = require("./models/Task");

const app = express();
const PORT = 5000;

app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
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

// Register
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

// Login
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

// Home Route
app.get("/", (req, res) => {
    res.send("Task Manager API is running...");
});

// GET all tasks - Protected
app.get("/tasks", authMiddleware, async (req, res, next) => {
    try {
        const tasks = await Task.find();

        res.status(200).json(tasks);
    } catch (err) {
        next(err);
    }
});

// GET task by ID - Protected
app.get("/tasks/:id", authMiddleware, async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json(task);
    } catch (err) {
        next(err);
    }
});

// POST a new task - Protected
app.post("/tasks", authMiddleware, validateTask, async (req, res, next) => {
    try {
        const task = await Task.create(req.body);

        res.status(201).json(task);
    } catch (err) {
        next(err);
    }
});

// PUT update a task - Protected
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

        res.status(200).json(task);
    } catch (err) {
        next(err);
    }
});

// DELETE a task - Protected
app.delete("/tasks/:id", authMiddleware, async (req, res, next) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task deleted successfully"
        });
    } catch (err) {
        next(err);
    }
});

// Test Error Route
app.get("/error", (req, res, next) => {
    next(new Error("Test error"));
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        error: "Something went wrong"
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});