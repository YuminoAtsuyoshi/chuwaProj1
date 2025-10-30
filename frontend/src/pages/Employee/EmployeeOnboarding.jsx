import React from 'react';
import './EmployeeOnboarding.css';

const EmployeeOnboarding = () => {
  return (
    <div className="employee-onboarding">
      <div className="onboarding-header">
        <h1>Employee Onboarding</h1>
        <p>Complete your onboarding process to get started.</p>
      </div>
      
      <div className="onboarding-content">
        <div className="onboarding-step">
          <h3>Step 1: Personal Information</h3>
          <p>Please complete your personal information form.</p>
          <button className="step-button">Complete Form</button>
        </div>
        
        <div className="onboarding-step">
          <h3>Step 2: Documentation</h3>
          <p>Upload required documents and forms.</p>
          <button className="step-button">Upload Documents</button>
        </div>
        
        <div className="onboarding-step">
          <h3>Step 3: Training</h3>
          <p>Complete mandatory training modules.</p>
          <button className="step-button">Start Training</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeOnboarding;
