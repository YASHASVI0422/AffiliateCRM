import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Search, Settings, LogOut, User, ChevronDown, Check, Target, Ticket, Activity, Users, X, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '../ui/Avatar';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { useNotifications } from '../../context/NotificationContext';

const titles = {
  '/dashboard':{ title:'Dashboard',       subtitle:'Overview of your CRM operations' },
  '/leads':    { title:'Lead Management', subtitle:'Track and manage your pipeline' },
  '/tickets':  { title:'Support Tickets', subtitle:'Manage support requests' },
  '/analytics':{ title:'Analytics',       subtitle:'Insights and performance metrics' },
  '/users':    { title:'User Management', subtitle:'Manage team and affiliates' },
  '/audit':    { title:'Audit Log',       subtitle:'System activity trail' },
  '/settings': { title:'Settings',        subtitle:'Account and preferences' },
};

const activityIcons = {
  lead_created:   { icon:Target,   color:'text-[#a8ff3e]',    bg:'bg-[#a8ff3e]/10' },
  lead_converted: { icon:Check,    color:'text-emerald-400', bg:'bg-emerald-500/10' },
  lead_updated:   { icon:Target,   color:'text-amber-400',   bg:'bg-amber-500/10' },
  ticket_created: { icon:Ticket,   color:'text-red-400',     bg:'bg-red-500/10' },
  ticket_replied: { icon:Activity, color:'text-[#8ee62c]',  bg:'bg-[#8ee62c]/10' },
  ticket_updated: { icon:Ticket,   color:'text-amber-400',   bg:'bg-amber-500/10' },
  user_registered:{ icon:Users,    color:'text-[#a8ff3e]',    bg:'bg-[#a8ff3e]/10' },
  user_login:     { icon:User,     color:'text-slate-500',   bg:'bg-white/5' },
};

function QuickSearchModal({ onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ leads: [], tickets: [] });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    if (!query.trim()) { setResults({ leads: [], tickets: [] }); return; }
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const [leadsRes, ticketsRes] = await Promise.allSettled([
          api.get('/leads', { params: { search: query, limit: 5 } }),
          api.get('/tickets', { params: { search: query, limit: 5 } }),
        ]);
        setResults({
          leads: leadsRes.status === 'fulfilled' ? leadsRes.value.data.data || [] : [],
          tickets: ticketsRes.status === 'fulfilled' ? ticketsRes.value.data.data || [] : [],
        });
      } catch { }
      finally { setLoading(false); }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const hasResults = results.leads.length > 0 || results.tickets.length > 0;

  const goTo = (path) => { navigate(path); onClose(); };

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-24 px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <div
        className="relative w-full max-w-xl shadow-2xl animate-slide-up overflow-hidden"
        style={{ background: '#111c14', border: '1px solid rgba(168,255,62,0.15)', borderRadius: '1rem' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Gradient top accent */}
        <div className="absolute top-0 left-0 right-0 h-[1px]" style={{background: 'linear-gradient(90deg, transparent, #a8ff3e, #10b981, transparent)'}} />

        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8">
          <Search size={16} className="text-slate-500 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search leads, tickets..."
            className="flex-1 bg-transparent text-slate-200 text-sm outline-none placeholder-slate-500"
            onKeyDown={e => e.key === 'Escape' && onClose()}
          />
          {loading && <div className="w-4 h-4 border-2 border-[#a8ff3e] border-t-transparent rounded-full animate-spin flex-shrink-0" />}
          <button onClick={onClose} className="text-slate-500 hover:text-slate-200 transition-colors flex-shrink-0">
            <X size={16} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto scrollbar-thin">
          {!query.trim() ? (
            <div className="px-4 py-6 text-center text-slate-500 text-sm">
              Type to search across leads and tickets…
            </div>
          ) : !hasResults && !loading ? (
            <div className="px-4 py-6 text-center text-slate-500 text-sm">No results found for "{query}"</div>
          ) : (
            <div className="py-2">
              {results.leads.length > 0 && (
                <>
                  <div className="px-4 py-1.5 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Leads</div>
                  {results.leads.map(l => (
                    <button key={l._id} onClick={() => goTo('/leads')}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left">
                      <div className="w-7 h-7 rounded-lg bg-[#a8ff3e]/10 flex items-center justify-center flex-shrink-0">
                        <Target size={13} className="text-[#a8ff3e]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-slate-200 text-sm font-medium truncate">{l.name}</div>
                        <div className="text-slate-500 text-xs truncate">{l.email} · {l.status}</div>
                      </div>
                    </button>
                  ))}
                </>
              )}
              {results.tickets.length > 0 && (
                <>
                  <div className="px-4 py-1.5 text-[10px] font-semibold text-slate-600 uppercase tracking-widest mt-1">Tickets</div>
                  {results.tickets.map(t => (
                    <button key={t._id} onClick={() => goTo(`/tickets/${t._id}`)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left">
                      <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                        <Ticket size={13} className="text-red-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-slate-200 text-sm font-medium truncate">{t.subject}</div>
                        <div className="text-slate-500 text-xs truncate">{t.ticketId} · {t.status}</div>
                      </div>
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2.5 border-t border-white/6 flex items-center gap-3 text-[11px] text-slate-600">
          <span><kbd className="px-1.5 py-0.5 rounded bg-white/8 text-slate-500 text-[10px]">ESC</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}

export default function Header({ toggleSidebar }) {
  const { pathname }         = useLocation();
  const navigate             = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const { notifications, markAsRead, clearAll } = useNotifications();
  const [showProfile, setShowProfile]       = useState(false);
  const [showNotif, setShowNotif]           = useState(false);
  const [showSearch, setShowSearch]         = useState(false);
  const profileRef = useRef(null);
  const notifRef   = useRef(null);

  const base = '/' + pathname.split('/')[1];
  const page = titles[base] || titles['/dashboard'];

  useEffect(() => {
    const h = e => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
      if (notifRef.current   && !notifRef.current.contains(e.target))   setShowNotif(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K for search
  useEffect(() => {
    const h = e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setShowSearch(true); }
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, []);

  const handleLogout = () => {
    navigate('/', { replace: true });
    setTimeout(() => {
      logout();
      toast.success('Logged out');
    }, 100);
  };

  const handleNotifClick = (n) => {
    setShowNotif(false);
    if (n.entityType === 'Ticket' && n.entityId) {
      navigate(`/tickets/${n.entityId}`);
    } else if (n.entityType === 'Lead') {
      navigate('/leads');
    } else if (n.entityType === 'User' && isAdmin) {
      navigate('/users');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const panelStyle = { background:'#111c14', border:'1px solid rgba(168,255,62,0.15)', borderRadius:'1rem' };

  return (
    <>
      <header className="h-16 flex items-center justify-between px-6 border-b border-white/6 flex-shrink-0 relative z-40" style={{background:'#0a1a0f'}}>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/8 hover:border-[#a8ff3e]/20 text-slate-400 hover:text-slate-200 transition-all"
          >
            <Menu size={16} />
          </button>
          <div>
            <h1 className="text-slate-100 font-semibold text-base leading-tight" style={{fontFamily:'Sora,sans-serif'}}>{page.title}</h1>
            <p className="text-slate-500 text-xs">{page.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Search */}
          <button
            onClick={() => setShowSearch(true)}
            className="hidden md:flex items-center gap-2 bg-white/5 border border-white/8 rounded-xl px-3 py-2 text-sm text-slate-500 w-52 cursor-pointer hover:border-[#a8ff3e]/20 hover:bg-white/8 transition-all"
          >
            <Search size={14}/><span>Quick search...</span>
            <span className="ml-auto text-[10px] text-slate-600 border border-white/10 rounded px-1">⌘K</span>
          </button>

          {/* Bell */}
          <div className="relative" ref={notifRef}>
            <button onClick={()=>{setShowNotif(!showNotif);setShowProfile(false);}}
              className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/8 hover:border-[#a8ff3e]/20 text-slate-500 hover:text-slate-200 transition-all">
              <Bell size={16}/>
              {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-slate-950 text-[10px] font-bold flex items-center justify-center" style={{background:'linear-gradient(135deg, #a8ff3e, #10b981)'}}>{unreadCount}</span>}
            </button>
            {showNotif && (
              <div className="absolute right-0 top-11 w-80 shadow-2xl overflow-hidden animate-slide-up" style={panelStyle}>
                <div className="absolute top-0 left-0 right-0 h-[1px]" style={{background: 'linear-gradient(90deg, transparent, #a8ff3e, #10b981, transparent)'}} />
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
                  <span className="text-slate-100 font-semibold text-sm" style={{fontFamily:'Sora,sans-serif'}}>Notifications</span>
                  <button onClick={clearAll} className="text-xs text-[#a8ff3e] hover:text-[#a8ff3e]/80 font-medium bg-transparent border-none outline-none">Mark all read</button>
                </div>
                <div className="max-h-80 overflow-y-auto scrollbar-thin">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 text-sm">No notifications yet</div>
                  ) : notifications.slice(0,10).map((n) => {
                    const Icon = n.entityType === 'Ticket' ? Ticket : Target;
                    const iconColor = n.entityType === 'Ticket' ? 'text-red-400' : 'text-[#a8ff3e]';
                    const iconBg = n.entityType === 'Ticket' ? 'bg-red-500/10' : 'bg-[#a8ff3e]/10';
                    return (
                      <div key={n.id} onClick={() => { handleNotifClick(n); markAsRead(n.id); }} className={`flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer border-b border-white/4 last:border-0 ${!n.read ? 'bg-white/[0.02]' : ''}`}>
                        <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}><Icon size={14} className={iconColor}/></div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-slate-300 text-xs leading-relaxed ${!n.read ? 'font-medium text-slate-100' : ''}`}>{n.message}</p>
                          <p className="text-slate-600 text-xs mt-0.5">{formatDistanceToNow(new Date(n.createdAt),{addSuffix:true})}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button onClick={()=>{setShowProfile(!showProfile);setShowNotif(false);}}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-white/5 transition-all">
              <Avatar name={user?.name} avatar={user?.avatar} size={32} className="rounded-xl" />
              <div className="hidden md:block text-left">
                <div className="text-slate-200 text-xs font-medium leading-tight">{user?.name?.split(' ')[0]}</div>
                <div className="text-slate-500 text-[10px] capitalize">{user?.role}</div>
              </div>
              <ChevronDown size={14} className={`text-slate-500 transition-transform ${showProfile?'rotate-180':''}`}/>
            </button>
            {showProfile && (
              <div className="absolute right-0 top-11 w-64 shadow-2xl overflow-hidden animate-slide-up" style={panelStyle}>
                <div className="absolute top-0 left-0 right-0 h-[1px]" style={{background: 'linear-gradient(90deg, transparent, #a8ff3e, #10b981, transparent)'}} />
                {/* User Info */}
                <div className="px-4 py-4 border-b border-white/8">
                  <div className="flex items-center gap-3">
                    <Avatar name={user?.name} avatar={user?.avatar} size={40} className="rounded-xl" />
                    <div>
                      <div className="text-slate-100 font-semibold text-sm">{user?.name}</div>
                      <div className="text-slate-500 text-xs truncate max-w-[150px]">{user?.email}</div>
                      <div className="flex items-center gap-1 mt-0.5"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"/><span className="text-emerald-400 text-[10px] capitalize">{user?.role} · Online</span></div>
                    </div>
                  </div>
                  {user?.affiliateCode && (
                    <div className="mt-3 px-3 py-1.5 rounded-lg" style={{background:'rgba(168,255,62,0.08)', border:'1px solid rgba(168,255,62,0.15)'}}>
                      <span className="text-slate-500 text-[10px]">Affiliate Code: </span>
                      <span className="text-[#a8ff3e] text-xs font-mono font-semibold">{user.affiliateCode}</span>
                    </div>
                  )}
                </div>
                {/* Menu */}
                <div className="p-2">
                  <button onClick={()=>{setShowProfile(false);navigate('/settings');}} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all text-sm"><User size={15}/><span>Edit Profile</span></button>
                  <button onClick={()=>{setShowProfile(false);navigate('/settings');}} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all text-sm"><Settings size={15}/><span>Settings</span></button>
                  <div className="border-t border-white/6 my-1"/>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm"><LogOut size={15}/><span>Logout</span></button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Quick Search Modal */}
      {showSearch && <QuickSearchModal onClose={() => setShowSearch(false)} />}
    </>
  );
}
