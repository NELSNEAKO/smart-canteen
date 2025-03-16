const express = require('express');
const cookieParser = require("cookie-parser"); // Import cookie-parser
const cors = require('cors');
const path = require('path');
const cartRouter = require('./routes/cartRoute');
const foodRouter = require('./routes/foodRoute'); // Correct import
const userRouter = require('./routes/userRoutes');
const adminRouter = require('./routes/adminRoute');
const reservationRouter = require('./routes/reservationRoute');
const vendorRouter = require('./routes/vendorRoute');
const authRouter = require('./routes/authRoute');
const vendorAuthRoute = require('./routes/vendorAuthRoute');


const connectDB = require('./config/db');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true}));
app.use(cookieParser());
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
app.use('/api/admin', adminRouter);
app.use('/api/auth', authRouter);
app.use('/api/vendor-auth', vendorAuthRoute);



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