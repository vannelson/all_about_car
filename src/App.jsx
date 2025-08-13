import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./layout/Layout";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "#fbfbfb", // your desired color
      },
    },
  },
});

// Borrower pages
import Payments from "./pages/borrower/Payments";
import Bookings from "./pages/borrower/Bookings";
import Profile from "./pages/borrower/Profile";

// Tenant pages
import Dashboard from "./pages/tenant/Dashboard";
import Calendars from "./pages/tenant/Calendars";
import Rentals from "./pages/tenant/Rentals";

export default function App() {
  const userRole = "tenant"; // Or "borrower" — normally from auth

  return (
    <Router>
      <Layout role={userRole}>
        <Routes>
          {/* Tenant Routes */}
          {userRole === "tenant" && (
            <>
              <Route path="/tenant/dashboard" element={<Dashboard />} />
              <Route path="/tenant/calendars" element={<Calendars />} />
              <Route path="/tenant/rentals" element={<Rentals />} />
              <Route path="*" element={<Navigate to="/tenant/dashboard" />} />
            </>
          )}

          {/* Borrower Routes */}
          {userRole === "borrower" && (
            <>
              <Route path="/borrower/payments" element={<Payments />} />
              <Route path="/borrower/bookings" element={<Bookings />} />
              <Route path="/borrower/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/borrower/payments" />} />
            </>
          )}
        </Routes>
      </Layout>
    </Router>
  );
}
