import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowRight, ArrowUpRight, MessageSquare, Play } from 'lucide-react';

interface HeroProps {
  onStartClick: () => void;
  onViewPackagesClick: () => void;
}

export default function Hero({ onStartClick, onViewPackagesClick }: HeroProps) {
  // Live player stats counter simulation
  const [playersOnline, setPlayersOnline] = useState<number>(1420);
  const [showDiscord, setShowDiscord] = useState<boolean>(false);
  const [heroBgUrl, setHeroBgUrl] = useState<string>(() => {
    return localStorage.getItem('mavix_hero_bg_url') || 'https://images.unsplash.com/photo-1607988795691-3d0147b43231?q=80&w=1920';
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('mavix_hero_bg_url');
      if (stored) {
        setHeroBgUrl(stored);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    // Poll/sync on mount
    handleStorageChange();
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlayersOnline(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      id="hero-section" 
      className="relative min-h-screen pt-36 pb-24 flex items-center overflow-hidden bg-[#020617]"
    >
      {/* Background Image with Dark Minecraft Vibe Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{ 
          backgroundImage: `url('${heroBgUrl}')`,
          filter: 'brightness(0.25) contrast(1.15) saturate(0.85)'
        }}
      />
      
      {/* Neon Gradient Overlays to match the green theme */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] rounded-full bg-[#35FF90]/5 blur-[120px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Matches Gambar 1 precisely */}
          <div className="lg:col-span-8 flex flex-col items-start text-left space-y-6 sm:space-y-8">
            
            {/* Slogan Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.12]"
            >
              Hosting Minecraft <br className="hidden sm:block" />
              &amp; Cloud Server Indonesia
            </motion.h1>

            {/* Slogan Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-sm sm:text-base md:text-lg text-gray-300 font-light leading-relaxed max-w-3xl"
            >
              Hosting game Minecraft pertama di Indonesia yang menggunakan processor AMD EPYC 4005 Series, performa server-grade dengan DDR5 ECC, anti-DDoS, dan uptime 99.9% untuk gamer serius.
            </motion.p>

            {/* Bullet list of advantages (2x2 grid on desktop, single column on mobile) */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3.5 text-xs sm:text-sm font-sans text-gray-300 w-full max-w-3xl"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#35FF90]/10 border border-[#35FF90]/30 flex items-center justify-center text-[#35FF90]">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium">Uptime Server 99.9%</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#35FF90]/10 border border-[#35FF90]/30 flex items-center justify-center text-[#35FF90]">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium">Dukungan 24/7 via Discord</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#35FF90]/10 border border-[#35FF90]/30 flex items-center justify-center text-[#35FF90]">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium">Setup Instan dalam Hitungan Menit</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#35FF90]/10 border border-[#35FF90]/30 flex items-center justify-center text-[#35FF90]">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium">Keamanan DDoS Protection</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 w-full sm:w-auto pt-4"
            >
              <button
                id="hero-start-btn"
                onClick={onStartClick}
                className="flex items-center justify-center gap-2 bg-[#35FF90] text-[#020617] px-8 py-4 rounded-xl font-bold tracking-wide shadow-[0_0_20px_rgba(53,255,144,0.3)] hover:shadow-[0_0_35px_rgba(53,255,144,0.5)] hover:bg-[#35FF90]/90 transition-all duration-300 hover:scale-[1.03] cursor-pointer"
              >
                <span>Mulai Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                id="hero-packages-btn"
                onClick={onViewPackagesClick}
                className="flex items-center justify-center gap-2 bg-[#0b1329]/80 hover:bg-[#0b1329] text-white border border-white/10 hover:border-[#35FF90]/40 px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white/10" />
                <span>Lihat Paket Server</span>
              </button>
            </motion.div>

          </div>

          {/* Right Column: Free space matching image 1, with subtle floating stats */}
          <div className="lg:col-span-4 hidden lg:flex flex-col items-end justify-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-[#0b1329]/75 backdrop-blur-md border border-white/5 p-6 rounded-2xl text-left space-y-4 max-w-xs shadow-xl"
            >
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#35FF90] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#35FF90]"></span>
                </span>
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Global Live Node</span>
              </div>
              <div>
                <p className="text-3xl font-mono font-black text-[#35FF90] tracking-tight">{playersOnline}</p>
                <p className="text-[10px] text-gray-400 font-sans mt-0.5">Aktif Pemain di Seluruh Node</p>
              </div>
              <div className="h-px bg-white/5" />
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-gray-500">Avg Latency:</span>
                <span className="text-emerald-400 font-bold">4.2 ms (JKT)</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* FLOATING CHAT WIDGET - Matches the widget bubble on the lower right in the screenshots (Coloured Green) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center">
        <AnimatePresence>
          {showDiscord && (
            <motion.a
              href={localStorage.getItem('mavix_discord_link') || 'https://discord.gg/mavixstore'}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30, scale: 0.3 }}
              animate={{ opacity: 1, y: -16, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.3 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center w-14 h-14 bg-[#5865F2] hover:bg-[#5865F2]/90 text-white rounded-full shadow-[0_4px_20px_rgba(88,101,242,0.4)] transition-all cursor-pointer relative group"
              title="Gabung Discord Kami!"
            >
              {/* Tooltip */}
              <div className="absolute right-16 bg-[#020617] text-[#35FF90] border border-[#35FF90]/25 text-[10px] font-mono py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl font-bold">
                KLIK UNTUK MASUK DISCORD KAMI!
              </div>
              <svg viewBox="0 0 127.14 96.36" className="w-6 h-6 fill-current">
                <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.5-5c1-.73,2-1.5,3-2.29a74.58,74.58,0,0,0,72.1,0c1,.79,2,1.56,3,2.29a68.43,68.43,0,0,1-10.5,5,77.7,77.7,0,0,0,6.63,10.85,105.73,105.73,0,0,0,31-18.83C129.23,48.12,122.9,25.26,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"/>
              </svg>
            </motion.a>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setShowDiscord(!showDiscord)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center justify-center w-14 h-14 rounded-full shadow-[0_4px_20px_rgba(53,255,144,0.4)] transition-all cursor-pointer group ${showDiscord ? 'bg-[#101935] border border-[#35FF90]/40 text-[#35FF90]' : 'bg-[#35FF90] hover:bg-[#35FF90]/95 text-[#020617]'}`}
          id="floating-discord-chat-bubble"
          title="Butuh Bantuan? Hubungi Kami!"
        >
          <MessageSquare className="w-6 h-6 transition-transform group-hover:scale-110" />
        </motion.button>
      </div>

    </section>
  );
}
