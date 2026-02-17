
import React from 'react';
import { Page, User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activePage: Page;
  onNavigate: (page: Page) => void;
  user: User | null;
}

const Layout: React.FC<LayoutProps> = ({ children, activePage, onNavigate, user }) => {
  const navItems = [
    { id: Page.Dashboard, label: 'Dashboard', icon: '📊' },
    { id: Page.Workouts, label: 'Workouts', icon: '💪' },
    { id: Page.Diet, label: 'Diet', icon: '🥗' },
    { id: Page.AICoach, label: 'AI Coach', icon: '🤖' },
    { id: Page.Habits, label: 'Habits', icon: '📅' },
    { id: Page.Mood, label: 'Mood', icon: '🧠' },
    { id: Page.Profile, label: 'Profile', icon: '🏆' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col sticky top-0 h-screen">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
            <span>✨</span> FitMitra
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activePage === item.id 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
              {user?.username?.[0].toUpperCase() || 'G'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.username || 'Guest'}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">FitMitra User</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-gray-200 p-4 sticky top-0 z-10 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-600">FitMitra</h1>
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">
          {user?.username?.[0].toUpperCase() || 'G'}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Bottom Nav - Mobile */}
      <nav className="md:hidden bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 px-4 py-2 flex justify-around items-center z-20 shadow-lg">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-1 p-1 ${
              activePage === item.id ? 'text-indigo-600' : 'text-gray-400'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-[8px] font-bold uppercase">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
