const fs = require('fs');

function removeLines(file, textsToRemove) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    let lines = content.split('\n');
    let newLines = [];
    
    // First pass: remove exact string matches
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

function rewriteFileByRegex(file, regexPatterns) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    for (let p of regexPatterns) {
        content = content.replace(p.pattern, p.replacement);
    }
    // Clean up excessive blank lines
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    fs.writeFileSync(file, content);
    console.log(`Regex cleaned ${file}`);
}

// 1. Login.jsx
removeLines('hotel-frontend/src/pages/Login.jsx', [
    '// If already logged in, prevent accessing login page',
    '// Store JWT and get decoded user',
    '// Role-based navigation, replace history so back button skips login'
]);

// 2. ProtectedRoute.jsx
rewriteFileByRegex('hotel-frontend/src/components/ProtectedRoute.jsx', [
    { pattern: /\/\*\s*=====================================================\s*LOADING\s*=====================================================\s*\*\//g, replacement: '' },
    { pattern: /\/\*\s*=====================================================\s*NOT LOGGED IN\s*=====================================================\s*\*\//g, replacement: '' },
    { pattern: /\/\*\s*=====================================================\s*ADMIN ONLY\s*=====================================================\s*\*\//g, replacement: '' },
    { pattern: /\/\*\s*=====================================================\s*USER ONLY\s*=====================================================\s*\*\//g, replacement: '' }
]);

// 3. AuthContext.jsx
rewriteFileByRegex('hotel-frontend/src/context/AuthContext.jsx', [
    { pattern: /\/\*\s*=====================================================\s*DECODE JWT\s*=====================================================\s*\*\//g, replacement: '' },
    { pattern: /\/\*\s*Check token expiry\s*\*\//g, replacement: '' },
    { pattern: /\/\*\s*=====================================================\s*AUTH PROVIDER\s*=====================================================\s*\*\//g, replacement: '' },
    { pattern: /\/\*\s*-{53}\s*Get session for THIS TAB only\s*-{53}\s*\*\//g, replacement: '' },
    { pattern: /\/\*\s*-{53}\s*Get current user\s*-{53}\s*\*\//g, replacement: '' },
    { pattern: /\/\*\s*=====================================================\s*LOGIN\s*=====================================================\s*\*\//g, replacement: '' },
    { pattern: /\/\*\s*Store token in sessionStorage\.\s*sessionStorage is isolated per browser tab\.\s*This prevents Admin\/User sessions from\s*overwriting each other\.\s*\*\//g, replacement: '    // sessionStorage isolates sessions per tab, preventing Admin/User sessions from overwriting each other.' },
    { pattern: /\/\*\s*=====================================================\s*LOGOUT\s*=====================================================\s*\*\//g, replacement: '' },
    { pattern: /\/\*\s*=====================================================\s*AUTH VALUE\s*=====================================================\s*\*\//g, replacement: '' },
    { pattern: /\/\*\s*=====================================================\s*USE AUTH\s*=====================================================\s*\*\//g, replacement: '' }
]);

// 4. Admin.jsx
rewriteFileByRegex('hotel-frontend/src/pages/Admin.jsx', [
    { pattern: /\/\*\s*={49}\s*FETCH HOTELS\s*={49}\s*\*\//g, replacement: '' },
    { pattern: /\/\*\s*={49}\s*FETCH USERS\s*={49}\s*\*\//g, replacement: '' },
    { pattern: /\/\*\s*={49}\s*INITIAL LOAD\s*={49}\s*\*\//g, replacement: '' },
    { pattern: /\/\*\s*={49}\s*SEARCH\s*={49}\s*\*\//g, replacement: '' },
    { pattern: /\/\*\s*={49}\s*CLEAR FILTERS\s*={49}\s*\*\//g, replacement: '' },
    { pattern: /\/\*\s*={49}\s*DELETE HOTEL\s*={49}\s*\*\//g, replacement: '' },
    { pattern: /\/\*\s*={49}\s*LOGOUT\s*={49}\s*\*\//g, replacement: '' },
    { pattern: /\/\*\s*={49}\s*SIDEBAR - DASHBOARD\s*={49}\s*\*\//g, replacement: '' },
    { pattern: /\/\*\s*={49}\s*SIDEBAR - HOTELS\s*={49}\s*\*\//g, replacement: '' },
    { pattern: /\{\/\*\s*={49}\s*ADMIN BODY\s*={49}\s*\*\/\}/g, replacement: '' },
    { pattern: /\{\/\*\s*={49}\s*LEFT SIDEBAR\s*={49}\s*\*\/\}/g, replacement: '' },
    { pattern: /\{\/\*\s*={49}\s*MAIN CONTENT\s*={49}\s*\*\/\}/g, replacement: '' },
    { pattern: /\{\/\*\s*={49}\s*DASHBOARD\s*={49}\s*\*\/\}/g, replacement: '' },
    { pattern: /\{\/\*\s*={49}\s*HOTELS\s*={49}\s*\*\/\}/g, replacement: '' },
    { pattern: /\{\/\*\s*={49}\s*SEARCH \+ ADD HOTEL\s*={49}\s*\*\/\}/g, replacement: '' },
    { pattern: /\{\/\*\s*={49}\s*PRICE FILTER\s*={49}\s*\*\/\}/g, replacement: '' },
    { pattern: /\{\/\*\s*={49}\s*RESULT COUNT\s*={49}\s*\*\/\}/g, replacement: '' },
    { pattern: /\{\/\*\s*={49}\s*ERROR\s*={49}\s*\*\/\}/g, replacement: '' },
    { pattern: /\{\/\*\s*={49}\s*HOTEL TABLE\s*={49}\s*\*\/\}/g, replacement: '' }
]);

// 5. Hotels.jsx
rewriteFileByRegex('hotel-frontend/src/pages/Hotels.jsx', [
    { pattern: /\/\*\s*-{50}\s*Load hotels from existing API\s*-{50}\s*\*\//g, replacement: '' },
    { pattern: /\/\*\s*-{50}\s*Initial \/ price \/ pagination loading\s*-{50}\s*\*\//g, replacement: '' },
    { pattern: /\/\*\s*-{50}\s*Search\s*-{50}\s*\*\//g, replacement: '' },
    { pattern: /\/\*\s*-{50}\s*Combined client-side location filtering\s*-{50}\s*\*\//g, replacement: '' },
    { pattern: /\/\*\s*-{50}\s*Clear filters\s*-{50}\s*\*\//g, replacement: '' },
    { pattern: /\/\*\s*-{50}\s*Image URL\s*-{50}\s*\*\//g, replacement: '' },
    { pattern: /\/\*\s*-{50}\s*Loading\s*-{50}\s*\*\//g, replacement: '' },
    { pattern: /\/\*\s*-{50}\s*Error\s*-{50}\s*\*\//g, replacement: '' },
    { pattern: /\{\/\*\s*={25}\s*NAVBAR\s*={25}\s*\*\/\}/g, replacement: '' },
    { pattern: /\{\/\*\s*={25}\s*MAIN\s*={25}\s*\*\/\}/g, replacement: '' },
    { pattern: /\{\/\*\s*={25}\s*FILTER SIDEBAR\s*={25}\s*\*\/\}/g, replacement: '' },
    { pattern: /\{\/\*\s*={25}\s*RESULTS\s*={25}\s*\*\/\}/g, replacement: '' },
    { pattern: /\{\/\*\s*={25}\s*HOTEL LIST\s*={25}\s*\*\/\}/g, replacement: '' },
    { pattern: /\{\/\*\s*={25}\s*PAGINATION\s*={25}\s*\*\/\}/g, replacement: '' }
]);
