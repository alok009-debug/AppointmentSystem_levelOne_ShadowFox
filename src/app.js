require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { pool } = require('./config/db');
const appointmentRoutes = require('./routes/appointment.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Attaching DB pool to every request
app.use((req, res, next) => {
  req.db = pool;
  next();
});

// Health check
app.get('/', (req, res) =>
  res.json({ message: 'Appointment API Running' })
);

// Routes
app.use('/api/appointments', appointmentRoutes);

module.exports = app;