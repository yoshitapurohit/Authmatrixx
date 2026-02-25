// Central place for all external URLs used in the frontend.
// Update these when you deploy (GitHub repo, Render/Vercel URLs, docs, etc.).

export const EXTERNAL_LINKS = {
  // Backend API base (mirrors VITE_API_BASE_URL but kept here for UI links/docs)
  backendApiBase:
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',

  // Deployment dashboards
  renderDashboard: 'https://dashboard.render.com/',
  vercelDashboard: 'https://vercel.com/dashboard',

  // Project metadata (replace with your real links as needed)
  githubRepo: 'https://github.com/your-org/authmatrix',
  documentation: 'https://your-docs-host/authmatrix',
};

