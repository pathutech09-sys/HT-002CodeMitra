export enum Page {
  Landing = "landing",
  Login = "login",
  Dashboard = "dashboard",
  Workouts = "workouts",
  Diet = "diet",
  Mood = "mood",
  Habits = "habits",
  Profile = "profile",
}

export interface User {
  id: string;
  name: string;
  email: string;
  xp: number;
}

export interface Workout {
  id: string;
  name: string;
  calories: number;
}

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
}

export interface Habit {
  id: string;
  name: string;
  completed: boolean;
}

export interface MoodLog {
  id: string;
  score: number;
}

export interface UserProfile {
  name: string;
  weight: number;
  goal: "fat_loss" | "muscle_gain" | "maintenance";
}
