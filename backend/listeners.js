
const taskEvents = require("./events");

taskEvents.on("task-created", async (task) => {
    try {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        console.log("[Notification] Task created");
        console.log("Task title:", task.title);
        console.log("Assigned user:", task.assignedUser || "Not specified");
        console.log("Task created at:", task.createdAt);
        console.log("Notification completed at:", new Date().toISOString());
    } catch (error) {
        taskEvents.emit("error", error);
    }
});

taskEvents.on("task-deleted", (task) => {
    console.log("[Notification] Task deleted:", task.title || task._id);
    console.log("Timestamp:", new Date().toISOString());
});

taskEvents.on("error", (error) => {
    console.error("[Event Error]", error.message);
});

module.exports = taskEvents;