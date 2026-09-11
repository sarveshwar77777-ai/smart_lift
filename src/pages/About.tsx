import { Link } from 'react-router-dom';
import {
  Activity, Clock, Database, Shield, Cpu,
  Rocket, AlertTriangle, CheckCircle2, ArrowRight, Layers
} from 'lucide-react';

function SectionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-6 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
          <Icon className="w-5 h-5" />
        </div>
        <h2 className="font-bold text-gray-900 text-lg">{title}</h2>
      </div>
      <div className="text-sm text-gray-600 leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

const METHODOLOGY = [
  { step: '1', title: 'Problem', desc: 'Students wait blindly without knowing expected arrival.' },
  { step: '2', title: 'Observation', desc: 'Arrival at elevator lobby initiates in-situ manual timer.' },
  { step: '3', title: 'Data Collection', desc: 'Wait duration, crowd size, floor, and time period saved.' },
  { step: '4', title: 'Data Analysis', desc: 'Aggregation calculates real averages, peak hours, and trends.' },
  { step: '5', title: 'Model', desc: 'Distance-weighted statistical regression establishes baseline.' },
  { step: '6', title: 'Prediction', desc: 'Input conditions produce expected wait times.' },
  { step: '7', title: 'Validation', desc: 'Hostel student cohort evaluates accuracy and usability.' },
  { step: '8', title: 'Improvement', desc: 'Cross-validation (MAE/RMSE) steers model iteration.' },
];

export default function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Hero */}
      <div className="card p-8 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">SmartLift AI</h1>
            <p className="text-blue-200 text-sm">“Know the wait. Make the choice.”</p>
          </div>
        </div>
        <p className="text-blue-100 leading-relaxed max-w-2xl">
          An academic research prototype designed to resolve hostel elevator waiting uncertainty
          through empirical crowdsourced timing, statistical analytics, and explainable AI modeling.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold text-blue-100">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          College Academic Project · Real-World Field Validation
        </div>
      </div>

      {/* Problem Statement & Architecture */}
      <SectionCard icon={Clock} title="Problem Statement &amp; Root Cause">
        <p>
          <strong>Problem Statement:</strong> Students experience uncertainty while waiting for the hostel lift
          because they do not know the expected waiting time.
        </p>
        <p>
          <strong>Root Cause:</strong> Waiting-time information is completely unavailable to students before they make
          the critical decision of whether to wait in the lobby or take the stairs.
        </p>
        <div className="grid sm:grid-cols-2 gap-3 pt-2">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-xs font-bold text-gray-500 uppercase">Target Users</span>
            <div className="font-semibold text-gray-900 text-sm mt-0.5">Hostel students &amp; daily residents</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-xs font-bold text-gray-500 uppercase">Main Stakeholders</span>
            <div className="font-semibold text-gray-900 text-sm mt-0.5">Student community &amp; facility management</div>
          </div>
        </div>
      </SectionCard>

      {/* Solution Overview */}
      <SectionCard icon={Activity} title="The SmartLift Solution">
        <p>
          SmartLift AI records real waiting-time observations and analyzes them to provide useful, actionable
          information and experimental predictions.
        </p>
        <p>
          By crowdsourcing actual stop-watch timings from students arriving at the lobby, SmartLift builds an
          empirical dataset reflecting morning classes, lunch breaks, and evening surges without needing expensive
          IoT hardware or invasive camera installations.
        </p>
      </SectionCard>

      {/* Visual Project Methodology */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <Layers className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Project Research Methodology</h2>
        </div>

        <p className="text-xs text-gray-500">
          A continuous loop of empirical observation, statistical modeling, and real-world student validation:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {METHODOLOGY.map(m => (
            <div key={m.step} className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                {m.step}
              </div>
              <div className="text-xs font-bold text-gray-900 mt-1">{m.title}</div>
              <p className="text-[11px] text-gray-500 leading-snug">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Modeling & Explainability */}
      <SectionCard icon={Cpu} title="Explainable AI &amp; Evaluation Philosophy">
        <p>
          SmartLift AI avoids black-box deep learning pretenses. Because dataset size in academic settings starts modest,
          we use an <strong>explainable distance-weighted regression model</strong>.
        </p>
        <p>
          Model accuracy is measured mathematically through <strong>Leave-One-Out Cross-Validation (LOOCV)</strong>,
          computing <strong>Mean Absolute Error (MAE)</strong> and <strong>Root Mean Squared Error (RMSE)</strong>.
          If there are fewer than 5 records, the system displays an honest empty state rather than fabricating confidence scores.
        </p>
      </SectionCard>

      {/* Project Status */}
      <div className="card p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 space-y-4">
        <h2 className="font-bold text-gray-900 text-base">Project Status &amp; Credibility</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-white rounded-lg border border-blue-200">
            <span className="font-semibold text-gray-500">Current Stage:</span>
            <div className="font-bold text-gray-900 mt-0.5">Prototype + Real-World Validation</div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-blue-200">
            <span className="font-semibold text-gray-500">Data Status:</span>
            <div className="font-bold text-gray-900 mt-0.5">Real observations being collected</div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-blue-200">
            <span className="font-semibold text-gray-500">Prediction Status:</span>
            <div className="font-bold text-gray-900 mt-0.5">Experimental &amp; Evaluated</div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-blue-200">
            <span className="font-semibold text-gray-500">Validation Status:</span>
            <div className="font-bold text-gray-900 mt-0.5">In Progress (Field Survey)</div>
          </div>
        </div>
      </div>

      {/* Project Limitations */}
      <SectionCard icon={AlertTriangle} title="Academic Limitations">
        <ul className="space-y-1.5 list-disc list-inside text-gray-600">
          <li><strong>Prediction accuracy</strong> depends strictly on the volume and quality of collected real observations.</li>
          <li><strong>Initial observations</strong> may not represent all hostel conditions (such as exams or holidays).</li>
          <li><strong>Lift usage patterns</strong> can fluctuate dynamically during semester transitions.</li>
          <li><strong>All predictions</strong> are statistical approximations and should not be treated as absolute guarantees.</li>
        </ul>
      </SectionCard>

      {/* Privacy Guarantee */}
      <SectionCard icon={Shield} title="Privacy by Design">
        <p>
          SmartLift collects only the information required to analyze elevator waiting times.
          We do not collect personal phone numbers, physical room locations, or intrusive tracking data.
          All data is protected by Supabase Row-Level Security (RLS).
        </p>
      </SectionCard>

      {/* Call to action */}
      <div className="card p-8 text-center space-y-3">
        <h3 className="font-bold text-gray-900 text-xl">Contribute Real Observations</h3>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Every timing recorded at the hostel lobby enhances the prediction model and analytics for all students.
        </p>
        <div className="pt-2">
          <Link to="/timer" className="btn-primary px-8">
            Open Waiting Timer <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
