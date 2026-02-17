
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Habit } from '../types';
import { GoogleGenAI } from "@google/genai";

interface HabitTrackerProps {
  habits: Habit[];
  onAdd: (habit: Habit) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ habits, onAdd, onToggle, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [isMotivationMode, setIsMotivationMode] = useState(false);
  const [motivationText, setMotivationText] = useState('');
  const [isLoadingMotivation, setIsLoadingMotivation] = useState(false);
  
  // Quick Boost States
  const [quickBoost, setQuickBoost] = useState<string>('Loading your daily boost...');
  const [isLoadingBoost, setIsLoadingBoost] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchQuickBoost = useCallback(async () => {
    setIsLoadingBoost(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Give me one powerful habit boost.",
        config: {
          systemInstruction: `You are a Motivational AI Coach inside a fitness app.
Your task: Generate ONLY ONE motivational dialogue at a time.
The dialogue must be short, powerful, and impactful (1–3 sentences maximum).
Focus on discipline, daily habits, consistency, and growth.
Rules:
- Do NOT mention Gemini, Google, or AI.
- Speak directly to the user as "you".
- Output only the dialogue text, no formatting or headings.`,
          temperature: 0.8,
        },
      });
      setQuickBoost(response.text || "Your habits define your future. Start small, but start today.");
    } catch (err) {
      setQuickBoost("Discipline is choosing between what you want now and what you want most.");
    } finally {
      setIsLoadingBoost(false);
    }
  }, []);

  useEffect(() => {
    fetchQuickBoost();
  }, [fetchQuickBoost]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    onAdd({
      id: Date.now().toString(),
      name: newHabitName.trim(),
      completed: false
    });

    setNewHabitName('');
    setIsAdding(false);
  };

  const startMotivationSession = async () => {
    setIsMotivationMode(true);
    setIsLoadingMotivation(true);
    setMotivationText('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContentStream({
        model: 'gemini-3-pro-preview',
        contents: "Start our deep 20-minute habit mastery session. Talk to me about discipline, small wins, and the power of consistency.",
        config: {
          systemInstruction: `You are a Motivational AI Coach inside the FitMitra app.
Your task: Generate powerful long-form motivational dialogues.
Do NOT mention Gemini or any AI model. Speak as the app’s built-in AI Coach.
Tone: Powerful, positive, inspiring. Use short paragraphs.
Cover roughly 20 minutes of content.`,
          temperature: 0.9,
        },
      });

      let fullText = '';
      for await (const chunk of response) {
        fullText += chunk.text;
        setMotivationText(fullText);
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }
    } catch (err) {
      setMotivationText("Obstacles are opportunities. Let's try again when you're ready.");
    } finally {
      setIsLoadingMotivation(false);
    }
  };

  const EmptyState = () => (
    <div className="bg-white rounded-[2rem] p-10 border-2 border-dashed border-gray-100 flex flex-col items-center text-center space-y-6">
      <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-5xl animate-bounce duration-1000">
        🌱
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-indigo-950">No habits yet?</h3>
        <p className="text-gray-500 max-w-xs mx-auto">
          Consistency is the secret to transformation. Start by adding one small daily action.
        </p>
      </div>
      <button 
        onClick={() => setIsAdding(true)}
        className="bg-indigo-600 text-white font-bold px-8 py-4 rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-2"
      >
        <span className="text-xl">+</span>
        Start Your First Habit
      </button>
    </div>
  );

  if (isMotivationMode) {
    return (
      <div className="fixed inset-0 z-50 bg-indigo-950 text-white overflow-hidden flex flex-col animate-in fade-in duration-500">
        <div className="max-w-3xl mx-auto w-full flex flex-col h-full p-6 md:p-12">
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-3">
              <span className="bg-white/10 p-2 rounded-xl text-xl">🤖</span>
              <h2 className="text-xl font-black tracking-tight uppercase">Coach Session</h2>
            </div>
            <button 
              onClick={() => setIsMotivationMode(false)}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              ✕
            </button>
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto pr-4 space-y-8 scroll-smooth"
          >
            {motivationText.split('\n\n').map((para, i) => (
              <p key={i} className="text-2xl md:text-3xl font-bold leading-relaxed opacity-90 animate-in slide-in-from-bottom-4 duration-700">
                {para}
              </p>
            ))}
            {isLoadingMotivation && (
              <div className="flex gap-2 p-4">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 flex flex-col items-center">
             {!isLoadingMotivation && motivationText && (
               <button 
                onClick={() => setIsMotivationMode(false)}
                className="bg-white text-indigo-950 px-8 py-4 rounded-2xl font-black text-lg hover:bg-indigo-50 transition-all"
               >
                I'm Ready to Crush It
               </button>
             )}
             <p className="mt-4 text-[10px] text-white/40 font-black uppercase tracking-[0.3em]">FitMitra Mastery Session</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-indigo-950">Habit Tracker</h2>
          <p className="text-gray-500">Consistency is key. Check off your daily non-negotiables.</p>
        </div>
        <button 
          onClick={startMotivationSession}
          className="flex items-center gap-3 bg-indigo-50 text-indigo-600 px-6 py-3 rounded-2xl font-black text-sm hover:bg-indigo-100 transition-all group"
        >
          <span className="text-xl group-hover:animate-pulse">🎧</span>
          Deep Motivation Session
        </button>
      </header>

      {/* Quick Boost Section */}
      <div className="bg-white border-2 border-indigo-100 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center gap-6 animate-in slide-in-from-top-4 duration-500">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-indigo-100 flex-shrink-0">
          👊
        </div>
        <div className="flex-1 text-center md:text-left">
          <p className={`text-xl font-bold text-indigo-950 leading-snug transition-opacity duration-300 ${isLoadingBoost ? 'opacity-30' : 'opacity-100'}`}>
            {quickBoost}
          </p>
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-2">Coach's Daily Word</p>
        </div>
        <button 
          onClick={fetchQuickBoost}
          disabled={isLoadingBoost}
          className={`p-3 rounded-xl transition-all ${isLoadingBoost ? 'bg-gray-100 text-gray-400' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:rotate-180 duration-500'}`}
          title="Refresh Motivation"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isLoadingBoost ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {habits.length === 0 && !isAdding ? (
            <EmptyState />
          ) : (
            <>
              {habits.map((habit) => (
                <div 
                  key={habit.id}
                  className={`p-6 rounded-2xl border transition-all flex items-center justify-between group ${
                    habit.completed 
                      ? 'bg-green-50 border-green-200 shadow-sm' 
                      : 'bg-white border-gray-100 hover:border-indigo-200 shadow-sm'
                  }`}
                >
                  <div 
                    className="flex items-center gap-4 cursor-pointer flex-1"
                    onClick={() => onToggle(habit.id)}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      habit.completed ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-300'
                    }`}>
                      {habit.completed ? '✓' : ''}
                    </div>
                    <span className={`font-bold ${habit.completed ? 'text-green-700 line-through' : 'text-indigo-950'}`}>
                      {habit.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <span className="text-orange-500 font-bold text-sm">0d</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">Streak</span>
                    </div>
                    <button 
                      onClick={() => onDelete(habit.id)}
                      className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                      title="Remove habit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}

              {isAdding ? (
                <div className="bg-white p-6 rounded-2xl border border-indigo-200 shadow-md animate-in fade-in zoom-in duration-200">
                  <form onSubmit={handleAddSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">New Habit Name</label>
                      <input 
                        type="text"
                        autoFocus
                        placeholder="e.g. Morning Stretch"
                        value={newHabitName}
                        onChange={(e) => setNewHabitName(e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-indigo-950 font-medium"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button 
                        type="submit"
                        className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors"
                      >
                        Add Habit
                      </button>
                      <button 
                        type="button"
                        onClick={() => setIsAdding(false)}
                        className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <button 
                  onClick={() => setIsAdding(true)}
                  className="w-full p-6 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all flex items-center justify-center gap-2 group"
                >
                  <span className="text-xl group-hover:scale-125 transition-transform">+</span>
                  Create New Habit
                </button>
              )}
            </>
          )}
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative">
            <svg className="w-32 h-32">
              <circle cx="64" cy="64" r="58" stroke="#f3f4f6" strokeWidth="12" fill="none" />
              <circle 
                cx="64" cy="64" r="58" stroke="#6366f1" strokeWidth="12" fill="none" 
                strokeDasharray="364.4" 
                strokeDashoffset={364.4 - (364.4 * (habits.length > 0 ? (habits.filter(h => h.completed).length / habits.length) : 0))}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">
                {habits.length > 0 ? Math.round((habits.filter(h => h.completed).length / habits.length) * 100) : 0}%
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-indigo-950">Daily Progress</h3>
            <p className="text-sm text-gray-500">
              {habits.length > 0 
                ? (habits.every(h => h.completed) ? "Perfect! All habits completed." : "Almost there! Keep going.")
                : "Add some habits to start tracking!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitTracker;
