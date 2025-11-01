import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login, getEmployeeDetails } from '../../api/auth';
import { loginSuccess } from '../../store';
import './LoginPage.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Display logout message if redirected from logout
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      // Clear the message after 5 seconds
      const timer = setTimeout(() => setMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await login(formData);
      console.log('Login successful:', response);
      
      // Store token in localStorage
      const token = response.token || response.data?.token;
      if (token) {
        localStorage.setItem('authToken', token);
      }
      
      // Get employee details
      const employeeId = response.employeeId || response.data?.employeeId || response.user?.id;
      if (employeeId) {
        const employeeData = await getEmployeeDetails(employeeId);
        console.log('Employee data:', employeeData);
        console.log('Stage:', employeeData.stage, 'Status:', employeeData.status);
        
        // Store user data in Redux store
        dispatch(loginSuccess(token, employeeData));
        
        // Redirect based on user role and status
        if (employeeData.isHr) {
          console.log('Redirecting HR to dashboard');
          navigate('/hr/dashboard');
        } else {
          // Check employee stage and status
          // According to requirements:
          // - never_submit: fill in the application fields and submit for the first time
          // - rejected: view feedback on why their application was rejected, make changes, and resubmit
          // - pending: view submitted application (not editable) and wait for HR review
          // - approved: redirect to dashboard
          // 
          // IMPORTANT: If status is 'rejected', always redirect to onboarding page regardless of stage
          // This allows employees to view feedback and resubmit their application
          if (employeeData.status === 'rejected') {
            console.log('Redirecting to onboarding page (status: rejected, stage:', employeeData.stage, ')');
            navigate('/employee/onboarding');
          } else if (employeeData.stage === 'onboarding') {
            // For onboarding stage: redirect to onboarding page if never_submit or pending
            if (employeeData.status === 'never_submit' || 
                employeeData.status === 'pending') {
              console.log('Redirecting to onboarding page (stage: onboarding, status:', employeeData.status, ')');
              navigate('/employee/onboarding');
            } else {
              // approved or other status -> go to dashboard
              console.log('Redirecting to dashboard (stage:', employeeData.stage, ', status:', employeeData.status, ')');
              navigate('/employee/dashboard');
            }
          } else {
            // Not in onboarding stage and not rejected -> go to dashboard
            console.log('Redirecting to dashboard (not onboarding stage, status:', employeeData.status, ')');
            navigate('/employee/dashboard');
          }
        }
      } else {
        setMessage('Login successful, but unable to fetch employee details.');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      setMessage(`Login failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Enter your password"
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        {message && (
          <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
        
        <div className="register-link">
          <Link to="/register">Click here to register</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
