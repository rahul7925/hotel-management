const pool = require('./config/db');
const bcrypt = require('bcryptjs');

async function fixUsers() {
  try {
    // 1. Admin
    const adminSalt = await bcrypt.genSalt(10);
    const adminHashed = await bcrypt.hash('NAMLATECHINDIApvtltd', adminSalt);
    await pool.query(
      "UPDATE users SET name = 'Admin', password = $1 WHERE email = 'Adminnamla@gmail.com'", 
      [adminHashed]
    );
    
    // 2. User
    const userSalt = await bcrypt.genSalt(10);
    const userHashed = await bcrypt.hash('user123', userSalt);
    await pool.query(
      "UPDATE users SET name = 'Dummyuser', password = $1 WHERE email = 'user@gmail.com'", 
      [userHashed]
    );
    
    console.log("Database updated exactly as requested.");
    
    const res = await pool.query('SELECT id, name, email, role FROM users ORDER BY id ASC');
    console.log(JSON.stringify(res.rows, null, 2));
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    pool.end();
  }
}

fixUsers();
