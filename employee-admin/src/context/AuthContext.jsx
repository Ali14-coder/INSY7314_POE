// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        username: payload.username,
        userType: payload.userType,
        employeeId: payload.employeeId || null,
        adminId: payload.adminId || null,
      };
    } catch {
      return null;
    }
  });

  const isAuthenticated = !!token;

  const login = (jwtToken) => {
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);
    try {
      const payload = JSON.parse(atob(jwtToken.split(".")[1]));
      setUser({
        username: payload.username,
        userType: payload.userType,
        employeeId: payload.employeeId || null,
        adminId: payload.adminId || null,
      });
    } catch {}
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
