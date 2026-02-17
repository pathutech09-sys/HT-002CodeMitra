
import React from 'react';
import { Habit } from '../types';

interface HabitTrackerProps {
  habits: Habit[];
  onToggle: (id: string) => void;
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ habits, onToggle }) => {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-indigo-950">Habit Tracker</h2>
        <p className="text-gray-500">Consistency is key. Check off your daily non-negotiables.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {habits.map((habit) => (
            <div 
              key={habit.id}
              onClick={() => onToggle(habit.id)}
              className={`p-6 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                habit.completed 
                  ? 'bg-green-50 border-green-200 shadow-sm' 
                  : 'bg-white border-gray-100 hover:border-indigo-200 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  habit.completed ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-300'
                }`}>
                  {habit.completed ? '✓' : ''}
                </div>
                <span className={`font-bold ${habit.completed ? 'text-green-700 line-through' : 'text-indigo-950'}`}>
                  {habit.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-orange-500 font-bold">7d</span>
                <span className="text-xs text-gray-400">Streak</span>
              </div>
            </div>
          ))}

          <button className="w-full p-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-medium hover:border-indigo-300 hover:text-indigo-400 transition-colors">
            + Create New Habit
          </button>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative">
            <svg className="w-32 h-32">
              <circle cx="64" cy="64" r="58" stroke="#f3f4f6" strokeWidth="12" fill="none" />
              <circle 
                cx="64" cy="64" r="58" stroke="#6366f1" strokeWidth="12" fill="none" 
                strokeDasharray="364.4" 
                strokeDashoffset={364.4 - (364.4 * (habits.filter(h => h.completed).length / habits.length))}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">
                {Math.round((habits.filter(h => h.completed).length / habits.length) * 100)}%
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-indigo-950">Daily Progress</h3>
            <p className="text-sm text-gray-500">Almost there! Complete 1 more habit to reach your daily goal.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitTracker;
