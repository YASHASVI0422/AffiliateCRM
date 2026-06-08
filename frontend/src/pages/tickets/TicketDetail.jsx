import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Shield, Sparkles, Copy, Check, Image, X } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Badge, Spinner } from '../../components/ui';
import CustomSelect from '../../components/ui/CustomSelect';
import Avatar from '../../components/ui/Avatar';
import toast from 'react-hot-toast';

const pColors = { Low:'text-slate-400', Medium:'text-amber-400', High:'text-red-400' };

export default function TicketDetail() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { isAdmin, user } = useAuth();
  const [ticket, setTicket]     = useState(null);
  const [loading, setLoading]   = useState(true);
  const [reply, setReply]       = useState('');
  const [attachment, setAttachment] = useState('');
  const [sending, setSending]   = useState(false);
  const [updating, setUpdating] = useState(false);
  const [aiReply, setAiReply]   = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [copied, setCopied]     = useState(false);
  
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  const load = async () => {
    try { const {data}=await api.get(`/tickets/${id}`); setTicket(data.data); }
    catch { toast.error('Failed to load'); navigate('/tickets'); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ load(); },[id]);
  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:'smooth'}); },[ticket?.replies]);

  const sendReply = async () => {
    if (!reply.trim() && !attachment) return;
    setSending(true);
    try { 
      const {data}=await api.post(`/tickets/${id}/reply`, {
        message: reply,
        screenshot: attachment
      }); 
      setTicket(data.data); 
      setReply(''); 
      setAttachment('');
      setAiReply(''); 
      toast.success('Reply sent'); 
    }
    catch(e) { toast.error(e.response?.data?.message||'Failed'); }
    finally { setSending(false); }
  };

  const update = async (field,value) => {
    setUpdating(true);
    try { const {data}=await api.put(`/tickets/${id}`,{[field]:value}); setTicket(data.data); toast.success('Updated'); }
    catch { toast.error('Failed'); }
    finally { setUpdating(false); }
  };

  const suggest = async () => {
    setAiLoading(true); setAiReply('');
    try { const {data}=await api.post(`/ai/suggest-reply/${id}`); setAiReply(data.data.reply); setReply(data.data.reply); toast.success('AI reply ready'); }
    catch(e) { toast.error(e.response?.data?.message || 'AI failed — check GEMINI_API_KEY in backend .env'); }
    finally { setAiLoading(false); }
  };

  const copyAi = () => { navigator.clipboard.writeText(aiReply); setCopied(true); setTimeout(()=>setCopied(false),2000); toast.success('Copied'); };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachment(reader.result);
      toast.success('Screenshot attached');
    };
    reader.readAsDataURL(file);
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        const reader = new FileReader();
        reader.onloadend = () => {
          setAttachment(reader.result);
          toast.success('Screenshot pasted from clipboard');
        };
        reader.readAsDataURL(file);
      }
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size={8}/></div>;
  if (!ticket) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={()=>navigate('/tickets')} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/8 hover:bg-white/10 hover:border-[#a8ff3e]/20 text-slate-400 hover:text-slate-200 transition-all"><ArrowLeft size={16}/></button>
        <div className="flex-1">
          <div className="flex items-center gap-2"><span className="font-mono text-sm text-[#a8ff3e]">{ticket.ticketId}</span><Badge label={ticket.status}/><span className={`text-xs font-medium ${pColors[ticket.priority]}`}>● {ticket.priority}</span></div>
          <h1 className="text-slate-100 font-semibold text-lg" style={{fontFamily:'Sora,sans-serif'}}>{ticket.subject}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Conversation Area */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Chat Timeline Container */}
          <div className="card p-5 space-y-5 max-h-[600px] overflow-y-auto scrollbar-thin py-6">
            
            {/* Original Ticket Description (Bubble Left) */}
            <div className="flex items-start gap-3 justify-start">
              <Avatar name={ticket.user?.name} avatar={ticket.user?.avatar} size={36} className="rounded-xl flex-shrink-0" />
              <div className="max-w-[80%] rounded-2xl p-4 bg-slate-900/40 border border-white/5 shadow-sm">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-xs font-semibold text-slate-200">{ticket.user?.name}</span>
                  <span className="text-[10px] text-slate-500">{format(new Date(ticket.createdAt),'MMM d, yyyy · h:mm a')}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#a8ff3e]/10 text-[#a8ff3e] border border-[#a8ff3e]/15">{ticket.category}</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
                {ticket.screenshot && (
                  <div className="mt-3">
                    <img 
                      src={ticket.screenshot} 
                      alt="Initial Screenshot" 
                      className="max-w-full rounded-xl border border-white/10 hover:border-[#a8ff3e]/20 cursor-zoom-in hover:scale-[1.01] transition-all"
                      onClick={() => window.open(ticket.screenshot, '_blank')}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Replies (Alternating alignment) */}
            {ticket.replies?.map((r,i)=>{
              const isMe = r.author?._id === user?._id;
              return (
                <div key={i} className={`flex items-start gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
                  {!isMe && (
                    r.isAdmin ? (
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-950 flex-shrink-0 bg-gradient-to-tr from-[#a8ff3e] to-[#10b981] shadow-md"><Shield size={14}/></div>
                    ) : (
                      <Avatar name={r.author?.name} avatar={r.author?.avatar} size={36} className="rounded-xl flex-shrink-0" />
                    )
                  )}
                  <div className={`max-w-[80%] rounded-2xl p-4 border ${
                    isMe 
                      ? 'bg-gradient-to-tr from-[#a8ff3e]/10 to-[#10b981]/10 border-[#a8ff3e]/20 shadow-[0_0_15px_rgba(168,255,62,0.02)]' 
                      : r.isAdmin 
                        ? 'bg-[#a8ff3e]/5 border-[#a8ff3e]/15 shadow-[0_0_15px_rgba(168,255,62,0.01)]' 
                        : 'bg-slate-900/40 border-white/5'
                  }`}>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-xs font-semibold text-slate-200">{r.author?.name}</span>
                      {r.isAdmin && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#a8ff3e]/15 text-[#a8ff3e] font-semibold uppercase tracking-wider scale-90 origin-left">Admin</span>
                      )}
                      <span className="text-[10px] text-slate-500">{format(new Date(r.createdAt),'MMM d, yyyy · h:mm a')}</span>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{r.message}</p>
                    {r.screenshot && (
                      <div className="mt-3">
                        <img 
                          src={r.screenshot} 
                          alt="Reply Screenshot" 
                          className="max-w-full rounded-xl border border-white/10 hover:border-[#a8ff3e]/20 cursor-zoom-in hover:scale-[1.01] transition-all"
                          onClick={() => window.open(r.screenshot, '_blank')}
                        />
                      </div>
                    )}
                  </div>
                  {isMe && (
                    <Avatar name={user?.name} avatar={user?.avatar} size={36} className="rounded-xl flex-shrink-0" />
                  )}
                </div>
              );
            })}
            <div ref={bottomRef}/>
          </div>

          {/* Reply Input Panel */}
          {ticket.status !== 'Closed' && (
            <div className="card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-xs">{isAdmin ? 'Reply as Admin' : 'Reply'}</span>
                <button onClick={suggest} disabled={aiLoading} className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all disabled:opacity-50" style={{background:'rgba(168,255,62,0.12)', border:'1px solid rgba(168,255,62,0.2)', color:'#a8ff3e'}}>
                  {aiLoading?<div className="w-3 h-3 border-2 border-[#a8ff3e] border-t-transparent rounded-full animate-spin"/>:<Sparkles size={12}/>}AI Suggest Reply
                </button>
              </div>
 
              {aiReply && !aiLoading && (
                <div className="rounded-xl p-3 animate-fade-in" style={{background:'rgba(168,255,62,0.06)', border:'1px solid rgba(168,255,62,0.15)'}}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold flex items-center gap-1" style={{color:'#a8ff3e'}}><Sparkles size={11}/>AI Suggestion</span>
                    <button onClick={copyAi} className="flex items-center gap-1 text-xs" style={{color:'#a8ff3e'}}>{copied?<Check size={11}/>:<Copy size={11}/>}{copied?'Copied':'Copy'}</button>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">{aiReply}</p>
                  <p className="text-[#a8ff3e]/50 text-xs mt-2">↑ Auto-filled below. Edit if needed.</p>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Avatar name={user?.name} avatar={user?.avatar} size={36} className="rounded-xl flex-shrink-0" />
                <div className="flex-1">
                  <textarea 
                    className="input text-sm resize-none w-full bg-white/[0.02] border-white/[0.08]" 
                    rows={4} 
                    placeholder="Write a reply... (You can paste a screenshot directly)" 
                    value={reply} 
                    onChange={e=>setReply(e.target.value)} 
                    onKeyDown={e=>{if(e.key==='Enter'&&e.ctrlKey)sendReply();}}
                    onPaste={handlePaste}
                  />

                  {/* Screenshot attachment preview */}
                  {attachment && (
                    <div className="relative inline-block mt-3 animate-slide-up">
                      <div className="relative w-32 h-20 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                        <img src={attachment} alt="Attachment Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button" 
                          onClick={() => setAttachment('')} 
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center text-slate-400 hover:text-white transition-colors border border-white/10"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()} 
                        className="p-2 rounded-xl bg-white/5 border border-white/8 hover:bg-white/10 hover:border-[#a8ff3e]/20 text-slate-400 hover:text-slate-200 transition-all"
                        title="Upload screenshot"
                      >
                        <Image size={15} />
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className="hidden" 
                      />
                      <span className="text-slate-600 text-xs hidden sm:inline">Ctrl+Enter to send</span>
                    </div>
                    
                    <button 
                      onClick={sendReply} 
                      disabled={sending || (!reply.trim() && !attachment)} 
                      className="btn-primary text-sm flex items-center gap-2 py-1.5"
                    >
                      {sending ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> : <Send size={14}/>}
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-3">
          <div className="card p-4">
            <h3 className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-3">Info</h3>
            <div className="space-y-3 text-sm">
              {[['Status',<Badge label={ticket.status}/>],['Priority',<span className={`font-medium ${pColors[ticket.priority]}`}>{ticket.priority}</span>],['Category',<span className="text-slate-400">{ticket.category}</span>],['Replies',<span className="text-slate-400">{ticket.replies?.length||0}</span>]].map(([l,v])=>(
                <div key={l} className="flex justify-between items-center"><span className="text-slate-500">{l}</span>{v}</div>
              ))}
              <div><span className="text-slate-500 block mb-1">Submitted by</span><span className="text-slate-400">{ticket.user?.name}</span></div>
              <div><span className="text-slate-500 block mb-0.5">Created</span><span className="text-slate-400 text-xs">{format(new Date(ticket.createdAt),'MMM d, yyyy')}</span></div>
            </div>
          </div>
          {isAdmin && (
            <div className="card p-4">
              <h3 className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-3">Admin Controls</h3>
              <div className="space-y-3">
                <div><label className="label text-xs">Status</label><CustomSelect value={ticket.status} onChange={v=>update('status',v)} options={['Open','In Progress','Resolved','Closed']}/></div>
                <div><label className="label text-xs">Priority</label><CustomSelect value={ticket.priority} onChange={v=>update('priority',v)} options={['Low','Medium','High']}/></div>
                {ticket.status!=='Closed'&&<button onClick={()=>update('status','Closed')} className="btn-secondary w-full text-sm text-red-400 hover:bg-red-500/10">Close Ticket</button>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
