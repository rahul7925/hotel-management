const pool = require("../config/db");

const createHotel = async (req, res) => {
    try {
        const { title, description, latitude, longitude, price } = req.body;
        const result = await pool.query(
            `INSERT INTO hotels (title, description, latitude, longitude, price)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [title, description, latitude, longitude, price]
        );
        res.status(201).json({ success: true, hotel: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllHotels = async (req, res) => {
    try {
        let { page = 1, limit = 10, minPrice, maxPrice, keyword } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        if (page < 1) page = 1;
        if (limit < 1) limit = 10;
        if (limit > 100) limit = 100;

        const offset = (page - 1) * limit;

        const countValues = [];
        const countConditions = [];

        if (keyword && keyword.trim() !== "") {
            const searchKeyword = `%${keyword.trim()}%`;
            countValues.push(searchKeyword);
            countConditions.push(`(title ILIKE $${countValues.length} OR description ILIKE $${countValues.length})`);
        }

        if (minPrice !== undefined && minPrice !== "") {
            countValues.push(Number(minPrice));
            countConditions.push(`price >= $${countValues.length}`);
        }

        if (maxPrice !== undefined && maxPrice !== "") {
            countValues.push(Number(maxPrice));
            countConditions.push(`price <= $${countValues.length}`);
        }

        const countWhere = countConditions.length > 0
                ? `WHERE ${countConditions.join(" AND ")}`
                : "";

        const countResult = await pool.query(
            `SELECT COUNT(*) FROM hotels ${countWhere}`,
            countValues
        );

        const total = parseInt(countResult.rows[0].count);

        const conditions = [];
        const values = [];

        if (keyword && keyword.trim() !== "") {
            const searchKeyword = `%${keyword.trim()}%`;
            values.push(searchKeyword);
            conditions.push(`(title ILIKE $${values.length} OR description ILIKE $${values.length})`);
        }

        if (minPrice !== undefined && minPrice !== "") {
            values.push(Number(minPrice));
            conditions.push(`price >= $${values.length}`);
        }

        if (maxPrice !== undefined && maxPrice !== "") {
            values.push(Number(maxPrice));
            conditions.push(`price <= $${values.length}`);
        }

        const whereClause = conditions.length > 0
                ? `WHERE ${conditions.join(" AND ")}`
                : "";

        values.push(limit);
        const limitIndex = values.length;

        values.push(offset);
        const offsetIndex = values.length;

        const result = await pool.query(
            `SELECT * FROM hotels
             ${whereClause}
             ORDER BY id DESC
             LIMIT $${limitIndex} OFFSET $${offsetIndex}`,
            values
        );

        res.status(200).json({
            success: true,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hotels: result.rows
        });
    } catch (error) {
        console.error("Get All Hotels Error:", error);
        res.status(500).json({ success: false, message: "Server error while fetching hotels." });
    }
};

const getHotelById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!Number.isInteger(Number(id))) return res.status(400).json({ success: false, message: "Invalid hotel ID" });
        const result = await pool.query("SELECT * FROM hotels WHERE id = $1", [Number(id)]);
        if (result.rows.length === 0) return res.status(404).json({ success: false, message: "Hotel not found" });
        res.status(200).json({ success: true, hotel: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateHotel = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, latitude, longitude, price } = req.body;
        if (!Number.isInteger(Number(id))) return res.status(400).json({ success: false, message: "Invalid hotel ID" });
        const existingHotel = await pool.query("SELECT * FROM hotels WHERE id = $1", [Number(id)]);
        if (existingHotel.rows.length === 0) return res.status(404).json({ success: false, message: "Hotel not found" });
        const result = await pool.query(
            `UPDATE hotels SET title = $1, description = $2, latitude = $3, longitude = $4, price = $5 WHERE id = $6 RETURNING *`,
            [title, description, latitude, longitude, price, Number(id)]
        );
        res.status(200).json({ success: true, message: "Hotel updated successfully", hotel: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteHotel = async (req, res) => {
    try {
        const { id } = req.params;
        if (!Number.isInteger(Number(id))) return res.status(400).json({ success: false, message: "Invalid hotel ID" });
        const result = await pool.query("DELETE FROM hotels WHERE id = $1 RETURNING *", [Number(id)]);
        if (result.rows.length === 0) return res.status(404).json({ success: false, message: "Hotel not found" });
        res.status(200).json({ success: true, message: "Hotel deleted successfully", hotel: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const searchHotels = async (req, res) => {
    try {
        const { keyword } = req.query;
        if (!keyword || keyword.trim() === "") return res.status(400).json({ success: false, message: "Keyword is required" });
        const searchKeyword = `%${keyword.trim()}%`;
        const result = await pool.query(
            `SELECT * FROM hotels WHERE title ILIKE $1 OR description ILIKE $1 ORDER BY id DESC`,
            [searchKeyword]
        );
        res.status(200).json({ success: true, count: result.rows.length, hotels: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const uploadHotelImage = async (req, res) => {
    try {
        const { id } = req.params;
        if (!Number.isInteger(Number(id))) return res.status(400).json({ success: false, message: "Invalid hotel ID" });
        if (!req.file) return res.status(400).json({ success: false, message: "No image file provided" });
        const hotel = await pool.query("SELECT * FROM hotels WHERE id = $1", [Number(id)]);
        if (hotel.rows.length === 0) return res.status(404).json({ success: false, message: "Hotel not found" });
        
        const imageUrl = `/uploads/${req.file.filename}`;
        const result = await pool.query(`UPDATE hotels SET image = $1 WHERE id = $2 RETURNING *`, [imageUrl, Number(id)]);
        res.status(200).json({ success: true, message: "Hotel image uploaded successfully", hotel: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createHotel, getAllHotels, getHotelById, updateHotel, deleteHotel, searchHotels, uploadHotelImage };
