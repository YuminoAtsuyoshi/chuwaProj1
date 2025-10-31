import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getEmployeeDetails, getEmployeerInfo } from "../../api/auth";
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
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getEmployeeDetails(user._id);
        setEmployee(data);
        try {
          const info = await getEmployeerInfo(user._id);
          setEmployeeInfo(info);
        } catch (_) {}
      } catch (error) {
        console.error("Error fetching employee detail:", error);
      } finally {
        setLoading(false);
      }
    };

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

  return (
    <div className="visa-management-container">
      <EmployeeNav active="visa" />
      <div className="page-header">
        <h1>Visa Status Management</h1>
        <p>Track and manage your OPT work authorization documents</p>
      </div>
      {!isF1OPT ? (
        <div className="no-data">
          <h2>Not available for your current work authorization</h2>
          <p>Only employees with F1 OPT can use this page.</p>
        </div>
      ) : (
        <>
          <VisaOptReceiptSection
            stage={employee?.stage}
            status={employee?.status}
            feedback={employee?.feedback}
          />
          <VisaOptEadSection
            stage={employee?.stage}
            status={employee?.status}
            feedback={employee?.feedback}
          />
          <VisaI983FormSection
            stage={employee?.stage}
            status={employee?.status}
            feedback={employee?.feedback}
          />
          <VisaI20Section
            stage={employee?.stage}
            status={employee?.status}
            feedback={employee?.feedback}
          />
        </>
      )}
    </div>
  );
};

export default VisaManagementPage;


