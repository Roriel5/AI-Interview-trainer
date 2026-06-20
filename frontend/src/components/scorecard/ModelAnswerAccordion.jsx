import { useState } from 'react';
import { ChevronDown, BookOpen } from 'lucide-react';

const AccordionItem = ({ item, index, isOpen, onToggle }) => {
  return (
    <div className="border border-slate-700/50 rounded-xl overflow-hidden transition-all duration-200 hover:border-indigo-500/30">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-slate-800/40 hover:bg-slate-800/70 transition-colors duration-200 group"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-[11px] font-bold flex items-center justify-center">
            {index + 1}
          </span>
          <span className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">
            {item.question}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`flex-shrink-0 ml-3 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-400' : ''}`}
        />
      </button>

      {/* Content */}
      <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
        <div className="px-5 py-4 bg-slate-900/40 border-t border-slate-700/30">
          <div className="flex items-start gap-2.5 mb-2">
            <BookOpen size={13} className="text-indigo-400 mt-0.5 flex-shrink-0" />
            <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-widest">Model Answer</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{item.answer}</p>
        </div>
      </div>
    </div>
  );
};

const ModelAnswerAccordion = ({ modelAnswers }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="space-y-2">
      {modelAnswers.map((item, index) => (
        <AccordionItem
          key={index}
          item={item}
          index={index}
          isOpen={openIndex === index}
          onToggle={() => handleToggle(index)}
        />
      ))}
    </div>
  );
};

export default ModelAnswerAccordion;
