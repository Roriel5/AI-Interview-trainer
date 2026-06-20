import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import { MessageSquare } from 'lucide-react';

const ChatWindow = ({ messages }) => {
  const bottomRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 min-h-0">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
            <MessageSquare size={22} className="text-slate-600" />
          </div>
          <p className="text-slate-600 text-sm">Your conversation will appear here…</p>
        </div>
      ) : (
        messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))
      )}

      {/* Scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;
