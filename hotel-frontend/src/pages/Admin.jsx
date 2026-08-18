import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import LogoutConfirmModal from "../components/LogoutConfirmModal";
import "./Admin.css";

function Admin() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [hotels, setHotels] = useState([]);
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    regularUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [hotelSearch, setHotelSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [appliedMinPrice, setAppliedMinPrice] = useState("");
  const [appliedMaxPrice, setAppliedMaxPrice] = useState("");

  const handleLogoutConfirm = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [hotelsRes, usersRes] = await Promise.allSettled([
        api.get("/hotels?limit=100"),
        api.get("/auth/users"),
      ]);

      if (hotelsRes.status === "fulfilled") {
        const data = hotelsRes.value.data;
        setHotels(data.hotels || data.data || []);
      } else {
        setError(hotelsRes.reason?.response?.data?.message || "Failed to load hotels");
      }

      if (usersRes.status === "fulfilled") {
        const uData = usersRes.value.data;
        setUserStats({
          totalUsers: uData.totalUsers || 0,
          totalAdmins: uData.totalAdmins || 0,
          regularUsers: uData.regularUsers || 0,
        });
      } else {
        setUserStats({
          totalUsers: "Error",
          totalAdmins: "-",
          regularUsers: "-",
        });
      }
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id, title) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?`
    );

    if (!confirmed) return;

    try {
      await api.delete(`/hotels/${id}`);

      // Remove deleted hotel immediately from UI
      setHotels((prevHotels) =>
        prevHotels.filter((hotel) => hotel.id !== id)
      );

      alert("Hotel deleted successfully!");
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Failed to delete hotel."
      );
    }
  };

  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      const title = String(hotel.title || "").toLowerCase();

      const searchMatch = title.includes(
        hotelSearch.trim().toLowerCase()
      );

      const price = Number(hotel.price || 0);

      const minMatch =
        appliedMinPrice === "" ||
        price >= Number(appliedMinPrice);

      const maxMatch =
        appliedMaxPrice === "" ||
        price <= Number(appliedMaxPrice);

      return searchMatch && minMatch && maxMatch;
    });
  }, [
    hotels,
    hotelSearch,
    appliedMinPrice,
    appliedMaxPrice,
  ]);

  const handleApplyFilters = () => {
    setAppliedMinPrice(minPrice);
    setAppliedMaxPrice(maxPrice);
  };

  const handleClearFilters = () => {
    setHotelSearch("");
    setMinPrice("");
    setMaxPrice("");
    setAppliedMinPrice("");
    setAppliedMaxPrice("");
  };

  return (
    <div className="admin-page">

      {/* Top Navbar */}
      <header className="admin-navbar">
        <div className="admin-brand">
          <span>HOTEL COLLECTION</span>
        </div>

        <div className="admin-user">
          <span className="admin-name">
            {user?.name || "Admin"}
          </span>
          <button className="admin-logout-btn" onClick={() => setShowLogoutModal(true)}>
            Logout
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="admin-layout">

        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar-title">Management</div>
          <nav className="admin-nav">
            <Link to="/admin" className="active">Dashboard</Link>
            <button
              type="button"
              className="sidebar-link"
              onClick={() => {
                document
                  .getElementById("admin-hotels")
                  ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
              }}
            >
              Hotels
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="admin-main">

          <div className="admin-header">
            <div>
              <h1>Good morning, Admin</h1>
              <p>Here's what's happening with your hotels.</p>
            </div>
            <button
              className="add-hotel-btn"
              onClick={() => navigate("/admin/add")}
            >
              + Add Hotel
            </button>
          </div>

          {/* Dynamic Stats Cards */}
          <div className="admin-stats">
            <div className="admin-stat-card">
              <div className="admin-stat-label">Total Hotels</div>
              <div className="admin-stat-value">{hotels.length}</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-label">Total Users</div>
              <div className="admin-stat-value">{userStats.totalUsers}</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-label">Admins</div>
              <div className="admin-stat-value">{userStats.totalAdmins}</div>
            </div>
          </div>

          {/* Hotel Table Section */}
          <section>
            <div className="admin-section-header">
              <h2 id="admin-hotels">Hotels</h2>
            </div>

            {/* Filter Toolbar */}
            <div className="admin-hotel-toolbar">
              <div className="admin-search-box">
                <label>Search Hotels</label>
                <input
                  type="text"
                  value={hotelSearch}
                  onChange={(e) => setHotelSearch(e.target.value)}
                  placeholder="Search by hotel name..."
                />
              </div>

              <div className="admin-price-filter">
                <div>
                  <label>Min Price</label>
                  <input
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="₹ Min"
                  />
                </div>
                <div>
                  <label>Max Price</label>
                  <input
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="₹ Max"
                  />
                </div>
                <button
                  type="button"
                  className="admin-apply-button"
                  onClick={handleApplyFilters}
                >
                  Apply
                </button>
                <button
                  type="button"
                  className="admin-clear-button"
                  onClick={handleClearFilters}
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="admin-result-count">
              Showing {filteredHotels.length} of {hotels.length} hotels
            </div>

            <div className="hotel-table-wrapper">
              {loading && (
                <p className="admin-table-message">Loading hotels...</p>
              )}

              {error && (
                <p className="admin-table-error">{error}</p>
              )}

              {!loading && !error && hotels.length === 0 && (
                <p className="admin-table-message">No hotels found.</p>
              )}

              {!loading && !error && hotels.length > 0 && (
                <table className="hotel-table">
                  <thead>
                    <tr>
                      <th>Hotel</th>
                      <th>Description</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHotels.map((hotel) => (
                      <tr key={hotel.id}>
                        <td>
                          <div className="hotel-table-name">{hotel.title}</div>
                          <div className="hotel-table-id">ID: {hotel.id}</div>
                        </td>
                        <td>
                          <div className="hotel-table-desc">
                            {hotel.description || "No description available."}
                          </div>
                        </td>
                        <td>
                          <span className="hotel-table-price">
                            &#8377;{Number(hotel.price).toLocaleString("en-IN")}
                          </span>
                        </td>
                        <td>
                          <div className="admin-actions">
                            <Link
                              to={`/admin/edit/${hotel.id}`}
                              className="admin-edit-btn"
                            >
                              Edit
                            </Link>
                            <button
                              className="admin-delete-btn"
                              onClick={() => handleDelete(hotel.id, hotel.title)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredHotels.length === 0 && (
                      <tr>
                        <td colSpan="4">
                          <p className="admin-table-message">No hotels match your filters.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </section>

        </main>
      </div>

      {showLogoutModal && (
        <LogoutConfirmModal
          onConfirm={handleLogoutConfirm}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </div>
  );
}

export default Admin;

