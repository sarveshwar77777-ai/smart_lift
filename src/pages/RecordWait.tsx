import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer, CheckCircle2, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

export default function RecordWait() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [liftNumber, setLiftNumber] = useState('Lift 1');
  const [currentFloor, setCurrentFloor] = useState('Ground');
  const [destinationFloor, setDestinationFloor] = useState('');
  const [crowdLevel, setCrowdLevel] = useState('Low');
  const [notes, setNotes] = useState('');
  
  // Timer states
  const [isWaiting, setIsWaiting] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [hasFinished, setHasFinished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isWaiting) {
      timerRef.current = setInterval(() => {
        setTimeElapsed((prev) => prev + 100); // update every 100ms
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isWaiting]);

  const handleStart = () => {
    setIsWaiting(true);
    setHasFinished(false);
    setTimeElapsed(0);
    setSaveSuccess(false);
  };

  const handleStop = () => {
    setIsWaiting(false);
    setHasFinished(true);
  };

  const handleCancel = () => {
    setIsWaiting(false);
    setHasFinished(false);
    setTimeElapsed(0);
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    const msFormatted = Math.floor((ms % 1000) / 10);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${msFormatted.toString().padStart(2, '0')}`;
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    
    try {
      const now = new Date();
      const waitingSeconds = Math.round(timeElapsed / 1000);
      
      const { error } = await supabase.from('lift_observations').insert([
        {
          user_id: user.id,
          lift_number: liftNumber,
          current_floor: currentFloor,
          destination_floor: destinationFloor || null,
          crowd_level: crowdLevel,
          waiting_time_seconds: waitingSeconds,
          observation_date: now.toISOString().split('T')[0],
          observation_time: now.toTimeString().split(' ')[0],
          notes: notes || null
        }
      ]);

      if (error) throw error;
      
      setSaveSuccess(true);
      setTimeout(() => {
        navigate('/history');
      }, 2000);
      
    } catch (error) {
      console.error('Error saving observation:', error);
      alert('Failed to save observation. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Record Lift Waiting Time</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Help improve SmartLift AI by recording a real lift waiting experience.</p>
      </div>

      <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        
        {/* Timer Section - Most important UI element */}
        <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 p-8 flex flex-col items-center justify-center">
          <div className="text-6xl md:text-8xl font-mono font-bold text-gray-900 dark:text-white tabular-nums tracking-tight mb-8">
            {formatTime(timeElapsed)}
          </div>
          
          {!isWaiting && !hasFinished && (
            <button 
              onClick={handleStart}
              className="w-full sm:w-auto px-12 py-5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-full font-bold text-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-3"
            >
              <Timer className="w-6 h-6" />
              START WAITING
            </button>
          )}

          {isWaiting && (
            <div className="flex gap-4 w-full sm:w-auto">
              <button 
                onClick={handleStop}
                className="flex-1 sm:flex-none px-12 py-5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-full font-bold text-xl shadow-lg shadow-emerald-600/30 transition-all"
              >
                LIFT ARRIVED
              </button>
              <button 
                onClick={handleCancel}
                className="p-5 bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 rounded-full transition-all flex items-center justify-center"
                aria-label="Cancel"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          )}

          {hasFinished && !saveSuccess && (
            <div className="text-center w-full">
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-6">
                Your waiting time: <span className="font-bold text-blue-600 dark:text-blue-400">{Math.round(timeElapsed/1000)} seconds</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Observation'}
                </button>
                <button 
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 rounded-xl font-semibold disabled:opacity-50"
                >
                  Discard
                </button>
              </div>
            </div>
          )}

          {saveSuccess && (
            <div className="text-center">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">Observation saved successfully.</p>
              <p className="text-gray-500 dark:text-gray-400">Redirecting to history...</p>
            </div>
          )}
        </div>

        {/* Details Form */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Lift Number
              </label>
              <select 
                value={liftNumber}
                onChange={(e) => setLiftNumber(e.target.value)}
                disabled={isWaiting || (hasFinished && saveSuccess)}
                className="w-full rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none border"
              >
                <option value="Lift 1">Lift 1</option>
                <option value="Lift 2">Lift 2</option>
                <option value="Lift 3">Lift 3</option>
                <option value="Service Lift">Service Lift</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Crowd Level
              </label>
              <select 
                value={crowdLevel}
                onChange={(e) => setCrowdLevel(e.target.value)}
                disabled={isWaiting || (hasFinished && saveSuccess)}
                className="w-full rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none border"
              >
                <option value="Low">Low (0-2 people)</option>
                <option value="Medium">Medium (3-6 people)</option>
                <option value="High">High (7+ people, full)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Floor
              </label>
              <select 
                value={currentFloor}
                onChange={(e) => setCurrentFloor(e.target.value)}
                disabled={isWaiting || (hasFinished && saveSuccess)}
                className="w-full rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none border"
              >
                <option value="Ground">Ground</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Destination Floor (Optional)
              </label>
              <select 
                value={destinationFloor}
                onChange={(e) => setDestinationFloor(e.target.value)}
                disabled={isWaiting || (hasFinished && saveSuccess)}
                className="w-full rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none border"
              >
                <option value="">Select...</option>
                <option value="Ground">Ground</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes (Optional)
            </label>
            <input 
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isWaiting || (hasFinished && saveSuccess)}
              placeholder="E.g., Lift was under maintenance earlier"
              className="w-full rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none border"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
