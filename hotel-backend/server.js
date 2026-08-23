require("dotenv").config();
require("./config/env");

const app = require("./app");

const initDatabase = require("./config/initDb");

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await initDatabase();
});