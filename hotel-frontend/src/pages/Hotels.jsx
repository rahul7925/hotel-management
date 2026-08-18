import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import "./Hotels.css";

function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalHotels, setTotalHotels] = useState(0);
  const LIMIT = 10;

  const loadHotels = async (
    currentPage = page,
    currentSearch = search,
    currentMin = minPrice,
    currentMax = maxPrice
  ) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.append("page", currentPage);
      params.append("limit", LIMIT);

      if (currentSearch.trim()) {
        params.append("keyword", currentSearch.trim());
      }
      if (currentMin) {
        params.append("minPrice", currentMin);
      }
      if (currentMax) {
        params.append("maxPrice", currentMax);
      }

      const response = await api.get(`/hotels?${params.toString()}`);
      const data = response.data;

      setHotels(data.hotels || []);
      setTotalPages(data.totalPages || 1);
      setTotalHotels(data.total || 0);
      setPage(data.page || currentPage);
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message || "Failed to load hotels."
      );
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  useEffect(() => {
    loadHotels(1, "", "", "");
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearching(true);
    setPage(1);
    loadHotels(1, search, minPrice, maxPrice);
  };

  const handlePriceFilter = () => {
    setPage(1);
    loadHotels(1, search, minPrice, maxPrice);
  };

  const clearFilters = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
    loadHotels(1, "", "", "");
  };

  return (
    <>
      <Navbar />

      <main className="hotels-page page">
        <div className="hotels-container">

          <header className="hotels-header">
            <span className="eyebrow">HOTEL COLLECTION</span>
            <h1>Hotels</h1>
            <p>Find your perfect stay. Discover comfortable stays and great locations.</p>
          </header>

          <section className="hotel-search-container">
            <form onSubmit={handleSearch} className="hotel-search">
              <input
                type="text"
                placeholder="Search hotels by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit">
                {searching ? "Searching..." : "Search"}
              </button>
            </form>

            <div className="price-filter">
              <label>
                Min Price
                <input
                  type="number"
                  min="0"
                  placeholder="₹ Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </label>

              <label>
                Max Price
                <input
                  type="number"
                  min="0"
                  placeholder="₹ Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </label>

              <button type="button" onClick={handlePriceFilter}>
                Apply
              </button>

              <button type="button" onClick={clearFilters}>
                Clear
              </button>
            </div>
          </section>

          {totalHotels > 0 && (
            <p className="hotels-result-count">
              Showing {hotels.length} of {totalHotels} hotels
            </p>
          )}

          {loading ? (
            <p style={{ color: "#6b7280", paddingTop: "40px" }}>Loading hotels...</p>
          ) : error ? (
            <div className="hotels-empty">
              <h3>Something went wrong</h3>
              <p>{error}</p>
            </div>
          ) : hotels.length === 0 ? (
            <div className="hotels-empty">
              <h3>No hotels found</h3>
              <p>There are no hotels matching your search or filter.</p>
            </div>
          ) : (
            <>
              <div className="hotels-grid">
                {hotels.map((hotel) => (
                  <article className="hotel-card" key={hotel.id}>

                    <div className="hotel-card-image">
                      {hotel.image ? (
                        <img
                          src={
                            hotel.image.startsWith("http")
                              ? hotel.image
                              : `http://localhost:5000${hotel.image}`
                          }
                          alt={hotel.title}
                        />
                      ) : (
                        <div className="hotel-image-placeholder">
                          <span className="image-placeholder">Hotel image</span>
                        </div>
                      )}
                    </div>

                    <div className="hotel-card-content">

                      <h2>{hotel.title}</h2>

                      <div className="hotel-location">
                        <img
                          src="/location-pin.png"
                          alt="Location"
                          className="location-pin"
                        />
                        <span>{hotel.latitude}, {hotel.longitude}</span>
                      </div>

                      <p className="hotel-description">
                        {hotel.description || "No description available."}
                      </p>

                      <div className="hotel-price">
                        <span className="hotel-price-label">Starting from</span>
                        <span className="hotel-price-value">
                          ₹{Number(hotel.price).toLocaleString("en-IN")}
                        </span>
                        <span className="hotel-price-unit">/ night</span>
                      </div>

                      <div className="hotel-card-footer">
                        <Link
                          to={`/hotels/${hotel.id}`}
                          className="view-hotel-btn"
                        >
                          View Details
                        </Link>
                      </div>

                    </div>

                  </article>
                ))}
              </div>

              {totalHotels > 0 && (
                <div className="pagination">
                  <p className="pagination-info">
                    Page {page} of {totalPages} &bull; {totalHotels} hotels
                  </p>

                  <div className="pagination-buttons">
                    <button
                      disabled={page === 1}
                      onClick={() => {
                        const p = page - 1;
                        setPage(p);
                        loadHotels(p, search, minPrice, maxPrice);
                      }}
                    >
                      &larr; Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        className={n === page ? "active" : ""}
                        onClick={() => {
                          setPage(n);
                          loadHotels(n, search, minPrice, maxPrice);
                        }}
                      >
                        {n}
                      </button>
                    ))}

                    <button
                      disabled={page === totalPages}
                      onClick={() => {
                        const p = page + 1;
                        setPage(p);
                        loadHotels(p, search, minPrice, maxPrice);
                      }}
                    >
                      Next &rarr;
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </main>
    </>
  );
}

export default Hotels;
