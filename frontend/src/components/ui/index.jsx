import React from 'react';
import { X, AlertCircle, Check } from 'lucide-react';

const badgeMap = {
  'New Lead':     'bg-[#1b3a24]/30 text-slate-400 border border-white/5',
  'Contacted':    'bg-[#2e5b37]/35 text-[#a8ff3e]/75 border border-[#a8ff3e]/15',
  'Interested':   'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25',
  'Joined Community':'bg-[#8ee62c]/15 text-[#8ee62c] border border-[#8ee62c]/20',
  'Converted':    'bg-[#a8ff3e]/20 text-[#a8ff3e] border border-[#a8ff3e]/30',
  'Open':         'bg-red-500/15 text-red-300 border border-red-500/25',
  'In Progress':  'bg-[#a8ff3e]/15 text-[#a8ff3e] border border-[#a8ff3e]/25',
  'Resolved':     'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25',
  'Closed':       'bg-slate-500/15 text-slate-300 border border-slate-500/25',
  'Low':          'bg-[#1b3a24]/30 text-slate-400 border border-white/5',
  'Medium':       'bg-[#a8ff3e]/15 text-[#a8ff3e] border border-[#a8ff3e]/25',
  'High':         'bg-red-500/15 text-red-300 border border-red-500/25',
  'admin':        'bg-[#a8ff3e]/15 text-[#a8ff3e] border border-[#a8ff3e]/25',
  'affiliate':    'bg-[#8ee62c]/15 text-[#8ee62c] border border-[#8ee62c]/25',
  'Technical':    'bg-[#2e5b37]/35 text-[#a8ff3e]/75 border border-[#a8ff3e]/15',
  'Billing':      'bg-red-500/15 text-red-300 border border-red-500/25',
  'General':      'bg-[#1b3a24]/30 text-slate-400 border border-white/5',
  'Feature Request':'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25',
  'Bug Report':   'bg-red-500/15 text-red-300 border border-red-500/25',
};

const badgeDot = {
  'New Lead': 'bg-slate-500', 'Contacted': 'bg-[#a8ff3e]/70', 'Interested': 'bg-emerald-400',
  'Joined Community': 'bg-[#8ee62c]', 'Converted': 'bg-[#a8ff3e]',
  'Open': 'bg-red-400', 'In Progress': 'bg-[#a8ff3e]', 'Resolved': 'bg-emerald-400', 'Closed': 'bg-slate-500',
  'Low': 'bg-slate-500', 'Medium': 'bg-[#a8ff3e]', 'High': 'bg-red-400',
  'admin': 'bg-[#a8ff3e]', 'affiliate': 'bg-[#8ee62c]',
};

export const Badge = ({ label }) => (
  <span className={`badge ${badgeMap[label]||'bg-white/10 text-slate-400 border border-white/10'}`}>
    <span className={`w-1.5 h-1.5 rounded-full animate-pulse-glow ${badgeDot[label]||'bg-slate-500'}`} />
    {label}
  </span>
);

export const Spinner = ({ size=6 }) => (
  <div className="flex items-center justify-center">
    <div className={`w-${size} h-${size} border-2 border-[#a8ff3e] border-t-transparent rounded-full animate-spin`}/>
  </div>
);

export const Modal = ({ isOpen, onClose, title, children, size='md' }) => {
  if (!isOpen) return null;
  const sizes = { sm:'max-w-md', md:'max-w-lg', lg:'max-w-2xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md"/>
      <div
        className={`relative w-full ${sizes[size]} shadow-2xl animate-slide-up overflow-hidden`}
        style={{
          background: '#111c14',
          border: '1px solid rgba(168,255,62,0.15)',
          borderRadius: '1rem',
        }}
        onClick={e=>e.stopPropagation()}
      >
        {/* Gradient top border accent */}
        <div className="absolute top-0 left-0 right-0 h-[1px]" style={{background: 'linear-gradient(90deg, transparent, #a8ff3e, #10b981, transparent)'}} />
        <div className="flex items-center justify-between p-5 border-b border-white/8">
          <h3 className="text-slate-100 font-semibold" style={{fontFamily:'Sora,sans-serif'}}>{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/10 transition-all"><X size={16}/></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

export const StatCard = ({ icon:Icon, label, value, color='cyan', loading }) => {
  const gradients = {
    cyan:    { from: '#a8ff3e', to: '#10b981', text: 'text-[#a8ff3e]',    border: 'border-[#a8ff3e]/15' },
    emerald: { from: '#10b981', to: '#059669', text: 'text-emerald-400', border: 'border-emerald-500/15' },
    amber:   { from: '#8ee62c', to: '#1b3a24', text: 'text-[#8ee62c]',   border: 'border-[#8ee62c]/15' },
    violet:  { from: '#7fff00', to: '#10b981', text: 'text-[#7fff00]',  border: 'border-[#7fff00]/15' },
    purple:  { from: '#a8ff3e', to: '#8ee62c', text: 'text-[#a8ff3e]',  border: 'border-[#a8ff3e]/15' },
    indigo:  { from: '#a8ff3e', to: '#10b981', text: 'text-[#a8ff3e]',  border: 'border-[#a8ff3e]/15' },
    red:     { from: '#ff6b6b', to: '#ef4444', text: 'text-red-400',     border: 'border-red-500/15' },
  };
  const c = gradients[color] || gradients.cyan;
  return (
    <div className={`stat-card border ${c.border}`}>
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${c.from}20, ${c.to}10)` }}
      >
        <Icon size={20} className={c.text}/>
      </div>
      {loading
        ? <div className="h-8 bg-white/5 rounded-lg animate-pulse"/>
        : <div>
            <div className="text-2xl font-bold text-slate-100" style={{fontFamily:'Sora,sans-serif'}}>{value}</div>
            <div className="text-slate-400 text-sm">{label}</div>
          </div>
      }
    </div>
  );
};

export const EmptyState = ({ icon:Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center mb-4">
      <Icon size={24} className="text-slate-600"/>
    </div>
    <div className="text-slate-300 font-medium mb-1">{title}</div>
    <div className="text-slate-500 text-sm mb-4 max-w-xs">{description}</div>
    {action}
  </div>
);

export const Pagination = ({ page, pages, onPage }) => {
  if (pages<=1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button onClick={()=>onPage(page-1)} disabled={page===1} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 text-slate-400 hover:text-white disabled:opacity-30 text-sm transition-all hover:border-[#a8ff3e]/20">← Prev</button>
      {Array.from({length:pages},(_,i)=>i+1).map(p=>(
        <button
          key={p}
          onClick={()=>onPage(p)}
          className={`w-8 h-8 rounded-lg text-sm font-semibold transition-all ${
            p===page
              ? 'text-slate-950 shadow-[0_0_15px_rgba(168,255,62,0.3)]'
              : 'bg-white/5 text-slate-500 hover:bg-white/10 border border-white/8 hover:border-[#a8ff3e]/20'
          }`}
          style={p===page ? {background:'linear-gradient(135deg, #a8ff3e, #10b981)'} : {}}
        >{p}</button>
      ))}
      <button onClick={()=>onPage(page+1)} disabled={page===pages} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 text-slate-400 hover:text-white disabled:opacity-30 text-sm transition-all hover:border-[#a8ff3e]/20">Next →</button>
    </div>
  );
};

export const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmLabel='Confirm', danger=false }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
    <div className="flex gap-3 mb-5"><AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5"/><p className="text-slate-400 text-sm">{message}</p></div>
    <div className="flex gap-3 justify-end">
      <button onClick={onClose} className="btn-secondary text-sm">Cancel</button>
      <button onClick={()=>{ onConfirm(); onClose(); }} className={danger?'btn-danger text-sm':'btn-primary text-sm'}>{confirmLabel}</button>
    </div>
  </Modal>
);

export { default as SkeletonLoader } from './SkeletonLoader';
