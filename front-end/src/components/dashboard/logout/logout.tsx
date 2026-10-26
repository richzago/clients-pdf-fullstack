import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../../contexts/AuthContext";
import { Container } from "./style";

const LogoutClient = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem("@TOKEN");
    localStorage.removeItem("isAuthenticated");

    setIsAuthenticated(false);

    navigate("/login", { replace: true });
  };

  return (
    <Container>
      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </Container>
  );
};

export default LogoutClient;
