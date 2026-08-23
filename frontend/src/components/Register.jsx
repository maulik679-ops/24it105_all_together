import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await fetch("http://localhost:5000/register", {
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
        throw new Error(data.message || "Registration failed");
      }

      setMessage("Registration successful. You can now login.");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bento-card">
      <h2 className="section-title">Register</h2>

      <form onSubmit={handleRegister} className="task-form">
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
          Register
        </button>
      </form>

      {message && <p>{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <p>
        Already have an account?{" "}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </p>
    </div>
  );
}

export default Register;