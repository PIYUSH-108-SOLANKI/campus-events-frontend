import { useEffect, useState } from "react";
import api from "../../api/axios";
import EventCard from "../../components/EventCard";

const OrganizerDashboard = () => {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
  });

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const res = await api.get("/events/my");
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to load events");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/events/create", form);
      setForm({
        title: "",
        description: "",
        location: "",
        date: "",
      });
      fetchMyEvents();
    } catch (err) {
      alert("Event creation failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Organizer Dashboard
        </h1>
        <p className="text-gray-600">
          Create and manage your campus events
        </p>
      </div>

      {/* CREATE EVENT */}
      <div className="bg-white p-6 rounded-lg shadow-md border mb-10">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Create New Event
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Title
              </label>
              <input
                name="title"
                placeholder="Enter event title"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                name="location"
                placeholder="Enter venue/location"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={form.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Date
            </label>
            <input
              type="date"
              name="date"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Enter event description"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="4"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all active:scale-95"
          >
            Create Event
          </button>
        </form>
      </div>

      {/* MY EVENTS */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          My Events
        </h2>
        <p className="text-gray-600 text-sm">
          Events you've created ({events.length})
        </p>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-xl text-gray-500 mb-2">No events created yet</p>
          <p className="text-gray-400">Create your first event using the form above!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              showDetails={false}
              status={
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    event.approved
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800 animate-pulse"
                  }`}
                >
                  {event.approved ? "✓ Approved" : "⏳ Pending Approval"}
                </span>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;
