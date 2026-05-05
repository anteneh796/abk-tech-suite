require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const app = express()
const path = require('path')

// Middlewares
app.use(helmet())
app.use(express.static(path.join(__dirname, '../public')))

// CORS configuration: allow credentials and support optional origin whitelist via ALLOWED_ORIGINS env (comma-separated)
const allowedOriginsEnv = process.env.ALLOWED_ORIGINS
let corsOptions
if (allowedOriginsEnv) {
  const allowedOrigins = allowedOriginsEnv.split(',').map((s) => s.trim()).filter(Boolean)
  corsOptions = {
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or server-to-server)
      if (!origin) return callback(null, true)
      if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true)
      return callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
  }
} else {
  // default development behavior: mirror origin (as before) and allow credentials
  corsOptions = { origin: true, credentials: true }
}
app.use(cors(corsOptions))

app.use(cookieParser())
app.use(express.json({ limit: '10mb' }))

// Rate limiting
const limiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
})
app.use('/api/', limiter)

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 login attempts per hour
  message: { message: 'Too many login attempts, please try again after an hour' }
});

// Routes
const authRoutes = require('./routes/auth')
app.use('/api/v1/auth', authLimiter, authRoutes)
const servicesRoutes = require('./routes/services')
const uploadsRoutes = require('./routes/uploads')
const adminRoutes = require('./routes/admin')
const projectsRoutes = require('./routes/projects')
const inquiryRoutes = require('./routes/inquiry')
const settingsRoutes = require('./routes/settings')
const notificationRoutes = require('./routes/notifications')
const newsRoutes = require('./routes/news')
const partnersRoutes = require('./routes/partners')
const timelineRoutes = require('./routes/timeline')

app.use('/api/v1/services', servicesRoutes)
app.use('/api/v1/uploads', uploadsRoutes)
app.use('/api/v1/admin', adminRoutes)
app.use('/api/v1/projects', projectsRoutes)
app.use('/api/v1/inquiries', inquiryRoutes)
app.use('/api/v1/settings', settingsRoutes)
app.use('/api/v1/notifications', notificationRoutes)
app.use('/api/v1/news', newsRoutes)
app.use('/api/v1/partners', partnersRoutes)
app.use('/api/v1/timeline', timelineRoutes)

// Basic healthcheck
app.get('/', (req, res) => res.send({ ok: true, env: process.env.NODE_ENV || 'development' }))

// Temporary debug route (REMOVE AFTER LOGIN SUCCESS)
app.get('/api/v1/debug-db', async (req, res) => {
    try {
        const User = require('./models/User');
        const count = await User.countDocuments();
        const users = await User.find({}, 'email role').lean();
        res.json({ count, users });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

// Central error handler (after routes)
app.use(require('./middleware/error'))

module.exports = app
