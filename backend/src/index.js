require('dotenv').config()
const connectDB = require('./config/db')
const app = require('./app')

const PORT = process.env.PORT || 5000

// Global process handlers for better observability
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err)
  process.exit(1)
})
process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason)
})

const http = require('http');
const ioUtils = require('./utils/io');

const server = http.createServer(app);
ioUtils.init(server);

connectDB(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected successfully.')
  })
  .catch((err) => {
    console.warn('MongoDB Connection Failed, but server starting anyway for fallbacks.', err.message)
  })

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
