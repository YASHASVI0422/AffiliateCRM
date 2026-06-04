import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center" style={{ backgroundColor: 'rgb(6 9 15)' }}>
      <h1 className="text-8xl font-black text-cyan-500" style={{ fontFamily: 'Sora, sans-serif' }}>
        404
      </h1>
      <h2 className="text-slate-100 font-semibold text-xl mt-4" style={{ fontFamily: 'Sora, sans-serif' }}>
        Page not found
      </h2>
      <p className="text-slate-500 text-sm mt-2 max-w-xs leading-relaxed">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <button
        onClick={() => navigate('/dashboard')}
        className="btn-primary mt-6 flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all"
        style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', border: 'none', color: '#fff' }}
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>
    </div>
  );
}
