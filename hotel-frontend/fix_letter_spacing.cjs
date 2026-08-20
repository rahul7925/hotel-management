const fs = require('fs');

let content = fs.readFileSync('src/index.css', 'utf8');

const oldText = `.hotel-detail-title h1 {
  margin: 0;

  color: #171717;

  font-size: 30px;
  line-height: 1.2;
  font-weight: 650;
}`;

const newText = `.hotel-detail-title h1 {
  margin: 0;

  color: #171717;

  font-size: 30px;
  line-height: 1.2;
  font-weight: 650;
  letter-spacing: -0.5px;
}`;

if (content.includes(oldText)) {
    content = content.replace(oldText, newText);
    fs.writeFileSync('src/index.css', content);
    console.log("Updated letter-spacing in index.css");
} else {
    console.log("Could not find the block to replace in index.css");
}
