import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { CheckCircle2, AlertCircle, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [fullName, setName]   = useState('');
  const [hostel, setHostel]   = useState('');
  const [room, setRoom]       = useState('');
  const [saving, setSaving]   = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => {
    if (profile) {
      setName(profile.full_name ?? '');
      setHostel(profile.hostel ?? '');
      setRoom(profile.room ?? '');
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      const { error } = await supabase.from('profiles').update({
        full_name: fullName,
        hostel: hostel || null,
        room:   room   || null,
      }).eq('id', user.id);
      if (error) throw error;
      if (refreshProfile) await refreshProfile();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">Manage your account information</p>
      </div>

      {/* Avatar / identity card */}
      <div className="card p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <User className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <div className="font-bold text-gray-900 text-lg">{profile?.full_name ?? 'Student'}</div>
          <div className="text-sm text-gray-500">{user?.email}</div>
          {profile?.hostel && (
            <div className="text-xs text-gray-400 mt-0.5">{profile.hostel} {profile.room ? `· Room ${profile.room}` : ''}</div>
          )}
        </div>
      </div>

      {/* Edit form */}
      <form onSubmit={handleSave} className="card p-6 space-y-5">
        <h2 className="font-semibold text-gray-900">Edit Details</h2>

        <div>
          <label className="label" htmlFor="name">Full Name</label>
          <input
            id="name" type="text" value={fullName}
            onChange={e => setName(e.target.value)}
            className="input-field" placeholder="Jane Doe"
          />
        </div>

        <div>
          <label className="label" htmlFor="email">Email</label>
          <input
            id="email" type="email" value={user?.email ?? ''} disabled
            className="input-field bg-gray-50 text-gray-400 cursor-not-allowed"
          />
          <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="hostel">Hostel Name (optional)</label>
            <input
              id="hostel" type="text" value={hostel}
              onChange={e => setHostel(e.target.value)}
              className="input-field" placeholder="e.g. Block A"
            />
          </div>
          <div>
            <label className="label" htmlFor="room">Room Number (optional)</label>
            <input
              id="room" type="text" value={room}
              onChange={e => setRoom(e.target.value)}
              className="input-field" placeholder="e.g. 304"
            />
          </div>
        </div>

        {success && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
            <CheckCircle2 className="w-4 h-4" />
            Profile saved successfully.
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>

      {/* Sign out */}
      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 mb-3">Account Actions</h2>
        <button onClick={handleSignOut} className="btn-danger flex items-center gap-2">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );
}
