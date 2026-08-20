import {
  createContext,
  useContext,
  useState,
} from "react";

const AuthContext = createContext(null);

const TOKEN_KEY = "hotelhub_token";

const decodeToken = (jwt) => {
  try {
    if (!jwt || typeof jwt !== "string") {
      return null;
    }

    const parts = jwt.split(".");

    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];

    const decoded = JSON.parse(
      atob(
        payload
          .replace(/-/g, "+")
          .replace(/_/g, "/")
      )
    );

    if (
      decoded.exp &&
      decoded.exp * 1000 <= Date.now()
    ) {
      return null;
    }

    return decoded;

  } catch (error) {
    console.error(
      "Invalid JWT:",
      error
    );

    return null;
  }
};

export function AuthProvider({
  children,
}) {

  const [token, setToken] = useState(() => {

    const savedToken =
      sessionStorage.getItem(
        TOKEN_KEY
      );

    const decoded =
      decodeToken(savedToken);

    if (!decoded) {
      sessionStorage.removeItem(
        TOKEN_KEY
      );

      return null;
    }

    return savedToken;
  });

  const [user, setUser] = useState(() => {

    const savedToken =
      sessionStorage.getItem(
        TOKEN_KEY
      );

    const decoded =
      decodeToken(savedToken);

    if (!decoded) {
      sessionStorage.removeItem(
        TOKEN_KEY
      );

      return null;
    }

    return decoded;
  });

  const [loading, setLoading] =
    useState(false);

  const login = (jwtToken) => {

    const decodedUser =
      decodeToken(jwtToken);

    if (!decodedUser) {
      throw new Error(
        "Invalid or expired login session."
      );
    }

        // sessionStorage isolates sessions per tab, preventing Admin/User sessions from overwriting each other.

    sessionStorage.setItem(
      TOKEN_KEY,
      jwtToken
    );

    setToken(jwtToken);
    setUser(decodedUser);

    return decodedUser;
  };

  const logout = () => {

    sessionStorage.removeItem(
      TOKEN_KEY
    );

    setToken(null);
    setUser(null);
  };

  const value = {

    token,

    user,

    loading,

    isAuthenticated:
      Boolean(token) &&
      Boolean(user),

    isAdmin:
      user?.role === "admin",

    isUser:
      user?.role === "user",

    login,

    logout,
  };

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {

  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
