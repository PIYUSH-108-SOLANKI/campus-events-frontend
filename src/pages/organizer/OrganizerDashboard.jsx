import { useEffect, useState } from "react";
import api from "../../api/axios";

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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Organizer Dashboard
      </h1>

      {/* CREATE EVENT */}
      <div className="bg-white p-6 rounded shadow mb-10">
        <h2 className="text-xl font-semibold mb-4">
          Create New Event
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            name="title"
            placeholder="Event Title"
            className="border p-2"
            value={form.title}
            onChange={handleChange}
            required
          />
          <input
            name="location"
            placeholder="Location"
            className="border p-2"
            value={form.location}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="date"
            className="border p-2"
            value={form.date}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            className="border p-2 md:col-span-2"
            value={form.description}
            onChange={handleChange}
            required
          />

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded md:col-span-2 hover:bg-blue-700"
          >
            Create Event
          </button>
        </form>
      </div>

      {/* MY EVENTS */}
      <h2 className="text-xl font-semibold mb-4">
        My Events
      </h2>

      {events.length === 0 ? (
        <p className="text-gray-500">
          No events created yet
        </p>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event._id}
              className="border p-4 rounded flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {event.location} |{" "}
                  {new Date(event.date).toDateString()}
                </p>
              </div>

              <span
                className={`text-sm font-medium ${
                  event.approved
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {event.approved
                  ? "Approved"
                  : "Pending Approval"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;
