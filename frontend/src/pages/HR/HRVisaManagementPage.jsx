import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getAllEmployees,
} from "../../api/auth";
import VisaManagementRow from "./components/VisaManagementRow";
import VisaManagementActionCell from "./components/VisaManagementActionCell";
import NextStepsCell from "./components/NextStepsCell";
import HRNav from "../../components/HRNav";
import "./HRVisaManagementPage.css";

const HRVisaManagementPage = () => {
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [progressApplications, setProgressApplications] = useState([]);
  const [allApplications, setallApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAllApplications, setFilteredAllApplications] = useState([]);
  const [filteredProgressApplications, setFilteredProgressApplications] = useState([]);
  const [activeTab, setActiveTab] = useState("in-progress");

  useEffect(() => {
    // Check if user is HR
    if (!user?.isHr) {
      navigate("/login");
      return;
    }

    fetchData();
  }, [user?.isHr, navigate]);

  // Search function
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    const searchLower = searchValue.toLowerCase().trim();
    
    const filterFunc = (emp) => {
      if (!emp.personInfo) return false;
      const firstName = (emp.personInfo.firstName || "").toLowerCase();
      const lastName = (emp.personInfo.lastName || "").toLowerCase();
      const preferredName = (emp.personInfo.preferredName || "").toLowerCase();

      return (
        firstName.includes(searchLower) ||
        lastName.includes(searchLower) ||
        preferredName.includes(searchLower)
      );
    };

    if (!searchValue.trim()) {
      setFilteredAllApplications(allApplications);
      setFilteredProgressApplications(progressApplications);
      return;
    }

    setFilteredAllApplications(allApplications.filter(filterFunc));
    setFilteredProgressApplications(progressApplications.filter(filterFunc));
  };

  // Update filtered applications when applications change
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredAllApplications(allApplications);
      setFilteredProgressApplications(progressApplications);
    } else {
      handleSearch(searchTerm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allApplications, progressApplications]);

  // Helper function to check if employee is F1 OPT
  const isF1OPT = (emp) => {
    if (!emp.personInfo) return false;
    const { isPrOrCitizen, workAuthType, visaTitle } = emp.personInfo;
    // Must be non-citizen with F1 OPT work authorization
    if (isPrOrCitizen === "no" && workAuthType === "F1 OPT") {
      return true;
    }
    // Fallback: check visaTitle for OPT (less reliable)
    if (isPrOrCitizen === "no" && visaTitle && visaTitle.toUpperCase().includes("OPT")) {
      return true;
    }
    return false;
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const [progressData, AllData] = await Promise.all([
        getAllEmployees().then((data) =>
          data.filter(
            (emp) =>
              emp.personInfo !== null &&
              !emp.isHr &&
              isF1OPT(emp) && // Only include F1 OPT employees
              (emp.stage !== "I-20" || emp.status !== "approved") // Not completed I-20
          )
        ),
        getAllEmployees().then((data) =>
          data.filter((emp) => emp.personInfo !== null && !emp.isHr)
        ),
      ]);

      setProgressApplications(progressData);
      setallApplications(AllData);
      setFilteredAllApplications(AllData);
      setFilteredProgressApplications(progressData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage("Failed to load hiring management data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="visa-management-container">
        <HRNav active="visa" />
        <div className="loading">Loading...</div>
      </div>
    );
  }

  // handleUpdate function for refreshing data after approve/reject
  const handleUpdate = async () => {
    await fetchData();
  };

  const getFullName = (emp) => {
    if (emp.personInfo) {
      const parts = [
        emp.personInfo.firstName,
        emp.personInfo.middleName,
        emp.personInfo.lastName,
      ].filter(Boolean);
      return parts.join(" ");
    }
    return emp.email || "N/A";
  };

  const getWorkAuthTitle = (emp) => {
    if (!emp.personInfo) return "N/A";
    const { isPrOrCitizen, prOrCitizenType, workAuthType } = emp.personInfo;
    if (isPrOrCitizen === "yes") {
      return prOrCitizenType || "Citizen/Permanent Resident";
    } else if (isPrOrCitizen === "no") {
      // Ensure workAuthType is properly formatted (no "F1(CPT/OPT)")
      if (!workAuthType) return "N/A";
      // If somehow we have "F1(CPT/OPT)", we should handle it, but ideally this shouldn't exist
      // Since the form only allows "F1 CPT" or "F1 OPT", this is a safety check
      const normalized = workAuthType.replace(/F1\s*\(CPT\/OPT\)/gi, "F1 OPT");
      return normalized;
    }
    return "N/A";
  };

  const getStartAndEndDate = (emp) => {
    if (!emp.personInfo) return "";
    const { isPrOrCitizen, visaStartDate, visaEndDate } = emp.personInfo;
    // Only show dates for non-citizens with work authorization
    if (isPrOrCitizen === "yes") {
      return ""; // Don't show dates for citizens/permanent residents
    }
    // For non-citizens, show dates if available
    if (visaStartDate || visaEndDate) {
    return `${visaStartDate || "N/A"} to ${visaEndDate || "N/A"}`;
    }
    return ""; // Don't show "N/A to N/A" if both are missing
  };

  const getDaysBetween = (emp) => {
    if (!emp.personInfo) return "";
    if (!emp.personInfo.visaEndDate) return "";
    const targetDate = new Date(emp.personInfo.visaEndDate);
    const today = new Date();
    // Set both dates to midnight to ensure only full days are counted
    targetDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const timeDifference = targetDate.getTime() - today.getTime();
    const daysDifference = Math.round(timeDifference / (1000 * 60 * 60 * 24));
    if (daysDifference > 1) {
      return `${daysDifference} days remaining`;
    } else if (daysDifference <= 1 && daysDifference == 0) {
      return `${daysDifference} day remaining`;
    } else {
      return "Work visa expired";
    }
  };

  // Render search results message
  const getSearchMessage = (applications) => {
    if (!searchTerm.trim()) return null;
    const count = applications.length;
    if (count === 0) {
      return "No employees found matching your search.";
    } else if (count === 1) {
      return "1 employee found";
    } else {
      return `${count} employees found`;
    }
  };

  // Render employee card for In Progress section
  const renderProgressCard = (employee) => {
    const daysRemaining = getDaysBetween(employee);
    const workAuthDates = getStartAndEndDate(employee);
    const daysValue = daysRemaining ? daysRemaining.replace(" days remaining", "").replace(" day remaining", "").replace("Work visa expired", "0") : "";
    const daysNum = parseInt(daysValue) || 0;
    const badgeVariant = daysNum < 60 ? "destructive" : daysNum < 120 ? "secondary" : "outline";

        return (
      <div key={employee._id} className="hr-visa-card">
        <div className="hr-card-grid">
          <div className="hr-card-field">
            <span className="hr-card-label">Name</span>
            <div className="hr-card-value">
              {getFullName(employee)}
              {employee.personInfo?.preferredName && (
                <span className="hr-card-value muted"> ({employee.personInfo.preferredName})</span>
              )}
            </div>
          </div>
          
          <div className="hr-card-field">
            <span className="hr-card-label">Work Authorization</span>
            <div className="hr-card-value">
              {getWorkAuthTitle(employee)}
              {workAuthDates && (
                <div className="hr-card-value muted">{workAuthDates}</div>
              )}
              {daysRemaining && (
                <span className={`badge badge-${badgeVariant} ${daysNum < 60 ? "badge-rejected" : daysNum < 120 ? "badge-pending" : "badge-approved"}`} style={{ marginTop: "8px", display: "inline-block" }}>
                  {daysRemaining}
                </span>
              )}
            </div>
          </div>
          
          <div className="hr-card-field">
            <span className="hr-card-label">Next Steps</span>
            <div className="hr-card-value">
              <NextStepsCell employee={employee} />
              </div>
              </div>
          
          <div className="hr-card-field">
            <span className="hr-card-label">Action</span>
            <div className="hr-card-value">
              <VisaManagementActionCell
                employee={employee}
                onUpdate={handleUpdate}
                setMessage={setMessage}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render employee card for All section
  const renderAllCard = (employee) => {
      return (
      <VisaManagementRow
        key={employee._id}
        getFullName={getFullName}
        getWorkAuthTitle={getWorkAuthTitle}
        getStartAndEndDate={getStartAndEndDate}
        getDaysBetween={getDaysBetween}
        data={employee}
        showApprovedDocsOnly={true}
        renderAsCard={true}
      />
      );
  };

  return (
    <div className="visa-management-container">
      <HRNav active="visa" />
      <div className="page-header">
        <h1>Visa Status Management</h1>
        <p>Manage employee visa documents and approvals</p>
      </div>
      {message && (
        <div
          className={`message ${
            message.includes("successfully") ? "success" : "error"
          }`}
        >
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="tabs-container">
        <div className="tabs-list">
          <button
            className={`tab-trigger ${activeTab === "in-progress" ? "active" : ""}`}
            onClick={() => setActiveTab("in-progress")}
          >
            In Progress
          </button>
          <button
            className={`tab-trigger ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All
          </button>
        </div>

        {/* In Progress Tab */}
        <div className={`tab-content ${activeTab === "in-progress" ? "active" : ""}`}>
          <div className="search-wrapper">
            <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by first name, last name, or preferred name..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {getSearchMessage(filteredProgressApplications) && (
            <div style={{ marginBottom: "16px" }}>
              <span className="badge badge-secondary">{getSearchMessage(filteredProgressApplications)}</span>
            </div>
          )}

          {filteredProgressApplications.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <span className="badge badge-secondary">{filteredProgressApplications.length} employees in progress</span>
            </div>
          )}

          {filteredProgressApplications.length === 0 ? (
          <div className="no-data">
              <p>{searchTerm ? "No employees found matching your search." : "No employee in progress."}</p>
          </div>
        ) : (
            <div>
              {filteredProgressApplications.map(renderProgressCard)}
          </div>
        )}
        </div>

        {/* All Tab */}
        <div className={`tab-content ${activeTab === "all" ? "active" : ""}`}>
          <div className="search-wrapper">
            <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by first name, last name, or preferred name..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {getSearchMessage(filteredAllApplications) && (
            <div style={{ marginBottom: "16px" }}>
              <span className="badge badge-secondary">{getSearchMessage(filteredAllApplications)}</span>
            </div>
          )}

          {filteredAllApplications.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <span className="badge badge-secondary">{filteredAllApplications.length} total employees</span>
            </div>
          )}

          {filteredAllApplications.length === 0 ? (
          <div className="no-data">
              <p>{searchTerm ? "No employees found matching your search." : "No employee now."}</p>
          </div>
        ) : (
            <div>
              {filteredAllApplications.map(renderAllCard)}
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default HRVisaManagementPage;
