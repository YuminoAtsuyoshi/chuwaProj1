import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store";
import { Navbar, Nav, Container } from "react-bootstrap";
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
    <Navbar expand="lg" className="custom-navbar" style={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
      <Container fluid>
        <Navbar.Brand>
          <h2 style={{ margin: 0, color: '#343a40', fontSize: '1.5rem' }}>Employee Portal</h2>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto" style={{ gap: '0.5rem', alignItems: 'center' }}>
            <Nav.Link
              onClick={() => navigate("/employee/dashboard")}
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
              onClick={() => navigate("/employee/personal-info")}
              className={active === "pi" ? "active" : ""}
              style={{ 
                color: '#343a40', 
                fontSize: '16px',
                fontWeight: active === "pi" ? 600 : 400,
                backgroundColor: active === "pi" ? 'white' : 'transparent',
                border: active === "pi" ? '1px solid #dee2e6' : 'none',
                borderRadius: '4px',
                padding: '0.5rem 1rem',
                cursor: 'pointer'
              }}
            >
              Personal Information
            </Nav.Link>
            <Nav.Link
              onClick={() => navigate("/employee/visa-status")}
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

export default EmployeeNav;


