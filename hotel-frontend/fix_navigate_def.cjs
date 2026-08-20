const fs = require('fs');
let content = fs.readFileSync('src/pages/Hotels.jsx', 'utf8');
content = content.replace("const navigate = useNavigate();", "");
fs.writeFileSync('src/pages/Hotels.jsx', content);
console.log('Removed navigate definition from Hotels.jsx');
