import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { register } from "../../api/auth";
import { decodeRegistrationToken } from "../../utils/tokenUtils";
import "./RegistrationPage.css";

const RegistrationPage = () => {
  const { 
    register, 
    handleSubmit, 
    watch,
    setValue,
    formState: { errors, isSubmitting } 
  } = useForm();
  
  const [message, setMessage] = useState("");
  const [registrationToken, setRegistrationToken] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Watch password for confirm password validation
  const password = watch("password");

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      try {
        const { email } = decodeRegistrationToken(token);
        setValue("email", email); // Set email using react-hook-form setValue
        setRegistrationToken(token);
      } catch (error) {
        setMessage("Registration token is invalid or expired.");
      }
    } else {
      setMessage("Registration token missing or invalid.");
    }
  }, [searchParams, setValue]);

  const onSubmit = async (data) => {
    setMessage("");

    try {
      const registrationData = {
        username: data.username,
        // email is determined by backend from registration token
        password: data.password,
        token: registrationToken,
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
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-form">
        <h2>Employee Registration</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Email is required",
              })}
              readOnly
              className="readonly-field"
              placeholder="Email from registration token"
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              {...register("username", {
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters long"
                }
              })}
              placeholder="Enter your username"
            />
            {errors.username && (
              <span className="error-message">{errors.username.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long"
                }
              })}
              placeholder="Enter your password"
            />
            {errors.password && (
              <span className="error-message">{errors.password.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match"
              })}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword.message}</span>
            )}
          </div>

          <button
            type="submit"
            className="register-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register"}
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
