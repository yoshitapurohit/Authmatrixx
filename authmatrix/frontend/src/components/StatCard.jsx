import React from 'react';

const StatCard = ({ label, value, accent, helper }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/70 px-4 py-4 shadow-[0_18px_45px_rgba(15,23,42,0.8)]">
      <div className="pointer-events-none absolute inset-px rounded-2xl border border-white/5 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
      <div className="relative flex flex-col gap-1">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400">
          {label}
        </p>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-semibold text-white">{value}</p>
          {accent && (
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-300">
              {accent}
            </span>
          )}
        </div>
        {helper && <p className="text-xs text-slate-500">{helper}</p>}
      </div>
    </div>
  );
};

export default StatCard;

