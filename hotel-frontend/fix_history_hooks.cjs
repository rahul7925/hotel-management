const fs = require('fs');

// 1. PATCH ADMIN.JSX
let adminContent = fs.readFileSync('src/pages/Admin.jsx', 'utf8');

const oldHookAdminRegex = /\/\*\s*Prevent back button navigation with confirmation popup\s*\*\/[\s\S]*?\}, \[logout, navigate\]\);/;

const newHookAdmin = `/* Double-lock back button and tab close protection */
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "Are you sure you want to leave?";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    window.history.pushState(null, null, window.location.pathname);
    const handlePopState = () => {
      const confirmed = window.confirm("Are you sure you want to log out and leave this page?");
      if (confirmed) {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        logout();
        navigate("/login", { replace: true });
      } else {
        window.history.pushState(null, null, window.location.pathname);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [logout, navigate]);`;

if (oldHookAdminRegex.test(adminContent)) {
    adminContent = adminContent.replace(oldHookAdminRegex, newHookAdmin);
    fs.writeFileSync('src/pages/Admin.jsx', adminContent);
    console.log("Patched Admin.jsx successfully.");
} else {
    console.log("Could not find the Admin.jsx hook.");
}

// 2. PATCH HOTELS.JSX
let hotelsContent = fs.readFileSync('src/pages/Hotels.jsx', 'utf8');

if (!hotelsContent.includes('useNavigate')) {
    hotelsContent = hotelsContent.replace('import { Link } from "react-router-dom";', 'import { Link, useNavigate } from "react-router-dom";');
}
if (!hotelsContent.includes('const navigate = useNavigate();')) {
    hotelsContent = hotelsContent.replace('const { user, logout } = useAuth();', 'const { user, logout } = useAuth();\n  const navigate = useNavigate();');
}

const oldHookHotelsRegex = /\/\*\s*Prevent back button navigation\s*\*\/[\s\S]*?\}, \[\]\);/;

if (oldHookHotelsRegex.test(hotelsContent)) {
    hotelsContent = hotelsContent.replace(oldHookHotelsRegex, newHookAdmin);
    fs.writeFileSync('src/pages/Hotels.jsx', hotelsContent);
    console.log("Patched Hotels.jsx successfully.");
} else {
    console.log("Could not find the Hotels.jsx hook.");
}
