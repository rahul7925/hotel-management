const pool = require('./config/db');
const bcrypt = require('bcryptjs');

async function resetUsers() {
  try {
    await pool.query("DELETE FROM users WHERE email NOT IN ('Adminnamla@gmail.com', 'user@gmail.com')");
    
    await pool.query("UPDATE users SET name = 'namlatechindia pvt' WHERE email = 'Adminnamla@gmail.com'");
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('user123', salt);
    await pool.query("UPDATE users SET name = 'dummyuser', password = $1 WHERE email = 'user@gmail.com'", [hashedPassword]);
    
    console.log("Users updated successfully.");
    const res = await pool.query('SELECT id, name, email, role FROM users');
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    pool.end();
  }
}
resetUsers();
