import axios from "axios";

// Create axios instance with base configuration
const authAPI = axios.create({
  baseURL: "http://localhost:3000/api/auth",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create axios instance for employee endpoints
const employeeAPI = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
employeeAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login API call
export const login = async (credentials) => {
  try {
    const response = await authAPI.post("/login", credentials);
    return response.data;
  } catch (error) {
    // Handle network errors (backend not running)
    if (
      error.code === "ECONNREFUSED" ||
      error.code === "ERR_NETWORK" ||
      error.message?.includes("Network Error")
    ) {
      throw new Error(
        "无法连接到服务器。请确保后端服务已启动在 http://localhost:3000"
      );
    }
    // Handle HTTP errors
    if (error.response) {
      const errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        `服务器错误: ${error.response.status}`;
      throw new Error(errorMessage);
    }
    // Handle other errors
    throw new Error(error.message || "登录失败：未知错误");
  }
};

// Register API call
export const register = async (userData) => {
  try {
    const response = await authAPI.post("/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get employee details
export const getEmployeeDetails = async (employeeId) => {
  try {
    const response = await employeeAPI.get(`/employees/${employeeId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get employeer info
export const getEmployeerInfo = async (employeeId) => {
  try {
    const response = await employeeAPI.get(`/employee-info/${employeeId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Submit employeer info
export const submitEmployeerInfo = async (employeeId, data) => {
  try {
    const response = await employeeAPI.post(
      `/employee-info/${employeeId}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Save draft employeer info
export const saveDraftEmployeerInfo = async (employeeId, data) => {
  try {
    const response = await employeeAPI.put(
      `/employee-info/${employeeId}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Upload file to /docs
export const uploadFile = async (file, fileType) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileType", fileType);

    const response = await employeeAPI.post("/docs", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get document URL for download/preview
export const getDocumentUrl = async (docId) => {
  try {
    const response = await employeeAPI.get(`/docs/${docId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get all employees (for HR)
export const getAllEmployees = async (status) => {
  try {
    const params = status ? { status } : {};
    const response = await employeeAPI.get("/employees", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get registration tokens (for HR)
// Note: This endpoint is not in the backend spec but exists in the emailService utils
// Backend may implement this separately for token management
export const getRegistrationTokens = async () => {
  try {
    const response = await employeeAPI.get("/registration-tokens");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get registration token (for register page)
export const getRegistrationToken = async (token) => {
  try {
    const response = await employeeAPI.get(`/registration-tokens/${token}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Generate registration token (for HR)
// Note: This endpoint should use the tokenGenerator.js from utils
// Backend may implement this via emailService.js
export const generateRegistrationToken = async (email) => {
  try {
    const response = await employeeAPI.post("/registration-tokens", { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Approve employee application (for HR)
// Using decision endpoint to approve
export const approveEmployeeApplication = async (employeeId) => {
  try {
    // Frontend uses simpler API, backend may map to: POST /employees/:employeeId/stage/decision
    const response = await employeeAPI.post(
      `/employees/${employeeId}/stage/decision`,
      { decision: "approved" }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Reject employee application (for HR)
export const rejectEmployeeApplication = async (employeeId, feedback) => {
  try {
    // Frontend uses simpler API with feedback, backend may map to: POST /employees/:employeeId/stage/decision
    const response = await employeeAPI.post(
      `/employees/${employeeId}/stage/decision`,
      { decision: "rejected", feedback }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Link OPT to employee (for HR)
export const linkOptToEmployee = async (employeeId, optId) => {
  try {
    const response = await employeeAPI.post(
      `/employees/${employeeId}/optsLink`,
      { opt_id: optId }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Unlink OPT from employee (for HR)
export const unlinkOptFromEmployee = async (employeeId, optId) => {
  try {
    const response = await employeeAPI.post(
      `/employees/${employeeId}/optsUnlink`,
      { opt_id: optId }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Advance employee stage (for HR)
export const advanceEmployeeStage = async (employeeId) => {
  try {
    const response = await employeeAPI.post(
      `/employees/${employeeId}/stage/advance`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ============================================
// OPT Management APIs
// ============================================

// Create OPT record
export const createOpt = async (optData) => {
  try {
    const response = await employeeAPI.post("/opts", optData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get OPT records (with optional filters)
export const getOpts = async (filters = {}) => {
  try {
    const params = {};
    if (filters.employee_id) params.employee_id = filters.employee_id;
    if (filters.type) params.type = filters.type;
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;

    const response = await employeeAPI.get("/opts", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get single OPT record
export const getOpt = async (optId) => {
  try {
    const response = await employeeAPI.get(`/opts/${optId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete OPT record
export const deleteOpt = async (optId) => {
  try {
    const response = await employeeAPI.delete(`/opts/${optId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default authAPI;
