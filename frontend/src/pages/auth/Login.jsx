import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm]   = useState({ email:'', password:'' });
  const [show, setShow]   = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const submit = async e => {
    e.preventDefault();
    if (!form.email||!form.password) return toast.error('Please fill all fields');
    setLoading(true);
    try { await login(form.email, form.password); navigate('/dashboard'); }
    catch(err) { toast.error(err.response?.data?.message||'Login failed'); }
    finally { setLoading(false); }
  };

  const fill = role => role==='admin'
    ? setForm({ email:'ypandey865@gmail.com', password:'Y@sh0422' })
    : setForm({ email:'sarah@affiliatecrm.com', password:'affiliate123' });

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 relative overflow-hidden bg-[#06090f]">
      {/* Dynamic Animated background blobs */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full opacity-[0.15] blur-[120px] animate-float"
          style={{background:'radial-gradient(circle, #06b6d4 0%, #8b5cf6 70%)'}} />
        <div className="absolute -bottom-[20%] -right-[10%] w-[550px] h-[550px] rounded-full opacity-[0.12] blur-[110px] animate-float"
          style={{background:'radial-gradient(circle, #8b5cf6 0%, #ec4899 70%)', animationDelay:'-7s'}} />
        <div className="absolute top-[40%] left-[20%] w-[350px] h-[350px] rounded-full opacity-[0.07] blur-[90px] animate-float"
          style={{background:'radial-gradient(circle, #06b6d4 0%, transparent 70%)', animationDelay:'-13s'}} />
      </div>

      {/* Grid Pattern overlay for tech feel */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.007)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.007)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Centered Premium Glassmorphic Card Container */}
      <div className="relative w-full max-w-4xl min-h-[580px] rounded-3xl border border-white/[0.08] backdrop-blur-2xl bg-slate-950/40 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_50px_rgba(6,182,212,0.02)] flex flex-col md:flex-row overflow-hidden animate-slide-up z-10">
        
        {/* Left Side: Brand Panel */}
        <div className="w-full md:w-[42%] p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/[0.06] flex flex-col justify-between relative bg-gradient-to-br from-indigo-950/20 to-slate-900/30">
          {/* Subtle absolute decorative glow inside Left Side */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              <img src={logo} alt="Logo" className="w-6 h-6 object-contain" />
            </div>
            <span className="text-slate-100 font-bold text-lg tracking-wide" style={{fontFamily:'Sora,sans-serif'}}>AffiliateCRM</span>
          </div>

          <div className="my-8 md:my-0 relative z-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 leading-tight mb-4 tracking-tight" style={{fontFamily:'Sora,sans-serif'}}>
              Scale your<br/>
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">partner network</span><br/>
              with intelligence.
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              An all-in-one workspace designed to manage pipelines, resolve tickets, and drive performance using predictive Gemini AI insights.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 relative z-10">
            {[
              ['Active', 'Real-time', 'border-cyan-500/10 hover:border-cyan-500/20'],
              ['99.9%', 'Uptime SLA', 'border-indigo-500/10 hover:border-indigo-500/20'],
              ['Gemini', 'AI-Powered', 'border-violet-500/10 hover:border-violet-500/20']
            ].map(([v, l, borderClr]) => (
              <div key={l} className={`bg-white/[0.02] border ${borderClr} rounded-2xl p-3 text-center transition-all duration-300 hover:bg-white/[0.04]`}>
                <div className="text-sm md:text-base font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">{v}</div>
                <div className="text-[9px] text-slate-500 font-medium tracking-wide uppercase mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center bg-slate-950/20">
          <div className="w-full max-w-sm mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight mb-2" style={{fontFamily:'Sora,sans-serif'}}>
                Welcome back
              </h2>
              <p className="text-slate-400 text-sm">Sign in to your account to continue</p>
            </div>

            <div className="flex gap-3 mb-6">
              <button 
                type="button"
                onClick={() => fill('admin')} 
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 hover:border-cyan-500/30 text-cyan-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.1)] active:scale-[0.98]"
              >
                Demo Admin
              </button>
              <button 
                type="button"
                onClick={() => fill('affiliate')} 
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 hover:border-violet-500/30 text-violet-300 hover:shadow-[0_0_15px_rgba(139,92,246,0.1)] active:scale-[0.98]"
              >
                Demo Affiliate
              </button>
            </div>

            <form onSubmit={submit} className="space-y-4">
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
                    placeholder="••••••••" 
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

              <button 
                type="submit" 
                disabled={loading} 
                className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-sm font-semibold mt-6 tracking-wide shadow-lg"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-slate-500 text-sm">
              No account?{' '}
              <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                Create one free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
