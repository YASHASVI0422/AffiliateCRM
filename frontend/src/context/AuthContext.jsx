import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
const Ctx = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(() => { try { return JSON.parse(localStorage.getItem('user'))||null; } catch { return null; } });
  const [token,   setToken]   = useState(() => localStorage.getItem('token')||null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const verify = async () => {
      if (!token) { setLoading(false); return; }
      try { const {data}=await api.get('/auth/me'); setUser(data.user); localStorage.setItem('user',JSON.stringify(data.user)); }
      catch { logout(); }
      finally { setLoading(false); }
    };
    verify();
  }, []);
  const login = async (email,password) => {
    const {data}=await api.post('/auth/login',{email,password});
    setToken(data.token); setUser(data.user);
    localStorage.setItem('token',data.token); localStorage.setItem('user',JSON.stringify(data.user));
    toast.success(`Welcome back, ${data.user.name.split(' ')[0]}!`, { duration: 3000 });
    return data;
  };
  const register = async (name,email,password) => {
    const {data}=await api.post('/auth/register',{name,email,password});
    setToken(data.token); setUser(data.user);
    localStorage.setItem('token',data.token); localStorage.setItem('user',JSON.stringify(data.user));
    toast.success('Account created!', { duration: 3000 });
    return data;
  };
  const logout = useCallback(async () => {
    try { await api.post('/auth/logout'); } catch {}
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);
  const updateUser = u => { setUser(u); localStorage.setItem('user',JSON.stringify(u)); };
  return <Ctx.Provider value={{ user, token, loading, login, register, logout, updateUser, isAdmin:user?.role==='admin', isAffiliate:user?.role==='affiliate' }}>{children}</Ctx.Provider>;
};
export const useAuth = () => { const c=useContext(Ctx); if(!c) throw new Error('useAuth outside AuthProvider'); return c; };
export default Ctx;
