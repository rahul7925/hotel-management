if (!process.env.DATABASE_URL) {
    const requiredEnv = [
        "DB_USER",
        "DB_HOST",
        "DB_NAME",
        "DB_PASSWORD",
        "DB_PORT"
    ];

    for (const key of requiredEnv) {
        if (!process.env[key]) {
            throw new Error(`Missing required environment variable: ${key} (or provide DATABASE_URL)`);
        }
    }
}

if (!process.env.JWT_SECRET) {
    throw new Error("Missing required environment variable: JWT_SECRET");
}

module.exports = true;

