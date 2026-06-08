import React, { useState, useEffect } from 'react';
import { BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Users, Target, Ticket, RefreshCw } from 'lucide-react';
import api from '../../api/axios';
import { StatCard, Spinner } from '../../components/ui';
import CustomSelect from '../../components/ui/CustomSelect';
import Avatar from '../../components/ui/Avatar';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const COLORS = ['#a8ff3e','#10b981','#059669','#3f6212','#111c14','#8ee62c'];
const S_COLORS = { 'New Lead':'#1b3a24','Contacted':'#2e5b37','Interested':'#10b981','Joined Community':'#8ee62c','Converted':'#a8ff3e' };
const T_COLORS = { Open:'#ef4444','In Progress':'#a8ff3e','Resolved':'#10b981','Closed':'#3f6212' };

const TT = ({ active, payload, label }) => {
  if (!active||!payload?.length) return null;
  return (
    <div className="shadow-xl p-3 text-sm font-sans" style={{background:'#111c14',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12}}>
      <div className="text-slate-500 mb-2 text-xs">{label}</div>
      {payload.map((p,i)=><div key={i} className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{background:p.color}}/><span className="text-slate-400">{p.name}:</span><span className="text-slate-200 font-medium">{typeof p.value==='number'?Math.round(p.value*10)/10:p.value}</span></div>)}
    </div>
  );
};

export default function Analytics() {
  const { isAdmin, user }       = useAuth();
  const [loading, setLoading]   = useState(true);
  const [ov, setOv]             = useState({});
  const [lot, setLot]           = useState([]);
  const [pip, setPip]           = useState([]);
  const [aff, setAff]           = useState([]);
  const [tt, setTt]             = useState({});
  const [days, setDays]         = useState(30);

  const load = async () => {
    setLoading(true);
    try {
      const [o,l,p,a,t] = await Promise.all([
        api.get('/analytics/overview'),
        api.get(`/analytics/leads-over-time?days=${days}`),
        api.get('/analytics/pipeline'),
        api.get('/analytics/affiliate-performance'),
        api.get('/analytics/ticket-trends'),
      ]);
      setOv(o.data.data); setLot(l.data.data); setPip(p.data.data); setAff(a.data.data); setTt(t.data.data);
    } catch { toast.error('Failed to load analytics'); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ load(); },[days]);

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size={10}/></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="page-title">Analytics</h1><p className="text-slate-500 text-sm mt-0.5">Performance insights and metrics</p></div>
        <div className="flex items-center gap-2">
          <div className="w-40"><CustomSelect value={String(days)} onChange={v=>setDays(Number(v))} options={[{value:'7',label:'Last 7 days'},{value:'14',label:'Last 14 days'},{value:'30',label:'Last 30 days'}]}/></div>
          <button onClick={load} className="btn-secondary flex items-center gap-2 text-sm py-2.5"><RefreshCw size={14}/></button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Target}    label={isAdmin ? "Total Leads" : "My Leads"}       value={ov.totalLeads??'—'}           color="cyan"/>
        <StatCard icon={TrendingUp} label={isAdmin ? "Conversion Rate" : "My Conversion Rate"}  value={`${ov.conversionRate??0}%`}   color="emerald"/>
        <StatCard icon={Ticket}    label={isAdmin ? "Open Tickets" : "My Open Tickets"}      value={ov.openTickets??'—'}           color="amber"/>
        <StatCard icon={isAdmin ? Users : Target}     label={isAdmin ? "Active Affiliates" : "Converted Leads"} value={isAdmin ? (ov.totalUsers??'—') : (ov.convertedLeads??'—')}            color="violet"/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card p-5">
          <h3 className="section-title mb-4">Lead Trends</h3>
          {lot.length>0?(
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={lot}>
                <defs>
                  <linearGradient id="al" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#a8ff3e" stopOpacity={0.2}/><stop offset="95%" stopColor="#a8ff3e" stopOpacity={0}/></linearGradient>
                  <linearGradient id="ac" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                </defs>
                <XAxis dataKey="date" tickFormatter={d=>d.slice(5)}/>
                <YAxis allowDecimals={false}/>
                <Tooltip content={<TT/>}/>
                <Legend wrapperStyle={{color:'rgba(148,163,184,0.6)',fontSize:12}}/>
                <Area type="monotone" dataKey="leads"     stroke="#a8ff3e" fill="url(#al)" strokeWidth={2} name="New Leads"/>
                <Area type="monotone" dataKey="converted" stroke="#10b981" fill="url(#ac)" strokeWidth={2} name="Converted"/>
              </AreaChart>
            </ResponsiveContainer>
          ):<div className="h-52 flex items-center justify-center text-slate-600 text-sm">No data yet</div>}
        </div>

        <div className="card p-5">
          <h3 className="section-title mb-4">Ticket Status</h3>
          {tt.byStatus?.length>0?(
            <>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={tt.byStatus} dataKey="count" nameKey="_id" innerRadius={45} outerRadius={65} paddingAngle={3}>
                    {tt.byStatus.map((e,i)=><Cell key={i} fill={T_COLORS[e._id]||COLORS[i]}/>)}
                  </Pie>
                  <Tooltip content={<TT/>}/>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {tt.byStatus.map((s,i)=>(
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{background:T_COLORS[s._id]||COLORS[i]}}/><span className="text-slate-400">{s._id}</span></div>
                    <span className="text-slate-200 font-medium">{s.count}</span>
                  </div>
                ))}
              </div>
            </>
          ):<div className="h-40 flex items-center justify-center text-slate-600 text-sm">No data</div>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="section-title mb-4">Lead Pipeline</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={pip} layout="vertical">
              <XAxis type="number" allowDecimals={false}/>
              <YAxis type="category" dataKey="status" width={120} tick={{fontSize:11}}/>
              <Tooltip content={<TT/>}/>
              <Bar dataKey="count" name="Leads" radius={[0,6,6,0]}>
                {pip.map((e,i)=><Cell key={i} fill={S_COLORS[e.status]||COLORS[i]}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="section-title mb-4">Affiliate Performance</h3>
          {aff.length>0?(
            <div className="space-y-3">
              {aff.slice(0,5).map((a,i)=>{
                const isSelf = a.email === user?.email;
                return (
                  <div key={i} className={`flex items-center gap-3 p-2 rounded-xl transition-all ${isSelf ? 'bg-[#a8ff3e]/10 border border-[#a8ff3e]/20 shadow-[0_0_12px_rgba(168,255,62,0.1)]' : 'border border-transparent'}`}>
                    <Avatar name={a.name} avatar={a.avatar} size={28} className="rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-slate-200 text-sm font-medium truncate">{a.name} {isSelf && <span className="text-[10px] text-[#a8ff3e] font-semibold ml-1">(You)</span>}</span>
                        <span className="text-emerald-400 text-xs font-medium ml-2">{a.converted} conv.</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{width:`${Math.min(a.conversionRate||0,100)}%`, background:'linear-gradient(90deg, #10b981, #a8ff3e)'}}/>
                      </div>
                      <div className="text-slate-600 text-xs mt-0.5">{a.totalLeads} leads · {(a.conversionRate||0).toFixed(1)}% rate</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ):<div className="h-48 flex items-center justify-center text-slate-600 text-sm">No affiliate data yet</div>}
        </div>
      </div>

      {tt.byPriority?.length>0&&(
        <div className="card p-5">
          <h3 className="section-title mb-4">Ticket Priority Breakdown</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={tt.byPriority}>
              <XAxis dataKey="_id"/>
              <YAxis allowDecimals={false}/>
              <Tooltip content={<TT/>}/>
              <Bar dataKey="count" name="Tickets" radius={[6,6,0,0]}>
                {tt.byPriority.map((e,i)=><Cell key={i} fill={e._id==='High'?'#ef4444':e._id==='Medium'?'#a8ff3e':'#1b3a24'}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
