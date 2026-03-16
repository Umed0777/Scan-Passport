import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setToken, logout } from "@/entities/auth/model/authSlice";
import { isTokenExpired } from "@shared/lib/utils";

const AuthCheck = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const token = useSelector((state) => state.auth.data);

  useEffect(() => {
    dispatch(setToken()); // подтягиваем токен из localStorage
  }, [dispatch]);

  useEffect(() => {
    // Check if we're on login page - if yes, don't do any auth checks
    if (location.pathname === '/login') {
      return;
    }

    // For all other pages, check authentication
    if (!token || isTokenExpired(token)) {
      dispatch(logout());
      navigate('/login');
    }
  }, [token, dispatch, navigate, location.pathname]);

  return children;
};

export default AuthCheck;