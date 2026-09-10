import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function Signup() {
  const navigate = useNavigate();
  const [fullName, setFullName]       = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [confirm, setConfirm]         = useState('');
  const [error, setError]             = useState('');
  const [loading, setLoading]         = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      setError('Supabase is not configured. Add credentials to your .env file.');
      return;
    }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 6)  { setError('Password must be at least 6 characters.'); return; }

    setError('');
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: fullName } },
      });
      if (error) throw error;

      if (data.session) {
        navigate('/dashboard');
      } else {
        // Automatically sign in immediately
        const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
        if (!signInErr) {
          navigate('/dashboard');
        } else {
          navigate('/login');
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const requirements = [
    { label: 'At least 6 characters', met: password.length >= 6 },
    { label: 'Passwords match',       met: password === confirm && confirm !== '' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-b from-blue-700 to-blue-600 p-12 text-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <span className="font-bold text-xl">SmartLift AI</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-4">Start contributing real data</h2>
          <p className="text-blue-100 leading-relaxed">
            Every waiting-time observation you record helps the whole hostel understand lift patterns better.
          </p>
        </div>
        <p className="text-blue-300 text-xs">Student Innovation Project · Prototype</p>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">SmartLift AI</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
          <p className="text-gray-500 text-sm mb-8">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
          </p>

          {!isSupabaseConfigured && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <div className="font-semibold text-amber-800">Supabase not configured</div>
                <div className="text-amber-700 mt-0.5">Add your Supabase credentials to a <code className="bg-amber-100 px-1 rounded">.env</code> file to enable auth.</div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl mb-6 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="name">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input id="name" type="text" required value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Jane Doe" className="input-field pl-10" />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="email">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input id="email" type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@college.edu" className="input-field pl-10" />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="pwd">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input id="pwd" type="password" required value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 6 characters" className="input-field pl-10" />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="confirm">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input id="confirm" type="password" required value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Repeat password" className="input-field pl-10" />
              </div>
            </div>

            {(password || confirm) && (
              <ul className="space-y-1">
                {requirements.map(r => (
                  <li key={r.label} className={`flex items-center gap-2 text-xs ${r.met ? 'text-green-600' : 'text-gray-400'}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {r.label}
                  </li>
                ))}
              </ul>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 mt-2">
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
