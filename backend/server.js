const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const instituteRoutes = require('./routes/institutes');
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    process.env.FRONTEND_URL
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// routes
app.use('/api/institutes', instituteRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// connect to db and start server
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/coachfinder')
  .then(() => {
    console.log('mongodb connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log('server started on port', process.env.PORT || 5000);
    });
  })
  .catch((err) => {
    console.log('db connection failed', err);
  });

module.exports = app;
