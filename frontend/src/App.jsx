import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout       from './components/layout/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import Login        from './pages/auth/Login';
import Register     from './pages/auth/Register';
import Dashboard    from './pages/dashboard/Dashboard';
import Leads        from './pages/leads/Leads';
import Tickets      from './pages/tickets/Tickets';
import TicketDetail from './pages/tickets/TicketDetail';
import Analytics    from './pages/analytics/Analytics';
import Settings     from './pages/settings/Settings';
import Users        from './pages/users/Users';
import NotFound     from './pages/NotFound';
import AuditLog     from './pages/audit/AuditLog';
import Landing      from './pages/Landing';

const Protected = ({ children, adminOnly=false }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{background:'#0a1a0f'}}><div className="w-10 h-10 border-2 border-[#a8ff3e] border-t-transparent rounded-full animate-spin"/></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role!=='admin') return <Navigate to="/dashboard" replace />;
  return children;
};
const Public = ({ children }) => { const {user,loading}=useAuth(); if(loading) return null; if(user) return <Navigate to="/dashboard" replace />; return children; };

const AppRoutes = () => (
  <Routes>
    <Route path="/"         element={<Landing />} />
    <Route path="/login"    element={<Public><Login /></Public>} />
    <Route path="/register" element={<Public><Register /></Public>} />
    <Route path="/" element={<Protected><ErrorBoundary><Layout /></ErrorBoundary></Protected>}>
      <Route path="dashboard"   element={<Dashboard />} />
      <Route path="leads"       element={<Leads />} />
      <Route path="tickets"     element={<Tickets />} />
      <Route path="tickets/:id" element={<TicketDetail />} />
      <Route path="analytics"   element={<Protected adminOnly><Analytics /></Protected>} />
      <Route path="users"       element={<Protected adminOnly><Users /></Protected>} />
      <Route path="audit"       element={<Protected adminOnly><AuditLog /></Protected>} />
      <Route path="settings"    element={<Settings />} />
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
);

import { NotificationProvider } from './context/NotificationContext';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#111c14',
                color: '#e2e8f0',
                border: '1px solid rgba(168,255,62,0.15)',
                borderRadius: '12px',
                fontFamily: 'Sora, Inter, sans-serif',
                fontSize: '14px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.4), 0 0 15px rgba(168,255,62,0.05)',
              },
              success: {
                iconTheme: { primary: '#a8ff3e', secondary: '#111c14' },
              },
              error: {
                iconTheme: { primary: '#f87171', secondary: '#111c14' },
              },
              duration: 3000,
            }}
          />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
