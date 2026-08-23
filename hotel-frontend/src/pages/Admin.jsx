import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { getImageUrl } from "../utils/imageUrl";
import "./Admin.css";

function Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [hotels, setHotels] = useState([]);

  const [totalHotels, setTotalHotels] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeSection, setActiveSection] =
    useState("dashboard");



  const fetchHotels = async (options = {}) => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      const currentSearch = options.clear ? "" : search;
      const currentMin = options.clear ? "" : minPrice;
      const currentMax = options.clear ? "" : maxPrice;

      if (currentSearch.trim()) {
        params.append(
          "search",
          currentSearch.trim()
        );
      }

      if (currentMin !== "") {
        params.append(
          "minPrice",
          currentMin
        );
      }

      if (currentMax !== "") {
        params.append(
          "maxPrice",
          currentMax
        );
      }

      const response = await api.get(
        `/hotels?${params.toString()}`
      );

      const data = response.data;

      const hotelList =
        data.hotels ||
        data.data ||
        [];

      setHotels(hotelList);

      setTotalHotels(
        data.total ??
          hotelList.length
      );
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load hotels."
      );

      setHotels([]);
    } finally {
      setLoading(false);
    }
  };



  const fetchUsers = async () => {
    try {
      const response =
        await api.get("/auth/users");

      const data = response.data;

      const users =
        data.users ||
        data.data ||
        [];

      setTotalUsers(
        data.total ??
          users.length
      );
    } catch (err) {
      console.error(
        "Failed to load users:",
        err
      );
    }
  };





  const handleSearch = (event) => {
    event.preventDefault();

    fetchHotels();
  };



  const clearFilters = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    fetchHotels({ clear: true });
  };



  const handleDelete = async (hotelId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this hotel?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/hotels/${hotelId}`
      );

      await fetchHotels();

      alert(
        "Hotel deleted successfully."
      );
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Failed to delete hotel."
      );
    }
  };



  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to log out?"
    );

    if (!confirmed) {
      return;
    }

    logout();
    navigate("/login");
  };



  const handleDashboardClick = () => {
    setActiveSection("dashboard");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };



  const handleHotelsClick = () => {
    setActiveSection("hotels");

    setTimeout(() => {
      document
        .getElementById("admin-hotels")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  return (
    <div className="admin-page">

      {}

      <header className="admin-navbar">

        <Link
          to="/admin"
          className="admin-brand"
        >
          HotelHub
        </Link>

        <div className="admin-navbar-right">

          <span className="admin-role">
            {user?.name ||
              user?.username ||
              "Admin"}
          </span>

          <button
            type="button"
            className="admin-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>

      <div className="admin-layout">

        <aside className="admin-sidebar">

          <nav className="admin-sidebar-nav">

            <button
              type="button"
              className={
                activeSection ===
                "dashboard"
                  ? "active"
                  : ""
              }
              onClick={
                handleDashboardClick
              }
            >
              Dashboard
            </button>

            <button
              type="button"
              className={
                activeSection ===
                "hotels"
                  ? "active"
                  : ""
              }
              onClick={
                handleHotelsClick
              }
            >
              Hotels
            </button>

          </nav>

        </aside>

        <main className="admin-main">

          <section
            id="admin-dashboard"
            className="admin-dashboard-section"
          >

            <div className="admin-page-heading">

              <h1>
                Dashboard
              </h1>

            </div>

            {/* STAT CARDS */}

            <div className="admin-stat-grid">

              <div className="admin-stat-card">

                <span>
                  Total Hotels
                </span>

                <strong>
                  {totalHotels}
                </strong>

              </div>

              <div className="admin-stat-card">

                <span>
                  Total Users
                </span>

                <strong>
                  {totalUsers}
                </strong>

              </div>

            </div>

          </section>

          <section
            id="admin-hotels"
            className="admin-hotels-section"
          >

            <div className="admin-section-heading">

              <h2>
                Hotels
              </h2>

            </div>

            <div className="admin-hotel-toolbar">

              <form
                className="admin-search-form"
                onSubmit={
                  handleSearch
                }
              >

                <label
                  htmlFor="admin-search"
                >
                  Search hotels
                </label>

                <input
                  id="admin-search"
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search hotels"
                />

                <button
                  type="submit"
                  className="admin-search-btn"
                >
                  Search
                </button>

              </form>

              <Link
                to="/admin/hotels/add"
                className="admin-add-btn"
              >
                Add Hotel
              </Link>

            </div>

            <div className="admin-price-filter">

              <div>

                <label>
                  Min Price
                </label>

                <input
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(event) =>
                    setMinPrice(
                      event.target.value
                    )
                  }
                  placeholder="Min"
                />

              </div>

              <div>

                <label>
                  Max Price
                </label>

                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(event) =>
                    setMaxPrice(
                      event.target.value
                    )
                  }
                  placeholder="Max"
                />

              </div>

              <button
                type="button"
                className="admin-apply-btn"
                onClick={fetchHotels}
              >
                Apply
              </button>

              <button
                type="button"
                className="admin-clear-btn"
                onClick={
                  clearFilters
                }
              >
                Clear
              </button>

            </div>

            <div className="admin-result-count">
              {totalHotels}{" "}
              {totalHotels === 1
                ? "hotel"
                : "hotels"}{" "}
              found
            </div>

            {error && (
              <div className="admin-error">
                {error}
              </div>
            )}

            <div className="admin-table-wrapper">

              {loading ? (

                <div className="admin-table-state">
                  Loading hotels...
                </div>

              ) : hotels.length ===
                0 ? (

                <div className="admin-table-state">
                  No hotels found.
                </div>

              ) : (

                <table className="admin-table">

                  <thead>

                    <tr>

                      <th>
                        Hotel
                      </th>

                      <th>
                        Price
                      </th>

                      <th>
                        Edit
                      </th>

                      <th>
                        Delete
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {hotels.map(
                      (hotel) => (

                        <tr
                          key={hotel.id}
                        >

                          <td className="hotel-cell">
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {hotel.image ? (
                                    <img
                                      src={getImageUrl(hotel.image)}
                                      alt={hotel.title}
                                      className="admin-hotel-image"
                                      onError={(event) => {
                                        event.currentTarget.style.display = "none";
                                      }}
                                    />
                                  ) : (
                                    <div
                                      className="admin-hotel-image placeholder"
                                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', fontSize: '10px', color: '#94a3b8', border: '1px dashed #cbd5e1' }}
                                    >
                                      No image
                                    </div>
                                  )}
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <strong className="hotel-name">{hotel.title}</strong>
                                  <span style={{ fontSize: '12px', color: '#64748b' }}>ID: {hotel.id}</span>
                                </div>
                              </div>
                            </td>

                          <td>
                            <span className="hotel-price">
                              ₹
                              {Number(
                                hotel.price ||
                                  0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          </td>

                          <td>

                            <Link
                              to={`/admin/hotels/edit/${hotel.id}`}
                              className="admin-edit-btn"
                            >
                              Edit
                            </Link>

                          </td>

                          <td>

                            <button
                              type="button"
                              className="admin-delete-btn"
                              onClick={() =>
                                handleDelete(
                                  hotel.id
                                )
                              }
                            >
                              Delete
                            </button>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              )}

            </div>

          </section>

        </main>

      </div>

    </div>
  );
}

export default Admin;

