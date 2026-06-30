import React, { useState, useEffect } from 'react';
import PastInterviewsList from './PastInterviewsList';
import { BrainCircuit, LayoutDashboard, Award, MessageSquare, PlusCircle, LogOut, ArrowUpRight } from 'lucide-react';
import { getHistory } from '../../api';

export default function DashboardScreen({ user, onStartNewInterview, onLogout }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.name) {
      getHistory(user.name)
        .then(data => {
          setHistory(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user]);

  const avgTech = history.length > 0 
    ? (history.reduce((sum, s) => sum + (s.evaluation?.technicalScore || 0), 0) / history.length * 10).toFixed(1)
    : '0.0';
    
  const avgComm = history.length > 0 
    ? (history.reduce((sum, s) => sum + (s.evaluation?.communicationScore || 0), 0) / history.length * 10).toFixed(1)
    : '0.0';

  return (
    <div className="h-screen flex bg-slate-950 overflow-hidden text-slate-100">
      
      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="w-64 glass border-r border-slate-800/60 hidden md:flex flex-col justify-between p-5 z-10">
        <div className="space-y-7">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-md glow-indigo">
              <BrainCircuit size={16} className="text-white" />
            </div>
            <span className="font-bold text-base gradient-text">AIview</span>
          </div>

          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-medium text-sm transition">
              <LayoutDashboard size={16} /> Dashboard
            </a>
          </nav>
        </div>

        <button 
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 font-medium text-sm rounded-xl transition duration-200"
        >
          <LogOut size={16} /> Logout
        </button>
      </aside>

      {/* ── Main Panel Content ─────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-y-auto relative p-6 md:p-8">
        
        {/* Background Glowing Ambiance */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/5 blur-3xl rounded-full pointer-events-none" />

        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Welcome back, {user?.name || 'Candidate'}</h1>
            <p className="text-xs text-slate-400 mt-1">Monitor metrics evaluation history and mock progress.</p>
          </div>
          <button
            onClick={onStartNewInterview}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-sm font-semibold rounded-xl shadow-lg glow-indigo transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle size={16} /> Setup New Session
          </button>
        </header>

        {/* ── Analytical Metrics Cards ────────────────────────────────────── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          <div className="glass border border-slate-800/60 p-5 rounded-xl flex items-center gap-4 shadow-md">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg"><Award size={20} /></div>
            <div>
              <span className="block text-xl font-bold tracking-tight text-slate-100">{avgTech}%</span>
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Avg. Tech Skill</span>
            </div>
          </div>
          <div className="glass border border-slate-800/60 p-5 rounded-xl flex items-center gap-4 shadow-md">
            <div className="p-2.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-lg"><MessageSquare size={20} /></div>
            <div>
              <span className="block text-xl font-bold tracking-tight text-slate-100">{avgComm}%</span>
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Avg. Communication</span>
            </div>
          </div>
          <div className="glass border border-slate-800/60 p-5 rounded-xl flex items-center gap-4 shadow-md sm:col-span-2 lg:col-span-1">
            <div className="p-2.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg"><LayoutDashboard size={20} /></div>
            <div>
              <span className="block text-xl font-bold tracking-tight text-slate-100">{history.length}</span>
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Total Evaluation Runs</span>
            </div>
          </div>
        </section>

       {/* ── Evaluation Session Logs ─────────────────────────────────────── */}
    <section className="flex-1 flex flex-col min-h-[300px]">
    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">
        Historical Records
    </h2>
    <PastInterviewsList history={history} />
    </section>
      </main>
    </div>
  );
}