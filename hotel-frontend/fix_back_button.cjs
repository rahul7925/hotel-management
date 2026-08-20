const fs = require('fs');
let content = fs.readFileSync('src/pages/Admin.jsx', 'utf8');

const oldHook = `  /* Prevent back button navigation */
  useEffect(() => {
    window.history.pushState(null, null, window.location.pathname);
    const handlePopState = () => {
      window.history.pushState(null, null, window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
return () => window.removeEventListener('popstate', handlePopState);
  }, []);`;

const newHook = `  /* Prevent back button navigation with confirmation popup */
  useEffect(() => {
    window.history.pushState(null, null, window.location.pathname);
    const handlePopState = () => {
      const confirmed = window.confirm("Are you sure you want to log out and leave this page?");
      if (confirmed) {
        logout();
        navigate("/login");
      } else {
        window.history.pushState(null, null, window.location.pathname);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [logout, navigate]);`;

if (content.includes(oldHook)) {
    content = content.replace(oldHook, newHook);
    fs.writeFileSync('src/pages/Admin.jsx', content);
    console.log("Successfully updated the popstate hook in Admin.jsx");
} else {
    console.log("Could not find the exact old hook to replace.");
}
