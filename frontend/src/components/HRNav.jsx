import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store";
import "../pages/HR/HRDashboardPage.css";

const HRNav = ({ active }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("testUser");
      dispatch(logout());
      navigate("/login", { state: { message: "You have been logged out successfully" } });
    }
  };

  const linkClass = (key) => `nav-link ${active === key ? "active" : ""}`;

  return (
    <nav className="hr-nav">
      <div className="nav-brand">
        <h2>HR Portal</h2>
      </div>
      <div className="nav-links">
        <button onClick={() => navigate("/hr/dashboard")} className={linkClass("home")}>Home</button>
        <button onClick={() => navigate("/hr/employee-profiles")} className={linkClass("profiles")}>
          Employee Profiles
        </button>
        <button className="nav-link placeholder" disabled>Visa Status Management</button>
        <button onClick={() => navigate("/hr/hiring-management")} className={linkClass("hiring")}>Hiring Management</button>
        <button onClick={handleLogout} className="nav-link logout">Logout</button>
      </div>
    </nav>
  );
};

export default HRNav;


