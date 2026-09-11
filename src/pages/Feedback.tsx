import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import {
  Star, CheckCircle2, AlertCircle, MessageSquare,
  ArrowRight, ShieldCheck
} from 'lucide-react';

type TriChoice = 'Yes' | 'No' | 'Somewhat';
type WouldUseChoice = 'Yes' | 'No' | 'Maybe';

export default function Feedback() {
  const { user } = useAuth();

  const [rating, setRating] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [easyToUse, setEasyToUse] = useState<TriChoice | ''>('');
  const [timerUseful, setTimerUseful] = useState<TriChoice | ''>('');
  const [predictionUnderstandable, setPredictionUnderstandable] = useState<TriChoice | ''>('');
  const [wouldUseHostel, setWouldUseHostel] = useState<WouldUseChoice | ''>('');
  const [mostUsefulFeature, setMostUsefulFeature] = useState('Waiting Timer');
  const [confusingAspects, setConfusingAspects] = useState('');
  const [improvementSuggestions, setImprovementSuggestions] = useState('');

  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg('You must be signed in to submit feedback.');
      return;
    }
    if (rating === 0) {
      setErrorMsg('Please select a star rating (1 to 5).');
      return;
    }

    setErrorMsg('');
    setSaving(true);

    try {
      const { error } = await supabase.from('feedback').insert({
        user_id: user.id,
        rating,
        easy_to_use: easyToUse || null,
        timer_useful: timerUseful || null,
        prediction_understandable: predictionUnderstandable || null,
        would_use_hostel: wouldUseHostel || null,
        most_useful_feature: mostUsefulFeature || null,
        confusing_aspects: confusingAspects.trim() || null,
        improvement_suggestions: improvementSuggestions.trim() || null,
        // Legacy compatibility
        useful: timerUseful === 'Somewhat' ? 'Not sure' : (timerUseful as any) || 'Yes',
        decision_help: predictionUnderstandable === 'Somewhat' ? 'Not sure' : (predictionUnderstandable as any) || 'Yes',
        problem: confusingAspects.trim() || null,
        suggestion: improvementSuggestions.trim() || null,
      });

      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      console.error('Feedback submit error:', err);
      setErrorMsg('Failed to submit feedback. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto mt-16 text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Thank you for validating SmartLift AI!</h2>
          <p className="text-gray-500 text-sm mt-2">
            Your real responses have been recorded in the research database and are reflected in the validation dashboard.
          </p>
        </div>
        <div className="flex gap-3 justify-center pt-2">
          <Link to="/validation" className="btn-primary text-sm">
            View Validation Metrics <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/dashboard" className="btn-secondary text-sm">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const ChoiceButton = <T extends string>({
    label,
    value,
    selected,
    onSelect,
  }: {
    label: string;
    value: T;
    selected: T | '';
    onSelect: (v: T) => void;
  }) => (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
        selected === value
          ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
          : 'border-gray-200 text-gray-700 bg-white hover:border-blue-300 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-2">
          <MessageSquare className="w-3.5 h-3.5" />
          Academic Survey
        </div>
        <h1 className="page-title">Student Feedback Survey</h1>
        <p className="page-subtitle">
          Help validate and improve SmartLift AI with your honest opinions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Star Rating */}
        <div className="card p-6">
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Overall Experience Rating <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-4">How would you rate SmartLift AI for hostel elevator management?</p>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                onMouseEnter={() => setHoverStar(n)}
                onMouseLeave={() => setHoverStar(0)}
                className="text-3xl leading-none transition-transform hover:scale-110 focus:outline-none"
                aria-label={`${n} stars`}
              >
                <Star
                  className={`w-9 h-9 ${
                    n <= (hoverStar || rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-gray-100 text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="mt-2 text-xs font-semibold text-blue-600">
              {['', '1/5 - Poor', '2/5 - Below Average', '3/5 - Average', '4/5 - Good', '5/5 - Excellent'][rating]}
            </p>
          )}
        </div>

        {/* 2. Structured Questions */}
        <div className="card p-6 space-y-6">
          {/* Question 1 */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              1. Was SmartLift easy to use?
            </label>
            <div className="flex gap-2 flex-wrap">
              {(['Yes', 'Somewhat', 'No'] as TriChoice[]).map(v => (
                <ChoiceButton key={v} label={v} value={v} selected={easyToUse} onSelect={setEasyToUse} />
              ))}
            </div>
          </div>

          {/* Question 2 */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              2. Was the waiting timer useful?
            </label>
            <div className="flex gap-2 flex-wrap">
              {(['Yes', 'Somewhat', 'No'] as TriChoice[]).map(v => (
                <ChoiceButton key={v} label={v} value={v} selected={timerUseful} onSelect={setTimerUseful} />
              ))}
            </div>
          </div>

          {/* Question 3 */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              3. Was the prediction explainable and understandable?
            </label>
            <div className="flex gap-2 flex-wrap">
              {(['Yes', 'Somewhat', 'No'] as TriChoice[]).map(v => (
                <ChoiceButton
                  key={v}
                  label={v}
                  value={v}
                  selected={predictionUnderstandable}
                  onSelect={setPredictionUnderstandable}
                />
              ))}
            </div>
          </div>

          {/* Question 4 */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              4. Would you use SmartLift in your daily hostel routine?
            </label>
            <div className="flex gap-2 flex-wrap">
              {(['Yes', 'Maybe', 'No'] as WouldUseChoice[]).map(v => (
                <ChoiceButton key={v} label={v} value={v} selected={wouldUseHostel} onSelect={setWouldUseHostel} />
              ))}
            </div>
          </div>

          {/* Question 5 */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              5. What feature was most useful?
            </label>
            <select
              value={mostUsefulFeature}
              onChange={e => setMostUsefulFeature(e.target.value)}
              className="input-field"
            >
              <option value="Waiting Timer">Waiting Timer (Stopwatch measurement)</option>
              <option value="Analytics Dashboard">Analytics Dashboard (Peak hour charts)</option>
              <option value="Prediction Engine">Prediction Engine (Expected wait estimate)</option>
              <option value="Observation History">Observation History (Personal tracking)</option>
            </select>
          </div>
        </div>

        {/* 3. Qualitative Open-Ended Questions */}
        <div className="card p-6 space-y-5">
          <div>
            <label className="label font-bold text-gray-900">
              6. What was confusing or difficult to understand? (Optional)
            </label>
            <textarea
              rows={3}
              value={confusingAspects}
              onChange={e => setConfusingAspects(e.target.value)}
              placeholder="e.g. Unclear button labels, confusion about crowd levels…"
              className="input-field resize-none"
            />
          </div>

          <div>
            <label className="label font-bold text-gray-900">
              7. What should we improve? (Optional)
            </label>
            <textarea
              rows={3}
              value={improvementSuggestions}
              onChange={e => setImprovementSuggestions(e.target.value)}
              placeholder="e.g. Floor-specific graphs, morning notifications, faster timer controls…"
              className="input-field resize-none"
            />
          </div>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="btn-primary w-full sm:w-auto px-10 py-3 text-base shadow-md shadow-blue-600/20"
        >
          {saving ? 'Submitting Survey…' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
}
