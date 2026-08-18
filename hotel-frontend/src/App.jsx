import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Hotels from "./pages/Hotels";
import HotelDetails from "./pages/HotelDetails";
import Admin from "./pages/Admin";
import AddHotel from "./pages/AddHotel";
import AdminEditHotel from "./pages/AdminEditHotel";
import NotFound from "./pages/NotFound";
import AccessDenied from "./pages/AccessDenied";

import ProtectedRoute from "./components/ProtectedRoute";

function RootRedirect() {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) return null;
  
  if (isAuthenticated) {
    return user?.role === "admin" 
      ? <Navigate to="/admin" replace /> 
      : <Navigate to="/hotels" replace />;
  }
  
  return <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/hotels" element={<Hotels />} />
      <Route path="/hotels/:id" element={<HotelDetails />} />
      
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <Admin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/add"
        element={
          <ProtectedRoute adminOnly>
            <AddHotel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/edit/:id"
        element={
          <ProtectedRoute adminOnly>
            <AdminEditHotel />
          </ProtectedRoute>
        }
      />
      
      <Route path="/access-denied" element={<AccessDenied />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
