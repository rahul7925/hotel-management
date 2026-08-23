require("dotenv").config();
require("./config/env");

const app = require("./app");

const initDatabase = require("./config/initDb");

const PORT = process.env.PORT || 5000;

app.get('/ping', (req, res) => res.send('pong'));

app.listen(PORT, "0.0.0.0", async () => {
    console.log(`Server running on port ${PORT}`);
    await initDatabase();
});