import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function PastInterviewsList({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="flex-1 glass border border-slate-800/60 rounded-xl flex flex-col items-center justify-center p-8 shadow-xl text-center">
        <p className="text-sm text-slate-500">No interview sessions found.</p>
        <p className="text-xs text-slate-600 mt-1">Configure a new session to get your first evaluation scorecard.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 glass border border-slate-800/60 rounded-xl overflow-hidden shadow-xl">
      <div className="divide-y divide-slate-800/50">
        {history.map((session) => (
          <div 
            key={session.id} 
            className="p-4 md:p-5 flex items-center justify-between gap-4 hover:bg-slate-900/30 transition duration-150 group"
          >
            <div className="space-y-1">
              <h3 className="font-semibold text-sm text-slate-200 group-hover:text-white transition">
                {session.domain}
              </h3>
              <p className="text-[11px] text-slate-500">{new Date(session.timestamp).toLocaleDateString()}</p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right text-xs space-y-0.5">
                <p className="text-slate-400">
                  Technical: <span className="text-indigo-400 font-bold">{session.evaluation?.technicalScore}/10</span>
                </p>
                <p className="text-slate-400">
                  Communication: <span className="text-cyan-400 font-bold">{session.evaluation?.communicationScore}/10</span>
                </p>
              </div>
              
              <button 
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 group-hover:text-slate-200 group-hover:border-slate-700 hover:bg-slate-800 transition-all"
                title="View Full Scorecard"
              >
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}