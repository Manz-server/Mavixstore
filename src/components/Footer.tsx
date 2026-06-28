import { Terminal, Github, Heart } from 'lucide-react';
import MavixLogo from './MavixLogo';

interface FooterProps {
  onNavigate: (section: string) => void;
  onOpenAuth: () => void;
  isLoggedIn: boolean;
}

export default function Footer({ onNavigate, onOpenAuth, isLoggedIn }: FooterProps) {
  
  const handleLinkClick = (section: string) => {
    if (section.startsWith('dash-') && !isLoggedIn) {
      onOpenAuth();
    } else {
      onNavigate(section);
    }
  };

  return (
    <footer id="main-footer" className="bg-[#04091C] border-t border-white/5 pt-16 pb-8 relative overflow-hidden">
      {/* Visual background lights */}
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-emerald-500/3 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12">
          
          {/* Column 1: Brand block */}
          <div className="md:col-span-5 flex flex-col items-start text-left">
            <div className="flex items-center gap-2.5 mb-4 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="flex items-center justify-center w-8 h-8">
                {localStorage.getItem('mavix_logo_url') ? (
                  <img src={localStorage.getItem('mavix_logo_url')!} alt="Logo" className="w-8 h-8 object-contain rounded-lg" />
                ) : (
                  <MavixLogo className="w-8 h-8" />
                )}
              </div>
              <span className="font-display text-base font-bold tracking-wider text-white">
                {localStorage.getItem('mavix_logo_name') || 'MAVIX STORE'}
              </span>
            </div>
            <p className="text-xs text-[#A7B3D0] max-w-sm leading-relaxed font-light mb-6">
              {localStorage.getItem('mavix_site_slogan') || 'Premium Minecraft Hosting & Game Servers'} - Penyedia hosting Minecraft premium dengan performa tinggi, latency sangat rendah, dan sistem uptime ultra stabil untuk pengalaman bermain game idaman Anda.
            </p>
            <div className="flex gap-3 text-[10px] font-mono">
              <a 
                href={localStorage.getItem('mavix_discord_link') || 'https://discord.gg/mavixstore'} 
                target="_blank" 
                rel="noreferrer" 
                className="px-2.5 py-1.5 rounded-lg bg-[#101935] border border-white/5 flex items-center justify-center text-[#A7B3D0] hover:text-[#35FF90] hover:border-[#35FF90]/40 transition-all"
              >
                Discord
              </a>
              <a 
                href={localStorage.getItem('mavix_telegram_link') || 'https://t.me/mavixstore'} 
                target="_blank" 
                rel="noreferrer" 
                className="px-2.5 py-1.5 rounded-lg bg-[#101935] border border-white/5 flex items-center justify-center text-[#A7B3D0] hover:text-[#35FF90] hover:border-[#35FF90]/40 transition-all"
              >
                Telegram
              </a>
              <a 
                href={localStorage.getItem('mavix_whatsapp_link') || 'https://wa.me/6281234567890'} 
                target="_blank" 
                rel="noreferrer" 
                className="px-2.5 py-1.5 rounded-lg bg-[#101935] border border-white/5 flex items-center justify-center text-[#A7B3D0] hover:text-[#35FF90] hover:border-[#35FF90]/40 transition-all"
              >
                WhatsApp
              </a>
            </div>
          </div>

          {/* Column 2: Navigasi */}
          <div className="md:col-span-2 flex flex-col items-start text-left">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4 border-l-2 border-[#35FF90] pl-2">
              Navigasi
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A7B3D0]">
              <li>
                <button 
                  id="foot-link-home"
                  onClick={() => handleLinkClick('home')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  id="foot-link-hosting"
                  onClick={() => handleLinkClick('hosting')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Hosting
                </button>
              </li>
              <li>
                <button 
                  id="foot-link-dash"
                  onClick={() => handleLinkClick(isLoggedIn ? 'dashboard' : 'login')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button 
                  id="foot-link-status"
                  onClick={() => handleLinkClick('status')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Status
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="md:col-span-2 flex flex-col items-start text-left">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4 border-l-2 border-[#35FF90] pl-2">
              Support
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A7B3D0]">
              <li>
                <a href="#discord" className="hover:text-white transition-colors">
                  Discord Community
                </a>
              </li>
              <li>
                <button 
                  id="foot-link-kb"
                  onClick={() => handleLinkClick('dash-kb')} 
                  className="hover:text-white transition-colors text-left"
                >
                  Knowledge Base
                </button>
              </li>
              <li>
                <button 
                  id="foot-link-ticket"
                  onClick={() => handleLinkClick('dash-ticket')} 
                  className="hover:text-white transition-colors text-left"
                >
                  Ticket Support
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="md:col-span-3 flex flex-col items-start text-left font-sans">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4 border-l-2 border-[#35FF90] pl-2">
              Legal
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A7B3D0]">
              <li>
                <a href="#tos" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright segment */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-gray-500 font-mono tracking-wide">
            {localStorage.getItem('mavix_footer_text') || '© 2026 MAVIX STORE. Seluruh hak cipta dilindungi undang-undang.'}
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-mono">
            <span>Server region: Indonesia (Jakarta) & HK Core</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
