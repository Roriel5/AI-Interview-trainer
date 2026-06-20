import { useEffect, useState } from 'react';

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const ScoreRing = ({ score, maxScore = 10, label, color = 'indigo' }) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const percentage = score / maxScore;
  const offset = CIRCUMFERENCE - (animated ? percentage * CIRCUMFERENCE : 0);

  const colorMap = {
    indigo: {
      stroke: '#6366f1',
      glow: 'drop-shadow(0 0 8px rgba(99,102,241,0.6))',
      text: 'text-indigo-400',
      badge: 'from-indigo-600/20 to-indigo-900/20 border-indigo-500/20',
    },
    cyan: {
      stroke: '#22d3ee',
      glow: 'drop-shadow(0 0 8px rgba(34,211,238,0.6))',
      text: 'text-cyan-400',
      badge: 'from-cyan-600/20 to-cyan-900/20 border-cyan-500/20',
    },
  };

  const c = colorMap[color] || colorMap.indigo;

  return (
    <div className={`flex flex-col items-center gap-4 p-6 rounded-2xl bg-gradient-to-br ${c.badge} border glass-card`}>
      {/* SVG Ring */}
      <div className="relative w-36 h-36">
        <svg width="144" height="144" viewBox="0 0 144 144" className="-rotate-90">
          {/* Track */}
          <circle
            cx="72" cy="72" r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="10"
          />
          {/* Progress */}
          <circle
            cx="72" cy="72" r={RADIUS}
            fill="none"
            stroke={c.stroke}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={{
              filter: c.glow,
              transition: 'stroke-dashoffset 1.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          />
        </svg>

        {/* Score number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-black ${c.text}`}>{score.toFixed(1)}</span>
          <span className="text-[10px] text-slate-500 font-medium">/ {maxScore}</span>
        </div>
      </div>

      {/* Label */}
      <div className="text-center">
        <p className="text-sm font-semibold text-slate-200">{label}</p>
        <p className={`text-xs mt-0.5 font-medium ${c.text}`}>
          {percentage >= 0.8 ? 'Excellent' : percentage >= 0.6 ? 'Good' : percentage >= 0.4 ? 'Average' : 'Needs Work'}
        </p>
      </div>
    </div>
  );
};

export default ScoreRing;
