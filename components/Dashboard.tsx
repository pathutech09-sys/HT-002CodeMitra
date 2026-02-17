import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Workout, Meal, Habit, MoodLog, UserProfile } from "../types";

interface DashboardProps {
  workouts: Workout[];
  meals: Meal[];
  habits: Habit[];
  moods: MoodLog[];
  profile: UserProfile | null;
}

const Dashboard: React.FC<DashboardProps> = ({
  workouts,
  meals,
  habits,
  moods,
  profile,
}) => {
  const [quote] = useState(
    "Push harder than yesterday if you want a different tomorrow."
  );

  const stats = useMemo(() => {
    const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
    const totalProtein = meals.reduce((sum, m) => sum + m.protein, 0);
    const completedHabits = habits.filter((h) => h.completed).length;
    const avgMood =
      moods.length > 0
        ? moods.reduce((sum, m) => sum + m.score, 0) / moods.length
        : 0;

    const calorieGoal = profile
      ? profile.goal === "fat_loss"
        ? 1800
        : profile.goal === "muscle_gain"
        ? 2800
        : 2200
      : 2000;

    const proteinGoal = profile ? profile.weight * 1.5 : 100;

    return {
      totalCalories,
      totalProtein,
      calorieGoal,
      proteinGoal,
      completedHabits,
      avgMood,
    };
  }, [meals, habits, moods, profile]);

  const chartData = [
    { name: "Mon", cal: 400 },
    { name: "Tue", cal: 300 },
    { name: "Wed", cal: 500 },
    { name: "Thu", cal: 280 },
    { name: "Fri", cal: 180 },
    { name: "Today", cal: stats.totalCalories },
  ];

  const ProgressBar = ({
    label,
    current,
    goal,
    unit,
    color,
  }: any) => {
    const percentage = Math.min(
      Math.round((current / goal) * 100),
      100
    );

    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-700">{label}</span>
          <span className="text-gray-500">
            {current}
            {unit} / {goal}
            {unit}
          </span>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full ${color}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <header>
        <h2 className="text-2xl font-bold text-gray-900">
          Health Dashboard
        </h2>
        <p className="text-gray-500 italic">"{quote}"</p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-6">
            Weekly Calorie Trend
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cal" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-6">
            Activity Points
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="cal"
                  stroke="#a855f7"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-6">
        <h3 className="text-lg font-bold">Daily Goals</h3>

        <ProgressBar
          label="Calories"
          current={stats.totalCalories}
          goal={stats.calorieGoal}
          unit="kcal"
          color="bg-orange-500"
        />

        <ProgressBar
          label="Protein"
          current={stats.totalProtein}
          goal={stats.proteinGoal}
          unit="g"
          color="bg-blue-500"
        />
      </div>
    </div>
  );
};

export default Dashboard;
