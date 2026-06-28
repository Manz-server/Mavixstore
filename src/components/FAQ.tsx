import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQ_ITEMS } from '../data/initialData';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(prev => (prev === idx ? null : idx));
  };

  return (
    <section id="faq-section" className="py-24 bg-[#020617] relative border-t border-white/5">
      {/* Glow lights */}
      <div className="absolute bottom-10 left-12 w-[300px] h-[300px] rounded-full bg-[#35FF90]/3 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-[#35FF90] mb-3">
            Common Inquiries
          </p>
          <h2 className="font-display text-3xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <div className="h-1 w-12 bg-[#35FF90] mx-auto rounded-full mt-4" />
        </div>

        {/* Accordion list */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = index === openIndex;
            return (
              <div
                key={index}
                id={`faq-item-${index}`}
                className="rounded-2xl border border-white/5 bg-[#0b1329] hover:border-white/10 overflow-hidden transition-all duration-300"
              >
                <button
                  id={`faq-question-btn-${index}`}
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between p-5 text-left text-white hover:text-[#35FF90] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 pr-4">
                    <HelpCircle className="w-5 h-5 text-[#35FF90] shrink-0" />
                    <span className="text-xs sm:text-sm font-bold font-display tracking-wide">
                      {item.question}
                    </span>
                  </div>
                  
                  {/* Rotating Chevron */}
                  <div className={`p-1.5 rounded-lg bg-[#020617] text-[#A7B3D0] transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-[#35FF90]' : ''
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Animated Dropdown Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-5 pb-5 pt-1 text-xs text-gray-400 leading-relaxed font-sans font-light border-t border-white/5 bg-[#020617]/40">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
