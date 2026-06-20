const StatusIndicator = ({ status }) => {
  const configs = {
    thinking: {
      dot: 'bg-amber-400 animate-pulse',
      ring: 'border-amber-400/30',
      text: 'text-amber-300',
      label: 'AI is thinking…',
      bg: 'bg-amber-500/10',
    },
    listening: {
      dot: 'bg-red-400 animate-pulse',
      ring: 'border-red-400/30',
      text: 'text-red-300',
      label: 'Listening…',
      bg: 'bg-red-500/10',
    },
    ready: {
      dot: 'bg-emerald-400',
      ring: 'border-emerald-400/30',
      text: 'text-emerald-300',
      label: 'Ready',
      bg: 'bg-emerald-500/10',
    },
    idle: {
      dot: 'bg-slate-500',
      ring: 'border-slate-500/30',
      text: 'text-slate-400',
      label: 'Idle',
      bg: 'bg-slate-500/10',
    },
  };

  const cfg = configs[status] || configs.idle;

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${cfg.ring} ${cfg.bg} transition-all duration-500`}>
      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
      <span className={`text-xs font-medium ${cfg.text}`}>{cfg.label}</span>
    </div>
  );
};

export default StatusIndicator;
