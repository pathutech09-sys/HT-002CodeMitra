
import React, { useState, useEffect } from 'react';
import { Page, User, Workout, Meal, Habit, MoodLog, UserProfile } from './types';
import Landing from './components/Landing';
import Auth from './components/auth123';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import WorkoutTracker from './components/WorkoutTracker';
import DietTracker from './components/DietTracker';
import MoodTracker from './components/MoodTracker';
import HabitTracker from './components/HabitTracker';
import Profile from './components/Profile';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Landing);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', name: 'Drink 3L Water', completed: false },
    { id: '2', name: '8 Hours Sleep', completed: true },
    { id: '3', name: 'Meditate 10 mins', completed: false },
  ]);
  const [moods, setMoods] = useState<MoodLog[]>([]);

  const addXP = (amount: number) => {
    if (user) {
      setUser({ ...user, xp: user.xp + amount });
    }
  };

  const handleLogin = (u: User) => {
    setUser({ ...u, xp: u.xp || 120 }); // Initial XP for demo
    setCurrentPage(Page.Dashboard);
  };

  const logout = () => {
    setUser(null);
    setCurrentPage(Page.Landing);
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.Landing:
        return <Landing onGetStarted={() => setCurrentPage(Page.Login)} />;
      case Page.Login:
        return <Auth onAuthSuccess={handleLogin} />;
      case Page.Dashboard:
        return (
          <Dashboard 
            workouts={workouts} 
            meals={meals} 
            habits={habits} 
            moods={moods}
            profile={profile}
          />
        );
      case Page.Workouts:
        return <WorkoutTracker workouts={workouts} onAdd={(w) => {
          setWorkouts([...workouts, w]);
          addXP(100);
        }} />;
      case Page.Diet:
        return <DietTracker meals={meals} onAdd={(m) => {
          setMeals([...meals, m]);
          addXP(30);
        }} />;
      case Page.Mood:
        return <MoodTracker moods={moods} onLog={(m) => {
          setMoods([...moods, m]);
          addXP(20);
        }} />;
      case Page.Habits:
        return <HabitTracker habits={habits} onToggle={(id) => {
          setHabits(habits.map(h => {
            if (h.id === id) {
              if (!h.completed) addXP(50);
              return { ...h, completed: !h.completed };
            }
            return h;
          }));
        }} />;
      case Page.Profile:
        return <Profile 
          user={user} 
          workouts={workouts} 
          profile={profile} 
          onUpdateProfile={setProfile} 
        />;
      default:
        return <Landing onGetStarted={() => setCurrentPage(Page.Login)} />;
    }
  };

  if (currentPage === Page.Landing || currentPage === Page.Login) {
    return renderPage();
  }

  return (
    <Layout 
      activePage={currentPage} 
      onNavigate={setCurrentPage} 
      onLogout={logout}
      user={user}
    >
      {renderPage()}
    </Layout>
  );
};

export default App;
