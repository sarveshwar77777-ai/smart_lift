import { Link } from 'react-router-dom';
import { Activity, ArrowRight, Clock, BarChart3, Sparkles, Shield, ChevronDown } from 'lucide-react';

const FEATURES = [
  { icon: Clock,    title: 'Real Timer',       desc: 'Measure actual wait times with a built-in precision timer. No guessing — just real data.' },
  { icon: BarChart3, title: 'Visual Analytics', desc: 'See waiting-time trends by hour, day and crowd level with clean interactive charts.' },
  { icon: Sparkles, title: 'Prototype Prediction', desc: 'A data-driven estimation engine that grows smarter as more students contribute records.' },
  { icon: Shield,   title: 'Private by Design', desc: 'Your records belong to you. Supabase Row Level Security ensures no one else can read your data.' },
];

const STEPS = [
  { n: '01', title: 'Open the timer',      desc: 'Tap "Start Waiting" when you arrive at the lift lobby.' },
  { n: '02', title: 'Wait naturally',      desc: 'Do what you normally do — the timer runs in the background.' },
  { n: '03', title: 'Stop & record',       desc: 'Tap "Stop & Record" when the lift doors open. Add context like crowd level and floor.' },
  { n: '04', title: 'Contribute insights', desc: 'Your record feeds the analytics dashboard and the prediction engine.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">SmartLift AI</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#problem"  className="hover:text-gray-900 transition-colors">The Problem</a>
            <a href="#how"      className="hover:text-gray-900 transition-colors">How It Works</a>
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#about"    className="hover:text-gray-900 transition-colors">About</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login"  className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors hidden sm:inline">
              Sign in
            </Link>
            <Link to="/signup" className="btn-primary text-sm">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white pt-24 pb-32 px-4 sm:px-6 lg:px-8">
        {/* Background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wide mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            Student Innovation Project · Prototype
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-none mb-6">
            Predict Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
              Lift Wait.
            </span>
            <br />Plan Your Time.
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            A smart hostel elevator assistant that helps students understand elevator waiting patterns
            and make better decisions about when to wait — built on real crowdsourced data.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="w-full sm:w-auto btn-primary px-8 py-3 text-base">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="w-full sm:w-auto btn-secondary px-8 py-3 text-base">
              Explore Demo
            </Link>
          </div>

          <p className="mt-6 text-sm text-gray-400">
            No credit card required · 100% free for students
          </p>
        </div>

        <div className="flex justify-center mt-16">
          <a href="#problem" className="flex flex-col items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors">
            <span>Learn more</span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </a>
        </div>
      </section>

      {/* ── The Problem ── */}
      <section id="problem" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-4">The Problem</div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Standing at the lift lobby — blindly.
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Every morning, hundreds of hostel students crowd in front of lifts during peak hours.
                Nobody knows how long the wait will be. Should you wait? Take the stairs? Come back later?
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                SmartLift AI fixes this by turning real student wait-time observations into
                actionable insights — no hardware, no sensors, no guessing.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Unknown wait',    value: '~5–15 min', color: 'bg-red-50 border-red-100 text-red-700' },
                { label: 'Peak crowd',      value: '7–9 AM',    color: 'bg-orange-50 border-orange-100 text-orange-700' },
                { label: 'Student decision', value: 'No data',  color: 'bg-gray-50 border-gray-200 text-gray-600' },
                { label: 'SmartLift fix',   value: 'Real data', color: 'bg-blue-50 border-blue-100 text-blue-700' },
              ].map(c => (
                <div key={c.label} className={`rounded-xl border p-6 ${c.color}`}>
                  <div className="text-2xl font-bold mb-1">{c.value}</div>
                  <div className="text-sm font-medium">{c.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how" className="py-24 bg-gray-50 border-y border-gray-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">How It Works</div>
            <h2 className="text-4xl font-bold text-gray-900">Four simple steps</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map(s => (
              <div key={s.n} className="relative">
                <div className="text-5xl font-black text-blue-100 mb-4">{s.n}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Features</div>
            <h2 className="text-4xl font-bold text-gray-900">Everything you need</h2>
            <p className="text-lg text-gray-500 mt-3 max-w-xl mx-auto">
              A complete data collection and prediction platform — no hardware required.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="card p-6 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-blue-600 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to help solve the problem?</h2>
          <p className="text-blue-100 text-lg mb-10">
            Join fellow students in building a smarter hostel elevator experience — one real observation at a time.
          </p>
          <Link to="/signup" className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors shadow-lg text-base">
            Create Free Account <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer id="about" className="py-10 border-t border-gray-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-700">SmartLift AI</span>
            <span>·</span>
            <span>Student Innovation Project — Prototype</span>
          </div>
          <p>Not connected to real elevator hardware. All predictions are statistical estimates.</p>
        </div>
      </footer>
    </div>
  );
}
