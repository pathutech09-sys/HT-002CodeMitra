
import React, { useState } from 'react';
import { User, Workout, UserProfile } from '../types';
import { DUMMY_BADGES } from '../constants';

interface ProfileProps {
  user: User | null;
  workouts: Workout[];
  profile: UserProfile | null;
  onUpdateProfile: (p: UserProfile) => void;
}

const AVATAR_OPTIONS = ['🏃', '🧘', '🏋️', '🚴', '🥋', '🥗', '🍎', '💪', '🔥', '🧠', '✨', '🏆'];

const Profile: React.FC<ProfileProps> = ({ user, workouts, profile, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState<UserProfile>(profile || {
    height: 175,
    weight: 70,
    goal: 'maintain',
    dietPreference: 'veg',
    avatar: '🏃'
  });

  const xp = user?.xp || 0;
  const levelData = xp < 500 ? { name: 'Beginner', icon: '🌱' } : xp < 1500 ? { name: 'Intermediate', icon: '⚔️' } : { name: 'Elite', icon: '👑' };
  
  const handleSave = () => {
    onUpdateProfile(tempProfile);
    setIsEditing(false);
  };

  const startSetup = () => {
    setIsEditing(true);
  };

  // Improved Empty State for Profile Setup
  if (!profile && !isEditing) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-indigo-100 border border-indigo-50/50 text-center relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-50 rounded-full blur-3xl opacity-50"></div>

          <div className="relative z-10 space-y-8">
            {/* Visual Indicator */}
            <div className="relative mx-auto w-32 h-32">
              <div className="absolute inset-0 bg-indigo-600 rounded-3xl rotate-6 opacity-10 animate-pulse"></div>
              <div className="absolute inset-0 bg-indigo-600 rounded-3xl -rotate-3 opacity-20"></div>
              <div className="relative w-full h-full bg-white rounded-3xl border-2 border-indigo-100 flex items-center justify-center text-6xl shadow-inner">
                👤
                <div className="absolute -top-2 -right-2 bg-yellow-400 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center text-sm font-bold animate-bounce">
                  !
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl font-extrabold text-indigo-950 tracking-tight">Complete Your Profile</h2>
              <p className="text-gray-500 text-lg leading-relaxed max-w-sm mx-auto">
                Unlock personalized tracking and AI coaching by telling us a bit about yourself.
              </p>
            </div>

            {/* Benefits List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-md mx-auto">
              {[
                { icon: '🎯', text: 'Custom Calorie Goals' },
                { icon: '🥗', text: 'Tailored Diet Plans' },
                { icon: '📈', text: 'Precise BMI Tracking' },
                { icon: '✨', text: 'Smart AI Insights' }
              ].map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <span className="text-xl">{benefit.icon}</span>
                  <span className="text-sm font-semibold text-indigo-900">{benefit.text}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 space-y-4">
              <button 
                onClick={startSetup}
                className="w-full bg-indigo-600 text-white font-bold py-5 rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
              >
                Get Started Now
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              <p className="text-[11px] text-gray-400 uppercase font-bold tracking-[0.2em]">Takes less than 30 seconds</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Level Header */}
      <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-white/30 flex items-center justify-center text-5xl bg-white/10 backdrop-blur-sm shadow-xl">
              {profile?.avatar || levelData.icon}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-indigo-900 font-bold text-xs px-2 py-1 rounded-full shadow-lg">
              LVL {Math.floor(xp / 500) + 1}
            </div>
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-3xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
               {user?.username}
               <span className="text-xl opacity-80">{levelData.icon}</span>
            </h2>
            <p className="text-indigo-100 font-medium">{levelData.name} Fitness Enthusiast</p>
            <div className="mt-4 max-w-md">
              <div className="flex justify-between text-xs mb-1 font-bold">
                <span>XP PROGRESS</span>
                <span>{xp % 500} / 500 XP</span>
              </div>
              <div className="h-3 w-full bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-400 transition-all duration-1000" 
                  style={{ width: `${(xp % 500) / 5}%` }}
                />
              </div>
            </div>
          </div>
          <div className="flex gap-4">
             <div className="bg-white/10 p-4 rounded-2xl text-center backdrop-blur-sm min-w-[100px]">
                <p className="text-2xl font-bold">{xp}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Total XP</p>
             </div>
             <div className="bg-white/10 p-4 rounded-2xl text-center backdrop-blur-sm min-w-[100px]">
                <p className="text-2xl font-bold">{workouts.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Workouts</p>
             </div>
          </div>
        </div>
        <span className="absolute top-0 right-0 p-8 text-white/5 text-[200px] leading-none select-none pointer-events-none">XP</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editable Profile */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-indigo-950">Fitness Profile</h3>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="text-indigo-600 font-bold text-sm hover:underline"
              >
                Edit Profile
              </button>
            ) : (
              <button 
                onClick={handleSave}
                className="bg-indigo-600 text-white px-4 py-1 rounded-lg font-bold text-sm hover:bg-indigo-700"
              >
                Save
              </button>
            )}
          </div>

          <div className="space-y-6">
            {isEditing && (
              <div className="space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Choose Your Avatar</p>
                <div className="grid grid-cols-6 gap-2">
                  {AVATAR_OPTIONS.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => setTempProfile({...tempProfile, avatar: emoji})}
                      className={`text-2xl p-2 rounded-xl border-2 transition-all ${
                        tempProfile.avatar === emoji 
                          ? 'border-indigo-600 bg-indigo-50 scale-110' 
                          : 'border-transparent bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Height (cm)</p>
                {isEditing ? (
                  <input 
                    type="number" 
                    value={tempProfile.height}
                    onChange={e => setTempProfile({...tempProfile, height: parseInt(e.target.value)})}
                    className="w-full border-b-2 border-indigo-200 py-1 outline-none text-indigo-950 font-bold bg-transparent"
                  />
                ) : (
                  <p className="text-lg font-bold text-indigo-950">{profile?.height || '---'} cm</p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Weight (kg)</p>
                {isEditing ? (
                  <input 
                    type="number" 
                    value={tempProfile.weight}
                    onChange={e => setTempProfile({...tempProfile, weight: parseInt(e.target.value)})}
                    className="w-full border-b-2 border-indigo-200 py-1 outline-none text-indigo-950 font-bold bg-transparent"
                  />
                ) : (
                  <p className="text-lg font-bold text-indigo-950">{profile?.weight || '---'} kg</p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Goal</p>
                {isEditing ? (
                  <select 
                    value={tempProfile.goal}
                    onChange={e => setTempProfile({...tempProfile, goal: e.target.value as any})}
                    className="w-full border-b-2 border-indigo-200 py-1 outline-none text-indigo-950 font-bold bg-transparent"
                  >
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="fat_loss">Fat Loss</option>
                    <option value="maintain">Maintain</option>
                  </select>
                ) : (
                  <p className="text-lg font-bold text-indigo-950">{profile?.goal.replace('_', ' ').toUpperCase() || '---'}</p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Diet</p>
                {isEditing ? (
                  <select 
                    value={tempProfile.dietPreference}
                    onChange={e => setTempProfile({...tempProfile, dietPreference: e.target.value as any})}
                    className="w-full border-b-2 border-indigo-200 py-1 outline-none text-indigo-950 font-bold bg-transparent"
                  >
                    <option value="veg">Vegetarian</option>
                    <option value="non-veg">Non-Vegetarian</option>
                    <option value="vegan">Vegan</option>
                  </select>
                ) : (
                  <p className="text-lg font-bold text-indigo-950">{profile?.dietPreference.toUpperCase() || '---'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Badges System */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-6 text-indigo-950">Badges Unlocked</h3>
          <div className="grid grid-cols-3 gap-4">
            {DUMMY_BADGES.map((badge, i) => (
              <div key={badge.id} className="group relative flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-3xl transition-transform group-hover:scale-110 group-hover:bg-indigo-100">
                  {badge.icon}
                </div>
                <p className="text-[10px] font-bold mt-2 text-indigo-950 leading-tight">{badge.name}</p>
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-[10px] p-2 rounded-lg w-24 z-10">
                  {badge.description}
                </div>
              </div>
            ))}
            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-col items-center text-center opacity-40">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-3xl grayscale">
                  🔒
                </div>
                <p className="text-[10px] font-bold mt-2 text-gray-400">Locked</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-6 text-indigo-950">Activity Timeline</h3>
        <div className="space-y-6">
          {workouts.length === 0 ? (
            <p className="text-center py-12 text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
              No activity recorded yet. Time to get active! 🚀
            </p>
          ) : (
            workouts.slice().reverse().map((w) => (
              <div key={w.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl font-bold">
                  💪
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-indigo-950">{w.type} Session</h4>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">+100 XP</span>
                  </div>
                  <p className="text-xs text-gray-500">{w.duration} mins • {w.calories} kcal • {w.date}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
