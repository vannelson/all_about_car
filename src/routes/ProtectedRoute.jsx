import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth } from "../store";

export default function ProtectedRoute({ children, allowRoles }) {
  const auth = useSelector(selectAuth);

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowRoles && !allowRoles.includes(auth.role)) {
    // If role mismatch, send to their default landing
    return (
      <Navigate
        to={auth.role === "tenant" ? "/tenant/dashboard" : "/borrower/payments"}
        replace
      />
    );
  }

  return children;
}

