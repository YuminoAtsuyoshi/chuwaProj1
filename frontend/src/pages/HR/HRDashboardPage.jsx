import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store';
import './HRDashboardPage.css';

const HRDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  
  const user = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Check for test user data first (for testing without backend)
    const testUser = localStorage.getItem('testUser');
    if (testUser) {
      try {
        const testUserData = JSON.parse(testUser);
        setLoading(false);
        
        // Check if user is HR
        if (!testUserData.isHr) {
          navigate('/login');
          return;
        }
        return;
      } catch (error) {
        console.error('Error parsing test user data:', error);
      }
    }
    
    // Check if user is HR
    if (user && !user.isHr) {
      navigate('/login');
      return;
    }
    
    setLoading(false);
  }, [user, navigate]);

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('testUser');
      dispatch(logout());
      navigate('/login', { state: { message: 'You have been logged out successfully' } });
    }
  };

  const handleViewProfiles = () => {
    navigate('/hr/employee-profiles');
  };

  const handleViewHiring = () => {
    navigate('/hr/hiring-management');
  };

  if (loading) {
    return (
      <div className="hr-dashboard-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="hr-dashboard-container">
      {/* Navigation Bar */}
      <nav className="hr-nav">
        <div className="nav-brand">
          <h2>HR Portal</h2>
        </div>
        <div className="nav-links">
          <button 
            onClick={() => navigate('/hr/dashboard')}
            className="nav-link active"
          >
            Home
          </button>
          <button 
            onClick={() => navigate('/hr/employee-profiles')}
            className="nav-link"
          >
            Employee Profiles
          </button>
          <button 
            className="nav-link placeholder"
            disabled
          >
            Visa Status Management
          </button>
          <button 
            onClick={() => navigate('/hr/hiring-management')}
            className="nav-link"
          >
            Hiring Management
          </button>
          <button 
            onClick={handleLogout}
            className="nav-link logout"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="hr-dashboard-content">
        <div className="welcome-section">
          <h1>Welcome, HR Manager!</h1>
          <p>Manage your employee resources and operations.</p>
        </div>

        {/* Card Modules */}
        <div className="cards-container">
          {/* Employee Profiles Card */}
          <div className="info-card">
            <div className="card-header">
              <h3>Employee Profiles</h3>
              <div className="card-icon">👥</div>
            </div>
            <div className="card-content">
              <div className="card-description">
                <p>View and manage employee profiles, personal information, and employment details.</p>
              </div>
              <div className="card-stats">
                <div className="stat-item">
                  <span className="stat-label">Total Employees</span>
                  <span className="stat-value">-</span>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <button 
                onClick={handleViewProfiles}
                className="card-button"
              >
                View Details
              </button>
            </div>
          </div>

          {/* Visa Status Management Card */}
          <div className="info-card placeholder-card">
            <div className="card-header">
              <h3>Visa Status Management</h3>
              <div className="card-icon">📋</div>
            </div>
            <div className="card-content">
              <div className="placeholder-content">
                <p>Visa status management will be available soon.</p>
                <p className="placeholder-note">This feature is currently under development.</p>
              </div>
            </div>
            <div className="card-footer">
              <button 
                className="card-button disabled"
                disabled
              >
                Coming Soon
              </button>
            </div>
          </div>

          {/* Hiring Management Card */}
          <div className="info-card">
            <div className="card-header">
              <h3>Hiring Management</h3>
              <div className="card-icon">📊</div>
            </div>
            <div className="card-content">
              <div className="card-description">
                <p>Manage job postings, applications, and hiring workflows.</p>
              </div>
              <div className="card-stats">
                <div className="stat-item">
                  <span className="stat-label">Active Postings</span>
                  <span className="stat-value">-</span>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <button 
                onClick={handleViewHiring}
                className="card-button"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboardPage;
