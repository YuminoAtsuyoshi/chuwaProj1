import { useEffect, useState, useCallback } from "react";
import { getEmployeeDetails, getEmployeerInfo } from "../../../api/auth";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export const useHRReview = () => {
  const { employeeId } = useParams();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchData = useCallback(async () => {
    // 权限：HR
    const testUser = localStorage.getItem("testUser");
    const isHR = testUser ? JSON.parse(testUser).isHr : user?.isHr;
    if (!isHR) {
      navigate("/login");
      return;
    }

    // 本地 mock
    if (testUser) {
      try {
        const mockEmployee = {
          id: employeeId || "1",
          username: "john.doe",
          email: "john.doe@company.com",
          isHr: false,
          stage: "onboarding",
          status: "pending",
        };
        const mockEmployeerInfo = {
          first_name: "John",
          middle_name: "Michael",
          last_name: "Doe",
          preferred_name: "Johnny",
          address_building: "Apt 2B",
          address_street: "123 Main St",
          address_city: "New York",
          address_state: "NY",
          address_zip: "10001",
          cell_phone: "555-123-4567",
          work_phone: "555-987-6543",
          email: "john.doe@company.com",
          ssn: "123-45-6789",
          date_of_birth: "1990-01-15",
          gender: "male",
          is_pr_or_citizen: "no",
          work_auth_type: "F1(CPT/OPT)",
          profile_picture_ref: "doc-123",
          driver_license_ref: "doc-456",
          opt_receipt_upload_ref: "doc-789",
          reference: {
            first_name: "John",
            last_name: "Smith",
            email: "ref@example.com",
            phone: "555-111-2222",
            relationship: "Manager",
          },
          emergency_contacts: [
            {
              first_name: "Jane",
              last_name: "Doe",
              phone: "555-333-4444",
              email: "emergency@example.com",
              relationship: "Spouse",
            },
          ],
        };
        setEmployee(mockEmployee);
        setEmployeeInfo(mockEmployeerInfo);
        setLoading(false);
        return;
      } catch (_) {}
    }

    try {
      setLoading(true);
      const employeeData = await getEmployeeDetails(employeeId);
      setEmployee(employeeData);
      try {
        const employeerData = await getEmployeerInfo(employeeId);
        setEmployeeInfo(employeerData);
      } catch (_) {
        // ignore if not found
      }
    } catch (e) {
      setMessage("Failed to load application");
    } finally {
      setLoading(false);
    }
  }, [employeeId, navigate, user?.isHr]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const isPending = employee?.status === "pending";
  const isRejected = employee?.status === "rejected";
  const isApproved = employee?.status === "approved";

  return {
    employee,
    employeeInfo,
    loading,
    message,
    setMessage,
    isPending,
    isRejected,
    isApproved,
  };
};
