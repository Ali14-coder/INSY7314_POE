import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import { CheckCircle, XCircle } from "lucide-react";
import { initCsrf } from "../../interfaces/axiosInstance";
import { getOneTransaction, updateStatus } from "../../services/apiService";

export default function TransactionDetail() {
  const { id } = useParams(); // transaction ID from URL
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  // Fetch single transaction
  useEffect(() => {
    const fetchTransaction = async () => {
      setLoading(true);
      setError("");

      try {
        await initCsrf();
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("No auth token found. Please log in again.");

        const res = await getOneTransaction(id, token);
        setTransaction(res.data);
      } catch (err) {
        console.error("Failed to fetch transaction:", err);
        setError(
          err.response?.data?.message || err.message || "Could not load transaction."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id]);

  // Update status
  const handleUpdateStatus = async (status) => {
    if (!transaction) return;
    setUpdating(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");

      await updateStatus(transaction.transactionId, status, token); // send only ID + status
      setTransaction((prev) => ({ ...prev, status }));
      alert(`Transaction ${status} successfully!`);
    } catch (err) {
      console.error("Failed to update transaction:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to update transaction."
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "linear-gradient(135deg, #1a1a1a, #2a2a2a)", fontFamily: "Inter, sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "3rem 2rem", color: "#fff" }}>
        <button
          onClick={() => navigate("/employee/pending-payments")}
          className="mb-6 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg"
        >
          Back
        </button>

        {loading ? (
          <p>Loading transaction...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : !transaction ? (
          <p className="text-gray-400">Transaction not found.</p>
        ) : (
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Transaction Details</h2>
            <p><strong>Customer ID:</strong> {transaction.customerId}</p>
            <p><strong>Transaction ID:</strong> {transaction.transactionId}</p>
            <p><strong>Amount:</strong> R {transaction.amount}</p>
            <p><strong>Recipient Reference:</strong> {transaction.recipientReference}</p>
            <p><strong>Customer Reference:</strong> {transaction.customerReference}</p>
            <p><strong>SWIFT Code:</strong> {transaction.swiftCode}</p>
            <p><strong>Status:</strong> {transaction.status}</p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleUpdateStatus("approved")}
                disabled={updating}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                <CheckCircle size={18} />
                Approve
              </button>
              <button
                onClick={() => handleUpdateStatus("denied")}
                disabled={updating}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                <XCircle size={18} />
                Deny
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
