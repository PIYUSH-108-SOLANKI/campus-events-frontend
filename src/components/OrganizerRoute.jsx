import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OrganizerRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // 🔹 Wait until auth state is restored
  if (loading) {
    return (
      <div className="text-center mt-10">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "ORGANIZER") {
    return <Navigate to="/" />;
  }

  return children;
};

export default OrganizerRoute;
