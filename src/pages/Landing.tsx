import { Link } from 'react-router-dom';
import {
  Activity, ArrowRight, Clock, BarChart3, Sparkles,
  Shield, CheckCircle2, ChevronRight, AlertTriangle, Layers,
  Database, Cpu, MessageSquare, Flame
} from 'lucide-react';

const FEATURES = [
  {
    icon: Clock,
    title: '⏱ Real Waiting-Time Tracking',
    desc: 'Empirically record elevator wait times with our high-precision live timer. No simulated metrics — purely student-collected ground truth.',
  },
  {
    icon: BarChart3,
    title: '📊 Data-Based Analytics',
    desc: 'Discover authentic waiting-time patterns across morning and evening peak hours, floors, and crowd levels with real-time charts.',
  },
  {
    icon: Sparkles,
    title: '🤖 Experimental AI Prediction',
    desc: 'Transparent, explainable statistical modeling that estimates wait durations once sufficient real observations are collected.',
  },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Start the timer', desc: 'Arrive at the hostel elevator lobby and start the live waiting timer.' },
  { step: '02', title: 'Wait for the lift', desc: 'Observe people waiting and normal lobby queue flow.' },
  { step: '03', title: 'Stop when lift arrives', desc: 'Tap "Lift Arrived" the moment elevator doors open.' },
  { step: '04', title: 'Save the observation', desc: 'Select crowd level, current floor, and time period, then save.' },
  { step: '05', title: 'Analyze waiting patterns', desc: 'Aggregated real observations reveal actual peak congestion times.' },
  { step: '06', title: 'Generate prediction', desc: 'Explainable statistical regression produces informed wait estimates.' },
];

const METHODOLOGY_STEPS = [
  { name: 'Problem', desc: 'Elevator wait uncertainty' },
  { name: 'Observation', desc: 'Lobby queue timing' },
  { name: 'Data Collection', desc: 'Empirical records' },
  { name: 'Data Analysis', desc: 'Pattern identification' },
  { name: 'Model', desc: 'Weighted regression' },
  { name: 'Prediction', desc: 'Experimental estimate' },
  { name: 'Validation', desc: 'Student feedback survey' },
  { name: 'Improvement', desc: 'Iterative refinement' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* ── Top Navigation ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900 leading-none block">SmartLift AI</span>
              <span className="text-[10px] text-blue-600 font-medium">Academic Research Project</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#methodology" className="hover:text-blue-600 transition-colors">Methodology</a>
            <a href="#status" className="hover:text-blue-600 transition-colors">Project Status</a>
            <a href="#limitations" className="hover:text-blue-600 transition-colors">Limitations</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors hidden sm:inline">
              Sign In
            </Link>
            <Link to="/signup" className="btn-primary text-sm">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-white pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-6 border border-blue-200">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            SMARTLIFT AI · “Know the wait. Make the choice.”
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
            Empirical Lift Waiting Analytics &amp;{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Responsible AI
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            A smart hostel elevator assistant that records waiting times, analyzes lift usage patterns,
            and helps students understand expected waiting conditions.
          </p>

          {/* Primary & Secondary Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="w-full sm:w-auto btn-primary px-8 py-3.5 text-base shadow-lg shadow-blue-600/20">
              <Clock className="w-5 h-5" /> Start Waiting Timer
            </Link>
            <Link to="/login" className="w-full sm:w-auto btn-secondary px-8 py-3.5 text-base">
              <BarChart3 className="w-5 h-5" /> View Analytics
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> 100% Real Observations</span>
            <span>·</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Zero Fabricated Statistics</span>
            <span>·</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Explainable ML Baseline</span>
          </div>
        </div>
      </section>

      {/* ── Real Problem Breakdown ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">The Problem</div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-5 leading-tight">
                Students experience uncertainty waiting for hostel lifts.
              </h2>
              <p className="text-base text-gray-600 leading-relaxed mb-4">
                <strong>Problem Statement:</strong> Students experience uncertainty while waiting for the hostel lift
                because they do not know the expected waiting time.
              </p>
              <p className="text-base text-gray-600 leading-relaxed mb-6">
                <strong>Root Cause:</strong> Waiting-time information is not available to students before they decide whether
                to wait or take the stairs during peak morning rush or evening hours.
              </p>
              <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2">
                <div className="text-xs font-bold text-gray-500 uppercase">Target Beneficiaries</div>
                <div className="text-sm font-semibold text-gray-800">Hostel residents, college students, and building facility managers</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="card p-6 bg-white border-red-100">
                <div className="text-xs font-bold text-red-600 uppercase mb-1">Uncertainty</div>
                <div className="text-2xl font-bold text-gray-900 mb-2">5–15 min</div>
                <p className="text-xs text-gray-500">Unpredictable wait during morning class rush.</p>
              </div>

              <div className="card p-6 bg-white border-amber-100">
                <div className="text-xs font-bold text-amber-600 uppercase mb-1">Peak Congestion</div>
                <div className="text-2xl font-bold text-gray-900 mb-2">08:00–09:30</div>
                <p className="text-xs text-gray-500">Highest lift contention period in hostels.</p>
              </div>

              <div className="card p-6 bg-white border-blue-100">
                <div className="text-xs font-bold text-blue-600 uppercase mb-1">Data Source</div>
                <div className="text-2xl font-bold text-gray-900 mb-2">In-Situ Timer</div>
                <p className="text-xs text-gray-500">Empirical manual records collected by students.</p>
              </div>

              <div className="card p-6 bg-white border-emerald-100">
                <div className="text-xs font-bold text-emerald-600 uppercase mb-1">Outcome</div>
                <div className="text-2xl font-bold text-gray-900 mb-2">Informed Choice</div>
                <p className="text-xs text-gray-500">Know whether to wait or take the stairs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature Cards ── */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Core Capabilities</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Truthful, Data-Centric Architecture</h2>
            <p className="text-gray-500 text-sm mt-2 max-w-xl mx-auto">
              SmartLift AI prioritizes scientific honesty, academic rigor, and zero fabricated data.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map(f => (
              <div key={f.title} className="card p-8 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-5 text-blue-600">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works (6 Steps) ── */}
      <section id="how-it-works" className="py-20 bg-gray-50 border-y border-gray-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Operational Flow</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">How SmartLift AI Works</h2>
            <p className="text-gray-500 text-sm mt-2 max-w-xl mx-auto">
              Six deliberate steps connecting real student actions to statistical intelligence.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map(item => (
              <div key={item.step} className="card p-6 bg-white relative">
                <div className="text-4xl font-black text-blue-100 mb-3 font-mono">{item.step}</div>
                <h3 className="text-base font-bold text-gray-900 mb-1.5">{item.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Project Methodology Flowchart ── */}
      <section id="methodology" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Research Pipeline</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Project Methodology</h2>
            <p className="text-gray-500 text-sm mt-2 max-w-xl mx-auto">
              From field observation to explainable machine learning and peer validation.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {METHODOLOGY_STEPS.map((m, idx) => (
              <div key={m.name} className="flex flex-col items-center text-center p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center mb-2">
                  {idx + 1}
                </div>
                <div className="text-xs font-bold text-gray-900 uppercase tracking-tight mb-1">{m.name}</div>
                <div className="text-[11px] text-gray-500 leading-snug">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Project Status & Credibility ── */}
      <section id="status" className="py-16 bg-blue-900 text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center">
            <div className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-2">Transparency &amp; Status</div>
            <h2 className="text-3xl font-bold">Academic Project Credibility</h2>
            <p className="text-blue-200 text-sm mt-2 max-w-xl mx-auto">
              We do not claim commercial or sensor-integrated elevator hardware. All systems are truthful prototypes.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white/10 rounded-xl border border-white/10">
              <div className="text-xs font-bold text-blue-300 uppercase">Current Stage</div>
              <div className="text-lg font-bold mt-1">Prototype + Field Validation</div>
              <div className="text-xs text-blue-200 mt-1">Testing with student cohort</div>
            </div>

            <div className="p-4 bg-white/10 rounded-xl border border-white/10">
              <div className="text-xs font-bold text-blue-300 uppercase">Data Status</div>
              <div className="text-lg font-bold mt-1">Real Observations</div>
              <div className="text-xs text-blue-200 mt-1">Zero synthetic injection</div>
            </div>

            <div className="p-4 bg-white/10 rounded-xl border border-white/10">
              <div className="text-xs font-bold text-blue-300 uppercase">Prediction Status</div>
              <div className="text-lg font-bold mt-1">Experimental Baseline</div>
              <div className="text-xs text-blue-200 mt-1">Weighted statistical regression</div>
            </div>

            <div className="p-4 bg-white/10 rounded-xl border border-white/10">
              <div className="text-xs font-bold text-blue-300 uppercase">Validation Status</div>
              <div className="text-lg font-bold mt-1">In Progress</div>
              <div className="text-xs text-blue-200 mt-1">Feedback survey active</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Limitations Section (Section 25) ── */}
      <section id="limitations" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Current Academic Limitations</h2>
              <p className="text-xs text-gray-500">Responsible reporting of technical boundaries</p>
            </div>
          </div>

          <div className="card p-6 bg-white space-y-3 text-sm text-gray-700">
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Sample Size Dependency:</strong> Prediction quality and confidence directly correlate with the volume and density of collected observations.</li>
              <li><strong>Environmental Variance:</strong> Initial observations may not reflect all hostel situations (e.g., examination weeks, hostel events, holidays).</li>
              <li><strong>Temporal Dynamics:</strong> Elevator usage fluctuates dynamically across different semesters and floor occupancies.</li>
              <li><strong>Experimental Model:</strong> The prediction algorithm is a statistical approximation and must be evaluated with MAE and RMSE before being considered conclusive.</li>
              <li><strong>Hardware Independence:</strong> The system relies purely on voluntary student timing and does not interface with elevator motors or optical lobby sensors.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Privacy & Footer ── */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">SmartLift AI</span>
            <span>·</span>
            <span>“Know the wait. Make the choice.”</span>
          </div>

          <div className="text-center sm:text-right max-w-md text-gray-400">
            <Shield className="w-3.5 h-3.5 inline mr-1 text-blue-600" />
            <strong>Privacy Guarantee:</strong> SmartLift collects only the information required to analyze elevator waiting times.
            No phone numbers, physical room IDs, or personal tracking data are stored.
          </div>
        </div>
      </footer>
    </div>
  );
}
