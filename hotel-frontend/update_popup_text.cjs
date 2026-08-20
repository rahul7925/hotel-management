const fs = require('fs');

let adminContent = fs.readFileSync('src/pages/Admin.jsx', 'utf8');
let hotelsContent = fs.readFileSync('src/pages/Hotels.jsx', 'utf8');

const oldText = "Are you sure you want to log out and close the site?";
const newText = "Are you sure you want to close this site?\\nLog out to close the site.";

if (adminContent.includes(oldText)) {
    adminContent = adminContent.replace(oldText, newText);
    fs.writeFileSync('src/pages/Admin.jsx', adminContent);
    console.log("Updated Admin.jsx text.");
}

if (hotelsContent.includes(oldText)) {
    hotelsContent = hotelsContent.replace(oldText, newText);
    fs.writeFileSync('src/pages/Hotels.jsx', hotelsContent);
    console.log("Updated Hotels.jsx text.");
}
