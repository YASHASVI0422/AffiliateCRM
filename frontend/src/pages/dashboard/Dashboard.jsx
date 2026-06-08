import React, { useState } from 'react';
import { Target, Ticket, TrendingUp, CheckCircle2, Clock, ArrowUpRight, Sparkles, RefreshCw, AlertTriangle, Zap, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { StatCard, SkeletonLoader } from '../../components/ui';
import Avatar from '../../components/ui/Avatar';

const actMeta = {
  lead_created:   { color:'text-[#a8ff3e]',    bg:'bg-[#a8ff3e]/10' },
  lead_updated:   { color:'text-amber-400',   bg:'bg-amber-500/10' },
  lead_converted: { color:'text-emerald-400', bg:'bg-emerald-500/10' },
  ticket_created: { color:'text-red-400',     bg:'bg-red-500/10' },
  ticket_updated: { color:'text-amber-400',   bg:'bg-amber-500/10' },
  ticket_replied: { color:'text-[#8ee62c]',  bg:'bg-[#8ee62c]/10' },
  user_registered:{ color:'text-[#a8ff3e]',     bg:'bg-[#a8ff3e]/10' },
  user_login:     { color:'text-slate-500',   bg:'bg-white/5' },
};

const moodCfg = {
  positive:{ border:'border-emerald-500/20', bg:'bg-emerald-500/5', badge:'bg-emerald-500/15 text-emerald-300 border-emerald-500/25' },
  neutral: { border:'border-[#a8ff3e]/20',    bg:'bg-[#a8ff3e]/5',    badge:'bg-[#a8ff3e]/15 text-[#a8ff3e] border-[#a8ff3e]/25' },
  warning: { border:'border-amber-500/20',   bg:'bg-amber-500/5',   badge:'bg-amber-500/15 text-amber-300 border-amber-500/25' },
};

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [aiInsight, setAiInsight] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [hasAiError, setHasAiError] = useState(false);

  // React Query Fetching
  const { data: leadStats, isLoading: isLeadStatsLoading } = useQuery({
    queryKey: ['leadStats'],
    queryFn: async () => {
      const { data } = await api.get('/leads/stats');
      return data.data;
    },
    staleTime: 60000,
  });

  const { data: ticketStats, isLoading: isTicketStatsLoading } = useQuery({
    queryKey: ['ticketStats'],
    queryFn: async () => {
      const { data } = await api.get('/tickets/stats');
      return data.data;
    },
    staleTime: 60000,
  });

  const { data: activities, isLoading: isActivitiesLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const { data } = await api.get('/analytics/activity');
      return data.data || [];
    },
    staleTime: 60000,
  });

  const { data: overview, isLoading: isOverviewLoading } = useQuery({
    queryKey: ['overview'],
    queryFn: async () => {
      const { data } = await api.get('/analytics/overview');
      return data.data;
    },
    enabled: !!isAdmin,
    staleTime: 60000,
  });

  const { data: chart, isLoading: isChartLoading } = useQuery({
    queryKey: ['chart'],
    queryFn: async () => {
      const { data } = await api.get('/analytics/leads-over-time?days=14');
      return data.data || [];
    },
    enabled: !!isAdmin,
    staleTime: 60000,
  });

  const { data: followUpsToday, isLoading: isFollowUpsLoading } = useQuery({
    queryKey: ['followUpsToday'],
    queryFn: async () => {
      const { data } = await api.get('/leads?followUpToday=true');
      return data.data || [];
    },
    staleTime: 60000,
  });

  const loading = isLeadStatsLoading || isTicketStatsLoading || isActivitiesLoading || (isAdmin && (isOverviewLoading || isChartLoading));

  const fetchAI = async () => {
    setIsAiLoading(true);
    setHasAiError(false);
    try {
      const { data } = await api.post('/ai/dashboard-insight', {
        totalLeads: overview?.totalLeads || leadStats?.total || 0,
        convertedLeads: overview?.convertedLeads || leadStats?.converted || 0,
        conversionRate: overview?.conversionRate || leadStats?.conversionRate || 0,
        openTickets: overview?.openTickets || 0,
        newLeadsToday: overview?.newLeadsToday || 0,
        totalUsers: overview?.totalUsers || 0
      });
      setAiInsight(data.data);
    } catch {
      setHasAiError(true);
    } finally {
      setIsAiLoading(false);
    }
  };

  const gs = (arr, k) => arr?.find(s => s._id === k)?.count || 0;
  const activeTicketsCount = ticketStats ? (gs(ticketStats.byStatus, 'Open') + gs(ticketStats.byStatus, 'In Progress')) : 0;
  const mood = aiInsight ? moodCfg[aiInsight.mood] || moodCfg.neutral : null;

  const chartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="shadow-xl p-3 text-sm" style={{ background: '#111c14', border: '1px solid rgba(168,255,62,0.15)', borderRadius: 12 }}>
        <div className="text-slate-500 mb-2 text-xs">{label}</div>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-400">{p.name}:</span>
            <span className="text-slate-200 font-medium">{p.value}</span>
          </div>
        ))}
      </div>
    );
  };

  const handleActivityClick = (a) => {
    if (a.entityType === 'Ticket' && a.entityId) {
      navigate(`/tickets/${a.entityId}`);
    } else if (a.entityType === 'Lead') {
      navigate('/leads');
    } else if (a.entityType === 'User' && isAdmin) {
      navigate('/users');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title text-slate-100 font-semibold text-2xl leading-tight" style={{ fontFamily: 'Sora,sans-serif' }}>
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">{format(new Date(), 'EEEE, MMMM do yyyy')}</p>
        </div>
        {user?.affiliateCode && (
          <div className="hidden md:block card px-4 py-2.5 text-right">
            <div className="text-slate-500 text-xs">Affiliate code</div>
            <div className="text-[#a8ff3e] font-mono font-semibold">{user.affiliateCode}</div>
          </div>
        )}
      </div>

      {/* Follow-ups Today Alert */}
      {!isFollowUpsLoading && followUpsToday && followUpsToday.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <Calendar size={16} />
            <span>Follow-ups Today</span>
          </div>
          <div className="space-y-2">
            {followUpsToday.map(lead => (
              <div key={lead._id} className="flex justify-between items-center text-xs border-b border-amber-500/10 last:border-0 pb-1.5 last:pb-0">
                <div>
                  <span className="font-medium text-amber-200">{lead.name}</span>
                  {lead.company && <span className="text-slate-400"> ({lead.company})</span>}
                  {lead.followUpNote && <span className="text-slate-300"> — {lead.followUpNote}</span>}
                </div>
                <button
                  onClick={() => navigate('/leads')}
                  className="text-[#a8ff3e] hover:text-[#a8ff3e]/80 transition-colors font-medium"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats cards responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Target}       label="Total Leads"     value={leadStats?.total ?? '—'}                              color="cyan"    loading={loading}/>
        <StatCard icon={CheckCircle2} label="Converted"       value={leadStats?.converted ?? '—'}                          color="emerald" loading={loading}/>
        <StatCard icon={Ticket}       label="Active Tickets"  value={loading ? '—' : activeTicketsCount}                   color="amber"   loading={loading}/>
        <StatCard icon={TrendingUp}   label="Conversion Rate" value={leadStats?.conversionRate ? `${leadStats.conversionRate}%` : '—'} color="violet" loading={loading}/>
      </div>

      {/* AI Insight */}
      <div className={`card p-5 border transition-all duration-500 ${mood ? `${mood.border} ${mood.bg}` : 'border-white/6'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(168,255,62,0.15), rgba(16,185,129,0.1))' }}>
              <Sparkles size={16} className="text-[#a8ff3e]" />
            </div>
            <div>
              <h3 className="text-slate-200 font-semibold text-sm" style={{ fontFamily: 'Sora,sans-serif' }}>AI Business Insight</h3>
              <p className="text-slate-600 text-xs">Powered by Gemini AI</p>
            </div>
          </div>
          <button onClick={fetchAI} disabled={isAiLoading || loading} className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all disabled:opacity-50" style={{ background: 'rgba(168,255,62,0.12)', border: '1px solid rgba(168,255,62,0.2)', color: '#a8ff3e' }}>
            {isAiLoading ? <div className="w-3 h-3 border-2 border-[#a8ff3e] border-t-transparent rounded-full animate-spin" /> : <RefreshCw size={12} />}
            {aiInsight ? 'Refresh' : 'Generate Insight'}
          </button>
        </div>
        {!aiInsight && !isAiLoading && !hasAiError && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Sparkles size={28} className="text-[#a8ff3e]/30 mb-2" />
            <p className="text-slate-500 text-sm">Click "Generate Insight" to get an AI-powered analysis</p>
          </div>
        )}
        {isAiLoading && (
          <div className="flex items-center justify-center gap-3 py-6">
            <div className="w-5 h-5 border-2 border-[#a8ff3e] border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-500 text-sm">Gemini is analysing your data...</p>
          </div>
        )}
        {hasAiError && !isAiLoading && (
          <div className="flex items-center gap-3 py-4 px-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <AlertTriangle size={16} className="text-red-400 flex-shrink-0" />
            <p className="text-red-300 text-sm">Failed. Add GEMINI_API_KEY to backend .env → get free key at aistudio.google.com</p>
          </div>
        )}
        {aiInsight && !isAiLoading && (
          <div className="space-y-4 animate-fade-in">
            <span className={`badge border capitalize ${mood.badge}`}>{aiInsight.mood === 'positive' ? '📈' : aiInsight.mood === 'warning' ? '⚠️' : '📊'} {aiInsight.mood}</span>
            <p className="text-slate-300 text-sm leading-relaxed">{aiInsight.summary}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {aiInsight.highlights?.map((h, i) => (
                <div key={i} className="flex items-start gap-2 p-3 bg-white/5 rounded-xl">
                  <span className="text-[#a8ff3e] mt-0.5">•</span>
                  <span className="text-slate-400 text-xs">{h}</span>
                </div>
              ))}
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'rgba(168,255,62,0.08)', border: '1px solid rgba(168,255,62,0.15)' }}>
              <Zap size={15} className="text-[#a8ff3e] flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[#a8ff3e] text-xs font-semibold uppercase tracking-wider">Recommended Action</span>
                <p className="text-slate-300 text-sm mt-0.5">{aiInsight.action}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {isAdmin && (
          <div className="lg:col-span-2 card p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="section-title">Lead Activity</h3>
                <p className="text-slate-500 text-xs mt-0.5">Last 14 days</p>
              </div>
              <button onClick={() => navigate('/analytics')} className="flex items-center gap-1 text-[#a8ff3e] hover:text-[#a8ff3e]/80 text-xs font-medium transition-colors">
                View all <ArrowUpRight size={12} />
              </button>
            </div>
            {loading ? (
              <SkeletonLoader rows={1} height="200px" />
            ) : chart.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chart}>
                  <defs>
                    <linearGradient id="gl" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a8ff3e" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#a8ff3e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tickFormatter={d => d.slice(5)} />
                  <YAxis allowDecimals={false} />
                  <Tooltip content={chartTooltip} />
                  <Area type="monotone" dataKey="leads" stroke="#a8ff3e" fill="url(#gl)" strokeWidth={2} name="Leads" />
                  <Area type="monotone" dataKey="converted" stroke="#10b981" fill="url(#gc)" strokeWidth={2} name="Converted" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-slate-600 text-sm">No data yet</div>
            )}
          </div>
        )}
        <div className={`card p-5 ${isAdmin ? '' : 'lg:col-span-3'}`}>
          <h3 className="section-title mb-4">Pipeline</h3>
          {loading ? (
            <SkeletonLoader rows={5} height="24px" />
          ) : (
            <div className="space-y-3">
              {['New Lead', 'Contacted', 'Interested', 'Joined Community', 'Converted'].map(statusName => {
                const count = gs(leadStats?.byStatus, statusName);
                const pct = leadStats?.total > 0 ? (count / leadStats.total) * 100 : 0;
                return (
                  <div key={statusName}>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-400 text-xs">{statusName}</span>
                      <span className="text-slate-200 text-xs font-medium">{count}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #10b981, #a8ff3e)' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-title">Recent Activity</h3>
          <Clock size={16} className="text-slate-600" />
        </div>
        {loading ? (
          <SkeletonLoader rows={4} height="48px" />
        ) : activities.length === 0 ? (
          <div className="text-center text-slate-500 text-sm py-8">No activity yet</div>
        ) : (
          <div className="space-y-1">
            {activities.slice(0, 8).map(activityItem => {
              return (
                <div
                  key={activityItem._id}
                  onClick={() => handleActivityClick(activityItem)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <Avatar name={activityItem.user?.name || 'User'} avatar={activityItem.user?.avatar} size={32} className="rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-300 text-sm truncate">{activityItem.description}</p>
                    <p className="text-slate-600 text-xs">{activityItem.user?.name}</p>
                  </div>
                  <span className="text-slate-600 text-xs flex-shrink-0">
                    {formatDistanceToNow(new Date(activityItem.createdAt), { addSuffix: true })}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
