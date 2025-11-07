// frontend/interfaces/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://localhost:3000/v1",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // allow cookies (required for CSRF)
});

// Fetch CSRF token and attach to all requests
export const initCsrf = async () => {
  try {
    const res = await axios.get("https://localhost:3000/csrf-token", {
      withCredentials: true,
    });
    const token = res.data.csrfToken;
    axiosInstance.defaults.headers.common["X-CSRF-Token"] = token;
    console.log("CSRF token initialized");
  } catch (err) {
    console.error("Failed to initialize CSRF token:", err);
  }
};

export default axiosInstance;
