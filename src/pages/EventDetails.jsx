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

  // fetch event
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        setEvent(res.data);
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

      // refresh event count
      const res = await api.get(`/events/${id}`);
      setEvent(res.data);
    } catch (error) {
      alert(error.response?.data?.message || "RSVP failed");
    }
  };

  const handleCancelRSVP = async () => {
    try {
      await api.delete(`/rsvp/${id}`);
      setHasRSVP(false);

      const res = await api.get(`/events/${id}`);
      setEvent(res.data);
    } catch (error) {
      alert(error.response?.data?.message || "Cancel failed");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!event) return <p className="text-center mt-10">Event not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <p className="mb-4">{event.description}</p>

      <p>📍 {event.location}</p>
      <p>📅 {new Date(event.date).toDateString()}</p>

      <p className="mt-4 font-semibold">
        👥 Attending: {event.attendeesCount || 0}
      </p>

      {user?.role === "STUDENT" && (
        <div className="mt-6">
          {!hasRSVP ? (
            <button
              onClick={handleRSVP}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              RSVP
            </button>
          ) : (
            <button
              onClick={handleCancelRSVP}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Cancel RSVP
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EventDetails;
