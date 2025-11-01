import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getEmployeeDetails, getEmployeerInfo } from "../../api/auth";
import { logout } from "../../store";
import "./EmployeeHomePage.css";

const EmployeeHomePage = () => {
  const [employee, setEmployee] = useState(null);
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      // Check for test user data first (for testing without backend)
      const testUser = localStorage.getItem("testUser");
      if (testUser) {
        try {
          const testUserData = JSON.parse(testUser);
          setEmployee(testUserData);

          // Mock employeer info for testing
          const mockEmployeerInfo = {
            first_name: "John",
            last_name: "Doe",
            middle_name: "Michael",
            preferred_name: "Johnny",
          };
          setEmployeerInfo(mockEmployeerInfo);

          setLoading(false);
          return;
        } catch (error) {
          console.error("Error parsing test user data:", error);
        }
      }

      if (!user?._id) return;

      try {
        setLoading(true);

        // Fetch employee details
        const employeeData = await getEmployeeDetails(user._id);
        setEmployee(employeeData);

        // Try to fetch employeer info
        try {
          const employeerData = await getEmployeerInfo(user._id);
          setEmployeeInfo(employeerData);
        } catch (error) {
          console.log("No employeer info found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?._id]);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("testUser");
      dispatch(logout());
      navigate("/login", {
        state: { message: "You have been logged out successfully" },
      });
    }
  };

  const handlePersonalInfoClick = () => {
    navigate("/employee/personal-info");
  };

  const handleVisaStatusClick = () => {
    navigate("/employee/visa-status");
  };

  const handleApplicationStatusClick = () => {
    // Application Status always points to onboarding page
    navigate("/employee/onboarding");
  };

  if (loading) {
    return (
      <div className="employee-home-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="employee-home-container">
      {/* Navigation Bar */}
      <nav className="employee-nav">
        <div className="nav-brand">
          <h2>Employee Portal</h2>
        </div>
        <div className="nav-links">
          <button onClick={handlePersonalInfoClick} className="nav-link">
            Personal Information
          </button>
          
          <button onClick={handleVisaStatusClick} className="nav-link">
            Visa Status Management
          </button>
          <button onClick={handleLogout} className="nav-link logout">
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="employee-home-content">
        <div className="welcome-section">
          <h1>
            Welcome, {employeeInfo?.firstName || employee?.email || "Employee"}!
          </h1>
          <p>
            Manage your personal information and track your application status.
          </p>
        </div>

        {/* Card Modules */}
        <div className="cards-container">
          {/* Personal Information Card */}
          <div className="info-card">
            <div className="card-header">
              <h3>Personal Information</h3>
              <div className="card-icon">👤</div>
            </div>
            <div className="card-content">
              <div className="info-item">
                <span className="info-label">Name:</span>
                <span className="info-value">
                  {employeeInfo?.firstName || "N/A"}{" "}
                  {employeeInfo?.lastName || ""}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Preferred Name:</span>
                <span className="info-value">
                  {employeeInfo?.preferredName || "N/A"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{employee?.email || "N/A"}</span>
              </div>
            </div>
            <div className="card-footer">
              <button onClick={handlePersonalInfoClick} className="card-button">
                View Details
              </button>
            </div>
          </div>

          <div className="info-card">
            <div className="card-header">
              <h3>Visa Status</h3>
              <div className="card-icon">📋</div>
            </div>
            <div className="card-content">
              <p>Manage your visa documents and status.</p>
            </div>
            <div className="card-footer">
              <button onClick={handleVisaStatusClick} className="card-button">
                View Details
              </button>
            </div>
          </div>

          {/* Application Status Card */}
          <div className="info-card">
            <div className="card-header">
              <h3>Application Status</h3>
              <div className="card-icon">📊</div>
            </div>
            <div className="card-content">
              {/* Only show onboarding-related info */}
              {employee?.stage === "onboarding" ? (
                <>
                  <div className="info-item">
                    <span className="info-label">Current Stage:</span>
                    <span className="info-value status-value">
                      Onboarding
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Status:</span>
                    <span
                      className={`info-value status-badge status-${
                        employee?.status || "unknown"
                      }`}
                    >
                      {employee?.status || "N/A"}
                    </span>
                  </div>
                  {employee?.feedback && (
                    <div className="info-item">
                      <span className="info-label">Feedback:</span>
                      <span className="info-value feedback-text">
                        {employee.feedback}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="info-item">
                  <span className="info-label">Status:</span>
                  <span className="info-value status-badge status-approved">
                    Approved
                  </span>
                </div>
              )}
            </div>
            <div className="card-footer">
              <button
                onClick={handleApplicationStatusClick}
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

export default EmployeeHomePage;
