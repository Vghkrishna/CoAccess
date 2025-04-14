import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import GuestLoginPage from "./pages/GuestLoginPage";
import GuestHandling from "./pages/guestHandling";
import MySpace from "./pages/myspace";

// Combined access control component for both main user and guest user
const RequireUser = ({ children }) => {
  const token = localStorage.getItem("token");
  const guestToken = localStorage.getItem("guestToken");
  
  if (token || guestToken) {
    return children; // Allow both main and guest users
  }

  return <Navigate to="/login" />; // Redirect to login if no token
};

const PublicOnly = ({ children }) => {
  const token = localStorage.getItem("token");
  const guestToken = localStorage.getItem("guestToken");

  if (token) return <Navigate to="/dashboard" />;
  if (guestToken) return <Navigate to="/myspace" />;
  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Root route: redirect based on token */}
        <Route
          path="/"
          element={
            localStorage.getItem("token") ? (
              <Navigate to="/dashboard" />
            ) : localStorage.getItem("guestToken") ? (
              <Navigate to="/myspace" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Public only routes */}
        <Route
          path="/register"
          element={
            <PublicOnly>
              <Register />
            </PublicOnly>
          }
        />
        <Route
          path="/login"
          element={
            <PublicOnly>
              <Login />
            </PublicOnly>
          }
        />
        <Route
          path="/guest-login"
          element={
            <PublicOnly>
              <GuestLoginPage />
            </PublicOnly>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <RequireUser>
              <Dashboard />
            </RequireUser>
          }
        />
        <Route
          path="/guesthandling"
          element={
            <RequireUser>
              <GuestHandling />
            </RequireUser>
          }
        />
        {/* MySpace route, accessible by both main users and guest users */}
        <Route
          path="/myspace"
          element={
            <RequireUser>
              <MySpace />
            </RequireUser>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
