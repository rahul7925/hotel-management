import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./AdminEditHotel.css";

function AdminEditHotel() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    latitude: "",
    longitude: "",
    price: "",
  });

  const [existingImage, setExistingImage] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await api.get(`/hotels/${id}`);
        const hotel = response.data.hotel;
        
        setFormData({
          title: hotel.title || "",
          description: hotel.description || "",
          latitude: hotel.latitude ?? "",
          longitude: hotel.longitude ?? "",
          price: hotel.price ?? "",
        });

        if (hotel.image) {
          const imgUrl = hotel.image.startsWith("http")
            ? hotel.image
            : `http://localhost:5000${hotel.image}`;
          setExistingImage(imgUrl);
        }
      } catch (err) {
        setError("Failed to load hotel details.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please select a JPG, PNG, or WebP image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    setNewImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      // 1. Update Hotel Details
      await api.put(`/hotels/${id}`, {
        title: formData.title,
        description: formData.description,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        price: Number(formData.price),
      });

      // 2. Upload New Image if selected
      if (newImage) {
        const imageData = new FormData();
        imageData.append("image", newImage);

        await api.post(`/hotels/${id}/upload`, imageData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      alert("Hotel updated successfully!");
      navigate("/admin");
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to update hotel."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-page">
        <div className="edit-loading">
          Loading hotel details...
        </div>
      </div>
    );
  }

  return (
    <div className="edit-page">
      <div className="edit-container">

        {/* Header */}
        <div className="edit-header">
          <div>
            <p className="edit-eyebrow">HOTEL MANAGEMENT</p>
            <h1>Edit Hotel</h1>
            <p className="edit-subtitle">
              Update the hotel information and photograph below.
            </p>
          </div>

          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/admin")}
          >
            Back to Admin
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="edit-error">
            {error}
          </div>
        )}

        {/* Form Card */}
        <form className="edit-card" onSubmit={handleSubmit}>

          <div className="form-section">
            <h2>Hotel Information</h2>
            <p className="section-description">
              Edit the basic information, location, pricing, and image.
            </p>

            {/* Hotel Image Upload */}
            <div className="form-group image-upload-group">
              <label htmlFor="hotel-image">Hotel Image</label>
              <input
                id="hotel-image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
              />

              {(imagePreview || existingImage) && (
                <div className="image-preview">
                  <img
                    src={imagePreview || existingImage}
                    alt="Hotel preview"
                  />
                </div>
              )}
            </div>

            {/* Title */}
            <div className="form-group">
              <label htmlFor="title">Hotel Name</label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter hotel name"
                required
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter hotel description"
                rows="5"
                required
              />
            </div>

            {/* Location */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="latitude">Latitude</label>
                <input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="13.0475"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="longitude">Longitude</label>
                <input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="80.2824"
                  required
                />
              </div>
            </div>

            {/* Price */}
            <div className="form-group">
              <label htmlFor="price">Price per Night (₹)</label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="5000"
                required
              />
            </div>

          </div>

          {/* Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/admin")}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-button"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AdminEditHotel;
