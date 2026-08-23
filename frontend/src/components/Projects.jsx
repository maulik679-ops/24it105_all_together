import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import ErrorMessage from "./ErrorMessage";

function Projects() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");

  const fetchTasks = () => {
    setLoading(true);
    setError(null);

    fetch("http://localhost:5000/tasks")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch tasks");
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

  const addTask = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        completed: false,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to create task");
        }
        return res.json();
      })
      .then((newTask) => {
        setTasks([...tasks, newTask]);
        setTitle("");
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const updateTask = (task) => {
    const newTitle = prompt("Enter new task title:", task.title);

    if (!newTitle || !newTitle.trim()) {
      return;
    }

    fetch(`http://localhost:5000/tasks/${task._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newTitle,
        completed: task.completed,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to update task");
        }
        return res.json();
      })
      .then((updatedTask) => {
        setTasks(
          tasks.map((item) =>
            item._id === updatedTask._id ? updatedTask : item
          )
        );
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const deleteTask = (id) => {
    fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete task");
        }
        return res.json();
      })
      .then(() => {
        setTasks(tasks.filter((task) => task._id !== id));
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="bento-card">
        <ErrorMessage message={error} />
        <button onClick={fetchTasks} className="btn btn-primary">Retry</button>
      </div>
    );
  }

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bento-card tasks-card">
      <h2 className="section-title">Tasks</h2>

      <form onSubmit={addTask} className="task-form">
        <input
          type="text"
          className="form-input"
          placeholder="Enter task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Add Task</button>
      </form>

      <br />

      <input
        type="text"
        className="form-input search-box"
        placeholder="Search task..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="tasks-list">
        {filteredTasks.map((task) => (
          <div key={task._id} className="task-item-card">
            <div className="task-header">
              <h3 className="task-title">{task.title}</h3>
              <span className={`status-chip ${task.completed ? "completed" : "pending"}`}>
                Status: {task.completed ? "Completed" : "Pending"}
              </span>
            </div>

            <div className="task-actions">
              <button onClick={() => updateTask(task)} className="btn btn-secondary">Update</button>
              <button onClick={() => deleteTask(task._id)} className="btn btn-danger">Delete</button>
            </div>
            <hr className="task-divider" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;