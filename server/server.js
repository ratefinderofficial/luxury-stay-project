const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http'); // For Socket.io
const { Server } = require('socket.io'); // Socket.io

// Config & DB
const connectDB = require('./config/db');
const corsOptions = require('./config/corsOptions');
const errorHandler = require('./middleware/errorMiddleware');

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

// Route Files
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const housekeepingRoutes = require('./routes/housekeepingRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const billingRoutes = require('./routes/billingRoutes');
const reportRoutes = require('./routes/reportRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');


const app = express();
const server = http.createServer(app); // Create HTTP server for Socket.io

// Real-time Socket Setup
const io = new Server(server, {
  cors: {
    origin: "*", // 👈 Isay '*' kar do taake har jagah se connect ho sake
    methods: ["GET", "POST", "PATCH"]
  }
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json()); // Body parser (JSON data handle karne ke liye)

// Logging (Only in Dev mode)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/rooms', roomRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/housekeeping', require('./routes/housekeepingRoutes'));
app.use('/api/v1/maintenance', require('./routes/maintenanceRoutes'));
app.use('/api/v1/billing', require('./routes/billingRoutes'));
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/feedback', feedbackRoutes);
app.use('/api/v1/settings', require('./routes/settingRoutes'));
app.use('/api/v1/guests', require('./routes/guestRoutes'));

// Socket.io Connection Logic
io.on('connection', (socket) => {
  console.log(`🟢 Socket Connected: ${socket.id}`);

  // User join rooms based on role (e.g., 'housekeeping' room for tasks)
  const { role, userId } = socket.handshake.query;
  
  if (role) {
    socket.join(role);
    console.log(`User ${userId} joined room: ${role}`);
  }

  socket.on('disconnect', () => {
    console.log('🔴 Socket Disconnected');
  });
});

// Make io accessible in controllers (req.app.get('io'))
app.set('io', io);

// Error Handler (Last middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});