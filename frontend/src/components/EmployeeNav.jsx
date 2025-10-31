import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store";
import "../pages/Employee/EmployeeHomePage.css";

const EmployeeNav = ({ active }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  return (
    <nav className="employee-nav">
      <div className="nav-brand">
        <h2>Employee Portal</h2>
      </div>
      <div className="nav-links">
        <button
          onClick={() => navigate("/employee/dashboard")}
          className={`nav-link ${active === "home" ? "active" : ""}`}
        >
          Home
        </button>
        <button
          onClick={() => navigate("/employee/personal-info")}
          className={`nav-link ${active === "pi" ? "active" : ""}`}
        >
          Personal Information
        </button>
        <button
          onClick={() => navigate("/employee/visa-status")}
          className={`nav-link ${active === "visa" ? "active" : ""}`}
        >
          Visa Status Management
        </button>
        <button onClick={handleLogout} className="nav-link logout">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default EmployeeNav;


