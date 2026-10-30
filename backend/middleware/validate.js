// Server-side validation middleware
function validateTaskInput(req, res, next) {
    const { title } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({
            error: 'Validation failed: Task title is required and cannot be empty.'
        });
    }

    req.body.title = title.trim();
    next();
}

function validateAuthInput(req, res, next) {
    const { email, password } = req.body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({
            error: 'Validation failed: A valid email address is required.'
        });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({
            error: 'Validation failed: Password must be at least 6 characters long.'
        });
    }

    req.body.email = email.trim().toLowerCase();
    next();
}

module.exports = {
    validateTaskInput,
    validateAuthInput
};
