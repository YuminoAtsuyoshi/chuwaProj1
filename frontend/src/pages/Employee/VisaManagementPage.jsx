import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getEmployeeDetails, createOpt } from "../../api/auth";
import VisaOptReceiptSection from "./components/VisaOptReceiptSection";
import VisaOptEadSection from "./components/VisaOptEadSection";
import VisaI983FormSection from "./components/VisaI983FormSection";
import VisaI20Section from "./components/VisaI20Section";
import "./VisaManagementPage.css";

const VisaManagementPage = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getEmployeeDetails(user._id);
        setEmployee(data);
      } catch (error) {
        console.error("Error fetching employee detail:", error);
        setMessage("Failed to load personal information");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?._id]);

  if (loading) {
    return (
      <div className="visa-management-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="visa-management-container">
      <div className="page-header">
        <h1>Visa Status Management</h1>
        <p>Track and manage your OPT work authorization documents</p>
      </div>
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
    </div>
  );
};

export default VisaManagementPage;
