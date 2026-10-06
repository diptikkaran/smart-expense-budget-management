import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Reports() {
  const [report, setReport] = useState(null);

  const userId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const response = await api.get(`/reports/user/${userId}`);
      setReport(response.data);
    } catch (error) {
      console.error("Failed to fetch report:", error);
    }
  };

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">
          Loading reports...
        </p>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">

      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Reports & Analytics
            </h1>

            <p className="text-gray-500 mt-1">
              Track your income, expenses and financial activity
            </p>
          </div>

          <Link to="/dashboard">
            <button className="px-5 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">
              ← Back to Dashboard
            </button>
          </Link>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500">
              Total Income
            </p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">
              ₹{report.totalIncome}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500">
              Total Expense
            </p>

            <h2 className="text-3xl font-bold text-red-600 mt-2">
              ₹{report.totalExpense}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500">
              Current Balance
            </p>

            <h2 className="text-3xl font-bold text-blue-600 mt-2">
              ₹{report.balance}
            </h2>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

            <h2 className="text-xl font-semibold text-gray-800 mb-5">
              Category-wise Expense
            </h2>

            {Object.entries(report.categoryWiseExpense).length === 0 ? (
              <p className="text-gray-500">
                No expense data available.
              </p>
            ) : (
              <div className="space-y-3">

                {Object.entries(report.categoryWiseExpense).map(
                  ([category, amount]) => (
                    <div
                      key={category}
                      className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3"
                    >
                      <span className="font-medium text-gray-700">
                        {category}
                      </span>

                      <span className="font-semibold text-red-600">
                        ₹{amount}
                      </span>
                    </div>
                  )
                )}

              </div>
            )}

          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

            <h2 className="text-xl font-semibold text-gray-800 mb-5">
              Monthly Expense
            </h2>

            {Object.entries(report.monthlyExpense).length === 0 ? (
              <p className="text-gray-500">
                No monthly expense data available.
              </p>
            ) : (
              <div className="space-y-3">

                {Object.entries(report.monthlyExpense).map(
                  ([month, amount]) => (
                    <div
                      key={month}
                      className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3"
                    >
                      <span className="font-medium text-gray-700">
                        {month}
                      </span>

                      <span className="font-semibold text-red-600">
                        ₹{amount}
                      </span>
                    </div>
                  )
                )}

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
    </>
  );
}

export default Reports;