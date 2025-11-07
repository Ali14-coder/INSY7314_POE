import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { staffLogin } from "../services/apiService";
import { initCsrf } from "../interfaces/axiosInstance";

const LoginPage = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("employee");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [csrfReady, setCsrfReady] = useState(false);

  // Initialize CSRF token once
  useEffect(() => {
    const fetchCsrf = async () => {
      try {
        await initCsrf(); // <-- initialize CSRF
        setCsrfReady(true);
      } catch {
        setError("Unable to initialize login. Refresh the page.");
      }
    };
    fetchCsrf();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!csrfReady) return;

    setLoading(true);
    setError("");

    try {
      const staffLogin = async (data) => {
  return api.post("/v1/auth/staffLogin", data, {
    headers: {
      "X-CSRF-Token": document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1],
    },
  });
};

      const { token } = res.data;

      localStorage.setItem("authToken", token);
      localStorage.setItem("userRole", selectedRole);

      navigate(selectedRole === "admin" ? "/admin-dashboard" : "/employee-dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed. Check username/password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 justify-center items-center p-4">
      <div className="bg-gray-800 shadow-2xl rounded-2xl p-10 max-w-md w-full">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Login</h1>

        <div className="flex justify-center mb-6 space-x-4">
          <button
            className={`px-5 py-2 rounded-lg font-medium ${selectedRole === "employee"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            onClick={() => setSelectedRole("employee")}
          >
            Employee
          </button>
          <button
            className={`px-5 py-2 rounded-lg font-medium ${selectedRole === "admin"
              ? "bg-purple-600 text-white shadow-lg"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            onClick={() => setSelectedRole("admin")}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
            required
          />

          {error && <div className="bg-red-600 text-white text-center py-2 rounded-md">{error}</div>}

          <button
            type="submit"
            disabled={loading || !csrfReady}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg"
          >
            {loading ? "Logging in..." : `Login as ${selectedRole}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
