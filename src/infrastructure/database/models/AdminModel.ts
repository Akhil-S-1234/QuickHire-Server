const mongoose = require('mongoose');

// Admin schema definition
const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Create the Admin model
const AdminModel = mongoose.model('Admin', adminSchema);

export default AdminModel;
