const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

dotenv.config();

const { connectDB } = require('./utils/db');
const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const resourceRoutes = require('./routes/resourceRoutes');

const app = express();


// ✅ Security headers
app.use(helmet());


// ✅ CORS CONFIGURATION (FINAL FIX)
const allowedOrigins = [
  "https://authmatrixx.vercel.app",
  "http://localhost:5173"
];

app.use(cors({
  origin: function (origin, callback) {

    // allow requests with no origin (Postman, mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS not allowed"));
    }
  },
  credentials: true
}));

// ✅ handle preflight requests
app.options("*", cors());


// ✅ Body parser
app.use(express.json());


// ✅ Logging (only in dev)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}


// ✅ Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);


// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/resources', resourceRoutes);


// ✅ Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});


// ✅ 404 handler
app.use(notFoundHandler);


// ✅ Error handler
app.use(errorHandler);


const PORT = process.env.PORT || 5000;


// ✅ Connect DB and start server
connectDB()
  .then(() => {

    app.listen(PORT, () => {

      console.log(`✅ AuthMatrix backend running on port ${PORT}`);

    });

  })
  .catch((err) => {

    console.error('❌ Failed to start server due to DB connection error', err);

    process.exit(1);

  });


module.exports = app;