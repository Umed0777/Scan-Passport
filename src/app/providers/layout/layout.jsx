import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from '@/widgets/header/header';
import { setToken } from '@/entities/auth/model/authSlice';
import Login from '@/entities/auth/ui/login/login';

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const token = useSelector((state) => state.auth.data);

  useEffect(() => {
    dispatch(setToken());
  }, [dispatch]);

  useEffect(() => {
    if (token && location.pathname === '/login') {
      navigate('/');
    }
  }, [token, location.pathname, navigate]);

  if (!token) {
    return (
      <div className="mx-auto">
        <Toaster position="bottom-right" />
        <Login />
      </div>
    );
  }

  return (
    <div className="bg-gray-100">
      <Toaster position="bottom-right" />
      <Header />
      <main className="pt-[120px]">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
