
import React, { useState, useEffect, useCallback } from 'react';
import { Page, User, Workout, Meal, Habit, MoodLog, UserProfile } from './types';
import Landing from './components/Landing';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import WorkoutTracker from './components/WorkoutTracker';
import DietTracker from './components/DietTracker';
import MoodTracker from './components/MoodTracker';
import HabitTracker from './components/HabitTracker';
import Profile from './components/Profile';
import AICoach from './components/AICoach';

const App: React.FC = () => {
  // Directly start on the Dashboard
  const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);
  
  // Set a default guest user
  const [user, setUser] = useState<User | null>({
    id: 1,
    username: 'FitWarrior',
    email: 'guest@fitmitra.com',
    xp: 0
  });

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [moods, setMoods] = useState<MoodLog[]>([]);
  const [streak, setStreak] = useState<number>(0);

  const [backendUrl] = useState("http://localhost:5000");

  // Load initial data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/user/1/data`);
        if (res.ok) {
          const result = await res.json();
          if (result.status === 'success' && result.data) {
            const d = result.data;
            if (d.workouts) setWorkouts(d.workouts);
            if (d.meals) setMeals(d.meals);
            if (d.habits) setHabits(d.habits);
            if (d.moods) setMoods(d.moods);
            if (d.profile) setProfile(d.profile);
            if (d.streak) setStreak(d.streak);
            if (d.xp !== undefined && user) setUser({ ...user, xp: d.xp });
          }
        }
      } catch (e) {
        console.debug("Backend not available, using local state only.");
      }
    };
    loadData();
  }, [backendUrl]);

  const syncToBackend = useCallback(async (currentUserId: number, updates: any) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); 

      await fetch(`${backendUrl}/api/user/${currentUserId}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
    } catch (e) {
      // Silent fail - works in offline/local mode too
    }
  }, [backendUrl]);

  useEffect(() => {
    if (user) {
      syncToBackend(user.id, { 
        workouts, 
        meals, 
        habits, 
        moods, 
        profile,
        xp: user.xp,
        streak
      });
    }
  }, [workouts, meals, habits, moods, profile, user, streak, syncToBackend]);

  const addXP = (amount: number) => {
    if (user) {
      setUser({ ...user, xp: user.xp + amount });
    }
  };

  const deleteWorkout = (id: string) => {
    if (window.confirm('Delete this workout entry?')) {
      setWorkouts(workouts.filter(w => w.id !== id));
    }
  };

  const deleteMeal = (id: string) => {
    if (window.confirm('Delete this meal entry?')) {
      setMeals(meals.filter(m => m.id !== id));
    }
  };

  const deleteMood = (id: string) => {
    if (window.confirm('Delete this mood entry?')) {
      setMoods(moods.filter(m => m.id !== id));
    }
  };

  const deleteHabit = (id: string) => {
    if (window.confirm('Remove this habit from your tracker?')) {
      setHabits(habits.filter(h => h.id !== id));
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.Landing:
        return <Landing onGetStarted={() => setCurrentPage(Page.Dashboard)} />;
      case Page.Dashboard:
        return (
          <Dashboard 
            workouts={workouts} 
            meals={meals} 
            habits={habits} 
            moods={moods}
            profile={profile}
            streak={streak}
            onOpenCoach={() => setCurrentPage(Page.AICoach)}
          />
        );
      case Page.Workouts:
        return <WorkoutTracker workouts={workouts} onAdd={(w) => {
          setWorkouts([...workouts, w]);
          addXP(100);
          if (streak === 0) setStreak(1);
        }} onDelete={deleteWorkout} />;
      case Page.Diet:
        return <DietTracker meals={meals} onAdd={(m) => {
          setMeals([...meals, m]);
          addXP(30);
          if (streak === 0) setStreak(1);
        }} onDelete={deleteMeal} />;
      case Page.Mood:
        return <MoodTracker moods={moods} onLog={(m) => {
          setMoods([...moods, m]);
          addXP(20);
          if (streak === 0) setStreak(1);
        }} onDelete={deleteMood} />;
      case Page.Habits:
        return <HabitTracker 
          habits={habits} 
          onAdd={(h) => {
            setHabits([...habits, h]);
            addXP(10);
          }}
          onToggle={(id) => {
            setHabits(habits.map(h => {
              if (h.id === id) {
                if (!h.completed) {
                    addXP(50);
                    if (streak === 0) setStreak(1);
                }
                return { ...h, completed: !h.completed };
              }
              return h;
            }));
          }} 
          onDelete={deleteHabit} 
        />;
      case Page.AICoach:
        return <AICoach />;
      case Page.Profile:
        return <Profile 
          user={user} 
          workouts={workouts} 
          profile={profile} 
          onUpdateProfile={setProfile} 
        />;
      default:
        return <Dashboard 
          workouts={workouts} 
          meals={meals} 
          habits={habits} 
          moods={moods}
          profile={profile}
          streak={streak}
          onOpenCoach={() => setCurrentPage(Page.AICoach)}
        />;
    }
  };

  // No specific auth screens required
  return (
    <Layout 
      activePage={currentPage} 
      onNavigate={setCurrentPage} 
      user={user}
    >
      {renderPage()}
    </Layout>
  );
};

export default App;
