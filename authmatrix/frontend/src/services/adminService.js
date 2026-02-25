import api from './api';

export const adminService = {
  getUsers: () => api.get('/admin/users'),
  updateUserRole: (userId, role) => api.patch(`/admin/users/${userId}/role`, { role }),
  setUserBlockStatus: (userId, isBlocked) =>
    api.patch(`/admin/users/${userId}/block`, { isBlocked }),
  getLogs: () => api.get('/admin/logs'),
  getAlerts: () => api.get('/admin/alerts'),
  resolveAlert: (alertId) => api.patch(`/admin/alerts/${alertId}/resolve`),
};

