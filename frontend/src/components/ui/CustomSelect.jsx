import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({ value, onChange, options, placeholder='Select...', className='' }) {
  const [open, setOpen] = useState(false);
  const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 0 });
  const [focusIdx, setFocusIdx] = useState(-1);
  const ref = useRef(null);
  const portalRef = useRef(null);

  // Click-outside detection: check BOTH the trigger ref AND the portal ref
  useEffect(() => {
    const handleClickOutside = e => {
      const clickedInsideTrigger = ref.current && ref.current.contains(e.target);
      const clickedInsidePortal = portalRef.current && portalRef.current.contains(e.target);
      if (!clickedInsideTrigger && !clickedInsidePortal) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allOptions = placeholder
    ? [{ value: '', label: placeholder, isPlaceholder: true }, ...options.map(o => typeof o === 'string' ? { value: o, label: o } : o)]
    : options.map(o => typeof o === 'string' ? { value: o, label: o } : o);

  const toggleOpen = () => {
    if (!open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setDropPos({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
      setFocusIdx(-1);
    }
    setOpen(o => !o);
  };

  const selectOption = useCallback((v) => {
    onChange(v);
    setOpen(false);
  }, [onChange]);

  const handleKeyDown = (e) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        toggleOpen();
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusIdx(i => Math.min(i + 1, allOptions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusIdx(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (focusIdx >= 0 && focusIdx < allOptions.length) {
          selectOption(allOptions[focusIdx].value);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        break;
      default:
        break;
    }
  };

  const getLabel = v => {
    const o = options.find(x => (x.value ?? x) === v);
    return o ? (o.label ?? o) : null;
  };

  const dropdown = open ? createPortal(
    <div
      ref={portalRef}
      style={{
        position: 'absolute',
        top: dropPos.top,
        left: dropPos.left,
        width: dropPos.width,
        zIndex: 9999,
        background: 'rgb(8 12 20)',
        border: '1px solid rgba(6,182,212,0.15)',
        borderRadius: '0.75rem',
        boxShadow: '0 25px 50px rgba(0,0,0,0.6), 0 0 15px rgba(6,182,212,0.05)',
        overflow: 'hidden',
        animation: 'slide-up 0.15s ease-out',
      }}
    >
      <div className="max-h-52 overflow-y-auto scrollbar-thin py-1">
        {allOptions.map((opt, i) => {
          const sel = opt.value === value || (opt.isPlaceholder && !value);
          const focused = i === focusIdx;
          return (
            <button
              key={i}
              onClick={() => selectOption(opt.value)}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors outline-none ${
                focused ? 'bg-cyan-500/10' : ''
              } ${
                opt.isPlaceholder
                  ? 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
                  : sel
                    ? 'text-cyan-300 bg-cyan-500/10'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>{opt.label}</span>
              {sel && <Check size={13} className="text-cyan-400" />}
            </button>
          );
        })}
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={toggleOpen}
        onKeyDown={handleKeyDown}
        className="w-full flex items-center justify-between gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm hover:border-cyan-500/30 focus:border-cyan-500/50 focus:shadow-[0_0_0_3px_rgba(6,182,212,0.1)] transition-all outline-none"
      >
        <span className={value ? 'text-slate-200' : 'text-slate-500'}>{getLabel(value) || placeholder}</span>
        <ChevronDown size={14} className={`text-slate-500 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {dropdown}
    </div>
  );
}
