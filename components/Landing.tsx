
import React from 'react';

interface LandingProps {
  onGetStarted: () => void;
}

const Landing: React.FC<LandingProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-indigo-600">FitMitra</h1>
        <button 
          onClick={onGetStarted}
          className="text-indigo-600 font-bold hover:text-indigo-700"
        >
          Login
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-12 md:pt-24 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <span className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-sm font-bold tracking-wide">
              HACKATHON MVP v1.0
            </span>
            <h2 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight">
              Holistic Health, <span className="text-indigo-600">Simplified.</span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed max-w-md">
              FitMitra is your all-in-one companion for tracking workouts, diet, habits, and mental wellness. 
              Built for results, powered by AI motivation.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={onGetStarted}
                className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all transform hover:-translate-y-1"
              >
                Join the Movement
              </button>
              <button className="bg-gray-50 text-gray-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all">
                Learn More
              </button>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <img key={i} src={`https://picsum.photos/32/32?random=${i}`} className="w-8 h-8 rounded-full border-2 border-white" alt="user" />
                ))}
              </div>
              <span>Joined by 1,000+ early adopters</span>
            </div>
          </div>
          <div className="relative">
             <img src="https://picsum.photos/600/600?fitness" className="rounded-3xl shadow-2xl" alt="fitness" />
             <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-2xl">🔥</div>
                <div>
                   <p className="text-xs text-gray-400 uppercase font-bold">Calories Burned</p>
                   <p className="text-2xl font-bold text-gray-900">4,280 <span className="text-sm font-medium text-gray-400">kcal</span></p>
                </div>
             </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">Everything you need in one place</h3>
            <p className="text-gray-500 max-w-xl mx-auto">Stop juggling five different apps. Track your entire well-being cycle with FitMitra.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Workout Logging', desc: 'Detailed tracking for any exercise type.', icon: '💪' },
              { title: 'Nutrition Mapping', desc: 'Track calories and macros with ease.', icon: '🥗' },
              { title: 'Mental Wellness', desc: 'Daily mood tracking and AI advice.', icon: '🧠' },
              { title: 'Habit Formation', desc: 'Build lasting routines with streaks.', icon: '📅' },
              { title: 'Gamified Growth', desc: 'Earn badges and level up your health.', icon: '🏆' },
              { title: 'AI Motivation', desc: 'Personalized quotes based on data.', icon: '✨' },
            ].map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <span className="text-4xl mb-4 block">{f.icon}</span>
                <h4 className="text-xl font-bold mb-2">{f.title}</h4>
                <p className="text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
