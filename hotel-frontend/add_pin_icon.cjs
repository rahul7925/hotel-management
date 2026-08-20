const fs = require('fs');
let content = fs.readFileSync('src/pages/Hotels.jsx', 'utf8');

const oldLocationRegex = /<p className="hotel-location">\s*\{hotel\.latitude\},\s*\{" "\}\s*\{hotel\.longitude\}\s*<\/p>/;

const newLocation = `<p className="hotel-location" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b' }}>
                          <img src="/location-pin.png" alt="location pin" style={{ width: '14px', height: '14px' }} />
                          <span>{hotel.latitude}, {hotel.longitude}</span>
                        </p>`;

if (oldLocationRegex.test(content)) {
    content = content.replace(oldLocationRegex, newLocation);
    fs.writeFileSync('src/pages/Hotels.jsx', content);
    console.log("Successfully added location pin image to Hotels.jsx");
} else {
    console.log("Could not find the location block to replace.");
}
