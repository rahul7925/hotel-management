const fs = require('fs');
let content = fs.readFileSync('src/pages/Hotels.jsx', 'utf8');
content = content.replace("navigate('/login');", "");
fs.writeFileSync('src/pages/Hotels.jsx', content);
console.log('Fixed navigate error in Hotels.jsx');
