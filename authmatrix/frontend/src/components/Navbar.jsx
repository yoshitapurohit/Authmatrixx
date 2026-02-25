import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-emerald-400 text-xs font-bold text-white shadow-lg shadow-blue-500/40">
            AM
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-white">AuthMatrix</span>
            <span className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
              Intelligent RBAC Console
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4 text-xs">
          {user && (
            <div className="hidden flex-col items-end text-right md:flex">
              <span className="text-slate-100">{user.name}</span>
              <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-300">
                {user.role}
              </span>
            </div>
          )}
          {user ? (
            <button
              onClick={logout}
              className="rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-slate-100 shadow-sm shadow-slate-900/60 ring-1 ring-slate-700/80 hover:bg-slate-800 hover:ring-slate-500/80"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-primary px-3 py-1.5 text-[11px] font-semibold text-white shadow-lg shadow-blue-500/50 hover:bg-primary-dark"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

