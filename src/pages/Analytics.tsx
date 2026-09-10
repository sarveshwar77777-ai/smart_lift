import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { WaitingRecord } from '../types';
import { BarChart3, AlertTriangle } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, LineChart, Line
} from 'recharts';

const MIN_RECORDS = 3;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-6">
      <h3 className="font-semibold text-gray-900 mb-5">{title}</h3>
      {children}
    </div>
  );
}

export default function Analytics() {
  const [records, setRecords]   = useState<WaitingRecord[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const { data } = await supabase
      .from('waiting_records')
      .select('*')
      .order('created_at', { ascending: true });
    if (data) setRecords(data as WaitingRecord[]);
    setLoading(false);
  };

  if (loading) {
    return <div className="py-24 text-center text-gray-400 text-sm">Loading analytics…</div>;
  }

  if (records.length < MIN_RECORDS) {
    return (
      <div className="max-w-lg mx-auto mt-16 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-amber-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Not enough data yet</h2>
        <p className="text-gray-500 text-sm">
          Analytics require at least {MIN_RECORDS} records. You currently have {records.length}.
          Keep recording real wait times to unlock charts.
        </p>
      </div>
    );
  }

  /* ── Data processing ── */

  // By crowd level
  const crowdMap: Record<string, number[]> = { Low: [], Medium: [], High: [] };
  records.forEach(r => crowdMap[r.crowd_level]?.push(r.wait_seconds));
  const crowdData = Object.entries(crowdMap)
    .filter(([, v]) => v.length > 0)
    .map(([name, vals]) => ({
      name,
      avg: Math.round(vals.reduce((a, b) => a + b, 0) / vals.length),
      count: vals.length,
    }));

  // Trend (last 20)
  const trendData = records.slice(-20).map((r, i) => ({
    n: `#${i+1}`,
    wait: r.wait_seconds,
  }));

  // By lift
  const liftMap: Record<string, number[]> = {};
  records.forEach(r => {
    liftMap[r.lift_number] = liftMap[r.lift_number] ?? [];
    liftMap[r.lift_number].push(r.wait_seconds);
  });
  const liftData = Object.entries(liftMap).map(([name, vals]) => ({
    name,
    avg: Math.round(vals.reduce((a, b) => a + b, 0) / vals.length),
  }));

  const all = records.map(r => r.wait_seconds);
  const avg = Math.round(all.reduce((a, b) => a + b, 0) / all.length);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Analytics</h1>
        <p className="page-subtitle">Based on {records.length} real observations — no fabricated data</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Records',   value: records.length },
          { label: 'Average Wait',    value: `${avg}s` },
          { label: 'Shortest Wait',   value: `${Math.min(...all)}s` },
          { label: 'Longest Wait',    value: `${Math.max(...all)}s` },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{s.label}</div>
            <div className="text-3xl font-bold text-gray-900">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Section title="Average Wait by Crowd Level">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={crowdData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(v: number) => [`${v}s`, 'Avg Wait']}
                contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
              />
              <Bar dataKey="avg" fill="#2563eb" radius={[4,4,0,0]} maxBarSize={60} name="Avg Wait (s)" />
            </BarChart>
          </ResponsiveContainer>
        </Section>

        <Section title="Wait Time Trend (Last 20 Records)">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="n" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(v: number) => [`${v}s`, 'Wait']}
                contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
              />
              <Line
                type="monotone" dataKey="wait" stroke="#6366f1"
                strokeWidth={2.5} dot={{ r: 3, fill: '#6366f1', strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Section>

        {liftData.length > 1 && (
          <Section title="Average Wait by Lift">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={liftData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: number) => [`${v}s`, 'Avg']} contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
                <Bar dataKey="avg" fill="#0ea5e9" radius={[4,4,0,0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </Section>
        )}

        <Section title="Data Quality Notice">
          <div className="flex gap-3 text-sm">
            <BarChart3 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-gray-600 leading-relaxed space-y-2">
              <p>All charts are derived from <strong>{records.length}</strong> real manual observations.</p>
              <p>No synthetic or demo data is mixed in. As more students contribute, predictions will become more reliable.</p>
              <p className="text-xs text-gray-400">Minimum recommended dataset: 20+ observations for meaningful trend analysis.</p>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
