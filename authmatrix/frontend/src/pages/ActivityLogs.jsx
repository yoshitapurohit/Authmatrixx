import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import Loader from '../components/Loader.jsx';
import { adminService } from '../services/adminService';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await adminService.getLogs();
        setLogs(res.data || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <Layout>
      <div>
        <h1 className="text-xl font-semibold text-white mb-2">Activity Logs</h1>
        <p className="text-sm text-slate-400 mb-4">
          Audit trail of login attempts, resource access, and admin actions.
        </p>

        {loading ? (
          <Loader />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="min-w-full text-xs text-slate-200">
              <thead className="bg-slate-900/80">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Timestamp</th>
                  <th className="px-3 py-2 text-left font-medium">User</th>
                  <th className="px-3 py-2 text-left font-medium">Role</th>
                  <th className="px-3 py-2 text-left font-medium">Action</th>
                  <th className="px-3 py-2 text-left font-medium">IP</th>
                  <th className="px-3 py-2 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l) => (
                  <tr key={l._id} className="border-t border-slate-800">
                    <td className="px-3 py-2">
                      {new Date(l.timestamp).toLocaleString() || '-'}
                    </td>
                    <td className="px-3 py-2">{l.userId || '-'}</td>
                    <td className="px-3 py-2">{l.role}</td>
                    <td className="px-3 py-2">{l.action}</td>
                    <td className="px-3 py-2">{l.ipAddress || '-'}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] ${
                          l.status === 'success'
                            ? 'bg-emerald-500/10 text-emerald-300'
                            : 'bg-red-500/10 text-red-300'
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ActivityLogs;

