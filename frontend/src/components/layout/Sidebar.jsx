import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Target, Ticket, BarChart3, Settings, ChevronLeft, ChevronRight, Shield, ClipboardList } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

const nav = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/leads', icon: Target, label: 'Leads' },
  { path: '/tickets', icon: Ticket, label: 'Tickets' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/users', icon: Users, label: 'Users', adminOnly: true },
  { path: '/audit', icon: ClipboardList, label: 'Audit Log', adminOnly: true },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ isOpen, onClose }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, isAdmin } = useAuth();
  const filtered = nav.filter(n => !n.adminOnly || isAdmin);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col h-screen border-r border-white/6 flex-shrink-0 transition-all duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 ${collapsed ? 'md:w-16' : 'md:w-60'} w-60`}
        style={{ background: 'rgb(6 9 15)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-5 border-b border-white/6">
          <img src={logo} alt="Logo" className="w-8 h-8 rounded-xl flex-shrink-0 object-contain" />
          {(!collapsed || isOpen) && (
            <div className="animate-fade-in">
              <div className="text-slate-100 font-bold text-sm" style={{ fontFamily: 'Sora,sans-serif' }}>AffiliateCRM</div>
              <div className="text-slate-600 text-xs">v2.0 with AI</div>
            </div>
          )}
        </div>

        {/* Role badge */}
        {(!collapsed || isOpen) && (
          <div className="px-4 pt-4 animate-fade-in">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.15)' }}>
              <Shield size={13} className="text-cyan-400" />
              <span className="text-cyan-300 text-xs font-medium capitalize">{user?.role}</span>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
          {filtered.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              title={collapsed && !isOpen ? label : undefined}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''} ${collapsed && !isOpen ? 'justify-center px-0' : ''}`}
            >
              <Icon size={18} className="flex-shrink-0" />
              {(!collapsed || isOpen) && <span className="animate-fade-in">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex absolute -right-3 top-20 w-6 h-6 border border-white/10 rounded-full items-center justify-center text-slate-600 hover:text-slate-300 transition-all z-10"
          style={{ background: 'rgb(6 9 15)' }}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>
    </>
  );
}
