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
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>

      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((n) => (
            <li
              key={n._id}
              className="p-4 bg-white shadow rounded"
            >
              <h3 className="font-semibold">{n.title}</h3>
              <p className="text-sm text-gray-600">{n.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
