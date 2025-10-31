import { useState, useCallback } from "react";
import { saveDraftEmployeerInfo } from "../../../api/auth";

export const usePIEditing = ({
  user,
  employeeInfo,
  setEmployeeInfo,
  setMessage,
}) => {
  const [saving, setSaving] = useState(false);
  const [editModes, setEditModes] = useState({
    name: false,
    address: false,
    contact: false,
    identity: false,
  });
  const [tempData, setTempData] = useState({});

  const handleEdit = useCallback(
    (section) => {
      setEditModes((prev) => ({ ...prev, [section]: true }));
      if (section === "name") {
        setTempData({
          firstName: employeeInfo?.firstName || "",
          lastName: employeeInfo?.lastName || "",
          middleName: employeeInfo?.middleName || "",
          preferredName: employeeInfo?.preferredName || "",
        });
      } else if (section === "address") {
        setTempData({
          addressBuilding: employeeInfo?.addressBuilding || "",
          addressStreet: employeeInfo?.addressStreet || "",
          addressCity: employeeInfo?.addressCity || "",
          addressState: employeeInfo?.addressState || "",
          addressZip: employeeInfo?.addressZip || "",
        });
      } else if (section === "contact") {
        setTempData({
          cellPhone: employeeInfo?.cellPhone || "",
          workPhone: employeeInfo?.workPhone || "",
        });
      } else if (section === "identity") {
        setTempData({
          ssn: employeeInfo?.ssn || "",
          dateOfBirth: employeeInfo?.dateOfBirth || "",
          gender: employeeInfo?.gender || "",
        });
      }
    },
    [employeeInfo]
  );

  const handleSave = useCallback(
    async (section) => {
      setSaving(true);
      setMessage?.("");
      try {
        const employeeId = user?._id;
        if (!employeeId) throw new Error("Employee ID not found");

        const updatedData = { ...employeeInfo, ...tempData };

        if (section === "name" && (!tempData.firstName || !tempData.lastName))
          throw new Error("First name and last name are required");
        if (
          section === "address" &&
          (!tempData.addressBuilding ||
            !tempData.addressStreet ||
            !tempData.addressCity ||
            !tempData.addressState ||
            !tempData.addressZip)
        )
          throw new Error("All address fields are required");
        if (section === "contact" && !tempData.cellPhone)
          throw new Error("Cell phone is required");
        if (
          section === "identity" &&
          (!tempData.ssn || !tempData.dateOfBirth || !tempData.gender)
        )
          throw new Error("SSN, date of birth, and gender are required");

        await saveDraftEmployeerInfo(employeeId, updatedData);
        setEmployeeInfo(updatedData);
        setEditModes((prev) => ({ ...prev, [section]: false }));
        setMessage?.("Changes saved successfully!");
        setTimeout(() => setMessage?.(""), 3000);
      } catch (error) {
        setMessage?.(
          `Failed to save changes: ${error.message || "Unknown error"}`
        );
      } finally {
        setSaving(false);
      }
    },
    [user?._id, employeeInfo, tempData, setEmployeeInfo, setMessage]
  );

  const handleCancel = useCallback(
    (section) => {
      let hasChanges = false;
      if (section === "name") {
        hasChanges =
          tempData.firstName !== employeeInfo?.firstName ||
          tempData.lastName !== employeeInfo?.lastName ||
          tempData.middleName !== employeeInfo?.middleName ||
          tempData.preferredName !== employeeInfo?.preferredName;
      } else if (section === "address") {
        hasChanges =
          tempData.addressBuilding !== employeeInfo?.addressBuilding ||
          tempData.addressStreet !== employeeInfo?.addressStreet ||
          tempData.addressCity !== employeeInfo?.addressCity ||
          tempData.addressState !== employeeInfo?.addressState ||
          tempData.addressZip !== employeeInfo?.addressZip;
      } else if (section === "contact") {
        hasChanges =
          tempData.cellPhone !== employeeInfo?.cellPhone ||
          tempData.workPhone !== employeeInfo?.workPhone;
      } else if (section === "identity") {
        hasChanges =
          tempData.ssn !== employeeInfo?.ssn ||
          tempData.dateOfBirth !== employeeInfo?.dateOfBirth ||
          tempData.gender !== employeeInfo?.gender;
      }
      if (hasChanges) {
        const confirmed = window.confirm(
          "Do you want to discard all of your changes?"
        );
        if (!confirmed) return;
      }
      setEditModes((prev) => ({ ...prev, [section]: false }));
      setTempData({});
    },
    [tempData, employeeInfo]
  );

  const handleInputChange = useCallback((field, value) => {
    setTempData((prev) => ({ ...prev, [field]: value }));
  }, []);

  return {
    saving,
    editModes,
    tempData,
    handleEdit,
    handleSave,
    handleCancel,
    handleInputChange,
  };
};
