import { useEffect, useState } from "react";
import api from "../api/axios";
import EventCard from "../components/EventCard";
import bgImage from "../assets/image8.png";

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
      <div 
        className="min-h-screen bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="min-h-screen bg-black/40">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="text-center mt-10">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <p className="mt-4 text-lg text-white">Loading events...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay for readability */}
      <div className="min-h-screen bg-gradient-to-b from-black/50 via-black/40 to-black/50">
        <div className="max-w-6xl mx-auto px-4 py-6 animate-fadeIn">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white text-center mb-2 drop-shadow-lg">
              Campus Events
            </h1>
            <p className="text-center text-white/90 drop-shadow-md">
              Discover and join exciting events happening on campus
            </p>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-12 bg-white/95 rounded-lg">
              <div className="text-6xl mb-4">📅</div>
              <p className="text-xl text-gray-500 mb-2">No events available</p>
              <p className="text-gray-400">Check back later for upcoming events!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {events.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  showDetails={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
