// src/services/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://localhost:3000/v1",
  withCredentials: true, // important for cookies
  //headers: { "Content-Type": "application/json" },
});

export const initCsrf = async () => {
  try {
    const res = await axios.get("https://localhost:3000/csrf-token", {
      withCredentials: true,
    });
    axiosInstance.defaults.headers.common["X-CSRF-Token"] = res.data.csrfToken;
    console.log("CSRF token initialized:", res.data.csrfToken);
  } catch (err) {
    console.error("CSRF initialization failed:", err);
  }
};

export default axiosInstance;
