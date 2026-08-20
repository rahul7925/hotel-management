const fs = require('fs');
const content = fs.readFileSync('src/pages/Hotels.jsx', 'utf8');

const regexFunc = /const \{ user, logout \} = useAuth\(\);/;
const replaceFunc = `const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (!confirmed) return;
    logout();
    navigate('/login');
  };`;

const regexBtn = /className="hotels-logout"\s+onClick=\{logout\}/;
const replaceBtn = `className="hotels-logout"\n              onClick={handleLogout}`;

const newContent = content.replace(regexFunc, replaceFunc).replace(regexBtn, replaceBtn);
fs.writeFileSync('src/pages/Hotels.jsx', newContent);
console.log('Fixed Hotels.jsx');
