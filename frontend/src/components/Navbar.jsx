import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="glass-navbar">
      <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>Home</NavLink>
      <span className="nav-separator">|</span>
      <NavLink to="/projects" className={({ isActive }) => (isActive ? "active" : "")}>Projects</NavLink>
      <span className="nav-separator">|</span>
      <NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "")}>Contact</NavLink>
    </nav>
  );
}

export default Navbar;