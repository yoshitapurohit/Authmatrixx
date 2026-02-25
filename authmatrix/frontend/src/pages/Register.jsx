import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AlertBanner from '../components/AlertBanner.jsx';

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const res = await register(form);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setSuccess('Registration successful. You can now log in.');
    setTimeout(() => navigate('/login'), 1000);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950/90">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0_0,#1d4ed8_0,transparent_55%),radial-gradient(circle_at_100%_0,#22c55e_0,transparent_55%)] opacity-40" />
      <div className="relative z-10 grid w-full max-w-5xl gap-10 px-4 py-10 md:grid-cols-[1.3fr,1fr] md:py-16">
        <div className="hidden flex-col justify-center md:flex">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-sky-200">
            Create a secured workspace
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Onboard your team into <span className="text-primary">AuthMatrix</span>.
          </h1>
          <p className="mt-3 max-w-md text-sm text-slate-300">
            Start with a single admin and evolve into a full RBAC and risk-aware control plane as
            your surface area grows.
          </p>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-slate-50/10 via-slate-50/5 to-transparent" />
          <div className="relative rounded-3xl border border-slate-700/70 bg-slate-950/80 p-7 shadow-[0_24px_60px_rgba(15,23,42,1)] backdrop-blur-2xl">
            <h2 className="text-xl font-semibold text-white">Create your account</h2>
            <p className="mt-1 text-xs text-slate-400">
              This user starts as a standard account; you can promote to admin via MongoDB.
            </p>

            <AlertBanner message={error} type="error" />
            <AlertBanner message={success} type="success" />

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-300">Name</label>
                <input
                  name="name"
                  className="w-full rounded-xl border border-slate-700/70 bg-slate-900/80 px-3 py-2 text-sm text-white shadow-inner shadow-slate-950/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-300">Email</label>
                <input
                  type="email"
                  name="email"
                  className="w-full rounded-xl border border-slate-700/70 bg-slate-900/80 px-3 py-2 text-sm text-white shadow-inner shadow-slate-950/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-300">Password</label>
                <input
                  type="password"
                  name="password"
                  className="w-full rounded-xl border border-slate-700/70 bg-slate-900/80 px-3 py-2 text-sm text-white shadow-inner shadow-slate-950/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full rounded-xl bg-gradient-to-r from-primary to-emerald-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/50 transition hover:brightness-110 disabled:opacity-60"
              >
                {loading ? 'Creating account…' : 'Register'}
              </button>
            </form>

            <p className="mt-4 text-center text-[11px] text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

