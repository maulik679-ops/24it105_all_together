import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, register } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password);
      }
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-opacity duration-300"
      onClick={closeAuthModal}
    >
      {/* Modal Container */}
      <div
        className="bento-card w-full max-w-md rounded-2xl p-8 relative overflow-hidden backdrop-blur-2xl shadow-2xl transition-all transform animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient subtle glow inside card */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #e5e1e4 1px, transparent 0)`,
            backgroundSize: `24px 24px`,
          }}
        ></div>

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 text-on-surface-variant hover:text-on-surface p-1.5 rounded-full hover:bg-surface-container-high transition-colors cursor-pointer"
          title="Close"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Modal Header */}
        <div className="relative z-10 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-outline-variant/20 bg-surface-container-low font-label-sm text-[11px] uppercase tracking-wider text-primary mb-3">
            <span className="material-symbols-outlined text-[14px]">lock</span>
            TaskFlow Security
          </div>
          <h2 className="font-headline-md text-headline-md text-on-surface">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            {mode === 'login'
              ? 'Authenticate to manage your project tasks & deliverables.'
              : 'Register to start creating and orchestrating tasks.'}
          </p>
        </div>

        {/* Mode Switch Tabs */}
        <div className="relative z-10 grid grid-cols-2 p-1 mb-6 rounded-full bg-surface-container-low border border-outline-variant/20">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`py-2 rounded-full font-label-sm text-xs transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-primary text-on-primary font-bold shadow-md'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`py-2 rounded-full font-label-sm text-xs transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-primary text-on-primary font-bold shadow-md'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="relative z-10 mb-5 p-3 rounded-lg border border-error/30 bg-error/10 text-error font-body-md text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider" htmlFor="auth-email">
              Email Address
            </label>
            <div className="glow-input rounded-lg border border-outline-variant/30 bg-surface-container-low transition-all">
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@charusat.edu"
                className="w-full bg-transparent border-none text-on-surface font-body-md py-2.5 px-3.5 focus:ring-0 placeholder:text-outline/40 outline-none text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider" htmlFor="auth-password">
              Password
            </label>
            <div className="glow-input rounded-lg border border-outline-variant/30 bg-surface-container-low transition-all">
              <input
                id="auth-password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent border-none text-on-surface font-body-md py-2.5 px-3.5 focus:ring-0 placeholder:text-outline/40 outline-none text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-primary text-on-primary font-label-sm text-label-sm rounded-full shadow-lg shadow-primary/20 hover:bg-primary-fixed active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In to TaskFlow' : 'Create My Account'}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthModal;
