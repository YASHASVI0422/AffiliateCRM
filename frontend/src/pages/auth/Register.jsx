import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm]   = useState({ name:'', email:'', password:'', confirm:'' });
  const [show, setShow]   = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    if (!form.name||!form.email||!form.password) return toast.error('Fill all fields');
    if (form.password.length < 6) return toast.error('Password min 6 chars');
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    setLoading(true);
    try { await register(form.name, form.email, form.password); navigate('/dashboard'); }
    catch(err) { toast.error(err.response?.data?.message||'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 relative overflow-hidden bg-[#06090f]">
      {/* Dynamic Animated background blobs */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full opacity-[0.15] blur-[120px] animate-float"
          style={{background:'radial-gradient(circle, #06b6d4 0%, #8b5cf6 70%)'}} />
        <div className="absolute -bottom-[20%] -left-[10%] w-[550px] h-[550px] rounded-full opacity-[0.12] blur-[110px] animate-float"
          style={{background:'radial-gradient(circle, #8b5cf6 0%, #ec4899 70%)', animationDelay:'-7s'}} />
      </div>

      {/* Grid Pattern overlay for tech feel */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.007)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.007)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Centered Premium Glassmorphic Card Container */}
      <div className="relative w-full max-w-md rounded-3xl border border-white/[0.08] backdrop-blur-2xl bg-slate-950/40 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_50px_rgba(6,182,212,0.02)] p-8 md:p-10 flex flex-col justify-center overflow-hidden animate-slide-up z-10">
        
        {/* Subtle absolute decorative glow inside Card */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 justify-center mb-8 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <img src={logo} alt="Logo" className="w-5.5 h-5.5 object-contain" />
          </div>
          <span className="text-slate-100 font-bold text-base tracking-wide" style={{fontFamily:'Sora,sans-serif'}}>AffiliateCRM</span>
        </div>

        <div className="mb-6 text-center">
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight mb-1" style={{fontFamily:'Sora,sans-serif'}}>
            Create account
          </h2>
          <p className="text-slate-400 text-sm">Join and manage your affiliate pipeline</p>
        </div>

        <form onSubmit={submit} className="space-y-4 relative z-10">
          <div>
            <label className="label">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
              <input 
                type="text" 
                className="input pl-11 bg-white/[0.02] border-white/[0.08] focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10 text-sm" 
                placeholder="John Doe" 
                value={form.name} 
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))} 
              />
            </div>
          </div>

          <div>
            <label className="label">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
              <input 
                type="email" 
                className="input pl-11 bg-white/[0.02] border-white/[0.08] focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10 text-sm" 
                placeholder="you@company.com" 
                value={form.email} 
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))} 
              />
            </div>
          </div>

          <div>
            <label className="label">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
              <input 
                type={show ? 'text' : 'password'} 
                className="input pl-11 pr-11 bg-white/[0.02] border-white/[0.08] focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10 text-sm" 
                placeholder="Min 6 characters" 
                value={form.password} 
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))} 
              />
              <button 
                type="button" 
                onClick={() => setShow(!show)} 
                className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="label">Confirm Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
              <input 
                type={show ? 'text' : 'password'} 
                className="input pl-11 bg-white/[0.02] border-white/[0.08] focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10 text-sm" 
                placeholder="Repeat password" 
                value={form.confirm} 
                onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))} 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-sm font-semibold mt-6 tracking-wide shadow-lg"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Create account</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-500 text-sm relative z-10">
          Already have account?{' '}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
