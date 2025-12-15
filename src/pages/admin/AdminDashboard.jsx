import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  const fetchPendingEvents = async () => {
    try {
      const res = await api.get("/events/pending"); // 👈 admin-only API

      const pendingEvents = res.data.filter(
        (event) => event.approved === false
      );

      setEvents(pendingEvents);
    } catch (err) {
      console.error("Failed to fetch pending events");
    } finally {
      setLoading(false);
    }
  };


  const approveEvent = async (id) => {
    try {
      await api.put(`/events/approve/${id}`);
      setEvents(events.filter((e) => e._id !== id));
    } catch (err) {
      alert("Approval failed");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10">
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Admin Dashboard
      </h1>

      {events.length === 0 ? (
        <p className="text-gray-500">
          No pending events 🎉
        </p>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event._id}
              className="border p-4 rounded flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold">
                  {event.title}
                </h2>
                <p className="text-sm text-gray-600">
                  {event.description}
                </p>
                <p className="text-sm text-gray-500">
                  📍 {event.location} | 📅{" "}
                  {new Date(event.date).toDateString()}
                </p>
              </div>

              <div className="flex gap-3">
                <Link
                  to={`/admin/attendees/${event._id}`}
                  className="text-blue-600"
                >
                  View Attendees
                </Link>

                <button
                  onClick={() => approveEvent(event._id)}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
