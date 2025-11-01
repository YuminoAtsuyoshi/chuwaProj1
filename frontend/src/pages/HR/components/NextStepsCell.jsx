import React, { useState, useEffect } from "react";
import { getOpts } from "../../../api/auth";

/**
 * Component to display Next Steps for an employee
 * Fetches OPT documents to determine the correct Next Step message
 */
const NextStepsCell = ({ employee }) => {
  const [loading, setLoading] = useState(true);
  const [nextStep, setNextStep] = useState("");
  const [optDocuments, setOptDocuments] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const result = await getOpts({ employee_id: employee._id });
        // Keep only the most relevant document of each type
        // Priority: pending > approved > rejected, then latest by date
        const docsByType = {};
        result.forEach((doc) => {
          const existing = docsByType[doc.type];
          if (!existing) {
            docsByType[doc.type] = doc;
          } else {
            const statusPriority = { pending: 3, approved: 2, rejected: 1 };
            const docPriority = statusPriority[doc.status] || 0;
            const existingPriority = statusPriority[existing.status] || 0;
            if (docPriority > existingPriority || 
                (docPriority === existingPriority && new Date(doc.createdAt) > new Date(existing.createdAt))) {
              docsByType[doc.type] = doc;
            }
          }
        });
        const uniqueDocs = Object.values(docsByType);
        setOptDocuments(uniqueDocs);
        
        // Calculate Next Step based on stage, status, documents, and employee info
        const step = calculateNextStep(employee, uniqueDocs);
        setNextStep(step);
      } catch (error) {
        console.error("Error fetching documents for Next Step:", error);
        // Fallback to basic calculation
        const step = calculateNextStep(employee, []);
        setNextStep(step);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [employee._id, employee.stage, employee.status]);

  const calculateNextStep = (employee, documents) => {
    const { stage, status } = employee;
    
    if (status === "never_submit") {
      return "Submit onboarding form";
    } else if (status === "rejected") {
      return `Re-submit ${stage}`;
    } else if (status === "pending") {
      // When status is pending, find the actual pending document
      const pendingDocs = documents.filter((doc) => doc.status === "pending" || !doc.status);
      if (pendingDocs.length > 0) {
        // Get the latest pending document
        const latestPending = pendingDocs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        return `Waiting for HR approval of ${latestPending.type}`;
      }
      // Fallback to stage if no pending document found
      return `Waiting for HR approval of ${stage}`;
    } else if (status === "approved") {
      // First, check if there's a pending document for the NEXT stage
      let nextStageDocument = null;
      if (stage === "onboarding") {
        nextStageDocument = documents.find((doc) => doc.type === "OPT Receipt");
      } else if (stage === "OPT Receipt") {
        nextStageDocument = documents.find((doc) => doc.type === "OPT EAD");
      } else if (stage === "OPT EAD") {
        nextStageDocument = documents.find((doc) => doc.type === "I-983");
      } else if (stage === "I-983") {
        nextStageDocument = documents.find((doc) => doc.type === "I-20");
      }
      
      // If there's a pending document, show waiting for HR approval message
      if (nextStageDocument && (nextStageDocument.status === "pending" || !nextStageDocument.status)) {
        return `Waiting for HR approval of ${nextStageDocument.type}`;
      }
      
      // Otherwise, show the next action for employee
      if (stage === "onboarding") {
        // Check if employee has submitted OPT Receipt
        const hasOptReceipt = documents.some(
          (doc) => doc.type === "OPT Receipt" && doc.doc
        );
        const hasOptReceiptInInfo = employee.personInfo?.optReceipt;
        
        if (hasOptReceipt || hasOptReceiptInInfo) {
          return "Submit OPT EAD";
        } else {
          return "Submit OPT Receipt";
        }
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
    return "";
  };

  if (loading) {
    return <span>Loading...</span>;
  }

  return <span>{nextStep}</span>;
};

export default NextStepsCell;

