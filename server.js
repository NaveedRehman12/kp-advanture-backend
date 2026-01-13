require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const http = require('http');
// const { Server } = require('socket.io');

const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const placeRoutes = require('./src/routes/placeRoutes');
const hotelRoutes = require('./src/routes/hotelRoutes');
const jeepRoutes = require('./src/routes/jeepRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const feedbackRoutes = require('./src/routes/feedbackRoutes');
const lostFoundRoutes = require('./src/routes/lostFoundRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const liveUpdateRoutes = require('./src/routes/liveUpdateRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');

const { errorHandler } = require('./src/middlewares/errorMiddleware');

const app = express();
const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"]
//     }
// });

// Attach io to app for use in controllers
// app.set('io', io);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

app.get('/', (req, res) => {
    res.send('application is up');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/jeeps', jeepRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/lost-found', lostFoundRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/live-updates', liveUpdateRoutes);
app.use('/api/notifications', notificationRoutes);

// Socket Logic
// io.on('connection', (socket) => {
//     console.log('User connected:', socket.id);

//     socket.on('join', (userId) => {
//         socket.join(userId);
//         console.log(`User ${userId} joined their room`);
//     });

//     socket.on('disconnect', () => {
//         console.log('User disconnected');
//     });
// });

// Error Handling
// app.use(errorHandler);

const PORT = process.env.PORT || 5000;


server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

module.exports = server;