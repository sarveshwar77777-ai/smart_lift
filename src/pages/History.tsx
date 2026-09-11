import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { WaitingRecord } from '../types';
import {
  Trash2, Search, Filter, Clock, Timer,
  ArrowUpDown, AlertCircle, Calendar
} from 'lucide-react';
import { formatDuration } from '../utils/helpers';

export default function History() {
  const { user } = useAuth();
  const [records, setRecords] = useState<WaitingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('All');
  const [filterCrowd, setFilterCrowd] = useState('All');
  const [filterLift, setFilterLift] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'longest' | 'shortest'>('newest');

  useEffect(() => {
    if (user) fetchRecords();
  }, [user]);

  const fetchRecords = async () => {
    setErrorMsg(null);
    try {
      const { data, error } = await supabase
        .from('waiting_records')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setRecords(data as WaitingRecord[]);
    } catch (err) {
      console.error('Fetch records error:', err);
      setErrorMsg('Could not load observations. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this observation?')) return;
    try {
      const { error } = await supabase.from('waiting_records').delete().eq('id', id);
      if (error) throw error;
      setRecords(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      alert('Unable to delete this observation. Please try again.');
    }
  };

  // Filter & Sort
  const filtered = records
    .filter(r => filterPeriod === 'All' || (r.time_period || 'Morning') === filterPeriod)
    .filter(r => filterCrowd === 'All' || r.crowd_level === filterCrowd)
    .filter(r => filterLift === 'All' || r.lift_number === filterLift)
    .filter(r => {
      const q = search.toLowerCase().trim();
      if (!q) return true;
      return (
        r.lift_number?.toLowerCase().includes(q) ||
        r.floor?.toLowerCase().includes(q) ||
        r.time_period?.toLowerCase().includes(q) ||
        r.day_of_week?.toLowerCase().includes(q) ||
        (r.notes ?? '').toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortBy === 'longest') return b.wait_seconds - a.wait_seconds;
      if (sortBy === 'shortest') return a.wait_seconds - b.wait_seconds;
      return 0;
    });

  const liftOptions = ['All', ...Array.from(new Set(records.map(r => r.lift_number).filter(Boolean)))];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Observation History</h1>
          <p className="page-subtitle">
            {records.length} real observation{records.length !== 1 ? 's' : ''} collected by your account
          </p>
        </div>
        <Link to="/timer" className="btn-primary self-start">
          <Timer className="w-4 h-4" /> Record Observation
        </Link>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by lift, floor, period, notes…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-9 py-2 text-xs sm:text-sm"
            />
          </div>

          {/* Filter dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Filter className="w-3.5 h-3.5" />
            </div>

            {/* Time Period Filter */}
            <select
              value={filterPeriod}
              onChange={e => setFilterPeriod(e.target.value)}
              className="input-field py-1.5 px-2 text-xs w-auto"
              title="Filter by Time Period"
            >
              <option value="All">All Periods</option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
              <option value="Night">Night</option>
            </select>

            {/* Crowd Level Filter */}
            <select
              value={filterCrowd}
              onChange={e => setFilterCrowd(e.target.value)}
              className="input-field py-1.5 px-2 text-xs w-auto"
              title="Filter by Crowd Level"
            >
              <option value="All">All Crowds</option>
              <option value="Low">Low Crowd</option>
              <option value="Medium">Medium Crowd</option>
              <option value="High">High Crowd</option>
            </select>

            {/* Lift Filter */}
            {liftOptions.length > 2 && (
              <select
                value={filterLift}
                onChange={e => setFilterLift(e.target.value)}
                className="input-field py-1.5 px-2 text-xs w-auto"
                title="Filter by Lift"
              >
                {liftOptions.map(l => (
                  <option key={l} value={l}>
                    {l === 'All' ? 'All Lifts' : l}
                  </option>
                ))}
              </select>
            )}

            {/* Sort Options */}
            <div className="flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="input-field py-1.5 px-2 text-xs w-auto font-medium text-gray-700"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="longest">Longest Wait</option>
                <option value="shortest">Shortest Wait</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Observations Table / Card Layout */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-gray-400 text-sm">Loading observations…</div>
        ) : filtered.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-4 text-center px-4">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-base mb-1">
                {records.length === 0 ? 'No observations yet.' : 'No observations match your filters'}
              </p>
              <p className="text-sm text-gray-500 max-w-sm">
                {records.length === 0
                  ? 'Real elevator observations you record with the waiting timer will be preserved here.'
                  : 'Try clearing your search query or reset the period/crowd filters.'}
              </p>
            </div>
            {records.length === 0 ? (
              <Link to="/timer" className="btn-primary text-sm mt-2">
                Record First Observation
              </Link>
            ) : (
              <button
                onClick={() => {
                  setSearch('');
                  setFilterPeriod('All');
                  setFilterCrowd('All');
                  setFilterLift('All');
                }}
                className="btn-secondary text-xs"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide">
                  <th className="px-5 py-3.5 text-left font-semibold">Date &amp; Time</th>
                  <th className="px-5 py-3.5 text-left font-semibold">Time Period</th>
                  <th className="px-5 py-3.5 text-left font-semibold">Lift / Floor</th>
                  <th className="px-5 py-3.5 text-left font-semibold">People Waiting</th>
                  <th className="px-5 py-3.5 text-right font-semibold">Waiting Time</th>
                  <th className="px-5 py-3.5 text-left font-semibold">Notes</th>
                  <th className="px-5 py-3.5 text-center font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(r => {
                  const dateStr = r.observation_date
                    ? new Date(r.observation_date).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : new Date(r.created_at).toLocaleDateString();

                  const timeStr = (r.observation_time || '').slice(0, 5);

                  return (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5 text-gray-700 whitespace-nowrap">
                        <div className="font-medium text-gray-900 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {dateStr}
                        </div>
                        <div className="text-xs text-gray-400 ml-5">{timeStr || 'Recorded'}</div>
                      </td>

                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700">
                          {r.time_period || 'Morning'}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-gray-700 whitespace-nowrap">
                        <span className="font-medium text-gray-900">{r.lift_number}</span>
                        <span className="text-gray-400 text-xs ml-1.5">({r.floor})</span>
                      </td>

                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                              r.crowd_level === 'Low'
                                ? 'bg-green-100 text-green-700'
                                : r.crowd_level === 'Medium'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {r.crowd_level}
                          </span>
                          {r.people_waiting !== undefined && r.people_waiting !== null && (
                            <span className="text-xs text-gray-400">({r.people_waiting} people)</span>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-right font-bold text-blue-700 whitespace-nowrap font-mono text-base">
                        {formatDuration(r.wait_seconds)}
                      </td>

                      <td className="px-5 py-3.5 text-gray-500 max-w-[200px] truncate text-xs">
                        {r.notes ? r.notes : <span className="text-gray-300">—</span>}
                      </td>

                      <td className="px-5 py-3.5 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete observation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
