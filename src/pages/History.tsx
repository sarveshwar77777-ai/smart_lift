import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { WaitingRecord } from '../types';
import { Trash2, Search, Filter, Clock, Timer } from 'lucide-react';

export default function History() {
  const { user } = useAuth();
  const [records, setRecords]     = useState<WaitingRecord[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [filterLift, setLift]     = useState('All');
  const [filterCrowd, setCrowd]   = useState('All');
  const [sortDir, setSort]        = useState<'desc'|'asc'>('desc');

  useEffect(() => {
    if (user) fetchRecords();
  }, [user]);

  const fetchRecords = async () => {
    const { data } = await supabase
      .from('waiting_records')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });
    if (data) setRecords(data as WaitingRecord[]);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this record?')) return;
    await supabase.from('waiting_records').delete().eq('id', id);
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const filtered = records
    .filter(r => filterLift  === 'All' || r.lift_number === filterLift)
    .filter(r => filterCrowd === 'All' || r.crowd_level === filterCrowd)
    .filter(r => {
      const q = search.toLowerCase();
      return !q || r.lift_number.toLowerCase().includes(q)
                || r.floor.toLowerCase().includes(q)
                || (r.notes ?? '').toLowerCase().includes(q);
    })
    .sort((a, b) =>
      sortDir === 'desc'
        ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        : new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

  const lifts = ['All', ...Array.from(new Set(records.map(r => r.lift_number)))];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Waiting History</h1>
          <p className="page-subtitle">{records.length} record{records.length !== 1 ? 's' : ''} collected</p>
        </div>
        <Link to="/timer" className="btn-primary self-start">
          <Timer className="w-4 h-4" /> New Record
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text" placeholder="Search by lift, floor, notes…"
              value={search} onChange={e => setSearch(e.target.value)}
              className="input-field pl-9 py-2"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select value={filterLift} onChange={e => setLift(e.target.value)} className="input-field py-2 pr-8 w-auto">
              {lifts.map(l => <option key={l}>{l}</option>)}
            </select>
            <select value={filterCrowd} onChange={e => setCrowd(e.target.value)} className="input-field py-2 pr-8 w-auto">
              {['All','Low','Medium','High'].map(c => <option key={c}>{c}</option>)}
            </select>
            <button
              onClick={() => setSort(d => d === 'desc' ? 'asc' : 'desc')}
              className="btn-secondary py-2 px-3 text-xs"
            >
              {sortDir === 'desc' ? 'Newest first' : 'Oldest first'}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400 text-sm">Loading records…</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-4 text-center px-4">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
              <Clock className="w-7 h-7 text-gray-400" />
            </div>
            <div>
              <p className="font-semibold text-gray-700 mb-1">
                {records.length === 0 ? 'No waiting records yet' : 'No records match your filters'}
              </p>
              <p className="text-sm text-gray-400">
                {records.length === 0
                  ? 'Start the timer to collect your first record.'
                  : 'Try adjusting the search or filter options.'}
              </p>
            </div>
            {records.length === 0 && (
              <Link to="/timer" className="btn-primary text-sm">Start Timer</Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide">
                  <th className="px-5 py-3 text-left font-semibold">Date & Time</th>
                  <th className="px-5 py-3 text-left font-semibold">Lift</th>
                  <th className="px-5 py-3 text-left font-semibold">Floor</th>
                  <th className="px-5 py-3 text-left font-semibold">Crowd</th>
                  <th className="px-5 py-3 text-right font-semibold">Wait Time</th>
                  <th className="px-5 py-3 text-left font-semibold">Notes</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 text-gray-700">
                      {new Date(r.observation_date).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'})}
                      <br /><span className="text-xs text-gray-400">{r.observation_time.slice(0,5)}</span>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-gray-900">{r.lift_number}</td>
                    <td className="px-5 py-3.5 text-gray-700">{r.floor}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                        r.crowd_level === 'Low'    ? 'bg-green-100 text-green-700' :
                        r.crowd_level === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>{r.crowd_level}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-blue-700">
                      {r.wait_seconds}s
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 max-w-[160px] truncate">{r.notes ?? '—'}</td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => handleDelete(r.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
