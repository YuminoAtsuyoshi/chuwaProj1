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

    // File upload validation
    if (
      formData.workAuthType === "F1(CPT/OPT)" &&
      !uploadedFiles.optReceiptDocId
    ) {
      newErrors.optReceiptDocId =
        "OPT Receipt is required for F1(CPT/OPT) work authorization";
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
          optReceiptUpload: uploadedFiles.optReceiptDocId,
        };
        delete submissionData.profilPpicture;
        delete submissionData.optReceipt;

        await submitEmployeerInfo(employeeId, submissionData);
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
        optReceiptUpload: uploadedFiles.optReceiptDocId,
      };
      delete draftData.profilePicture;
      delete draftData.optReceipt;

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
