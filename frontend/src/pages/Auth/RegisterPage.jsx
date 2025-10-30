import React from 'react';
import { Link } from 'react-router-dom';
import './RegisterPage.css';

const RegisterPage = () => {
  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Register</h2>
        <p>Registration page coming soon!</p>
        <div className="login-link">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
