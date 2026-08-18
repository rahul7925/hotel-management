import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoutConfirmModal from "./LogoutConfirmModal";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutModal(false);
    navigate("/login", { replace: true });
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-container">

          {/* Brand */}
          <Link to="/hotels" className="navbar-brand">
            HotelHub
          </Link>

          {/* User section */}
          {isAuthenticated && (
            <div className="navbar-user-section">

              <span className="navbar-username">
                {user?.name || user?.username || "User"}
              </span>

              <button
                type="button"
                className="navbar-logout"
                onClick={() => setShowLogoutModal(true)}
              >
                Logout
              </button>

            </div>
          )}

        </div>
      </header>

      {/* Logout confirmation */}
      {showLogoutModal && (
        <LogoutConfirmModal
          onConfirm={handleLogoutConfirm}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </>
  );
}

export default Navbar;
