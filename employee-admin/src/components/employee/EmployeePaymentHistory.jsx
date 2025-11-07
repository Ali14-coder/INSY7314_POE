// src/components/employee/EmployeePaymentHistory.jsx
import { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import { CheckCircle, XCircle, Filter } from "lucide-react";
import axiosInstance, { initCsrf } from "../../interfaces/axiosInstance";

export default function EmployeePaymentHistory() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch verified transactions from backend
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError("");

      try {
        // Ensure CSRF token is initialized
        await initCsrf();

        // Get JWT from localStorage
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No auth token found. Please log in again.");

        // Fetch verified transactions with JWT
        const res = await axiosInstance.get("/employee/getVerifiedTransactions", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTransactions(res.data || []);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
        setError(
          err.response?.data?.message || err.message || "Could not load transactions. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === "all") return true;
    return tx.status === filter;
  });

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a1a1a, #2a2a2a)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <Sidebar />
      <div style={{ flex: 1, padding: "3rem 2rem", color: "#fff" }}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Payment History</h1>
          <div className="flex items-center gap-2">
            <Filter size={20} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="all">All Payments</option>
              <option value="approved">Approved</option>
              <option value="denied">Denied</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-white">Loading transactions...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredTransactions.length === 0 ? (
          <p className="text-gray-400">No transactions found.</p>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map((payment) => (
              <div
                key={payment.id || payment.transactionId}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{payment.customerId}</h3>
                    <p className="text-gray-400">Processed by: {payment.employeeId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      {payment.amount} {payment.currency}
                    </p>
                    <div
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
                        payment.status === "approved"
                          ? "bg-green-900 text-green-300"
                          : "bg-red-900 text-red-300"
                      }`}
                    >
                      {payment.status === "approved" ? (
                        <CheckCircle size={14} />
                      ) : (
                        <XCircle size={14} />
                      )}
                      {payment.status.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Submitted:</span>
                    <p>{new Date(payment.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Processed:</span>
                    <p>{new Date(payment.updatedAt).toLocaleString()}</p>
                  </div>
                  
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
