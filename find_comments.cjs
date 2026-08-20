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
    // Look for decorative comments or typical redundant comments
    if (content.includes('==========') || content.includes('// handle') || content.includes('/* ---') || content.includes('/* ==')) {
        targetFiles.push(filePath);
    }
});

console.log("Files to review:");
console.log(targetFiles.join('\n'));
