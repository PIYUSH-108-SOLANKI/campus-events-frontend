import { useEffect, useState } from "react";
import api from "../../api/axios";

import EventCard from "../../components/EventCard";

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
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="text-center mt-10">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-lg text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Review and approve pending event submissions
        </p>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <p className="text-xl text-gray-500 mb-2">No pending events</p>
          <p className="text-gray-400">All events have been reviewed!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              showDetails={false}
              status={
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 animate-pulse">
                  Pending Review
                </span>
              }
              actions={
                <>

                  <button
                    onClick={() => approveEvent(event._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-all active:scale-95"
                  >
                    ✓ Approve
                  </button>
                </>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
