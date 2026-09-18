
import "./App.css";
import { useState, lazy, Suspense } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";
import Login from "./components/Login";
import Register from "./components/Register";

// Lazy loading for route components
const Projects = lazy(() => import("./components/Projects"));
const Contact = lazy(() => import("./components/Contact"));

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <div className={darkMode ? "dark" : "light"}>
      <Navbar />

      <button
        className="theme-toggle-btn"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
      </button>

      {isLoggedIn && (
        <button
          className="btn btn-secondary"
          onClick={handleLogout}
        >
          Logout
        </button>
      )}

      <main className="app-container">
        <Suspense
          fallback={
            <div className="loading-message">
              Loading page, please wait...
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />

            <Route
              path="/login"
              element={
                isLoggedIn ? (
                  <NavigateToProjects />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />

            <Route path="/register" element={<Register />} />

            <Route path="/projects" element={<Projects />} />

            <Route path="/contact" element={<Contact />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

function NavigateToProjects() {
  const navigate = useNavigate();

  navigate("/projects");

  return null;
}

export default App;