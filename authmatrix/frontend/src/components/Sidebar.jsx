import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ROLES } from '../utils/constants';

const baseLink =
  'flex items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors';
const activeLink =
  'flex items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-semibold text-white bg-slate-800/90 shadow-[0_12px_30px_rgba(15,23,42,0.9)]';

const ItemIcon = ({ children }) => (
  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-900/80 text-[11px] text-slate-300">
    {children}
  </span>
);

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <nav className="space-y-1 text-xs">
      <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
        Overview
      </p>
      <NavLink
        to="/dashboard"
        className={({ isActive }) => (isActive ? activeLink : baseLink)}
      >
        <ItemIcon>U</ItemIcon>
        <span>User Dashboard</span>
      </NavLink>
      {user?.role === ROLES.ADMIN && (
        <>
          <p className="mt-4 mb-2 px-2 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
            Admin
          </p>
          <NavLink
            to="/admin"
            className={({ isActive }) => (isActive ? activeLink : baseLink)}
          >
            <ItemIcon>A</ItemIcon>
            <span>Admin Dashboard</span>
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) => (isActive ? activeLink : baseLink)}
          >
            <ItemIcon>U</ItemIcon>
            <span>Manage Users</span>
          </NavLink>
          <NavLink
            to="/admin/logs"
            className={({ isActive }) => (isActive ? activeLink : baseLink)}
          >
            <ItemIcon>L</ItemIcon>
            <span>Activity Logs</span>
          </NavLink>
          <NavLink
            to="/admin/alerts"
            className={({ isActive }) => (isActive ? activeLink : baseLink)}
          >
            <ItemIcon>R</ItemIcon>
            <span>Risk Alerts</span>
          </NavLink>
        </>
      )}
    </nav>
  );
};

export default Sidebar;

