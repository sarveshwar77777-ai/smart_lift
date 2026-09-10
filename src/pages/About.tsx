import { Link } from 'react-router-dom';
import { Activity, Clock, Database, Shield, Cpu, Rocket, AlertTriangle } from 'lucide-react';

function Section({ icon: Icon, title, children }: {
  icon: React.ElementType; title: string; children: React.ReactNode;
}) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="font-semibold text-gray-900 text-lg">{title}</h2>
      </div>
      <div className="text-sm text-gray-600 leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

export default function About() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Hero */}
      <div className="card p-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">SmartLift AI</h1>
            <p className="text-blue-200 text-sm">Predict Your Lift Wait. Plan Your Time.</p>
          </div>
        </div>
        <p className="text-blue-100 leading-relaxed">
          A student innovation prototype that helps hostel residents understand and anticipate
          elevator waiting times — so they can plan their mornings better.
        </p>
        <div className="mt-4 inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
          ⚠ Student Prototype · NOT deployed in any real hostel
        </div>
      </div>

      {/* Prototype notice */}
      <div className="card p-5 bg-amber-50 border-amber-200">
        <div className="flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <strong>Important disclaimer:</strong> SmartLift AI is a college project / software
            prototype. It is not connected to any real elevator hardware, sensors, or live building
            systems. All data is self-reported by students using the manual timer feature.
          </div>
        </div>
      </div>

      <Section icon={Clock} title="The Problem">
        <p>
          Students in hostels often don't know whether to wait for the elevator or take the stairs.
          During peak hours — morning rush, lunch, late evening — the wait can be unexpectedly long.
        </p>
        <p>
          There is no existing system that tells you "right now, how long is the wait?" without
          hardware, cameras, or access to the building management system.
        </p>
      </Section>

      <Section icon={Activity} title="The Solution">
        <p>
          SmartLift AI crowdsources wait-time data. Students use the in-app timer to measure their
          own waiting time each time they use the lift. Over time, this builds a dataset of real
          observations that can reveal patterns — busy floors, peak hours, crowd conditions.
        </p>
        <p>
          A simple data-based predictor can then estimate how long you might wait given the current
          crowd level, lift, and floor — without requiring any hardware.
        </p>
      </Section>

      <Section icon={Database} title="How Data Collection Works">
        <p>
          1. You press <strong>Start Waiting</strong> when you arrive at the lift lobby.
        </p>
        <p>
          2. You press <strong>Stop &amp; Record</strong> when the lift doors open for you.
        </p>
        <p>
          3. You fill in context: crowd level, lift number, floor.
        </p>
        <p>
          4. The record is saved to a private database (Supabase). You can view, filter, and delete
          your own records at any time.
        </p>
        <p>
          Anonymised aggregate data (all records, not just yours) is used in the Analytics and
          Prediction pages to generate statistics.
        </p>
      </Section>

      <Section icon={Cpu} title="The AI / Prediction Engine">
        <p>
          The current prediction feature is <strong>not a neural network or trained ML model</strong>.
          It is a statistical baseline: it filters historical records by crowd level, lift, and
          floor, then returns the average wait time of matching records.
        </p>
        <p>
          This is intentional and honest. The system needs at least 10+ observations before
          predictions are enabled. As the dataset grows, a proper regression or ML model can be
          trained in the future.
        </p>
      </Section>

      <Section icon={Shield} title="Privacy &amp; Data">
        <p>
          All data is stored securely via Supabase with Row-Level Security (RLS) policies.
          You can only see and delete your own records. The aggregate (anonymised) statistics
          used in Analytics do not expose individual identities.
        </p>
        <p>
          No hardware sensors, cameras, or building systems are used. All data comes from
          voluntary manual timer entries.
        </p>
      </Section>

      <Section icon={Rocket} title="Future Scope">
        <ul className="space-y-1 list-disc list-inside text-gray-600">
          <li>Train a real ML regression model when sufficient data is collected</li>
          <li>Time-based predictions (predict wait by hour of day)</li>
          <li>Push notifications: "It's a good time to take the lift"</li>
          <li>Floor-level heatmaps of congestion</li>
          <li>Optional: IoT sensor integration if hardware access is available</li>
        </ul>
      </Section>

      {/* CTA */}
      <div className="card p-8 text-center">
        <h2 className="font-bold text-gray-900 text-xl mb-2">Start Contributing</h2>
        <p className="text-gray-500 text-sm mb-6">
          Every observation you record makes predictions better for everyone.
        </p>
        <Link to="/timer" className="btn-primary px-8">Open Wait Timer</Link>
      </div>
    </div>
  );
}
