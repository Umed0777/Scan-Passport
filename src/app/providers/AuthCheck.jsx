import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "@shared/lib/utils";

const AuthCheck = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isTokenExpired()) {
      localStorage.removeItem("access_token");
      navigate("/login");
    }
  }, []);

  return children;
};

export default AuthCheck;