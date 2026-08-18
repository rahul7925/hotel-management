import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import api from "../services/api";
import Navbar from "../components/Navbar";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

function HotelDetails() {
  const { id } = useParams();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await api.get(`/hotels/${id}`);

        const data = response.data;

        setHotel(data.hotel || data.data);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
          "Failed to load hotel details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="hotel-details-page">
          <div className="hotel-loading">
            Loading hotel...
          </div>
        </main>
      </>
    );
  }

  if (error || !hotel) {
    return (
      <>
        <Navbar />
        <main className="hotel-details-page">
          <div className="hotel-not-found">
            <h1>Hotel Not Found</h1>
            <p>{error || "The requested hotel does not exist."}</p>

            <Link to="/hotels" className="back-link">
              &larr; Back to Hotels
            </Link>
          </div>
        </main>
      </>
    );
  }

  const latitude = Number(hotel.latitude);
  const longitude = Number(hotel.longitude);

  const googleMapsUrl =
    `https://www.google.com/maps?q=${latitude},${longitude}`;

  return (
    <>
      <Navbar />

      <main className="hotel-details-page">

        <Link to="/hotels" className="back-link">
          &larr; Back to Hotels
        </Link>

        {/* Hero image */}
        <section className="hotel-detail-hero">

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
            <div className="hotel-detail-placeholder">
              <span className="image-placeholder">Hotel image</span>
            </div>
          )}

        </section>

        {/* Hotel information */}
        <section className="hotel-detail-info">

          <div className="hotel-detail-heading">

            <div>
              <p className="eyebrow">
                HOTEL DETAILS
              </p>

              <h1>{hotel.title}</h1>

              <p className="hotel-location-text">
                <img
                  src="/location-pin.png"
                  alt="Location"
                  className="location-pin"
                />
                <span>{latitude}, {longitude}</span>
              </p>
            </div>

            <div className="hotel-detail-price">
              <span>From</span>

              <strong>
                ₹{Number(hotel.price).toLocaleString("en-IN")}
              </strong>

              <small>/ night</small>
            </div>

          </div>

          <div className="hotel-detail-description">

            <h2>About this hotel</h2>

            <p>
              {hotel.description ||
                "No description available for this hotel."}
            </p>

          </div>

        </section>

        {/* Location */}
        <section className="hotel-location-section">

          <div className="location-header">

            <p className="eyebrow">
              LOCATION
            </p>

            <h2>Hotel Location</h2>

            <p className="hotel-location-text">
              <img
                src="/location-pin.png"
                alt="Location"
                className="location-pin"
              />
              <span>{latitude}, {longitude}</span>
            </p>

          </div>

          {Number.isFinite(latitude) &&
            Number.isFinite(longitude) ? (
            <MapContainer
              center={[latitude, longitude]}
              zoom={15}
              scrollWheelZoom={true}
              className="hotel-map"
            >

              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker
                position={[latitude, longitude]}
              >
                <Popup>
                  <strong>{hotel.title}</strong>
                  <br />
                  ₹{Number(hotel.price).toLocaleString("en-IN")}/ night
                </Popup>
              </Marker>

            </MapContainer>
          ) : (
            <div className="map-error">
              Location coordinates are unavailable.
            </div>
          )}

          <div className="location-footer">

            <span>
              {latitude}, {longitude}
            </span>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="maps-button"
            >
              Open in Google Maps &nearr;
            </a>

          </div>

        </section>

        {/* Hotel metadata */}
        <section className="hotel-meta">

          <div>
            <span>Hotel ID</span>
            <strong>#{hotel.id}</strong>
          </div>

          <div>
            <span>Latitude</span>
            <strong>{latitude}</strong>
          </div>

          <div>
            <span>Longitude</span>
            <strong>{longitude}</strong>
          </div>

        </section>

      </main>
    </>
  );
}

export default HotelDetails;
