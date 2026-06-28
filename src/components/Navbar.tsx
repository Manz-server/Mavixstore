import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, X, LogIn, LogOut, User as UserIcon, Wallet, LayoutGrid, Terminal, Shield, 
  PlusCircle, FileText, History as HistoryIcon, HelpCircle, LifeBuoy, Settings as SettingsIcon,
  Server as ServerIcon, Home
} from 'lucide-react';
import { User } from '../types';
import MavixLogo from './MavixLogo';

interface NavbarProps {
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onNavigate: (section: string) => void;
  activeSection: string;
}

export default function Navbar({
  currentUser,
  onOpenAuth,
  onLogout,
  onNavigate,
  activeSection
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (section: string) => {
    onNavigate(section);
    setIsMobileOpen(false);
  };

  // Helper to format currency
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  return (
    <>
      <header
        id="main-navbar"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#04091C]/80 backdrop-blur-md border-b border-white/5 py-4 shadow-lg'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo area */}
            <div 
              id="navbar-logo"
              onClick={() => handleLinkClick('home')} 
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="relative flex items-center justify-center w-10 h-10 transition-all group-hover:scale-105">
                {localStorage.getItem('mavix_logo_url') ? (
                  <img src={localStorage.getItem('mavix_logo_url')!} alt="Logo" className="w-10 h-10 object-contain rounded-lg" />
                ) : (
                  <MavixLogo className="w-10 h-10" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-display text-base font-extrabold tracking-wider text-white">
                  {localStorage.getItem('mavix_logo_name') || 'MAVIX STORE'}
                </span>
                <span className="text-[8px] font-mono tracking-widest text-[#A7B3D0] uppercase">
                  {localStorage.getItem('mavix_site_slogan') || 'MINECRAFT HOST'}
                </span>
              </div>
            </div>

            {/* Unified Menu Actions */}
            <div className="flex items-center gap-3">
              {currentUser && (
                <div id="logged-in-badge" className="hidden sm:flex items-center gap-3.5 bg-[#101935] border border-white/5 rounded-xl py-1.5 pl-3 pr-2.5 transition-all">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-white max-w-[120px] truncate leading-tight">
                      {currentUser.username}
                    </span>
                    <div className="flex items-center gap-1">
                      <Wallet className="w-3 h-3 text-[#35FF90]" />
                      <span className="text-[10px] font-mono text-[#35FF90] font-bold">
                        {formatIDR(currentUser.balance)}
                      </span>
                    </div>
                  </div>
                  
                  {currentUser.role === 'admin' ? (
                    <div 
                      id="role-indicator"
                      onClick={() => handleLinkClick('admin')}
                      className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 group cursor-pointer hover:bg-red-500/20 hover:scale-105 transition-all"
                      title="Admin Panel"
                    >
                      <Shield className="w-4 h-4" />
                    </div>
                  ) : (
                    <div 
                      id="role-indicator"
                      onClick={() => handleLinkClick('dashboard')}
                      className="p-1.5 rounded-lg bg-[#35FF90]/10 border border-[#35FF90]/25 text-[#35FF90] cursor-pointer hover:bg-[#35FF90]/20 transition-all"
                      title="User Level"
                    >
                      <UserIcon className="w-4 h-4" />
                    </div>
                  )}

                  <button
                    id="btn-nav-logout"
                    onClick={onLogout}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-[#A7B3D0] hover:text-white transition-colors"
                    title="Log Keluar"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Hamburger Button (Always Visible) */}
              <button
                id="btn-hamburger"
                onClick={() => setIsMobileOpen(true)}
                className="p-2.5 rounded-xl text-[#A7B3D0] hover:text-[#35FF90] hover:bg-white/5 border border-white/5 hover:border-[#35FF90]/30 transition-all cursor-pointer"
                title="Buka Menu"
                aria-expanded={isMobileOpen}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Slide-out Sidebar/Menu Overlay using framer-motion */}
      <AnimatePresence>
        {isMobileOpen && (
          <div id="sidebar-drawer-overlay" className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop with fade effect */}
            <motion.div
              id="sidebar-drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
              onClick={() => setIsMobileOpen(false)}
            />

            {/* Sidebar panel with slide from right effect */}
            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <motion.div
                id="sidebar-drawer-panel"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                className="w-screen max-w-xs sm:max-w-sm bg-[#0A0F24]/95 border-l border-white/10 text-white flex flex-col p-6 shadow-2xl relative h-full backdrop-blur-xl"
              >
                {/* Header inside Sidebar */}
                <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-5">
                  <div className="flex items-center gap-2.5">
                    {localStorage.getItem('mavix_logo_url') ? (
                      <img src={localStorage.getItem('mavix_logo_url')!} alt="Logo" className="w-8 h-8 object-contain rounded-lg" />
                    ) : (
                      <MavixLogo className="w-8 h-8" />
                    )}
                    <div className="flex flex-col">
                      <span className="font-display font-bold tracking-wider text-white text-sm">
                        {localStorage.getItem('mavix_logo_name') || 'MAVIX STORE'}
                      </span>
                      <span className="text-[8px] font-mono tracking-widest text-[#35FF90] uppercase">
                        {localStorage.getItem('mavix_site_slogan') || 'PREMIUM PANEL'}
                      </span>
                    </div>
                  </div>
                  <button
                    id="sidebar-drawer-close"
                    onClick={() => setIsMobileOpen(false)}
                    className="rounded-xl p-2 text-[#A7B3D0] hover:bg-white/5 hover:text-[#35FF90] border border-white/5 hover:border-[#35FF90]/20 transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* User Summary Section if Logged In */}
                {currentUser && (
                  <div id="sidebar-user-summary" className="mb-6 rounded-2xl bg-[#101935]/60 p-4 border border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#35FF90]/10 border border-[#35FF90]/30 flex items-center justify-center text-[#35FF90] font-bold text-sm">
                        {currentUser.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-white truncate leading-tight">{currentUser.username}</p>
                        <p className="text-[10px] text-[#A7B3D0] truncate mt-0.5">{currentUser.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-white/5 pt-2.5">
                      <span className="text-[10px] font-semibold text-[#A7B3D0] uppercase tracking-wider">Saldo</span>
                      <span className="text-xs font-mono font-bold text-[#35FF90]">{formatIDR(currentUser.balance)}</span>
                    </div>
                  </div>
                )}

                {/* Main Interactive Sidebar List Items */}
                <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                  {currentUser ? (
                    <>
                      <p className="text-[10px] font-bold text-[#A7B3D0] uppercase tracking-wider px-3 mb-2.5 block">Menu Utama</p>
                      
                      {/* 0. Home */}
                      <button
                        id="sb-link-home"
                        onClick={() => handleLinkClick('home')}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                          activeSection === 'home' ? 'text-[#35FF90] bg-[#35FF90]/10 border border-[#35FF90]/20' : 'text-[#A7B3D0] hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <Home className="w-4 h-4 text-[#35FF90]" />
                        <span>Home</span>
                      </button>

                      {/* 1. Dashboard */}
                      <button
                        id="sb-link-dashboard"
                        onClick={() => handleLinkClick('dashboard')}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                          activeSection === 'dashboard' ? 'text-[#35FF90] bg-[#35FF90]/10 border border-[#35FF90]/20' : 'text-[#A7B3D0] hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <LayoutGrid className="w-4 h-4 text-[#35FF90]" />
                        <span>Dashboard</span>
                      </button>

                      {/* 2. Hosting */}
                      <button
                        id="sb-link-hosting"
                        onClick={() => handleLinkClick('hosting')}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                          activeSection === 'hosting' ? 'text-[#35FF90] bg-[#35FF90]/10 border border-[#35FF90]/20' : 'text-[#A7B3D0] hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <PlusCircle className="w-4 h-4 text-[#35FF90]" />
                        <span>Hosting</span>
                      </button>

                      {/* 3. My Servers */}
                      <button
                        id="sb-link-servers"
                        onClick={() => handleLinkClick('dash-servers')}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                          activeSection === 'dashboard' && window.location.hash.includes('servers') ? 'text-[#35FF90] bg-[#35FF90]/10 border border-[#35FF90]/20' : 'text-[#A7B3D0] hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <ServerIcon className="w-4 h-4 text-[#35FF90]" />
                        <span>My Servers</span>
                      </button>

                      {/* 4. Top Up Saldo */}
                      <button
                        id="sb-link-topup"
                        onClick={() => handleLinkClick('dash-topup')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-xl text-[#A7B3D0] hover:text-white hover:bg-white/5 border border-transparent transition-all cursor-pointer"
                      >
                        <Wallet className="w-4 h-4 text-[#35FF90]" />
                        <span>Top Up Saldo</span>
                      </button>

                      {/* 5. Invoice */}
                      <button
                        id="sb-link-invoice"
                        onClick={() => handleLinkClick('dash-invoice')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-xl text-[#A7B3D0] hover:text-white hover:bg-white/5 border border-transparent transition-all cursor-pointer"
                      >
                        <FileText className="w-4 h-4 text-[#35FF90]" />
                        <span>Invoice</span>
                      </button>

                      {/* 6. Riwayat */}
                      <button
                        id="sb-link-riwayat"
                        onClick={() => handleLinkClick('dash-riwayat')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-xl text-[#A7B3D0] hover:text-white hover:bg-white/5 border border-transparent transition-all cursor-pointer"
                      >
                        <HistoryIcon className="w-4 h-4 text-[#35FF90]" />
                        <span>Riwayat</span>
                      </button>

                      {/* 7. Knowledge Base */}
                      <button
                        id="sb-link-kb"
                        onClick={() => handleLinkClick('dash-kb')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-xl text-[#A7B3D0] hover:text-white hover:bg-white/5 border border-transparent transition-all cursor-pointer"
                      >
                        <HelpCircle className="w-4 h-4 text-[#35FF90]" />
                        <span>Knowledge Base</span>
                      </button>

                      {/* 8. Support Ticket */}
                      <button
                        id="sb-link-ticket"
                        onClick={() => handleLinkClick('dash-ticket')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-xl text-[#A7B3D0] hover:text-white hover:bg-white/5 border border-transparent transition-all cursor-pointer"
                      >
                        <LifeBuoy className="w-4 h-4 text-[#35FF90]" />
                        <span>Support Ticket</span>
                      </button>

                      {/* 9. Profile */}
                      <button
                        id="sb-link-profile"
                        onClick={() => handleLinkClick('dash-profile')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-xl text-[#A7B3D0] hover:text-white hover:bg-white/5 border border-transparent transition-all cursor-pointer"
                      >
                        <UserIcon className="w-4 h-4 text-[#35FF90]" />
                        <span>Profile</span>
                      </button>

                      {/* 10. Settings */}
                      <button
                        id="sb-link-settings"
                        onClick={() => handleLinkClick('dash-settings')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-xl text-[#A7B3D0] hover:text-white hover:bg-white/5 border border-transparent transition-all cursor-pointer"
                      >
                        <SettingsIcon className="w-4 h-4 text-[#35FF90]" />
                        <span>Settings</span>
                      </button>

                      {/* 11. Admin Panel (Always visible as secure gateway) */}
                      <div className="pt-2 border-t border-white/5 mt-2">
                        <button
                          id="sb-link-admin"
                          onClick={() => handleLinkClick('admin')}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                        >
                          <Shield className="w-4 h-4 text-red-400" />
                          <span>Admin Panel</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-[10px] font-bold text-[#A7B3D0] uppercase tracking-wider px-3 mb-2.5 block">Mavix Guest Menu</p>
                      
                      <button
                        id="sb-nav-home"
                        onClick={() => handleLinkClick('home')}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                          activeSection === 'home' ? 'text-[#35FF90] bg-[#35FF90]/10 border border-[#35FF90]/20' : 'text-[#A7B3D0] hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <LayoutGrid className="w-4 h-4 text-[#35FF90]" />
                        <span>Home</span>
                      </button>

                      <button
                        id="sb-nav-hosting"
                        onClick={() => handleLinkClick('hosting')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-xl text-[#A7B3D0] hover:text-white hover:bg-white/5 border border-transparent transition-all cursor-pointer"
                      >
                        <PlusCircle className="w-4 h-4 text-[#35FF90]" />
                        <span>Hosting Packages</span>
                      </button>

                      <button
                        id="sb-nav-pricing"
                        onClick={() => handleLinkClick('pricing')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-xl text-[#A7B3D0] hover:text-white hover:bg-white/5 border border-transparent transition-all cursor-pointer"
                      >
                        <Wallet className="w-4 h-4 text-[#35FF90]" />
                        <span>Pricing Table</span>
                      </button>

                      <button
                        id="sb-nav-status"
                        onClick={() => handleLinkClick('status')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-xl text-[#A7B3D0] hover:text-white hover:bg-white/5 border border-transparent transition-all cursor-pointer"
                      >
                        <Terminal className="w-4 h-4 text-[#35FF90]" />
                        <span>Server Status</span>
                      </button>

                      <div className="pt-4 border-t border-white/5 mt-4 space-y-2">
                        <button
                          id="sb-btn-login"
                          onClick={() => { setIsMobileOpen(false); onOpenAuth(); }}
                          className="w-full text-center py-2.5 border border-[#35FF90]/30 rounded-xl text-xs font-bold text-[#35FF90] hover:bg-[#35FF90]/10 transition-all cursor-pointer"
                        >
                          LOG IN / REGISTER (BUYER)
                        </button>
                        
                        <button
                          id="sb-btn-admin-gateway"
                          onClick={() => handleLinkClick('admin')}
                          className="w-full text-center py-2.5 border border-red-500/30 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Shield className="w-4 h-4" />
                          <span>ADMIN PANEL</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* 12. Logout / Auth Action footer */}
                {currentUser && (
                  <div className="pt-4 border-t border-white/10 mt-4">
                    <button
                      id="sb-btn-logout"
                      onClick={() => { setIsMobileOpen(false); onLogout(); }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout dari Mavix
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
