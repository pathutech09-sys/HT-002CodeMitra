
import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Workout, Meal, Habit, MoodLog, UserProfile } from '../types';
import { GoogleGenAI } from "@google/genai";

interface DashboardProps {
  workouts: Workout[];
  meals: Meal[];
  habits: Habit[];
  moods: MoodLog[];
  profile: UserProfile | null;
}

const Dashboard: React.FC<DashboardProps> = ({ workouts, meals, habits, moods, profile }) => {
  const [quote, setQuote] = useState("Loading your daily motivation...");
  
  const stats = useMemo(() => {
    const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
    const totalProtein = meals.reduce((sum, m) => sum + m.protein, 0);
    const completedHabits = habits.filter(h => h.completed).length;
    const avgMood = moods.length > 0 ? (moods.reduce((sum, m) => sum + m.score, 0) / moods.length) : 0;
    
    // Goals based on profile with fallbacks
    const calorieGoal = profile ? (profile.goal === 'fat_loss' ? 1800 : profile.goal === 'muscle_gain' ? 2800 : 2200) : 2000;
    const proteinGoal = profile ? profile.weight * 1.5 : 100;

    return { totalCalories, totalProtein, calorieGoal, proteinGoal, completedHabits, avgMood };
  }, [meals, habits, moods, profile]);

  const coachSuggestion = useMemo(() => {
    if (!profile) {
      return {
        title: "Personalize your journey",
        text: "Finish setting up your profile to get personalized health goals and AI coaching.",
        icon: "📋"
      };
    }
    if (workouts.length === 0) {
      return {
        title: "Starting Strong",
        text: "You haven't logged any workouts yet. A 10-minute stretch or walk is a great way to start!",
        icon: "🚶‍♂️"
      };
    }
    if (stats.totalProtein < stats.proteinGoal * 0.5) {
      return {
        title: "Protein Boost",
        text: `Your protein intake is quite low today (${stats.totalProtein}g). Try adding some ${profile.dietPreference === 'veg' ? 'paneer or lentils' : 'chicken or eggs'} to your next meal!`,
        icon: "🍗"
      };
    }
    if (stats.avgMood < 3 && moods.length > 0) {
      return {
        title: "Mindfulness Check",
        text: "Your mood has been a bit low lately. How about 5 minutes of guided meditation?",
        icon: "🧘‍♀️"
      };
    }
    return {
      title: "Keep it up!",
      text: "You're doing great! Consistency is the secret ingredient to transformation.",
      icon: "✨"
    };
  }, [workouts, stats, profile, moods]);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: "Generate a short, powerful health and fitness motivational quote."
        });
        setQuote(response.text || "Push harder than yesterday if you want a different tomorrow.");
      } catch (err) {
        setQuote("Your only limit is you.");
      }
    };
    fetchQuote();
  }, []);

  const chartData = [
    { name: 'Mon', cal: 400 },
    { name: 'Tue', cal: 300 },
    { name: 'Wed', cal: 500 },
    { name: 'Thu', cal: 280 },
    { name: 'Fri', cal: 180 },
    { name: 'Today', cal: stats.totalCalories },
  ];

  const ProgressBar = ({ label, current, goal, unit, color }: any) => {
    const percentage = Math.min(Math.round((current / goal) * 100), 100);
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-700">{label}</span>
          <span className="text-gray-500">{current}{unit} / {goal}{unit}</span>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full ${color} transition-all duration-500 ease-out`} 
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Health Dashboard</h2>
          <p className="text-gray-500 italic">"{quote}"</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
          <span className="text-2xl">🔥</span>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Current Streak</p>
            <p className="text-xl font-bold text-orange-500">5 Days</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Goal Tracker */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span>🎯</span> Daily Goals
            </h3>
            {!profile && <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-bold">USING DEFAULT GOALS</span>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <ProgressBar label="Calories" current={stats.totalCalories} goal={stats.calorieGoal} unit="kcal" color="bg-orange-500" />
            <ProgressBar label="Protein" current={stats.totalProtein} goal={stats.proteinGoal.toFixed(0)} unit="g" color="bg-blue-500" />
            <ProgressBar label="Water Intake" current={stats.completedHabits > 0 ? 2.1 : 0.5} goal={3} unit="L" color="bg-cyan-500" />
            <ProgressBar label="Steps" current={4500} goal={10000} unit="" color="bg-emerald-500" />
          </div>
        </div>

        {/* AI Coach Suggestion */}
        <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-xl shadow-indigo-100 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-white/20 p-2 rounded-lg text-xl">{coachSuggestion.icon}</span>
              <h3 className="font-bold text-lg">AI Coach</h3>
            </div>
            <h4 className="font-bold mb-1">{coachSuggestion.title}</h4>
            <p className="text-indigo-100 text-sm leading-relaxed">{coachSuggestion.text}</p>
          </div>
          <button className="relative z-10 mt-6 bg-white text-indigo-600 px-4 py-2 rounded-xl font-bold text-xs hover:bg-indigo-50 transition-colors w-fit">
            Take Action
          </button>
          <span className="absolute -right-4 -bottom-4 text-white/10 text-9xl font-bold select-none pointer-events-none">✨</span>
        </div>
      </div>

      {/* Main Stats Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-6">Weekly Calorie Trend</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="cal" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-6">Activity Points (XP)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Line type="monotone" dataKey="cal" stroke="#a855f7" strokeWidth={3} dot={{r: 6, fill: '#a855f7', strokeWidth: 3, stroke: '#fff'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
