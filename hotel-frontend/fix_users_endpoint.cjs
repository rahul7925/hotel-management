const fs = require('fs');
let content = fs.readFileSync('src/pages/Admin.jsx', 'utf8');
content = content.replace('await api.get("/users");', 'await api.get("/auth/users");');
fs.writeFileSync('src/pages/Admin.jsx', content);
console.log('Fixed /users endpoint to /auth/users');
