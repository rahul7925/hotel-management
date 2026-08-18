import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AddHotel.css";

function AddHotel() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    latitude: "",
    longitude: "",
    price: "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Create Hotel
      const response = await api.post("/hotels", {
        title: formData.title,
        description: formData.description,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        price: Number(formData.price),
      });

      const createdHotel = response.data.hotel;

      // 2. Upload Image if selected
      if (image && createdHotel?.id) {
        const imageData = new FormData();
        imageData.append("image", image);

        await api.post(
          `/hotels/${createdHotel.id}/upload`,
          imageData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      alert("Hotel created successfully!");
      navigate("/admin");
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to create hotel."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-page">
      <div className="add-container">

        {/* Header */}
        <div className="add-header">
          <div>
            <p className="add-eyebrow">HOTEL MANAGEMENT</p>
            <h1>Add New Hotel</h1>
            <p className="add-subtitle">
              Enter hotel details and upload a cover photograph.
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
          <div className="add-error">
            {error}
          </div>
        )}

        {/* Form Card */}
        <form className="add-card" onSubmit={handleSubmit}>

          <div className="form-section">
            <h2>Hotel Information</h2>
            <p className="section-description">
              Fill in the basic information, location, pricing, and image.
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

              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Hotel preview" />
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
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-button"
              disabled={loading}
            >
              {loading ? "Creating Hotel..." : "Create Hotel"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default AddHotel;
