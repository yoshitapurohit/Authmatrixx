import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { authService } from '../services/authService';
import AlertBanner from '../components/AlertBanner.jsx';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Reset token is missing from the URL.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({ token, password });
      setSuccess('Password reset successfully. Redirecting to login…');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to reset password';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950/90">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0_0,#1d4ed8_0,transparent_55%),radial-gradient(circle_at_100%_0,#22c55e_0,transparent_55%)] opacity-40" />
      <div className="relative z-10 w-full max-w-md px-4 py-10">
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-slate-50/10 via-slate-50/5 to-transparent" />
        <div className="relative rounded-3xl border border-slate-700/70 bg-slate-950/80 p-7 shadow-[0_24px_60px_rgba(15,23,42,1)] backdrop-blur-2xl">
          <h1 className="text-xl font-semibold text-white">Choose a new password</h1>
          <p className="mt-1 text-xs text-slate-400">
            Your reset token will expire shortly. Use a strong, unique password.
          </p>

          <AlertBanner message={error} type="error" />
          <AlertBanner message={success} type="success" />

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">
                New password
              </label>
              <input
                type="password"
                className="w-full rounded-xl border border-slate-700/70 bg-slate-900/80 px-3 py-2 text-sm text-white shadow-inner shadow-slate-950/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">
                Confirm password
              </label>
              <input
                type="password"
                className="w-full rounded-xl border border-slate-700/70 bg-slate-900/80 px-3 py-2 text-sm text-white shadow-inner shadow-slate-950/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-xl bg-gradient-to-r from-primary to-emerald-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/50 transition hover:brightness-110 disabled:opacity-60"
            >
              {loading ? 'Updating password…' : 'Reset password'}
            </button>
          </form>

          <p className="mt-4 text-center text-[11px] text-slate-400">
            Back to{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
              login
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

