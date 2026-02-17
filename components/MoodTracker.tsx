
import React, { useState } from 'react';
import { MoodLog } from '../types';
import { MOOD_EMOJIS } from '../constants';

interface MoodTrackerProps {
  moods: MoodLog[];
  onLog: (mood: MoodLog) => void;
  onDelete: (id: string) => void;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ moods, onLog, onDelete }) => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState('');

  const handleLog = () => {
    if (selectedMood === null) return;
    onLog({
      id: Date.now().toString(),
      score: selectedMood,
      note,
      date: new Date().toLocaleDateString(),
    });
    setNote('');
    setSelectedMood(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-indigo-950">How are you feeling?</h2>
        <p className="text-gray-500 mt-2">Checking in with your emotions is the first step to mental wellness.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
        <div className="grid grid-cols-5 gap-4">
          {MOOD_EMOJIS.map((m) => (
            <button
              key={m.score}
              onClick={() => setSelectedMood(m.score)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
                selectedMood === m.score 
                  ? 'bg-indigo-50 border-2 border-indigo-500 transform scale-105' 
                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
              }`}
            >
              <span className="text-4xl">{m.emoji}</span>
              <span className="text-[10px] uppercase font-bold text-gray-400">{m.label}</span>
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Add a note (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-gray-900"
          />
        </div>

        <button
          onClick={handleLog}
          disabled={selectedMood === null}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-colors ${
            selectedMood === null 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'
          }`}
        >
          Save Check-in
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-indigo-950 text-lg">Recent Moods</h3>
        <div className="space-y-3">
          {moods.length === 0 ? (
            <p className="text-center py-10 text-gray-400">No mood entries yet.</p>
          ) : (
            moods.slice().reverse().map((log) => (
              <div key={log.id} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4 group">
                <span className="text-3xl">
                  {MOOD_EMOJIS.find(e => e.score === log.score)?.emoji}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-indigo-950">
                    {MOOD_EMOJIS.find(e => e.score === log.score)?.label}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-1">{log.note || 'No note added'}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] text-gray-400 font-bold">{log.date}</span>
                  <button 
                    onClick={() => onDelete(log.id)}
                    className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
