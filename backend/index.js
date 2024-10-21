const express = require('express');
const cors = require('cors');
const path = require('path');
const foodRoutes = require('./routes/foodRoutes');
const userRoutes = require('./routes/userRoutes');
const reservationRoutes = require('./routes/reservationRoutes');  // Import reservation routes
const feedBackRoutes = require('./routes/feedBackRoutes');  // Import reservation routes
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve images from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use the routes with '/api' prefix
app.use('/api', foodRoutes);
app.use('/api', reservationRoutes);  // Ensure reservation routes are included
app.use('/api', userRoutes);
app.use('/api', feedBackRoutes); 

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
