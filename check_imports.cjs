const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        if (fs.statSync(dirPath).isDirectory()) {
            walkDir(dirPath);
        } else if (f.endsWith('.js') || f.endsWith('.jsx')) {
            const content = fs.readFileSync(dirPath, 'utf8');
            // Very naive check for "Link" imported but not used (common in React)
            if (content.includes('import { Link') && !content.includes('<Link')) {
                console.log(`Unused Link in: ${dirPath}`);
            }
            if (content.includes('useNavigate') && !content.includes('navigate(')) {
                console.log(`Unused useNavigate in: ${dirPath}`);
            }
        }
    });
}

walkDir('hotel-frontend/src');
