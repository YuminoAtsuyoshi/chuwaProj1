import React, { useState } from 'react';
import { uploadFile } from '../api/auth';
import './FileUpload.css';

const FileUpload = ({ 
  label, 
  name, 
  accept, 
  fileType, 
  onUploadSuccess, 
  onUploadError,
  required = false,
  className = ''
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const response = await uploadFile(file, fileType);
      setUploadedFile({
        name: file.name,
        id: response.id,
        url: response.url,
        size: file.size
      });
      
      // Notify parent component
      onUploadSuccess(response.id, response.url);
      
    } catch (error) {
      setError(`Upload failed: ${error.message || 'Unknown error'}`);
      onUploadError(error);
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`file-upload ${className}`}>
      <label htmlFor={name} className="file-upload-label">
        {label} {required && <span className="required">*</span>}
      </label>
      
      <div className="file-upload-container">
        <input
          type="file"
          id={name}
          name={name}
          accept={accept}
          onChange={handleFileChange}
          disabled={uploading}
          className="file-input"
        />
        
        <label htmlFor={name} className="file-upload-button">
          {uploading ? (
            <span className="uploading">
              <span className="spinner"></span>
              Uploading...
            </span>
          ) : (
            <span>Choose File</span>
          )}
        </label>
        
        {uploadedFile && (
          <div className="uploaded-file">
            <div className="file-info">
              <span className="file-name">{uploadedFile.name}</span>
              <span className="file-size">({formatFileSize(uploadedFile.size)})</span>
            </div>
            <div className="upload-success">
              <span className="checkmark">✓</span>
              <span>Uploaded successfully</span>
            </div>
          </div>
        )}
        
        {error && (
          <div className="upload-error">
            <span className="error-icon">✗</span>
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
