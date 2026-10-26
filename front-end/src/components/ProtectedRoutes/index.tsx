import { useContext } from "react";
import { Outlet } from "react-router-dom";

import { AuthContext } from "../../contexts/AuthContext";

const ProtectedRoutes = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return isAuthenticated ? <Outlet /> : null;
};

export default ProtectedRoutes;
