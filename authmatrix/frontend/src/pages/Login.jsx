import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AlertBanner from '../components/AlertBanner.jsx';

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    navigate('/dashboard');
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950/90">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0_0,#1d4ed8_0,transparent_55%),radial-gradient(circle_at_100%_0,#22c55e_0,transparent_55%)] opacity-40" />
      <div className="relative z-10 grid w-full max-w-5xl gap-10 px-4 py-10 md:grid-cols-[1.3fr,1fr] md:py-16">
        <div className="hidden flex-col justify-center md:flex">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-emerald-200">
            Welcome back
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Sign in to <span className="text-primary">AuthMatrix</span>.
          </h1>
          <p className="mt-3 max-w-md text-sm text-slate-300">
            One place for your account, activity, and security alerts. No buzzwords, just a clean
            dashboard.
          </p>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-slate-50/10 via-slate-50/5 to-transparent" />
          <div className="relative rounded-3xl border border-slate-700/70 bg-slate-950/80 p-7 shadow-[0_24px_60px_rgba(15,23,42,1)] backdrop-blur-2xl">
            <h2 className="text-xl font-semibold text-white">Sign in</h2>
            <p className="mt-1 text-xs text-slate-400">
              Use your AuthMatrix credentials to continue.
            </p>

            <AlertBanner message={error} type="error" />

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-300">Email</label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-slate-700/70 bg-slate-900/80 px-3 py-2 text-sm text-white shadow-inner shadow-slate-950/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-300">Password</label>
                <input
                  type="password"
                  className="w-full rounded-xl border border-slate-700/70 bg-slate-900/80 px-3 py-2 text-sm text-white shadow-inner shadow-slate-950/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full rounded-xl bg-gradient-to-r from-primary to-emerald-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/50 transition hover:brightness-110 disabled:opacity-60"
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            <div className="mt-4 flex flex-col items-center gap-1 text-[11px] text-slate-400">
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-sky-400 hover:text-sky-300"
              >
                Forgot password?
              </button>
              <p>
                No account yet?{' '}
                <Link
                  to="/register"
                  className="font-medium text-primary hover:text-primary-dark"
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

