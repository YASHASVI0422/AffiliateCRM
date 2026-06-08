const express      = require('express');
const cors         = require('cors');
const morgan       = require('morgan');
const dotenv       = require('dotenv');
const helmet       = require('helmet');
const connectDB    = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');

dotenv.config();

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);

connectDB();

const app = express();

// Set up security headers
app.use(helmet());

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use('/api/auth',      require('./src/routes/auth'));
app.use('/api/users',     require('./src/routes/users'));
app.use('/api/leads',     require('./src/routes/leads'));
app.use('/api/tickets',   require('./src/routes/tickets'));
app.use('/api/analytics', require('./src/routes/analytics'));
app.use('/api/ai',        require('./src/routes/ai'));

app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));
app.use('*', (req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
app.use(errorHandler);

const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }
});

io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    socket.join(userId);
  });
});

app.set('io', io);

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

process.on('unhandledRejection', (err) => { 
  console.error(err.message); 
  server.close(() => process.exit(1)); 
});

module.exports = app;

