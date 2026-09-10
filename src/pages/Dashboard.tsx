import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { WaitingRecord } from '../types';
import {
  Timer, History, BarChart3, TrendingUp, TrendingDown,
  Clock, Users, ArrowRight, AlertTriangle, Plus
} from 'lucide-react';

function StatCard({ title, value, sub, icon: Icon, trend }: {
  title: string; value: string; sub?: string;
  icon: React.ElementType; trend?: 'up' | 'down' | null;
}) {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</span>
        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
          <Icon className="w-4 h-4 text-blue-600" />
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
      {sub && (
        <div className="flex items-center gap-1 mt-1">
          {trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-green-500" />}
          {trend === 'up'   && <TrendingUp   className="w-3.5 h-3.5 text-red-500" />}
          <span className="text-xs text-gray-500">{sub}</span>
        </div>
      )}
    </div>
  );
}

function EmptyState({ message, action }: { message: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Clock className="w-7 h-7 text-gray-400" />
      </div>
      <p className="text-gray-500 text-sm mb-4">{message}</p>
      {action}
    </div>
  );
}

export default function Dashboard() {
  const { profile, user } = useAuth();
  const [records, setRecords]   = useState<WaitingRecord[]>([]);
  const [loading, setLoading]   = useState(true);

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
    } catch { /* no-op */ }
    finally { setLoading(false); }
  };

  const today = new Date().toISOString().split('T')[0];
  const todayRecords = records.filter(r => r.observation_date === today);
  const avgWait = records.length
    ? Math.round(records.reduce((s, r) => s + r.wait_seconds, 0) / records.length)
    : null;
  const todayAvg = todayRecords.length
    ? Math.round(todayRecords.reduce((s, r) => s + r.wait_seconds, 0) / todayRecords.length)
    : null;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">{greeting}, {profile?.full_name?.split(' ')[0] ?? 'Student'} 👋</h1>
          <p className="page-subtitle">Here's your lift waiting overview</p>
        </div>
        <Link to="/timer" className="btn-primary self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Start Timer
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Records"
          value={loading ? '—' : String(records.length)}
          sub={records.length === 0 ? 'Record your first wait' : 'all time'}
          icon={History}
        />
        <StatCard
          title="Overall Avg Wait"
          value={loading ? '—' : avgWait !== null ? `${avgWait}s` : 'No data'}
          sub={avgWait !== null ? 'across all records' : undefined}
          icon={Clock}
        />
        <StatCard
          title="Today's Trips"
          value={loading ? '—' : String(todayRecords.length)}
          sub="recorded today"
          icon={Users}
        />
        <StatCard
          title="Today's Avg Wait"
          value={loading ? '—' : todayAvg !== null ? `${todayAvg}s` : 'No data'}
          sub={todayAvg !== null ? 'today only' : 'no records today'}
          icon={TrendingUp}
        />
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent records */}
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Records</h2>
            <Link to="/history" className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <div className="py-12 text-center text-sm text-gray-400">Loading…</div>
          ) : records.length === 0 ? (
            <EmptyState
              message="No waiting records yet. Start the timer to collect your first record."
              action={<Link to="/timer" className="btn-primary text-sm">Start Timer</Link>}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                    <th className="px-6 py-3 text-left font-semibold">Date</th>
                    <th className="px-6 py-3 text-left font-semibold">Lift</th>
                    <th className="px-6 py-3 text-left font-semibold">Floor</th>
                    <th className="px-6 py-3 text-left font-semibold">Crowd</th>
                    <th className="px-6 py-3 text-right font-semibold">Wait</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {records.slice(0, 8).map(r => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3 text-gray-600">
                        {new Date(r.observation_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        {' '}<span className="text-gray-400">{r.observation_time.slice(0,5)}</span>
                      </td>
                      <td className="px-6 py-3 text-gray-900 font-medium">{r.lift_number}</td>
                      <td className="px-6 py-3 text-gray-600">{r.floor}</td>
                      <td className="px-6 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                          r.crowd_level === 'Low'    ? 'bg-green-100 text-green-700' :
                          r.crowd_level === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>{r.crowd_level}</span>
                      </td>
                      <td className="px-6 py-3 text-right font-bold text-gray-900">{r.wait_seconds}s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick actions + notice */}
        <div className="space-y-4">
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link to="/timer"      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 border border-gray-100 transition-colors group">
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <Timer className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Start Waiting Timer</div>
                  <div className="text-xs text-gray-400">Record a new wait time</div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 ml-auto" />
              </Link>
              <Link to="/analytics"  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 border border-gray-100 transition-colors group">
                <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">View Analytics</div>
                  <div className="text-xs text-gray-400">Trends &amp; patterns</div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 ml-auto" />
              </Link>
              <Link to="/prediction" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 border border-gray-100 transition-colors group">
                <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Get Prediction</div>
                  <div className="text-xs text-gray-400">Estimate wait time</div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 ml-auto" />
              </Link>
            </div>
          </div>

          {records.length < 5 && (
            <div className="card p-5 bg-amber-50 border-amber-200">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-amber-800">Not enough data yet</div>
                  <p className="text-xs text-amber-700 mt-1">
                    The prediction engine needs at least 5 records to generate estimates.
                    You have {records.length}. Keep recording!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
