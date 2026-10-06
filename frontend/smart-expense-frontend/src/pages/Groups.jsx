import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Groups() {
  const navigate = useNavigate();

  const userId = Number(localStorage.getItem("userId"));

  const [groups, setGroups] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/groups/user/${userId}`);

      setGroups(response.data);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
      setError("Failed to load groups.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createGroup = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!form.name.trim()) {
      setError("Group name is required.");
      return;
    }

    try {
      setCreating(true);

      await api.post("/groups", null, {
        params: {
          name: form.name,
          description: form.description,
          userId: userId,
        },
      });

      setForm({
        name: "",
        description: "",
      });

      setMessage("Group created successfully.");

      await fetchGroups();
    } catch (error) {
      console.error("Failed to create group:", error);

      setError(
        error.response?.data?.message ||
          "Failed to create group."
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Expense Groups
            </h1>

            <p className="text-gray-500 mt-1">
              Manage shared expenses with friends and groups
            </p>
          </div>

          <Link
            to="/dashboard"
            className="bg-gray-800 text-white px-5 py-2.5 rounded-lg hover:bg-gray-900 transition text-center"
          >
            ← Dashboard
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

        {/* Create Group */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">

          <h2 className="text-xl font-semibold text-gray-800 mb-5">
            Create New Group
          </h2>

          <form
            onSubmit={createGroup}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >

            <input
              type="text"
              name="name"
              placeholder="Group name"
              value={form.name}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={creating}
              className="bg-blue-600 text-white rounded-lg px-5 py-2.5 hover:bg-blue-700 transition font-medium disabled:opacity-60"
            >
              {creating ? "Creating..." : "+ Create Group"}
            </button>

          </form>

        </div>

        {/* Groups List */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">

          <div className="flex items-center justify-between mb-5">

            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                My Groups
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {groups.length} group{groups.length !== 1 ? "s" : ""}
              </p>
            </div>

          </div>

          {loading ? (
            <div className="text-center py-10">
              <p className="text-gray-500">
                Loading groups...
              </p>
            </div>
          ) : groups.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg">

              <p className="text-gray-500 mb-2">
                No groups created yet.
              </p>

              <p className="text-sm text-gray-400">
                Create a group to start managing shared expenses.
              </p>

            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

              {groups.map((group) => (
                <div
                  key={group.id}
                  className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition bg-gray-50"
                >

                  <div className="flex items-start justify-between gap-3 mb-4">

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {group.name}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        {group.description ||
                          "No description"}
                      </p>
                    </div>

                    <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
                      #{group.id}
                    </span>

                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-5">

                    <span>
                      {group.members?.length || 0} member
                      {group.members?.length !== 1 ? "s" : ""}
                    </span>

                    <span>
                      Created by{" "}
                      {group.createdBy?.name || "You"}
                    </span>

                  </div>

                  <button
                    onClick={() =>
                      navigate(`/groups/${group.id}`)
                    }
                    className="w-full bg-gray-800 text-white py-2.5 rounded-lg hover:bg-gray-900 transition font-medium"
                  >
                    Open Group →
                  </button>

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

export default Groups;