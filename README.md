# SmartLift AI
> **“Know the wait. Make the choice.”**

SmartLift AI is an academic research prototype and web-based hostel elevator waiting-time assistant. It enables students to record empirical waiting times, analyzes elevator usage patterns, and provides explainable, data-driven wait estimates to reduce uncertainty before choosing whether to wait or take the stairs.

---

## 1. Problem Statement & Root Cause

* **The Problem:** Students in university hostels regularly face severe uncertainty at elevator lobbies during peak morning and evening rush hours. Without knowing expected arrival times, students often wait unnecessarily or arrive late to classes.
* **The Root Cause:** Elevator waiting-time information is not accessible to students before they make the decision to wait or take the stairs.
* **The Solution:** SmartLift AI provides a crowdsourced, sensorless data collection and analytical platform. Students record actual stop-watch timings in-situ, which feeds an explainable statistical estimation engine.

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     HOSTEL STUDENTS                     │
│        (Mobile / Desktop Responsive Web Interface)      │
└───────────────┬─────────────────────────▲───────────────┘
                │                         │
     1. Live Timing & Context             │ 4. Predictions & Analytics
                │                         │
                ▼                         │
┌───────────────────────────────┐         │
│      DATA COLLECTION & UI     │         │
│   • In-Situ Waiting Timer     │         │
│   • Feedback Survey System    │         │
│   • Observation History Table │         │
└───────────────┬───────────────┘         │
                │                         │
     2. Authenticated RLS                 │
                │                         │
                ▼                         │
┌─────────────────────────────────────────────────────────┐
│                     SUPABASE BACKEND                    │
│   • PostgreSQL with Row-Level Security (RLS)            │
│   • Tables: profiles, waiting_records, feedback         │
└───────────────┬─────────────────────────────────────────┘
                │
     3. Aggregation & Query
                │
                ▼
┌─────────────────────────────────────────────────────────┐
│              ANALYTICS & EXPLAINABLE AI ENGINE          │
│   • Real-Time Trend & Congestion Distribution Charts    │
│   • Distance-Weighted Statistical Regression Model      │
│   • Model Evaluation via LOOCV (MAE & RMSE Metrics)     │
│   • Live Validation Dashboard with Usability Scores     │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

* **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons
* **Data Visualization:** Recharts (Responsive Line, Bar, and Scatter Charts)
* **Backend & Database:** Supabase (PostgreSQL, Auth, Row-Level Security)
* **Hosting:** Vercel / Netlify / Static Web Hosting

---

## 4. Key Features

1. **⏱ High-Precision Waiting Timer:** Live start/stop stopwatch measuring actual seconds waited in the hostel lobby with crowd and floor context.
2. **📊 Real-Data Analytics Dashboard:** 4 automatic charts (Time Series, Time Period Averages, Day of Week Distribution, and Queue Size Correlation) strictly computed from genuine observations.
3. **🤖 Explainable Statistical Prediction:** Distance-weighted regression based on crowd density, time period, and floor. Enforces a strict minimum sample size threshold (N ≥ 5) before providing estimates.
4. **📐 Objective Model Evaluation:** Calculates **Mean Absolute Error (MAE)** and **Root Mean Squared Error (RMSE)** via Leave-One-Out Cross-Validation (LOOCV) on historical records.
5. **🛡 Peer Project Validation Dashboard:** Real student usability ratings, adoption likelihood, and qualitative feedback summaries.
6. **🔒 Privacy by Design:** Requires only minimal operational details (no phone numbers, room IDs, or intrusive tracking).

---

## 5. Scientific & Mathematical Methodology

### Prediction Model (Distance-Weighted Historical Regression)
Given a query condition $x = (\text{crowd}, \text{period}, \text{floor}, \text{day})$, the predicted wait $\hat{y}$ is:
$$\hat{y} = \frac{\sum_{i=1}^N w_i \cdot y_i}{\sum_{i=1}^N w_i}$$

Where weights $w_i$ reflect feature matching similarity:
* Crowd Level Match: $w_{\text{crowd}} = 3.0$
* Time Period Match: $w_{\text{period}} = 2.0$
* Floor Level Match: $w_{\text{floor}} = 1.5$
* Day of Week Match: $w_{\text{day}} = 1.0$

### Model Evaluation (Leave-One-Out Cross Validation)
For a dataset of $N$ observations, each record $i$ is evaluated against a model trained on all remaining $N-1$ records:
$$\text{MAE} = \frac{1}{N} \sum_{i=1}^N |y_i - \hat{y}_{-i}|$$
$$\text{RMSE} = \sqrt{\frac{1}{N} \sum_{i=1}^N (y_i - \hat{y}_{-i})^2}$$

---

## 6. Zero Fake Data Policy

SmartLift AI adheres strictly to academic honesty:
* **No synthetic stats or hallucinated averages:** Empty states are displayed until real student data is submitted.
* **No deep learning pretenses:** Transparent about using statistical baseline methods suited to modest initial sample sizes.
* **Separation of demo data:** Any test data must be explicitly isolated from genuine research findings.

---

## 7. Current Project Status & Academic Limitations

### Facts
* The application is an active college software prototype undergoing real-world validation.
* All metrics and predictions depend exclusively on user-submitted manual timer observations.

### Current Limitations
1. **Sample Size Sensitivity:** Prediction confidence is low during initial data collection and improves as the observation count grows.
2. **Dynamic Schedule Variations:** Exam periods, weekends, and holidays introduce non-stationary waiting distributions.
3. **Sensorless Constraint:** Operates without IoT elevator shaft hardware or optical lobby sensors.

### Future Work
* Autonomous floor-level congestion heatmaps.
* Push alerts for optimal departure times based on historical peak curves.
* Expansion to multi-hostel comparative elevator analysis.

---

## 8. Local Setup & Installation

### Prerequisites
* Node.js (v18 or higher)
* npm or yarn

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd Smart_lift
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Database Setup (Supabase)
Run the SQL queries in `supabase/schema.sql` inside your Supabase project's SQL Editor to create tables, indexes, and Row-Level Security policies.

### 4. Start Development Server
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
```

---

## 9. License & Academic Attribution
Created for college project evaluation and academic research on crowdsourced campus mobility.
Distributed under the MIT License.
