import { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";

function Projects() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");

  const fetchTasks = () => {
    setLoading(true);
    setError(null);

    fetch("http://localhost:5000/tasks")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch tasks from server");
        }
        return res.json();
      })
      .then((data) => {
        setTasks(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title })
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create task");
        return res.json();
      })
      .then((newTask) => {
        setTasks((prev) => [newTask, ...prev]);
        setTitle("");
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div className="projects-container">
      <h2>Full-Stack Taskflow Tasks</h2>
      <form onSubmit={handleAddTask} className="task-form">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task title..."
          className="task-input"
        />
        <button type="submit" className="btn-primary">Add Task</button>
      </form>

      {loading && <Spinner />}
      {error && <ErrorMessage message={error} />}

      <div className="task-list">
        {tasks.map((task) => (
          <div key={task._id || task.id} className="task-card">
            <h4>{task.title}</h4>
            <span className={task.completed ? "status-done" : "status-pending"}>
              {task.completed ? "Done" : "Pending"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;
