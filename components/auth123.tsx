
import React, { useState } from 'react';
import { User } from '../types';

interface AuthProps {
  onAuthSuccess: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication
    // Added missing 'xp' property to satisfy User interface requirements
    onAuthSuccess({
      id: 1,
      username: isLogin ? (email.split('@')[0] || 'ChampionUser') : (username || 'ChampionUser'),
      email: email || 'user@fitmitra.com',
      xp: 0
    });
  };

  return (
    <div className="min-h-screen bg-indigo-600 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-3xl p-10 shadow-2xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">{isLogin ? 'Welcome Back' : 'Join FitMitra'}</h2>
          <p className="text-gray-500 mt-2">{isLogin ? 'Log in to track your progress' : 'Start your holistic health journey today'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div key="username-field">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input 
                id="username"
                name="username"
                type="text" 
                required
                autoFocus
                autoComplete="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                placeholder="FitChampion"
              />
            </div>
          )}
          <div key="email-field">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              id="email"
              name="email"
              type="email" 
              required
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div key="password-field">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              id="password"
              name="password"
              type="password" 
              required
              autoComplete={isLogin ? "current-password" : "new-password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all transform hover:-translate-y-1 active:scale-95"
          >
            {isLogin ? 'Log In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 font-bold hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
