export const getBackendBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  return apiUrl.replace(/\/api\/?$/, "");
};

export const getImageUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }
  const base = getBackendBaseUrl();
  const path = image.startsWith("/") ? image : `/${image}`;
  return `${base}${path}`;
};
