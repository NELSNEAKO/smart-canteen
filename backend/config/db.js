const mysql = require('mysql2');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create a connection to the MySQL database using environment variables
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS || '',  // Default to an empty password if none is provided
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,  // Optionally specify the port, defaulting to 3306
});

// Establish the connection and handle any errors
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    console.error('Please check your .env file and ensure that the database is running.');
    return;
  }
  console.log('Connected to the MySQL database');
});

// Handle disconnection and reconnection logic
connection.on('error', (err) => {
  console.error('Database connection error:', err.message);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('Attempting to reconnect to the database...');
    connection.connect((err) => {
      if (err) {
        console.error('Error reconnecting to the database:', err.message);
      } else {
        console.log('Reconnected to the MySQL database');
      }
    });
  } else {
    throw err;
  }
});

// Export the connection object for use in other parts of the application
module.exports = connection;
