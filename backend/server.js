const express = require('express');
const cors = require('cors');
const path = require('path');
const reservationRoutes = require('./routes/reservationRoutes');
const dotenv = require('dotenv');
const foodRouter = require('./routes/foodRoute'); // Correct import
const userRouter = require('./routes/userRoutes');

const { sequelize } = require('./models/associations'); // Import sequelize instance to ensure associations are set up


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); 
});

// API Endpoints
app.use('/api/food', foodRouter); // Use the correct router variable
app.use('/images', express.static('uploads'));
app.use('/api/user', userRouter);
app.use('/api/reservation', reservationRoutes);

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