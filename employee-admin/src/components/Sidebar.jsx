// src/components/Sidebar.jsx
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  UserPlus,
  FolderOpen,
  ShieldCheck,
  History,
  Menu,
  X,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  // For now, we'll determine user type from the current path
  // Later you can integrate with your AuthContext
  const isAdmin = window.location.pathname.includes("admin");
  const userType = isAdmin ? "admin" : "employee";

  const handleLogout = () => {
    // Handle logout logic here
    navigate("/");
  };

  return (
    <nav className={`app-sidenav ${collapsed ? "collapsed" : ""}`}>
      <div className="app-logo">
        <img src="/coinnect.png" alt="Coinnect Logo" />
        {!collapsed && <span className="app-brand">Coinnect</span>}
      </div>

      <div className="app-links">
        {userType === "admin" ? (
          <>
            <NavLink
              to="/admin-dashboard"
              className={({ isActive }) =>
                isActive ? "app-link active" : "app-link"
              }
              end
            >
              <Home size={20} />
              {!collapsed && <span>Dashboard</span>}
            </NavLink>
            <NavLink
              to="/admin/employees"
              className={({ isActive }) =>
                isActive ? "app-link active" : "app-link"
              }
            >
              <Users size={20} />
              {!collapsed && <span>Employee Accounts</span>}
            </NavLink>
            <NavLink
              to="/admin/create-employee"
              className={({ isActive }) =>
                isActive ? "app-link active" : "app-link"
              }
            >
              <UserPlus size={20} />
              {!collapsed && <span>Create Employee</span>}
            </NavLink>
            {/* <NavLink
              to="/admin/payments"
              className={({ isActive }) =>
                isActive ? "app-link active" : "app-link"
              }
            >
              <FolderOpen size={20} />
              {!collapsed && <span>All Payments</span>}
            </NavLink> */}
          </>
        ) : (
          <>
            <NavLink
              to="/employee-dashboard"
              className={({ isActive }) =>
                isActive ? "app-link active" : "app-link"
              }
              end
            >
              <Home size={20} />
              {!collapsed && <span>Dashboard</span>}
            </NavLink>
            <NavLink
              to="/employee/pending-payments"
              className={({ isActive }) =>
                isActive ? "app-link active" : "app-link"
              }
            >
              <ShieldCheck size={20} />
              {!collapsed && <span>Pending Payments</span>}
            </NavLink>
            <NavLink
              to="/employee/payment-history"
              className={({ isActive }) =>
                isActive ? "app-link active" : "app-link"
              }
            >
              <History size={20} />
              {!collapsed && <span>Payment History</span>}
            </NavLink>
          </>
        )}
      </div>

      <button className="app-logout-btn" onClick={handleLogout}>
        <LogOut size={20} />
        {!collapsed && <span>Logout</span>}
      </button>

      <button
        className="app-collapse-btn"
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <Menu size={22} /> : <X size={22} />}
      </button>
    </nav>
  );
}
