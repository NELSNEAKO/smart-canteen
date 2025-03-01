const express = require('express');
const cors = require('cors');
const path = require('path');
const cartRouter = require('./routes/cartRoute');
const foodRouter = require('./routes/foodRoute'); // Correct import
const userRouter = require('./routes/userRoutes');
// const adminRouter = require('./routes/adminRoute');
const reservationRouter = require('./routes/reservationRoute');
const vendorRouter = require('./routes/vendorRoute');

const connectDB = require('./config/db');

// const { sequelize } = require('./models/associations'); // Import sequelize instance to ensure associations are set up
// console.log('Loaded Environment Variables:', process.env); // Log all environment variables for debugging



const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


// db connection
connectDB();

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); 
});

// API Endpoints
app.use('/api/food', foodRouter); // Use the correct router variable
app.use('/images', express.static('uploads'));
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/reservation', reservationRouter);
app.use('/api/vendor', vendorRouter);
// app.use('/api/admin', adminRouter);

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

// mongodb://Janjo:<db_password>@<hostname>/?
// mongodb://Janjo:<db_password>@<hostname>/?ssl=true&replicaSet=atlas-3wsebt-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0