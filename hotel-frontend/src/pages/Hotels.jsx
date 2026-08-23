import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { getImageUrl } from "../utils/imageUrl";

const ITEMS_PER_PAGE = 5;

function Hotels() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  /* Double-lock back button and tab close protection */
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "Are you sure you want to leave?";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Push twice so that a single back button press keeps the URL identical.
    // This prevents React Router from detecting a path change and unmounting the component.
    window.history.pushState(null, null, window.location.href);
    window.history.pushState(null, null, window.location.href);

    const handlePopState = () => {
      const confirmed = window.confirm("Are you sure you want to close this site?\nLog out to close the site.");
      if (confirmed) {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        logout();
        navigate("/login", { replace: true });
      } else {
        // They cancelled. Push state again to restore the buffer.
        window.history.pushState(null, null, window.location.href);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [logout, navigate]);

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (!confirmed) return;
    logout();
    navigate("/login");
  };

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [location, setLocation] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalHotels, setTotalHotels] = useState(0);

  const [showFilters, setShowFilters] = useState(false);

  const fetchHotels = async (page = currentPage) => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      params.append("page", page);
      params.append("limit", ITEMS_PER_PAGE);

      if (minPrice !== "") {
        params.append("minPrice", minPrice);
      }

      if (maxPrice !== "") {
        params.append("maxPrice", maxPrice);
      }

      const response = await api.get(
        `/hotels?${params.toString()}`
      );

      const data = response.data;

      setHotels(data.hotels || data.data || []);
      setTotalHotels(data.total || 0);
      setTotalPages(data.totalPages || 1);
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

  useEffect(() => {
    if (!search.trim()) {
      fetchHotels(currentPage);
    }
  }, [currentPage, minPrice, maxPrice]);

  const handleSearch = async () => {
    const keyword = search.trim();

    setCurrentPage(1);

    if (!keyword) {
      fetchHotels(1);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/hotels/search?keyword=${encodeURIComponent(
          keyword
        )}`
      );

      const data = response.data;

      setHotels(data.hotels || data.data || []);
      setTotalHotels(
        data.total ??
          (data.hotels || data.data || []).length
      );
      setTotalPages(1);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to search hotels."
      );

      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredHotels = hotels.filter((hotel) => {
    if (!location.trim()) {
      return true;
    }

    const keyword = location
      .trim()
      .toLowerCase();

    const latitude = String(
      hotel.latitude ?? ""
    ).toLowerCase();

    const longitude = String(
      hotel.longitude ?? ""
    ).toLowerCase();

    return (
      latitude.includes(keyword) ||
      longitude.includes(keyword)
    );
  });

  const clearFilters = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setLocation("");
    setCurrentPage(1);

    setShowFilters(false);

    fetchHotels(1);
  };

  if (error) {
    return (
      <main className="hotels-page">
        <div className="hotels-error">
          <h1>Hotels</h1>
          <p>{error}</p>

          <button
            type="button"
            onClick={() => fetchHotels(1)}
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="hotels-page">

      <header className="hotels-navbar">
        <div className="hotels-navbar-inner">

          <Link
            to="/hotels"
            className="hotels-brand"
          >
            HotelHub
          </Link>

          <div className="hotels-navbar-right">

            <span className="hotels-user-name">
              {user?.name ||
                user?.username ||
                "User"}
            </span>

            <button
              type="button"
              className="hotels-logout"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        </div>
      </header>

      <main className="hotels-main">

        {/* Mobile filters button */}

        <button
          type="button"
          className="mobile-filter-button"
          onClick={() => setShowFilters(true)}
        >
          Filters
        </button>

        {/* Mobile backdrop */}

        {showFilters && (
          <div
            className="filter-backdrop"
            onClick={() =>
              setShowFilters(false)
            }
          />
        )}

        <aside
          className={`hotel-filters ${
            showFilters
              ? "hotel-filters-open"
              : ""
          }`}
        >

          <div className="filter-header">

            <h2>Filters</h2>

            <button
              type="button"
              className="filter-close"
              onClick={() =>
                setShowFilters(false)
              }
            >
              ×
            </button>

          </div>

          {/* Search */}

          <div className="filter-group">

            <label htmlFor="hotel-search">
              Search hotels
            </label>

            <input
              id="hotel-search"
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="Search by hotel name"
            />

            <button
              type="button"
              className="search-filter-button"
              onClick={handleSearch}
            >
              Search
            </button>

          </div>

          {/* Price */}

          <div className="filter-group">

            <label>Price range</label>

            <div className="price-inputs">

              <input
                type="number"
                min="0"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Min"
              />

              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Max"
              />

            </div>

          </div>

          {/* Location */}

          <div className="filter-group">

            <label htmlFor="hotel-location">
              Location
            </label>

            <input
              id="hotel-location"
              type="text"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Latitude / longitude"
            />

          </div>

          <button
            type="button"
            className="clear-filter-button"
            onClick={clearFilters}
          >
            Clear filters
          </button>

          <button
            type="button"
            className="mobile-apply-button"
            onClick={() =>
              setShowFilters(false)
            }
          >
            Apply filters
          </button>

        </aside>

        <section className="hotel-results">

          <div className="results-header">

            <p className="results-count">
              {location.trim()
                ? filteredHotels.length
                : totalHotels}{" "}
              {(
                location.trim()
                  ? filteredHotels.length
                  : totalHotels
              ) === 1
                ? "Hotel"
                : "Hotels"}{" "}
              found
            </p>

          </div>

          {loading ? (
            <div className="hotels-loading">
              <h2>Loading...</h2>
              <p>Fetching hotels from server.</p>
            </div>
          ) : filteredHotels.length === 0 ? (

            <div className="hotel-empty">

              <h2>No hotels found</h2>

              <p>
                Try changing your search or
                filters.
              </p>

              <button
                type="button"
                className="empty-clear-button"
                onClick={clearFilters}
              >
                Clear filters
              </button>

            </div>

          ) : (

            <div className="hotel-list">

              {filteredHotels.map((hotel) => (

                <article
                  className="hotel-list-card"
                  key={hotel.id}
                >

                  {/* Image */}

                  <div className="hotel-list-image">

                    {hotel.image ? (

                      <img
                        src={getImageUrl(
                          hotel.image
                        )}
                        alt={hotel.title}
                      />

                    ) : (

                      <span>
                        No Image
                      </span>

                    )}

                  </div>

                  {/* Content */}

                  <div className="hotel-list-content">

                    <div className="hotel-list-main">

                      <h2>
                        {hotel.title}
                      </h2>

                      <p className="hotel-location" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b' }}>
                          <img src="/location-pin.png" alt="location pin" style={{ width: '14px', height: '14px' }} />
                          <span>{hotel.latitude}, {hotel.longitude}</span>
                        </p>

                      <p className="hotel-description">
                        {hotel.description ||
                          "No description available."}
                      </p>

                    </div>

                    <div className="hotel-list-footer">

                      <div className="hotel-price">

                        <strong>
                          ₹
                          {Number(
                            hotel.price || 0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                        <span>
                          / 24 hrs
                        </span>

                      </div>

                      <Link
                        to={`/hotels/${hotel.id}`}
                        className="hotel-details-button"
                      >
                        View Details
                      </Link>

                    </div>

                  </div>

                </article>

              ))}

            </div>

          )}

          {!location.trim() &&
            totalPages > 1 && (

              <nav
                className="hotel-pagination"
                aria-label="Hotel pagination"
              >

                <button
                  type="button"
                  disabled={
                    currentPage === 1
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.max(
                          1,
                          page - 1
                        )
                    )
                  }
                >
                  Previous
                </button>

                <div className="pagination-pages">

                  {Array.from(
                    {
                      length: totalPages,
                    },
                    (_, index) =>
                      index + 1
                  ).map((page) => (

                    <button
                      type="button"
                      key={page}
                      className={
                        currentPage === page
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        setCurrentPage(page)
                      }
                    >
                      {page}
                    </button>

                  ))}

                </div>

                <button
                  type="button"
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.min(
                          totalPages,
                          page + 1
                        )
                    )
                  }
                >
                  Next
                </button>

              </nav>

            )}

        </section>

      </main>
    </div>
  );
}

export default Hotels;

