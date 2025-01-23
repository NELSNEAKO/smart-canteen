const express = require('express');
const cors = require('cors');
const path = require('path');
const foodRoutes = require('./routes/foodRoutes');
const userRoutes = require('./routes/userRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const feedBackRoutes = require('./routes/feedBackRoutes');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); 
});

// Routes
app.use('/api', foodRoutes);
app.use('/api', reservationRoutes);
app.use('/api', userRoutes);
app.use('/api', feedBackRoutes);

// Test Root Route
app.get('/', (req, res) => {
  res.send('API Working');
});

// Handle 404 Errors
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server Started on http://localhost:${PORT}`);
});

