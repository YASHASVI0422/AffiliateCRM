import React from 'react';
import { X, AlertCircle, Check } from 'lucide-react';

const badgeMap = {
  'New Lead':     'bg-slate-500/15 text-slate-300 border border-slate-500/25',
  'Contacted':    'bg-sky-500/15 text-sky-300 border border-sky-500/25',
  'Interested':   'bg-amber-500/15 text-amber-300 border border-amber-500/25',
  'Joined Community':'bg-violet-500/15 text-violet-300 border border-violet-500/25',
  'Converted':    'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25',
  'Open':         'bg-red-500/15 text-red-300 border border-red-500/25',
  'In Progress':  'bg-amber-500/15 text-amber-300 border border-amber-500/25',
  'Resolved':     'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25',
  'Closed':       'bg-slate-500/15 text-slate-300 border border-slate-500/25',
  'Low':          'bg-slate-500/15 text-slate-300 border border-slate-500/25',
  'Medium':       'bg-amber-500/15 text-amber-300 border border-amber-500/25',
  'High':         'bg-red-500/15 text-red-300 border border-red-500/25',
  'admin':        'bg-cyan-500/15 text-cyan-300 border border-cyan-500/25',
  'affiliate':    'bg-violet-500/15 text-violet-300 border border-violet-500/25',
  'Technical':    'bg-sky-500/15 text-sky-300 border border-sky-500/25',
  'Billing':      'bg-orange-500/15 text-orange-300 border border-orange-500/25',
  'General':      'bg-slate-500/15 text-slate-300 border border-slate-500/25',
  'Feature Request':'bg-teal-500/15 text-teal-300 border border-teal-500/25',
  'Bug Report':   'bg-red-500/15 text-red-300 border border-red-500/25',
};

const badgeDot = {
  'New Lead': 'bg-slate-400', 'Contacted': 'bg-sky-400', 'Interested': 'bg-amber-400',
  'Joined Community': 'bg-violet-400', 'Converted': 'bg-emerald-400',
  'Open': 'bg-red-400', 'In Progress': 'bg-amber-400', 'Resolved': 'bg-emerald-400', 'Closed': 'bg-slate-400',
  'Low': 'bg-slate-400', 'Medium': 'bg-amber-400', 'High': 'bg-red-400',
  'admin': 'bg-cyan-400', 'affiliate': 'bg-violet-400',
};

export const Badge = ({ label }) => (
  <span className={`badge ${badgeMap[label]||'bg-white/10 text-slate-400 border border-white/10'}`}>
    <span className={`w-1.5 h-1.5 rounded-full animate-pulse-glow ${badgeDot[label]||'bg-slate-500'}`} />
    {label}
  </span>
);

export const Spinner = ({ size=6 }) => (
  <div className="flex items-center justify-center">
    <div className={`w-${size} h-${size} border-2 border-cyan-500 border-t-transparent rounded-full animate-spin`}/>
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
          background: 'rgb(10 14 24)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '1rem',
        }}
        onClick={e=>e.stopPropagation()}
      >
        {/* Gradient top border accent */}
        <div className="absolute top-0 left-0 right-0 h-[1px]" style={{background: 'linear-gradient(90deg, transparent, #06b6d4, #8b5cf6, transparent)'}} />
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
    cyan:    { from: '#06b6d4', to: '#0891b2', text: 'text-cyan-400',    border: 'border-cyan-500/15' },
    emerald: { from: '#10b981', to: '#059669', text: 'text-emerald-400', border: 'border-emerald-500/15' },
    amber:   { from: '#f59e0b', to: '#d97706', text: 'text-amber-400',   border: 'border-amber-500/15' },
    violet:  { from: '#8b5cf6', to: '#7c3aed', text: 'text-violet-400',  border: 'border-violet-500/15' },
    purple:  { from: '#a855f7', to: '#9333ea', text: 'text-purple-400',  border: 'border-purple-500/15' },
    indigo:  { from: '#06b6d4', to: '#0891b2', text: 'text-cyan-400',    border: 'border-cyan-500/15' },
    red:     { from: '#f87171', to: '#ef4444', text: 'text-red-400',     border: 'border-red-500/15' },
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
      <button onClick={()=>onPage(page-1)} disabled={page===1} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 text-slate-400 hover:text-white disabled:opacity-30 text-sm transition-all hover:border-cyan-500/20">← Prev</button>
      {Array.from({length:pages},(_,i)=>i+1).map(p=>(
        <button
          key={p}
          onClick={()=>onPage(p)}
          className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
            p===page
              ? 'text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
              : 'bg-white/5 text-slate-500 hover:bg-white/10 border border-white/8 hover:border-cyan-500/20'
          }`}
          style={p===page ? {background:'linear-gradient(135deg, #06b6d4, #8b5cf6)'} : {}}
        >{p}</button>
      ))}
      <button onClick={()=>onPage(page+1)} disabled={page===pages} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 text-slate-400 hover:text-white disabled:opacity-30 text-sm transition-all hover:border-cyan-500/20">Next →</button>
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
