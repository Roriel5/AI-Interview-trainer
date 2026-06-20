import { useState, useEffect, useRef, useCallback } from 'react';

const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef(null);
  const shouldStopRef = useRef(false);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      setError('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    setIsSupported(true);
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event) => {
      let finalText = '';
      let interimText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript;
        } else {
          interimText += result[0].transcript;
        }
      }

      if (finalText) {
        setTranscript((prev) => (prev + ' ' + finalText).trim());
        setInterimTranscript('');
      } else {
        setInterimTranscript(interimText);
      }
    };

    recognition.onerror = (event) => {
      if (event.error === 'no-speech') {
        setError('No speech detected. Please try again.');
      } else if (event.error === 'audio-capture') {
        setError('Microphone not found. Please check your device settings.');
      } else if (event.error === 'not-allowed') {
        setError('Microphone permission denied. Please allow access in your browser settings.');
      } else {
        setError(`Speech error: ${event.error}`);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setInterimTranscript('');
      if (!shouldStopRef.current) {
        // Auto-ended (browser timeout) — mark as stopped
        setIsListening(false);
      } else {
        setIsListening(false);
        shouldStopRef.current = false;
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;
    setTranscript('');
    setInterimTranscript('');
    setError(null);
    shouldStopRef.current = false;
    try {
      recognitionRef.current.start();
    } catch (e) {
      // Guard against already-started errors
      setError('Could not start microphone. Please try again.');
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return;
    shouldStopRef.current = true;
    recognitionRef.current.stop();
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    transcript,
    interimTranscript,
    isListening,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
};

export default useSpeechRecognition;
