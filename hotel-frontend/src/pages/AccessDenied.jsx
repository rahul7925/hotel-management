import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function AccessDenied() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSwitchAccount = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="login-page">
      <div className="login-card" style={{ textAlign: "center" }}>

        <div className="login-brand" style={{ justifyContent: "center" }}>
          <span>HOTEL COLLECTION</span>
        </div>

        <div className="login-heading" style={{ marginTop: "15px" }}>
          <span style={{ fontSize: "36px", fontWeight: "800", color: "#b42318", display: "block" }}>
            403
          </span>
          <h1 style={{ marginTop: "5px" }}>Access Denied</h1>
          <p style={{ marginTop: "10px", lineHeight: "1.6" }}>
            You are currently signed in as <strong>{user?.name || "a standard user"}</strong> (<code>{user?.role || "user"}</code>).
            This area requires <strong>Admin</strong> privileges.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "25px" }}>
          <Link
            to="/hotels"
            className="login-button"
            style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
          >
            Go to Hotels
          </Link>

          <button
            type="button"
            onClick={handleSwitchAccount}
            style={{
              padding: "11px 16px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              background: "#ffffff",
              color: "#374151",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background 0.2s ease"
            }}
          >
            Sign in with an Admin Account
          </button>
        </div>

      </div>
    </div>
  );
}

export default AccessDenied;
