
-- FitMitra Database Schema

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workouts Table
CREATE TABLE workouts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    duration INTEGER NOT NULL, -- in minutes
    calories_burned INTEGER,
    date DATE DEFAULT CURRENT_DATE
);

-- Meals Table
CREATE TABLE meals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    meal_name VARCHAR(100) NOT NULL,
    calories INTEGER,
    protein INTEGER, -- in grams
    date DATE DEFAULT CURRENT_DATE
);

-- Habits Table
CREATE TABLE habits (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    habit_name VARCHAR(100) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    date DATE DEFAULT CURRENT_DATE
);

-- Moods Table
CREATE TABLE moods (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    mood_score INTEGER CHECK (mood_score BETWEEN 1 AND 5),
    note TEXT,
    date DATE DEFAULT CURRENT_DATE
);

-- Badges Table
CREATE TABLE badges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    badge_name VARCHAR(50) NOT NULL,
    description TEXT,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Streaks Table
CREATE TABLE streaks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE
);
