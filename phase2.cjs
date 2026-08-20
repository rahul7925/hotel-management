const fs = require('fs');

function removeLines(file, textsToRemove) {
    let content = fs.readFileSync(file, 'utf8');
    let lines = content.split('\n');
    let newLines = [];
    for (let i = 0; i < lines.length; i++) {
        let trimmed = lines[i].trim();
        let shouldRemove = false;
        for (let text of textsToRemove) {
            if (trimmed === text) {
                shouldRemove = true;
                break;
            }
        }
        if (!shouldRemove) {
            newLines.push(lines[i]);
        }
    }
    
    // Clean up excessive blank lines (more than 2 consecutive)
    let cleaned = newLines.join('\n').replace(/\n\s*\n\s*\n/g, '\n\n');
    fs.writeFileSync(file, cleaned);
    console.log(`Cleaned ${file}`);
}

removeLines('hotel-backend/app.js', [
    '// Serve uploaded images statically',
    '// Setup Swagger API Documentation',
    '// 404 handler',
    '// Global error handler'
]);

removeLines('hotel-backend/config/db.js', [
    '// Database config',
    '// Test Database Connection'
]);

removeLines('hotel-backend/fix_users.js', [
    '// 1. Admin',
    '// 2. User'
]);

// hotelRoutes.js has decorative comments and multiple single lines
removeLines('hotel-backend/routes/hotelRoutes.js', [
    '// ==========================================',
    '// HOTEL ROUTES',
    '// CREATE',
    '// UPLOAD IMAGE',
    '// GET ALL + PRICE FILTER',
    '// SEARCH',
    '// GET SINGLE',
    '// UPDATE',
    '// DELETE'
]);

removeLines('hotel-frontend/src/pages/AddHotel.jsx', [
    '// 1. Create Hotel',
    '// 2. Upload Image if selected'
]);

removeLines('hotel-frontend/src/pages/AdminEditHotel.jsx', [
    '// 1. Update Hotel Details',
    '// 2. Upload New Image if selected'
]);

