import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { adminService } from '../services/adminService';
import Loader from '../components/Loader.jsx';
import RiskBadge from '../components/RiskBadge.jsx';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [usersRes, alertsRes] = await Promise.all([
          adminService.getUsers(),
          adminService.getAlerts(),
        ]);
        setUsers(usersRes.data || []);
        setAlerts(alertsRes.data || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  const highRiskAlerts = alerts.filter((a) => a.riskLevel === 'High' && !a.resolved);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-white mb-2">Admin Dashboard</h1>
          <p className="text-sm text-slate-400">
            Central command for users, access logs, and security alerts.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-400">Users</p>
            <p className="text-2xl font-semibold text-white mt-1">{users.length}</p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-400">Open Risk Alerts</p>
            <p className="text-2xl font-semibold text-white mt-1">
              {alerts.filter((a) => !a.resolved).length}
            </p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-400">High Risk Accounts</p>
            <p className="text-2xl font-semibold text-danger mt-1">{highRiskAlerts.length}</p>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-slate-200 mb-3">Security Alerts</h2>
          {highRiskAlerts.length === 0 ? (
            <p className="text-xs text-slate-400">No active high-risk alerts.</p>
          ) : (
            <ul className="space-y-2 text-xs text-slate-300">
              {highRiskAlerts.slice(0, 5).map((alert) => (
                <li
                  key={alert._id}
                  className="flex items-start justify-between border border-slate-800 rounded-md px-3 py-2"
                >
                  <div>
                    <p className="font-medium">
                      {alert.userId?.email || 'Unknown user'}{' '}
                      <RiskBadge level={alert.riskLevel} score={alert.riskScore} />
                    </p>
                    <p className="text-slate-400 mt-1">{alert.reason}</p>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {new Date(alert.timestamp).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;

