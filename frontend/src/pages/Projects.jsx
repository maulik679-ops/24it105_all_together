import { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";
import { useAuth } from "../context/AuthContext";

function Projects() {
  const { token, isAuthenticated, openAuthModal, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiDisclaimer, setAiDisclaimer] = useState("");

  const fetchTasks = () => {
    setLoading(true);
    setError(null);

    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    fetch("http://localhost:5000/tasks", { headers })
      .then((res) => {
        if (res.status === 401) {
          // If unauthenticated, clear tasks
          setTasks([]);
          return null;
        }
        if (!res.ok) {
          throw new Error("Failed to fetch tasks from server");
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setTasks(data);
        }
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
  }, [token]);

  const handleGenerateAiDescription = async () => {
    if (!title.trim()) {
      alert("Please enter a task title first so AI can generate a description!");
      return;
    }

    setIsGenerating(true);
    setAiDisclaimer("");

    try {
      const response = await fetch("http://localhost:5000/api/ai/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title }),
      });

      const data = await response.json();
      if (data.description) {
        setDescription(data.description);
        setAiDisclaimer(
          data.fallback
            ? "⚠️ Fallback suggestion applied (AI service offline or rate-limited)."
            : "AI-generated suggestion. Please review and edit before saving."
        );
      }
    } catch (err) {
      setDescription(`Review requirements, milestones, and deliverable items for "${title.trim()}".`);
      setAiDisclaimer("⚠️ Fallback suggestion applied (network connection issue).");
    } finally {
      setIsGenerating(false);
    }
  };

  const addTask = (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    if (!title.trim()) {
      return;
    }

    fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: title,
        description: description,
        completed: false,
      }),
    })
      .then((res) => {
        if (res.status === 401) {
          logout();
          openAuthModal();
          throw new Error("Session expired. Please sign in again.");
        }
        if (!res.ok) {
          return res.json().then((d) => {
            throw new Error(d.error || "Failed to create task");
          });
        }
        return res.json();
      })
      .then((newTask) => {
        setTasks([newTask, ...tasks]);
        setTitle("");
        setDescription("");
        setAiDisclaimer("");
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const updateTask = (task) => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    const newTitle = prompt("Enter new task title:", task.title);

    if (!newTitle || !newTitle.trim()) {
      return;
    }

    fetch(`http://localhost:5000/tasks/${task._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: newTitle,
        description: task.description,
        completed: task.completed,
      }),
    })
      .then((res) => {
        if (res.status === 401) {
          logout();
          openAuthModal();
          throw new Error("Session expired. Please sign in again.");
        }
        if (!res.ok) {
          return res.json().then((d) => {
            throw new Error(d.error || "Failed to update task");
          });
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
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          logout();
          openAuthModal();
          throw new Error("Session expired. Please sign in again.");
        }
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
      <main className="flex-grow pt-32 pb-16 px-margin-mobile md:px-gutter max-w-container-max mx-auto w-full">
        <ErrorMessage message={error} />
        <div className="mt-4 flex justify-center">
          <button
            onClick={fetchTasks}
            className="px-6 py-3 bg-primary text-on-primary font-label-sm text-label-sm rounded-full shadow-lg hover:bg-primary-fixed transition-all cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      </main>
    );
  }

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  const doneCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.filter((task) => !task.completed).length;

  return (
    <main className="flex-grow pt-32 pb-16 px-margin-mobile md:px-gutter max-w-container-max mx-auto w-full">
      {/* Header Section */}
      <header className="mb-12">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-outline-variant/20 bg-surface-container-low font-label-sm text-[11px] uppercase tracking-wider text-primary">
            <span className="material-symbols-outlined text-[14px]">shield</span>
            JWT Protected Route
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 font-label-sm text-[11px] uppercase tracking-wider text-primary">
            <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
            AI Enhanced
          </span>
        </div>
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2 tracking-tight">
          Project Tasks &amp; Deliverables
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          System orchestration, task state management, and full-stack AI-assisted workflows.
        </p>
      </header>

      {/* Unauthenticated Security Banner */}
      {!isAuthenticated && (
        <div className="bento-card rounded-xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-primary/20 bg-primary/5 relative overflow-hidden group">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">key</span>
            </div>
            <div>
              <h3 className="font-headline-md text-base text-on-surface font-semibold">
                Authorization Required for Active Queue
              </h3>
              <p className="font-body-md text-xs text-on-surface-variant mt-0.5">
                Sign in with your developer account to unlock full CRUD capabilities and view persisted MongoDB tasks.
              </p>
            </div>
          </div>
          <button
            onClick={openAuthModal}
            className="px-6 py-2.5 bg-primary text-on-primary font-label-sm text-xs rounded-full shadow-lg shadow-primary/20 hover:bg-primary-fixed active:scale-95 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">lock_open</span>
            <span>Authenticate</span>
          </button>
        </div>
      )}

      {/* Top Bento Row: Metrics & Task Form */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-bento-gap mb-12">
        {/* Metrics Card (4 cols) */}
        <div className="md:col-span-4 bento-card rounded-xl p-8 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-[72px] text-primary">analytics</span>
          </div>
          <div>
            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-1">
              Task Metrics
            </h3>
            <div className="font-headline-lg text-headline-lg text-on-surface font-bold">
              {tasks.length} <span className="font-body-md text-body-md text-outline font-normal">Total Queue</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-outline-variant/10">
            <div>
              <div className="font-headline-lg text-headline-lg text-tertiary">{pendingCount}</div>
              <div className="font-label-sm text-label-sm text-outline mt-1">Pending</div>
            </div>
            <div>
              <div className="font-headline-lg text-headline-lg text-secondary">{doneCount}</div>
              <div className="font-label-sm text-label-sm text-outline mt-1">Done</div>
            </div>
          </div>
        </div>

        {/* Task Creation Module (8 cols) */}
        <div className="md:col-span-8 bento-card rounded-xl p-8 flex flex-col justify-center gap-6">
          <div className="flex items-center justify-between">
            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
              New Task Definition
            </h3>
            {!isAuthenticated && (
              <span className="font-label-sm text-[11px] text-outline flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">lock</span> Read-only mode
              </span>
            )}
          </div>
          
          <form onSubmit={addTask} className="flex flex-col gap-4 w-full">
            {/* Task Title Input */}
            <div className="glow-input rounded-lg border border-outline-variant/30 bg-surface-container-low transition-all duration-300">
              <input
                className="w-full bg-transparent border-none text-on-surface font-body-md py-3 px-4 focus:ring-0 placeholder:text-outline/50 outline-none"
                placeholder={isAuthenticated ? "Enter task title (e.g. Implement OAuth2 Google Login)..." : "Sign in to define new tasks..."}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Description Field & AI Generator Trigger */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">
                  Task Description
                </label>
                <button
                  type="button"
                  disabled={isGenerating || !isAuthenticated}
                  onClick={handleGenerateAiDescription}
                  className="px-3.5 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Generate intelligent description based on title"
                >
                  <span className={`material-symbols-outlined text-[15px] ${isGenerating ? "animate-spin" : ""}`}>
                    {isGenerating ? "sync" : "auto_awesome"}
                  </span>
                  <span>{isGenerating ? "Generating Description..." : "AI Auto-Generate"}</span>
                </button>
              </div>

              <div className="glow-input rounded-lg border border-outline-variant/30 bg-surface-container-low transition-all duration-300">
                <textarea
                  rows="2"
                  className="w-full bg-transparent border-none text-on-surface font-body-md py-2.5 px-4 focus:ring-0 placeholder:text-outline/50 outline-none resize-none text-sm"
                  placeholder={isAuthenticated ? "Write description or click 'AI Auto-Generate' to generate automatically..." : "Sign in to define descriptions..."}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={!isAuthenticated}
                />
              </div>

              {/* AI Suggestion Notice & Disclaimer */}
              {aiDisclaimer && (
                <div className="text-[12px] text-primary flex items-center gap-1.5 px-1 py-0.5">
                  <span className="material-symbols-outlined text-[14px]">info</span>
                  <span>{aiDisclaimer}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-primary text-on-primary font-label-sm text-label-sm rounded-full shadow-lg shadow-primary/20 hover:bg-primary-fixed transition-all duration-300 active:scale-95 whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isAuthenticated ? "add" : "lock"}
                </span>
                <span>{isAuthenticated ? "Add Task" : "Sign In to Add"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Task List Header & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="font-headline-md text-headline-md text-on-surface">Active Queue</h2>
        <div className="relative glow-input rounded-lg border border-outline-variant/30 bg-surface-container-low transition-all duration-300 w-full sm:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline/50 text-[20px]">
            search
          </span>
          <input
            className="w-full bg-transparent border-none text-on-surface font-body-md py-2 pl-10 pr-4 focus:ring-0 placeholder:text-outline/50 outline-none text-sm"
            placeholder="Filter tasks..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Task List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-bento-gap">
        {!isAuthenticated ? (
          <div className="col-span-full bento-card rounded-lg p-12 text-center text-on-surface-variant font-body-md flex flex-col items-center justify-center gap-3">
            <span className="material-symbols-outlined text-[48px] text-outline/40">lock</span>
            <p className="text-on-surface text-base font-medium">Please sign in to view and orchestrate tasks</p>
            <p className="text-sm text-outline max-w-md">
              In accordance with Practical 7 security requirements, task data is secured by JWT token authorization.
            </p>
            <button
              onClick={openAuthModal}
              className="mt-2 px-6 py-2.5 bg-primary text-on-primary font-label-sm text-xs rounded-full shadow hover:bg-primary-fixed transition-all cursor-pointer"
            >
              Open Sign In
            </button>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="col-span-full bento-card rounded-lg p-8 text-center text-on-surface-variant font-body-md">
            No tasks found matching your filter criteria.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task._id}
              className="bento-card rounded-lg p-6 flex flex-col justify-between items-start gap-4 group"
            >
              <div className="w-full">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full border font-label-sm text-[11px] uppercase tracking-wider ${
                        task.completed
                          ? "border-secondary/30 bg-secondary/10 text-secondary"
                          : "border-tertiary/30 bg-tertiary/10 text-tertiary"
                      }`}
                    >
                      {task.completed ? "Done" : "Pending"}
                    </span>
                    <span className="font-code-block text-code-block text-outline-variant text-[12px]">
                      ID-{task._id ? task._id.slice(-4) : "TASK"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => updateTask(task)}
                      className="p-1.5 rounded-full border border-outline-variant/20 text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-all cursor-pointer"
                      title="Update"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="p-1.5 rounded-full border border-outline-variant/20 text-on-surface-variant hover:bg-error/10 hover:text-error hover:border-error/30 transition-all cursor-pointer"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>

                <h4
                  className={`font-body-md text-body-md font-medium ${
                    task.completed ? "line-through text-on-surface-variant/50" : "text-on-surface"
                  }`}
                >
                  {task.title}
                </h4>

                {task.description && (
                  <p className="font-body-sm text-xs text-on-surface-variant mt-2 leading-relaxed bg-surface-container-lowest/50 p-2.5 rounded-lg border border-outline-variant/10">
                    {task.description}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}

export default Projects;
