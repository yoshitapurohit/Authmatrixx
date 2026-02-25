import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { adminService } from '../services/adminService';
import Loader from '../components/Loader.jsx';
import AlertBanner from '../components/AlertBanner.jsx';
import { ROLES } from '../utils/constants';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminService.getUsers();
      setUsers(res.data || []);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId, role) => {
    setError('');
    setSuccess('');
    try {
      await adminService.updateUserRole(userId, role);
      setSuccess('Role updated');
      await loadUsers();
    } catch {
      setError('Failed to update role');
    }
  };

  const handleBlockToggle = async (userId, current) => {
    setError('');
    setSuccess('');
    try {
      await adminService.setUserBlockStatus(userId, !current);
      setSuccess(`User ${!current ? 'blocked' : 'unblocked'}`);
      await loadUsers();
    } catch {
      setError('Failed to change block status');
    }
  };

  return (
    <Layout>
      <div>
        <h1 className="text-xl font-semibold text-white mb-2">Manage Users</h1>
        <p className="text-sm text-slate-400 mb-4">
          Change roles and block/unblock accounts.
        </p>

        <AlertBanner message={error} type="error" />
        <AlertBanner message={success} type="success" />

        {loading ? (
          <Loader />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="min-w-full text-xs text-slate-200">
              <thead className="bg-slate-900/80">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Name</th>
                  <th className="px-3 py-2 text-left font-medium">Email</th>
                  <th className="px-3 py-2 text-left font-medium">Role</th>
                  <th className="px-3 py-2 text-left font-medium">Status</th>
                  <th className="px-3 py-2 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-t border-slate-800">
                    <td className="px-3 py-2">{u.name}</td>
                    <td className="px-3 py-2">{u.email}</td>
                    <td className="px-3 py-2">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-xs"
                      >
                        <option value={ROLES.USER}>User</option>
                        <option value={ROLES.ADMIN}>Admin</option>
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      {u.isBlocked ? (
                        <span className="text-red-400 text-xs">Blocked</span>
                      ) : (
                        <span className="text-emerald-400 text-xs">Active</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        onClick={() => handleBlockToggle(u._id, u.isBlocked)}
                        className={`px-3 py-1 rounded-md text-xs ${
                          u.isBlocked
                            ? 'bg-emerald-600/80 hover:bg-emerald-600'
                            : 'bg-red-600/80 hover:bg-red-600'
                        }`}
                      >
                        {u.isBlocked ? 'Unblock' : 'Block'}
                      </button>
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

export default ManageUsers;

