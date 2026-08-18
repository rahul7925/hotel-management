import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="page">
      <h1>404</h1>
      <p>Page not found.</p>

      <Link to="/" className="primary-btn">
        Go Home
      </Link>
    </main>
  );
}

export default NotFound;
