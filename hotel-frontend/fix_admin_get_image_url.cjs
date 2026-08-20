const fs = require('fs');
let content = fs.readFileSync('src/pages/Admin.jsx', 'utf8');

const properPlacement = `
  const getImageUrl = (image) => {
    if (!image) return "";
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }
    return \`http://localhost:5000\${image}\`;
  };

  return (`;

if (!content.includes('const getImageUrl = (image) =>')) {
    content = content.replace('  return (', properPlacement);
    fs.writeFileSync('src/pages/Admin.jsx', content);
    console.log('Successfully injected getImageUrl');
} else {
    console.log('getImageUrl already exists');
}
