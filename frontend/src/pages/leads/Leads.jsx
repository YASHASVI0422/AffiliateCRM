import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Edit2, Trash2, Target, RefreshCw, Brain, FileText, Sparkles } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Badge, Modal, ConfirmDialog, EmptyState, Pagination, SkeletonLoader } from '../../components/ui';
import CustomSelect from '../../components/ui/CustomSelect';
import toast from 'react-hot-toast';

const STATUSES = ['New Lead','Contacted','Interested','Joined Community','Converted'];
const SOURCES  = ['Website','Referral','Social Media','Email Campaign','Cold Call','Event','Other'];
const EMPTY    = { name:'',email:'',phone:'',company:'',source:'Website',status:'New Lead',assignedAffiliate:'',notes:'',value:'',followUpDate:'',followUpNote:'' };
const gradeMap = {
  Hot: { bg:'bg-red-500/15',   text:'text-red-300',   border:'border-red-500/20',   dot:'bg-red-400' },
  Warm:{ bg:'bg-amber-500/15', text:'text-amber-300', border:'border-amber-500/20', dot:'bg-amber-400' },
  Cold:{ bg:'bg-slate-500/15', text:'text-slate-300', border:'border-slate-500/20', dot:'bg-slate-400' },
};

export default function Leads() {
  const { isAdmin } = useAuth();
  const [leads, setLeads]           = useState([]);
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [pg, setPg]                 = useState({ page:1,pages:1,total:0 });
  const [filters, setFilters]       = useState({ search:'',status:'',source:'' });
  const [showModal, setShowModal]   = useState(false);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState(EMPTY);
  const [saving, setSaving]         = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [delId, setDelId]           = useState(null);
  const [scores, setScores]         = useState({});
  const [scoringId, setScoringId]   = useState(null);
  const [scoringAll, setScoringAll] = useState(false);
  const [noteModal, setNoteModal]   = useState(false);
  const [noteId, setNoteId]         = useState(null);
  const [note, setNote]             = useState('');
  const [genNote, setGenNote]       = useState(false);

  const fetchLeads = useCallback(async (page=1) => {
    setLoading(true);
    try {
      const { data } = await api.get('/leads',{ params:{ page,limit:10,...filters } });
      setLeads(data.data); setPg(data.pagination);
    } catch { toast.error('Failed to load leads'); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(()=>{ fetchLeads(); },[fetchLeads]);
  useEffect(()=>{ if(isAdmin) api.get('/users/affiliates').then(r=>setAffiliates(r.data.data)).catch(()=>{}); },[isAdmin]);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit   = l  => {
    setEditing(l);
    setForm({
      name:l.name,
      email:l.email,
      phone:l.phone||'',
      company:l.company||'',
      source:l.source,
      status:l.status,
      assignedAffiliate:l.assignedAffiliate?._id||'',
      notes:l.notes||'',
      value:l.value||'',
      followUpDate:l.followUpDate ? new Date(l.followUpDate).toISOString().substring(0, 10) : '',
      followUpNote:l.followUpNote||''
    });
    setShowModal(true);
  };

  const save = async () => {
    if (!form.name||!form.email) return toast.error('Name and email required');
    setSaving(true);
    try {
      if (editing) { await api.put(`/leads/${editing._id}`,form); toast.success('Lead updated'); }
      else          { await api.post('/leads',form);               toast.success('Lead created'); }
      setShowModal(false); fetchLeads(pg.page);
    } catch(e) { toast.error(e.response?.data?.message||'Failed'); }
    finally { setSaving(false); }
  };

  const del = async () => {
    try { await api.delete(`/leads/${delId}`); toast.success('Deleted'); fetchLeads(pg.page); }
    catch { toast.error('Failed'); }
  };

  const scoreSingle = async id => {
    setScoringId(id);
    try { const {data}=await api.post(`/ai/score-lead/${id}`); setScores(p=>({...p,[id]:data.data})); toast.success(`${data.data.grade} lead`); }
    catch(e) { toast.error(e.response?.data?.message || 'Score failed — check GEMINI_API_KEY in .env'); }
    finally { setScoringId(null); }
  };

  const scoreAll = async () => {
    setScoringAll(true);
    try { const {data}=await api.post('/ai/score-all-leads'); const m={}; data.data.forEach(s=>m[s.id]=s); setScores(p=>({...p,...m})); toast.success(`Scored ${data.data.length} leads`); }
    catch(e) { toast.error(e.response?.data?.message || 'Bulk score failed — check GEMINI_API_KEY in .env'); }
    finally { setScoringAll(false); }
  };

  const genNotes = async id => {
    setNoteId(id); setNoteModal(true); setGenNote(true); setNote('');
    try { const {data}=await api.post(`/ai/generate-notes/${id}`); setNote(data.data.notes); }
    catch(e) { setNote(e.response?.data?.message || 'Failed — check GEMINI_API_KEY in .env'); }
    finally { setGenNote(false); }
  };

  const applyNote = async () => {
    if (!note||!noteId) return;
    try { await api.put(`/leads/${noteId}`,{ notes:note }); toast.success('Note saved'); setNoteModal(false); fetchLeads(pg.page); }
    catch { toast.error('Save failed'); }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const response = await api.post('/leads/export', {}, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'leads-export.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Leads exported successfully');
    } catch (e) {
      toast.error('Failed to export leads');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div><h1 className="page-title text-slate-100 font-semibold text-2xl" style={{ fontFamily: 'Sora, sans-serif' }}>Leads</h1><p className="text-slate-500 text-sm mt-0.5">{pg.total} leads in pipeline</p></div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={()=>fetchLeads()} className="btn-secondary flex items-center gap-2 text-sm"><RefreshCw size={14}/>Refresh</button>
          <button onClick={scoreAll} disabled={scoringAll} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50" style={{background:'rgba(168,255,62,0.12)', border:'1px solid rgba(168,255,62,0.2)', color:'#a8ff3e'}}>{scoringAll?<div className="w-4 h-4 border-2 border-[#a8ff3e] border-t-transparent rounded-full animate-spin"/>:<Brain size={14}/>}AI Score All</button>
          {isAdmin && (
            <button onClick={handleExportCSV} disabled={isExporting} className="btn-secondary flex items-center gap-2 text-sm disabled:opacity-50">
              {isExporting ? <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"/> : <FileText size={14}/>}
              Export CSV
            </button>
          )}
          <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm"><Plus size={16}/>Add Lead</button>
        </div>
      </div>

      <div className="card p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48"><Search size={15} className="absolute left-3.5 top-2.5 text-slate-500"/><input className="input pl-10 py-2 text-sm" placeholder="Search..." value={filters.search} onChange={e=>setFilters(p=>({...p,search:e.target.value}))}/></div>
        <div className="w-44"><CustomSelect value={filters.status} onChange={v=>setFilters(p=>({...p,status:v}))} options={STATUSES} placeholder="All Statuses"/></div>
        <div className="w-44"><CustomSelect value={filters.source} onChange={v=>setFilters(p=>({...p,source:v}))} options={SOURCES} placeholder="All Sources"/></div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-white/8">{['Lead','Contact','Source','Status','AI Score','Actions'].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{h}</th>)}</tr></thead>
            <tbody>
              {loading?<tr><td colSpan={6} className="px-4 py-8 text-center"><SkeletonLoader rows={5} height="48px" /></td></tr>
              :leads.length===0?<tr><td colSpan={6}><EmptyState icon={Target} title="No leads" description="Add your first lead to get started" action={<button onClick={openCreate} className="btn-primary text-sm flex items-center gap-2 mx-auto"><Plus size={14}/>Add Lead</button>}/></td></tr>
              :leads.map(l=>{
                const sc=scores[l._id]; const g=sc?gradeMap[sc.grade]||gradeMap.Cold:null;
                return (
                  <tr key={l._id} className="table-row">
                    <td className="px-4 py-3"><div className="font-medium text-slate-200 text-sm">{l.name}</div>{l.company&&<div className="text-slate-500 text-xs">{l.company}</div>}</td>
                    <td className="px-4 py-3"><div className="text-slate-400 text-sm">{l.email}</div>{l.phone&&<div className="text-slate-600 text-xs">{l.phone}</div>}</td>
                    <td className="px-4 py-3"><span className="text-slate-400 text-sm">{l.source}</span></td>
                    <td className="px-4 py-3"><Badge label={l.status}/></td>
                    <td className="px-4 py-3">
                      {sc?<div><div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${g.bg} ${g.text} ${g.border}`}><span className={`w-1.5 h-1.5 rounded-full ${g.dot}`}/>{sc.grade} · {sc.score}/100</div><div className="text-slate-500 text-xs mt-0.5 max-w-xs whitespace-normal break-words">{sc.reason}</div></div>
                      :<button onClick={()=>scoreSingle(l._id)} disabled={scoringId===l._id} className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-all disabled:opacity-50" style={{background:'rgba(168,255,62,0.08)', border:'1px solid rgba(168,255,62,0.15)', color:'#a8ff3e'}}>{scoringId===l._id?<div className="w-3 h-3 border-2 border-[#a8ff3e] border-t-transparent rounded-full animate-spin"/>:<Sparkles size={11}/>}Score</button>}
                    </td>
                    <td className="px-4 py-3"><div className="flex gap-1">
                      <button onClick={()=>genNotes(l._id)} title="AI Notes" className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-[#a8ff3e] hover:bg-[#a8ff3e]/10 transition-all"><FileText size={14}/></button>
                      <button onClick={()=>openEdit(l)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-[#a8ff3e] hover:bg-[#a8ff3e]/10 transition-all"><Edit2 size={14}/></button>
                      <button onClick={()=>setDelId(l._id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={14}/></button>
                    </div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 pb-4"><Pagination page={pg.page} pages={pg.pages} onPage={fetchLeads}/></div>
      </div>

      <Modal isOpen={showModal} onClose={()=>setShowModal(false)} title={editing?'Edit Lead':'Add Lead'} size="lg">
        <div className="grid grid-cols-2 gap-4">
          {[['name','Name *','text'],['email','Email *','email'],['phone','Phone','tel'],['company','Company','text']].map(([k,l,t])=>(
            <div key={k}><label className="label">{l}</label><input type={t} className="input text-sm" placeholder={l.replace(' *','')} value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))}/></div>
          ))}
          <div><label className="label">Source</label><CustomSelect value={form.source} onChange={v=>setForm(p=>({...p,source:v}))} options={SOURCES}/></div>
          <div><label className="label">Status</label><CustomSelect value={form.status} onChange={v=>setForm(p=>({...p,status:v}))} options={STATUSES}/></div>
          {affiliates.length>0&&<div><label className="label">Assign Affiliate</label><CustomSelect value={form.assignedAffiliate} onChange={v=>setForm(p=>({...p,assignedAffiliate:v}))} options={[{value:'',label:'Unassigned'},...affiliates.map(a=>({value:a._id,label:`${a.name} (${a.affiliateCode})`}))]}/></div>}
          <div><label className="label">Deal Value ($)</label><input type="number" className="input text-sm" placeholder="0" value={form.value} onChange={e=>setForm(p=>({...p,value:e.target.value}))}/></div>
          <div><label className="label">Follow-up Date</label><input type="date" className="input text-sm" value={form.followUpDate} onChange={e=>setForm(p=>({...p,followUpDate:e.target.value}))}/></div>
          <div className="col-span-2"><label className="label">Follow-up Note</label><input type="text" className="input text-sm" placeholder="Follow-up note..." value={form.followUpNote} onChange={e=>setForm(p=>({...p,followUpNote:e.target.value}))}/></div>
          <div className="col-span-2"><label className="label">Notes</label><textarea className="input text-sm resize-none" rows={3} placeholder="Notes..." value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}/></div>
        </div>
        <div className="flex gap-3 justify-end mt-5">
          <button onClick={()=>setShowModal(false)} className="btn-secondary text-sm">Cancel</button>
          <button onClick={save} disabled={saving} className="btn-primary text-sm flex items-center gap-2">{saving&&<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>}{editing?'Save Changes':'Create Lead'}</button>
        </div>
      </Modal>

      <Modal isOpen={noteModal} onClose={()=>setNoteModal(false)} title="AI Generated Notes" size="md">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs rounded-xl px-3 py-2" style={{background:'rgba(168,255,62,0.08)', border:'1px solid rgba(168,255,62,0.15)', color:'#a8ff3e'}}><Brain size={13}/>Generated by Claude AI</div>
          {genNote?<div className="flex items-center justify-center gap-3 py-6"><div className="w-5 h-5 border-2 border-[#a8ff3e] border-t-transparent rounded-full animate-spin"/><span className="text-slate-500 text-sm">Writing notes...</span></div>
          :<div className="bg-white/5 border border-white/8 rounded-xl p-4"><pre className="text-slate-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">{note}</pre></div>}
        </div>
        <div className="flex gap-3 justify-end mt-5">
          <button onClick={()=>setNoteModal(false)} className="btn-secondary text-sm">Cancel</button>
          <button onClick={applyNote} disabled={genNote||!note} className="btn-primary text-sm flex items-center gap-2"><FileText size={14}/>Save to Lead</button>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!delId} onClose={()=>setDelId(null)} onConfirm={del} title="Delete Lead" message="Delete this lead permanently?" confirmLabel="Delete" danger/>
    </div>
  );
}
