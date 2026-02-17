import React, { useState, useEffect } from 'react';
import { Workout } from '../types';

const WorkoutTracker: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [type, setType] = useState('Cardio');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');

  const userId = 1;

  // 🔹 FETCH workouts from backend
  const fetchWorkouts = async () => {
    const res = await fetch(`http://localhost:5000/api/workouts/${userId}`);
    const json = await res.json();
    if (json.status === 'success') {
      setWorkouts(json.data);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  // 🔹 ADD workout
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!duration || !calories) return;

    await fetch('http://localhost:5000/api/workout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        type,
        duration: Number(duration),
        calories_burned: Number(calories),
      }),
    });

    setDuration('');
    setCalories('');
    fetchWorkouts();
  };

  // 🔹 DELETE workout
  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:5000/api/workout/${id}`, {
      method: 'DELETE',
    });
    fetchWorkouts();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-indigo-950">Workout Tracker</h2>
        <p className="text-gray-500">Record your sweat sessions and track progress.</p>
      </div>

      {/* FORM — SAME UI */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exercise Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2"
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
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Calories Burned</label>
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2"
            />
          </div>

          <button className="bg-indigo-600 text-white font-bold py-2 rounded-lg">
            Log Workout
          </button>
        </form>
      </div>

      {/* TABLE — SAME UI */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold">
            <tr>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Duration</th>
              <th className="px-6 py-4">Calories</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {workouts.map((w) => (
              <tr key={w.id}>
                <td className="px-6 py-4 font-medium text-indigo-950">{w.type}</td>
                <td className="px-6 py-4">{w.duration} mins</td>
                <td className="px-6 py-4 text-orange-600 font-bold">
                  {w.calories_burned} kcal
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {new Date(w.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleDelete(w.id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkoutTracker;
