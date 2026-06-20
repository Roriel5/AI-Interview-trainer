import { Mic, MicOff, AlertCircle } from 'lucide-react';

const SpeakButton = ({ isListening, isDisabled, onToggle, error, isSupported }) => {
  if (!isSupported) {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/80 border border-red-500/20 text-red-400 text-sm max-w-xs text-center">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>Speech recognition not supported. Use Chrome or Edge.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs max-w-xs text-center">
          <AlertCircle size={13} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main button */}
      <button
        id="speak-button"
        onClick={onToggle}
        disabled={isDisabled}
        aria-label={isListening ? 'Stop recording' : 'Start speaking'}
        className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-slate-950 ${
          isDisabled
            ? 'bg-slate-800 text-slate-600 cursor-not-allowed focus:ring-slate-700'
            : isListening
            ? 'bg-red-600 hover:bg-red-500 text-white glow-red focus:ring-red-500 animate-pulse-ring'
            : 'bg-gradient-to-br from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white glow-indigo hover:scale-105 active:scale-95 focus:ring-indigo-500'
        }`}
      >
        {/* Outer pulse ring (only when listening) */}
        {isListening && (
          <>
            <span className="absolute inset-0 rounded-full bg-red-500/30 animate-ping" />
            <span className="absolute inset-[-6px] rounded-full border-2 border-red-400/40" />
          </>
        )}

        {isListening
          ? <MicOff size={28} className="relative z-10" />
          : <Mic size={28} className="relative z-10" />
        }
      </button>

      {/* Label */}
      <span className={`text-sm font-medium transition-colors duration-300 ${
        isDisabled ? 'text-slate-600' :
        isListening ? 'text-red-400' : 'text-slate-400'
      }`}>
        {isDisabled
          ? 'Waiting…'
          : isListening
          ? 'Listening… Click to Stop'
          : 'Click to Speak'}
      </span>
    </div>
  );
};

export default SpeakButton;
