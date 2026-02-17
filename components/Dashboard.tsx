
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
  streak: number;
  onOpenCoach: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ workouts, meals, habits, moods, profile, streak, onOpenCoach }) => {
  const [quote, setQuote] = useState("Loading your daily motivation...");
  
  const stats = useMemo(() => {
    const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
    const totalProtein = meals.reduce((sum, m) => sum + m.protein, 0);
    const completedHabits = habits.filter(h => h.completed).length;
    const avgMood = moods.length > 0 ? (moods.reduce((sum, m) => sum + m.score, 0) / moods.length) : 0;
    
    // Dynamic Water and Steps based on user-added habits
    const waterHabit = habits.find(h => h.name.toLowerCase().includes('water'));
    const stepsHabit = habits.find(h => h.name.toLowerCase().includes('steps'));
    
    const waterIntake = waterHabit?.completed ? 3.0 : 0.0;
    const stepsCount = stepsHabit?.completed ? 10000 : 0;

    // Goals based on profile with fallbacks
    const calorieGoal = profile ? (profile.goal === 'fat_loss' ? 1800 : profile.goal === 'muscle_gain' ? 2800 : 2200) : 2000;
    const proteinGoal = profile ? profile.weight * 1.5 : 100;

    return { 
      totalCalories, 
      totalProtein, 
      calorieGoal, 
      proteinGoal, 
      completedHabits, 
      avgMood, 
      waterIntake, 
      stepsCount, 
      hasWater: !!waterHabit, 
      hasSteps: !!stepsHabit 
    };
  }, [meals, habits, moods, profile]);

  const coachSuggestion = useMemo(() => {
    if (!profile) {
      return {
        title: "Personalize your journey",
        text: "Finish setting up your profile to get personalized health goals and AI coaching.",
        icon: "📋"
      };
    }
    if (workouts.length === 0 && habits.length === 0 && meals.length === 0) {
      return {
        title: "Ready to start?",
        text: "Add your first habit or log a workout to begin your transformation journey!",
        icon: "🚀"
      };
    }
    return {
      title: "Need a Diet Plan?",
      text: "Talk to our AI Nutritionist for a customized Indian meal plan based on your age and height.",
      icon: "🍱"
    };
  }, [workouts, profile, habits, meals]);

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

  const isFirstTimeUser = workouts.length === 0 && meals.length === 0 && habits.length === 0;

  const chartData = useMemo(() => {
    // Strictly no fake data: past days show 0 if no records exist
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const history = days.map(d => ({ name: d, cal: 0 }));
    return [...history, { name: 'Today', cal: stats.totalCalories }];
  }, [stats.totalCalories]);

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
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-indigo-950">Health Dashboard</h2>
          <p className="text-gray-500 italic font-medium">"{quote}"</p>
        </div>
        <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <span className="text-3xl">{streak > 0 ? '🔥' : '⏳'}</span>
          <div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Your Streak</p>
            <p className={`text-2xl font-black ${streak > 0 ? 'text-orange-500' : 'text-gray-300'}`}>
               {streak > 0 ? `${streak} Days` : '0 Days'}
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Goal Tracker */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black flex items-center gap-2 text-indigo-950">
              <span>🎯</span> Daily Goals
            </h3>
            {isFirstTimeUser && (
              <span className="text-[10px] bg-indigo-600 text-white px-3 py-1 rounded-full font-black uppercase tracking-widest">New Session</span>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <ProgressBar label="Calories" current={stats.totalCalories} goal={stats.calorieGoal} unit="kcal" color="bg-orange-500" />
            <ProgressBar label="Protein" current={stats.totalProtein} goal={stats.proteinGoal.toFixed(0)} unit="g" color="bg-blue-500" />
            
            {stats.hasWater && (
              <ProgressBar label="Water Intake" current={stats.waterIntake} goal={3} unit="L" color="bg-cyan-500" />
            )}
            {stats.hasSteps && (
              <ProgressBar label="Steps" current={stats.stepsCount} goal={10000} unit="" color="bg-emerald-500" />
            )}
          </div>

          {!stats.hasWater && !stats.hasSteps && (
            <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-100 text-center">
              <p className="text-sm text-gray-500 font-semibold mb-2">
                Customize your dashboard
              </p>
              <p className="text-xs text-gray-400">
                Add "Water" or "Steps" to your Habits list to see tracking here.
              </p>
            </div>
          )}
        </div>

        {/* AI Coach Suggestion */}
        <div className="bg-indigo-600 p-8 rounded-[2rem] text-white shadow-2xl shadow-indigo-100 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-white/20 p-3 rounded-2xl text-2xl">{coachSuggestion.icon}</span>
              <h3 className="font-black text-xl tracking-tight">AI Coach</h3>
            </div>
            <h4 className="font-black text-lg mb-2">{coachSuggestion.title}</h4>
            <p className="text-indigo-100 text-sm leading-relaxed font-medium">{coachSuggestion.text}</p>
          </div>
          <button 
            onClick={onOpenCoach}
            className="relative z-10 mt-8 bg-white text-indigo-600 px-6 py-3 rounded-2xl font-black text-sm hover:bg-indigo-50 transition-all shadow-lg active:scale-95 w-full"
          >
            Start Conversation
          </button>
          <span className="absolute -right-6 -bottom-6 text-white/10 text-[180px] font-black select-none pointer-events-none">AI</span>
        </div>
      </div>

      {/* Main Stats Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-black mb-8 text-indigo-950">Weekly Calorie Trend</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 700}} />
                <Bar dataKey="cal" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-black mb-8 text-indigo-950">XP Gain (Consistency)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 700}} />
                <Line type="monotone" dataKey="cal" stroke="#a855f7" strokeWidth={5} dot={{r: 8, fill: '#a855f7', strokeWidth: 4, stroke: '#fff'}} activeDot={{r: 10}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
