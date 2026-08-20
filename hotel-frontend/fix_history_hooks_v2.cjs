const fs = require('fs');

let adminContent = fs.readFileSync('src/pages/Admin.jsx', 'utf8');
let hotelsContent = fs.readFileSync('src/pages/Hotels.jsx', 'utf8');

const oldRegex = /\/\*\s*Double-lock back button and tab close protection\s*\*\/[\s\S]*?\}, \[logout, navigate\]\);/;

const newHook = `/* Double-lock back button and tab close protection */
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "Are you sure you want to leave?";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Push twice so that a single back button press keeps the URL identical.
    // This prevents React Router from detecting a path change and unmounting the component.
    window.history.pushState(null, null, window.location.href);
    window.history.pushState(null, null, window.location.href);

    const handlePopState = () => {
      const confirmed = window.confirm("Are you sure you want to log out and close the site?");
      if (confirmed) {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        logout();
        navigate("/login", { replace: true });
      } else {
        // They cancelled. Push state again to restore the buffer.
        window.history.pushState(null, null, window.location.href);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [logout, navigate]);`;

if (oldRegex.test(adminContent)) {
    adminContent = adminContent.replace(oldRegex, newHook);
    fs.writeFileSync('src/pages/Admin.jsx', adminContent);
    console.log("Patched Admin.jsx with double-push logic.");
}

if (oldRegex.test(hotelsContent)) {
    hotelsContent = hotelsContent.replace(oldRegex, newHook);
    fs.writeFileSync('src/pages/Hotels.jsx', hotelsContent);
    console.log("Patched Hotels.jsx with double-push logic.");
}
