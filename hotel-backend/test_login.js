const pool = require("./config/db");
const bcrypt = require("bcryptjs");

async function checkLogin() {
    try {
        const res = await pool.query("SELECT * FROM users WHERE email = $1", ["Adminnamla@gmail.com"]);
        const user = res.rows[0];
        console.log("User found:", !!user);
        
        if (user) {
            console.log("Stored hash:", user.password);
            const isMatch = await bcrypt.compare("NAMLATECHINDIApvtltd", user.password);
            console.log("Password matches NAMLATECHINDIApvtltd:", isMatch);
        }
    } catch(err) {
        console.error(err);
    } finally {
        pool.end();
    }
}
checkLogin();
