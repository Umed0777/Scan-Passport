import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@shared/ui/kit/button';
import { logout } from '@/entities/auth/model/authSlice';
import { useNavigate } from 'react-router-dom';
import { checkAdmin } from '@shared/lib/utils';

import logo from '@shared/assets/logo_red.png';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAdmin = checkAdmin();

  const [showButton, setShowButton] = useState(isAdmin);

  const handleLogout = () => {
    dispatch(logout());
    // setTimeout(() => navigate('/'), 10);
    navigate('/login');
  };
  const handleSettings = () => {
    navigate('/admin');
  };

  return (
    <header className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[95%] max-w-[1440px] z-50">
      <nav className="bg-white/95 shadow-lg rounded-[16px] py-4 px-6 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <img src={logo} className="h-9 w-auto" alt="Logo" />
            <span className="uppercase text-2xl font-bold tracking-wide text-gray-900 dark:text-white">Activbank</span>
          </a>
          <div className="space-x-2">
            {showButton && (
              <Button onClick={handleSettings} className="border border-[#dd2b1c] font-semibold">
                <span className="text-sm tracking-wide">Управление</span>
              </Button>
            )}
            <Button onClick={handleLogout} className="border border-[#dd2b1c] font-semibold">
              <span className="text-sm tracking-wide">Выйти</span>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
