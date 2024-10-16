const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer storage for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Directory where files will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));  // Save files with unique names
  }
});

const upload = multer({ storage: storage });

// Function to add a food item with an image and status 
const addFoodItem = (req, res) => {
  const { id, name, price, status } = req.body;  // Include 'status' in the request body
  const image = req.file ? req.file.filename : null;  // Get the uploaded image's filename

  // Check if Food ID, name, price, and status are provided
  if (!id || !name || !price || !status) {
    console.error('Validation Error: Missing Food ID, name, price, or status');
    return res.status(400).json({ message: 'Please provide Food ID, name, price, and status' });
  }

  const query = 'INSERT INTO food_items (id, name, price, status, image) VALUES (?, ?, ?, ?, ?)';
  
  db.query(query, [id, name, price, status, image], (err, result) => {
    if (err) {
      console.error('Database Error:', err.message);
      return res.status(500).json({ message: 'Database error' });
    }

    console.log('Food item added successfully:', { id, name, price, status, image });
    res.status(201).json({ message: 'Food item added successfully', id });
  });
};

// Function to update a food item, including its image and status
const updateFoodItem = (req, res) => {
  const { id } = req.params;
  const { name, price, status } = req.body;
  const image = req.file ? req.file.filename : null;  // Get the uploaded image's filename

  // Check if name, price, and status are provided
  if (!name || !price || !status) {
    console.error('Validation Error: Missing name, price, or status');
    return res.status(400).json({ message: 'Please provide name, price, and status' });
  }

  // Build the query dynamically if an image is provided or not
  let query, params;

  if (image) {
    query = 'UPDATE food_items SET name = ?, price = ?, status = ?, image = ? WHERE id = ?';
    params = [name, price, status, image, id];
  } else {
    query = 'UPDATE food_items SET name = ?, price = ?, status = ? WHERE id = ?';
    params = [name, price, status, id];
  }

  db.query(query, params, (err) => {
    if (err) {
      console.error('Database Error:', err.message);
      return res.status(500).json({ message: 'Database error' });
    }

    console.log('Food item updated successfully:', { id, name, price, status, image });
    res.status(200).json({ message: 'Food item updated successfully' });
  });
};

// Update Availability Status
const updateAvailability = (req, res) => {
  const foodId = req.params.id;
  const { availability } = req.body;

  const query = `
    UPDATE food_items 
    SET availability = ? 
    WHERE id = ?
  `;

  db.query(query, [availability, foodId], (err, result) => {
    if (err) {
      console.error('Error updating reservation status:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.status(200).json({ message: 'Reservation status updated successfully' });
  });
}

// Function to get all food items
const getFoodItems = (req, res) => {
  const query = 'SELECT * FROM food_items';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database Error:', err.message);
      return res.status(500).json({ message: 'Database error' });
    }

    console.log('Retrieved food items:', results);
    res.status(200).json(results);
  });
};

// Function to get food updates (you can modify the query for updates)
const getFoodUpdates = (req, res) => {
  const query = 'SELECT * FROM food_items'; // Modify this query to reflect your updates logic
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database Error:', err.message);
      return res.status(500).json({ message: 'Database error' });
    }

    console.log('Retrieved food updates:', results);
    res.status(200).json(results);
  });
};

// Function to delete a food item and its image
const deleteFoodItem = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  // Query to get the image filename from the database
  const getImageQuery = 'SELECT image FROM food_items WHERE id = ? AND name = ?';

  db.query(getImageQuery, [id, name], (err, results) => {
    if (err) {
      console.error('Database Error:', err.message);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    const image = results[0].image;

    // Delete the record from the database
    const deleteQuery = 'DELETE FROM food_items WHERE id = ? AND name = ?';
    db.query(deleteQuery, [id, name], (err) => {
      if (err) {
        console.error('Database Error:', err.message);
        return res.status(500).json({ message: 'Database error' });
      }

      // Delete the image from the uploads folder if it exists
      if (image) {
        const imagePath = path.join(__dirname, '../uploads', image);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error('Error deleting image:', err.message);
          }
        });
      }

      res.status(200).json({ message: 'Food item deleted successfully' });
    });
  });

};

const getTopSales = (req, res) => {
  const query = `
  SELECT 
    fi.name AS foodName, 
    SUM(r.quantity) AS totalSales,
    fi.price AS price,
    fi.image AS image  -- Select the image column from food_items
  FROM 
    reservations r
  JOIN 
    food_items fi ON r.food_id = fi.id
  GROUP BY 
    fi.name, fi.price, fi.image  -- Group by image as well
  ORDER BY 
    totalSales DESC
  LIMIT 5;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'An error occurred while fetching the top sales.', error: err });
    }

    // Map results to include the full image URL
    const topSales = results.map(item => ({
      foodName: item.foodName,
      totalSales: item.totalSales,
      price: item.price,
      imageUrl: item.image ? `http://localhost:5000/uploads/${item.image}` : null, // Construct the full image URL
    }));

    res.status(200).json({
      topSales, // Send the modified top sales back to the client
    });
  });
};



module.exports = {
  addFoodItem,
  updateFoodItem,
  getFoodItems,
  getFoodUpdates,
  getTopSales,
  deleteFoodItem,
  updateAvailability,
  upload  // Export multer upload function
};
