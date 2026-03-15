const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
  },
  phone: {
    type: String,
    trim: true,
  },
  subject: {
    type: String,
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'Message cannot be empty'],
    trim: true,
  },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Contact', contactSchema);
