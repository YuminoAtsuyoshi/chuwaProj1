import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllEmployees, getEmployeerInfo } from "../../api/auth";
import "./HREmployeeListPage.css";
import HRNav from "../../components/HRNav";

const HREmployeeListPage = () => {
  const [employees, setEmployees] = useState([]);
  const [displayedEmployees, setDisplayedEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchMessage, setSearchMessage] = useState("");
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const testUser = localStorage.getItem("testUser");
      if (testUser) {
        try {
          const testUserData = JSON.parse(testUser);
          if (!testUserData.isHr) {
            navigate("/login");
            return;
          }
          const mockEmployees = [
            {
              id: "1",
              username: "john.doe",
              email: "john.doe@company.com",
              isHr: false,
              stage: "onboarding",
              status: "pending",
              employeeInfo: {
                firstName: "John",
                middleName: "Michael",
                lastName: "Doe",
                preferredName: "Johnny",
                ssn: "123-45-6789",
                visa: "F1 OPT",
                cellPhone: "555-123-4567",
              },
            },
            {
              id: "2",
              username: "jane.smith",
              email: "jane.smith@company.com",
              isHr: false,
              stage: "onboarding",
              status: "approved",
              employeeInfo: {
                firstName: "Jane",
                middleName: "Elizabeth",
                lastName: "Smith",
                preferredName: "Jane",
                ssn: "987-65-4321",
                visa: "Citizen",
                cellPhone: "555-987-6543",
              },
            },
            {
              id: "3",
              username: "bob.johnson",
              email: "bob.johnson@company.com",
              isHr: false,
              stage: "hiring",
              status: "approved",
              employeeInfo: {
                firstName: "Bob",
                middleName: "Robert",
                lastName: "Johnson",
                preferredName: "Bobby",
                ssn: "456-78-9012",
                visa: "Green Card",
                cellPhone: "555-456-7890",
              },
            },
          ];
          mockEmployees.sort((a, b) =>
            (a.employeeInfo?.lastName || "").localeCompare(
              b.employeeInfo?.lastName || ""
            )
          );
          setEmployees(mockEmployees);
          setDisplayedEmployees(mockEmployees);
          setLoading(false);
          return;
        } catch (_) {}
      }

      if (user && !user.isHr) {
        navigate("/login");
        return;
      }
      try {
        setLoading(true);
        const employeesData = await getAllEmployees();
        const nonHREmployees = employeesData.filter((emp) => !emp.isHr);
        const employeesWithInfo = await Promise.all(
          nonHREmployees.map(async (emp) => {
            try {
              const info = await getEmployeerInfo(emp._id);
              return { ...emp, employeeInfo: info };
            } catch {
              return emp;
            }
          })
        );
        employeesWithInfo.sort((a, b) =>
          (a.employeeInfo?.lastName || "").localeCompare(
            b.employeeInfo?.lastName || ""
          )
        );
        setEmployees(employeesWithInfo);
        setDisplayedEmployees(employeesWithInfo);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, navigate]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setDisplayedEmployees(employees);
      setSearchMessage("");
      return;
    }
    const searchLower = searchTerm.toLowerCase();
    const filtered = employees.filter((emp) => {
      const username = emp.username?.toLowerCase() || "";
      const email = emp.email?.toLowerCase() || "";
      const firstName = emp.employeeInfo?.firstName?.toLowerCase() || "";
      const lastName = emp.employeeInfo?.lastName?.toLowerCase() || "";
      const preferredName =
        emp.employeeInfo?.preferredName?.toLowerCase() || "";
      return (
        username.includes(searchLower) ||
        email.includes(searchLower) ||
        firstName.includes(searchLower) ||
        lastName.includes(searchLower) ||
        preferredName.includes(searchLower)
      );
    });
    setDisplayedEmployees(filtered);
    setSearchMessage(
      filtered.length === 0
        ? "No records found."
        : filtered.length === 1
        ? "One record found."
        : `${filtered.length} records found.`
    );
  }, [searchTerm, employees]);

  const handleProfileClick = (employeeId) => {
    window.open(`/hr/employee-profile/${employeeId}`, "_blank");
  };

  const getFullName = (emp) =>
    emp.personInfo
      ? [
          emp.personInfo.firstName,
          emp.personInfo.middleName,
          emp.personInfo.lastName,
        ]
          .filter(Boolean)
          .join(" ")
      : emp.username || "N/A";
  const getWorkAuthTitle = (emp) => {
    if (!emp.personInfo) return "N/A";
    const { isPrOrCitizen, prOrCitizenType, workAuthType } = emp.personInfo;
    return isPrOrCitizen === "yes"
      ? prOrCitizenType || "Citizen/Permanent Resident"
      : isPrOrCitizen === "no"
      ? workAuthType || "N/A"
      : "N/A";
  };

  if (loading)
    return (
      <div className="hr-profiles-container">
        <div className="loading">Loading...</div>
      </div>
    );

  return (
    <div className="hr-profiles-container">
      <HRNav active="profiles" />
      <div className="page-content">
        <div className="page-header">
          <h1>Employee Profiles</h1>
          <p>Total Employees: {displayedEmployees.length}</p>
        </div>

        <div className="search-section">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search by first name, last name, or preferred name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          {searchMessage && (
            <div
              className={`search-message ${
                searchMessage.includes("One") ? "single" : ""
              }`}
            >
              {searchMessage}
            </div>
          )}
        </div>

        <div className="table-container">
          <table className="employee-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>SSN</th>
                <th>Work Authorization</th>
                <th>Phone</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {displayedEmployees.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-data">
                    {searchTerm
                      ? "No employees found matching your search."
                      : "No employees found."}
                  </td>
                </tr>
              ) : (
                displayedEmployees.map((emp) => (
                  <tr key={emp._id}>
                    <td>
                      <button
                        onClick={() => handleProfileClick(emp._id)}
                        className="profile-link"
                      >
                        {getFullName(emp)}
                      </button>
                    </td>
                    <td>{emp.personInfo?.ssn || "N/A"}</td>
                    <td>{getWorkAuthTitle(emp)}</td>
                    <td>{emp.personInfo?.cellPhone || "N/A"}</td>
                    <td>{emp.email || "N/A"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HREmployeeListPage;
