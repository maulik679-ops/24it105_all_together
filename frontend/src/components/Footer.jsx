import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-gutter py-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-transparent border-t border-outline-variant/10 mt-auto">
      <div className="font-display font-bold text-on-surface">
        Maulik Vaghela
      </div>
      <div className="text-on-surface-variant font-body-md text-body-md opacity-80 hover:opacity-100 transition-opacity">
        © 2026 Maulik Vaghela · Built with React &amp; Vite
      </div>
      <nav className="flex items-center gap-6">
        <Link className="text-on-surface-variant font-label-sm text-label-sm hover:text-primary transition-colors opacity-80 hover:opacity-100" to="/">Home</Link>
        <Link className="text-on-surface-variant font-label-sm text-label-sm hover:text-primary transition-colors opacity-80 hover:opacity-100" to="/projects">Projects</Link>
        <Link className="text-on-surface-variant font-label-sm text-label-sm hover:text-primary transition-colors opacity-80 hover:opacity-100" to="/contact">Contact</Link>
      </nav>
    </footer>
  );
}

export default Footer;