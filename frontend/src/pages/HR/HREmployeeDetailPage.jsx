import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getEmployeeDetails, getEmployeerInfo } from "../../api/auth";
import "./HREmployeeDetailPage.css";

const HREmployeeDetailPage = () => {
  // Copied from HREmployeeProfilePage with minimal renaming and css import change
  const { employeeId } = useParams();
  const [employee, setEmployee] = useState(null);
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const testUser = localStorage.getItem("testUser");
      const isHR = testUser ? JSON.parse(testUser).isHr : user?.isHr;
      if (!isHR) {
        navigate("/login");
        return;
      }
      if (testUser) {
        try {
          const mockEmployee = {
            id: employeeId || "1",
            username: "john.doe",
            email: "john.doe@company.com",
            isHr: false,
            stage: "onboarding",
            status: "pending",
          };
          const mockEmployeerInfo = {
            first_name: "John",
            middle_name: "Michael",
            last_name: "Doe",
            preferred_name: "Johnny",
            address_building: "Apt 2B",
            address_street: "123 Main St",
            address_city: "New York",
            address_state: "NY",
            address_zip: "10001",
            cell_phone: "555-123-4567",
            work_phone: "555-987-6543",
            email: "john.doe@company.com",
            ssn: "123-45-6789",
            date_of_birth: "1990-01-15",
            gender: "male",
            citizenship: "United States",
            country_of_birth: "USA",
            is_pr_or_citizen: "no",
            work_auth_type: "F1(CPT/OPT)",
            application_submitted_date: "2024-01-15",
            application_status: "pending",
          };
          setEmployee(mockEmployee);
          setEmployeeInfo(mockEmployeerInfo);
          setLoading(false);
          return;
        } catch (_) {}
      }
      try {
        setLoading(true);
        const employeeData = await getEmployeeDetails(employeeId);
        setEmployee(employeeData);
        try {
          const employeeData = await getEmployeerInfo(employeeId);
          setEmployeeInfo(employeeData);
        } catch {}
      } catch (e) {
        setError("Failed to load employee profile");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [employeeId, user?.isHr, navigate]);

  const handleBack = () => navigate("/hr/employee-profiles");

  if (loading)
    return (
      <div className="hr-profile-container">
        <div className="loading">Loading...</div>
      </div>
    );
  if (error)
    return (
      <div className="hr-profile-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={handleBack} className="back-btn">
            Back to Employee Profiles
          </button>
        </div>
      </div>
    );
  if (!employee)
    return (
      <div className="hr-profile-container">
        <div className="no-data">
          <h2>Employee Not Found</h2>
          <p>No employee found with the given ID.</p>
          <button onClick={handleBack} className="back-btn">
            Back to Employee Profiles
          </button>
        </div>
      </div>
    );

  const getWorkAuthTitle = () => {
    if (!employeeInfo) return "N/A";
    if (employeeInfo.isPrOrCitizen === "yes")
      return employeeInfo.prOrCitizenType || "Citizen/Permanent Resident";
    if (employeeInfo.isPrOrCitizen === "no")
      return employeeInfo.workAuthType || "N/A";
    return "N/A";
  };

  return (
    <div className="hr-profile-container">
      <div className="profile-header">
        <div className="header-content">
          <button onClick={handleBack} className="back-btn">
            ← Back to Employee Profiles
          </button>
          <h1>Employee Profile</h1>
        </div>
      </div>
      {employeeInfo && (
        <>
          <div className="info-section">
            <h2>Personal Information</h2>
            <div className="field-grid">
              <div className="field">
                <label>First Name:</label>
                <span>{employeeInfo.firstName || "N/A"}</span>
              </div>
              <div className="field">
                <label>Middle Name:</label>
                <span>{employeeInfo.middleName || "N/A"}</span>
              </div>
              <div className="field">
                <label>Last Name:</label>
                <span>{employeeInfo.lastName || "N/A"}</span>
              </div>
              <div className="field">
                <label>Preferred Name:</label>
                <span>{employeeInfo.preferredName || "N/A"}</span>
              </div>
              <div className="field">
                <label>Cell Phone:</label>
                <span>{employeeInfo.cellPhone || "N/A"}</span>
              </div>
              <div className="field">
                <label>Work Phone:</label>
                <span>{employeeInfo.workPhone || "N/A"}</span>
              </div>
              <div className="field">
                <label>SSN:</label>
                <span>{employeeInfo.ssn || "N/A"}</span>
              </div>
              <div className="field">
                <label>Gender:</label>
                <span>{employeeInfo.gender || "N/A"}</span>
              </div>
              <div className="field">
                <label>Date of Birth:</label>
                <span>
                  {employeeInfo.dateOfBirth.substring(0, 10) || "N/A"}
                </span>
              </div>
              <div className="field">
                <label>Work Authorization Title:</label>
                <span>{getWorkAuthTitle()}</span>
              </div>
            </div>
          </div>
          <div className="info-section">
            <h2>Address</h2>
            <div className="field-grid">
              <div className="field">
                <label>Building/Apartment:</label>
                <span>{employeeInfo.addressBuilding || "N/A"}</span>
              </div>
              <div className="field">
                <label>Street Address:</label>
                <span>{employeeInfo.addressStreet || "N/A"}</span>
              </div>
              <div className="field">
                <label>City:</label>
                <span>{employeeInfo.addressCity || "N/A"}</span>
              </div>
              <div className="field">
                <label>State:</label>
                <span>{employeeInfo.addressState || "N/A"}</span>
              </div>
              <div className="field">
                <label>ZIP Code:</label>
                <span>{employeeInfo.addressZip || "N/A"}</span>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="info-section">
        <h2>Onboarding Status</h2>
        <div className="field-grid">
          <div className="field">
            <label>Stage:</label>
            <span className="stage-badge">{employee.stage || "N/A"}</span>
          </div>
          <div className="field">
            <label>Status:</label>
            <span
              className={`status-badge status-${employee.status || "unknown"}`}
            >
              {employee.status || "N/A"}
            </span>
          </div>
          {employeeInfo && (
            <>
              <div className="field">
                <label>Application Submitted Date:</label>
                <span>{employee.submissionDate || "N/A"}</span>
              </div>
              {employee.feedback && (
                <div className="field full-width">
                  <label>HR Feedback:</label>
                  <span className="feedback-text">{employee.feedback}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HREmployeeDetailPage;
