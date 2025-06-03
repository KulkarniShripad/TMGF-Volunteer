import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    mobile_no: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [showSubmissions, setShowSubmissions] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/submit-form', formData);
      setSubmitMessage('Form submitted successfully!');
      setFormData({ name: '',mobile_no : '', email: '' }); // Reset form
      
      // Refresh submissions if they're being displayed
      if (showSubmissions) {
        fetchSubmissions();
      }
    } catch (error) {
      console.error('Error:', error);
      
      if (error.response && error.response.data && error.response.data.details) {
        // Handle validation errors from MongoDB
        setSubmitMessage(`Validation Error: ${error.response.data.details.join(', ')}`);
      } else {
        setSubmitMessage('Error submitting form. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/submissions');
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const toggleSubmissions = async () => {
    if (!showSubmissions) {
      await fetchSubmissions();
    }
    setShowSubmissions(!showSubmissions);
  };

  const deleteSubmission = async (id) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      try {
        await axios.delete(`http://localhost:5000/api/submissions/${id}`);
        setSubmissions(submissions.filter(sub => sub._id !== id));
      } catch (error) {
        console.error('Error deleting submission:', error);
      }
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Simple Contact Form (MongoDB)</h1>
        
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
              maxLength="100"
            />
          </div>

          <div className="form-group">
            <label htmlFor="mobile_no">Mobile Number:</label>
            <input
              id="mobile_no"
              type='text'
              name="mobile_no"
              value={formData.mobile_no}
              onChange={handleChange}
              required
              placeholder="Enter your Mobile Number"
              maxLength="13"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <button type="submit" disabled={isLoading} className="submit-btn">
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </form>

        {submitMessage && (
          <div className={`message ${submitMessage.includes('Error') || submitMessage.includes('Validation') ? 'error' : 'success'}`}>
            {submitMessage}
          </div>
        )}

        <div className="submissions-section">
          <button onClick={toggleSubmissions} className="toggle-btn">
            {showSubmissions ? 'Hide Submissions' : 'Show All Submissions'}
          </button>

          {showSubmissions && (
            <div className="submissions-list">
              <h2>All Submissions ({submissions.length})</h2>
              {submissions.length === 0 ? (
                <p>No submissions found.</p>
              ) : (
                submissions.map((submission) => (
                  <div key={submission._id} className="submission-card">
                    <h3>{submission.name}</h3>
                    <p><strong>Mobile Number:</strong> {submission.mobile_no}</p>
                    <p><strong>Email:</strong> {submission.email}</p>
                    <p><strong>Submitted:</strong> {new Date(submission.createdAt).toLocaleString()}</p>
                    <button 
                      onClick={() => deleteSubmission(submission._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;