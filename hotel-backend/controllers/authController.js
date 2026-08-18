const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Please provide name, email, and password." });
        }

        const trimmedEmail = email.trim();

        const userExists = await pool.query(
            "SELECT * FROM users WHERE email = $1 OR name = $2",
            [trimmedEmail, name]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({ success: false, message: "User with that email or name already exists." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await pool.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role, created_at",
            [name, trimmedEmail, hashedPassword]
        );

        res.status(201).json({
            success: true,
            message: "User registered successfully.",
            user: result.rows[0]
        });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ success: false, message: "Server error during registration." });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please provide email and password." });
        }

        const trimmedEmail = email.trim();

        const result = await pool.query("SELECT * FROM users WHERE email = $1", [trimmedEmail]);

        if (result.rows.length === 0) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        const token = jwt.sign(
            { id: user.id, name: user.name, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: "Server error during login." });
    }
};

const getUserStats = async (req, res) => {
    try {
        const result = await pool.query("SELECT id, name, email, role, created_at FROM users ORDER BY id DESC");
        const users = result.rows;
        
        res.status(200).json({
            success: true,
            totalUsers: users.length,
            totalAdmins: users.filter(u => u.role === "admin").length,
            regularUsers: users.filter(u => u.role === "user").length,
            users
        });
    } catch (error) {
        console.error("Get Users Error:", error);
        res.status(500).json({ success: false, message: "Server error while fetching users." });
    }
};

module.exports = { registerUser, loginUser, getUserStats };
