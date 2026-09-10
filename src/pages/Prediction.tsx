import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { WaitingRecord } from '../types';
import { TrendingUp, AlertTriangle, Info } from 'lucide-react';

const MIN_RECORDS = 10;

export default function Prediction() {
  const [allRecords, setAll]       = useState<WaitingRecord[]>([]);
  const [loading, setLoading]      = useState(true);

  // Inputs
  const [crowd, setCrowd]          = useState<'Low' | 'Medium' | 'High'>('Low');
  const [liftNumber, setLift]      = useState('Lift 1');
  const [floor, setFloor]          = useState('Ground');

  // Result
  const [predicted, setPredicted]  = useState<number | null>(null);
  const [matchCount, setMatch]     = useState(0);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const { data } = await supabase
      .from('waiting_records')
      .select('*');
    if (data) setAll(data as WaitingRecord[]);
    setLoading(false);
  };

  const handlePredict = () => {
    // Filter records that match the selected conditions (lenient: crowd level required, others optional)
    let filtered = allRecords.filter(r => r.crowd_level === crowd);
    if (liftNumber !== 'Any') filtered = filtered.filter(r => r.lift_number === liftNumber);
    if (floor !== 'Any') filtered = filtered.filter(r => r.floor === floor);

    setMatch(filtered.length);

    if (filtered.length === 0) {
      // Fallback: only crowd level
      const byCrowd = allRecords.filter(r => r.crowd_level === crowd);
      if (byCrowd.length === 0) {
        setPredicted(null);
      } else {
        const avg = Math.round(byCrowd.reduce((s, r) => s + r.wait_seconds, 0) / byCrowd.length);
        setPredicted(avg);
        setMatch(byCrowd.length);
      }
    } else {
      const avg = Math.round(filtered.reduce((s, r) => s + r.wait_seconds, 0) / filtered.length);
      setPredicted(avg);
    }
  };

  if (loading) {
    return <div className="py-24 text-center text-gray-400 text-sm">Loading prediction data…</div>;
  }

  const notEnoughData = allRecords.length < MIN_RECORDS;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Wait Time Predictor</h1>
        <p className="page-subtitle">Estimate your lift wait based on collected observations</p>
      </div>

      {/* Insufficient data state */}
      {notEnoughData && (
        <div className="card p-6 bg-amber-50 border-amber-200">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-amber-800 mb-1">
                Prediction model not trained yet
              </div>
              <p className="text-sm text-amber-700">
                At least {MIN_RECORDS} recorded observations are needed to generate estimates.
                You currently have <strong>{allRecords.length}</strong>. Keep using the timer to
                collect more data!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Input form */}
      <div className="card p-6 space-y-5">
        <h2 className="font-semibold text-gray-900">Your situation right now</h2>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="label">Crowd Level</label>
            <select
              value={crowd}
              onChange={e => setCrowd(e.target.value as 'Low' | 'Medium' | 'High')}
              className="input-field"
            >
              <option value="Low">Low (0–2 people)</option>
              <option value="Medium">Medium (3–6 people)</option>
              <option value="High">High (7+ people)</option>
            </select>
          </div>

          <div>
            <label className="label">Lift</label>
            <select value={liftNumber} onChange={e => setLift(e.target.value)} className="input-field">
              {['Any', 'Lift 1', 'Lift 2', 'Lift 3', 'Service Lift', 'Other'].map(l => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Your Floor</label>
            <select value={floor} onChange={e => setFloor(e.target.value)} className="input-field">
              {['Any', 'Ground', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map(f => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handlePredict}
          disabled={notEnoughData}
          className="btn-primary w-full sm:w-auto"
        >
          <TrendingUp className="w-4 h-4" />
          {notEnoughData ? `Need ${MIN_RECORDS - allRecords.length} more records` : 'Get Estimate'}
        </button>
      </div>

      {/* Result */}
      {predicted !== null && !notEnoughData && (
        <div className="card p-8 flex flex-col items-center gap-4 text-center">
          <div className="text-xs font-semibold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
            Prototype Data-Based Estimate
          </div>

          <div className="text-8xl font-black text-blue-600 tabular-nums">
            {predicted}s
          </div>

          <p className="text-gray-500 text-sm">
            Based on <strong>{matchCount}</strong> matching observation{matchCount !== 1 ? 's' : ''}
            {' '}with <strong>{crowd}</strong> crowd level
          </p>

          <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl text-xs text-gray-500 text-left max-w-sm">
            <Info className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <span>
              This is a simple average of past records — not a trained machine-learning model.
              Estimates may be inaccurate with small datasets.
            </span>
          </div>
        </div>
      )}

      {/* No match fallback */}
      {predicted === null && !notEnoughData && (
        <div className="card p-6 text-center">
          <p className="text-gray-500 text-sm">
            No matching records found for those conditions. Try selecting "Any" for lift or floor.
          </p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="card p-5 bg-gray-50 border-gray-200">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-gray-500 leading-relaxed">
            <strong>How it works:</strong> This predictor filters historical waiting records by your
            selected crowd level, lift, and floor, then returns the average wait time of matching
            records. It is <strong>not</strong> a neural network or trained ML model — it is a
            statistical baseline intended for a student prototype.
          </div>
        </div>
      </div>
    </div>
  );
}
