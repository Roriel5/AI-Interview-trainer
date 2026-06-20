import { Bot, User } from 'lucide-react';

const MessageBubble = ({ message }) => {
  const isAI = message.role === 'ai';

  return (
    <div className={`flex gap-3 animate-slide-up ${isAI ? 'justify-start' : 'justify-end'}`}>

      {/* AI Avatar — left side */}
      {isAI && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-600 flex items-center justify-center mt-0.5 shadow-md">
          <Bot size={15} className="text-white" />
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[75%] md:max-w-[65%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-md transition-all ${
          isAI
            ? 'bg-slate-800/80 border border-indigo-500/20 text-slate-200 rounded-tl-sm'
            : 'bg-gradient-to-br from-indigo-600/90 to-blue-600/90 text-white border border-indigo-500/30 rounded-tr-sm'
        }`}
      >
        {isAI && (
          <p className="text-[10px] font-semibold text-indigo-400 uppercase tracking-widest mb-1.5">
            Interviewer
          </p>
        )}
        <p className="whitespace-pre-wrap">{message.text}</p>
        <p className={`text-[10px] mt-1.5 ${isAI ? 'text-slate-500' : 'text-indigo-200/60'}`}>
          {message.timestamp}
        </p>
      </div>

      {/* User Avatar — right side */}
      {!isAI && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center mt-0.5 shadow-md">
          <User size={15} className="text-slate-300" />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
