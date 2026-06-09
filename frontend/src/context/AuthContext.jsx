import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Ctx = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(() => { try { return JSON.parse(localStorage.getItem('user'))||null; } catch { return null; } });
  const [token,   setToken]   = useState(() => localStorage.getItem('token')||null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    try { await api.post('/auth/logout'); } catch {}
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('lastActivity');
  }, []);

  const login = async (email,password) => {
    const {data}=await api.post('/auth/login',{email,password});
    setToken(data.token); setUser(data.user);
    localStorage.setItem('token',data.token); localStorage.setItem('user',JSON.stringify(data.user));
    localStorage.setItem('lastActivity', Date.now().toString());
    toast.success(`Welcome back, ${data.user.name.split(' ')[0]}!`, { duration: 3000 });
    return data;
  };

  const register = async (name,email,password) => {
    const {data}=await api.post('/auth/register',{name,email,password});
    setToken(data.token); setUser(data.user);
    localStorage.setItem('token',data.token); localStorage.setItem('user',JSON.stringify(data.user));
    localStorage.setItem('lastActivity', Date.now().toString());
    toast.success('Account created!', { duration: 3000 });
    return data;
  };

  useEffect(() => {
    const verify = async () => {
      if (!token) { setLoading(false); return; }

      // Check inactivity on page load/initialization
      const lastActivity = localStorage.getItem('lastActivity');
      if (lastActivity) {
        const elapsed = Date.now() - parseInt(lastActivity, 10);
        if (elapsed >= 3600000) { // 1 hour = 3600000 ms
          await logout();
          setLoading(false);
          toast.error('Logged out due to inactivity', { id: 'inactivity-logout' });
          return;
        }
      }

      try {
        const {data}=await api.get('/auth/me');
        setUser(data.user);
        localStorage.setItem('user',JSON.stringify(data.user));
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [token, logout]);

  // Track inactivity when user is logged in
  useEffect(() => {
    if (!user) return;

    // Set initial last activity if not present
    if (!localStorage.getItem('lastActivity')) {
      localStorage.setItem('lastActivity', Date.now().toString());
    }

    const updateLastActivity = () => {
      const now = Date.now();
      const last = localStorage.getItem('lastActivity');
      if (!last || now - parseInt(last, 10) > 5000) { // throttle to every 5s
        localStorage.setItem('lastActivity', now.toString());
      }
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(evt => window.addEventListener(evt, updateLastActivity));

    const checkInterval = setInterval(() => {
      const last = localStorage.getItem('lastActivity');
      if (last) {
        const elapsed = Date.now() - parseInt(last, 10);
        if (elapsed >= 3600000) { // 1 hour = 3600000 ms
          logout();
          toast.error('Logged out due to inactivity', { id: 'inactivity-logout' });
        }
      }
    }, 10000); // check every 10 seconds

    return () => {
      events.forEach(evt => window.removeEventListener(evt, updateLastActivity));
      clearInterval(checkInterval);
    };
  }, [user, logout]);

  const updateUser = u => { setUser(u); localStorage.setItem('user',JSON.stringify(u)); };

  return <Ctx.Provider value={{ user, token, loading, login, register, logout, updateUser, isAdmin:user?.role==='admin', isAffiliate:user?.role==='affiliate' }}>{children}</Ctx.Provider>;
};

export const useAuth = () => { const c=useContext(Ctx); if(!c) throw new Error('useAuth outside AuthProvider'); return c; };
export default Ctx;

