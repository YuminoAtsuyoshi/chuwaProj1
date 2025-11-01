import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getRegistrationTokens,
  generateRegistrationToken,
  getAllEmployees,
} from "../../api/auth";
import "./HRHiringManagementPage.css";
import HRNav from "../../components/HRNav";

const HRHiringManagementPage = () => {
  const [tokens, setTokens] = useState([]);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [rejectedApplications, setRejectedApplications] = useState([]);
  const [approvedApplications, setApprovedApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("tokens"); // "tokens" or "onboarding"

  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is HR
    const testUser = localStorage.getItem("testUser");
    const isHR = testUser ? JSON.parse(testUser).isHr : user?.isHr;

    if (!isHR) {
      navigate("/login");
      return;
    }

    fetchData();
  }, [user?.isHr, navigate]);

  const fetchData = async () => {
    // Mock data for testing without backend
    const testUser = localStorage.getItem("testUser");
    if (testUser) {
      try {
        // Mock registration tokens - create realistic dates
        const now = new Date();
        const expiredDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 1 day ago
        const futureDate = new Date(now.getTime() + 3 * 60 * 60 * 1000); // 3 hours from now
        const oldDate = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
        
        const mockTokens = [
          {
            _id: "1",
            email: "newuser1@example.com",
            token: "abc123xyz",
            createdAt: oldDate.toISOString(),
            expiresAt: expiredDate.toISOString(),
            status: "valid",
          },
          {
            _id: "2",
            email: "newuser2@example.com",
            token: "def456uvw",
            createdAt: oldDate.toISOString(),
            expiresAt: expiredDate.toISOString(),
            status: "expired",
          },
          {
            _id: "3",
            email: "pending@example.com",
            token: "pending123",
            createdAt: now.toISOString(),
            expiresAt: futureDate.toISOString(),
            status: "valid",
          },
        ];

        // Mock applications for all statuses
        const mockPendingApps = [
          {
            id: "emp1",
            email: "john.doe@company.com",
            employeerInfo: {
              first_name: "John",
              middle_name: "Michael",
              last_name: "Doe",
            },
            submissionDate: "2024-01-20",
            stage: "onboarding",
            status: "pending",
          },
          {
            id: "emp2",
            email: "jane.smith@company.com",
            employeerInfo: {
              first_name: "Jane",
              middle_name: "",
              last_name: "Smith",
            },
            submissionDate: "2024-01-18",
            stage: "onboarding",
            status: "pending",
          },
        ];

        const mockRejectedApps = [
          {
            id: "emp3",
            email: "bob.johnson@company.com",
            employeerInfo: {
              first_name: "Bob",
              middle_name: "Robert",
              last_name: "Johnson",
            },
            submissionDate: "2024-01-15",
            stage: "onboarding",
            status: "rejected",
            feedback: "Missing required documents",
          },
        ];

        const mockApprovedApps = [
          {
            id: "emp4",
            email: "alice.williams@company.com",
            employeerInfo: {
              first_name: "Alice",
              middle_name: "Marie",
              last_name: "Williams",
            },
            submissionDate: "2024-01-10",
            stage: "onboarding",
            status: "approved",
          },
        ];

        setTokens(mockTokens);
        setPendingApplications(mockPendingApps);
        setRejectedApplications(mockRejectedApps);
        setApprovedApplications(mockApprovedApps);
        setLoading(false);
        return;
      } catch (error) {
        console.error("Error with mock data:", error);
      }
    }

    try {
      setLoading(true);

      // Fetch registration tokens
      const tokensData = await getRegistrationTokens();
      setTokens(tokensData);

      // Fetch applications for all statuses
      const [pendingData, rejectedData, approvedData] = await Promise.all([
        getAllEmployees().then((data) =>
          data.filter(
            (emp) =>
              emp.stage === "onboarding" &&
              emp.status === "pending" &&
              !emp.isHr
          )
        ),
        getAllEmployees().then((data) =>
          data.filter(
            (emp) =>
              emp.status === "rejected" &&
              !emp.isHr
          )
        ),
        getAllEmployees().then((data) =>
          data.filter(
            (emp) =>
              emp.stage === "onboarding" &&
              emp.status === "approved" &&
              !emp.isHr
          )
        ),
      ]);

      setPendingApplications(pendingData);
      setRejectedApplications(rejectedData);
      setApprovedApplications(approvedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage("Failed to load hiring management data");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateToken = async () => {
    if (!email || !email.includes("@")) {
      setMessage("Please enter a valid email address");
      return;
    }

    setProcessing(true);
    setMessage("");

    try {
      const testUser = localStorage.getItem("testUser");
      if (testUser) {
        // Mock success for testing
        const newToken = {
          id: Date.now().toString(),
          email,
          token: `token_${Date.now()}`,
          createdAt: new Date().toISOString(),
          expiresAt: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
          status: "valid",
        };
        setTokens((prev) => [newToken, ...prev]);
        setShowModal(false);
        setEmail("");
        setMessage("Registration token generated successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        await generateRegistrationToken(email);
        setShowModal(false);
        setEmail("");
        setMessage("Registration token generated successfully!");
        setTimeout(() => setMessage(""), 3000);
        fetchData(); // Refresh tokens
      }
    } catch (error) {
      setMessage(`Failed to generate token: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    // Handle ISO YYYY-MM-DD strings without timezone shift
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const date = new Date(`${dateString}T00:00:00`);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (_) {
      return "N/A";
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch (_) {
      return "N/A";
    }
  };

  const getTimeRemaining = (expiresAt) => {
    if (!expiresAt) return { text: "N/A", expired: true };
    try {
      const expiryDate = new Date(expiresAt);
      const now = new Date();
      if (expiryDate < now) {
        return { text: "Expired", expired: true };
      }
      const diffMs = expiryDate - now;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return { 
        text: `${diffHours}h ${diffMinutes}m`, 
        expired: false 
      };
    } catch (_) {
      return { text: "N/A", expired: true };
    }
  };

  const getTokenStatus = (token, isUsed) => {
    const timeRemaining = getTimeRemaining(token.expiresAt);
    if (isUsed) return { text: "Submitted", color: "green" };
    if (timeRemaining.expired) return { text: "Expired", color: "grey" };
    return { text: "Pending", color: "orange" };
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

  // Get employee name from token email
  const getTokenEmployeeName = (tokenEmail) => {
    // Try to find employee in applications by email
    const allApplications = [
      ...pendingApplications,
      ...rejectedApplications,
      ...approvedApplications,
    ];
    const emp = allApplications.find((e) => e.email === tokenEmail);
    if (emp) {
      return getFullName(emp);
    }
    return "N/A";
  };

  // Check if token has been used (employee registered)
  const isTokenUsed = (tokenEmail) => {
    // Check if there's an employee with this email
    const allApplications = [
      ...pendingApplications,
      ...rejectedApplications,
      ...approvedApplications,
    ];
    return allApplications.some((emp) => emp.email === tokenEmail);
  };

  const handleViewApplication = (employeeId, stage) => {
    // If stage is onboarding, go to onboarding review page
    // Otherwise, go to employee detail page (which shows all stages)
    const url = stage === "onboarding" 
      ? `/hr/review-onboarding/${employeeId}`
      : `/hr/employee-profile/${employeeId}`;
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="hiring-management-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="hiring-management-container">
      <HRNav active="hiring" />
      <div className="page-content">
        <div className="page-header">
          <h1>Hiring Management</h1>
          <p>Generate registration tokens and manage employee onboarding</p>
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
        <div className="page-tabs">
          <button
            className={`tab-button ${activeTab === "tokens" ? "active" : ""}`}
            onClick={() => setActiveTab("tokens")}
          >
            Registration Tokens
          </button>
          <button
            className={`tab-button ${activeTab === "onboarding" ? "active" : ""}`}
            onClick={() => setActiveTab("onboarding")}
          >
            Onboarding Applications
          </button>
        </div>

        {/* Registration Tokens Tab */}
        {activeTab === "tokens" && (
          <>
            {/* Registration Token Card */}
            <div className="token-card">
              <div className="token-card-content">
                <div className="token-card-text">
                  <h3>Registration Token</h3>
                  <p>Generate a registration token valid for 3 hours</p>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="generate-token-btn"
                  disabled={processing}
                >
                  <span className="btn-icon">✉</span>
                  Generate Token and Send Email
                </button>
              </div>
            </div>

            {/* Registration Token History */}
            <div className="section">
              <h2 className="section-title">Registration Token History</h2>

              {tokens.length === 0 ? (
                <div className="no-data">
                  <p>No registration tokens found.</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Email Address</th>
                        <th>Name</th>
                        <th>Registration Link</th>
                        <th>Created At</th>
                        <th>Expires At</th>
                        <th>Time Remaining</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tokens.map((token) => {
                        const registrationLink = `${window.location.origin}/register?token=${token.token}`;
                        const isUsed = isTokenUsed(token.email);
                        const statusInfo = getTokenStatus(token, isUsed);
                        const timeRemaining = getTimeRemaining(token.expiresAt);
                        
                        return (
                          <tr key={token._id}>
                            <td>{token.email}</td>
                            <td>{getTokenEmployeeName(token.email)}</td>
                            <td>
                              <div className="registration-link-cell">
                                <a
                                  href={registrationLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="registration-link"
                                >
                                  {registrationLink.substring(0, 30)}...
                                </a>
                              </div>
                            </td>
                            <td>{formatDateTime(token.createdAt)}</td>
                            <td>{formatDateTime(token.expiresAt)}</td>
                            <td className={timeRemaining.expired ? "expired-time" : ""}>
                              {timeRemaining.text}
                            </td>
                            <td>
                              <span
                                className={`status-badge status-${statusInfo.color}`}
                              >
                                {statusInfo.text}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* Onboarding Applications Tab */}
        {activeTab === "onboarding" && (
          <div className="applications-section">
            {/* Pending Applications */}
            <div className="section">
              <div className="section-header">
                <h2 className="section-title">Pending Applications</h2>
              </div>

              {pendingApplications.length === 0 ? (
                <div className="no-data">
                  <p>No pending applications at this time.</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Submission Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingApplications.map((app) => (
                        <tr key={app._id}>
                          <td>{getFullName(app)}</td>
                          <td>{app.email}</td>
                          <td>{formatDate(app.submissionDate)}</td>
                          <td>
                            <button
                              onClick={() => handleViewApplication(app._id, app.stage || "onboarding")}
                              className="view-btn"
                            >
                              View Application
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Rejected Applications */}
            <div className="section">
              <div className="section-header">
                <h2 className="section-title">Rejected Applications</h2>
              </div>

              {rejectedApplications.length === 0 ? (
                <div className="no-data">
                  <p>No rejected applications.</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Stage</th>
                        <th>Submission Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rejectedApplications.map((app) => (
                        <tr key={app._id}>
                          <td>{getFullName(app)}</td>
                          <td>{app.email}</td>
                          <td>{app.stage || "N/A"}</td>
                          <td>{formatDate(app.submissionDate)}</td>
                          <td>
                            <button
                              onClick={() => handleViewApplication(app._id, app.stage)}
                              className="view-btn"
                            >
                              View {app.stage === "onboarding" ? "Application" : "Details"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Approved Applications */}
            <div className="section">
              <div className="section-header">
                <h2 className="section-title">Approved Applications</h2>
              </div>

              {approvedApplications.length === 0 ? (
                <div className="no-data">
                  <p>No approved applications.</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Submission Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {approvedApplications.map((app) => (
                        <tr key={app._id}>
                          <td>{getFullName(app)}</td>
                          <td>{app.email}</td>
                          <td>{formatDate(app.submissionDate)}</td>
                          <td>
                            <button
                              onClick={() => handleViewApplication(app._id, app.stage || "onboarding")}
                              className="view-btn"
                            >
                              View Application
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Generate Token Modal */}
        {showModal && (
          <div
            className="modal-overlay"
            onClick={() => !processing && setShowModal(false)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Generate Registration Token</h3>
              <div className="modal-body">
                <label htmlFor="email">Email Address:</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter invitee's email"
                  disabled={processing}
                />
              </div>
              <div className="modal-footer">
                <button
                  onClick={handleGenerateToken}
                  className="generate-btn"
                  disabled={processing || !email}
                >
                  {processing ? "Generating..." : "Generate"}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="cancel-btn"
                  disabled={processing}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HRHiringManagementPage;
