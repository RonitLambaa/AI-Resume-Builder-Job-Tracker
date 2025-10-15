
import { useSelector } from "react-redux";

import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) { 
  const { status, loading } = useSelector((state) => state.auth);
  
  if (loading) return null; 
  return status ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;

