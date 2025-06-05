// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './App.css';

// function App() {
//   const [formData, setFormData] = useState({
//     name: '',
//     mobile_no: '',
//     email: ''
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [submitMessage, setSubmitMessage] = useState('');
//   const [submissions, setSubmissions] = useState([]);
//   const [showSubmissions, setShowSubmissions] = useState(false);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setSubmitMessage('');

//     try {
//       const response = await axios.post('http://localhost:5000/api/submit-form', formData);
//       setSubmitMessage('Form submitted successfully!');
//       setFormData({ name: '',mobile_no : '', email: '' }); // Reset form
      
//       // Refresh submissions if they're being displayed
//       if (showSubmissions) {
//         fetchSubmissions();
//       }
//     } catch (error) {
//       console.error('Error:', error);
      
//       if (error.response && error.response.data && error.response.data.details) {
//         // Handle validation errors from MongoDB
//         setSubmitMessage(`Validation Error: ${error.response.data.details.join(', ')}`);
//       } else {
//         setSubmitMessage('Error submitting form. Please try again.');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchSubmissions = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/submissions');
//       setSubmissions(response.data);
//     } catch (error) {
//       console.error('Error fetching submissions:', error);
//     }
//   };

//   const toggleSubmissions = async () => {
//     if (!showSubmissions) {
//       await fetchSubmissions();
//     }
//     setShowSubmissions(!showSubmissions);
//   };

//   const deleteSubmission = async (id) => {
//     if (window.confirm('Are you sure you want to delete this submission?')) {
//       try {
//         await axios.delete(`http://localhost:5000/api/submissions/${id}`);
//         setSubmissions(submissions.filter(sub => sub._id !== id));
//       } catch (error) {
//         console.error('Error deleting submission:', error);
//       }
//     }
//   };

//   return (
//     <div className="App">
//       <div className="container">
//         <h1>Simple Contact Form</h1>
        
//         <form onSubmit={handleSubmit} className="form">
//           <div className="form-group">
//             <label htmlFor="name">Name:</label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               placeholder="Enter your name"
//               maxLength="100"
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="mobile_no">Mobile Number:</label>
//             <input
//               id="mobile_no"
//               type='text'
//               name="mobile_no"
//               value={formData.mobile_no}
//               onChange={handleChange}
//               required
//               placeholder="Enter your Mobile Number"
//               maxLength="13"
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="email">Email:</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               placeholder="Enter your email"
//             />
//           </div>

//           <button type="submit" disabled={isLoading} className="submit-btn">
//             {isLoading ? 'Submitting...' : 'Submit'}
//           </button>
//         </form>

//         {submitMessage && (
//           <div className={`message ${submitMessage.includes('Error') || submitMessage.includes('Validation') ? 'error' : 'success'}`}>
//             {submitMessage}
//           </div>
//         )}

//         <div className="submissions-section">
//           <button onClick={toggleSubmissions} className="toggle-btn">
//             {showSubmissions ? 'Hide Submissions' : 'Show All Submissions'}
//           </button>

//           {showSubmissions && (
//             <div className="submissions-list">
//               <h2>All Submissions ({submissions.length})</h2>
//               {submissions.length === 0 ? (
//                 <p>No submissions found.</p>
//               ) : (
//                 submissions.map((submission) => (
//                   <div key={submission._id} className="submission-card">
//                     <h3>{submission.name}</h3>
//                     <p><strong>Mobile Number:</strong> {submission.mobile_no}</p>
//                     <p><strong>Email:</strong> {submission.email}</p>
//                     <p><strong>Submitted:</strong> {new Date(submission.createdAt).toLocaleString()}</p>
//                     <button 
//                       onClick={() => deleteSubmission(submission._id)}
//                       className="delete-btn"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, User, Eye, Users, Edit, Plus, ArrowLeft, Trash2 } from 'lucide-react';
import './App.css';
import Events  from './Event';

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [volunteers, setVolunteers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Fetch volunteers from backend
  const fetchVolunteers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5000/volunteers');
      setVolunteers(response.data);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      setSubmitMessage('Error loading volunteers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load volunteers when app starts or when navigating to volunteers page
  useEffect(() => {
    if (currentPage === 'volunteers') {
      fetchVolunteers();
    }
  }, [currentPage]);

  const navigateTo = (page) => {
    setCurrentPage(page);
    setSubmitMessage(''); // Clear any messages when navigating
  };

  // Handle volunteer form submission
  const handleVolunteerSubmit = async (volunteerData) => {
    setIsLoading(true);
    setSubmitMessage('');

    try {
      const response = await axios.post('http://localhost:5000/volunteers', {
        name: volunteerData.name,
        email: volunteerData.email,
        mobile_no: volunteerData.phone
      });
      
      setSubmitMessage('Volunteer registered successfully!');
      
      // Refresh volunteers list and navigate to volunteers page
      setTimeout(() => {
        setCurrentPage('volunteers');
      }, 1500);
      
    } catch (error) {
      console.error('Error:', error);
      
      if (error.response && error.response.data && error.response.data.details) {
        setSubmitMessage(`Validation Error: ${error.response.data.details.join(', ')}`);
      } else {
        setSubmitMessage('Error submitting form. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Delete volunteer
  const deleteVolunteer = async (id) => {
    if (window.confirm('Are you sure you want to remove this volunteer?')) {
      try {
        await axios.delete(`http://localhost:5000/volunteers/${id}`);
        setVolunteers(volunteers.filter(vol => vol._id !== id));
        setSubmitMessage('Volunteer removed successfully!');
        
        // Clear message after 3 seconds
        setTimeout(() => setSubmitMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting volunteer:', error);
        setSubmitMessage('Error removing volunteer. Please try again.');
      }
    }
  };

  return (
    <div className="app">
      <Header currentPage={currentPage} navigateTo={navigateTo} />
      
      {currentPage === 'home' && <HomePage navigateTo={navigateTo} volunteersCount={volunteers.length} />}
      {currentPage === 'join' && (
        <JoinPage 
          navigateTo={navigateTo} 
          onSubmit={handleVolunteerSubmit}
          isLoading={isLoading}
          submitMessage={submitMessage}
        />
      )}
      {currentPage === 'management' && <ManagementPage navigateTo={navigateTo} volunteersCount={volunteers.length} />}
      {currentPage === 'volunteers' && (
        <VolunteersPage 
          navigateTo={navigateTo} 
          volunteers={volunteers} 
          deleteVolunteer={deleteVolunteer}
          isLoading={isLoading}
          submitMessage={submitMessage}
        />
      )}
      {currentPage === 'events' && <Events/>}
    </div>
  );
};

// Header Component
const Header = ({ currentPage, navigateTo }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <Heart size={24} color="#d63384" />
          <span>TMGF</span>
        </div>
        
        <nav className="nav">
          <button 
            onClick={() => navigateTo('home')}
            className={`nav-btn ${currentPage === 'home' ? 'active' : ''}`}
          >
            Home
          </button>
          <button 
            onClick={() => navigateTo('volunteers')}
            className={`nav-btn ${currentPage === 'volunteers' ? 'active' : ''}`}
          >
            Volunteers
          </button>
          <button 
            onClick={() => navigateTo('join')}
            className="nav-btn primary"
          >
            Join Us
          </button>
          <button
            onClick={() => navigateTo('events')}
            className={`nav-btn ${currentPage === 'events' ? 'active' : ''}`}
          >
            Events
          </button>
        </nav>
      </div>
    </header>
  );
};

// Home Page Component
const HomePage = ({ navigateTo, volunteersCount }) => {
  return (
    <div>
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-content">
          <div className="hero-icon">
            <Heart size={64} color="white" strokeWidth={1.5} />
          </div>
          
          <h1 className="hero-title">The Mother Global Foundation</h1>
          
          <p className="hero-description">
            Building stronger communities through dedicated volunteers. Together, 
            we create positive change and make a lasting impact.
          </p>
          
          <div className="hero-buttons">
            <button 
              onClick={() => navigateTo('join')}
              className="btn btn-white"
            >
              Join as Volunteer
            </button>
            <button 
              onClick={() => navigateTo('management')}
              className="btn btn-outline"
            >
              Manage Volunteers
            </button>
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="stats">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number pink">{volunteersCount}+</div>
            <div className="stat-label">Active Volunteers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number blue">25+</div>
            <div className="stat-label">Community Projects</div>
          </div>
          <div className="stat-item">
            <div className="stat-number purple">8</div>
            <div className="stat-label">Years of Service</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Join Page Component
const JoinPage = ({ navigateTo, onSubmit, isLoading, submitMessage }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.phone) {
      onSubmit(formData);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <button 
          onClick={() => navigateTo('home')}
          className="back-btn"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>

        <div className="page-header">
          <div className="page-icon">
            <Heart size={32} color="white" />
          </div>
          <h1>Join Our Volunteer Community</h1>
          <p>Help us make a difference in children's lives</p>
        </div>

        <div className="form-container">
          <div className="form-header">
            <User size={20} color="#d63384" />
            <h2>Volunteer Registration</h2>
          </div>

          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                maxLength="100"
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
                maxLength="13"
              />
            </div>

            <div className="form-buttons">
              <button
                type="button"
                onClick={() => navigateTo('home')}
                className="btn btn-secondary"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit Registration'}
              </button>
            </div>
          </form>

          {submitMessage && (
            <div className={`message ${submitMessage.includes('Error') || submitMessage.includes('Validation') ? 'error' : 'success'}`}>
              {submitMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Management Page Component
const ManagementPage = ({ navigateTo, volunteersCount }) => {
  const managementOptions = [
    {
      title: 'Add Volunteer',
      description: 'Register a new volunteer to our community',
      icon: Plus,
      color: 'pink',
      action: () => navigateTo('join')
    },
    {
      title: 'View Volunteers',
      description: 'Browse all volunteers in our community',
      icon: Eye,
      color: 'blue',
      action: () => navigateTo('volunteers')
    },
    {
      title: 'Manage Volunteers',
      description: 'Update and organize volunteer information',
      icon: Users,
      color: 'purple',
      action: () => navigateTo('volunteers')
    },
    {
      title: 'Update Records',
      description: 'Edit volunteer information and records',
      icon: Edit,
      color: 'teal',
      action: () => navigateTo('volunteers')
    }
  ];

  return (
    <div className="page">
      <div className="page-content">
        <div className="page-header">
          <h1>Volunteer Management</h1>
          <p>Choose from our management tools to add, view, update, or manage volunteer information</p>
        </div>

        <div className="management-grid">
          {managementOptions.map((option, index) => (
            <div key={index} className="management-card">
              <div className={`card-icon ${option.color}`}>
                <option.icon size={48} color="white" />
              </div>
              <div className="card-content">
                <h3>{option.title}</h3>
                <p>{option.description}</p>
                <button onClick={option.action} className="btn btn-light">
                  Access
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number pink">{volunteersCount}+</div>
            <div className="stat-label">Active Volunteers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number blue">25+</div>
            <div className="stat-label">Community Projects</div>
          </div>
          <div className="stat-item">
            <div className="stat-number purple">8</div>
            <div className="stat-label">Years of Service</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Volunteers Page Component
const VolunteersPage = ({ navigateTo, volunteers, deleteVolunteer, isLoading, submitMessage }) => {
  return (
    <div className="page">
      <div className="page-content">
        <button 
          onClick={() => navigateTo('home')}
          className="back-btn"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>

        <div className="page-header">
          <div className="page-icon">
            <Users size={32} color="white" />
          </div>
          <h1>Volunteer Management</h1>
          <p>Manage our amazing volunteer community</p>
        </div>

        <div className="add-volunteer-section">
          <button 
            onClick={() => navigateTo('join')}
            className="btn btn-primary"
          >
            <Plus size={20} />
            Add Volunteer
          </button>
        </div>

        {submitMessage && (
          <div className={`message ${submitMessage.includes('Error') ? 'error' : 'success'}`}>
            {submitMessage}
          </div>
        )}

        {isLoading ? (
          <div className="loading-message">
            <p>Loading volunteers...</p>
          </div>
        ) : (
          <div className="volunteers-grid">
            {volunteers.length === 0 ? (
              <div className="no-volunteers">
                <p>No volunteers found. Add some volunteers to get started!</p>
              </div>
            ) : (
              volunteers.map((volunteer) => (
                <div key={volunteer._id} className="volunteer-card">
                  <div className="volunteer-header">
                    <Heart size={20} color="white" />
                    <span>{volunteer.name}</span>
                  </div>
                  
                  <div className="volunteer-content">
                    <div className="volunteer-info">
                      <div className="info-item">
                        <span className="label">Email</span>
                        <span className="value">{volunteer.email}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Phone</span>
                        <span className="value">{volunteer.mobile_no}</span>
                      </div>
                      <div className="join-date">
                        Joined: {new Date(volunteer.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="volunteer-actions">
                      <button className="btn btn-edit">
                        <Edit size={16} />
                        Edit
                      </button>
                      <button 
                        onClick={() => deleteVolunteer(volunteer._id)}
                        className="btn btn-remove"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
