import { useState } from "react";
import { getDocumentUrl } from "../../../api/auth";

export const useFileUpload = ({ setErrors, setMessage }) => {
  const [uploadedFiles, setUploadedFiles] = useState({
    profilePictureDocId: null,
    driverLicenseDocId: null,
    optReceiptDocId: null,
    workAuthDocId: null,
  });

  const handleFileUploadSuccess = (fileType, docId, _docUrl) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [fileType]: docId,
    }));

    setErrors((prev) => ({
      ...prev,
      [fileType]: "",
    }));
  };

  const handleFileUploadError = (fileType, error) => {
    setErrors((prev) => ({
      ...prev,
      [fileType]: `Upload failed: ${error.message || "Unknown error"}`,
    }));
  };

  const handleDocumentDownload = async (docId, fileName) => {
    try {
      const response = await getDocumentUrl(docId);
      const link = document.createElement("a");
      link.href = response.url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      setMessage?.(`Download failed: ${error.message || "Unknown error"}`);
    }
  };

  const handleDocumentPreview = async (docId) => {
    try {
      const response = await getDocumentUrl(docId);
      window.open(response.url, "_blank");
    } catch (error) {
      console.error("Preview failed:", error);
      setMessage?.(`Preview failed: ${error.message || "Unknown error"}`);
    }
  };

  return {
    uploadedFiles,
    setUploadedFiles,
    handleFileUploadSuccess,
    handleFileUploadError,
    handleDocumentDownload,
    handleDocumentPreview,
  };
};
