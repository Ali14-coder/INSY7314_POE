// import our singleton for axios
import axios from '../interfaces/axiosInstance.js'

// -------Transaction endpoints for employees --------
// GET all pending transactions from the API
export const getPendingTransactions = () => axios.get('/employee/getPendingTransactions');

// GET all pending transactions
export const getVerifiedTransactions = (id) => axios.get('/employee/getVerifiedTransactions');

// GET a specific transaction by Id
export const getOneTransaction = (id) => axios.get(`/employee/${id}`);

// PUT request, to update an existing transaction
export const updateStatus = (id, transactionData) => axios.put(`/employee/${id}`, transactionData);

// POST to login an employee
export const login = async (data) => {
  console.log("📤 Sending login request:", data); 
  return axios.post("/auth/login", data);
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