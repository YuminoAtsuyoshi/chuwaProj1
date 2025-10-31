import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getAllEmployees,
  sendNotification,
  approveEmployeeApplication,
  rejectEmployeeApplication,
  getOpts,
} from "../../api/auth";
import { useDocActions } from "./hooks/useDocActions";
import VisaManagementRow from "./components/VisaManagementRow";
import "./HRVisaManagementPage.css";

const HRVisaManagementPage = () => {
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [message, setMessage] = useState("");
  const [progressApplications, setProgressApplications] = useState([]);
  const [allApplications, setallApplications] = useState([]);

  useEffect(() => {
    // Check if user is HR
    if (!user?.isHr) {
      navigate("/login");
      return;
    }

    fetchData();
  }, [user?.isHr, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [progressData, AllData] = await Promise.all([
        getAllEmployees().then((data) =>
          data.filter(
            (emp) =>
              emp.personInfo !== null &&
              (emp.stage !== "I-20" || emp.status !== "approved") &&
              !emp.isHr
          )
        ),
        getAllEmployees().then((data) =>
          data.filter((emp) => emp.personInfo !== null && !emp.isHr)
        ),
      ]);

      setProgressApplications(progressData);
      setallApplications(AllData);
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
        <div className="loading">Loading...</div>
      </div>
    );
  }

  const handleViewApplication = (employeeId) => {
    const url = `/hr/review-onboarding/${employeeId}`;
    window.open(url, "_blank");
  };

  const { preview: handleDocumentPreview, download: handleDocumentDownload } =
    useDocActions(setMessage);

  const onPreview = async (employeeId, stage) => {
    const result = await getOpts({ employee_id: employeeId, type: stage });
    const id = result[0].doc;
    console.log(id);
    handleDocumentPreview(id);
  };
  const onDownload = async (employeeId, stage, filename) => {
    const result = await getOpts({ employee_id: employeeId, type: stage });
    const id = result[0].doc;
    handleDocumentDownload(id, filename);
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
    return isPrOrCitizen === "yes"
      ? prOrCitizenType || "Citizen/Permanent Resident"
      : isPrOrCitizen === "no"
      ? workAuthType || "N/A"
      : "N/A";
  };

  const getStartAndEndDate = (emp) => {
    if (!emp.personInfo) return "N/A to N/A";
    const { visaStartDate, visaEndDate } = emp.personInfo;
    return `${visaStartDate || "N/A"} to ${visaEndDate || "N/A"}`;
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

  const getNextSteps = (stage, status) => {
    if (status === "never_submit") {
      return "Submit onboarding form";
    } else if (status === "rejected") {
      return `Re-submit ${stage}`;
    } else if (status === "pending") {
      return `Waiting for HR approval of ${stage}`;
    } else if (status === "approved") {
      if (stage === "onboarding") {
        return "Submit OPT Receipt";
      } else if (stage === "OPT Receipt") {
        return "Submit OPT EAD";
      } else if (stage === "OPT EAD") {
        return "Submit I-983";
      } else if (stage === "I-983") {
        return "Submit I-20";
      } else if (stage === "I-20") {
        return "Complete";
      }
    }
  };

  const getAction = (emp) => {
    let oldStage, newStage;
    if (emp.status === "never_submit") {
      oldStage = "onboarding";
      newStage = "OPT Receipt";
      return (
        <button
          onClick={async () =>
            await sendNotification(emp.email, oldStage, newStage)
          }
          className="view-btn"
        >
          Send Notification
        </button>
      );
    } else if (emp.status === "rejected" || emp.status === "pending") {
      if (emp.stage === "onboarding") {
        return (
          <>
            <button
              onClick={() => handleViewApplication(emp._id)}
              className="view-btn"
            >
              View Application
            </button>
            <br />
            <button
              onClick={async () => {
                await approveEmployeeApplication(emp._id), navigate(0);
              }}
              className="approve-btn"
            >
              Approve
            </button>
            <button
              onClick={async () => {
                await rejectEmployeeApplication(emp._id), navigate(0);
              }}
              className="reject-btn"
            >
              Reject
            </button>
          </>
        );
      } else {
        return (
          <>
            <div className="document-item">
              <div className="document-info">
                <span className="document-name">{emp.stage}</span>
                <span className="document-type">PDF</span>
              </div>
              <div className="document-actions">
                <button
                  onClick={() => onPreview(emp._id, emp.stage)}
                  className="preview-btn"
                >
                  Preview
                </button>
                <button
                  onClick={() =>
                    onDownload(
                      emp._id,
                      emp.stage,
                      `${emp.username}-${emp.stage}`
                    )
                  }
                  className="download-btn"
                >
                  Download
                </button>
              </div>
            </div>
            <button
              onClick={async () => {
                await approveEmployeeApplication(emp._id), navigate(0);
              }}
              className="approve-btn"
            >
              Approve
            </button>
            <button
              onClick={async () => {
                await rejectEmployeeApplication(emp._id), navigate(0);
              }}
              className="reject-btn"
            >
              Reject
            </button>
          </>
        );
      }
    } else if (emp.status === "approved") {
      if (emp.stage === "onboarding") {
        oldStage = "onboarding";
        newStage = "OPT Receipt";
      } else if (emp.stage === "OPT Receipt") {
        oldStage = "OPT Receipt";
        newStage = "OPT EAD";
      } else if (emp.stage === "OPT EAD") {
        oldStage = "OPT EAD";
        newStage = "I-983";
      } else if (emp.stage === "I-983") {
        oldStage = "I-983";
        newStage = "I-20";
      }
      return (
        <button
          onClick={async () => sendNotification(emp.email, oldStage, newStage)}
          className="view-btn"
        >
          Send Notification
        </button>
      );
    }
  };

  return (
    <div className="visa-management-container">
      <div className="page-header">
        <h1>Visa Management</h1>
        <p>Review and approve visa documents.</p>
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
      {/* In Progress Section */}
      <div className="section">
        <div className="section-header">
          <h2>📥 In progress</h2>
        </div>
        {progressApplications.length === 0 ? (
          <div className="no-data">
            <p>No employee in progress.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Work Authorization</th>
                  <th>Next Steps</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {progressApplications.map((data) => {
                  return (
                    <tr key={data._id}>
                      <td>{getFullName(data)}</td>
                      <td>
                        {getWorkAuthTitle(data)}
                        <br />
                        {getStartAndEndDate(data)}
                        <br />
                        {getDaysBetween(data)}
                      </td>
                      <td>{getNextSteps(data.stage, data.status)}</td>
                      <td>{getAction(data)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* All Section */}
      <div className="section">
        <div className="section-header">
          <h2>📋 All</h2>
        </div>
        {allApplications.length === 0 ? (
          <div className="no-data">
            <p>No employee now.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Work Authorization</th>
                  <th>Next Steps</th>
                  <th>Document</th>
                </tr>
              </thead>
              <tbody>
                {allApplications.map((data) => {
                  return (
                    <VisaManagementRow
                      getFullName={getFullName}
                      getWorkAuthTitle={getWorkAuthTitle}
                      getStartAndEndDate={getStartAndEndDate}
                      getDaysBetween={getDaysBetween}
                      getNextSteps={getNextSteps}
                      data={data}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HRVisaManagementPage;
