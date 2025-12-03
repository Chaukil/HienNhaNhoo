import React, { useState } from 'react';
import { UserProfile } from '../types';
import { INITIAL_CURRENCY } from '../constants';

interface LoginProps {
  onLogin: (user: UserProfile) => void;
  onAdminLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onAdminLogin }) => {
  const [username, setUsername] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    if (username.toLowerCase() === 'admin') {
      onAdminLogin();
      return;
    }

    // Mock login/register
    const newUser: UserProfile = {
      username: username,
      level: 1,
      xp: 0,
      currency: INITIAL_CURRENCY,
      inventory: [],
      joinedDate: new Date().toISOString(),
      isAdmin: false
    };
    onLogin(newUser);
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-violet-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="inline-block p-4 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg mb-4">
             <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
               <polyline points="9 22 9 12 15 12 15 22"></polyline>
             </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 mb-2">CozyCorner</h1>
          <p className="text-slate-500">Design your dream sanctuary</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
              placeholder="Enter your name..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-violet-600 hover:-translate-y-1 transition-all duration-300"
          >
            {isRegistering ? 'Create Account' : 'Start Playing'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm text-slate-500 hover:text-violet-600 font-semibold"
          >
            {isRegistering ? 'Already have an account? Login' : "New here? Create an account"}
          </button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-200 text-center">
             <p className="text-xs text-slate-400">Pro tip: Login as "admin" to see the dashboard.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
