import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { WaitingRecord, TimePeriod, CrowdLevel, PredictionResult, EvaluationMetric } from '../types';
import {
  Sparkles, AlertTriangle, Info, Clock, Users,
  Calculator, CheckCircle2, ArrowRight, ShieldAlert, BarChart3, Timer
} from 'lucide-react';
import {
  getTimePeriod, getDayOfWeek, crowdLevelFromPeople,
  formatDuration, predictWaitingTime, evaluateModelPerformance
} from '../utils/helpers';

const MIN_REQUIRED_RECORDS = 5;

export default function Prediction() {
  const [allRecords, setAllRecords] = useState<WaitingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Prediction Inputs
  const [peopleWaiting, setPeopleWaiting] = useState<number>(3);
  const [crowdLevel, setCrowdLevel] = useState<CrowdLevel>('Medium');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(getTimePeriod());
  const [dayOfWeek, setDayOfWeek] = useState<string>(getDayOfWeek());
  const [floor, setFloor] = useState<string>('Ground');
  const [liftNumber, setLiftNumber] = useState<string>('Any');

  // Prediction State
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [hasPredicted, setHasPredicted] = useState(false);

  // Evaluation Metrics
  const [evaluation, setEvaluation] = useState<{
    mae: number;
    rmse: number;
    evaluations: EvaluationMetric[];
  } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Sync crowd level when people count changes
  useEffect(() => {
    setCrowdLevel(crowdLevelFromPeople(peopleWaiting));
  }, [peopleWaiting]);

  const fetchData = async () => {
    try {
      const { data } = await supabase
        .from('waiting_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        const records = data as WaitingRecord[];
        setAllRecords(records);
        if (records.length >= MIN_REQUIRED_RECORDS) {
          const perf = evaluateModelPerformance(records);
          setEvaluation(perf);
        }
      }
    } catch (err) {
      console.error('Prediction fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunPrediction = (e: React.FormEvent) => {
    e.preventDefault();
    if (allRecords.length < MIN_REQUIRED_RECORDS) return;

    const res = predictWaitingTime(allRecords, {
      crowdLevel,
      peopleWaiting,
      timePeriod,
      floor,
      dayOfWeek,
    });

    setPrediction(res);
    setHasPredicted(true);
  };

  if (loading) {
    return <div className="py-24 text-center text-gray-400 text-sm">Loading prediction model dataset…</div>;
  }

  const isDataSufficient = allRecords.length >= MIN_REQUIRED_RECORDS;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Explainable Statistical Modeling
        </div>
        <h1 className="page-title">SmartLift Prediction</h1>
        <p className="page-subtitle">
          Prediction is experimental and depends on the amount and quality of real waiting-time data collected.
        </p>
      </div>

      {/* Insufficient Data State */}
      {!isDataSufficient ? (
        <div className="card p-8 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 text-left space-y-4">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-amber-900">Not enough real data for a reliable prediction</h3>
              <p className="text-sm text-amber-800 leading-relaxed">
                SmartLift AI requires at least <strong>{MIN_REQUIRED_RECORDS} real observations</strong> before generating estimates.
                This ensures we never provide misleading or fabricated wait estimates.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 border-t border-amber-200/70">
            <div className="p-3 bg-white/80 rounded-lg border border-amber-200">
              <div className="text-xs font-semibold text-amber-700 uppercase">Data Required</div>
              <div className="text-2xl font-bold text-gray-900 mt-0.5">{MIN_REQUIRED_RECORDS}</div>
            </div>

            <div className="p-3 bg-white/80 rounded-lg border border-amber-200">
              <div className="text-xs font-semibold text-amber-700 uppercase">Current Observations</div>
              <div className="text-2xl font-bold text-gray-900 mt-0.5">{allRecords.length}</div>
            </div>

            <div className="p-3 bg-white/80 rounded-lg border border-amber-200 col-span-2 sm:col-span-1">
              <div className="text-xs font-semibold text-amber-700 uppercase">Remaining Needed</div>
              <div className="text-2xl font-bold text-blue-600 mt-0.5">{MIN_REQUIRED_RECORDS - allRecords.length}</div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-amber-800 font-medium">Continue collecting observations in the hostel lobby.</span>
            <Link to="/timer" className="btn-primary text-sm py-2">
              <Timer className="w-4 h-4" /> Start Timer
            </Link>
          </div>
        </div>
      ) : (
        /* Prediction Input Form */
        <div className="grid md:grid-cols-12 gap-6">
          <form onSubmit={handleRunPrediction} className="md:col-span-7 card p-6 space-y-5">
            <div className="border-b border-gray-100 pb-3">
              <h2 className="font-semibold text-gray-900">Current Elevator Conditions</h2>
              <p className="text-xs text-gray-500">Enter your immediate situation to estimate expected waiting time</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Day of Week</label>
                <select value={dayOfWeek} onChange={e => setDayOfWeek(e.target.value)} className="input-field">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Time Period</label>
                <select value={timePeriod} onChange={e => setTimePeriod(e.target.value as TimePeriod)} className="input-field">
                  <option value="Morning">Morning (06:00 – 12:00)</option>
                  <option value="Afternoon">Afternoon (12:00 – 17:00)</option>
                  <option value="Evening">Evening (17:00 – 22:00)</option>
                  <option value="Night">Night (22:00 – 06:00)</option>
                </select>
              </div>

              <div>
                <label className="label">People Waiting at Lobby</label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={peopleWaiting}
                  onChange={e => setPeopleWaiting(Math.max(0, parseInt(e.target.value) || 0))}
                  className="input-field"
                />
                <span className="text-xs text-gray-500 mt-1 block">Crowd Profile: <strong>{crowdLevel}</strong></span>
              </div>

              <div>
                <label className="label">Floor</label>
                <select value={floor} onChange={e => setFloor(e.target.value)} className="input-field">
                  {['Any', 'Ground', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map(f => (
                    <option key={f} value={f}>{f === 'Ground' ? 'Ground' : f === 'Any' ? 'Any Floor' : `Floor ${f}`}</option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-3 text-base font-bold shadow-md shadow-blue-600/20">
              <Calculator className="w-5 h-5" /> Calculate Expected Wait
            </button>
          </form>

          {/* Prediction Result Panel */}
          <div className="md:col-span-5 flex flex-col">
            {prediction ? (
              <div className="card p-6 flex-1 flex flex-col justify-between bg-gradient-to-b from-blue-50/60 to-white border-blue-200 animate-fade-in">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full">
                      Statistical Estimate
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      prediction.confidence === 'High'
                        ? 'bg-green-100 text-green-700'
                        : prediction.confidence === 'Medium'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {prediction.confidence} Confidence
                    </span>
                  </div>

                  <div className="text-center py-3">
                    <div className="text-xs text-gray-500 font-medium">Expected Waiting Time</div>
                    <div className="text-6xl font-black text-blue-700 font-mono tracking-tight my-1">
                      {formatDuration(prediction.predictedSeconds)}
                    </div>
                    <div className="text-xs text-gray-500">
                      ≈ {prediction.predictedSeconds} seconds
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-600">
                    <div className="font-semibold text-gray-800 mb-1">Model Factor Weights:</div>
                    <div className="flex justify-between">
                      <span>Crowd Impact:</span>
                      <strong className="text-gray-900">{prediction.factors.crowdImpact}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Time Profile:</span>
                      <strong className="text-gray-900">{prediction.factors.periodImpact}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Floor Baseline:</span>
                      <strong className="text-gray-900">{prediction.factors.floorImpact}</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-3 rounded-lg bg-white border border-gray-200 text-[11px] text-gray-500 flex items-start gap-2">
                  <Info className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>Based on {prediction.matchCount} training records. Actual elevator arrival may vary.</span>
                </div>
              </div>
            ) : (
              <div className="card p-8 flex-1 flex flex-col items-center justify-center text-center text-gray-400 space-y-3 border-dashed">
                <Calculator className="w-10 h-10 text-gray-300" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-700">Awaiting Input</h3>
                  <p className="text-xs text-gray-500 max-w-xs mt-1">
                    Select current lobby conditions and click "Calculate Expected Wait".
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Section 8: AI Explanation */}
      <div className="card p-6 bg-white space-y-4 border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <Info className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">How does SmartLift AI predict?</h2>
        </div>

        <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
          <p>
            The system learns from previously recorded waiting-time observations. It looks for relationships
            between factors such as <strong>time of day</strong>, <strong>day of the week</strong>, and <strong>the number of people waiting</strong> in the lobby.
          </p>
          <p>
            Rather than using opaque deep learning that hallucinates numbers, SmartLift uses an <strong>explainable distance-weighted statistical regression model</strong>.
            Records matching your immediate crowd conditions receive higher weights, while temporal and floor patterns adjust the baseline estimate.
          </p>
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Academic Honesty Disclaimer:</strong> This prediction is experimental and should not be treated as guaranteed.
              Elevator waiting times are subject to real-world anomalies such as maintenance, door holds, and unpredicted surges.
            </div>
          </div>
        </div>
      </div>

      {/* Section 9: Prediction Evaluation (MAE & RMSE) */}
      <div className="card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Prediction Model Evaluation</h2>
            <p className="text-xs text-gray-500">
              Leave-One-Out Cross-Validation (LOOCV) metrics calculated over real observations
            </p>
          </div>
          {evaluation && (
            <div className="flex gap-3">
              <div className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg text-xs font-bold text-blue-700">
                MAE: {evaluation.mae}s
              </div>
              <div className="px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-lg text-xs font-bold text-indigo-700">
                RMSE: {evaluation.rmse}s
              </div>
            </div>
          )}
        </div>

        {!evaluation ? (
          <div className="py-8 text-center text-gray-400 text-sm">
            Prediction evaluation will appear after sufficient real observations are collected (minimum {MIN_REQUIRED_RECORDS} records).
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-xs font-bold text-gray-500 uppercase">MAE (Mean Absolute Error)</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">{evaluation.mae} seconds</div>
                <div className="text-xs text-gray-400 mt-0.5">Average prediction difference on historical data</div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-xs font-bold text-gray-500 uppercase">RMSE (Root Mean Squared Error)</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">{evaluation.rmse} seconds</div>
                <div className="text-xs text-gray-400 mt-0.5">Penalizes large deviations in estimates</div>
              </div>
            </div>

            {/* Actual vs Predicted Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-semibold">
                    <th className="px-4 py-2.5">Observation</th>
                    <th className="px-4 py-2.5">Crowd Level</th>
                    <th className="px-4 py-2.5">Time Period</th>
                    <th className="px-4 py-2.5 text-right">Actual Wait</th>
                    <th className="px-4 py-2.5 text-right">Predicted Wait</th>
                    <th className="px-4 py-2.5 text-right">Absolute Error</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {evaluation.evaluations.slice(0, 8).map((ev, i) => (
                    <tr key={ev.id || i} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5 font-medium text-gray-900">Record #{i + 1}</td>
                      <td className="px-4 py-2.5">{ev.crowd}</td>
                      <td className="px-4 py-2.5">{ev.period}</td>
                      <td className="px-4 py-2.5 text-right font-bold text-gray-800">{formatDuration(ev.actualSeconds)}</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-blue-600">{formatDuration(ev.predictedSeconds)}</td>
                      <td className="px-4 py-2.5 text-right font-mono font-medium text-amber-700">±{ev.errorSeconds}s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
