import { useCallback } from "react";
import { submitEmployeerInfo, saveDraftEmployeerInfo } from "../../../api/auth";

export const useOnboardingForm = ({
  user,
  employee,
  formData,
  uploadedFiles,
  setErrors,
  setMessage,
  setSubmitting,
  setSavingDraft,
}) => {
  const validateForm = useCallback(() => {
    const newErrors = {};

    // Required fields
    const requiredFields = [
      "firstName",
      "lastName",
      "addressBuilding",
      "addressStreet",
      "addressCity",
      "addressState",
      "addressZip",
      "cellPhone",
      "ssn",
      "dateOfBirth",
      "gender",
      "referenceFirstName",
      "referenceLastName",
      "referenceRelationship",
    ];
    requiredFields.forEach((field) => {
      if (!formData[field]) newErrors[field] = "This field is required";
    });

    // Citizenship/Work Authorization validation
    if (!formData.isPrOrCitizen) {
      newErrors.isPrOrCitizen = "Please specify citizenship status";
    } else if (formData.isPrOrCitizen === "yes" && !formData.prOrCitizenType) {
      newErrors.prOrCitizenType = "Please specify citizenship type";
    } else if (formData.isPrOrCitizen === "no" && !formData.workAuthType) {
      newErrors.workAuthType = "Please specify work authorization type";
    }

    // SSN validation (must be exactly 9 digits numeric)
    const ssnDigits = (formData.ssn || "").replace(/\D/g, "");
    if (!/^\d{9}$/.test(ssnDigits)) {
      newErrors.ssn = "SSN must be exactly 9 digits";
    }

    // Date of birth validation (>= 1900-01-01, past date; age: 0–120 years)
    if (formData.dateOfBirth) {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      const dobDay = new Date(dob.getFullYear(), dob.getMonth(), dob.getDate());
      const todayDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      const minDob = new Date(1900, 0, 1);

      if (dobDay < minDob) {
        newErrors.dateOfBirth = "Date of birth must be after 1900-01-01.";
      } else if (dobDay >= todayDay) {
        newErrors.dateOfBirth = "Please enter a past date.";
      } else {
        const ageYears =
          (todayDay.getTime() - dobDay.getTime()) /
          (1000 * 60 * 60 * 24 * 365.25);
        if (ageYears > 120 || ageYears <= 0) {
          newErrors.dateOfBirth = "Please enter a valid age.";
        }
      }
    }

    // Work auth dates validation 
    if (formData.isPrOrCitizen === "no" && formData.workAuthType) {
      const minDate = new Date(1900, 0, 1);
      // 两个日期都填写时做先后验证
      if (formData.visaStartDate && formData.visaEndDate) {
        const start = new Date(formData.visaStartDate);
        const end = new Date(formData.visaEndDate);
        if (start < minDate || end < minDate) {
          newErrors.visaStartDate = "Dates must be after 1900-01-01";
        }
        if (start > end) {
          newErrors.visaEndDate = "End date cannot be earlier than start date";
        }
      }
    }

    // File upload validation
    if (formData.isPrOrCitizen === "no" && formData.workAuthType) {
      if (!uploadedFiles.workAuthDocId) {
        newErrors.workAuthDocId = "Work authorization document is required";
      }
      if (formData.workAuthType === "F1 OPT" && !uploadedFiles.optReceiptDocId) {
        newErrors.optReceiptDocId =
          "OPT Receipt is required for F1 OPT work authorization";
      }
    }

    // Emergency contacts validation
    (formData.emergencyContact || []).forEach((contact, index) => {
      if (
        !contact.firstName ||
        !contact.lastName ||
        !contact.phone ||
        !contact.relationship
      ) {
        newErrors[`emergencyContact_${index}`] =
          "Emergency contact must have first name, last name, phone, and relationship";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, uploadedFiles, setErrors]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setMessage("");
      if (!validateForm()) return;

      setSubmitting(true);
      try {
        const employeeId = user?._id || employee?._id;
        if (!employeeId) throw new Error("Employee ID not found");

        const submissionData = {
          ...formData,
          profilePicture: uploadedFiles.profilePictureDocId,
          driverLicense: uploadedFiles.driverLicenseDocId,
          workAuthDoc: uploadedFiles.workAuthDocId,
          optReceipt: uploadedFiles.optReceiptDocId,
        };
        delete submissionData.profilePicture; // remove any File object shadow

        // Save latest data first (draft), then submit for review
        await saveDraftEmployeerInfo(employeeId, submissionData);
        await submitEmployeerInfo(employeeId, {});
        setMessage("Application submitted successfully! Redirecting...");
        setTimeout(() => window.location.reload(), 2000);
      } catch (error) {
        setMessage(`Submission failed: ${error.message || "Unknown error"}`);
      } finally {
        setSubmitting(false);
      }
    },
    [
      validateForm,
      setMessage,
      setSubmitting,
      user,
      employee,
      formData,
      uploadedFiles,
    ]
  );

  const handleSaveDraft = useCallback(async () => {
    setMessage("");
    setSavingDraft(true);
    try {
      const employeeId = user?._id || employee?._id;
      if (!employeeId) throw new Error("Employee ID not found");

      const draftData = {
        ...formData,
        profilePicture: uploadedFiles.profilePictureDocId,
        driverLicense: uploadedFiles.driverLicenseDocId,
        workAuthDoc: uploadedFiles.workAuthDocId,
        optReceipt: uploadedFiles.optReceiptDocId,
      };
      delete draftData.profilePicture; // remove any File object shadow

      await saveDraftEmployeerInfo(employeeId, draftData);
      setMessage("Draft saved successfully!");
    } catch (error) {
      setMessage(`Failed to save draft: ${error.message || "Unknown error"}`);
    } finally {
      setSavingDraft(false);
    }
  }, [setMessage, setSavingDraft, user, employee, formData, uploadedFiles]);

  return { handleSubmit, handleSaveDraft };
};
