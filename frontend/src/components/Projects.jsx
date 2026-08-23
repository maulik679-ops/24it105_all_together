import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import ErrorMessage from "./ErrorMessage";

function Projects() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");

  // Toast notification
  const [toast, setToast] = useState(null);

  // Delete confirmation
  const [deleteId, setDeleteId] = useState(null);

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

  // Show toast
  const showToast = (message, type = "success") => {
    setToast({
      message,
      type,
    });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // CREATE TASK
  const addTask = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast("Please enter a task title", "error");
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
        setTasks((prevTasks) => [...prevTasks, newTask]);
        setTitle("");

        showToast("Task created successfully");
      })
      .catch((err) => {
        setError(err.message);
        showToast("Failed to create task", "error");
      });
  };

  // UPDATE TASK
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
        setTasks((prevTasks) =>
          prevTasks.map((item) =>
            item._id === updatedTask._id ? updatedTask : item
          )
        );

        showToast("Task updated successfully");
      })
      .catch((err) => {
        setError(err.message);
        showToast("Failed to update task", "error");
      });
  };

  // DELETE TASK
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
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task._id !== id)
        );

        setDeleteId(null);

        showToast("Task deleted successfully");
      })
      .catch((err) => {
        setError(err.message);
        setDeleteId(null);
        showToast("Failed to delete task", "error");
      });
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="bento-card">
        <ErrorMessage message={error} />

        <button
          onClick={fetchTasks}
          className="btn btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bento-card tasks-card">

      {/* Toast Notification */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}

      <h2 className="section-title">Tasks</h2>

      {/* Add Task */}
      <form onSubmit={addTask} className="task-form">
        <input
          type="text"
          className="form-input"
          placeholder="Enter task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button
          type="submit"
          className="btn btn-primary"
        >
          Add Task
        </button>
      </form>

      <br />

      {/* Search */}
      <input
        type="text"
        className="form-input search-box"
        placeholder="Search task..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Task List */}
      <div className="tasks-list">
        {filteredTasks.map((task) => (
          <div
            key={task._id}
            className="task-item-card"
          >
            <div className="task-header">

              <h3 className="task-title">
                {task.title}
              </h3>

              <span
                className={`status-chip ${
                  task.completed
                    ? "completed"
                    : "pending"
                }`}
              >
                Status:{" "}
                {task.completed
                  ? "Completed"
                  : "Pending"}
              </span>

            </div>

            <div className="task-actions">

              <button
                onClick={() => updateTask(task)}
                className="btn btn-secondary"
              >
                Update
              </button>

              <button
                onClick={() => setDeleteId(task._id)}
                className="btn btn-danger"
              >
                Delete
              </button>

            </div>

            <hr className="task-divider" />
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="modal-overlay">

          <div className="confirmation-modal">

            <h3>Delete Task?</h3>

            <p>
              Are you sure you want to delete this task?
              This action cannot be undone.
            </p>

            <div className="modal-actions">

              <button
                onClick={() => setDeleteId(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>

              <button
                onClick={() => deleteTask(deleteId)}
                className="btn btn-danger"
              >
                Delete
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Projects;