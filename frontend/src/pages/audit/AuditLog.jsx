import React, { useState, useEffect, useCallback } from 'react';
import { Clock, RefreshCw, ClipboardList, ShieldAlert } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Pagination, SkeletonLoader } from '../../components/ui';
import CustomSelect from '../../components/ui/CustomSelect';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const ENTITY_TYPES = ['All', 'Lead', 'Ticket', 'User'];
const ACTIVITY_TYPES = [
  { value: 'All', label: 'All Actions' },
  { value: 'lead_created', label: 'Lead Created' },
  { value: 'lead_updated', label: 'Lead Updated' },
  { value: 'lead_converted', label: 'Lead Converted' },
  { value: 'ticket_created', label: 'Ticket Created' },
  { value: 'ticket_replied', label: 'Ticket Replied' },
  { value: 'ticket_updated', label: 'Ticket Updated' },
  { value: 'user_registered', label: 'User Registered' },
  { value: 'user_login', label: 'User Login' }
];

export default function AuditLog() {
  const { isAdmin } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pg, setPg] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({ entityType: 'All', type: 'All' });

  const fetchActivities = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get('/analytics/activity', {
        params: {
          page,
          limit: 15,
          entityType: filters.entityType,
          type: filters.type
        }
      });
      setActivities(data.data || []);
      setPg(data.pagination || { page: 1, pages: 1, total: 0 });
    } catch {
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <ShieldAlert size={48} className="text-red-500 mb-4" />
        <h2 className="text-slate-100 font-semibold text-lg" style={{ fontFamily: 'Sora, sans-serif' }}>Access Denied</h2>
        <p className="text-slate-500 text-sm mt-1">Admin access required to view audit logs.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title text-slate-100 font-semibold text-2xl" style={{ fontFamily: 'Sora, sans-serif' }}>
            Audit Log
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">{pg.total} events logged</p>
        </div>
        <button onClick={() => fetchActivities(pg.page)} className="btn-secondary flex items-center gap-2 text-sm">
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      <div className="card p-4 flex flex-wrap gap-3">
        <div className="w-48">
          <label className="label">Entity Type</label>
          <CustomSelect 
            value={filters.entityType} 
            onChange={v => setFilters(p => ({ ...p, entityType: v }))} 
            options={ENTITY_TYPES} 
            placeholder="All Entity Types"
          />
        </div>
        <div className="w-60">
          <label className="label">Action Type</label>
          <CustomSelect 
            value={filters.type} 
            onChange={v => setFilters(p => ({ ...p, type: v }))} 
            options={ACTIVITY_TYPES} 
            placeholder="All Actions"
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full font-sans">
            <thead>
              <tr className="border-b border-white/8 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left font-medium">Time</th>
                <th className="px-4 py-3 text-left font-medium">User</th>
                <th className="px-4 py-3 text-left font-medium">Action</th>
                <th className="px-4 py-3 text-left font-medium">Entity Type</th>
                <th className="px-4 py-3 text-left font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center">
                    <SkeletonLoader rows={6} height="48px" />
                  </td>
                </tr>
              ) : activities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-500 text-sm">
                    No activity records found matching filters.
                  </td>
                </tr>
              ) : (
                activities.map(activity => (
                  <tr key={activity._id} className="table-row border-b border-white/4 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {format(new Date(activity.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                    </td>
                    <td className="px-4 py-3 text-slate-200 text-sm font-medium">
                      {activity.user?.name || 'System'}
                      <div className="text-slate-500 text-xs font-normal">{activity.user?.email || 'N/A'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-mono capitalize bg-white/5 border border-white/10 text-slate-300">
                        {activity.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-sm">
                      {activity.entityType || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-slate-300 text-sm leading-relaxed max-w-sm whitespace-normal break-words">
                      {activity.description}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 pb-4">
          <Pagination page={pg.page} pages={pg.pages} onPage={fetchActivities} />
        </div>
      </div>
    </div>
  );
}
