import { BrainCircuit, RotateCcw, Trophy } from 'lucide-react';
import ScoreRing from './ScoreRing';
import FeedbackSection from './FeedbackSection';
import ModelAnswerAccordion from './ModelAnswerAccordion';

const ScorecardScreen = ({ scorecard, candidateName, jobDomain, onRestart }) => {
  const { technicalScore, communicationScore, feedback, modelAnswers } = scorecard;
  const overallScore = ((technicalScore + communicationScore) / 2).toFixed(1);

  return (
    <div className="min-h-screen bg-slate-950 dot-pattern overflow-y-auto">

      {/* Ambient blobs */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-indigo-600/8 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 glass border-b border-slate-800/60 px-4 md:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center glow-indigo">
            <BrainCircuit size={16} className="text-white" />
          </div>
          <span className="font-bold text-base gradient-text">AIview</span>
        </div>

        <div className="flex items-center gap-2">
          <Trophy size={15} className="text-amber-400" />
          <span className="text-sm font-semibold text-slate-300">Evaluation Complete</span>
        </div>

        <button
          id="restart-btn"
          onClick={onRestart}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-400 hover:text-slate-200 text-xs font-medium transition-all duration-200"
        >
          <RotateCcw size={12} />
          New Interview
        </button>
      </header>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-10 space-y-10">

        {/* Hero section */}
        <div className="text-center animate-slide-up">
          <p className="text-slate-500 text-sm mb-1 uppercase tracking-widest font-medium">Scorecard for</p>
          <h1 className="text-3xl md:text-4xl font-black text-slate-100 mb-1">{candidateName}</h1>
          <p className="text-slate-500 text-sm">{jobDomain} Interview</p>
        </div>

        {/* Overall score banner */}
        <div className="glass-card rounded-2xl p-6 border border-slate-700/40 flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-medium mb-1">Overall Performance</p>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black gradient-text">{overallScore}</span>
              <span className="text-slate-500 text-lg font-medium">/ 10</span>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              {overallScore >= 8 ? '🏆 Outstanding performance!' :
               overallScore >= 6.5 ? '👍 Solid candidate — keep refining!' :
               '📈 Good effort — review the model answers below!'}
            </p>
          </div>
          <div className="h-px md:h-16 w-full md:w-px bg-slate-700/50" />
          <div className="text-center md:text-right">
            <p className="text-xs text-slate-500 mb-1">Questions Answered</p>
            <p className="text-2xl font-bold text-slate-200">All Complete</p>
            <p className="text-xs text-slate-600 mt-0.5">5 of 5</p>
          </div>
        </div>

        {/* Score rings */}
        <section className="animate-fade-in">
          <h2 className="text-lg font-semibold text-slate-200 mb-4">Score Breakdown</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ScoreRing
              score={technicalScore}
              label="Technical Accuracy"
              color="indigo"
            />
            <ScoreRing
              score={communicationScore}
              label="Communication Skills"
              color="cyan"
            />
          </div>
        </section>

        {/* Feedback */}
        <section className="animate-fade-in">
          <h2 className="text-lg font-semibold text-slate-200 mb-4">Constructive Feedback</h2>
          <FeedbackSection feedback={feedback} />
        </section>

        {/* Model Answers */}
        <section className="animate-fade-in pb-10">
          <h2 className="text-lg font-semibold text-slate-200 mb-1">Model Answers</h2>
          <p className="text-xs text-slate-500 mb-4">Click any question to reveal an ideal response strategy.</p>
          <ModelAnswerAccordion modelAnswers={modelAnswers} />
        </section>

        {/* CTA */}
        <div className="text-center pb-12 animate-slide-up">
          <button
            onClick={onRestart}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-sm font-semibold shadow-lg glow-indigo transition-all hover:scale-[1.03] active:scale-[0.97]"
          >
            <RotateCcw size={15} />
            Start a New Interview
          </button>
        </div>
      </main>
    </div>
  );
};

export default ScorecardScreen;
