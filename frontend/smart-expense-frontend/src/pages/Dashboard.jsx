import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Dashboard() {
  const userId = Number(localStorage.getItem("userId"));

  const [expenses, setExpenses] = useState([]);

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    type: "EXPENSE",
    date: "",
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await api.get(`/expenses/user/${userId}`);
      setExpenses(response.data);
       console.log("BACKEND EXPENSES:", response.data);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addExpense = async (e) => {
    e.preventDefault();

    try {
      await api.post("/expenses", {
        title: form.title,
        amount: Number(form.amount),
        category: form.category,
        type: form.type,
        date: form.date
          ? form.date + ":00"
          : new Date().toISOString().slice(0, 19),
        user: {
          id: userId,
        },
      });

      setForm({
        title: "",
        amount: "",
        category: "",
        type: "EXPENSE",
        date: "",
      });

      fetchExpenses();
    } catch (error) {
      console.error("Failed to add transaction:", error);
      alert("Failed to add transaction");
    }
  };

  const deleteExpense = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch (error) {
      console.error("Failed to delete transaction:", error);
      alert("Failed to delete transaction");
    }
  };

  const totalIncome = expenses
    .filter((item) => item.type === "INCOME")
    .reduce((total, item) => total + item.amount, 0);

  const totalExpense = expenses
    .filter((item) => item.type === "EXPENSE")
    .reduce((total, item) => total + item.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
     <>
    <Navbar />
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Smart Expense Dashboard
            </h1>

            <p className="text-gray-500 mt-1">
              Manage your income and expenses
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/reports"
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Reports & Analytics
            </Link>

            <Link
              to="/groups"
              className="bg-gray-800 text-white px-5 py-2.5 rounded-lg hover:bg-gray-900 transition font-medium"
            >
              Groups
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">
              Total Income
            </p>

            <h2 className="text-2xl font-bold text-green-600 mt-2">
              ₹{totalIncome.toFixed(2)}
            </h2>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">
              Total Expense
            </p>

            <h2 className="text-2xl font-bold text-red-600 mt-2">
              ₹{totalExpense.toFixed(2)}
            </h2>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">
              Balance
            </p>

            <h2
              className={`text-2xl font-bold mt-2 ${
                balance >= 0 ? "text-blue-600" : "text-red-600"
              }`}
            >
              ₹{balance.toFixed(2)}
            </h2>
          </div>

        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">

          <h2 className="text-xl font-semibold text-gray-800 mb-5">
            Add Transaction
          </h2>

          <form onSubmit={addExpense} className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <input
              type="text"
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={form.amount}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              className="border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>

            <input
              type="datetime-local"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="bg-blue-600 text-white rounded-lg px-4 py-2.5 hover:bg-blue-700 transition font-medium"
            >
              Add Transaction
            </button>

          </form>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">

          <h2 className="text-xl font-semibold text-gray-800 mb-5">
            Transactions
          </h2>

          {expenses.length === 0 ? (
            <p className="text-gray-500">
              No transactions found.
            </p>
          ) : (
            <div className="space-y-3">

              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >

                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {expense.title}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {expense.category}
                    </p>

                    <p className="text-sm text-gray-500">
                      {expense.date
                        ? new Date(expense.date).toLocaleString()
                        : "No date"}
                    </p>
                  </div>

                  <div className="flex items-center gap-5">

                    <p
                      className={`font-bold ${
                        expense.type === "INCOME"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {expense.type === "INCOME" ? "+" : "-"}₹
                      {expense.amount}
                    </p>

                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className="bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition"
                    >
                      Delete
                    </button>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </div>
    </>
  );
}

export default Dashboard;