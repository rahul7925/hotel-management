const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        const isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            if (f !== 'node_modules' && f !== '.git' && f !== 'dist' && f !== 'build') {
                walkDir(dirPath, callback);
            }
        } else {
            if (f.endsWith('.js') || f.endsWith('.jsx')) {
                callback(dirPath);
            }
        }
    });
}

const targetFiles = [];
walkDir('.', function(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    // Check for any inline comments (// ...) or block comments (/* ... */)
    // Ignore purely uncommented files or files that ONLY have swagger/jsdoc
    const hasInline = /\/\/[^\n]+/.test(content);
    const hasBlock = /\/\*(?!\* @swagger)[\s\S]*?\*\//.test(content);
    
    if (hasInline || hasBlock) {
        targetFiles.push(filePath);
    }
});

console.log("Files with standard comments to review:");
console.log(targetFiles.join('\n'));
