const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Task = require('./models/Task');
const User = require('./models/User');
const auth = require('./middleware/auth');
const { validateTaskInput, validateAuthInput } = require('./middleware/validate');
const { cache, cacheStats } = require('./cache');
const taskEvents = require('./events');
require('./listeners'); // Register background event listeners (Practical 10)

const app = express();
const PORT = process.env.PORT || 5000;

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

// Content-Type validation middleware for POST and PUT
app.use((req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT') {
        if (!req.is('application/json')) {
            return res.status(400).json({
                error: 'Content-Type must be application/json'
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

// Home Route
app.get('/', (req, res) => {
    res.send('Task Manager API is running...');
});

// ==========================================
// CACHE STATS ENDPOINT (Practical 9)
// ==========================================
app.get('/cache/stats', (req, res) => {
    res.status(200).json({
        hits: cacheStats.hits,
        misses: cacheStats.misses,
        keys: cache.keys(),
        stats: cache.getStats()
    });
});

// ==========================================
// AUTHENTICATION ROUTES (Practical 7)
// ==========================================

// POST /register - Register a new user
app.post('/register', validateAuthInput, async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                error: 'User already exists with this email address.'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            password: hashedPassword
        });

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                email: user.email
            }
        });
    } catch (err) {
        next(err);
    }
});

// POST /login - Authenticate user and issue JWT
app.post('/login', validateAuthInput, async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                error: 'Invalid credentials. User not found.'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                error: 'Invalid credentials. Incorrect password.'
            });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email
            }
        });
    } catch (err) {
        next(err);
    }
});

// GET /me - Get authenticated user's details
app.get('/me', auth, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (err) {
        next(err);
    }
});

// ==========================================
// TASK ROUTES WITH CACHING & EVENTS
// ==========================================

// GET all tasks (Cached with 60s TTL)
app.get('/tasks', auth, async (req, res, next) => {
    try {
        const cachedTasks = cache.get('all_tasks');
        if (cachedTasks) {
            cacheStats.hits++;
            res.set('X-Cache', 'HIT');
            return res.status(200).json(cachedTasks);
        }

        cacheStats.misses++;
        const tasks = await Task.find().sort({ createdAt: -1 });
        cache.set('all_tasks', tasks);
        res.set('X-Cache', 'MISS');
        res.status(200).json(tasks);
    } catch (err) {
        next(err);
    }
});

// GET task by ID (Cached)
app.get('/tasks/:id', auth, async (req, res, next) => {
    try {
        const cacheKey = `task_${req.params.id}`;
        const cachedTask = cache.get(cacheKey);
        if (cachedTask) {
            cacheStats.hits++;
            res.set('X-Cache', 'HIT');
            return res.status(200).json(cachedTask);
        }

        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        cacheStats.misses++;
        cache.set(cacheKey, task);
        res.set('X-Cache', 'MISS');
        res.status(200).json(task);
    } catch (err) {
        next(err);
    }
});

// POST a new task (Asynchronous Event Processing via EventEmitter - Practical 10)
app.post('/tasks', auth, validateTaskInput, async (req, res, next) => {
    try {
        const taskData = {
            ...req.body,
            user: req.user.id
        };
        const task = await Task.create(taskData);

        // Invalidate all_tasks cache on new write
        cache.del('all_tasks');

        // Immediate API response sent to client (Fast non-blocking response)
        console.log(`[API Response] POST /tasks 201 sent at ${new Date().toISOString()}`);
        res.status(201).json(task);

        // Emit asynchronous background event after response is dispatched
        taskEvents.emit('task-created', task);
    } catch (err) {
        next(err);
    }
});

// PUT update a task (Invalidates 'all_tasks' and single task cache)
app.put('/tasks/:id', auth, validateTaskInput, async (req, res, next) => {
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

        // Invalidate cache
        cache.del('all_tasks');
        cache.del(`task_${req.params.id}`);

        res.status(200).json(task);
    } catch (err) {
        next(err);
    }
});

// DELETE a task (Emits task-deleted event)
app.delete('/tasks/:id', auth, async (req, res, next) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        // Invalidate cache
        cache.del('all_tasks');
        cache.del(`task_${req.params.id}`);

        console.log(`[API Response] DELETE /tasks/:id 200 sent at ${new Date().toISOString()}`);
        res.status(200).json({
            message: "Task deleted successfully"
        });

        // Emit background deletion event
        taskEvents.emit('task-deleted', { id: task._id, title: task.title });
    } catch (err) {
        next(err);
    }
});

// Test Error Route
app.get('/error', (req, res, next) => {
    next(new Error("Test error"));
});

// 404 Handler for undefined routes
app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        error: err.message || "Something went wrong"
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});