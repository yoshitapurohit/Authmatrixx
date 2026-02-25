import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-center">
      <h1 className="text-4xl font-semibold text-white mb-2">404</h1>
      <p className="text-sm text-slate-400 mb-4">
        The page you&apos;re looking for could not be found.
      </p>
      <Link
        to="/"
        className="px-4 py-2 rounded-md bg-primary hover:bg-primary-dark text-white text-sm"
      >
        Go home
      </Link>
    </div>
  );
};

export default NotFound;

