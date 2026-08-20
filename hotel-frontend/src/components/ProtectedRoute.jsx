import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({
  children,
  adminOnly = false,
  userOnly = false,
}) {

  const {
    isAuthenticated,
    user,
    loading,
  } = useAuth();

  if (loading) {
    return (
      <div className="auth-loading">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (
    adminOnly &&
    user?.role !== "admin"
  ) {
    return (
      <Navigate
        to="/access-denied"
        replace
      />
    );
  }

  if (
    userOnly &&
    user?.role !== "user"
  ) {
    return (
      <Navigate
        to="/access-denied"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;
