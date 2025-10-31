import React from "react";
import FileUpload from "../../../components/FileUpload";

const WorkAuthSection = ({
  formData,
  errors,
  onChange,
  onUploadSuccess,
  onUploadError,
}) => {
  return (
    <div className="form-section">
      <h3>Citizenship/Work Authorization</h3>
      <div className="form-group">
        <label>Permanent resident or citizen of the U.S.? *</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="isPrOrCitizen"
              value="yes"
              checked={formData.isPrOrCitizen === "yes"}
              onChange={onChange}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="isPrOrCitizen"
              value="no"
              checked={formData.isPrOrCitizen === "no"}
              onChange={onChange}
            />
            No
          </label>
        </div>
        {errors.isPrOrCitizen && (
          <span className="error-message">{errors.isPrOrCitizen}</span>
        )}
      </div>

      {formData.isPrOrCitizen === "yes" && (
        <div className="form-group">
          <label htmlFor="prOrCitizenType">Citizenship Type *</label>
          <select
            id="prOrCitizenType"
            name="prOrCitizenType"
            value={formData.prOrCitizenType}
            onChange={onChange}
            className={errors.prOrCitizenType ? "error" : ""}
          >
            <option value="">Select Type</option>
            <option value="Green Card">Green Card</option>
            <option value="Citizen">Citizen</option>
          </select>
          {errors.prOrCitizenType && (
            <span className="error-message">{errors.prOrCitizenType}</span>
          )}
        </div>
      )}

      {formData.isPrOrCitizen === "no" && (
        <div className="form-group">
          <label htmlFor="workAuthType">Work Authorization Type *</label>
          <select
            id="workAuthType"
            name="workAuthType"
            value={formData.workAuthType}
            onChange={onChange}
            className={errors.workAuthType ? "error" : ""}
          >
            <option value="">Select Type</option>
            <option value="H1-B">H1-B</option>
            <option value="L2">L2</option>
            <option value="F1 CPT">F1 CPT</option>
            <option value="F1 OPT">F1 OPT</option>
            <option value="H4">H4</option>
            <option value="Other">Other</option>
          </select>
          {errors.workAuthType && (
            <span className="error-message">{errors.workAuthType}</span>
          )}
        </div>
      )}

      {/* For any non-citizen work auth type, always require a document and start/end dates */}
      {formData.isPrOrCitizen === "no" && formData.workAuthType && (
        <>
          <div className="file-action-row">
            <FileUpload
            label="Work Authorization Document *"
            name="work_auth_document"
            accept=".pdf,.jpg,.jpeg,.png"
            fileType="workAuthDocId"
            onUploadSuccess={(docId, docUrl) =>
              onUploadSuccess("workAuthDocId", docId, docUrl)
            }
            onUploadError={(error) => onUploadError("workAuthDocId", error)}
            className={errors.workAuthDocId ? "error" : ""}
            required={true}
            />
          </div>
          {errors.workAuthDocId && (
            <div className="inline-error-text">{errors.workAuthDocId}</div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="visaStartDate">Work Auth Start Date</label>
              <input
                type="date"
                id="visaStartDate"
                name="visaStartDate"
                value={formData.visaStartDate}
                onChange={onChange}
                min="1900-01-01"
              />
              {errors.visaStartDate && (
                <span className="error-message">{errors.visaStartDate}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="visaEndDate">Work Auth End Date</label>
              <input
                type="date"
                id="visaEndDate"
                name="visaEndDate"
                value={formData.visaEndDate}
                onChange={onChange}
                min="1900-01-01"
              />
              {errors.visaEndDate && (
                <span className="error-message">{errors.visaEndDate}</span>
              )}
            </div>
          </div>
        </>
      )}

      {formData.workAuthType === "F1 OPT" && (
        <div>
          <div className="file-action-row">
            <FileUpload
            label="OPT Receipt"
            name="optReceipt"
            accept=".pdf,.jpg,.jpeg,.png"
            fileType="optReceiptDocId"
            onUploadSuccess={(docId, docUrl) =>
              onUploadSuccess("optReceiptDocId", docId, docUrl)
            }
            onUploadError={(error) => onUploadError("optReceiptDocId", error)}
            className={errors.optReceiptDocId ? "error" : ""}
            required={true}
            />
          </div>
          {errors.optReceiptDocId && (
            <div className="inline-error-text">{errors.optReceiptDocId}</div>
          )}
        </div>
      )}

      {formData.isPrOrCitizen === "no" && formData.workAuthType === "Other" && (
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="visaTitle">Visa Title</label>
            <input
              type="text"
              id="visaTitle"
              name="visaTitle"
              value={formData.visaTitle}
              onChange={onChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkAuthSection;
