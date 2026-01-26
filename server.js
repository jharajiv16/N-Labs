/**
 * server.js - Express Backend for Agency Site
 * 
 * Handles static asset serving and contact form submissions.
 * Stores form data in a local JSON file (data/submissions.json).
 */

const express = require('express');
const path = require('path');
const fs = require('fs').promises;

// Constants for file storage
const DATA_DIR = path.join(__dirname, 'data');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');

const app = express();
const PORT = process.env.PORT || 3000;

// View Engine Setup (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static File Serving
// Serve project root static files so files like /agency.css and /script.js are available
app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname, 'Html'))); // Additional asset directory
app.use('/static', express.static(path.join(__dirname, 'Html'))); // Alias
app.use('/bootstrap', express.static(path.join(__dirname, 'bootstrap-5.3.8-dist')));


// --- Routes ---

/**
 * GET /
 * Renders the main landing page.
 * Checks for ?sent=1 query param to show success message.
 */
app.get('/', (req, res) => {
  const sent = req.query.sent === '1';
  res.render('agency', { sent });
});

/**
 * POST /contact
 * Handles contact form submissions.
 * Validates input and saves to JSON file.
 */
app.post('/contact', async (req, res) => {
  try {
    const { name = '', email = '', phone = '', subject = '', message = '' } = req.body || {};
    
    // Sanitize input
    const trimmed = {
      name: String(name).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
      subject: String(subject).trim(),
      message: String(message).trim(),
    };

    // --- Validation ---
    if (!trimmed.name) {
      return res.status(400).render('agency', { sent: false, error: 'Name is required' });
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(trimmed.email)) {
      return res.status(400).render('agency', { sent: false, error: 'Please provide a valid email address' });
    }
    if (!trimmed.message) {
      return res.status(400).render('agency', { sent: false, error: 'Message cannot be empty' });
    }

    // --- Data Persistence ---
    // Ensure data directory exists
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    let submissions = [];
    try {
      // Read existing submissions
      const raw = await fs.readFile(SUBMISSIONS_FILE, 'utf8');
      submissions = JSON.parse(raw || '[]');
      if (!Array.isArray(submissions)) submissions = [];
    } catch (err) {
      // File doesn't exist yet, start fresh
      submissions = [];
    }

    // Create new record
    const record = {
      name: trimmed.name,
      email: trimmed.email,
      phone: trimmed.phone,
      subject: trimmed.subject,
      message: trimmed.message,
      timestamp: new Date().toISOString(),
    };

    submissions.push(record);
    
    // Write back to file
    await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2), 'utf8');

    console.log('Saved contact submission:', record);
    return res.redirect('/?sent=1');
    
  } catch (err) {
    console.error('Error saving submission', err);
    return res.status(500).render('agency', { sent: false, error: 'Server error — please try again later' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
