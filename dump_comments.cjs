const fs = require('fs');
const files = [
"hotel-backend/app.js",
"hotel-backend/config/db.js",
"hotel-backend/config/swagger.js",
"hotel-backend/fix_users.js",
"hotel-backend/middleware/upload.js",
"hotel-backend/routes/authRoutes.js",
"hotel-backend/routes/hotelRoutes.js",
"hotel-frontend/src/components/Navbar.jsx",
"hotel-frontend/src/components/ProtectedRoute.jsx",
"hotel-frontend/src/context/AuthContext.jsx",
"hotel-frontend/src/pages/AddHotel.jsx",
"hotel-frontend/src/pages/Admin.jsx",
"hotel-frontend/src/pages/AdminEditHotel.jsx",
"hotel-frontend/src/pages/HotelDetails.jsx",
"hotel-frontend/src/pages/Hotels.jsx",
"hotel-frontend/src/pages/Login.jsx",
"hotel-frontend/src/services/api.js",
"hotel-frontend/vite.config.js"
];

let dump = "";
files.forEach(file => {
    if (!fs.existsSync(file)) return;
    const content = fs.readFileSync(file, 'utf8');
    const comments = [];
    const lines = content.split('\n');
    let inBlock = false;
    let block = "";
    lines.forEach(line => {
        const trimmed = line.trim();
        if (inBlock) {
            block += '\n' + trimmed;
            if (trimmed.includes('*/')) {
                inBlock = false;
                if (!block.includes('@swagger') && !block.includes('eslint')) {
                    comments.push(block);
                }
                block = "";
            }
        } else {
            if (trimmed.startsWith('//')) {
                comments.push(trimmed);
            } else if (trimmed.startsWith('/*')) {
                if (trimmed.includes('*/')) {
                   if (!trimmed.includes('@swagger') && !trimmed.includes('eslint')) comments.push(trimmed);
                } else {
                    inBlock = true;
                    block = trimmed;
                }
            } else if (trimmed.includes('//')) {
                comments.push('INLINE: ' + trimmed.substring(trimmed.indexOf('//')));
            }
        }
    });
    if (comments.length > 0) {
        dump += `\n=== ${file} ===\n`;
        dump += comments.join('\n');
    }
});
console.log(dump);
