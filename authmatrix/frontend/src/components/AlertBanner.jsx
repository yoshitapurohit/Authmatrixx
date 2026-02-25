import React from 'react';

const variants = {
  error: 'bg-red-500/10 border-red-500/50 text-red-300',
  success: 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300',
  info: 'bg-sky-500/10 border-sky-500/50 text-sky-300',
};

const AlertBanner = ({ message, type = 'info' }) => {
  if (!message) return null;
  return (
    <div className={`mb-4 rounded-md border px-3 py-2 text-sm ${variants[type]}`}>
      {message}
    </div>
  );
};

export default AlertBanner;

