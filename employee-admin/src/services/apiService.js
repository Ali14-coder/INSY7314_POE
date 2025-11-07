// import our singleton for axios
import axios from '../interfaces/axiosInstance.js'

// -------Transaction endpoints for employees --------
// GET all pending transactions from the API
export const getPendingTransactions = () => axios.get('/employee/getPendingTransactions');

// GET all verified transactions
export const getVerifiedTransactions = () => {
  const token = localStorage.getItem("authToken");
  return axios.get("/employee/getVerifiedTransactions", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// GET a specific transaction by Id
// services/apiService.js
export const getOneTransaction = (id) => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("No auth token found. Please log in.");

  return axios.get(`/employee/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true, // if your backend requires cookies for CSRF
  });
};


// PUT request, to update an existing transaction
export const updateStatus = (id, status, token) =>
  axios.put(`/employee/${id}`, { status }, {
    headers: { Authorization: `Bearer ${token}` },
  });

// POST to login an employee
export const login = async (data) => {
  console.log("📤 Sending login request:", data); 
  return axios.post("/auth/staffLogin", data);
};

// --------Employee endpoints for admins------------
// GET a specific employee by Id
export const getEmployee = (id) => axios.get(`/admin/${id}`);

// GET all employees
export const getEmployees = (id) => axios.get('/employee/getEmployees');

// PUT request, to update an existing employee
export const updateEmployee = (id, employeeData) => axios.put(`/admin/${id}`, employeeData);

// DELETE request, to delete an existing employee
export const deleteEmployee = (id, employeeData) => axios.put(`/admin/${id}`, employeeData);

// POST to create a user
export const createEmployee = (employeeData) => axios.post('/admin/createEmployee', employeeData);

// POST to login an admin
//export const login = (adminData) => axios.post('/auth/login', adminData);

// GET logout credentials
export const logout = (token) => {
  return axios.get("/auth/logout", {
    headers: { Authorization: `Bearer ${token}` },
  });
};