import React from 'react';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
  return (
    <div className="employee-dashboard">
      <div className="dashboard-header">
        <h1>Employee Dashboard</h1>
        <p>Welcome to your employee dashboard!</p>
      </div>
      
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h3>Your Profile</h3>
          <p>Manage your personal information and preferences.</p>
        </div>
        
        <div className="dashboard-card">
          <h3>Tasks & Assignments</h3>
          <p>View your current tasks and assignments.</p>
        </div>
        
        <div className="dashboard-card">
          <h3>Documents</h3>
          <p>Access important documents and forms.</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
