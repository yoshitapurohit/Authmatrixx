import React from 'react';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950/90">
      <Navbar />
      <div className="mx-auto flex max-w-6xl gap-5 px-4 pb-6 pt-4 md:pt-6">
        <div className="hidden w-56 shrink-0 md:block">
          <div className="sticky top-20 rounded-2xl border border-slate-800/80 bg-slate-950/70 p-3 shadow-[0_18px_45px_rgba(15,23,42,0.9)] backdrop-blur-xl">
            <Sidebar />
          </div>
        </div>
        <main className="flex-1">
          <div className="rounded-3xl border border-slate-800/70 bg-slate-950/70 p-5 shadow-[0_25px_60px_rgba(15,23,42,1)] backdrop-blur-2xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

