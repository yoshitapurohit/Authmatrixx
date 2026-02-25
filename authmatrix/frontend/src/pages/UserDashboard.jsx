import React from 'react';
import Layout from '../components/Layout.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import RiskBadge from '../components/RiskBadge.jsx';
import PageHeader from '../components/PageHeader.jsx';
import StatCard from '../components/StatCard.jsx';

const UserDashboard = () => {
  const { user, riskInfo } = useAuth();

  return (
    <Layout>
      <PageHeader
        title="User Dashboard"
        subtitle="Personal security overview, current risk posture, and your effective access."
      />

      <div className="grid gap-5 md:grid-cols-3">
        <StatCard
          label="Current Role"
          value={user?.role || 'Unknown'}
          helper="Determines which parts of the console you can reach."
        />
        <StatCard
          label="Last Known IP"
          value={user?.lastLoginIP || 'Not recorded yet'}
          helper="New IPs contribute to higher risk scores."
        />
        <StatCard
          label="Risk Level"
          value={riskInfo?.riskLevel || 'Low'}
          accent={typeof riskInfo?.riskScore === 'number' ? `${riskInfo.riskScore}/100` : '0/100'}
          helper={riskInfo?.explanation || 'No recent risk indicators.'}
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr,1fr]">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-4">
          <h2 className="text-sm font-semibold text-slate-200">Account profile</h2>
          <p className="mt-1 text-xs text-slate-500">
            Basic identity used for authentication and auditing.
          </p>
          <dl className="mt-4 grid gap-y-2 text-xs text-slate-300">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Name</dt>
              <dd>{user?.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Email</dt>
              <dd>{user?.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Role</dt>
              <dd>{user?.role}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-4">
          <h2 className="text-sm font-semibold text-slate-200">Risk posture</h2>
          <p className="mt-1 text-xs text-slate-500">
            Snapshot of how the rule-based risk engine currently classifies your activity.
          </p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <RiskBadge
              level={riskInfo?.riskLevel || 'Low'}
              score={riskInfo?.riskScore ?? 0}
            />
            <span className="rounded-full bg-slate-900/80 px-2 py-1 text-[10px] text-slate-400">
              Factors: failed logins, IP, request rate, time of day
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-300">
            {riskInfo?.explanation ||
              'You have not triggered any notable risk signals yet. Continue using strong, unique passwords and avoid logging in from untrusted networks.'}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-800/80 bg-slate-950/70 p-4">
        <h2 className="text-sm font-semibold text-slate-200">Effective permissions</h2>
        <p className="mt-1 text-xs text-slate-500">
          Summary of what you can do within the AuthMatrix environment.
        </p>
        <ul className="mt-3 grid gap-2 text-xs text-slate-300 md:grid-cols-2">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Access protected application resources behind JWT-based authentication.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>
              Benefit from login monitoring and anomaly detection via the rule-based risk engine.
            </span>
          </li>
        </ul>
      </div>
    </Layout>
  );
};

export default UserDashboard;

