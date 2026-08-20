const fs = require('fs');

let hotelsContent = fs.readFileSync('src/pages/Hotels.jsx', 'utf8');

const hookRegex = /\/\*\s*Double-lock back button and tab close protection\s*\*\/[\s\S]*?\}, \[logout, navigate\]\);/;
const authVarsRegex = /const \{ user, logout \} = useAuth\(\);\s*const navigate = useNavigate\(\);/;

const hookMatch = hotelsContent.match(hookRegex);
const authVarsMatch = hotelsContent.match(authVarsRegex);

if (hookMatch && authVarsMatch) {
    // Remove the authVars from their current position
    hotelsContent = hotelsContent.replace(authVarsMatch[0], '');
    
    // Insert them right before the hook
    const newContentToInsert = authVarsMatch[0] + '\n\n  ' + hookMatch[0];
    hotelsContent = hotelsContent.replace(hookMatch[0], newContentToInsert);
    
    // Fix handleLogout
    hotelsContent = hotelsContent.replace('logout();\n    \n  };', 'logout();\n    navigate("/login");\n  };');

    fs.writeFileSync('src/pages/Hotels.jsx', hotelsContent);
    console.log("Fixed Hotels.jsx reference error and handleLogout navigation.");
} else {
    console.log("Could not find the necessary blocks in Hotels.jsx.");
}
