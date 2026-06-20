import { CheckCircle, AlertCircle } from 'lucide-react';

const FeedbackSection = ({ feedback }) => {
  const positives = feedback.filter((f) => f.type === 'positive');
  const constructive = feedback.filter((f) => f.type === 'constructive');

  return (
    <div className="space-y-5">
      {/* Strengths */}
      {positives.length > 0 && (
        <div className="glass-card rounded-2xl p-5 border border-emerald-500/10">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={16} className="text-emerald-400" />
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide">Strengths</h3>
          </div>
          <ul className="space-y-2.5">
            {positives.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                <p className="text-sm text-slate-300 leading-relaxed">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Areas to improve */}
      {constructive.length > 0 && (
        <div className="glass-card rounded-2xl p-5 border border-amber-500/10">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={16} className="text-amber-400" />
            <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wide">Areas to Improve</h3>
          </div>
          <ul className="space-y-2.5">
            {constructive.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                <p className="text-sm text-slate-300 leading-relaxed">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FeedbackSection;
