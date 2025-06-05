const FormSubmission = require('../models/FormSubmission');

// API endpoint to handle form submission
exports.createVolunteer = async (req, res) => {
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
  };
  
  exports.updateVolunteer = async (req, res) => {
    try{
      const updatedResult = await FormSubmission.findByIdAndUpdate({_id : req.params.id}, req.body, {new : true});
      console.log("Document Updated");
      return updatedResult;
    }catch (error) {
      console.log(error);
    }
  };
  
  // API endpoint to get all submissions (optional)
  exports.fetchVolunteers = async (req, res) => {
    try {
      const submissions = await FormSubmission.find()
        .sort({ createdAt: -1 }) // Sort by newest first
        .limit(50); // Limit to 50 results
      
      res.json(submissions);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  // API endpoint to get a single submission by ID
  exports.getById = async (req, res) => {
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
  };
  
  // API endpoint to delete a submission by ID (optional)
  exports.deleteVolunteer = async (req, res) => {
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
  };