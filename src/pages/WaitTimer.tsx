import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Timer, Square, X, CheckCircle2, ChevronRight,
  AlertCircle, Users, Clock, ArrowRight
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { TimePeriod, CrowdLevel } from '../types';
import { getTimePeriod, getDayOfWeek, crowdLevelFromPeople, formatTimerMs } from '../utils/helpers';

type TimerStep = 'idle' | 'timing' | 'stopped' | 'saved';

export default function WaitTimer() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<TimerStep>('idle');
  const [elapsedMs, setElapsedMs] = useState(0);

  // Observation fields
  const [peopleWaiting, setPeopleWaiting] = useState<number>(1);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(getTimePeriod());
  const [liftNumber, setLiftNumber] = useState('Lift 1');
  const [floor, setFloor] = useState('Ground');
  const [crowdLevel, setCrowdLevel] = useState<CrowdLevel>('Low');
  const [notes, setNotes] = useState('');

  // State flags
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  // Sync crowd level when people count changes
  useEffect(() => {
    setCrowdLevel(crowdLevelFromPeople(peopleWaiting));
  }, [peopleWaiting]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const handleStartTimer = () => {
    setErrorMsg(null);
    startTimeRef.current = Date.now();
    setTimePeriod(getTimePeriod());
    timerIntervalRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startTimeRef.current);
    }, 50);
    setStep('timing');
  };

  const handleStopTimer = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setStep('stopped');
  };

  const handleCancelTimer = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setElapsedMs(0);
    setStep('idle');
    setErrorMsg(null);
  };

  const handleSaveObservation = async () => {
    if (!user) {
      setErrorMsg('You must be signed in to save observations.');
      return;
    }

    const waitSecs = Math.max(1, Math.round(elapsedMs / 1000));
    setSaving(true);
    setErrorMsg(null);

    try {
      const now = new Date();
      const observationDate = now.toISOString().split('T')[0];
      const observationTime = now.toTimeString().split(' ')[0];
      const dayOfWeek = getDayOfWeek(now);

      const { error } = await supabase.from('waiting_records').insert({
        user_id: user.id,
        wait_seconds: waitSecs,
        people_waiting: Number(peopleWaiting) || 0,
        time_period: timePeriod,
        day_of_week: dayOfWeek,
        lift_number: liftNumber,
        floor: floor,
        crowd_level: crowdLevel,
        observation_date: observationDate,
        observation_time: observationTime,
        notes: notes.trim() || null,
      });

      if (error) throw error;
      setStep('saved');
    } catch (err) {
      console.error('Save observation error:', err);
      setErrorMsg('Unable to save your observation to the database. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const recordedSeconds = Math.round(elapsedMs / 1000);
  const recordedMinutes = Math.floor(recordedSeconds / 60);
  const recordedRemainingSeconds = recordedSeconds % 60;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="page-title">Waiting Timer</h1>
        <p className="page-subtitle">Record your real lift waiting time in the hostel lobby</p>
      </div>

      {/* Main Timer Display Card */}
      <div className="card p-8 flex flex-col items-center gap-6 relative overflow-hidden">
        {/* Step indicator */}
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider w-full">
          {[
            { id: 'idle', label: '1. Start' },
            { id: 'timing', label: '2. Timing' },
            { id: 'stopped', label: '3. Details' },
            { id: 'saved', label: '4. Saved' },
          ].map((s, i) => {
            const stepOrder = ['idle', 'timing', 'stopped', 'saved'];
            const currentIndex = stepOrder.indexOf(step);
            const isCompleted = currentIndex > i;
            const isCurrent = step === s.id;

            return (
              <span key={s.id} className="flex items-center gap-1.5 flex-1">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCurrent
                      ? 'bg-blue-600 text-white'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? '✓' : i + 1}
                </span>
                <span className={`hidden sm:inline ${isCurrent ? 'text-blue-600 font-bold' : ''}`}>
                  {s.label}
                </span>
                {i < 3 && <ChevronRight className="w-3 h-3 text-gray-300 ml-auto" />}
              </span>
            );
          })}
        </div>

        {/* Live Stopwatch digits */}
        <div className="text-center py-4">
          <div
            className={`text-7xl sm:text-8xl font-mono font-black tabular-nums tracking-tight transition-colors ${
              step === 'timing' ? 'text-blue-600 animate-pulse' : 'text-gray-900'
            }`}
          >
            {formatTimerMs(elapsedMs)}
          </div>
          <div className="text-xs font-medium text-gray-400 mt-2 font-mono">
            {elapsedMs > 0 && `${Math.round(elapsedMs / 1000)} total seconds elapsed`}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center justify-center">
          {step === 'idle' && (
            <button
              onClick={handleStartTimer}
              className="btn-primary px-10 py-4 text-lg font-bold shadow-lg shadow-blue-600/30 timer-pulse w-full sm:w-auto"
            >
              <Timer className="w-6 h-6" /> START WAITING
            </button>
          )}

          {step === 'timing' && (
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={handleStopTimer}
                className="btn-primary px-10 py-4 text-lg font-bold bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 shadow-lg shadow-emerald-600/30 flex-1 sm:flex-none"
              >
                <Square className="w-5 h-5" /> LIFT ARRIVED
              </button>
              <button
                onClick={handleCancelTimer}
                className="btn-secondary px-5 py-4 text-red-600 hover:bg-red-50 border-red-200"
                title="Cancel timer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {step === 'saved' && (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">Observation Saved!</div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Your record was added to the research dataset.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setElapsedMs(0);
                    setStep('idle');
                  }}
                  className="btn-secondary text-sm"
                >
                  Record Another Wait
                </button>
                <button onClick={() => navigate('/history')} className="btn-primary text-sm">
                  View Observations <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Observation Details Form (Visible when stopped or for pre-filling) */}
      {step !== 'saved' && (
        <div className="card p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              Observation Details
            </h2>
            {step === 'stopped' && (
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-50 text-blue-700">
                Waiting Time: {recordedMinutes > 0 ? `${recordedMinutes}m ` : ''}{recordedRemainingSeconds}s
              </span>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* People waiting count */}
            <div>
              <label className="label">Number of People Waiting</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={peopleWaiting}
                  onChange={e => setPeopleWaiting(Math.max(0, parseInt(e.target.value) || 0))}
                  disabled={step === 'timing'}
                  className="input-field"
                  placeholder="e.g. 3"
                />
                <span className="text-xs font-semibold px-2.5 py-2 rounded-lg bg-gray-100 text-gray-700 whitespace-nowrap">
                  {crowdLevel} Crowd
                </span>
              </div>
            </div>

            {/* Time Period */}
            <div>
              <label className="label">Time Period</label>
              <select
                value={timePeriod}
                onChange={e => setTimePeriod(e.target.value as TimePeriod)}
                disabled={step === 'timing'}
                className="input-field"
              >
                <option value="Morning">Morning (06:00 – 12:00)</option>
                <option value="Afternoon">Afternoon (12:00 – 17:00)</option>
                <option value="Evening">Evening (17:00 – 22:00)</option>
                <option value="Night">Night (22:00 – 06:00)</option>
              </select>
            </div>

            {/* Lift Number */}
            <div>
              <label className="label">Lift Number</label>
              <select
                value={liftNumber}
                onChange={e => setLiftNumber(e.target.value)}
                disabled={step === 'timing'}
                className="input-field"
              >
                {['Lift 1', 'Lift 2', 'Lift 3', 'Service Lift', 'Other'].map(l => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            {/* Current Floor */}
            <div>
              <label className="label">Floor</label>
              <select
                value={floor}
                onChange={e => setFloor(e.target.value)}
                disabled={step === 'timing'}
                className="input-field"
              >
                {['Ground', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map(f => (
                  <option key={f} value={f}>
                    {f === 'Ground' ? 'Ground Floor' : `Floor ${f}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div className="sm:col-span-2">
              <label className="label">Optional Notes / Lift Condition</label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                disabled={step === 'timing'}
                placeholder="e.g. One lift was under maintenance, rainy morning crowd"
                className="input-field"
              />
            </div>
          </div>

          {/* Error notification */}
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submission Bar */}
          {step === 'stopped' && (
            <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSaveObservation}
                disabled={saving}
                className="btn-primary flex-1 py-3 text-base"
              >
                {saving ? 'Saving Observation…' : `SAVE OBSERVATION (${Math.round(elapsedMs / 1000)}s)`}
              </button>
              <button
                onClick={handleCancelTimer}
                disabled={saving}
                className="btn-secondary"
              >
                Discard
              </button>
            </div>
          )}
        </div>
      )}

      {/* Honest Scientific Notice */}
      <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex gap-3 text-xs text-blue-900 leading-relaxed">
        <Clock className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong>Data Integrity Rule:</strong> Observations are only saved when explicitly submitted.
          The timer measures elapsed time in-situ. Do not minimize or close the tab while recording.
        </div>
      </div>
    </div>
  );
}
