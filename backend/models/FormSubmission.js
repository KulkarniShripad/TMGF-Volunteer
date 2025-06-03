const mongoose = require('mongoose');

const formSubmissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  mobile_no : {
    type: String,
    required: [true, 'Number is required'],
    trim: true,
    maxlength: [13, 'Mobile Number Must be 10 digits long'],
    match: [/^(\+\d{1,3}[- ]?)?\d{10}$/, 'Please enter valid mobile number']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  }
}, {
  timestamps: true // This adds createdAt and updatedAt fields automatically
});

const FormSubmission = mongoose.model('FormSubmission', formSubmissionSchema, 'volunteers');

module.exports = FormSubmission;