import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store";
import { Navbar, Nav, Container } from "react-bootstrap";
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
      navigate("/login", {
        state: { message: "You have been logged out successfully" },
      });
    }
  };

  return (
    <Navbar expand="lg" className="custom-navbar" style={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
      <Container fluid>
        <Navbar.Brand>
          <h2 style={{ margin: 0, color: '#343a40', fontSize: '1.5rem' }}>HR Portal</h2>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto" style={{ gap: '0.5rem', alignItems: 'center' }}>
            <Nav.Link
              onClick={() => navigate("/hr/dashboard")}
              className={active === "home" ? "active" : ""}
              style={{ 
                color: '#343a40', 
                fontSize: '16px',
                fontWeight: active === "home" ? 600 : 400,
                backgroundColor: active === "home" ? 'white' : 'transparent',
                border: active === "home" ? '1px solid #dee2e6' : 'none',
                borderRadius: '4px',
                padding: '0.5rem 1rem',
                cursor: 'pointer'
              }}
            >
              Home
            </Nav.Link>
            <Nav.Link
              onClick={() => navigate("/hr/employee-profiles")}
              className={active === "profiles" ? "active" : ""}
              style={{ 
                color: '#343a40', 
                fontSize: '16px',
                fontWeight: active === "profiles" ? 600 : 400,
                backgroundColor: active === "profiles" ? 'white' : 'transparent',
                border: active === "profiles" ? '1px solid #dee2e6' : 'none',
                borderRadius: '4px',
                padding: '0.5rem 1rem',
                cursor: 'pointer'
              }}
            >
              Employee Profiles
            </Nav.Link>
            <Nav.Link
              onClick={() => navigate("/hr/visa-management")}
              className={active === "visa" ? "active" : ""}
              style={{ 
                color: '#343a40', 
                fontSize: '16px',
                fontWeight: active === "visa" ? 600 : 400,
                backgroundColor: active === "visa" ? 'white' : 'transparent',
                border: active === "visa" ? '1px solid #dee2e6' : 'none',
                borderRadius: '4px',
                padding: '0.5rem 1rem',
                cursor: 'pointer'
              }}
            >
              Visa Status Management
            </Nav.Link>
            <Nav.Link
              onClick={() => navigate("/hr/hiring-management")}
              className={active === "hiring" ? "active" : ""}
              style={{ 
                color: '#343a40', 
                fontSize: '16px',
                fontWeight: active === "hiring" ? 600 : 400,
                backgroundColor: active === "hiring" ? 'white' : 'transparent',
                border: active === "hiring" ? '1px solid #dee2e6' : 'none',
                borderRadius: '4px',
                padding: '0.5rem 1rem',
                cursor: 'pointer'
              }}
            >
              Hiring Management
            </Nav.Link>
            <Nav.Link
              onClick={handleLogout}
              style={{ 
                backgroundColor: '#dc3545',
                color: 'white',
                borderRadius: '4px',
                padding: '0.5rem 1rem',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default HRNav;
