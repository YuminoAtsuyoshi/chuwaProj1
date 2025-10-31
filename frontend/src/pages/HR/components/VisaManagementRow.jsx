import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getOpts } from "../../../api/auth";
import { useDocActions } from "../hooks/useDocActions";

const VisaManagementRow = ({
  getFullName,
  getWorkAuthTitle,
  getStartAndEndDate,
  getDaysBetween,
  getNextSteps,
  data,
}) => {
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const { preview: handleDocumentPreview, download: handleDocumentDownload } =
    useDocActions(setMessage);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getOpts({ employee_id: data._id });
      setDocuments(result);
      if (data.status === "pending" || data.status === "rejected") {
        const updatedResult = documents.filter(
          (item) => item.type !== data.stage
        );
        setDocuments(updatedResult);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  if (loading) {
    return "";
  }

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
      <td>
        <div className="document-list">
          {documents.map((doc) => {
            return (
              <>
                <div className="document-item">
                  <div className="document-info">
                    <span className="document-name">{doc.type}</span>
                    <span className="document-type">PDF</span>
                  </div>
                  <div className="document-actions">
                    <button
                      onClick={() => handleDocumentPreview(doc.doc)}
                      className="preview-btn"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() =>
                        handleDocumentDownload(
                          doc.doc,
                          `${data.username}-${doc.type}`
                        )
                      }
                      className="download-btn"
                    >
                      Download
                    </button>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      </td>
    </tr>
  );
};

export default VisaManagementRow;
