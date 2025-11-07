// src/components/employee/EmployeePendingPayments.jsx
import { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import axiosInstance, { initCsrf } from "../../interfaces/axiosInstance";
import { updateStatus } from "../../services/apiService";

export default function EmployeePendingPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchPendingTransactions = async () => {
      setLoading(true);
      setError("");
      try {
        await initCsrf();
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No auth token found. Please log in again.");

        const res = await axiosInstance.get("/employee/getPendingTransactions", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPayments(res.data || []);
      } catch (err) {
        console.error("Failed to fetch pending transactions:", err);
        setError(
          err.response?.data?.message || err.message || "Could not load pending transactions."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPendingTransactions();
  }, []);

  // Update status using Mongo _id
  const handleUpdateStatus = async (_id, status) => {
  if (!["approved", "denied"].includes(status)) {
    console.error("Invalid status:", status);
    return;
  }

  setUpdating(true);
  setError("");

  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No auth token found.");

    // Send status as body
    await updateStatus(_id, status, token);

    setPayments((prev) =>
      prev.map((p) => (p._id === _id ? { ...p, status } : p))
    );

    console.log(`Transaction ${_id} updated to ${status}`);
  } catch (err) {
    console.error("Failed to update status:", err);
    setError(
      err.response?.data?.message || err.message || "Failed to update transaction status."
    );
  } finally {
    setUpdating(false);
  }
};

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
          <h1 className="text-3xl font-bold">Pending Payments</h1>
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
            {payments.length} pending
          </span>
        </div>

        {loading ? (
          <p className="text-white">Loading pending transactions...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : payments.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Pending Payments</h3>
            <p className="text-gray-400">All payments have been processed.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment._id} // Use Mongo _id here too
                className="bg-gray-800 rounded-lg p-6 border border-gray-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{payment.customerId}</h3>
                    <p className="text-gray-400">Transaction Id: {payment.transactionId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-400">
                      {payment.amount} R
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-400">Recipient Reference:</span>
                    <p>{payment.recipientReference}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Customer Reference:</span>
                    <p>{payment.customerReference}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">SWIFT Code:</span>
                    <p>{payment.swiftCode}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Status:</span>
                    <p>{payment.status}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleUpdateStatus(payment._id, "approved")} // ✅ Use _id
                    disabled={updating}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <CheckCircle size={18} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(payment._id, "denied")} // ✅ Use _id
                    disabled={updating}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <XCircle size={18} />
                    Deny
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
