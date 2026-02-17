
import React, { useState } from 'react';
import { Workout } from '../types';

interface WorkoutTrackerProps {
  workouts: Workout[];
  onAdd: (workout: Workout) => void;
}

const WorkoutTracker: React.FC<WorkoutTrackerProps> = ({ workouts, onAdd }) => {
  const [type, setType] = useState('Cardio');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!duration || !calories) return;
    
    onAdd({
      id: Date.now().toString(),
      type,
      duration: parseInt(duration),
      calories: parseInt(calories),
      date: new Date().toLocaleDateString(),
    });
    
    setDuration('');
    setCalories('');
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-indigo-950">Workout Tracker</h2>
        <p className="text-gray-500">Record your sweat sessions and track progress.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exercise Type</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900"
            >
              <option>Cardio</option>
              <option>Strength</option>
              <option>Yoga</option>
              <option>Swimming</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
            <input 
              type="number" 
              placeholder="30"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Calories Burned</label>
            <input 
              type="number" 
              placeholder="250"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900"
            />
          </div>
          <button type="submit" className="bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            Log Workout
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold">
            <tr>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Duration</th>
              <th className="px-6 py-4">Calories</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {workouts.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-400">No workouts logged yet. Get moving!</td>
              </tr>
            ) : (
              workouts.map((w) => (
                <tr key={w.id}>
                  <td className="px-6 py-4 font-medium text-indigo-950">{w.type}</td>
                  <td className="px-6 py-4 text-gray-600">{w.duration} mins</td>
                  <td className="px-6 py-4 text-orange-600 font-bold">{w.calories} kcal</td>
                  <td className="px-6 py-4 text-gray-500">{w.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkoutTracker;
