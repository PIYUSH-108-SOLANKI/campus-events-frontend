import { Link } from "react-router-dom";

const EventCard = ({
  event,
  showDetails = true,
  actions,
  status,
}) => {
  return (
    <div className="bg-white border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Top section */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {event.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {event.description}
          </p>

          <div className="space-y-1">
            <p className="text-sm text-gray-600 flex items-center">
              <span className="mr-2">📍</span>
              {event.location}
            </p>
            <p className="text-sm text-gray-600 flex items-center">
              <span className="mr-2">📅</span>
              {new Date(event.date).toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </p>
            <p className="text-sm font-medium text-gray-700 flex items-center mt-2">
              <span className="mr-2">👥</span>
              <span className="text-blue-600">{event.attendeesCount}</span>
              <span className="ml-1">Attending</span>
            </p>
          </div>
        </div>

        {status && (
          <div className="ml-3">
            {status}
          </div>
        )}
      </div>

      {/* Bottom actions */}
      {(showDetails || actions) && (
        <div className="mt-4 pt-4 border-t flex justify-between items-center">
          {showDetails && (
            <Link
              to={`/event/${event._id}`}
              className="text-blue-600 hover:text-blue-700 hover:underline text-sm font-medium transition-colors"
            >
              View Details →
            </Link>
          )}

          {actions && (
            <div className="flex gap-2">
              {actions}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventCard;
