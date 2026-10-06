import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");

    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          {/* Logo */}
          <Link
            to="/dashboard"
            className="text-xl font-bold text-blue-600"
          >
            Smart Expense
          </Link>

          {/* Navigation */}
          <div className="flex flex-wrap items-center gap-2">

            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition"
            >
              Dashboard
            </Link>

            <Link
              to="/groups"
              className="px-4 py-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition"
            >
              Groups
            </Link>

            <Link
              to="/reports"
              className="px-4 py-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition"
            >
              Reports
            </Link>

            {/* User */}
            <div className="hidden md:block h-7 w-px bg-gray-300 mx-1"></div>

            <span className="text-sm text-gray-600 px-2">
              {user?.name || "User"}
            </span>

            <button
              onClick={handleLogout}
              className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition font-medium"
            >
              Logout
            </button>

          </div>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;