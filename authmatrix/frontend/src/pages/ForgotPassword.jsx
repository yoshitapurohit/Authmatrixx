import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import AlertBanner from '../components/AlertBanner.jsx';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugToken, setDebugToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setDebugToken('');
    setLoading(true);
    try {
      const { data } = await authService.requestPasswordReset(email);
      if (data?.resetToken) {
        setSuccess('Reset link generated. Redirecting you to the reset screen…');
        setDebugToken(data.resetToken);
        setTimeout(() => {
          navigate(`/reset-password/${data.resetToken}`);
        }, 600);
      } else {
        setSuccess(
          'If an account exists for this email, a reset link has been generated.'
        );
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to request password reset';
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
          <h1 className="text-xl font-semibold text-white">Reset your password</h1>
          <p className="mt-1 text-xs text-slate-400">
            Enter your email and we&apos;ll generate a one-time token to reset your password.
          </p>

          <AlertBanner message={error} type="error" />
          <AlertBanner message={success} type="success" />

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
            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-xl bg-gradient-to-r from-primary to-emerald-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/50 transition hover:brightness-110 disabled:opacity-60"
            >
              {loading ? 'Requesting reset…' : 'Send reset link'}
            </button>
          </form>

          {debugToken && (
            <div className="mt-4 rounded-xl border border-slate-700/70 bg-slate-900/80 p-3 text-[11px] text-slate-300">
              <p className="font-semibold text-slate-100">Demo reset URL</p>
              <p className="mt-1 text-slate-400">
                Since email is not configured in this project, copy this URL into your browser to
                continue the reset flow:
              </p>
              <code className="mt-2 block break-all rounded-lg bg-slate-950/80 px-2 py-1">
                {`${window.location.origin}/reset-password/${debugToken}`}
              </code>
            </div>
          )}

          <p className="mt-4 text-center text-[11px] text-slate-400">
            Remembered your password?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

