import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar({ darkMode, setDarkMode }) {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 max-w-[1280px] mx-auto rounded-full mt-4 w-fit bg-surface/70 dark:bg-surface/70 backdrop-blur-xl border border-outline-variant/10 shadow-2xl transition-all duration-300 ease-in-out">
      <div className="text-body-lg font-display font-bold text-on-surface dark:text-on-surface mr-8">
        Maulik Vaghela
      </div>
      <nav className="flex items-center gap-6">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive
              ? "text-primary dark:text-primary-fixed border-b-2 border-primary dark:border-primary-fixed pb-1 font-label-sm text-label-sm hover:bg-primary/5 dark:hover:bg-primary-fixed/5 rounded-full px-4 py-2 transition-all duration-300 ease-in-out active:scale-95"
              : "text-on-surface-variant dark:text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors font-label-sm text-label-sm hover:bg-primary/5 dark:hover:bg-primary-fixed/5 rounded-full px-4 py-2 transition-all duration-300 ease-in-out active:scale-95"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/projects"
          className={({ isActive }) =>
            isActive
              ? "text-primary dark:text-primary-fixed border-b-2 border-primary dark:border-primary-fixed pb-1 font-label-sm text-label-sm hover:bg-primary/5 dark:hover:bg-primary-fixed/5 rounded-full px-4 py-2 transition-all duration-300 ease-in-out active:scale-95"
              : "text-on-surface-variant dark:text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors font-label-sm text-label-sm hover:bg-primary/5 dark:hover:bg-primary-fixed/5 rounded-full px-4 py-2 transition-all duration-300 ease-in-out active:scale-95"
          }
        >
          Projects
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            isActive
              ? "text-primary dark:text-primary-fixed border-b-2 border-primary dark:border-primary-fixed pb-1 font-label-sm text-label-sm hover:bg-primary/5 dark:hover:bg-primary-fixed/5 rounded-full px-4 py-2 transition-all duration-300 ease-in-out active:scale-95"
              : "text-on-surface-variant dark:text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-colors font-label-sm text-label-sm hover:bg-primary/5 dark:hover:bg-primary-fixed/5 rounded-full px-4 py-2 transition-all duration-300 ease-in-out active:scale-95"
          }
        >
          Contact
        </NavLink>
      </nav>

      <div className="flex items-center gap-3 ml-8">
        {isAuthenticated ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-outline-variant/20 bg-surface-container-low">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span className="font-label-sm text-xs text-on-surface max-w-[120px] truncate" title={user?.email}>
              {user?.email?.split('@')[0]}
            </span>
            <button
              onClick={logout}
              title="Logout"
              className="text-on-surface-variant hover:text-error transition-colors flex items-center justify-center p-0.5 ml-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
            </button>
          </div>
        ) : (
          <button
            onClick={openAuthModal}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-outline-variant/30 font-label-sm text-xs text-on-surface hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">lock</span>
            <span>Sign In</span>
          </button>
        )}

        {setDarkMode && (
          <button
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center h-9 w-9 rounded-full hover:bg-primary/5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">{darkMode ? "light_mode" : "dark_mode"}</span>
          </button>
        )}
      </div>
    </header>
  );
}

export default Navbar;