import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { register } from "../../api/auth";
import { decodeRegistrationToken } from "../../utils/tokenUtils";
import "./RegistrationPage.css";

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      try {
        const { email } = decodeRegistrationToken(token);
        setFormData((prev) => ({ ...prev, email }));
      } catch (error) {
        setMessage("Registration token is invalid or expired.");
      }
    } else {
      setMessage("Registration token missing or invalid.");
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { username, password, confirmPassword } = formData;

    if (!username || !password || !confirmPassword) {
      setMessage("All fields are required.");
      return false;
    }

    if (username.length < 3) {
      setMessage("Username must be at least 3 characters long.");
      return false;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      return false;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const registrationData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        isHr: false,
      };

      const response = await register(registrationData);
      console.log("Registration successful:", response);
      setMessage("Registration successful! Please log in.");

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);
      setMessage(`Registration failed: ${error.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-form">
        <h2>Employee Registration</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              readOnly
              className="readonly-field"
              placeholder="Email from registration token"
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              placeholder="Enter your username"
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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            className="register-button"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>

        {message && (
          <div
            className={`message ${
              message.includes("successful") ? "success" : "error"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationPage;
