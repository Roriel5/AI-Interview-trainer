import { useState, useEffect, useCallback } from 'react';
import { BrainCircuit, Square } from 'lucide-react';

import ChatWindow from './ChatWindow';
import StatusIndicator from './StatusIndicator';
import SpeakButton from './SpeakButton';
import useSpeechRecognition from '../../hooks/useSpeechRecognition';
import { startInterview, chat, evaluateInterview } from '../../api';

const getTimestamp = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const makeMessage = (role, text) => ({
  id: `${role}-${Date.now()}-${Math.random()}`,
  role,
  text,
  timestamp: getTimestamp(),
});

const InterviewScreen = ({ candidateName, jobDomain, onEnd }) => {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('ready'); // 'ready' | 'thinking' | 'listening' | 'idle'
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false);

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

    setIsButtonDisabled(true);
    setStatus('thinking');

    startInterview(candidateName, jobDomain)
      .then((data) => {
        setMessages([makeMessage('ai', data.message)]);
        setStatus('ready');
        setIsButtonDisabled(false);
      })
      .catch((err) => {
        console.error(err);
        setMessages([makeMessage('ai', 'Error starting interview. Please try again.')]);
        setStatus('ready');
        setIsButtonDisabled(false);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Handle speech recognition state changes ──────────────────────────────
  useEffect(() => {
    if (isListening) {
      setStatus('listening');
    }
  }, [isListening]);

  // ─── When transcript finalizes (speech ended), post user answer ───────────
  useEffect(() => {
    if (!isListening && transcript && !interviewComplete) {
      const userText = transcript.trim();
      if (!userText) return;

      // Post user message
      const userMsg = makeMessage('user', userText);
      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      resetTranscript();

      // Send to backend
      setIsButtonDisabled(true);
      setStatus('thinking');

      // Convert format for backend
      const historyForBackend = newMessages.map((m) => ({
        role: m.role === 'ai' ? 'interviewer' : 'user',
        text: m.text,
      }));

      chat(jobDomain, historyForBackend, userText)
        .then((data) => {
          setMessages([...newMessages, makeMessage('ai', data.bot_response)]);
          setStatus('ready');
          setIsButtonDisabled(false);
        })
        .catch((err) => {
          console.error(err);
          setMessages([...newMessages, makeMessage('ai', 'Sorry, I missed that. Could you repeat?')]);
          setStatus('ready');
          setIsButtonDisabled(false);
        });
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
    
    // Evaluate logic
    setIsButtonDisabled(true);
    setStatus('thinking');
    setInterviewComplete(true);
    
    const historyForBackend = messages.map((m) => ({
      role: m.role === 'ai' ? 'interviewer' : 'user',
      text: m.text,
    }));

    evaluateInterview(candidateName, jobDomain, historyForBackend)
      .then((scorecard) => {
        onEnd(scorecard);
      })
      .catch((err) => {
        console.error("Evaluation failed", err);
        alert("Failed to generate scorecard. Please check the backend.");
        setIsButtonDisabled(false);
        setStatus('idle');
        setInterviewComplete(false);
      });
  };

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
          style={{ width: interviewComplete || status === 'thinking' ? '100%' : '50%' }}
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
        <p className="text-xs text-slate-600 mb-2">
          {interviewComplete ? 'Evaluating...' : 'Answer the questions actively'}
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
            disabled
            className="mt-3 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 opacity-50 text-white text-sm font-semibold shadow-lg"
          >
            Generating Scorecard...
          </button>
        )}
      </div>
    </div>
  );
};

export default InterviewScreen;
