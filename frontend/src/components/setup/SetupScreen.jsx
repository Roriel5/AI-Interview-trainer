import { useState } from 'react';
import { Sparkles, ChevronDown, ArrowRight, BrainCircuit } from 'lucide-react';

const JOB_DOMAINS = ['Frontend Developer', 'Data Scientist', 'Backend Engineer'];

const SetupScreen = ({ candidateName, setCandidateName, jobDomain, setJobDomain, onStart }) => {
  const [focused, setFocused] = useState(null);
  const isReady = candidateName.trim().length > 0;

  return (
    <div className="min-h-screen dot-pattern flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">

      {/* Ambient glow blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-3xl pointer-events-none" />

      {/* Logo mark */}
      <div className="flex items-center gap-2 mb-8 animate-fade-in">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg glow-indigo">
          <BrainCircuit size={22} className="text-white" />
        </div>
        <span className="text-slate-400 text-sm font-medium tracking-widest uppercase">Powered by AI</span>
      </div>

      {/* Hero title */}
      <div className="text-center mb-4 animate-slide-up">
        <h1 className="text-7xl md:text-8xl font-black gradient-text tracking-tight leading-none mb-4">
          AIview
        </h1>
        <p className="text-slate-400 text-lg md:text-xl font-light max-w-md mx-auto leading-relaxed">
          Your intelligent mock interview coach. Practice. Get feedback. Land the job.
        </p>
      </div>

      {/* Feature pills */}
      <div className="flex flex-wrap gap-2 justify-center mb-12 animate-fade-in">
        {['Real-time Speech', 'AI Evaluation', 'Instant Scorecard'].map((label) => (
          <span
            key={label}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60"
          >
            <Sparkles size={11} className="text-indigo-400" />
            {label}
          </span>
        ))}
      </div>

      {/* Setup card */}
      <div className="w-full max-w-md glass-card rounded-2xl p-8 shadow-2xl animate-slide-up">
        <h2 className="text-xl font-semibold text-slate-100 mb-6">Set Up Your Session</h2>

        {/* Candidate Name */}
        <div className="mb-5">
          <label htmlFor="candidate-name" className="block text-sm font-medium text-slate-400 mb-2">
            Your Name
          </label>
          <input
            id="candidate-name"
            type="text"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            onFocus={() => setFocused('name')}
            onBlur={() => setFocused(null)}
            placeholder="e.g. Alex Johnson"
            className={`w-full bg-slate-900/80 border rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 text-sm font-medium outline-none transition-all duration-200 ${
              focused === 'name'
                ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                : 'border-slate-700 hover:border-slate-600'
            }`}
          />
        </div>

        {/* Job Domain */}
        <div className="mb-8">
          <label htmlFor="job-domain" className="block text-sm font-medium text-slate-400 mb-2">
            Interview Role
          </label>
          <div className="relative">
            <select
              id="job-domain"
              value={jobDomain}
              onChange={(e) => setJobDomain(e.target.value)}
              onFocus={() => setFocused('domain')}
              onBlur={() => setFocused(null)}
              className={`w-full appearance-none bg-slate-900/80 border rounded-xl px-4 py-3 text-slate-100 text-sm font-medium outline-none transition-all duration-200 cursor-pointer ${
                focused === 'domain'
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                  : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              {JOB_DOMAINS.map((domain) => (
                <option key={domain} value={domain} className="bg-slate-900">
                  {domain}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />
          </div>
        </div>

        {/* CTA Button */}
        <button
          id="start-interview-btn"
          onClick={onStart}
          disabled={!isReady}
          className={`w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
            isReady
              ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-lg glow-indigo hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-slate-800 text-slate-600 cursor-not-allowed'
          }`}
        >
          Start Interview
          <ArrowRight size={16} className={isReady ? 'text-white/80' : 'text-slate-600'} />
        </button>

        {!isReady && (
          <p className="text-center text-xs text-slate-600 mt-3">Enter your name to get started</p>
        )}
      </div>

      {/* Footer note */}
      <p className="mt-8 text-xs text-slate-600 text-center animate-fade-in">
        Microphone access required · Best experienced in Chrome or Edge
      </p>
    </div>
  );
};

export default SetupScreen;
