import React, { useState } from 'react';
import { User, Mail, Phone, FileText, Lock, Save, Shield, Copy, Check } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../../components/ui/Avatar';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({ name:user?.name||'', phone:user?.phone||'', bio:user?.bio||'', avatar:user?.avatar||'' });
  const [pw, setPw]           = useState({ current:'', newPw:'', confirm:'' });
  const [savP, setSavP]       = useState(false);
  const [savPw, setSavPw]     = useState(false);
  const [copied, setCopied]   = useState(false);

  const saveProfile = async () => {
    setSavP(true);
    try { const {data}=await api.put('/users/profile',profile); updateUser(data.user); toast.success('Profile updated'); }
    catch(e) { toast.error(e.response?.data?.message||'Failed'); }
    finally { setSavP(false); }
  };

  const savePassword = async () => {
    if (pw.newPw!==pw.confirm) return toast.error('Passwords do not match');
    if (pw.newPw.length<6) return toast.error('Password must be at least 6 characters');
    setSavPw(true);
    try { await api.put('/auth/password',{ currentPassword:pw.current, newPassword:pw.newPw }); toast.success('Password updated'); setPw({ current:'',newPw:'',confirm:'' }); }
    catch(e) { toast.error(e.response?.data?.message||'Failed'); }
    finally { setSavPw(false); }
  };

  const copy = () => { navigator.clipboard.writeText(user?.affiliateCode||''); setCopied(true); setTimeout(()=>setCopied(false),2000); toast.success('Copied!'); };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div><h1 className="page-title">Settings</h1><p className="text-slate-500 text-sm mt-0.5">Manage your account and preferences</p></div>

      {/* Profile */}
      <div className="card p-6 relative overflow-hidden">
        {/* Gradient top accent */}
        <div className="absolute top-0 left-0 right-0 h-[1px]" style={{background: 'linear-gradient(90deg, transparent, #a8ff3e, #10b981, transparent)'}} />
        <h2 className="section-title mb-5 flex items-center gap-2"><User size={18} className="text-[#a8ff3e]"/>Profile Information</h2>
        <div className="flex items-center gap-4 mb-6">
          <Avatar name={profile.name} avatar={profile.avatar} size={64} className="rounded-2xl border border-white/10 shadow-lg" />
          <div>
            <div className="text-slate-100 font-semibold">{user?.name}</div>
            <div className="text-slate-500 text-sm">{user?.email}</div>
            <div className="flex items-center gap-1.5 mt-1"><Shield size={12} className="text-[#a8ff3e]"/><span className="text-[#a8ff3e] text-xs capitalize">{user?.role}</span></div>
          </div>
        </div>

        {/* 30 Avatar Grid */}
        <div className="mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/6">
          <label className="label mb-2 flex items-center justify-between">
            <span>Choose Your Avatar</span>
            <span className="text-[10px] text-slate-500 font-medium">30 Presets Available</span>
          </label>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5 max-h-44 overflow-y-auto scrollbar-thin pr-1">
            {Array.from({ length: 30 }, (_, i) => {
              const seed = `avatar_${i + 1}`;
              const active = profile.avatar === seed;
              return (
                <button
                  key={seed}
                  type="button"
                  onClick={() => setProfile(p => ({ ...p, avatar: seed }))}
                  className={`relative p-0.5 rounded-xl transition-all duration-200 outline-none hover:scale-110 flex-shrink-0 ${
                    active 
                      ? 'ring-2 ring-[#a8ff3e] shadow-[0_0_12px_rgba(168,255,62,0.3)] bg-[#a8ff3e]/10' 
                      : 'opacity-60 hover:opacity-100 bg-white/5 border border-white/5'
                  }`}
                >
                  <Avatar avatar={seed} size={40} className="rounded-lg" />
                </button>
              );
            })}
          </div>
        </div>
        <div className="space-y-4">
          {[['name','Full Name',User],['phone','Phone',Phone]].map(([k,l,Icon])=>(
            <div key={k}>
              <label className="label">{l}</label>
              <div className="relative"><Icon size={15} className="absolute left-3.5 top-3 text-slate-500"/>
                <input className="input pl-10" placeholder={l} value={profile[k]} onChange={e=>setProfile(p=>({...p,[k]:e.target.value}))}/>
              </div>
            </div>
          ))}
          <div>
            <label className="label">Email</label>
            <div className="relative"><Mail size={15} className="absolute left-3.5 top-3 text-slate-500"/>
              <input className="input pl-10 opacity-50 cursor-not-allowed" value={user?.email} disabled/>
            </div>
            <p className="text-slate-600 text-xs mt-1">Email cannot be changed</p>
          </div>
          <div>
            <label className="label">Bio</label>
            <div className="relative"><FileText size={15} className="absolute left-3.5 top-3 text-slate-500"/>
              <textarea className="input pl-10 resize-none" rows={3} placeholder="Tell us about yourself..." value={profile.bio} onChange={e=>setProfile(p=>({...p,bio:e.target.value}))}/>
            </div>
          </div>
          <button onClick={saveProfile} disabled={savP} className="btn-primary flex items-center gap-2 text-sm">
            {savP?<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>:<Save size={15}/>}Save Profile
          </button>
        </div>
      </div>

      {/* Affiliate Code */}
      {user?.affiliateCode && (
        <div className="card p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px]" style={{background: 'linear-gradient(90deg, transparent, #a8ff3e, #10b981, transparent)'}} />
          <h2 className="section-title mb-3 flex items-center gap-2"><Shield size={18} className="text-[#a8ff3e]"/>Affiliate Details</h2>
          <div className="flex items-center gap-3 p-4 rounded-xl" style={{background:'rgba(168,255,62,0.06)', border:'1px solid rgba(168,255,62,0.15)'}}>
            <div className="flex-1"><div className="text-slate-500 text-xs mb-1">Your Affiliate Code</div><div className="font-mono text-lg font-bold tracking-wider gradient-text">{user.affiliateCode}</div></div>
            <button onClick={copy} className="w-9 h-9 flex items-center justify-center rounded-xl transition-all" style={{background:'rgba(168,255,62,0.1)', color:'#a8ff3e'}}>{copied?<Check size={16}/>:<Copy size={16}/>}</button>
          </div>
          <p className="text-slate-600 text-xs mt-2">Share this code to track your referrals</p>
        </div>
      )}

      {/* Password */}
      <div className="card p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px]" style={{background: 'linear-gradient(90deg, transparent, #a8ff3e, #10b981, transparent)'}} />
        <h2 className="section-title mb-5 flex items-center gap-2"><Lock size={18} className="text-[#a8ff3e]"/>Change Password</h2>
        <div className="space-y-4">
          {[['current','Current Password'],['newPw','New Password'],['confirm','Confirm Password']].map(([k,l])=>(
            <div key={k}>
              <label className="label">{l}</label>
              <div className="relative"><Lock size={15} className="absolute left-3.5 top-3 text-slate-500"/>
                <input type="password" className="input pl-10" placeholder="••••••••" value={pw[k]} onChange={e=>setPw(p=>({...p,[k]:e.target.value}))}/>
              </div>
            </div>
          ))}
          <button onClick={savePassword} disabled={savPw} className="btn-primary flex items-center gap-2 text-sm">
            {savPw?<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>:<Lock size={15}/>}Update Password
          </button>
        </div>
      </div>

      {/* Account Info */}
      <div className="card p-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px]" style={{background: 'linear-gradient(90deg, transparent, #a8ff3e, #10b981, transparent)'}} />
        <h2 className="section-title mb-3">Account Details</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {[
            ['Member since', new Date(user?.createdAt).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})],
            ['Account type', user?.role?.charAt(0).toUpperCase()+user?.role?.slice(1)],
            ['Status', 'Active'],
            ['User ID', user?._id?.slice(-8).toUpperCase()],
          ].map(([l,v])=>(
            <div key={l} className="p-3 rounded-xl bg-white/[0.03]">
              <div className="text-slate-600 text-xs mb-0.5">{l}</div>
              <div className="text-slate-300 font-medium">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
