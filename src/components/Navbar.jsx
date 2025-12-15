import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import api from "../api/axios";

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    } else {
      setNotifCount(0);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      const unread = res.data.filter((n) => !n.isRead);
      setNotifCount(unread.length);
    } catch (err) {
      console.error("Failed to load notifications");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // 🔑 Prevent navbar flicker while auth is loading
  if (loading) {
    return (
      <nav className="bg-white shadow px-6 py-4">
        <span className="text-gray-500">Loading...</span>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      {/* LEFT */}
      <Link
        to="/"
        className="text-xl font-bold text-blue-600"
      >
        CampusEvents
      </Link>

      {/* RIGHT */}
      <div className="flex items-center gap-6">
        <Link to="/" className="hover:text-blue-600">
          Events
        </Link>

        {/* Notifications */}
        {user && (
          <Link
            to="/notifications"
            className="relative hover:text-blue-600"
          >
            🔔
            {notifCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 rounded-full">
                {notifCount}
              </span>
            )}
          </Link>
        )}

        {/* ADMIN */}
        {user?.role === "ADMIN" && (
          <Link
            to="/admin"
            className="font-medium hover:text-blue-600"
          >
            Admin
          </Link>
        )}

        {/* ORGANIZER */}
        {user?.role === "ORGANIZER" && (
          <Link
            to="/organizer"
            className="font-medium hover:text-blue-600"
          >
            Organizer
          </Link>
        )}

        {/* AUTH */}
        {!user ? (
          <>
            <Link to="/login" className="hover:text-blue-600">
              Login
            </Link>
            <Link to="/register" className="hover:text-blue-600">
              Register
            </Link>
          </>
        ) : (
          <>
            <span className="text-sm text-gray-600">
              {user.name} ({user.role})
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
