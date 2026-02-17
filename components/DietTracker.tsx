
import React, { useState } from 'react';
import { Meal } from '../types';

interface DietTrackerProps {
  meals: Meal[];
  onAdd: (meal: Meal) => void;
}

const DietTracker: React.FC<DietTrackerProps> = ({ meals, onAdd }) => {
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !calories) return;
    onAdd({
      id: Date.now().toString(),
      name,
      calories: parseInt(calories),
      protein: parseInt(protein) || 0,
      date: new Date().toLocaleDateString(),
    });
    setName('');
    setCalories('');
    setProtein('');
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-indigo-950">Diet Tracking</h2>
        <p className="text-gray-500">Keep track of your macros and nutrition.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold mb-4 text-indigo-950">Add a Meal</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Meal Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Chicken Salad"
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Calories (kcal)</label>
                <input 
                  type="number" 
                  value={calories}
                  onChange={e => setCalories(e.target.value)}
                  placeholder="450"
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Protein (g)</label>
                <input 
                  type="number" 
                  value={protein}
                  onChange={e => setProtein(e.target.value)}
                  placeholder="25"
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                />
              </div>
              <button className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors">Log Meal</button>
            </form>
          </div>

          <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
            <p className="text-indigo-800 font-bold mb-2">💡 Nutrition Tip</p>
            <p className="text-indigo-600 text-sm">Drinking water before meals can help reduce calorie intake and aid digestion.</p>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-fit">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-indigo-950">Logged Meals</h3>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Today</span>
          </div>
          <div className="divide-y divide-gray-50">
            {meals.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No meals logged for today.</div>
            ) : (
              meals.map(meal => (
                <div key={meal.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-bold text-indigo-950">{meal.name}</p>
                    <p className="text-xs text-gray-500">{meal.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-indigo-600">{meal.calories} kcal</p>
                    <p className="text-xs text-gray-400">{meal.protein}g protein</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietTracker;
