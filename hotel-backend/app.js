const express = require("express");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.disable("x-powered-by");

app.use(helmet({
    crossOriginResourcePolicy: false
}));
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173"
}));
app.use(morgan("dev"));
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const hotelRoutes = require("./routes/hotelRoutes");
const authRoutes = require("./routes/authRoutes");
const setupSwagger = require("./config/swagger");

setupSwagger(app);

const authLimiter = require("./middleware/rateLimiter");
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/hotels", hotelRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});
const errorMiddleware = require("./middleware/errorMiddleware");
app.use(errorMiddleware);

module.exports = app;
