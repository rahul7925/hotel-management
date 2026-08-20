import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
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
        setLoading(true);
        setError("");

        const response = await api.get(`/hotels/${id}`);
        const data = response.data;

        setHotel(data.hotel || data.data);
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message ||
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
          <div className="hotel-details-state">
            <h1>Loading hotel...</h1>
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
          <div className="hotel-details-state">
            <h1>Hotel Not Found</h1>

            <p>
              {error ||
                "The requested hotel does not exist."}
            </p>

            <Link
              to="/hotels"
              className="hotel-back-link"
            >
              Back to Hotels
            </Link>
          </div>
        </main>
      </>
    );
  }

  const latitude = Number(hotel.latitude);
  const longitude = Number(hotel.longitude);

  const hasLocation =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);

  const googleMapsUrl = hasLocation
    ? `https://www.google.com/maps?q=${latitude},${longitude}`
    : "#";

  const imageUrl = hotel.image
    ? hotel.image.startsWith("http")
      ? hotel.image
      : `http://localhost:5000${hotel.image}`
    : "";

  return (
    <>
      <Navbar />

      <main className="hotel-details-page">

        <div className="hotel-details-container">

          {/* Back */}
          <Link
            to="/hotels"
            className="hotel-back-link"
          >
            Back to Hotels
          </Link>

          {/* Main hotel image */}
          <section className="hotel-detail-image-section">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={hotel.title}
                className="hotel-detail-image"
              />
            ) : (
              <div className="hotel-detail-no-image">
                No hotel image available
              </div>
            )}
          </section>

          {/* Hotel information */}
          <section className="hotel-detail-information">

            <div className="hotel-detail-top">

              <div className="hotel-detail-title">

                <p className="hotel-detail-label">
                  HOTEL DETAILS
                </p>

                <h1>{hotel.title}</h1>

              </div>

              <div className="hotel-detail-price">

                <strong>
                  ₹
                  {Number(
                    hotel.price || 0
                  ).toLocaleString("en-IN")}
                </strong>

                <span>/ 24 hrs</span>

              </div>

            </div>

            {/* Location */}
            <div className="hotel-detail-section">

              <h2>Location</h2>

              <p className="hotel-coordinate">
                {hasLocation
                  ? `${latitude}, ${longitude}`
                  : "Location coordinates unavailable"}
              </p>

            </div>

            {/* Description */}
            <div className="hotel-detail-section">

              <h2>About this hotel</h2>

              <p className="hotel-detail-description">
                {hotel.description ||
                  "No description available for this hotel."}
              </p>

            </div>

          </section>

          {/* Map */}
          <section className="hotel-detail-location">

            <div className="hotel-section-heading">

              <p className="hotel-detail-label">
                LOCATION
              </p>

              <h2>Hotel Location</h2>

              {hasLocation && (
                <p className="hotel-coordinate">
                  {latitude}, {longitude}
                </p>
              )}

            </div>

            {hasLocation ? (
              <MapContainer
                center={[latitude, longitude]}
                zoom={15}
                scrollWheelZoom={true}
                className="hotel-detail-map"
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker
                  position={[latitude, longitude]}
                >
                  <Popup>
                    <strong>{hotel.title}</strong>
                    <br />
                    ₹
                    {Number(
                      hotel.price || 0
                    ).toLocaleString("en-IN")}
                    / 24 hrs
                  </Popup>
                </Marker>
              </MapContainer>
            ) : (
              <div className="hotel-map-error">
                Location coordinates are unavailable.
              </div>
            )}

            <div className="hotel-map-footer">

              <span>
                {hasLocation
                  ? `${latitude}, ${longitude}`
                  : "Location unavailable"}
              </span>

              {hasLocation && (
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hotel-google-maps"
                >
                  Open in Google Maps
                </a>
              )}

            </div>

          </section>

          {/* Metadata */}
          <section className="hotel-detail-meta">

            <div>
              <span>Hotel ID</span>
              <strong>#{hotel.id}</strong>
            </div>

            <div>
              <span>Latitude</span>
              <strong>
                {hasLocation ? latitude : "-"}
              </strong>
            </div>

            <div>
              <span>Longitude</span>
              <strong>
                {hasLocation ? longitude : "-"}
              </strong>
            </div>

          </section>

        </div>

      </main>
    </>
  );
}

export default HotelDetails;
