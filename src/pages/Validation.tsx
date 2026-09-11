import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { FeedbackRecord } from '../types';
import {
  CheckCircle2, Star, Users, ThumbsUp, MessageSquare,
  AlertCircle, ArrowRight, ShieldCheck, HelpCircle, Activity
} from 'lucide-react';

export default function Validation() {
  const [feedbacks, setFeedbacks] = useState<FeedbackRecord[]>([]);
  const [totalObservations, setTotalObservations] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchValidationData();
  }, []);

  const fetchValidationData = async () => {
    try {
      const [fbRes, obsRes] = await Promise.all([
        supabase.from('feedback').select('*').order('created_at', { ascending: false }),
        supabase.from('waiting_records').select('id', { count: 'exact', head: true }),
      ]);

      if (fbRes.data) {
        setFeedbacks(fbRes.data as FeedbackRecord[]);
      }
      if (obsRes.count !== null && obsRes.count !== undefined) {
        setTotalObservations(obsRes.count);
      }
    } catch (err) {
      console.error('Error fetching validation data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-gray-400 text-sm animate-fade-in">
        Loading project validation metrics…
      </div>
    );
  }

  const hasFeedback = feedbacks.length > 0;

  // Real calculations
  const totalStudentsTested = feedbacks.length;
  const avgRating = hasFeedback
    ? (feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbacks.length).toFixed(1)
    : '0.0';

  const wouldUseYesCount = feedbacks.filter(
    f => f.would_use_hostel === 'Yes' || f.useful === 'Yes'
  ).length;
  const wouldUsePercent = hasFeedback ? Math.round((wouldUseYesCount / feedbacks.length) * 100) : 0;

  const timerUsefulCount = feedbacks.filter(
    f => f.timer_useful === 'Yes' || f.useful === 'Yes'
  ).length;
  const timerUsefulPercent = hasFeedback ? Math.round((timerUsefulCount / feedbacks.length) * 100) : 0;

  const predictionUnderstandableCount = feedbacks.filter(
    f => f.prediction_understandable === 'Yes' || f.decision_help === 'Yes'
  ).length;
  const predictionUnderstandablePercent = hasFeedback
    ? Math.round((predictionUnderstandableCount / feedbacks.length) * 100)
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <Activity className="w-3.5 h-3.5" />
            Empirical Evaluation
          </div>
          <h1 className="page-title">Project Validation</h1>
          <p className="page-subtitle">
            Evaluating SmartLift AI with real hostel students and genuine usage metrics.
          </p>
        </div>
        <Link to="/feedback" className="btn-primary self-start">
          <MessageSquare className="w-4 h-4" /> Give Feedback
        </Link>
      </div>

      {/* Validation Status Banner */}
      <div className="card p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-white border-blue-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-bold text-gray-900 mb-1">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              Validation Status: Active Pilot &amp; Field Survey
            </div>
            <p className="text-sm text-gray-600">
              We validate the utility, timer usability, and prediction explainability with real hostel students.
              All statistics below reflect authentic submitted user feedback.
            </p>
          </div>
          <div className="flex-shrink-0 px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-xs font-semibold text-blue-700 shadow-sm">
            {hasFeedback ? `${totalStudentsTested} Validated Responses` : 'Awaiting Responses'}
          </div>
        </div>
      </div>

      {/* Empty State vs Real Metrics */}
      {!hasFeedback ? (
        <div className="card p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
            <HelpCircle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Validation has not started yet</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto mt-1">
              No student feedback has been submitted yet. Real student feedback and usability metrics
              will appear here as tests are conducted in the hostel.
            </p>
          </div>
          <div className="pt-2">
            <Link to="/feedback" className="btn-primary text-sm">
              Be the First to Validate
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Key Validation Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Students Tested</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{totalStudentsTested}</div>
              <div className="text-xs text-gray-400 mt-1">Total feedback submissions</div>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Avg Usability</span>
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{avgRating} <span className="text-sm font-normal text-gray-400">/ 5.0</span></div>
              <div className="text-xs text-gray-400 mt-1">Overall experience rating</div>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Would Use In Hostel</span>
                <ThumbsUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-emerald-700">{wouldUsePercent}%</div>
              <div className="text-xs text-gray-400 mt-1">{wouldUseYesCount} of {feedbacks.length} affirmative</div>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Observations Logged</span>
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{totalObservations}</div>
              <div className="text-xs text-gray-400 mt-1">Real waiting records</div>
            </div>
          </div>

          {/* Validation Survey Breakdown */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-6 space-y-4">
              <h3 className="font-semibold text-gray-900">Survey Key Questions</h3>

              <div className="space-y-4 text-sm">
                <div>
                  <div className="flex justify-between font-medium mb-1">
                    <span className="text-gray-700">Timer was intuitive and useful</span>
                    <span className="text-blue-600 font-bold">{timerUsefulPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${timerUsefulPercent}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-medium mb-1">
                    <span className="text-gray-700">Prediction concept was clear &amp; explainable</span>
                    <span className="text-indigo-600 font-bold">{predictionUnderstandablePercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${predictionUnderstandablePercent}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-medium mb-1">
                    <span className="text-gray-700">Would adopt SmartLift for daily hostel routine</span>
                    <span className="text-emerald-600 font-bold">{wouldUsePercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${wouldUsePercent}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-6 space-y-4">
              <h3 className="font-semibold text-gray-900">Star Rating Distribution</h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map(stars => {
                  const count = feedbacks.filter(f => f.rating === stars).length;
                  const pct = hasFeedback ? Math.round((count / feedbacks.length) * 100) : 0;
                  return (
                    <div key={stars} className="flex items-center gap-2 text-xs">
                      <span className="w-12 text-gray-600 flex items-center gap-1">
                        {stars} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      </span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-8 text-right text-gray-400 font-mono">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Qualitative Student Feedback Feed */}
          <div className="card p-6 space-y-4">
            <h3 className="font-semibold text-gray-900">Real Student Feedback &amp; Suggestions</h3>
            <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
              {feedbacks
                .filter(f => f.improvement_suggestions || f.suggestion || f.confusing_aspects || f.problem || f.most_useful_feature)
                .slice(0, 10)
                .map((f, idx) => (
                  <div key={f.id || idx} className="py-3 text-sm space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(f.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(f.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      {f.most_useful_feature && (
                        <span className="ml-auto px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-medium">
                          Favorite: {f.most_useful_feature}
                        </span>
                      )}
                    </div>

                    {(f.improvement_suggestions || f.suggestion) && (
                      <p className="text-gray-700">
                        <strong className="text-gray-900">Suggestion:</strong> {f.improvement_suggestions || f.suggestion}
                      </p>
                    )}

                    {(f.confusing_aspects || f.problem) && (
                      <p className="text-gray-500 text-xs">
                        <strong className="text-gray-700">Reported Friction:</strong> {f.confusing_aspects || f.problem}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </>
      )}

      {/* Methodology Section */}
      <div className="card p-6 bg-gray-50 space-y-4 border-gray-200">
        <h3 className="font-semibold text-gray-900">Validation &amp; Research Methodology</h3>
        <div className="grid sm:grid-cols-3 gap-4 text-xs text-gray-600">
          <div className="p-3 bg-white rounded-lg border border-gray-200 space-y-1">
            <div className="font-bold text-gray-900">1. In-Situ Measurement</div>
            <p>Students use the live timer on mobile browsers when arriving at hostel lift lobbies.</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-gray-200 space-y-1">
            <div className="font-bold text-gray-900">2. Empirical Ground Truth</div>
            <p>Waiting records establish ground truth for peak hours without simulated or synthetic numbers.</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-gray-200 space-y-1">
            <div className="font-bold text-gray-900">3. Closed-Loop Feedback</div>
            <p>Post-use surveys continuously evaluate whether wait estimates reduce uncertainty in student decision-making.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
