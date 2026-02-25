import React from 'react';

const colors = {
  Low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40',
  Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/40',
  High: 'bg-red-500/10 text-red-400 border-red-500/40',
};

const RiskBadge = ({ level, score }) => {
  if (!level) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${colors[level]}`}
    >
      <span className="font-semibold">{level}</span>
      {typeof score === 'number' && <span className="opacity-80">{score}</span>}
    </span>
  );
};

export default RiskBadge;

