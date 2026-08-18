const pool = require("../config/db");

const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("✅ Users table created successfully.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error creating users table:", error.message);
        process.exit(1);
    }
};

initDB();
