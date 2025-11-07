// src/components/admin/CreateEmployee.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import { UserPlus, ArrowLeft } from "lucide-react";
import axiosInstance from "../../interfaces/axiosInstance";

export default function CreateEmployee() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "employee",
  });
  const [csrfToken, setCsrfToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const departments = [
    "Payment Processing",
    "Payment Verification",
    "Customer Support",
    "IT & Infrastructure",
    "Finance & Accounting",
    "Human Resources",
    "Management",
  ];

  // Extract CSRF token from cookies
  useEffect(() => {
    const getCsrfTokenFromCookie = () => {
      const match = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'));
      if (match) return decodeURIComponent(match[2]);
      return "";
    };
    setCsrfToken(getCsrfTokenFromCookie());
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("No auth token found. Please log in again.");
        setLoading(false);
        return;
      }

      // Send request with JWT and CSRF token
      await axiosInstance.post(
        "/admin/createEmployee",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-CSRF-Token": csrfToken,
          },
          withCredentials: true, // ensure cookies are sent
        }
      );

      // Navigate back to employee management on success
      navigate("/admin/employees");
    } catch (err) {
      console.error("Failed to create employee:", err);
      setError(
        err.response?.data?.message || "Could not create employee. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "linear-gradient(135deg, #1a1a1a, #2a2a2a)", fontFamily: "Inter, sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "2rem", color: "#fff" }}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={headerContent}>
            <div style={titleSection}>
              <button onClick={() => navigate("/admin/employees")} style={backButton}>
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 style={{ fontSize: "2rem", fontWeight: "bold", margin: 0 }}>Create Employee</h1>
                <p style={{ color: "#bbb", margin: 0 }}>Add a new employee to the system</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div style={formContainer}>
          {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}
          <form onSubmit={handleSubmit} style={formStyle}>
            <div style={formGrid}>
              <div style={formGroup}>
                <label style={labelStyle}>Username *</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} required style={inputStyle} placeholder="Enter username" />
              </div>

              <div style={formGroup}>
                <label style={labelStyle}>Employee password *</label>
                <input type="text" name="password" value={formData.password} onChange={handleChange} required style={inputStyle} placeholder="Enter employee password" />
              </div>

            </div>

            <div style={formActions}>
              <button type="button" onClick={() => navigate("/admin/employees")} style={secondaryButton}>Cancel</button>
              <button type="submit" style={primaryButton} disabled={loading}>
                <UserPlus size={20} style={{ marginRight: "0.5rem" }} />
                {loading ? "Creating..." : "Create Employee"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ======== Styles (same as before) ========
const headerStyle = { background: "#2a2a2a", borderRadius: "0.75rem", padding: "1.5rem", marginBottom: "1.5rem" };
const headerContent = { display: "flex", justifyContent: "space-between", alignItems: "center" };
const titleSection = { display: "flex", alignItems: "center", gap: "1rem" };
const backButton = { background: "transparent", border: "none", color: "white", cursor: "pointer", padding: "0.5rem", borderRadius: "0.375rem", display: "flex", alignItems: "center", justifyContent: "center" };
const formContainer = { background: "#2a2a2a", borderRadius: "0.75rem", padding: "2rem" };
const formStyle = { display: "flex", flexDirection: "column", gap: "2rem" };
const formGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" };
const formGroup = { display: "flex", flexDirection: "column", gap: "0.5rem" };
const labelStyle = { fontWeight: "500", color: "#e5e7eb", fontSize: "0.875rem" };
const inputStyle = { background: "#374151", border: "1px solid #4b5563", borderRadius: "0.5rem", padding: "0.75rem 1rem", color: "white", fontSize: "1rem", outline: "none", transition: "border-color 0.2s" };
const formActions = { display: "flex", justifyContent: "flex-end", gap: "1rem", paddingTop: "1rem", borderTop: "1px solid #374151" };
const primaryButton = { display: "flex", alignItems: "center", background: "#3b82f6", color: "white", border: "none", borderRadius: "0.5rem", padding: "0.75rem 1.5rem", fontSize: "1rem", fontWeight: "500", cursor: "pointer", transition: "background-color 0.2s" };
const secondaryButton = { background: "transparent", color: "#9ca3af", border: "1px solid #4b5563", borderRadius: "0.5rem", padding: "0.75rem 1.5rem", fontSize: "1rem", fontWeight: "500", cursor: "pointer", transition: "all 0.2s" };
