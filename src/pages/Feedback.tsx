import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Star, CheckCircle2, AlertCircle } from 'lucide-react';

type Tristate = 'Yes' | 'No' | 'Not sure';

export default function Feedback() {
  const { user } = useAuth();
  const [rating, setRating]       = useState(0);
  const [hoverStar, setHover]     = useState(0);
  const [useful, setUseful]       = useState<Tristate | ''>('');
  const [decisionHelp, setHelp]   = useState<Tristate | ''>('');
  const [problem, setProblem]     = useState('');
  const [suggestion, setSugg]     = useState('');
  const [saving, setSaving]       = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]         = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (rating === 0) { setError('Please select a star rating.'); return; }
    if (!useful)      { setError('Please answer whether the app is useful.'); return; }

    setError('');
    setSaving(true);
    try {
      await supabase.from('feedback').insert({
        user_id:       user.id,
        rating,
        useful:        useful || null,
        decision_help: decisionHelp || null,
        problem:       problem || null,
        suggestion:    suggestion || null,
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto mt-20 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-9 h-9 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank you!</h2>
        <p className="text-gray-500 text-sm">
          Your feedback helps us improve SmartLift AI for every student in the hostel.
        </p>
      </div>
    );
  }

  const TriOption = ({
    label, value, selected, onSelect,
  }: { label: string; value: Tristate; selected: Tristate | ''; onSelect: (v: Tristate) => void }) => (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
        selected === value
          ? 'bg-blue-600 border-blue-600 text-white'
          : 'border-gray-200 text-gray-600 hover:border-blue-300'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Feedback</h1>
        <p className="page-subtitle">Help improve SmartLift AI — your input matters</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star rating */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-4">
            Overall rating <span className="text-red-500">*</span>
          </h2>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                className="text-3xl leading-none transition-transform hover:scale-110 focus:outline-none"
                aria-label={`${n} stars`}
              >
                <Star
                  className={`w-8 h-8 ${
                    n <= (hoverStar || rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-gray-100 text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="mt-2 text-xs text-gray-400">
              {['','Poor','Below average','Average','Good','Excellent'][rating]}
            </p>
          )}
        </div>

        {/* Tristate questions */}
        <div className="card p-6 space-y-6">
          <div>
            <h2 className="font-semibold text-gray-900 mb-3">
              Is this app useful? <span className="text-red-500">*</span>
            </h2>
            <div className="flex gap-2 flex-wrap">
              {(['Yes', 'No', 'Not sure'] as Tristate[]).map(v => (
                <TriOption key={v} label={v} value={v} selected={useful} onSelect={setUseful} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 mb-3">
              Did it help you make a decision about when to take the lift?
            </h2>
            <div className="flex gap-2 flex-wrap">
              {(['Yes', 'No', 'Not sure'] as Tristate[]).map(v => (
                <TriOption key={v} label={v} value={v} selected={decisionHelp} onSelect={setHelp} />
              ))}
            </div>
          </div>
        </div>

        {/* Text areas */}
        <div className="card p-6 space-y-5">
          <div>
            <label className="label" htmlFor="problem">
              Did you face any problems? (optional)
            </label>
            <textarea
              id="problem" rows={3}
              value={problem} onChange={e => setProblem(e.target.value)}
              placeholder="Describe any bugs, confusing UI, or missing features…"
              className="input-field resize-none"
            />
          </div>

          <div>
            <label className="label" htmlFor="suggestion">
              What would you suggest for improvement? (optional)
            </label>
            <textarea
              id="suggestion" rows={3}
              value={suggestion} onChange={e => setSugg(e.target.value)}
              placeholder="Feature requests, design ideas, usability improvements…"
              className="input-field resize-none"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <button type="submit" disabled={saving} className="btn-primary w-full sm:w-auto px-10">
          {saving ? 'Submitting…' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
}
