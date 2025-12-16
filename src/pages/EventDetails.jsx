import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasRSVP, setHasRSVP] = useState(false);

  // fetch event with attendees count
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        
        // Fetch RSVP count for this event
        try {
          const countRes = await api.get(`/rsvp/count/${id}`);
          setEvent({
            ...res.data,
            attendeesCount: countRes.data.attendeesCount,
          });
        } catch (countErr) {
          // If count API fails, still show event with 0 count
          setEvent({
            ...res.data,
            attendeesCount: 0,
          });
        }
      } catch (error) {
        console.error("Failed to load event", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // check if user RSVP'd (student only)
  useEffect(() => {
    const checkRSVP = async () => {
      if (!token || user?.role !== "STUDENT") return;

      try {
        const res = await api.get(`/rsvp/status/${id}`);
        setHasRSVP(res.data.rsvped);
      } catch (error) {
        console.log("RSVP status check skipped");
      }
    };

    checkRSVP();
  }, [id, token, user]);

  const handleRSVP = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await api.post(`/rsvp/${id}`);
      setHasRSVP(true);

      // refresh event with updated count
      const res = await api.get(`/events/${id}`);
      const countRes = await api.get(`/rsvp/count/${id}`);
      setEvent({
        ...res.data,
        attendeesCount: countRes.data.attendeesCount,
      });
    } catch (error) {
      alert(error.response?.data?.message || "RSVP failed");
    }
  };

  const handleCancelRSVP = async () => {
    try {
      await api.delete(`/rsvp/${id}`);
      setHasRSVP(false);

      // refresh event with updated count
      const res = await api.get(`/events/${id}`);
      const countRes = await api.get(`/rsvp/count/${id}`);
      setEvent({
        ...res.data,
        attendeesCount: countRes.data.attendeesCount,
      });
    } catch (error) {
      alert(error.response?.data?.message || "Cancel failed");
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="text-center mt-10">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-lg text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-xl text-gray-500 mb-2">Event not found</p>
          <button
            onClick={() => navigate("/events")}
            className="mt-4 text-blue-600 hover:underline"
          >
            ← Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
      >
        ← Back
      </button>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md border p-8">
          {/* Event Header */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              {event.title}
            </h1>
            
            {event.approved !== undefined && (
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  event.approved
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {event.approved ? "✓ Approved" : "⏳ Pending Approval"}
              </span>
            )}
          </div>

          {/* Event Details */}
          <div className="space-y-4 mb-8">
            <div className="prose max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed">
                {event.description}
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t">
              <div className="flex items-center text-gray-700">
                <span className="text-2xl mr-3">📍</span>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Location</p>
                  <p className="text-base">{event.location}</p>
                </div>
              </div>

              <div className="flex items-center text-gray-700">
                <span className="text-2xl mr-3">📅</span>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Date & Time</p>
                  <p className="text-base">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center text-gray-700">
                <span className="text-2xl mr-3">👥</span>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Attendees</p>
                  <p className="text-base font-semibold text-blue-600">
                    {event.attendeesCount || 0} attending
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RSVP Buttons (Student Only) */}
          {user?.role === "STUDENT" && (
            <div className="pt-6 border-t">
              {!hasRSVP ? (
                <button
                  onClick={handleRSVP}
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <span className="text-xl">✓</span>
                  RSVP to this Event
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <p className="text-green-800 font-medium flex items-center justify-center gap-2">
                      <span className="text-xl">✓</span>
                      You're attending this event!
                    </p>
                  </div>
                  <button
                    onClick={handleCancelRSVP}
                    className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Cancel RSVP
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
