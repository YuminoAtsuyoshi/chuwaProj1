import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getEmployeeDetails, getEmployeerInfo, getOpts } from "../../api/auth";
import EmployeeNav from "../../components/EmployeeNav";
import VisaOptReceiptSection from "./components/VisaOptReceiptSection";
import VisaOptEadSection from "./components/VisaOptEadSection";
import VisaI983FormSection from "./components/VisaI983FormSection";
import VisaI20Section from "./components/VisaI20Section";
import "./VisaManagementPage.css";

const VisaManagementPage = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [optDocs, setOptDocs] = useState({});
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.user);

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getEmployeeDetails(user._id);
        setEmployee(data);
        try {
          const info = await getEmployeerInfo(user._id);
          setEmployeeInfo(info);
        } catch (_) {}
      
      // Fetch OPT documents
      try {
        const opts = await getOpts({ employee_id: user._id });
        const docsByType = {};
        opts.forEach((opt) => {
          // Keep only the most relevant document of each type
          // Priority: pending > approved > rejected, then latest by date
          const existing = docsByType[opt.type];
          if (!existing) {
            docsByType[opt.type] = opt;
          } else {
            const statusPriority = { pending: 3, approved: 2, rejected: 1 };
            const optPriority = statusPriority[opt.status] || 0;
            const existingPriority = statusPriority[existing.status] || 0;
            if (optPriority > existingPriority || 
                (optPriority === existingPriority && new Date(opt.createdAt) > new Date(existing.createdAt))) {
              docsByType[opt.type] = opt;
            }
          }
        });
        setOptDocs(docsByType);
      } catch (_) {}
      } catch (error) {
        console.error("Error fetching employee detail:", error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    if (user?._id) {
      fetchData();
    }
  }, [user?._id]);

  if (loading) {
    return (
      <div className="visa-management-container">
        <EmployeeNav active="visa" />
        <div className="loading">Loading...</div>
      </div>
    );
  }

  const isF1OPT =
    (employeeInfo?.workAuthType && employeeInfo.workAuthType === "F1 OPT") ||
    (employeeInfo?.visaTitle || "").toUpperCase().includes("OPT");

  const handleUpdate = async () => {
    await fetchData();
  };

  // Prepare document sections data
  const documentSections = [
    {
      type: "OPT Receipt",
      component: VisaOptReceiptSection,
      optDoc: optDocs["OPT Receipt"],
      optReceiptFromInfo: employeeInfo?.optReceipt,
      prevDocType: null, // No previous document
    },
    {
      type: "OPT EAD",
      component: VisaOptEadSection,
      optDoc: optDocs["OPT EAD"],
      optReceiptFromInfo: employeeInfo?.optReceipt,
      prevDocType: "OPT Receipt",
    },
    {
      type: "I-983",
      component: VisaI983FormSection,
      optDoc: optDocs["I-983"],
      prevDocType: "OPT EAD",
    },
    {
      type: "I-20",
      component: VisaI20Section,
      optDoc: optDocs["I-20"],
      prevDocType: "I-983",
    },
  ];

  return (
    <div className="visa-management-container">
      <EmployeeNav active="visa" />
      <div className="page-content">
      <div className="page-header">
        <h1>Visa Status Management</h1>
        <p>Track and manage your OPT work authorization documents</p>
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
      {!isF1OPT ? (
        <div className="no-data">
          <h2>Not available for your current work authorization</h2>
          <p>Only employees with F1 OPT can use this page.</p>
        </div>
      ) : (
          <div className="visa-cards-container">
            {documentSections.map((section) => {
              const SectionComponent = section.component;
              return (
                <SectionComponent
                  key={section.type}
                  currentStage={employee?.stage}
                  currentStatus={employee?.status}
                  currentFeedback={employee?.feedback}
                  employeeId={user?._id}
                  optDoc={section.optDoc}
                  optReceiptFromInfo={section.optReceiptFromInfo}
                  prevDoc={section.prevDocType ? optDocs[section.prevDocType] : null}
                  prevDocType={section.prevDocType}
                  onUpdate={handleUpdate}
                  setMessage={setMessage}
          />
              );
            })}
          </div>
      )}
      </div>
    </div>
  );
};

export default VisaManagementPage;
