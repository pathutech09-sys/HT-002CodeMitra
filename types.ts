
export interface User {
  id: number;
  username: string;
  email: string;
  xp: number;
}

export interface UserProfile {
  height: number; // in cm
  weight: number; // in kg
  goal: 'muscle_gain' | 'fat_loss' | 'maintain';
  dietPreference: 'veg' | 'non-veg' | 'vegan';
  avatar?: string; // selected emoji
}

export interface Workout {
  id: string;
  type: string;
  duration: number;
  calories: number;
  date: string;
}

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  date: string;
}

export interface Habit {
  id: string;
  name: string;
  completed: boolean;
}

export interface MoodLog {
  id: string;
  score: number;
  note: string;
  date: string;
}

export enum Page {
  Landing = 'landing',
  Dashboard = 'dashboard',
  Workouts = 'workouts',
  Diet = 'diet',
  Mood = 'mood',
  Habits = 'habits',
  Profile = 'profile',
  AICoach = 'ai_coach'
}
