import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Search, Ticket, RefreshCw, ArrowUpRight, MessageSquare, Image, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Badge, Modal, EmptyState, Pagination, SkeletonLoader } from '../../components/ui';
import CustomSelect from '../../components/ui/CustomSelect';
import toast from 'react-hot-toast';

const CATS = ['Technical','Billing','General','Feature Request','Bug Report'];
const EMPTY = { subject:'',description:'',priority:'Medium',category:'General' };
const pColors = { Low:'text-slate-400', Medium:'text-amber-400', High:'text-red-400' };

export default function Tickets() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [pg, setPg]             = useState({ page:1,pages:1,total:0 });
  const [filters, setFilters]   = useState({ search:'',status:'',priority:'' });
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]         = useState(EMPTY);
  const [screenshot, setScreenshot] = useState('');
  const [saving, setSaving]     = useState(false);

  const fileInputRef = useRef(null);

  const fetch = useCallback(async (page=1) => {
    setLoading(true);
    try { const {data}=await api.get('/tickets',{ params:{page,limit:10,...filters} }); setTickets(data.data); setPg(data.pagination); }
    catch { toast.error('Failed to load tickets'); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(()=>{ fetch(); },[fetch]);

  const create = async () => {
    if (!form.subject||!form.description) return toast.error('Subject and description required');
    setSaving(true);
    try { 
      await api.post('/tickets', { ...form, screenshot }); 
      toast.success('Ticket created'); 
      setShowModal(false); 
      setForm(EMPTY); 
      setScreenshot('');
      fetch(); 
    }
    catch(e) { toast.error(e.response?.data?.message||'Failed'); }
    finally { setSaving(false); }
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        const reader = new FileReader();
        reader.onloadend = () => {
          setScreenshot(reader.result);
          toast.success('Screenshot pasted');
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="page-title text-slate-100 font-semibold text-2xl" style={{ fontFamily: 'Sora, sans-serif' }}>Support Tickets</h1><p className="text-slate-500 text-sm mt-0.5">{pg.total} tickets</p></div>
        <div className="flex gap-2">
          <button onClick={()=>fetch()} className="btn-secondary flex items-center gap-2 text-sm"><RefreshCw size={14}/>Refresh</button>
          <button onClick={()=>{setForm(EMPTY); setScreenshot(''); setShowModal(true);}} className="btn-primary flex items-center gap-2 text-sm"><Plus size={16}/>New Ticket</button>
        </div>
      </div>

      <div className="card p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48"><Search size={15} className="absolute left-3.5 top-2.5 text-slate-500"/><input className="input pl-10 py-2 text-sm" placeholder="Search..." value={filters.search} onChange={e=>setFilters(p=>({...p,search:e.target.value}))}/></div>
        <div className="w-44"><CustomSelect value={filters.status} onChange={v=>setFilters(p=>({...p,status:v}))} options={['Open','In Progress','Resolved','Closed']} placeholder="All Statuses"/></div>
        <div className="w-44"><CustomSelect value={filters.priority} onChange={v=>setFilters(p=>({...p,priority:v}))} options={['Low','Medium','High']} placeholder="All Priorities"/></div>
      </div>

      {loading?<div className="space-y-3"><SkeletonLoader rows={4} height="80px" /></div>
      :tickets.length===0?<div className="card"><EmptyState icon={Ticket} title="No tickets" description="Create a ticket to get support" action={<button onClick={()=>setShowModal(true)} className="btn-primary text-sm flex items-center gap-2 mx-auto"><Plus size={14}/>New Ticket</button>}/></div>
      :<div className="space-y-2">
        {tickets.map(t=>(
          <div key={t._id} onClick={()=>navigate(`/tickets/${t._id}`)} className="card p-4 cursor-pointer hover:border-[#a8ff3e]/15 transition-all duration-200 group">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-[#a8ff3e]/10 transition-colors">
                <Ticket size={18} className="text-slate-500 group-hover:text-[#a8ff3e] transition-colors"/>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                   <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-[#a8ff3e]">{t.ticketId}</span>
                      <Badge label={t.status}/>
                      <span className={`text-xs font-medium ${pColors[t.priority]}`}>● {t.priority}</span>
                    </div>
                    <h3 className="text-slate-200 font-medium text-sm">{t.subject}</h3>
                    <p className="text-slate-500 text-xs mt-0.5 truncate max-w-xl">{t.description}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {t.replies?.length>0&&<div className="flex items-center gap-1 text-slate-500 text-xs"><MessageSquare size={12}/><span>{t.replies.length}</span></div>}
                    <ArrowUpRight size={16} className="text-slate-600 group-hover:text-[#a8ff3e] transition-colors"/>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
                  {isAdmin&&<span>{t.user?.name}</span>}
                  <span>{t.category}</span>
                  <span>{formatDistanceToNow(new Date(t.createdAt),{addSuffix:true})}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="card px-4 py-2"><Pagination page={pg.page} pages={pg.pages} onPage={fetch}/></div>
      </div>}

      <Modal isOpen={showModal} onClose={()=>setShowModal(false)} title="New Ticket" size="md">
        <div className="space-y-4">
          <div><label className="label">Subject *</label><input className="input text-sm" placeholder="Brief description" value={form.subject} onChange={e=>setForm(p=>({...p,subject:e.target.value}))}/></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Category</label><CustomSelect value={form.category} onChange={v=>setForm(p=>({...p,category:v}))} options={CATS}/></div>
            <div><label className="label">Priority</label><CustomSelect value={form.priority} onChange={v=>setForm(p=>({...p,priority:v}))} options={['Low','Medium','High']}/></div>
          </div>
          <div>
            <label className="label">Description *</label>
            <textarea 
              className="input text-sm resize-none" 
              rows={5} 
              placeholder="Describe your issue... (Paste screenshot/image directly here)" 
              value={form.description} 
              onChange={e=>setForm(p=>({...p,description:e.target.value}))}
              onPaste={handlePaste}
            />
          </div>
          <div>
            <label className="label">Screenshot / Image Attachment</label>
            <div className="flex items-center gap-3">
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()} 
                className="btn-secondary flex items-center gap-2 text-xs py-2"
              >
                <Image size={14} />
                Attach Screenshot
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  if (!file.type.startsWith('image/')) {
                    toast.error('Please select an image file');
                    return;
                  }
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setScreenshot(reader.result);
                    toast.success('Screenshot attached');
                  };
                  reader.readAsDataURL(file);
                }} 
                accept="image/*" 
                className="hidden" 
              />
              {screenshot && <span className="text-xs text-emerald-400">Attached successfully</span>}
            </div>
            {screenshot && (
              <div className="relative inline-block mt-3">
                <div className="relative w-32 h-20 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                  <img src={screenshot} alt="Attachment Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button" 
                    onClick={() => setScreenshot('')} 
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center text-slate-400 hover:text-white transition-colors border border-white/10"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-5">
          <button onClick={()=>setShowModal(false)} className="btn-secondary text-sm">Cancel</button>
          <button onClick={create} disabled={saving} className="btn-primary text-sm flex items-center gap-2">{saving&&<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>}Submit Ticket</button>
        </div>
      </Modal>
    </div>
  );
}
