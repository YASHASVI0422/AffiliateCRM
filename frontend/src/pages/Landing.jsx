import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Brain, 
  TrendingUp, 
  LifeBuoy, 
  ShieldCheck, 
  Users, 
  Zap, 
  CheckCircle2, 
  Sparkles, 
  Star,
  ChevronRight,
  MessageSquare,
  BarChart3,
  Play,
  ArrowUpRight,
  Check,
  Code,
  Layers,
  Sparkle,
  X,
  Key
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

export default function Landing() {
  const { user } = useAuth();
  const [showAuthChoice, setShowAuthChoice] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Interactive Sandbox state
  const [selectedDemoLead, setSelectedDemoLead] = useState(0);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [mockAiOutput, setMockAiOutput] = useState({
    score: 94,
    sentiment: 'High Intent',
    summary: 'Strong partner fit. Existing relationship with adjacent brands suggests high retention and fast setup.',
    action: 'Approve customized commission rate (15%) to lock in partner.'
  });

  const demoLeads = [
    {
      name: 'Jordan Blake',
      company: 'TechVentures',
      source: 'Referral',
      value: '$1,200',
      status: 'Converted',
      aiData: {
        score: 94,
        sentiment: 'High Intent',
        summary: 'Strong partner fit. Existing relationship with adjacent brands suggests high retention and fast setup.',
        action: 'Approve customized commission rate (15%) to lock in partner.'
      }
    },
    {
      name: 'Emma Davis',
      company: 'StartupCo',
      source: 'Website',
      value: '$800',
      status: 'Interested',
      aiData: {
        score: 76,
        sentiment: 'Curious / Exploring',
        summary: 'Actively researching CRM alternatives. Downloaded pricing sheet but has not booked a call.',
        action: 'Trigger automatic drip sequence focusing on ROI metrics.'
      }
    },
    {
      name: 'Noah Martinez',
      company: 'CloudScale',
      source: 'Cold Call',
      value: '$0',
      status: 'New Lead',
      aiData: {
        score: 41,
        sentiment: 'Low Engagement',
        summary: 'Cold outreach recipient. No interaction with email attachments. Decision maker is currently out of office.',
        action: 'Set follow-up reminder for 7 days. Do not prioritize for manual calls.'
      }
    }
  ];

  const handleSelectLead = (index) => {
    setIsAiLoading(true);
    setSelectedDemoLead(index);
    setTimeout(() => {
      setMockAiOutput(demoLeads[index].aiData);
      setIsAiLoading(false);
    }, 600);
  };

  // Mock template generation states for Bento grid
  const [typingText, setTypingText] = useState('');
  const [activeTemplateIndex, setActiveTemplateIndex] = useState(0);
  const mockTemplates = [
    "Subject: Welcome to AffiliateCRM! Let's get your partner portal configured...",
    "Subject: Exclusive growth rate offer. Claim your 15% custom commission code...",
    "Subject: Follow-up: Quick briefing scheduled for tomorrow morning..."
  ];

  useEffect(() => {
    let index = 0;
    setTypingText('');
    const interval = setInterval(() => {
      const fullText = mockTemplates[activeTemplateIndex];
      if (index < fullText.length) {
        setTypingText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [activeTemplateIndex]);

  // Mock Activity Feed logger for Dashboard Mockup
  const [activities, setActivities] = useState([
    { text: 'Evaluated Sarah Williams: Match 95%', time: '1s ago', type: 'success' },
    { text: 'Generated affiliate link code "GROWTH88"', time: '4s ago', type: 'info' },
    { text: 'Assigned Jordan Blake to Sarah Williams', time: '12s ago', type: 'warning' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const logs = [
        { text: 'Evaluated Liam Torres: Match 78%', type: 'info' },
        { text: 'Ticket resolved by Alex Johnson: #8199', type: 'success' },
        { text: 'Evaluated Olivia Park: Match 89%', type: 'success' },
        { text: 'New lead Ava Thompson registered via Web', type: 'warning' }
      ];
      const randomLog = logs[Math.floor(Math.random() * logs.length)];
      setActivities(prev => [
        { text: randomLog.text, time: 'Just now', type: randomLog.type },
        ...prev.slice(0, 2)
      ]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a1a0f] text-slate-100 overflow-x-hidden relative font-sans">
      
      {/* Subtle Grid overlay & Lime Ambient Glow Backlights */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.002)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.002)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Top center ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[550px] rounded-full opacity-[0.2] blur-[150px] pointer-events-none"
          style={{background:'radial-gradient(circle, #a8ff3e 0%, #10b981 40%, transparent 70%)'}} />
        {/* Left ambient glow */}
        <div className="absolute top-[20%] -left-[10%] w-[500px] h-[500px] rounded-full opacity-[0.08] blur-[130px] pointer-events-none animate-float"
          style={{background:'radial-gradient(circle, #7fff00 0%, transparent 70%)'}} />
        {/* Right ambient glow */}
        <div className="absolute top-[40%] -right-[10%] w-[600px] h-[600px] rounded-full opacity-[0.1] blur-[140px] pointer-events-none animate-float"
          style={{background:'radial-gradient(circle, #a8ff3e 0%, transparent 70%)', animationDelay: '-8s'}} />
        {/* Bottom center glow */}
        <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-[0.18] blur-[160px] pointer-events-none"
          style={{background:'radial-gradient(circle, #a8ff3e 0%, #0d1f12 50%, transparent 80%)'}} />
      </div>

      {/* 1. Header/Navbar */}
      <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ${scrolled ? 'bg-[#0a1a0f]/85 backdrop-blur-lg border-b border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-2.5' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 select-none">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500/30 via-lime-500/20 to-transparent border border-white/10 flex items-center justify-center shadow-[0_0_20px_rgba(168,255,62,0.15)] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-lime-500/10 to-emerald-500/10 animate-pulse-glow" />
              <img src={logo} alt="Logo" className="w-6 h-6 object-contain relative z-10" />
            </div>
            <div className="flex flex-col">
              <span className="text-slate-100 font-extrabold text-base tracking-wide font-sora leading-tight">AffiliateCRM</span>
              <span className="text-[9px] text-[#a8ff3e] font-mono tracking-widest uppercase">Enterprise CRM</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-white/[0.02] border border-white/[0.05] rounded-full p-1.5 backdrop-blur-md">
            {['Features', 'AI Sandbox', 'Pricing', 'Reviews'].map((link) => (
              <a 
                key={link} 
                href={`#${link.toLowerCase().replace(' ', '')}`}
                className="px-4 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 rounded-full transition-all duration-300 hover:bg-white/[0.02]"
              >
                {link}
              </a>
            ))}
          </nav>

          {/* Dynamic Action Buttons */}
          <div className="flex items-center gap-4">
            {user ? (
              <Link to="/dashboard" className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#a8ff3e] text-[#0a1a0f] hover:bg-[#8ee62c] transition-all shadow-[0_4px_15px_rgba(168,255,62,0.2)] flex items-center gap-1.5 active:scale-[0.97]">
                <span>Dashboard</span>
                <ArrowUpRight size={13} />
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-slate-400 hover:text-white text-xs font-bold transition-all px-3 py-2">
                  Sign In
                </Link>
                <button 
                  onClick={() => setShowAuthChoice(true)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#a8ff3e] text-[#0a1a0f] hover:bg-[#8ee62c] transition-all shadow-[0_0_20px_rgba(168,255,62,0.25)] active:scale-[0.97]"
                >
                  Start Free
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative z-10 pt-32 pb-12 md:pt-48 md:pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Premium Capsule Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#a8ff3e]/25 bg-[#a8ff3e]/5 text-[#a8ff3e] text-xs font-semibold mb-6 animate-fade-in shadow-[0_0_15px_rgba(168,255,62,0.05)]">
          <Sparkle size={12} className="text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Introducing AffiliateCRM AI 2.0</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.08] mb-6 font-sora">
          Maximize your sales velocity <br/>
          with <span className="bg-gradient-to-r from-lime-400 via-emerald-300 to-green-400 bg-clip-text text-transparent">AI-powered partner networks</span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-400 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-10">
          An all-in-one centralized workspace designed to orchestrate partner conversion pipelines, automate affiliate support inquiries, and leverage real-time predictive lead matches.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-slide-up mb-20">
          <button 
            onClick={() => setShowAuthChoice(true)}
            className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-bold bg-[#a8ff3e] text-[#0a1a0f] hover:bg-[#8ee62c] hover:shadow-[0_0_30px_rgba(168,255,62,0.35)] transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <span>Start Free Trial</span>
            <ArrowRight size={16} />
          </button>
          <a href="#demo" className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-bold bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 border border-white/[0.08] hover:border-white/[0.15] transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
            <Play size={14} className="fill-slate-300 text-slate-300" />
            <span>Watch AI Sandbox</span>
          </a>
        </div>

        {/* 3. High-Fidelity Dashboard Mockup (Orbitly Highlight) */}
        <div className="relative max-w-6xl mx-auto border border-white/[0.08] rounded-3xl bg-[#111c14]/45 backdrop-blur-3xl shadow-[0_30px_70px_rgba(0,0,0,0.8),0_0_50px_rgba(168,255,62,0.02)] overflow-hidden p-1.5 animate-slide-up">
          <div className="absolute inset-0 bg-gradient-to-tr from-lime-500/5 to-emerald-500/5 pointer-events-none" />
          
          {/* Mockup Outer Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05] bg-slate-950/40 select-none">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <div className="w-[1px] h-3 bg-white/10 mx-2" />
              <span className="text-xs text-slate-500 font-mono">dashboard_preview_console.io</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.06] bg-white/[0.02] text-[10px] text-slate-500 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE CLOUD FEEDS</span>
            </div>
          </div>

          {/* Mockup Layout Body */}
          <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-white/[0.05] bg-slate-950/15">
            {/* Mock Sidebar */}
            <div className="w-full lg:w-48 p-4 shrink-0 flex lg:flex-col gap-2 overflow-x-auto select-none">
              <div className="text-[10px] font-bold text-slate-600 tracking-wider uppercase px-2 mb-2 hidden lg:block">MENU</div>
              {[
                { name: 'Dashboard', icon: BarChart3, active: true },
                { name: 'Lead Pipeline', icon: Users, active: false },
                { name: 'Helpdesk Desk', icon: LifeBuoy, active: false },
                { name: 'Analytics API', icon: Brain, active: false }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                    item.active 
                      ? 'bg-[#a8ff3e]/10 border border-[#a8ff3e]/20 text-[#a8ff3e]' 
                      : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.02] border border-transparent'
                  }`}
                >
                  <item.icon size={14} className={item.active ? 'text-[#a8ff3e]' : 'text-slate-500'} />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>

            {/* Mock Main Dashboard Panel */}
            <div className="flex-1 p-6 space-y-6">
              {/* Metric Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Active Partners', val: '249', trend: '+14.2%', border: 'hover:border-[#a8ff3e]/25' },
                  { label: 'Pipeline Value', val: '$32.4K', trend: '+9.8%', border: 'hover:border-emerald-500/25' },
                  { label: 'AI Match Accuracy', val: '94.2%', trend: '+4.5%', border: 'hover:border-lime-500/25' }
                ].map((item, idx) => (
                  <div key={idx} className={`bg-[#111c14] border border-white/[0.04] rounded-2xl p-4.5 transition-all duration-300 flex justify-between items-center ${item.border}`}>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">{item.label}</span>
                      <div className="text-2xl font-bold text-slate-100 font-sora mt-1">{item.val}</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-[#a8ff3e] border border-[#a8ff3e]/20">
                      {item.trend}
                    </span>
                  </div>
                ))}
              </div>

              {/* Central Graph & AI Logger row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* SVG Live Line Chart */}
                <div className="lg:col-span-8 bg-[#111c14] border border-white/[0.04] rounded-2xl p-5 flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">Pipeline Velocity Chart</h4>
                      <span className="text-[9px] text-slate-500">Hourly update interval</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#a8ff3e] inline-block" />
                      <span className="text-[10px] text-slate-400">Leads Converted</span>
                    </div>
                  </div>

                  {/* SVG Chart visualization */}
                  <div className="h-44 w-full relative">
                    <svg className="w-full h-full" viewBox="0 0 500 150" preserveAspectRatio="none">
                      {/* Gridlines */}
                      <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                      <line x1="0" y1="75" x2="500" y2="75" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                      <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="3" />

                      {/* Gradient fill */}
                      <defs>
                        <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#a8ff3e" stopOpacity="0.2"/>
                          <stop offset="100%" stopColor="#a8ff3e" stopOpacity="0.0"/>
                        </linearGradient>
                      </defs>
                      <path d="M 0,110 Q 75,70 150,90 T 300,40 T 450,20 L 500,20 L 500,150 L 0,150 Z" fill="url(#chartGlow)" />
                      
                      {/* The Line */}
                      <path d="M 0,110 Q 75,70 150,90 T 300,40 T 450,20 L 500,20" fill="none" stroke="#a8ff3e" strokeWidth="3.5" strokeLinecap="round" />

                      {/* Highlight Dot */}
                      <circle cx="300" cy="40" r="5" fill="#7fff00" stroke="#ffffff" strokeWidth="2" className="animate-ping" style={{ transformOrigin: '300px 40px' }} />
                      <circle cx="300" cy="40" r="5" fill="#7fff00" stroke="#ffffff" strokeWidth="2" />
                    </svg>
                    
                    {/* Tooltip Overlay */}
                    <div className="absolute top-10 left-[55%] bg-slate-950/90 border border-[#a8ff3e]/30 rounded-xl px-2.5 py-1.5 text-[10px] shadow-lg backdrop-blur-md">
                      <span className="text-slate-400 font-bold block">Gemini AI Peak Velocity</span>
                      <span className="text-[#a8ff3e] font-semibold font-mono mt-0.5 block">Velocity: 94.2% (Highest)</span>
                    </div>
                  </div>
                </div>

                {/* Gemini AI Live Logger Feed */}
                <div className="lg:col-span-4 bg-[#111c14] border border-white/[0.04] rounded-2xl p-5 flex flex-col justify-between select-none">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Brain size={14} className="text-[#a8ff3e]" />
                      <h4 className="text-xs font-bold text-slate-200">Gemini Lead Analysis Logs</h4>
                    </div>
                    
                    <div className="space-y-3">
                      {activities.map((act, idx) => (
                        <div key={idx} className="bg-slate-950/40 border border-white/[0.03] rounded-xl p-3 flex flex-col gap-1.5 transition-all duration-300 animate-slide-up">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-300 font-medium truncate max-w-[170px]">{act.text}</span>
                            <span className="text-[8px] text-slate-500 font-mono font-bold uppercase">{act.time}</span>
                          </div>
                          <div className="w-full bg-[#0d1f12] h-1.5 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-[#a8ff3e] w-[80%]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-white/[0.05] pt-3 mt-4 text-[9px] text-slate-500 font-mono flex items-center justify-between">
                    <span>STATUS: 200 OK</span>
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Trusted By / Partner Strip */}
      <section className="py-10 border-y border-white/[0.03] bg-slate-950/20 relative z-10 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[10px] font-bold text-slate-500 text-center uppercase tracking-widest mb-6">
            TRUSTED BY GROWING AFFILIATE OPERATIONS WORLDWIDE
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60">
            {['TechVentures', 'StartupCo', 'GrowthHub', 'NexGen Ltd', 'CloudScale', 'DataPeak'].map((logoText, idx) => (
              <span 
                key={idx} 
                className="text-sm font-extrabold text-slate-400 tracking-wider hover:text-slate-200 transition-colors duration-300 font-sora cursor-pointer"
              >
                {logoText}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Bento Grid Features Section */}
      <section id="features" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4 font-sora">
              Build high-converting pipelines
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              An all-in-one suite of intelligence features to manage leads, support ticket queries, and verify partner commissions.
            </p>
          </div>

          {/* The Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            
            {/* Box 1 (Double Wide - Interactive Sandbox) */}
            <div id="demo" className="md:col-span-2 card bg-[#111c14]/70 border border-white/[0.07] rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-[#a8ff3e]/20 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#a8ff3e]/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#a8ff3e]/25 bg-[#a8ff3e]/5 text-[#a8ff3e] text-[10px] font-bold mb-4 font-mono">
                  <Sparkles size={11} className="text-[#a8ff3e]" />
                  <span>PREDICTIVE GEMINI SCORING</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-sora text-slate-100 mb-2">
                  Gemini AI Lead Intelligence Sandbox
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed max-w-lg">
                  Analyze lead profile properties, sentiment values, and auto-generated target options in real-time. Pick a demo profile below to test.
                </p>
              </div>

              {/* Sandbox Core Widget */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch border-t border-white/[0.05] pt-6">
                {/* Lead List buttons */}
                <div className="lg:col-span-5 flex flex-col gap-2.5">
                  {demoLeads.map((lead, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectLead(idx)}
                      className={`p-3 text-left rounded-xl border text-xs transition-all duration-300 flex flex-col gap-1.5 ${
                        selectedDemoLead === idx 
                          ? 'bg-[#a8ff3e]/10 border border-[#a8ff3e]/30 text-[#a8ff3e]' 
                          : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="font-bold">{lead.name}</span>
                        <span className="text-[9px] text-slate-500">{lead.company}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Score Console */}
                <div className="lg:col-span-7 bg-[#0a1a0f]/50 border border-white/[0.04] rounded-2xl p-4 flex flex-col justify-between">
                  {isAiLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center min-h-[120px] text-slate-400 gap-2">
                      <div className="w-7 h-7 border-2 border-[#a8ff3e] border-t-transparent rounded-full animate-spin" />
                      <span className="text-[10px] font-mono tracking-widest animate-pulse">Scoring...</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono text-slate-500">MATCH PROBABILITY</span>
                        <span className="text-xs font-bold text-[#a8ff3e] font-mono">{mockAiOutput.score}%</span>
                      </div>
                      <div className="w-full bg-[#0d1f12] h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#a8ff3e] to-emerald-500 rounded-full" style={{ width: `${mockAiOutput.score}%` }} />
                      </div>
                      <div className="text-[11px] text-slate-300 leading-relaxed bg-white/[0.01] border border-white/[0.04] p-3 rounded-lg">
                        <span className="text-[#a8ff3e] font-bold">Insight:</span> {mockAiOutput.summary}
                      </div>
                      <div className="text-[10px] text-[#a8ff3e] flex items-center gap-2 bg-[#a8ff3e]/10 border border-[#a8ff3e]/15 p-2.5 rounded-lg">
                        <Zap size={12} className="text-[#a8ff3e] shrink-0" />
                        <span>{mockAiOutput.action}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Box 2 (Single Wide - Outreach Generator) */}
            <div className="md:col-span-1 card bg-[#111c14]/70 border border-white/[0.07] rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-[#a8ff3e]/20 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#a8ff3e]/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/5 text-emerald-300 text-[10px] font-bold mb-4 font-mono">
                  <Sparkles size={11} className="text-emerald-400 animate-pulse" />
                  <span>OUTREACH AUTOMATION</span>
                </div>
                <h3 className="text-xl font-bold font-sora text-slate-100 mb-2">
                  AI-Generated Templates
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Compose personalized email invitations automatically based on AI score categories.
                </p>
              </div>

              {/* Template generator UI mock */}
              <div className="bg-[#0a1a0f]/50 border border-white/[0.05] rounded-2xl p-4 flex-1 flex flex-col justify-between min-h-[160px]">
                <div className="text-[10px] text-slate-300 leading-relaxed font-mono min-h-[90px] whitespace-pre-wrap">
                  {typingText}
                  <span className="w-1.5 h-3 bg-[#a8ff3e] inline-block animate-pulse ml-0.5" />
                </div>
                
                <div className="flex gap-1.5 border-t border-white/[0.04] pt-3">
                  {[1, 2, 3].map((tNum, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveTemplateIndex(idx)}
                      className={`px-2.5 py-1 rounded-lg text-[9px] font-bold transition-all ${
                        activeTemplateIndex === idx 
                          ? 'bg-[#a8ff3e]/20 border border-[#a8ff3e]/35 text-[#a8ff3e]' 
                          : 'bg-white/[0.02] border-white/[0.05] text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      Draft {tNum}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Box 3 (Single Wide - Priority Helpdesk) */}
            <div className="md:col-span-1 card bg-[#111c14]/70 border border-white/[0.07] rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-[#a8ff3e]/20 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#a8ff3e]/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#a8ff3e]/25 bg-[#a8ff3e]/5 text-[#a8ff3e] text-[10px] font-bold mb-4 font-mono">
                  <LifeBuoy size={11} className="text-[#a8ff3e]" />
                  <span>INTEGRATED HELPDESK</span>
                </div>
                <h3 className="text-xl font-bold font-sora text-slate-100 mb-2">
                  Priority Ticket Hub
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Provide partners with clear paths to resolve technical integration, commission, or billing inquiries.
                </p>
              </div>

              {/* Ticketing mock items */}
              <div className="space-y-2.5">
                {[
                  { title: 'Commission not showing', priority: 'High', status: 'In Progress', clr: 'bg-[#a8ff3e]/10 text-[#a8ff3e] border-[#a8ff3e]/20' },
                  { title: 'Cannot access dashboard', priority: 'High', status: 'Open', clr: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' }
                ].map((ticket, i) => (
                  <div key={i} className="bg-slate-900/40 border border-white/[0.04] rounded-xl p-3 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-slate-200 truncate max-w-[130px]">{ticket.title}</div>
                      <div className="text-[9px] text-slate-500 mt-0.5">Priority: {ticket.priority}</div>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${ticket.clr}`}>{ticket.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Box 4 (Double Wide - Operations & Analytics) */}
            <div className="md:col-span-2 card bg-[#111c14]/70 border border-white/[0.07] rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-[#a8ff3e]/20 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#a8ff3e]/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#a8ff3e]/25 bg-[#a8ff3e]/5 text-[#a8ff3e] text-[10px] font-bold mb-4 font-mono">
                  <TrendingUp size={11} className="text-[#a8ff3e]" />
                  <span>PERFORMANCE ANALYTICS</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-sora text-slate-100 mb-2">
                  Real-time Velocity Metrics
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed max-w-lg">
                  Monitor conversions, analyze payouts, and verify commission velocity trends with fully exportable dashboard reports.
                </p>
              </div>

              {/* Progress visual metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/[0.05] pt-6">
                <div className="bg-[#0a1a0f]/50 border border-white/[0.04] rounded-2xl p-4 flex flex-col justify-between text-xs gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-semibold">Total Commission Payouts</span>
                    <span className="text-[#a8ff3e] font-bold font-mono">$18,450</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-[#0d1f12] h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full w-[82%]" />
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold">82%</span>
                  </div>
                </div>

                <div className="bg-[#0a1a0f]/50 border border-white/[0.04] rounded-2xl p-4 flex flex-col justify-between text-xs gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-semibold">Daily Active Affiliates</span>
                    <span className="text-[#a8ff3e] font-bold font-mono">142</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-[#0d1f12] h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-[#a8ff3e] rounded-full w-[64%]" />
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold">64%</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Pricing Section */}
      <section id="pricing" className="py-24 border-t border-white/[0.03] bg-slate-950/20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold font-sora text-slate-100 mb-4">Pricing plans for any scale</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">Choose the tier that matches your active partner scale. Simple, transparent pricing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
            {/* Tier 1 */}
            <div className="card p-8 bg-[#111c14]/70 border border-white/[0.05] rounded-3xl flex flex-col justify-between group hover:border-slate-800 transition-all duration-300">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">STARTER</span>
                <div className="flex items-baseline gap-1 mt-4 mb-2">
                  <span className="text-4xl font-extrabold text-slate-100 font-sora">$0</span>
                  <span className="text-xs text-slate-500">/ forever</span>
                </div>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">Perfect for individual developers and small marketing teams getting started.</p>
                
                <div className="border-t border-white/[0.05] pt-6 space-y-4.5">
                  {['Up to 100 Leads', 'Standard status workflows', 'Default support tickets', 'Manual lead conversions'].map((feature) => (
                    <div key={feature} className="flex items-center gap-3 text-xs text-slate-300">
                      <div className="w-4 h-4 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 select-none">✓</div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => setShowAuthChoice(true)}
                className="w-full py-3 rounded-xl text-xs font-bold text-center mt-8 block border border-white/10 text-slate-350 bg-white/[0.01] hover:bg-white/[0.04] transition-all"
              >
                Get Started
              </button>
            </div>

            {/* Tier 2: Recommended */}
            <div className="card p-8 bg-gradient-to-b from-emerald-950/20 to-[#111c14]/90 border-[#a8ff3e]/40 rounded-3xl flex flex-col justify-between relative shadow-[0_20px_40px_rgba(168,255,62,0.04)] group">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#a8ff3e] text-[#0a1a0f] px-4 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest shadow-md">
                RECOMMENDED
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#a8ff3e] uppercase tracking-widest font-mono">GROWTH</span>
                <div className="flex items-baseline gap-1 mt-4 mb-2">
                  <span className="text-4xl font-extrabold text-slate-100 font-sora">$49</span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <p className="text-xs text-slate-300 mb-6 leading-relaxed">Designed for fast-growing businesses and professional managers needing AI capabilities.</p>
                
                <div className="border-t border-white/[0.1] pt-6 space-y-4.5">
                  {[
                    'Unlimited Leads & Affiliates',
                    'Custom Workflow pipeline stages',
                    'Advanced Priority Support tickets',
                    'Gemini AI Match scoring system',
                    'Outreach Email template generation'
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-3 text-xs text-slate-200">
                      <div className="w-4 h-4 rounded-full bg-[#a8ff3e]/20 border border-[#a8ff3e]/35 flex items-center justify-center text-[#a8ff3e] select-none">✓</div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => setShowAuthChoice(true)}
                className="w-full py-3 rounded-xl text-xs font-bold text-center mt-8 block bg-[#a8ff3e] text-[#0a1a0f] hover:bg-[#8ee62c] hover:shadow-[0_0_20px_rgba(168,255,62,0.25)] transition-all"
              >
                Try Growth Free
              </button>
            </div>

            {/* Tier 3 */}
            <div className="card p-8 bg-[#111c14]/70 border border-white/[0.05] rounded-3xl flex flex-col justify-between group hover:border-slate-800 transition-all duration-300">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">ENTERPRISE</span>
                <div className="flex items-baseline gap-1 mt-4 mb-2">
                  <span className="text-4xl font-extrabold text-slate-100 font-sora">Custom</span>
                </div>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">For large scale operations and networks requiring custom integrations.</p>
                
                <div className="border-t border-white/[0.05] pt-6 space-y-4.5">
                  {[
                    'Everything in Growth plan',
                    'Dedicated cloud server instance',
                    'SLA-backed uptime guarantees',
                    'Custom API endpoints & parameters',
                    'Advanced system audit logs'
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-3 text-xs text-slate-300">
                      <div className="w-4 h-4 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 select-none">✓</div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => setShowAuthChoice(true)}
                className="w-full py-3 rounded-xl text-xs font-bold text-center mt-8 block border border-white/10 text-slate-350 bg-white/[0.01] hover:bg-white/[0.04] transition-all"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Reviews & Testimonials Section */}
      <section id="reviews" className="py-24 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold font-sora text-slate-100 mb-4">Scale with confidence</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">Read reviews from affiliate managers using AffiliateCRM to grow operations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto select-none">
            <div className="card p-6 bg-[#111c14]/70 border border-white/[0.05] rounded-3xl relative">
              <div className="flex items-center gap-1 text-yellow-500 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-medium">
                "We managed over 5,000 leads manually before switching to AffiliateCRM. The integrated Gemini match scoring helped our managers prioritize high-intent conversions and saved us endless spreadsheet hours. It is an indispensable dashboard."
              </p>
              <div className="border-t border-white/[0.04] pt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-350 text-xs">
                  SW
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">Sarah Williams</div>
                  <div className="text-[10px] text-slate-500">Lead Affiliate Manager at TechVentures</div>
                </div>
              </div>
            </div>

            <div className="card p-6 bg-[#111c14]/70 border border-white/[0.05] rounded-3xl relative">
              <div className="flex items-center gap-1 text-yellow-500 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-medium">
                "The unified ticket support desk inside the CRM has changed the way we handle affiliate questions. We are resolving dashboard setup issues twice as fast. Beautiful glassmorphic UI, responsive controls, and outstanding speed."
              </p>
              <div className="border-t border-white/[0.04] pt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-lime-500/10 border border-lime-500/20 flex items-center justify-center font-bold text-[#a8ff3e] text-xs">
                  MC
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">Marcus Chen</div>
                  <div className="text-[10px] text-slate-500">Managing Director at GrowthHub</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Glowing Bottom CTA Banner (Orbitly Highlight) */}
      <section className="py-24 relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[2rem] border border-white/[0.08] bg-[#111c14]/90 backdrop-blur-3xl overflow-hidden p-8 sm:p-16 text-center shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          {/* Internal Glowing Backlight */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] rounded-full opacity-[0.25] blur-[100px] pointer-events-none"
            style={{background:'radial-gradient(circle, #a8ff3e 0%, #059669 50%, transparent 80%)'}} />
          
          {/* Subtle Grid overlay inside banner */}
          <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.001)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.001)_1px,transparent_1px)] bg-[size:30px_30px] opacity-70 pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-sora">
              Scale your affiliate network today
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Join thousands of marketers leveraging predictive artificial intelligence to automate conversions and support tickets.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => setShowAuthChoice(true)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs font-bold bg-[#a8ff3e] text-[#0a1a0f] hover:bg-[#8ee62c] hover:shadow-[0_0_20px_rgba(168,255,62,0.25)] transition-all duration-300"
              >
                Get Started for Free
              </button>
              <a href="#features" className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs font-bold bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.15] text-slate-300 hover:bg-white/[0.04] transition-all">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Footer Section */}
      <footer className="border-t border-white/[0.05] bg-[#0a1a0f]/60 py-16 relative z-10 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity duration-300"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-lime-500/20 border border-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(168,255,62,0.1)]">
              <img src={logo} alt="Logo" className="w-5 h-5 object-contain" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-slate-300 font-bold tracking-wide font-sora text-sm leading-tight">AffiliateCRM</span>
              <span className="text-[8px] text-slate-600 font-mono tracking-widest">ENTERPRISE EDITION</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-600 text-center">
            &copy; {new Date().getFullYear()} AffiliateCRM. All rights reserved.
          </p>

          <div className="flex gap-6 text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
            <a href="#features" className="hover:text-slate-300 transition-colors">Features</a>
            <a href="#demo" className="hover:text-slate-300 transition-colors">Sandbox</a>
            <a href="#pricing" className="hover:text-slate-300 transition-colors">Pricing</a>
          </div>
        </div>
      </footer>

      {/* Futuristic Authentication gateway modal */}
      {showAuthChoice && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <style>{`
            @keyframes scanline {
              0% { top: 0%; opacity: 0; }
              5% { opacity: 0.8; }
              95% { opacity: 0.8; }
              100% { top: 100%; opacity: 0; }
            }
            .animate-scanline {
              animation: scanline 3s linear infinite;
            }
          `}</style>

          {/* Blur backdrop overlay */}
          <div 
            className="absolute inset-0 bg-black/85 backdrop-blur-xl transition-all duration-300"
            onClick={() => setShowAuthChoice(false)}
          />

          {/* Scanning laser line sweeping down */}
          <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#a8ff3e]/40 to-transparent pointer-events-none animate-scanline" />

          {/* Modal Content container */}
          <div className="relative w-full max-w-2xl bg-[#0e1c12]/90 border border-[#a8ff3e]/20 rounded-[2.5rem] p-8 md:p-12 shadow-[0_30px_70px_rgba(0,0,0,0.8),0_0_50px_rgba(168,255,62,0.05)] overflow-hidden animate-slide-up flex flex-col items-center">
            {/* Soft background glowing ambient lights */}
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#a8ff3e]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Futuristic cyber tech matrix grids */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.003)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.003)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />

            {/* Circular glowing close button */}
            <button 
              onClick={() => setShowAuthChoice(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-[#a8ff3e] hover:border-[#a8ff3e]/30 hover:bg-[#a8ff3e]/10 transition-all duration-300 z-10 active:scale-95 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
            >
              <X size={18} />
            </button>

            {/* Modal Heading block */}
            <div className="relative z-10 text-center mb-10 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-[#a8ff3e] text-[10px] font-bold tracking-widest font-mono">
                <Brain size={12} className="animate-pulse" />
                <span>AUTHENTICATION PROTOCOL</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white font-sora">
                Initialize Secure Connection
              </h2>
              <p className="text-slate-400 text-xs max-w-md mx-auto leading-relaxed">
                Configure your active session access. Select whether to authenticate into your existing dashboard workspace or provision a new affiliate pipeline.
              </p>
            </div>

            {/* Interactive Grid options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full relative z-10">
              {/* Option A: Login */}
              <Link 
                to="/login"
                onClick={() => setShowAuthChoice(false)}
                className="group relative flex flex-col justify-between p-6 rounded-[1.8rem] bg-slate-950/60 border border-white/5 hover:border-[#a8ff3e]/35 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_rgba(168,255,62,0.12)] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#a8ff3e]/0 to-[#a8ff3e]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-[#a8ff3e] group-hover:border-[#a8ff3e]/30 group-hover:bg-[#a8ff3e]/10 transition-all duration-500 relative">
                    <div className="absolute inset-0 rounded-2xl bg-[#a8ff3e]/5 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500" />
                    <Key size={18} className="relative z-10" />
                  </div>
                  <div>
                    <h3 className="text-slate-200 font-bold font-sora text-sm group-hover:text-white transition-colors">
                      Access Workspace
                    </h3>
                    <p className="text-slate-500 text-[10px] mt-1.5 leading-relaxed group-hover:text-slate-400 transition-colors">
                      Already registered with AffiliateCRM? Connect using your existing secure credentials to continue pipeline tracking.
                    </p>
                  </div>
                </div>
                <div className="mt-8 flex items-center gap-1.5 text-[10px] font-bold text-slate-400 group-hover:text-[#a8ff3e] transition-colors">
                  <span>Sign In Pipeline</span>
                  <ChevronRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Option B: Register */}
              <Link 
                to="/register"
                onClick={() => setShowAuthChoice(false)}
                className="group relative flex flex-col justify-between p-6 rounded-[1.8rem] bg-slate-950/60 border border-white/5 hover:border-emerald-400/35 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_rgba(16,185,129,0.12)] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/0 to-emerald-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 group-hover:border-emerald-400/30 group-hover:bg-emerald-500/10 transition-all duration-500 relative">
                    <div className="absolute inset-0 rounded-2xl bg-emerald-500/5 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500" />
                    <Sparkles size={18} className="relative z-10" />
                  </div>
                  <div>
                    <h3 className="text-slate-200 font-bold font-sora text-sm group-hover:text-white transition-colors">
                      Provision Account
                    </h3>
                    <p className="text-slate-500 text-[10px] mt-1.5 leading-relaxed group-hover:text-slate-400 transition-colors">
                      Ready to build your partner network? Deploy your new affiliate profile in under 30 seconds for free.
                    </p>
                  </div>
                </div>
                <div className="mt-8 flex items-center gap-1.5 text-[10px] font-bold text-slate-400 group-hover:text-emerald-400 transition-colors">
                  <span>Create Account</span>
                  <ChevronRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
