const taskEvents = require('./events');

// Register listener for 'task-created' event
taskEvents.on('task-created', (task) => {
    // Process asynchronously on next tick so the HTTP response cycle is never held up
    setImmediate(() => {
        const timestamp = new Date().toISOString();
        const assignedUser = task.user ? task.user : 'unassigned';
        console.log(`[Notification Listener] Task "${task.title}" (ID: ${task._id}) processed for user <${assignedUser}> at ${timestamp}`);
    });
});

// Register listener for 'task-deleted' event (Supplementary requirement)
taskEvents.on('task-deleted', (taskInfo) => {
    setImmediate(() => {
        const timestamp = new Date().toISOString();
        console.log(`[Notification Listener] Task "${taskInfo.title || taskInfo.id}" deleted notification emitted at ${timestamp}`);
    });
});

// Error event handler to prevent uncaught exceptions
taskEvents.on('error', (err) => {
    console.error('[Notification Listener Error]:', err.message);
});

console.log('Task event listeners registered successfully.');

module.exports = taskEvents;
