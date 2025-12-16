import { useState, useEffect } from "react";
import api from "../api/axios";

const FeedbackSection = ({ eventId, hasRSVP }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));
    const isStudent = user?.role === "STUDENT";

    useEffect(() => {
        fetchFeedback();
    }, [eventId]);

    const fetchFeedback = async () => {
        try {
            // Need to authorize as organizer/admin to see ALL feedback usually, 
            // but let's see if the backend allows public viewing or if we need to handle permissions.
            // Based on route: GET /:eventId -> authorizeRoles("ORGANIZER", "ADMIN")
            // Wait, if students can't see feedback, we shouldn't fetch it for them?
            // Re-reading route: 
            // router.get("/:eventId", protect, authorizeRoles("ORGANIZER", "ADMIN"), getEventFeedback);
            // This means ONLY organizers/admins can see the list.
            // Students can only POST.

            if (user?.role === "ORGANIZER" || user?.role === "ADMIN") {
                const res = await api.get(`/feedback/${eventId}`);
                setFeedbacks(res.data.feedbacks);
            }
        } catch (err) {
            console.error("Failed to fetch feedback", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            await api.post(`/feedback/${eventId}`, {
                rating,
                comment,
            });
            setComment("");
            setRating(5);
            alert("Feedback submitted successfully!");
            // If student, they can't see the list anyway, so no need to refetch
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit feedback");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading && (user?.role === "ORGANIZER" || user?.role === "ADMIN")) {
        return <div className="py-4 text-center">Loading feedback...</div>;
    }

    return (
        <div className="mt-8 pt-8 border-t">
            <h2 className="text-2xl font-bold mb-6">Event Feedback</h2>

            {/* Student Feedback Form */}
            {isStudent && hasRSVP && (
                <div className="bg-gray-50 p-6 rounded-lg mb-8 border">
                    <h3 className="text-lg font-semibold mb-4">Leave your feedback</h3>
                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rating
                            </label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className={`text-2xl focus:outline-none transition-colors ${star <= rating ? "text-yellow-400" : "text-gray-300"
                                            }`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Comment
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                rows="3"
                                placeholder="Share your experience..."
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                        >
                            {submitting ? "Submitting..." : "Submit Feedback"}
                        </button>
                    </form>
                </div>
            )}

            {/* Feedback List (Organizer/Admin only) */}
            {(user?.role === "ORGANIZER" || user?.role === "ADMIN") && (
                <div className="space-y-4">
                    {feedbacks.length === 0 ? (
                        <p className="text-gray-500 italic">No feedback received yet.</p>
                    ) : (
                        feedbacks.map((item) => (
                            <div key={item._id} className="bg-white border rounded-lg p-4 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-900">
                                            {item.user?.name || "Anonymous"}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            • {new Date(item.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i}>
                                                {i < item.rating ? "★" : "☆"}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-700">{item.comment}</p>
                            </div>
                        ))
                    )}
                </div>
            )}

            {isStudent && !hasRSVP && (
                <p className="text-gray-500 text-center italic">
                    Join the event to verify your attendance and leave feedback!
                </p>
            )}
        </div>
    );
};

export default FeedbackSection;
