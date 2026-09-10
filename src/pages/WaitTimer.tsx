import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer, Square, X, CheckCircle2, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

type Step = 'setup' | 'waiting' | 'stopped' | 'saved';

export default function WaitTimer() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep]           = useState<Step>('setup');
  const [elapsed, setElapsed]     = useState(0);      // ms
  const [liftNumber, setLiftNumber] = useState('Lift 1');
  const [floor, setFloor]         = useState('Ground');
  const [crowdLevel, setCrowd]    = useState<'Low'|'Medium'|'High'>('Low');
  const [notes, setNotes]         = useState('');
  const [saving, setSaving]       = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef    = useRef<number>(0);

  // Cleanup on unmount
  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const startTimer = () => {
    startRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      setElapsed(Date.now() - startRef.current);
    }, 50);
    setStep('waiting');
  };

  const stopTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setStep('stopped');
  };

  const cancelTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setElapsed(0);
    setStep('setup');
  };

  const saveRecord = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const now = new Date();
      await supabase.from('waiting_records').insert({
        user_id:          user.id,
        wait_seconds:     Math.round(elapsed / 1000),
        lift_number:      liftNumber,
        floor,
        crowd_level:      crowdLevel,
        observation_date: now.toISOString().split('T')[0],
        observation_time: now.toTimeString().split(' ')[0],
        notes:            notes || null,
      });
      setStep('saved');
    } catch (err) {
      console.error(err);
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const formatTime = (ms: number) => {
    const s  = Math.floor(ms / 1000);
    const m  = Math.floor(s / 60);
    const ss = s % 60;
    const cs = Math.floor((ms % 1000) / 10);
    return `${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')}.${String(cs).padStart(2,'0')}`;
  };

  const SELECT = 'input-field';

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Wait Timer</h1>
        <p className="page-subtitle">Record your real lift waiting time</p>
      </div>

      {/* Timer display */}
      <div className="card p-8 flex flex-col items-center gap-6">
        {/* Step indicator */}
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider w-full">
          {(['setup','waiting','stopped','saved'] as Step[]).map((s, i) => (
            <span key={s} className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold
                ${step === s ? 'bg-blue-600 text-white' :
                  (['setup','waiting','stopped','saved'] as Step[]).indexOf(step) > i
                  ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                {i+1}
              </span>
              <span className={step === s ? 'text-blue-600' : ''}>{s}</span>
              {i < 3 && <ChevronRight className="w-3 h-3 text-gray-300" />}
            </span>
          ))}
        </div>

        {/* Big timer */}
        <div className={`text-7xl sm:text-8xl font-mono font-black tabular-nums tracking-tighter
          ${step === 'waiting' ? 'text-blue-600' : 'text-gray-900'}`}>
          {formatTime(elapsed)}
        </div>

        {/* Pulse indicator while waiting */}
        {step === 'waiting' && (
          <div className="flex items-center gap-2 text-blue-600 text-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            Recording…
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {step === 'setup' && (
            <button
              onClick={startTimer}
              className="btn-primary px-10 py-4 text-base timer-pulse"
            >
              <Timer className="w-5 h-5" /> Start Waiting
            </button>
          )}

          {step === 'waiting' && (
            <>
              <button onClick={stopTimer} className="btn-primary px-10 py-4 text-base bg-emerald-600 hover:bg-emerald-700">
                <Square className="w-5 h-5" /> Stop &amp; Record
              </button>
              <button onClick={cancelTimer} className="btn-secondary px-6 py-4">
                <X className="w-4 h-4" /> Cancel
              </button>
            </>
          )}

          {step === 'saved' && (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-3 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-6 h-6" />
                Waiting time recorded successfully!
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setElapsed(0); setStep('setup'); }} className="btn-secondary">
                  Record Another
                </button>
                <button onClick={() => navigate('/history')} className="btn-primary">
                  View History
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Context form — visible unless saved */}
      {step !== 'saved' && (
        <div className="card p-6 space-y-5">
          <h2 className="font-semibold text-gray-900">Observation Details</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Lift Number</label>
              <select value={liftNumber} onChange={e => setLiftNumber(e.target.value)}
                disabled={step === 'waiting'} className={SELECT}>
                {['Lift 1','Lift 2','Lift 3','Service Lift','Other'].map(l =>
                  <option key={l}>{l}</option>)}
              </select>
            </div>

            <div>
              <label className="label">Current Floor</label>
              <select value={floor} onChange={e => setFloor(e.target.value)}
                disabled={step === 'waiting'} className={SELECT}>
                {['Ground','1','2','3','4','5','6','7','8','9','10'].map(f =>
                  <option key={f}>{f}</option>)}
              </select>
            </div>

            <div>
              <label className="label">Crowd Level</label>
              <select value={crowdLevel} onChange={e => setCrowd(e.target.value as 'Low'|'Medium'|'High')}
                disabled={step === 'waiting'} className={SELECT}>
                <option value="Low">Low (0–2 people)</option>
                <option value="Medium">Medium (3–6 people)</option>
                <option value="High">High (7+ people)</option>
              </select>
            </div>

            <div>
              <label className="label">Notes (optional)</label>
              <input type="text" value={notes} onChange={e => setNotes(e.target.value)}
                disabled={step === 'waiting'}
                placeholder="e.g. one lift out of service"
                className="input-field" />
            </div>
          </div>

          {step === 'stopped' && (
            <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row gap-3">
              <button onClick={saveRecord} disabled={saving} className="btn-primary flex-1">
                {saving ? 'Saving…' : `Save — ${Math.round(elapsed/1000)}s recorded`}
              </button>
              <button onClick={cancelTimer} disabled={saving} className="btn-secondary">
                Discard
              </button>
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-gray-400 text-center">
        The timer measures actual elapsed time. Do not close this tab while timing.
      </p>
    </div>
  );
}
