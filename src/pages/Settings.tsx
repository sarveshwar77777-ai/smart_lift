import React, { useState } from 'react';
import { User, Mail, Moon, Sun, Monitor, Lock, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

export default function Settings() {
  const { profile, user, signOut } = useAuth();
  
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');

  // Very basic theme toggle state for UI demonstration
  const [theme, setTheme] = useState('system');

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setUpdating(true);
    setMessage('');
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id);
        
      if (error) throw error;
      setMessage('Profile updated successfully.');
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Failed to update profile.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account and preferences.</p>
      </div>

      <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        
        {/* Profile Section */}
        <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">User Profile</h2>
          
          {message && (
            <div className={`p-4 rounded-lg mb-6 text-sm ${message.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 text-3xl font-bold border-4 border-white dark:border-gray-950 shadow-sm">
                {fullName?.charAt(0) || profile?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Account ID</p>
                <p className="font-mono text-xs bg-gray-100 dark:bg-gray-900 py-1 px-2 rounded text-gray-600 dark:text-gray-300 inline-block">{user?.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 w-full rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-white border outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="pl-10 w-full rounded-xl border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 px-4 py-2 text-gray-500 dark:text-gray-500 border cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
              </div>
            </div>

            <button 
              type="submit"
              disabled={updating}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50"
            >
              {updating ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Preferences Section */}
        <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Preferences</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Theme Mode (Visual Demo)
            </label>
            <div className="grid grid-cols-3 gap-4 max-w-md">
              <button 
                onClick={() => setTheme('light')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'}`}
              >
                <Sun className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">Light</span>
              </button>
              <button 
                onClick={() => setTheme('dark')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'}`}
              >
                <Moon className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">Dark</span>
              </button>
              <button 
                onClick={() => setTheme('system')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${theme === 'system' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700' : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'}`}
              >
                <Monitor className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">System</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Note: Actual dark mode toggle requires updating index.html/Tailwind config which is outside the scope of this UI.</p>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="p-6 md:p-8 bg-red-50/50 dark:bg-red-900/10">
          <h2 className="text-lg font-bold text-red-700 dark:text-red-500 mb-6 flex items-center gap-2">
            <Lock size={20} /> Security & Account
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Sign Out</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Log out of your account on this device.</p>
            </div>
            <button 
              onClick={() => signOut()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium shadow-sm"
            >
              <LogOut size={18} />
              Log Out
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
