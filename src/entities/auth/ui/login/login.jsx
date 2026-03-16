import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { Button } from '@shared/ui/kit/button';
import { useNavigate } from 'react-router-dom';
import { logIn } from '@/entities/auth/model/authSlice';

import logo from '@shared/assets/logo_login_red.svg';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
const token = useSelector((state) => state.auth.data);
  const { loading, error, data } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      username: login,
      password: password,
    };
    dispatch(logIn(user));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      navigate('/');
    }
  }, [token, navigate]);

  return (
    <div className="relative min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white backdrop-blur-sm p-10 rounded-2xl shadow-lg border-[3px] border-[#dd2b1c]/60">
        <img className="mx-auto mb-3" src={logo} alt="" width="180px" height="180px" />
        <input type="text" placeholder="Логин" value={login} onChange={(e) => setLogin(e.target.value)} className="w-full mb-6 px-5 py-3 rounded-xl border border-gray-300 focus:border-[#dd2b1c] focus:ring-2 focus:ring-[#dd2b1c] transition outline-none text-gray-700" />
        <div className="relative mb-8">
          <input type={showPassword ? 'text' : 'password'} placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-5 py-3 pr-12 rounded-xl border border-gray-300 focus:border-[#dd2b1c] focus:ring-2 focus:ring-[#dd2b1c] transition outline-none text-gray-700" />
          <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#dd2b1c] transition">
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            )}
          </button>
        </div>
        <Button type="submit" disabled={loading} className={`w-full py-4 rounded-xl text-white font-semibold shadow-md transition ${loading ? 'bg-[#dd2b1c]/70 cursor-not-allowed' : 'bg-[#dd2b1c] hover:bg-[#dd2b1c]/90 active:bg-[#7a0b0f]'}`}>
          {loading ? 'Вход...' : 'Войти'}
        </Button>
      </form>
    </div>
  );
};

export default Login;
