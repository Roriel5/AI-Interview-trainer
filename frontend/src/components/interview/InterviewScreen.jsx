import { useState, useEffect, useCallback } from 'react';
import { BrainCircuit, Square } from 'lucide-react';

import ChatWindow from './ChatWindow';
import StatusIndicator from './StatusIndicator';
import SpeakButton from './SpeakButton';
import useSpeechRecognition from '../../hooks/useSpeechRecognition';
import { questionBanks, openingMessages, mockScorecard } from '../../data/mockInterview';

const getTimestamp = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const makeMessage = (role, text) => ({
  id: `${role}-${Date.now()}-${Math.random()}`,
  role,
  text,
  timestamp: getTimestamp(),
});

const InterviewScreen = ({ candidateName, jobDomain, onEnd }) => {
  const questions = questionBanks[jobDomain] || [];

  const [messages, setMessages] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [status, setStatus] = useState('ready'); // 'ready' | 'thinking' | 'listening' | 'idle'
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  const {
    transcript,
    interimTranscript,
    isListening,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  // ─── Post an AI message with a simulated thinking delay ──────────────────
  const postAIMessage = useCallback((text, delay = 0) => {
    setStatus('thinking');
    setIsButtonDisabled(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, makeMessage('ai', text)]);
      setStatus('ready');
      setIsButtonDisabled(false);
    }, delay);
  }, []);

  // ─── On mount: show opening greeting then first question ──────────────────
  useEffect(() => {
    if (hasStarted) return;
    setHasStarted(true);

    const greeting = openingMessages[jobDomain];
    const firstQuestion = questions[0]?.text;

    setIsButtonDisabled(true);
    setStatus('thinking');

    setTimeout(() => {
      setMessages([makeMessage('ai', greeting)]);
      setTimeout(() => {
        if (firstQuestion) {
          postAIMessage(
            `Question 1 of ${questions.length}: ${firstQuestion}`,
            1200
          );
        }
      }, 800);
    }, 800);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Handle speech recognition state changes ──────────────────────────────
  useEffect(() => {
    if (isListening) {
      setStatus('listening');
    }
  }, [isListening]);

  // ─── When transcript finalizes (speech ended), post user answer ───────────
  useEffect(() => {
    if (!isListening && transcript) {
      const userText = transcript.trim();
      if (!userText) return;

      // Post user message
      setMessages((prev) => [...prev, makeMessage('user', userText)]);
      resetTranscript();

      const nextIndex = currentQuestionIndex + 1;

      if (nextIndex < questions.length) {
        setCurrentQuestionIndex(nextIndex);
        postAIMessage(
          `Question ${nextIndex + 1} of ${questions.length}: ${questions[nextIndex].text}`,
          1800
        );
      } else {
        // All questions answered
        setStatus('idle');
        setIsButtonDisabled(true);
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            makeMessage(
              'ai',
              `That wraps up our interview, ${candidateName}! Thank you for your thoughtful answers. Click "End Interview" to see your full evaluation scorecard.`
            ),
          ]);
        }, 1500);
      }
    }
  }, [isListening, transcript]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Toggle mic ───────────────────────────────────────────────────────────
  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // ─── End interview ────────────────────────────────────────────────────────
  const handleEnd = () => {
    if (isListening) stopListening();
    onEnd(mockScorecard);
  };

  const interviewComplete = currentQuestionIndex >= questions.length && !isListening;

  return (
    <div className="h-screen flex flex-col bg-slate-950 overflow-hidden">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="flex-shrink-0 flex items-center justify-between px-4 md:px-6 py-3 glass border-b border-slate-800/60 z-10">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-md glow-indigo">
            <BrainCircuit size={16} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-base gradient-text">AIview</span>
            <p className="text-[10px] text-slate-500 leading-none">{candidateName} · {jobDomain}</p>
          </div>
        </div>

        {/* Status */}
        <StatusIndicator status={status} />

        {/* End button */}
        <button
          id="end-interview-btn"
          onClick={handleEnd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 text-xs font-medium transition-all duration-200"
        >
          <Square size={11} fill="currentColor" />
          End Interview
        </button>
      </header>

      {/* ── Progress bar ───────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 h-0.5 bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-indigo-600 to-cyan-500 transition-all duration-700"
          style={{
            width: `${(Math.min(currentQuestionIndex, questions.length) / questions.length) * 100}%`,
          }}
        />
      </div>

      {/* ── Chat window ────────────────────────────────────────────────────── */}
      <ChatWindow messages={messages} />

      {/* ── Interim transcript preview ─────────────────────────────────────── */}
      {(isListening && interimTranscript) && (
        <div className="flex-shrink-0 px-4 md:px-8 pb-2">
          <div className="max-w-2xl mx-auto px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700/40 text-slate-400 text-sm italic">
            "{interimTranscript}…"
          </div>
        </div>
      )}

      {/* ── Bottom controls ─────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 glass border-t border-slate-800/60 px-4 py-6 flex flex-col items-center gap-2">
        {/* Question counter */}
        <p className="text-xs text-slate-600 mb-2">
          {interviewComplete
            ? 'Interview complete'
            : `Question ${Math.min(currentQuestionIndex + 1, questions.length)} of ${questions.length}`}
        </p>

        <SpeakButton
          isListening={isListening}
          isDisabled={isButtonDisabled || interviewComplete}
          onToggle={handleMicToggle}
          error={error}
          isSupported={isSupported}
        />

        {interviewComplete && (
          <button
            onClick={handleEnd}
            className="mt-3 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-sm font-semibold shadow-lg glow-indigo transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Generate Scorecard →
          </button>
        )}
      </div>
    </div>
  );
};

export default InterviewScreen;
