import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../data/initialData';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const active = TESTIMONIALS[currentIndex];

  return (
    <section id="testimonials-section" className="py-24 bg-[#0B122E]/20 relative border-t border-white/5 overflow-hidden">
      {/* Background flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#35FF90]/5 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        
        {/* Header */}
        <p className="text-xs font-mono font-bold uppercase tracking-widest text-[#35FF90] mb-3">
          Customer Trust is Everything
        </p>
        <h2 className="font-display text-3xl font-extrabold text-white tracking-tight mb-4">
          Apa Kata Pengelola Server?
        </h2>
        <div className="h-1.5 w-16 bg-[#35FF90] mx-auto rounded-full mb-12" />

        {/* Slider Box */}
        <div className="relative min-h-[300px] md:min-h-[250px] flex items-center justify-center">
          
          {/* Main testimonial Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full bg-[#101935] border border-white/10 rounded-2xl p-7 sm:p-10 text-left relative glow-primary"
            >
              <Quote className="absolute top-6 right-8 text-[#35FF90]/10 w-20 h-20 pointer-events-none" />

              {/* Rating stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < active.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>

              {/* Content feedback */}
              <p className="text-sm sm:text-base text-white font-light leading-relaxed mb-6 italic">
                "{active.comment}"
              </p>

              {/* Author row */}
              <div className="flex items-center gap-3.5 pt-4 border-t border-white/5">
                <img
                  referrerPolicy="no-referrer"
                  src={active.avatar}
                  alt={active.name}
                  className="w-11 h-11 rounded-full border-2 border-[#35FF90] object-cover"
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                    {active.name}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-[#A7B3D0] uppercase font-mono tracking-wider">
                    {active.role}
                  </p>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-3">
            <button
              id="testimonial-prev-btn"
              onClick={handlePrev}
              className="p-2 sm:p-2.5 rounded-xl bg-[#101935] hover:bg-[#101935]/80 text-[#A7B3D0] hover:text-[#35FF90] border border-white/10 hover:border-[#35FF90]/30 transition-all active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {/* Dots */}
            <div className="flex gap-1.5 px-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  id={`testimonial-dot-${i}`}
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentIndex ? 'bg-[#35FF90] w-6' : 'bg-gray-600 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <button
              id="testimonial-next-btn"
              onClick={handleNext}
              className="p-2 sm:p-2.5 rounded-xl bg-[#101935] hover:bg-[#101935]/80 text-[#A7B3D0] hover:text-[#35FF90] border border-white/10 hover:border-[#35FF90]/30 transition-all active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
