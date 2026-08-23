import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      onLogin();
      navigate("/projects");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bento-card">
      <h2 className="section-title">Login</h2>

      <form onSubmit={handleLogin} className="task-form">
        <input
          type="email"
          className="form-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="form-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      <p>
        Don't have an account?{" "}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </p>
    </div>
  );
}

export default Login;