const Contact = require('../models/Contact');

/**
 * @desc    Submit a new contact form message
 * @route   POST /api/contact
 * @access  Public
 */
const submitContact = async (req, res) => {
  try {
    const { name = '', email = '', phone = '', subject = '', message = '' } = req.body || {};

    // Basic Validation
    if (!name.trim() || !email.trim() || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Name, email, and message are required' });
    }

    // Save to Database
    const newContact = await Contact.create({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      subject: subject.trim(),
      message: message.trim()
    });

    console.log('Saved contact to DB:', newContact._id);
    
    // Respond with success JSON (since we are using fetch now, not rendering EJS)
    return res.status(201).json({ success: true, data: 'Message sent successfully!' });

  } catch (err) {
    console.error('Error saving contact:', err);
    
    // Handle Mongoose Validation Errors gracefully
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ success: false, error: messages.join(', ') });
    }

    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = {
  submitContact
};
