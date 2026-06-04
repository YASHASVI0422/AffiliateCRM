import React, { useState, useEffect, useCallback } from 'react';
import { Search, Users, Shield, UserCheck, UserX, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../api/axios';
import { Badge, EmptyState, Pagination, Spinner } from '../../components/ui';
import CustomSelect from '../../components/ui/CustomSelect';
import Avatar from '../../components/ui/Avatar';
import toast from 'react-hot-toast';

export default function UsersPage() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [pg, setPg]           = useState({ page:1,pages:1,total:0 });
  const [search, setSearch]   = useState('');
  const [role, setRole]       = useState('');

  const load = useCallback(async (page=1) => {
    setLoading(true);
    try { const {data}=await api.get('/users',{ params:{page,limit:10,search,role} }); setUsers(data.data); setPg(data.pagination); }
    catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  }, [search, role]);

  useEffect(()=>{ load(); },[load]);

  const toggleActive = async (id, cur) => {
    try { await api.put(`/users/${id}`,{ isActive:!cur }); toast.success(`User ${!cur?'activated':'deactivated'}`); load(pg.page); }
    catch { toast.error('Failed'); }
  };

  const updateRole = async (id, r) => {
    try { await api.put(`/users/${id}`,{ role:r }); toast.success('Role updated'); load(pg.page); }
    catch { toast.error('Failed'); }
  };

  const admins = users.filter(u=>u.role==='admin').length;
  const affs   = users.filter(u=>u.role==='affiliate').length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="page-title">User Management</h1><p className="text-slate-500 text-sm mt-0.5">{pg.total} registered users</p></div>
        <button onClick={()=>load()} className="btn-secondary flex items-center gap-2 text-sm"><RefreshCw size={14}/>Refresh</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[['Total',pg.total,Users,'cyan'],['Admins',admins,Shield,'amber'],['Affiliates',affs,UserCheck,'emerald']].map(([l,v,Icon,c])=>{
          const colors = {
            cyan:   { text:'text-cyan-400',    bg:'rgba(6,182,212,0.1)' },
            amber:  { text:'text-amber-400',   bg:'rgba(245,158,11,0.1)' },
            emerald:{ text:'text-emerald-400',  bg:'rgba(16,185,129,0.1)' },
          }[c];
          return (
            <div key={l} className="card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:colors.bg}}><Icon size={20} className={colors.text}/></div>
              <div><div className="text-xl font-bold text-slate-100" style={{fontFamily:'Sora,sans-serif'}}>{v}</div><div className="text-slate-500 text-xs">{l} Users</div></div>
            </div>
          );
        })}
      </div>

      <div className="card p-4 flex gap-3">
        <div className="relative flex-1"><Search size={15} className="absolute left-3.5 top-2.5 text-slate-500"/><input className="input pl-10 py-2 text-sm" placeholder="Search users..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
        <div className="w-36"><CustomSelect value={role} onChange={setRole} options={[{value:'admin',label:'Admin'},{value:'affiliate',label:'Affiliate'}]} placeholder="All Roles"/></div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-white/8">{['User','Code','Role','Status','Joined','Actions'].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{h}</th>)}</tr></thead>
          <tbody>
            {loading?<tr><td colSpan={6} className="py-16 text-center"><Spinner/></td></tr>
            :users.length===0?<tr><td colSpan={6}><EmptyState icon={Users} title="No users found" description="No users match your filters"/></td></tr>
            :users.map(u=>(
              <tr key={u._id} className="table-row">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={u.name} avatar={u.avatar} size={32} className="rounded-lg" />
                    <div><div className="text-slate-200 text-sm font-medium">{u.name}</div><div className="text-slate-500 text-xs">{u.email}</div></div>
                  </div>
                </td>
                <td className="px-4 py-3"><span className="font-mono text-xs text-cyan-400">{u.affiliateCode||'—'}</span></td>
                <td className="px-4 py-3">
                  <select className="text-xs text-slate-300 cursor-pointer focus:outline-none rounded-lg px-2 py-1 border border-white/8 hover:border-cyan-500/20 transition-all" style={{background:'transparent'}} value={u.role} onChange={e=>updateRole(u._id,e.target.value)}>
                    <option value="affiliate" style={{background:'#060910'}}>Affiliate</option>
                    <option value="admin"     style={{background:'#060910'}}>Admin</option>
                  </select>
                </td>
                <td className="px-4 py-3"><span className={`badge ${u.isActive?'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20':'bg-red-500/15 text-red-300 border border-red-500/20'}`}><span className={`w-1.5 h-1.5 rounded-full ${u.isActive?'bg-emerald-400':'bg-red-400'}`}/>{u.isActive?'Active':'Inactive'}</span></td>
                <td className="px-4 py-3"><span className="text-slate-500 text-xs">{format(new Date(u.createdAt),'MMM d, yyyy')}</span></td>
                <td className="px-4 py-3">
                  <button onClick={()=>toggleActive(u._id,u.isActive)} className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition-all ${u.isActive?'text-red-400 border-red-500/20 hover:bg-red-500/10':'text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10'}`}>
                    {u.isActive?<><UserX size={12}/>Deactivate</>:<><UserCheck size={12}/>Activate</>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 pb-4"><Pagination page={pg.page} pages={pg.pages} onPage={load}/></div>
      </div>
    </div>
  );
}
