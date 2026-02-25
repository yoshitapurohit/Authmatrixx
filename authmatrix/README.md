## AuthMatrix – Intelligent Role-Based Access Control System

AuthMatrix is a  full-stack RBAC system with a rule based risk engine, designed for quickly securing applications around users, roles, activity logging, and intrusion protection.

Backend: Node.js, Express.js, MongoDB, Mongoose, bcrypt, jsonwebtoken, express-rate-limit, cors, dotenv.  
Frontend: React.js, React Router, Axios, Tailwind CSS.



### Project Structure


authmatrix/
  frontend/
    src/
      pages/
      components/
      context/
      services/
      utils/
      App.jsx
    package.json

  backend/
    controllers/
    middleware/
    models/
    routes/
    services/
    utils/
    server.js
    package.json




### Features

- **Authentication**
  - User registration and secure login
  - Passwords hashed with `bcrypt`
  - JWT-based authentication with expiration
  - Login rate limiting and account lockout after repeated failures

- **Role-Based Authorization (RBAC)**
  - Roles: `Admin`, `User`
  - Protected routes and admin-only endpoints
  - Middleware for role-based authorization

- **Activity Logging**
  - Logs for login attempts, resource access, and admin actions
  - Each log includes: user ID, role, action, timestamp, IP, status

- **AI Risk Scoring Engine (Rule-Based)**
  - Risk score \(0–100\) with levels Low, Medium, High
  - Considers:
    - Multiple failed logins
    - New IP addresses
    - Unusual login time
    - Rapid API requests
    - Admin account suspicious activity
  - High risk → automatic account block + `RiskAlert` record

- **Intrusion Protection**
  - Automatic account block on high-risk events
  - Temporary lock on 3 failed login attempts
  - Admin can unblock accounts and resolve alerts

- **Admin Dashboard**
  - Manage users (roles, block/unblock)
  - View activity logs
  - View and resolve risk alerts
  - Visual overview of security posture

### Tech Stack

- **Frontend**
  - React.js
  - React Router
  - Tailwind CSS
  - Axios

- **Backend**
  - Node.js
  - Express.js
  - MongoDB + Mongoose
  - bcrypt
  - jsonwebtoken
  - express-rate-limit
  - cors
  - dotenv

### 🌐 Live Deployment

Frontend (Vercel):  
https://Authmatrixx.vercel.app

Backend (Render):  
https://Authmatrixx.onrender.com

Database:  
MongoDB Atlas



