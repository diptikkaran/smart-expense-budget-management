import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function GroupDetails() {
  const { groupId } = useParams();

  const [group, setGroup] = useState(null);
  const [userId, setUserId] = useState("");

  const [expenseForm, setExpenseForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
  });

  const [selectedMembers, setSelectedMembers] = useState([]);
  const [groupExpenses, setGroupExpenses] = useState([]);
  const [balances, setBalances] = useState([]);

  const [settlementForm, setSettlementForm] = useState({
    payerId: "",
    receiverId: "",
    amount: "",
  });

  const [settlements, setSettlements] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadGroupData();
  }, [groupId]);

  const loadGroupData = async () => {
    setLoading(true);
    setError("");

    try {
      await Promise.all([
        fetchGroup(),
        fetchGroupExpenses(),
        fetchBalances(),
        fetchSettlements(),
      ]);
    } catch (err) {
      console.error(err);
      setError("Failed to load group data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchGroup = async () => {
    const response = await api.get(`/groups/${groupId}`);
    setGroup(response.data);
  };

  const fetchGroupExpenses = async () => {
    try {
      const response = await api.get("/expenses");

      const filteredExpenses = response.data.filter(
        (expense) => expense.group?.id === Number(groupId)
      );

      setGroupExpenses(filteredExpenses);
    } catch (error) {
      console.error("Failed to fetch group expenses:", error);
    }
  };

  const fetchBalances = async () => {
    try {
      const response = await api.get(
        `/splits/group/${groupId}/balances`
      );

      setBalances(response.data);
    } catch (error) {
      console.error("Failed to fetch balances:", error);
    }
  };

  const fetchSettlements = async () => {
    try {
      const response = await api.get(
        `/settlements/group/${groupId}`
      );

      setSettlements(response.data);
    } catch (error) {
      console.error("Failed to fetch settlements:", error);
    }
  };

  const handleExpenseChange = (e) => {
    setExpenseForm({
      ...expenseForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSettlementChange = (e) => {
    setSettlementForm({
      ...settlementForm,
      [e.target.name]: e.target.value,
    });
  };

  const toggleMember = (memberId) => {
    setSelectedMembers((previous) =>
      previous.includes(memberId)
        ? previous.filter((id) => id !== memberId)
        : [...previous, memberId]
    );
  };

  const addMember = async (e) => {
    e.preventDefault();

    if (!userId) {
      setError("Please enter a user ID.");
      return;
    }

    try {
      setError("");
      setMessage("");

      await api.post(`/groups/${groupId}/members/${userId}`);

      setUserId("");
      await fetchGroup();

      setMessage("Member added successfully.");
    } catch (error) {
      console.error("Failed to add member:", error);
      setError(
        error.response?.data?.message ||
          "Failed to add member. Please check the user ID."
      );
    }
  };

  const createGroupExpense = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (selectedMembers.length === 0) {
      setError("Please select at least one member for the split.");
      return;
    }

    if (Number(expenseForm.amount) <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    try {
      const expenseResponse = await api.post(
        `/expenses/group/${groupId}`,
        {
          title: expenseForm.title,
          amount: Number(expenseForm.amount),
          category: expenseForm.category,
          type: "EXPENSE",
          date: expenseForm.date
            ? `${expenseForm.date}T00:00:00`
            : new Date().toISOString().slice(0, 19),
          user: {
            id: Number(localStorage.getItem("userId")),
          },
        }
      );

      const expenseId = expenseResponse.data.id;

      await api.post(
        `/splits/expense/${expenseId}`,
        selectedMembers
      );

      setExpenseForm({
        title: "",
        amount: "",
        category: "",
        date: "",
      });

      setSelectedMembers([]);

      await fetchGroupExpenses();
      await fetchBalances();

      setMessage("Group expense added and split successfully.");
    } catch (error) {
      console.error("Failed to create group expense:", error);
      setError("Failed to add group expense.");
    }
  };

  const createSettlement = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (
      !settlementForm.payerId ||
      !settlementForm.receiverId ||
      !settlementForm.amount
    ) {
      setError("Please fill all settlement details.");
      return;
    }

    if (settlementForm.payerId === settlementForm.receiverId) {
      setError("Payer and receiver cannot be the same.");
      return;
    }

    if (Number(settlementForm.amount) <= 0) {
      setError("Settlement amount must be greater than 0.");
      return;
    }

    try {
      await api.post("/settlements", null, {
        params: {
          groupId: groupId,
          payerId: settlementForm.payerId,
          receiverId: settlementForm.receiverId,
          amount: Number(settlementForm.amount),
        },
      });

      setSettlementForm({
        payerId: "",
        receiverId: "",
        amount: "",
      });

      await fetchBalances();
      await fetchSettlements();

      setMessage("Settlement recorded successfully.");
    } catch (error) {
      console.error("Failed to create settlement:", error);
      setError("Failed to record settlement.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-lg">
          Loading group...
        </p>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            Group not found.
          </p>

          <Link
            to="/groups"
            className="bg-gray-800 text-white px-5 py-2.5 rounded-lg"
          >
            Back to Groups
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {group.name}
            </h1>

            <p className="text-gray-500 mt-1">
              {group.description || "No description available"}
            </p>
          </div>

          <Link
            to="/groups"
            className="bg-gray-800 text-white px-5 py-2.5 rounded-lg hover:bg-gray-900 transition text-center"
          >
            ← Back to Groups
          </Link>
        </div>

        {/* Messages */}
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Group Members */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">

          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Group Members
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {group.members?.length || 0} member(s)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {group.members?.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-4"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {member.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    {member.email}
                  </p>
                </div>

                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                  ID: {member.id}
                </span>
              </div>
            ))}
          </div>

          {/* Add Member */}
          <form
            onSubmit={addMember}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="number"
              placeholder="Enter registered User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              + Add Member
            </button>
          </form>

        </div>

        {/* Add Group Expense */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">

          <h2 className="text-xl font-semibold text-gray-800 mb-5">
            Add Group Expense
          </h2>

          <form
            onSubmit={createGroupExpense}
            className="space-y-5"
          >

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <input
                type="text"
                name="title"
                placeholder="Expense title"
                value={expenseForm.title}
                onChange={handleExpenseChange}
                required
                className="border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={expenseForm.amount}
                onChange={handleExpenseChange}
                min="1"
                step="0.01"
                required
                className="border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                name="category"
                placeholder="Category"
                value={expenseForm.category}
                onChange={handleExpenseChange}
                required
                className="border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="date"
                name="date"
                value={expenseForm.date}
                onChange={handleExpenseChange}
                className="border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* Split Members */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">
                  Split Expense Between
                </h3>

                <span className="text-sm text-gray-500">
                  {selectedMembers.length} selected
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {group.members?.map((member) => (
                  <label
                    key={member.id}
                    className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition ${
                      selectedMembers.includes(member.id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member.id)}
                      onChange={() => toggleMember(member.id)}
                      className="w-4 h-4"
                    />

                    <div>
                      <p className="font-medium text-gray-800">
                        {member.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {member.email}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Add Expense & Split
            </button>

          </form>
        </div>

        {/* Group Expenses */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">

          <h2 className="text-xl font-semibold text-gray-800 mb-5">
            Group Expenses
          </h2>

          {groupExpenses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No group expenses yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {groupExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-gray-200 rounded-lg p-4"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {expense.title}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {expense.category}
                    </p>

                    <p className="text-sm text-gray-400 mt-1">
                      Paid by: {expense.user?.name || "Unknown"}
                    </p>

                    <p className="text-sm text-gray-400">
                      {expense.date
                        ? new Date(expense.date).toLocaleString()
                        : "No date"}
                    </p>
                  </div>

                  <p className="text-xl font-bold text-red-600">
                    ₹{Number(expense.amount).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Group Balance */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">

          <h2 className="text-xl font-semibold text-gray-800 mb-5">
            Group Balance
          </h2>

          {balances.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No balance data available.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {balances.map((balance) => (
                <div
                  key={balance.userId}
                  className="border border-gray-200 rounded-lg p-5"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {balance.userName}
                      </h3>

                      <p className="text-sm text-gray-500">
                        User ID: {balance.userId}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        balance.balance >= 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {balance.balance >= 0 ? "Gets" : "Owes"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-500">
                        Paid
                      </p>
                      <p className="font-semibold text-gray-800 mt-1">
                        ₹{Number(balance.totalPaid).toFixed(2)}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-500">
                        Owed
                      </p>
                      <p className="font-semibold text-gray-800 mt-1">
                        ₹{Number(balance.totalOwed).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p
                      className={`text-lg font-bold ${
                        balance.balance >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {balance.balance >= 0
                        ? `Gets ₹${Number(balance.balance).toFixed(2)}`
                        : `Owes ₹${Math.abs(balance.balance).toFixed(2)}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Settlement */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">

          <h2 className="text-xl font-semibold text-gray-800 mb-5">
            Record Settlement
          </h2>

          <form
            onSubmit={createSettlement}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >

            <select
              name="payerId"
              value={settlementForm.payerId}
              onChange={handleSettlementChange}
              required
              className="border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">
                Select Payer
              </option>

              {group.members?.map((member) => (
                <option
                  key={member.id}
                  value={member.id}
                >
                  {member.name}
                </option>
              ))}
            </select>

            <select
              name="receiverId"
              value={settlementForm.receiverId}
              onChange={handleSettlementChange}
              required
              className="border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">
                Select Receiver
              </option>

              {group.members?.map((member) => (
                <option
                  key={member.id}
                  value={member.id}
                >
                  {member.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="amount"
              placeholder="Settlement Amount"
              value={settlementForm.amount}
              onChange={handleSettlementChange}
              min="1"
              step="0.01"
              required
              className="border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-500"
            />

            <button
              type="submit"
              className="md:col-span-3 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium"
            >
              Record Settlement
            </button>

          </form>
        </div>

        {/* Settlement History */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

          <h2 className="text-xl font-semibold text-gray-800 mb-5">
            Settlement History
          </h2>

          {settlements.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No settlements recorded yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {settlements.map((settlement) => (
                <div
                  key={settlement.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-gray-200 rounded-lg p-4"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {settlement.payer?.name} →{" "}
                      {settlement.receiver?.name}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {settlement.date
                        ? new Date(
                            settlement.date
                          ).toLocaleString()
                        : "No date"}
                    </p>
                  </div>

                  <p className="text-lg font-bold text-green-600">
                    ₹{Number(settlement.amount).toFixed(2)}
                  </p>
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

export default GroupDetails;