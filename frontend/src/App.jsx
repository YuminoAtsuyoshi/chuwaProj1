import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import LoginPage from "./pages/Auth/LoginPage";
import RegistrationPage from "./pages/Auth/RegistrationPage";
import EmployeeDashboard from "./pages/Employee/EmployeeDashboard";
import EmployeeOnboarding from "./pages/Employee/EmployeeOnboarding";
import OnboardingApplicationPage from "./pages/Employee/OnboardingApplicationPage";
import EmployeeHomePage from "./pages/Employee/EmployeeHomePage";
import PersonalInformationPage from "./pages/Employee/PersonalInformationPage";
import HRDashboardPage from "./pages/HR/HRDashboardPage";
import HREmployeeListPage from "./pages/HR/HREmployeeListPage";
import HREmployeeDetailPage from "./pages/HR/HREmployeeDetailPage";
import HRHiringManagementPage from "./pages/HR/HRHiringManagementPage";
import HROnboardingReviewPage from "./pages/HR/HROnboardingReviewPage";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route
              path="/employee/dashboard"
              element={
                <ProtectedRoute>
                  <EmployeeHomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/onboarding"
              element={
                <ProtectedRoute>
                  <OnboardingApplicationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/personal-info"
              element={
                <ProtectedRoute>
                  <PersonalInformationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/dashboard"
              element={
                <ProtectedRoute>
                  <HRDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/employee-profiles"
              element={
                <ProtectedRoute>
                  <HREmployeeListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/hiring-management"
              element={
                <ProtectedRoute>
                  <HRHiringManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/employee-profile/:employeeId"
              element={
                <ProtectedRoute>
                  <HREmployeeDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/review-onboarding/:employeeId"
              element={
                <ProtectedRoute>
                  <HROnboardingReviewPage />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
