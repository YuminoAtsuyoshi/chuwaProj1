import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getRegistrationTokens,
  generateRegistrationToken,
  getAllEmployees,
} from "../../api/auth";
import "./HRHiringManagementPage.css";

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
        // Mock registration tokens
        const mockTokens = [
          {
            _id: "1",
            email: "newuser1@example.com",
            token: "abc123xyz",
            createdAt: "2024-01-15T10:00:00Z",
            expiresAt: "2024-02-15T10:00:00Z",
            status: "valid",
          },
          {
            _id: "2",
            email: "newuser2@example.com",
            token: "def456uvw",
            createdAt: "2024-01-10T08:00:00Z",
            expiresAt: "2024-02-10T08:00:00Z",
            status: "expired",
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
              emp.stage === "onboarding" &&
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
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getFullName = (emp) => {
    if (emp.employeerInfo) {
      const parts = [
        emp.employeerInfo.firstName,
        emp.employeerInfo.middleName,
        emp.employeerInfo.lastName,
      ].filter(Boolean);
      return parts.join(" ");
    }
    return emp.email || "N/A";
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

  const handleViewApplication = (employeeId) => {
    const url = `/hr/review-onboarding/${employeeId}`;
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
      <div className="page-header">
        <h1>Hiring Management</h1>
        <p>Manage registration tokens and review pending applications</p>
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

      {/* Registration Token Management Section */}
      <div className="section">
        <div className="section-header">
          <h2>🔑 Registration Token Management</h2>
          <button
            onClick={() => setShowModal(true)}
            className="generate-btn"
            disabled={processing}
          >
            Generate Token
          </button>
        </div>

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
                  <th>Registration Link</th>
                  <th>Created At</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tokens.map((token) => {
                  const registrationLink = `${window.location.origin}/register?token=${token.token}`;
                  const tokenStatus = isTokenUsed(token.email)
                    ? "Submitted"
                    : "Not Submitted";
                  return (
                    <tr key={token._id}>
                      <td>{token.email}</td>
                      <td>
                        <a
                          href={registrationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="registration-link"
                        >
                          {registrationLink}
                        </a>
                      </td>
                      <td>{formatDate(token.createdAt)}</td>
                      <td>
                        <span
                          className={`status-badge status-${tokenStatus
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {tokenStatus}
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

      {/* Application Reviews Section */}
      <div className="applications-section">
        {/* Pending Applications */}
        <div className="section">
          <div className="section-header">
            <h2>📥 Pending Applications</h2>
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
                          onClick={() => handleViewApplication(app._id)}
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
            <h2>❌ Rejected Applications</h2>
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
                    <th>Submission Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rejectedApplications.map((app) => (
                    <tr key={app._id}>
                      <td>{getFullName(app)}</td>
                      <td>{app.email}</td>
                      <td>{formatDate(app.submissionDate)}</td>
                      <td>
                        <button
                          onClick={() => handleViewApplication(app._id)}
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

        {/* Approved Applications */}
        <div className="section">
          <div className="section-header">
            <h2>✅ Approved Applications</h2>
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
                          onClick={() => handleViewApplication(app._id)}
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
  );
};

export default HRHiringManagementPage;
