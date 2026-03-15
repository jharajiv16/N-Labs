/**
 * server.js - Express Backend for Agency Site
 * 
 * Production-ready backend using MongoDB & MVC architecture.
 */

// Load environment variables (allows parsing of .env files locally)
require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

// Route Imports
const contactRoutes = require('./routes/contactRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Database Connection ---
const connectDB = async () => {
  try {
    // Falls back to a local mongo instance if MONGO_URI is not set in .env
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/nirmanlabs', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

connectDB();

// --- Middleware Setup ---
app.use(cors()); // Allow cross-origin requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// View Engine Setup (optional now, but keeping for backward compatibility)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static File Serving
// Serve project root static files so files like /agency.css and /script.js are available
app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname, 'Html'))); // Additional asset directory
app.use('/static', express.static(path.join(__dirname, 'Html'))); // Alias
app.use('/bootstrap', express.static(path.join(__dirname, 'bootstrap-5.3.8-dist')));


// --- Routes ---

/**
 * GET /
 * Renders the main landing page via EJS
 */
app.get('/', (req, res) => {
  res.render('agency', { sent: false }); // 'sent' param no longer needed, keeping for compat
});

/**
 * API Routes Mount
 * Directs all /api/contact requests to our MVC router
 */
app.use('/api/contact', contactRoutes);

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
