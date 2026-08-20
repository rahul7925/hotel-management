const express = require("express");

const router = express.Router();

const {
    createHotel,
    getAllHotels,
    getHotelById,
    updateHotel,
    deleteHotel,
    searchHotels,
    uploadHotelImage
} = require("../controllers/hotelController");

const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/authMiddleware");
const { hotelValidation } = require("../middleware/validation");

/**
 * @swagger
 * tags:
 *   name: Hotels
 *   description: Hotel management APIs
 */

/**
 * @swagger
 * /api/hotels:
 *   post:
 *     summary: Create a new hotel
 *     tags:
 *       - Hotels
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - latitude
 *               - longitude
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *                 example: Taj Hotel
 *               description:
 *                 type: string
 *                 example: Luxury hotel in Chennai
 *               latitude:
 *                 type: number
 *                 example: 13.0827
 *               longitude:
 *                 type: number
 *                 example: 80.2707
 *               price:
 *                 type: number
 *                 example: 4500
 *     responses:
 *       201:
 *         description: Hotel created successfully
 *       400:
 *         description: Invalid hotel data
 *       401:
 *         description: Unauthorized
 */
router.post("/", authMiddleware, adminOnly, hotelValidation, createHotel);

/**
 * @swagger
 * /api/hotels/{id}/upload:
 *   post:
 *     summary: Upload a hotel image
 *     tags: [Hotels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Hotel ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *     responses:
 *       200:
 *         description: Hotel image uploaded successfully
 *       400:
 *         description: No image provided
 *       404:
 *         description: Hotel not found
 */
// IMPORTANT: This must come before /:id so it's not treated as an ID
router.post("/:id/upload", authMiddleware, adminOnly, upload.single("image"), uploadHotelImage);

/**
 * @swagger
 * /api/hotels:
 *   get:
 *     summary: Get all hotels
 *     tags:
 *       - Hotels
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of hotels per page
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum hotel price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum hotel price
 *     responses:
 *       200:
 *         description: Hotels retrieved successfully
 */
router.get("/", getAllHotels);

/**
 * @swagger
 * /api/hotels/search:
 *   get:
 *     summary: Search hotels
 *     tags:
 *       - Hotels
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         example: taj
 *     responses:
 *       200:
 *         description: Search results
 */
// IMPORTANT:
// This must come BEFORE /:id
router.get("/search", searchHotels);

/**
 * @swagger
 * /api/hotels/{id}:
 *   get:
 *     summary: Get a single hotel
 *     tags:
 *       - Hotels
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Hotel ID
 *     responses:
 *       200:
 *         description: Hotel found
 *       404:
 *         description: Hotel not found
 */
router.get("/:id", getHotelById);

/**
 * @swagger
 * /api/hotels/{id}:
 *   put:
 *     summary: Update a hotel
 *     tags:
 *       - Hotels
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Hotel ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Taj Grand Hotel
 *               description:
 *                 type: string
 *                 example: Premium luxury hotel in Chennai
 *               latitude:
 *                 type: number
 *                 example: 13.0827
 *               longitude:
 *                 type: number
 *                 example: 80.2707
 *               price:
 *                 type: number
 *                 example: 5500
 *     responses:
 *       200:
 *         description: Hotel updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Hotel not found
 */
router.put("/:id", authMiddleware, adminOnly, hotelValidation, updateHotel);

/**
 * @swagger
 * /api/hotels/{id}:
 *   delete:
 *     summary: Delete a hotel
 *     tags:
 *       - Hotels
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Hotel ID
 *     responses:
 *       200:
 *         description: Hotel deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Hotel not found
 */
router.delete("/:id", authMiddleware, adminOnly, deleteHotel);

module.exports = router;