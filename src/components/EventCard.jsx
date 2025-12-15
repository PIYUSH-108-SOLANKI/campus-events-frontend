import { useNavigate } from "react-router-dom";

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow rounded p-4">
      <h3 className="text-xl font-bold">{event.title}</h3>

      <p className="text-gray-600 mt-1">
        {event.description}
      </p>

      <p className="mt-2 text-sm">📍 {event.location}</p>
      <p className="text-sm">
        📅 {new Date(event.date).toDateString()}
      </p>

      <p className="mt-2 font-semibold">
        👥 Attending: {event.attendeesCount || 0}
      </p>

      <button
       onClick={() => navigate(`/event/${event._id}`)}
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        View Details
      </button>
    </div>
  );
};

export default EventCard;
