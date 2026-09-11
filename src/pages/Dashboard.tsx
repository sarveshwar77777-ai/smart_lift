import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { WaitingRecord } from '../types';
import {
  Timer, History, BarChart3, TrendingUp, TrendingDown,
  Clock, Users, ArrowRight, AlertTriangle, Plus,
  ShieldCheck, Sparkles, MessageSquare, Activity
} from 'lucide-react';
import { formatDuration } from '../utils/helpers';

export default function Dashboard() {
  const { profile, user } = useAuth();
  const [records, setRecords] = useState<WaitingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const { data } = await supabase
        .from('waiting_records')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (data) setRecords(data as WaitingRecord[]);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const todayRecords = records.filter(r => (r.observation_date || r.created_at?.split('T')[0]) === today);

  const allWaitTimes = records.map(r => r.wait_seconds);
  const avgWait = allWaitTimes.length
    ? Math.round(allWaitTimes.reduce((s, r) => s + r, 0) / allWaitTimes.length)
    : null;

  const todayAvg = todayRecords.length
    ? Math.round(todayRecords.reduce((s, r) => s + r.wait_seconds, 0) / todayRecords.length)
    : null;

  const shortestWait = allWaitTimes.length ? Math.min(...allWaitTimes) : null;
  const longestWait = allWaitTimes.length ? Math.max(...allWaitTimes) : null;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner & Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-1.5">
            <Activity className="w-3.5 h-3.5" />
            Live Dashboard
          </div>
          <h1 className="page-title">{greeting}, {profile?.full_name?.split(' ')[0] || 'Student'} 👋</h1>
          <p className="page-subtitle">Elevator waiting overview &amp; research dataset tracker</p>
        </div>
        <Link to="/timer" className="btn-primary self-start sm:self-auto shadow-sm">
          <Plus className="w-4 h-4" /> Start Waiting Timer
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Records</span>
            <History className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{loading ? '—' : records.length}</div>
          <div className="text-xs text-gray-400 mt-1">
            {records.length === 0 ? 'No observations yet' : 'Real collected timings'}
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Average Wait</span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {loading ? '—' : avgWait !== null ? formatDuration(avgWait) : 'No data'}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {avgWait !== null ? `${avgWait}s across all records` : 'Record to see average'}
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Today's Records</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{loading ? '—' : todayRecords.length}</div>
          <div className="text-xs text-gray-400 mt-1">
            {todayAvg !== null ? `Avg: ${formatDuration(todayAvg)}` : 'No logs today'}
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Wait Range</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {loading ? '—' : shortestWait !== null ? `${formatDuration(shortestWait)} - ${formatDuration(longestWait!)}` : 'No data'}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {shortestWait !== null ? 'Min to max wait recorded' : 'Zero observations'}
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Observations & Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Records Table */}
        <div className="lg:col-span-2 card overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <History className="w-4 h-4 text-blue-600" />
                Recent Observations
              </h2>
              <Link to="/history" className="text-xs text-blue-600 font-semibold flex items-center gap-1 hover:underline">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="py-16 text-center text-sm text-gray-400">Loading dataset…</div>
            ) : records.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-center px-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">No waiting observations yet</p>
                  <p className="text-xs text-gray-400 mt-0.5">Start the timer to collect your first elevator record.</p>
                </div>
                <Link to="/timer" className="btn-primary text-xs mt-1">
                  Start Waiting Timer
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 uppercase font-semibold border-b border-gray-100">
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Period</th>
                      <th className="px-6 py-3">Lift / Floor</th>
                      <th className="px-6 py-3">Crowd</th>
                      <th className="px-6 py-3 text-right">Wait Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {records.slice(0, 6).map(r => {
                      const dateFormatted = new Date(r.observation_date || r.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      });
                      return (
                        <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-3 text-gray-700 font-medium whitespace-nowrap">
                            {dateFormatted} <span className="text-gray-400">{(r.observation_time || '').slice(0, 5)}</span>
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
                              {r.time_period || 'Morning'}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-gray-700 whitespace-nowrap">
                            {r.lift_number} ({r.floor})
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded font-semibold ${
                                r.crowd_level === 'Low'
                                  ? 'bg-green-100 text-green-700'
                                  : r.crowd_level === 'Medium'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {r.crowd_level}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-right font-bold text-blue-700 whitespace-nowrap font-mono text-sm">
                            {formatDuration(r.wait_seconds)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-100 text-[11px] text-gray-500 flex items-center justify-between">
            <span>Zero synthetic records · Purely manual timer observations</span>
            <Link to="/history" className="text-blue-600 font-medium hover:underline">
              Filter &amp; Search →
            </Link>
          </div>
        </div>

        {/* Quick Actions & Status */}
        <div className="space-y-4">
          <div className="card p-6 space-y-3">
            <h2 className="font-semibold text-gray-900 text-sm">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                to="/timer"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50/50 border border-gray-100 transition-all group"
              >
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Timer className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">Waiting Timer</div>
                  <div className="text-[11px] text-gray-500">Record in-situ lobby timing</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-300 ml-auto group-hover:text-blue-600" />
              </Link>

              <Link
                to="/analytics"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-50/50 border border-gray-100 transition-all group"
              >
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">Analytics Dashboard</div>
                  <div className="text-[11px] text-gray-500">Peak hours &amp; crowd trends</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-300 ml-auto group-hover:text-indigo-600" />
              </Link>

              <Link
                to="/prediction"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50/50 border border-gray-100 transition-all group"
              >
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">AI Prediction</div>
                  <div className="text-[11px] text-gray-500">Explainable wait estimation</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-300 ml-auto group-hover:text-purple-600" />
              </Link>

              <Link
                to="/validation"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-emerald-50/50 border border-gray-100 transition-all group"
              >
                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">Project Validation</div>
                  <div className="text-[11px] text-gray-500">Hostel student feedback metrics</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-300 ml-auto group-hover:text-emerald-600" />
              </Link>
            </div>
          </div>

          {/* Dataset Status Notice */}
          <div className="card p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-blue-900">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Dataset Quality: {records.length} Real Records
            </div>
            <p className="text-blue-800 leading-relaxed">
              {records.length >= 5
                ? 'Sufficient observations collected for statistical predictions and MAE evaluation.'
                : `Need at least 5 records to activate reliable statistical prediction (${5 - records.length} remaining).`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
