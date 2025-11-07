// src/App.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import LoginPage from "./components/LoginPage";
import EmployeeDashboard from "./components/employee/EmployeeDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import EmployeePendingPayments from "./components/employee/EmployeePendingPayments";
import EmployeePaymentHistory from "./components/employee/EmployeePaymentHistory";
import AdminEmployeeManagement from "./components/admin/AdminEmployeeManagement";
import CreateEmployee from "./components/admin/CreateEmployee";
import AdminPayments from "./components/admin/AdminPayments";
import "./components/Sidebar.css";
import './index.css';

function App() {
  const location = useLocation();

  // Hide navbar on dashboard pages
  const hideNavbar =
    location.pathname.includes("dashboard") ||
    location.pathname.includes("admin/") ||
    location.pathname.includes("employee/");

  return (
    <div className="min-h-screen w-full bg-white text-black">
      {!hideNavbar && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Employee Routes */}
          <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
          <Route
            path="/employee/pending-payments"
            element={<EmployeePendingPayments />}
          />
          <Route
            path="/employee/payment-history"
            element={<EmployeePaymentHistory />}
          />

          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route
            path="/admin/employees"
            element={<AdminEmployeeManagement />}
          />
          <Route path="/admin/create-employee" element={<CreateEmployee />} />
          <Route path="/admin/payments" element={<AdminPayments />} />

          {/* Additional Admin Routes for future implementation */}
          <Route
            path="/admin/edit-employee/:id"
            element={<div>Edit Employee Form (to be implemented)</div>}
          />
          <Route
            path="/admin/system-analytics"
            element={<div>System Analytics (to be implemented)</div>}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
