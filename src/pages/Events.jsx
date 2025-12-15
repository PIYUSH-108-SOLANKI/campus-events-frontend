import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventsWithRSVPCount = async () => {
      try {
        // 1️⃣ Fetch all approved events
        const eventsRes = await api.get("/events");

        // 2️⃣ For each event, fetch RSVP count
        const eventsWithCounts = await Promise.all(
          eventsRes.data.map(async (event) => {
            try {
              const countRes = await api.get(
                `/rsvp/count/${event._id}`
              );

              return {
                ...event,
                attendeesCount: countRes.data.attendeesCount,
              };
            } catch (err) {
              // If count API fails, still show event
              return {
                ...event,
                attendeesCount: 0,
              };
            }
          })
        );

        setEvents(eventsWithCounts);
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventsWithRSVPCount();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg">
        Loading events...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Campus Events
      </h1>

      {events.length === 0 ? (
        <p className="text-center text-gray-500">
          No events available
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="border rounded-lg p-6 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold mb-1">
                {event.title}
              </h2>

              <p className="text-gray-600 mb-2">
                {event.description}
              </p>

              <p className="text-sm text-gray-500">
                📍 {event.location}
              </p>

              <p className="text-sm text-gray-500">
                📅{" "}
                {new Date(event.date).toDateString()}
              </p>

              <p className="text-sm font-medium mt-2">
                👥 Attending:{" "}
                {event.attendeesCount || 0}
              </p>

              <Link
                to={`/event/${event._id}`}
                className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
