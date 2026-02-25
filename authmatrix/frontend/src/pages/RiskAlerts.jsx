import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import Loader from '../components/Loader.jsx';
import AlertBanner from '../components/AlertBanner.jsx';
import { adminService } from '../services/adminService';
import RiskBadge from '../components/RiskBadge.jsx';

const RiskAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadAlerts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminService.getAlerts();
      setAlerts(res.data || []);
    } catch {
      setError('Failed to load risk alerts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleResolve = async (id) => {
    setError('');
    setSuccess('');
    try {
      await adminService.resolveAlert(id);
      setSuccess('Alert resolved');
      await loadAlerts();
    } catch {
      setError('Failed to resolve alert');
    }
  };

  return (
    <Layout>
      <div>
        <h1 className="text-xl font-semibold text-white mb-2">Risk Alerts</h1>
        <p className="text-sm text-slate-400 mb-4">
          AI-generated alerts triggered by suspicious activity or high risk scores.
        </p>

        <AlertBanner message={error} type="error" />
        <AlertBanner message={success} type="success" />

        {loading ? (
          <Loader />
        ) : alerts.length === 0 ? (
          <p className="text-xs text-slate-400">No risk alerts found.</p>
        ) : (
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div
                key={alert._id}
                className="border border-slate-800 rounded-lg p-3 flex items-start justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold">
                      {alert.userId?.email || 'Unknown user'}
                    </span>
                    <RiskBadge level={alert.riskLevel} score={alert.riskScore} />
                    {alert.resolved && (
                      <span className="text-emerald-400 text-[10px] border border-emerald-500/40 rounded-full px-2 py-0.5">
                        Resolved
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{alert.reason}</p>
                  <p className="mt-1 text-[10px] text-slate-500">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
                {!alert.resolved && (
                  <button
                    onClick={() => handleResolve(alert._id)}
                    className="ml-4 px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-xs"
                  >
                    Mark resolved
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RiskAlerts;

