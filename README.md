# SmartLift AI

"Know the wait. Make the choice."

## Overview

SmartLift AI is a software-based system that helps college students avoid waiting blindly at the hostel lift. It collects real lift waiting-time observations manually from students and uses those observations for analytics and prediction estimation.

This project focuses on problem validation using real data collection, without requiring hardware integrations.

## Features
- User Authentication (Supabase)
- Manual Wait Time Timer
- Real-time Analytics Dashboard
- Data-driven Prediction Estimates
- Mobile-first Responsive UI
- Dark/Light Mode
- Validated Feedback System

## Tech Stack
- Frontend: React (Vite), TypeScript, Tailwind CSS, Lucide Icons, Recharts
- Backend: Supabase (Auth, PostgreSQL DB, RLS)

## Setup Instructions

### 1. Installation
```bash
npm install
```

### 2. Supabase Setup
- Create a new Supabase project at [supabase.com](https://supabase.com).
- Go to the SQL Editor and run the queries found in `supabase/schema.sql`.
- Note down your Project URL and anon key from the API Settings.

### 3. Environment Variables
- Copy `.env.example` to `.env`.
- Fill in your Supabase credentials:
  ```env
  VITE_SUPABASE_URL=your-project-url
  VITE_SUPABASE_ANON_KEY=your-anon-key
  ```

### 4. Running Locally
```bash
npm run dev
```

### 5. Building & Deploying
```bash
npm run build
```
Deploy the `dist` folder to your preferred hosting platform (Vercel, Netlify, etc.). Add the environment variables to your hosting dashboard.

## Manual Data Collection Process

This prototype heavily relies on students to manually track waiting times:
1. User logs into the app.
2. User stands by the lift, enters current conditions (floor, lift, crowd).
3. User clicks "Start Waiting".
4. When the lift arrives, the user clicks "Lift Arrived" to record the exact duration in seconds.

The prediction feature calculates an estimate based ONLY on these real recorded data points. It does not hallucinate fake predictions.
