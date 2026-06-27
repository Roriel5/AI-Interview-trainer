import React, { useState } from 'react';
import { BrainCircuit, Lock, Mail, User } from 'lucide-react';

export default function SignupScreen({ onSignup, onNavigateToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email && password) {
      onSignup({ email, name });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="max-w-md w-full p-8 rounded-2xl glass border border-slate-800/80 shadow-2xl relative overflow-hidden">
        
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg glow-indigo mb-4">
            <BrainCircuit size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold gradient-text">Create Account</h2>
          <p className="mt-1.5 text-xs text-slate-400">Join AIview and jumpstart your career preparation</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500"><User size={14} /></span>
              <input
                type="text"
                required
                className="w-full pl-9 pr-4 py-2 bg-slate-900/60 border border-slate-800 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-slate-100 placeholder-slate-600 text-sm outline-none transition"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500"><Mail size={14} /></span>
              <input
                type="email"
                required
                className="w-full pl-9 pr-4 py-2 bg-slate-900/60 border border-slate-800 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-slate-100 placeholder-slate-600 text-sm outline-none transition"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500"><Lock size={14} /></span>
              <input
                type="password"
                required
                className="w-full pl-9 pr-4 py-2 bg-slate-900/60 border border-slate-800 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-slate-100 placeholder-slate-600 text-sm outline-none transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-sm font-semibold shadow-lg glow-indigo transition-all duration-200 hover:scale-[1.01]"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <button onClick={onNavigateToLogin} className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline transition">
              Log In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}