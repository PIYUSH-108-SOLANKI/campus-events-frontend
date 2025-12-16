import { useEffect, useState } from "react";
import api from "../api/axios";
import socket from "../socket";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // fetch old notifications
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications");
        setNotifications(res.data);
      } catch (error) {
        console.error("Failed to load notifications");
      }
    };

    fetchNotifications();

    // listen for new notifications
    socket.on("new-notification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.off("new-notification");
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Notifications
          </h1>
          <p className="text-gray-600">
            Stay updated with the latest campus events and announcements
          </p>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-6xl mb-4">🔔</div>
            <p className="text-xl text-gray-500 mb-2">No notifications yet</p>
            <p className="text-gray-400">We'll notify you when something important happens!</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {notifications.map((n, index) => (
              <li
                key={n._id}
                className="p-5 bg-white shadow-sm hover:shadow-md border rounded-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xl">
                      {index === 0 && notifications.length > 1 ? "🆕" : "📢"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {n.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {n.message}
                    </p>
                    {n.createdAt && (
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(n.createdAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notifications;
