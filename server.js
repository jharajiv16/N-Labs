const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const DATA_DIR = path.join(__dirname, 'data');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve project root static files so files like /agency.css and /script.js are available
app.use(express.static(path.join(__dirname)));

// Serve the project's static frontend assets from root so relative paths work
app.use(express.static(path.join(__dirname, 'Html')));
// also keep a /static alias for compatibility
app.use('/static', express.static(path.join(__dirname, 'Html')));
app.use('/bootstrap', express.static(path.join(__dirname, 'bootstrap-5.3.8-dist')));

app.get('/', (req, res) => {
  const sent = req.query.sent === '1';
  res.render('agency', { sent });
});

app.post('/contact', async (req, res) => {
  try {
    const { name = '', email = '', phone = '', subject = '', message = '' } = req.body || {};
    const trimmed = {
      name: String(name).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
      subject: String(subject).trim(),
      message: String(message).trim(),
    };

    // Basic validation
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

    // Persist submission to data/submissions.json
    await fs.mkdir(DATA_DIR, { recursive: true });
    let submissions = [];
    try {
      const raw = await fs.readFile(SUBMISSIONS_FILE, 'utf8');
      submissions = JSON.parse(raw || '[]');
      if (!Array.isArray(submissions)) submissions = [];
    } catch (err) {
      // file might not exist — we'll create it
      submissions = [];
    }

    const record = {
      name: trimmed.name,
      email: trimmed.email,
      phone: trimmed.phone,
      subject: trimmed.subject,
      message: trimmed.message,
      timestamp: new Date().toISOString(),
    };

    submissions.push(record);
    await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2), 'utf8');

    console.log('Saved contact submission:', record);
    return res.redirect('/?sent=1');
  } catch (err) {
    console.error('Error saving submission', err);
    return res.status(500).render('agency', { sent: false, error: 'Server error — please try again later' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
