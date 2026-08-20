const fs = require('fs');
let content = fs.readFileSync('src/pages/Admin.jsx', 'utf8');

// 1. COMPLETELY REMOVE ANY EXISTING getImageUrl DECLARATIONS TO START FRESH
// We will use a regex that captures the entire getImageUrl function wherever it is.
const getImageUrlRegex = /\s*const getImageUrl = \(image\) => \{[\s\S]*?return `http:\/\/localhost:5000\$\{image\}`;[\s\S]*?\};\s*/g;
content = content.replace(getImageUrlRegex, '\n');

// 2. LOCATE THE FINAL COMPONENT RETURN STATEMENT
// The component's main return statement looks like:
// return (
//   <div className="admin-page">
// We replace this exact block.

const exactReturnBlock = `  return (
    <div className="admin-page">`;

const properPlacement = `
  const getImageUrl = (image) => {
    if (!image) return "";
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }
    return \`http://localhost:5000\${image}\`;
  };

  return (
    <div className="admin-page">`;

if (content.includes(exactReturnBlock)) {
    content = content.replace(exactReturnBlock, properPlacement);
    fs.writeFileSync('src/pages/Admin.jsx', content);
    console.log('Successfully fixed getImageUrl scoping for good.');
} else {
    console.log('Error: Could not find exact return block.');
}
