import "./App.css";
import { useState, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";
import AuthModal from "./components/AuthModal";
import RouteLoader from "./components/RouteLoader";
import { AuthProvider } from "./context/AuthContext";

// Lazy-loaded route components (Practical 8: Performance Optimization & Code Splitting)
const Home = lazy(() => import("./pages/Home"));
const Projects = lazy(() => import("./pages/Projects"));
const Contact = lazy(() => import("./pages/Contact"));

function App() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <AuthProvider>
      <div className={darkMode ? "dark" : "light"}>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

        <Suspense fallback={<RouteLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>

        <Footer />
        <AuthModal />
      </div>
    </AuthProvider>
  );
}

export default App;