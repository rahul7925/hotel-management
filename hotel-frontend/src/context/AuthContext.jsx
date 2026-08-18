import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const decodeToken = (jwt) => {
  try {
    if (!jwt || typeof jwt !== "string") return null;
    const parts = jwt.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return null;
    }
    return decoded;
  } catch (error) {
    console.error("Invalid JWT:", error);
    return null;
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem("token");
    const decoded = decodeToken(savedToken);
    return decoded ? savedToken : null;
  });

  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem("token");
    return decodeToken(savedToken);
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        const newToken = e.newValue;
        if (newToken) {
          const decoded = decodeToken(newToken);
          if (decoded) {
            setToken(newToken);
            setUser(decoded);
          } else {
            setToken(null);
            setUser(null);
          }
        } else {
          setToken(null);
          setUser(null);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = (jwtToken) => {
    localStorage.setItem("token", jwtToken);
    const decodedUser = decodeToken(jwtToken);
    setToken(jwtToken);
    setUser(decodedUser);
    return decodedUser;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const value = {
    token,
    user,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
