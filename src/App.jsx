import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import { useSelector } from "react-redux";
import { selectAuth } from "./store";
import ProtectedRoute from "./routes/ProtectedRoute";

// Borrower pages
import Payments from "./pages/borrower/Payments";
import Bookings from "./pages/borrower/Bookings";
import Profile from "./pages/borrower/Profile";

// Tenant pages
import Dashboard from "./pages/tenant/Dashboard";
import Calendars from "./pages/tenant/Calendars";
import Units from "./pages/tenant/Units";

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

export default function App() {
  const auth = useSelector(selectAuth);

  return (
    <Router>
      <Layout role={auth.role}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Tenant Routes */}
          <Route
            path="/tenant/dashboard"
            element={
              <ProtectedRoute allowRoles={["tenant"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tenant/calendars"
            element={
              <ProtectedRoute allowRoles={["tenant"]}>
                <Calendars />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tenant/units"
            element={
              <ProtectedRoute allowRoles={["tenant"]}>
                <Units />
              </ProtectedRoute>
            }
          />
          {/* Backward compat: old rentals path redirects to units */}
          <Route path="/tenant/rentals" element={<Navigate to="/tenant/units" replace />} />

          {/* Borrower Routes */}
          <Route
            path="/borrower/payments"
            element={
              <ProtectedRoute allowRoles={["borrower"]}>
                <Payments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/borrower/bookings"
            element={
              <ProtectedRoute allowRoles={["borrower"]}>
                <Bookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/borrower/profile"
            element={
              <ProtectedRoute allowRoles={["borrower"]}>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Default route: if authenticated go to role home; else login */}
          <Route
            path="*"
            element={
              auth.isAuthenticated ? (
                <Navigate
                  to={auth.role === "tenant" ? "/tenant/dashboard" : "/borrower/payments"}
                  replace
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}
