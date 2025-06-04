const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import the model
const FormSubmission = require('./models/FormSubmission');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB successfully');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

// MongoDB connection event listeners
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// API endpoint to handle form submission
app.post('/api/submit-form', async (req, res) => {
  try {
    const { name, mobile_no, email} = req.body;
    
    // Create new form submission using the model
    const newSubmission = new FormSubmission({
      name,
      mobile_no,
      email
    });
    
    // Save to database
    const savedSubmission = await newSubmission.save();
    
    res.status(201).json({
      message: 'Form submitted successfully',
      data: savedSubmission
    });
  } catch (error) {
    console.error('Error saving form submission:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('api/update-form', async (req, res) => {
  try{
    const updatedResult = await FormSubmission.findByIdAndUpdate({_id : req.params.id}, req.body, {new : true});
    console.log("Document Updated");
    return updatedResult;
  }catch (error) {
    console.log(error);
  }
})

// API endpoint to get all submissions (optional)
app.get('/api/submissions', async (req, res) => {
  try {
    const submissions = await FormSubmission.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(50); // Limit to 50 results
    
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint to get a single submission by ID
app.get('/api/submissions/:id', async (req, res) => {
  try {
    const submission = await FormSubmission.findById(req.params.id);
    
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    
    res.json(submission);
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint to delete a submission by ID (optional)
app.delete('/api/submissions/:id', async (req, res) => {
  try {
    const deletedSubmission = await FormSubmission.findByIdAndDelete(req.params.id);
    
    if (!deletedSubmission) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    
    res.json({
      message: 'Submission deleted successfully',
      data: deletedSubmission
    });
  } catch (error) {
    console.error('Error deleting submission:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});