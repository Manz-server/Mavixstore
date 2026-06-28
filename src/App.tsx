import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, ShieldCheck, Zap, Activity, Users, AlertCircle, Sparkles, Check, 
  Smartphone, Monitor, RefreshCw, Layers, Wrench, Shield, ArrowLeftRight, X, Lock
} from 'lucide-react';

import { User, UserServer, Invoice, SupportTicket, Announcement, MinecraftPackage } from './types';
import { 
  INITIAL_USERS, INITIAL_SERVERS, INITIAL_PACKAGES, INITIAL_INVOICES, 
  INITIAL_TICKETS, INITIAL_ANNOUNCEMENTS 
} from './data/initialData';

// Modular Web Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import AuthPopup from './components/AuthPopup';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import MavixLogo from './components/MavixLogo';
import HostingPlans from './components/HostingPlans';

export default function App() {
  // --- CORE CONTEXT APP LAYOUT SYSTEM STATES ---
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [servers, setServers] = useState<UserServer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [packages, setPackages] = useState<MinecraftPackage[]>([]);

  // Navigation states
  const [activeSection, setActiveSection] = useState<string>('home'); // 'home' | 'status' | 'dashboard' | 'admin' | 'hosting' | 'pricing'
  const [activeSubTab, setActiveSubTab] = useState<string>('main'); // Dashboard screens: 'main' | 'servers' | 'order' | ...
  const [checkoutPrefill, setCheckoutPrefill] = useState<{ pkg: MinecraftPackage; ram: number } | null>(null);

  // Modals overlays toggles
  const [authOpen, setAuthOpen] = useState<boolean>(false);
  const [promptMessage, setPromptMessage] = useState<string>(''); // Guest try checkout prompt banner info
  const [loadingScreen, setLoadingScreen] = useState<boolean>(true);
  const [devHelperOpen, setDevHelperOpen] = useState<boolean>(false);

  // Admin Portal Secure Gateway states
  const [adminGateOpen, setAdminGateOpen] = useState<boolean>(false);
  const [adminGateUsername, setAdminGateUsername] = useState<string>('');
  const [adminGatePassword, setAdminGatePassword] = useState<string>('');
  const [adminGateError, setAdminGateError] = useState<string>('');
  const [adminGateSuccess, setAdminGateSuccess] = useState<string>('');

  // --- STATE SYNCHRONIZER MOUNTING ---
  useEffect(() => {
    // Load local storage or default data
    const itemUsers = localStorage.getItem('mvx_users');
    const itemServers = localStorage.getItem('mvx_servers');
    const itemInvoices = localStorage.getItem('mvx_invoices');
    const itemTickets = localStorage.getItem('mvx_tickets');
    const itemAnnouncements = localStorage.getItem('mvx_announcements');
    const itemPackages = localStorage.getItem('mvx_packages');

    let loadedUsers = itemUsers ? JSON.parse(itemUsers) : INITIAL_USERS;
    if (
      !Array.isArray(loadedUsers) || 
      loadedUsers.length === 0 || 
      !loadedUsers.some((u: User) => u.role === 'admin') ||
      loadedUsers.some((u: User) => u.role === 'admin' && u.username === 'admin')
    ) {
      loadedUsers = INITIAL_USERS;
      localStorage.setItem('mvx_users', JSON.stringify(INITIAL_USERS));
    }
    const loadedServers = itemServers ? JSON.parse(itemServers) : INITIAL_SERVERS;
    const loadedInvoices = itemInvoices ? JSON.parse(itemInvoices) : INITIAL_INVOICES;
    const loadedTickets = itemTickets ? JSON.parse(itemTickets) : INITIAL_TICKETS;
    const loadedAnnouncements = itemAnnouncements ? JSON.parse(itemAnnouncements) : INITIAL_ANNOUNCEMENTS;
    const loadedPackages = itemPackages ? JSON.parse(itemPackages) : INITIAL_PACKAGES;

    setUsers(loadedUsers);
    setServers(loadedServers);
    setInvoices(loadedInvoices);
    setTickets(loadedTickets);
    setAnnouncements(loadedAnnouncements);
    setPackages(loadedPackages);

    // Save defaults to storage if missing
    if (!itemServers) localStorage.setItem('mvx_servers', JSON.stringify(INITIAL_SERVERS));
    if (!itemInvoices) localStorage.setItem('mvx_invoices', JSON.stringify(INITIAL_INVOICES));
    if (!itemTickets) localStorage.setItem('mvx_tickets', JSON.stringify(INITIAL_TICKETS));
    if (!itemAnnouncements) localStorage.setItem('mvx_announcements', JSON.stringify(INITIAL_ANNOUNCEMENTS));
    if (!itemPackages) localStorage.setItem('mvx_packages', JSON.stringify(INITIAL_PACKAGES));

    // Session recovery from JWT Token key
    const sessionToken = localStorage.getItem('mavix_session_token');
    const loggedUserId = localStorage.getItem('mavix_logged_user_id');
    if (sessionToken && loggedUserId) {
      const matched = loadedUsers.find((u: User) => u.id === loggedUserId);
      if (matched) {
        setCurrentUser(matched);
      }
    }

    // Simulate premium loading sequence
    const timer = setTimeout(() => {
      setLoadingScreen(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Update current user details in App whenever user collection changes to avoid stale balance values
  useEffect(() => {
    if (currentUser) {
      const fresh = users.find(u => u.id === currentUser.id);
      if (fresh) {
        setCurrentUser(fresh);
      }
    }
  }, [users]);

  // General persistence sync wrapper helpers
  const syncUsers = (next: User[]) => {
    setUsers(next);
    localStorage.setItem('mvx_users', JSON.stringify(next));
  };

  const syncServers = (next: UserServer[]) => {
    setServers(next);
    localStorage.setItem('mvx_servers', JSON.stringify(next));
  };

  const syncInvoices = (next: Invoice[]) => {
    setInvoices(next);
    localStorage.setItem('mvx_invoices', JSON.stringify(next));
  };

  const syncTickets = (next: SupportTicket[]) => {
    setTickets(next);
    localStorage.setItem('mvx_tickets', JSON.stringify(next));
  };

  const syncAnnouncements = (next: Announcement[]) => {
    setAnnouncements(next);
    localStorage.setItem('mvx_announcements', JSON.stringify(next));
  };

  const syncPackages = (next: MinecraftPackage[]) => {
    setPackages(next);
    localStorage.setItem('mvx_packages', JSON.stringify(next));
  };

  // --- ACTIONS LOGICS HANDLERS ---
  
  const handleLoginSuccess = (userProfile: User) => {
    setCurrentUser(userProfile);
    setAuthOpen(false);
    setPromptMessage('');
    setActiveSection('dashboard');
    setActiveSubTab('main');
  };

  const handleRegisterUser = (newUser: User) => {
    const nextUsers = [...users, newUser];
    syncUsers(nextUsers);
  };

  const handleLogout = () => {
    localStorage.removeItem('mavix_session_token');
    localStorage.removeItem('mavix_logged_user_id');
    setCurrentUser(null);
    setActiveSection('home');
    setActiveSubTab('main');
  };

  const handleQuickSwitch = (role: 'user' | 'admin') => {
    const targetEmail = role === 'admin' ? 'admin@mavix.store' : 'user@mavix.store';
    const foundUser = users.find(u => u.email === targetEmail);
    if (foundUser) {
      const mockToken = `mvx_jwt_${btoa(foundUser.email)}_${Date.now()}`;
      localStorage.setItem('mavix_session_token', mockToken);
      localStorage.setItem('mavix_logged_user_id', foundUser.id);
      setCurrentUser(foundUser);
      setPromptMessage('');
      setAuthOpen(false);
      
      if (role === 'admin') {
        setActiveSection('admin');
      } else {
        setActiveSection('dashboard');
        setActiveSubTab('main');
      }
    }
  };

  const handleNavigate = (path: string) => {
    setPromptMessage('');
    if (path === 'home') {
      setActiveSection('home');
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (path === 'hosting' || path === 'pricing') {
      setActiveSection('hosting');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (path === 'status') {
      setActiveSection('status');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (path === 'dashboard' || path.startsWith('dash-')) {
      if (!currentUser) {
        setPromptMessage('Anda harus memiliki akun untuk mengakses Dashboard member.');
        setAuthOpen(true);
        return;
      }
      setActiveSection('dashboard');
      if (path.startsWith('dash-')) {
        const keyword = path.replace('dash-', '');
        setActiveSubTab(keyword);
      } else {
        setActiveSubTab('main');
      }
    } else if (path === 'admin') {
      if (currentUser && currentUser.role === 'admin' && currentUser.username.toLowerCase() === 'manz') {
        setActiveSection('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setAdminGateUsername('');
        setAdminGatePassword('');
        setAdminGateError('');
        setAdminGateSuccess('');
        setAdminGateOpen(true);
      }
    }
  };

  const handleAdminGateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminGateError('');
    setAdminGateSuccess('');

    if (!adminGateUsername || !adminGatePassword) {
      setAdminGateError('Harap isi semua kolom.');
      return;
    }

    if (adminGateUsername.trim().toLowerCase() === 'manz' && adminGatePassword === '111013') {
      // Find matching user in state list or fallback to create one
      let matchedAdmin = users.find(u => u.username.toLowerCase() === 'manz');
      if (!matchedAdmin) {
        matchedAdmin = {
          id: 'u-admin',
          username: 'manz',
          email: 'admin@mavix.store',
          role: 'admin',
          balance: 10000000,
          registeredAt: new Date().toISOString(),
          status: 'active',
          firstName: 'Mavix',
          lastName: 'Admin',
          phone: '08123456789',
          discord: 'admin_discord',
          password: '4826e7976c8363e903c100262b8f5a184aa25f56ca18ddcb232276b8fa61fb75' // Hash of "111013"
        };
        syncUsers([...users, matchedAdmin]);
      } else {
        // update password hash or details if mismatch
        if (matchedAdmin.password !== '4826e7976c8363e903c100262b8f5a184aa25f56ca18ddcb232276b8fa61fb75' || matchedAdmin.role !== 'admin') {
          const updatedAdmin = {
            ...matchedAdmin,
            role: 'admin' as const,
            password: '4826e7976c8363e903c100262b8f5a184aa25f56ca18ddcb232276b8fa61fb75'
          };
          syncUsers(users.map(u => u.id === matchedAdmin!.id ? updatedAdmin : u));
          matchedAdmin = updatedAdmin;
        }
      }

      setAdminGateSuccess('Akses Admin valid! Membuka panel...');
      
      // Save session
      setCurrentUser(matchedAdmin);
      localStorage.setItem('mavix_session_token', 'session-admin-' + Date.now());
      localStorage.setItem('mavix_logged_user_id', matchedAdmin.id);

      setTimeout(() => {
        setAdminGateOpen(false);
        setActiveSection('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1000);
    } else {
      setAdminGateError('Kredensial Admin Salah!');
    }
  };

  // Auto redirect for Access Denied if non-admin tries to access /admin
  useEffect(() => {
    if (activeSection === 'admin') {
      if (!currentUser || currentUser.role !== 'admin') {
        const timer = setTimeout(() => {
          handleNavigate('dashboard');
        }, 4000);
        return () => clearTimeout(timer);
      }
    }
  }, [activeSection, currentUser]);

  // Synchronize Favicon, Page Title, and background dynamically from Branding configs
  useEffect(() => {
    const siteTitle = localStorage.getItem('mavix_site_name') || 'Mavix Store';
    const siteSloganText = localStorage.getItem('mavix_site_slogan') || 'Premium Minecraft Hosting & Game Servers';
    document.title = `${siteTitle} | ${siteSloganText}`;

    const faviconUrl = localStorage.getItem('mavix_favicon_url');
    if (faviconUrl) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = faviconUrl;
    }
  }, [activeSection]);

  // Handle "Pesan Sekarang" action triggered from pricing cards
  const handlePricingOrderClick = (pkg: MinecraftPackage, selectedRam: number) => {
    if (!currentUser) {
      setPromptMessage('Anda harus memiliki akun untuk melakukan pemesanan.');
      setAuthOpen(true);
      return;
    }

    setCheckoutPrefill({ pkg, ram: selectedRam });
    setActiveSection('dashboard');
    setActiveSubTab('checkout');
  };

  // User buys server using dynamic Store Balances
  const handlePurchaseServer = (
    serverName: string, 
    pkgId: 'standar' | 'medium' | 'prime', 
    ram: number,
    customCpu?: string,
    customRegion?: string,
    customStorage?: string,
    eggSoftware?: string,
    durationMonths: number = 1
  ) => {
    if (!currentUser) return { success: false, error: 'User tidak dalam session.' };

    const selectedPkg = packages.find(p => p.id === pkgId);
    if (!selectedPkg) return { success: false, error: 'Paket hardware salah.' };

    if (selectedPkg.stock <= 0) {
      return { success: false, error: 'Stok sewa server untuk pilihan ini sedang habis.' };
    }

    // Monthly base
    const totalCost = selectedPkg.price * ram;

    if (currentUser.balance < totalCost) {
      return { success: false, error: 'Saldo Anda tidak mencukupi. Silakan lakukan Top Up terlebih dahulu.' };
    }

    // 1. Debit User Balance
    const updatedUsers = users.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, balance: u.balance - totalCost };
      }
      return u;
    });
    syncUsers(updatedUsers);

    // 2. Decrease Stock
    const updatedPackages = packages.map(p => {
      if (p.id === pkgId) {
        return { ...p, stock: Math.max(0, p.stock - 1) };
      }
      return p;
    });
    syncPackages(updatedPackages);

    // 3. Create active Minecraft server instansi
    const globalUrl = localStorage.getItem('ptero_panel_url') || 'https://panel.mavix.store';
    let activeApiKey = '';
    let activeNodeId = '';
    let activeEggId = '';

    if (pkgId === 'standar') {
      activeApiKey = localStorage.getItem('ptero_lite_app_key') || 'ptla_lite_kX93jHlkas92FsaK92J1asdaK931';
      activeNodeId = localStorage.getItem('ptero_lite_node_id') || '1';
      activeEggId = localStorage.getItem('ptero_lite_egg_id') || '15';
    } else if (pkgId === 'medium') {
      activeApiKey = localStorage.getItem('ptero_medium_app_key') || 'ptla_medium_asd82Ksa02Fka82J1asd82F72';
      activeNodeId = localStorage.getItem('ptero_medium_node_id') || '2';
      activeEggId = localStorage.getItem('ptero_medium_egg_id') || '16';
    } else if (pkgId === 'prime') {
      activeApiKey = localStorage.getItem('ptero_prime_app_key') || 'ptla_prime_ksf02Kla72Fsa82J1asd92K182';
      activeNodeId = localStorage.getItem('ptero_prime_node_id') || '3';
      activeEggId = localStorage.getItem('ptero_prime_egg_id') || '17';
    }

    // Dynamic Multi-Egg resolution
    const softwares = ['Paper', 'Purpur', 'Spigot', 'Bukkit', 'Vanilla', 'Forge', 'Fabric', 'Pocket Edition (Bedrock)'];
    const softwareIdx = softwares.indexOf(eggSoftware || 'Paper');
    const eggList = activeEggId.split(',').map(s => s.trim()).filter(s => s !== '');
    let resolvedEggId = '15';
    if (eggList.length > 0) {
      if (softwareIdx !== -1) {
        resolvedEggId = eggList[softwareIdx % eggList.length];
      } else {
        resolvedEggId = eggList[0];
      }
    }

    const newServer: UserServer = {
      id: `srv-${Math.floor(100 + Math.random() * 900)}`,
      userId: currentUser.id,
      name: serverName,
      packageId: pkgId,
      packageName: `${selectedPkg.name} (${eggSoftware || 'Java Edition'})`,
      ram: ram,
      cpu: `${100 + (ram - 1) * 50}% CPU`,
      region: customRegion || selectedPkg.region,
      status: 'online',
      ipAddress: `${pkgId === 'standar' ? '158.247.165.' : '103.142.12.'}${Math.floor(1 + Math.random() * 254)}:25565`,
      createdAt: new Date().toISOString(),
      expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      pteroPanelUrl: globalUrl,
      pteroApiKey: activeApiKey,
      pteroNodeId: activeNodeId,
      pteroEggId: resolvedEggId
    };
    syncServers([...servers, newServer]);

    // 4. Record Paid Invoice Billing Statement
    const newInvoice: Invoice = {
      id: `INV-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: currentUser.id,
      userEmail: currentUser.email,
      type: 'hosting',
      description: `Sewa ${selectedPkg.name} - ${ram}GB RAM, ${100 + (ram - 1) * 50}% CPU, ${ram * 2}GB SSD (${serverName}) - Durasi 1 Bulan`,
      amount: totalCost,
      status: 'paid',
      createdAt: new Date().toISOString()
    };
    syncInvoices([...invoices, newInvoice]);

    return { success: true };
  };

  // Simulate Add balance via Top Up form
  const handleAddBalanceInApp = (amount: number, method: string) => {
    if (!currentUser) return;

    // Generate Invoice as pending (needs admin approval)
    const newInvoice: Invoice = {
      id: `INV-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: currentUser.id,
      userEmail: currentUser.email,
      type: 'topup',
      description: `Top Up Saldo via otomatis ${method}`,
      amount: amount,
      status: 'pending',
      method: method,
      createdAt: new Date().toISOString()
    };
    syncInvoices([...invoices, newInvoice]);
  };

  // Restart server flow
  const handleRestartServer = (serverId: string) => {
    // Stage 1: Restarting
    const updated = servers.map(s => {
      if (s.id === serverId) return { ...s, status: 'restarting' as const };
      return s;
    });
    syncServers(updated);

    // Stage 2: Back online
    setTimeout(() => {
      const next = servers.map(s => {
        if (s.id === serverId) return { ...s, status: 'online' as const };
        return s;
      });
      syncServers(next);
      alert('Minecraft server restarted successfully!');
    }, 2500);
  };

  // Extend server validity
  const handleExtendServer = (serverId: string) => {
    const srv = servers.find(s => s.id === serverId);
    if (!srv || !currentUser) return;

    const pkg = packages.find(p => p.id === srv.packageId);
    if (!pkg) return;

    const Cost = pkg.price * srv.ram;
    if (currentUser.balance < Cost) {
      alert(`Saldo Store tidak mencukupi. Perlu Rp ${Cost - currentUser.balance} untuk perpanjangan sewa.`);
      handleNavigate('dash-topup');
      return;
    }

    if (confirm(`Apakah Anda menyetujui pendebetan Rp ${Cost} untuk perpanjangan sewa server ${srv.name} selama 30 hari?`)) {
      // Debit
      const nextUsers = users.map(u => {
        if (u.id === currentUser.id) return { ...u, balance: u.balance - Cost };
        return u;
      });
      syncUsers(nextUsers);

      // Extend date
      const nextServers = servers.map(s => {
        if (s.id === serverId) {
          const expires = new Date(s.expiredAt).getTime() + 30 * 24 * 60 * 60 * 1000;
          return { ...s, expiredAt: new Date(expires).toISOString() };
        }
        return s;
      });
      syncServers(nextServers);

      // Invoice billing
      const newInvoice: Invoice = {
        id: `INV-${Math.floor(10000 + Math.random() * 90000)}`,
        userId: currentUser.id,
        userEmail: currentUser.email,
        type: 'hosting',
        description: `Perpanjangan sewa server ${srv.name} (${srv.packageName} - ${srv.ram}GB RAM)`,
        amount: Cost,
        status: 'paid',
        createdAt: new Date().toISOString()
      };
      syncInvoices([...invoices, newInvoice]);

      alert('Server berhasil diperpanjang 30 hari!');
    }
  };

  // Post support ticket concern
  const handleNewTicketInApp = (subject: string, message: string) => {
    if (!currentUser) return;
    const newTck: SupportTicket = {
      id: `TCK-${Math.floor(10000 + Math.random() * 91000)}`,
      userId: currentUser.id,
      userEmail: currentUser.email,
      subject: subject,
      message: message,
      status: 'open',
      responses: [],
      createdAt: new Date().toISOString()
    };
    syncTickets([...tickets, newTck]);
  };

  // Client Chat Reply Ticket
  const handleReplyTicketInApp = (ticketId: string, replyMessage: string) => {
    if (!currentUser) return;
    const updated = tickets.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'open' as const, // goes back to open if standard user answers
          responses: [
            ...t.responses,
            {
              id: `resp-${Date.now()}`,
              sender: 'user' as const,
              senderName: currentUser.username,
              message: replyMessage,
              createdAt: new Date().toISOString()
            }
          ]
        };
      }
      return t;
    });
    syncTickets(updated);
  };

  const handleUpdateUserProfileInApp = (nextName: string, nextEmail: string) => {
    if (!currentUser) return;
    const updated = users.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, username: nextName, email: nextEmail };
      }
      return u;
    });
    syncUsers(updated);
  };

  // List filtered collections
  const filteredUserServers = servers.filter(s => currentUser ? s.userId === currentUser.id : false);
  const filteredUserInvoices = invoices.filter(i => currentUser ? i.userId === currentUser.id : false);
  const filteredUserTickets = tickets.filter(t => currentUser ? t.userId === currentUser.id : false);

  return (
    <div id="app-wrapper" className="min-h-screen bg-[#020617] text-white flex flex-col justify-between selection:bg-[#35FF90] selection:text-[#020617]">
      
      {/* 1. LOADING SCREEN TRANSITION */}
      <AnimatePresence>
        {loadingScreen && (
          <motion.div
            id="premium-loader"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 bg-[#020617] flex flex-col items-center justify-center text-center"
          >
            <div className="relative mb-6 flex items-center justify-center">
              <div className="absolute w-16 h-16 rounded-2xl border-2 border-dashed border-[#35FF90] animate-spin" />
              <MavixLogo className="w-8 h-8 animate-pulse" />
            </div>
            <h2 className="font-display text-lg font-extrabold tracking-wider text-white">MAVIX <span className="text-[#35FF90]">STORE</span></h2>
            <p className="text-[10px] font-mono uppercase tracking-widest text-shadow text-[#35FF90] mt-2">Loading Premium Nodes...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STICKY TOP TICKER BANNER */}
      <div id="top-promo-ticker" className="bg-[#101935] border-b border-white/5 py-2.5 text-center px-4 relative z-40 relative">
        <p className="text-[10px] font-sans tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-300 to-[#35FF90] font-bold flex items-center justify-center gap-1.5 leading-none">
          <Sparkles className="w-3.5 h-3.5 text-[#35FF90]" />
          PROMO AKHIR PEKAN: Dapatkan diskon 15% untuk sewa Ryzen 9 Prime Node minggu ini!
        </p>
      </div>

      {/* 2. MAIN NAVIGATION */}
      <Navbar
        currentUser={currentUser}
        onOpenAuth={() => { setPromptMessage(''); setAuthOpen(true); }}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        activeSection={activeSection}
      />

      {/* 3. DYNAMIC PAGES VIEW */}
      <main id="app-main-content" className="flex-1">
        <AnimatePresence mode="wait">
          
          {/* VIEW A: HOME LANDING PAGE */}
          {activeSection === 'home' && (
            <motion.div
              key="home-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Hero header */}
              <Hero
                onStartClick={() => handleNavigate('pricing')}
                onViewPackagesClick={() => handleNavigate('pricing')}
              />

              {/* Ten world-class features */}
              <Features />

              {/* Pricing catalogs */}
              <Pricing
                packages={packages}
                onOrderClick={handlePricingOrderClick}
                currentUser={currentUser}
                onPurchaseServer={handlePurchaseServer}
                onNavigate={handleNavigate}
              />

              {/* Slider automatic feedback testimonials */}
              <Testimonials />

              {/* FAQ Accordions */}
              <FAQ />
            </motion.div>
          )}

          {/* VIEW B-2: DEDICATED HOSTING PLANS PAGE */}
          {activeSection === 'hosting' && (
            <motion.div
              key="hosting-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <HostingPlans
                packages={packages}
                currentUser={currentUser}
                onOrderClick={handlePricingOrderClick}
                onOpenAuth={() => {
                  setPromptMessage('Anda harus memiliki akun untuk melakukan pemesanan.');
                  setAuthOpen(true);
                }}
              />
            </motion.div>
          )}

          {/* VIEW B: SYSTEM STATUS PAGE */}
          {activeSection === 'status' && (
            <motion.div
              key="status-page"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-32 px-4 max-w-4xl mx-auto text-left min-h-screen"
            >
              <div className="pb-4 border-b border-white/10 mb-8">
                <span className="text-[10px] font-mono tracking-widest text-[#35FF90] uppercase font-bold">Infrastruktur Real-Time</span>
                <h1 className="text-3xl font-black font-display text-white mt-1">SISTEM MONITOR STATUS</h1>
                <p className="text-xs text-[#A7B3D0] font-light mt-1">Pantau kehandalan dan latency node fisik kami langsung dari Datacenter.</p>
              </div>

              {/* Nodes grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="bg-[#101935] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-none">Datacenter Indonesia (Jakarta-Cyber)</h3>
                      <span className="text-[10px] text-gray-500 font-mono mt-2 block">PING: 4ms | AMD EPYC 7351 Node</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 text-[9px] font-mono bg-[#35FF90]/15 text-[#35FF90] font-bold rounded-lg uppercase">Online</span>
                    <span className="text-[10px] text-[#A7B3D0] font-mono block mt-2">Uptime 99.98%</span>
                  </div>
                </div>

                <div className="bg-[#101935] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-none">Datacenter Hongkong Core Node</h3>
                      <span className="text-[10px] text-gray-500 font-mono mt-2 block">PING: 24ms | Xeon Platinum Node</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 text-[9px] font-mono bg-[#35FF90]/15 text-[#35FF90] font-bold rounded-lg uppercase">Online</span>
                    <span className="text-[10px] text-[#A7B3D0] font-mono block mt-2">Uptime 99.94%</span>
                  </div>
                </div>

                <div className="bg-[#101935] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-none">Mitigasi DDoS Protection Gateway</h3>
                      <span className="text-[10px] text-gray-500 font-mono mt-2 block">Kapasitas Maks: 4.2 Tbps / Edge</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 text-[9px] font-mono bg-[#35FF90]/15 text-[#35FF90] font-bold rounded-lg uppercase">Aktif</span>
                    <span className="text-[10px] text-[#A7B3D0] font-mono block mt-2">Uptime 100%</span>
                  </div>
                </div>

                <div className="bg-[#101935] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-none">Billing & Automated API Deployer</h3>
                      <span className="text-[10px] text-gray-500 font-mono mt-2 block">Pterodactyl Daemon Engine v1.12</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 text-[9px] font-mono bg-[#35FF90]/15 text-[#35FF90] font-bold rounded-lg uppercase">Online</span>
                    <span className="text-[10px] text-[#A7B3D0] font-mono block mt-2">Uptime 100%</span>
                  </div>
                </div>

              </div>

              <div className="mt-8 p-6 rounded-2xl border border-white/5 bg-[#101935]/40 text-xs font-light text-[#A7B3D0] leading-relaxed">
                Kami berkomitmen menjaga kestabilan latency dan memitigasi anomali ping secara konstan. Apabila Anda mengalami kendala konektivitas luar biasa, tim administrator kami bersedia dihubungi via Support Ticket 1x24 jam untuk pemindahan alokasi IP port.
              </div>
            </motion.div>
          )}

          {/* VIEW C: LOGGED IN USER INTERACTIVE DASHBOARD */}
          {activeSection === 'dashboard' && currentUser && (
            <motion.div
              key="dashboard-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Dashboard
                currentUser={currentUser}
                userServers={filteredUserServers}
                invoices={filteredUserInvoices}
                tickets={filteredUserTickets}
                announcements={announcements}
                packages={packages}
                activeSubTab={activeSubTab}
                onChangeSubTab={(tab) => {
                  setPromptMessage('');
                  setActiveSubTab(tab);
                }}
                onAddBalance={handleAddBalanceInApp}
                onPurchaseServer={handlePurchaseServer}
                onRestartServer={handleRestartServer}
                onExtendServer={handleExtendServer}
                onNewTicket={handleNewTicketInApp}
                onReplyTicket={handleReplyTicketInApp}
                onUpdateUser={handleUpdateUserProfileInApp}
                checkoutPrefill={checkoutPrefill}
                onClearPrefill={() => setCheckoutPrefill(null)}
              />
            </motion.div>
          )}

          {/* VIEW D: COMPLEX ADMIN PANEL PORTAL */}
          {activeSection === 'admin' && currentUser && currentUser.role === 'admin' && (
            <motion.div
              key="admin-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AdminPanel
                currentUser={currentUser}
                users={users}
                servers={servers}
                invoices={invoices}
                tickets={tickets}
                announcements={announcements}
                packages={packages}
                onUpdateUsers={syncUsers}
                onUpdateServers={syncServers}
                onUpdateInvoices={syncInvoices}
                onUpdateTickets={syncTickets}
                onUpdateAnnouncements={syncAnnouncements}
                onUpdatePackages={syncPackages}
              />
            </motion.div>
          )}

          {/* VIEW E: ACCESS DENIED VIEW */}
          {activeSection === 'admin' && (!currentUser || currentUser.role !== 'admin') && (
            <motion.div
              key="access-denied-page"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto"
            >
              <div className="w-24 h-24 rounded-3xl bg-red-500/10 border-2 border-red-500/40 flex items-center justify-center text-red-500 mb-8 shadow-[0_0_50px_rgba(239,68,68,0.15)]">
                <Shield className="w-12 h-12" />
              </div>
              
              <h1 className="text-3xl font-display font-extrabold text-white tracking-tight mb-2 uppercase">
                Akses Ditolak (403 Forbidden)
              </h1>
              
              <div className="h-0.5 w-16 bg-red-500/50 mb-6 mx-auto rounded-full" />
              
              <div className="bg-[#101935]/80 border border-white/5 rounded-2xl p-6 text-sm text-[#A7B3D0] leading-relaxed mb-6">
                Maaf, Anda tidak memiliki izin administrator untuk mengakses halaman Admin Panel. Seluruh aktivitas akses ilegal akan dicatat ke dalam Audit Log Keamanan.
              </div>
              
              <motion.div 
                className="flex items-center gap-2 text-xs font-bold text-[#35FF90] bg-[#35FF90]/10 border border-[#35FF90]/20 px-4 py-2.5 rounded-xl mb-4"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <span>Mengalihkan kembali ke Dashboard dalam beberapa detik...</span>
              </motion.div>
              
              <button
                onClick={() => handleNavigate('dashboard')}
                className="px-6 py-2.5 bg-[#35FF90] text-[#04091C] rounded-xl text-xs font-bold hover:bg-[#35FF90]/90 transition-all cursor-pointer shadow-[0_0_20px_rgba(53,255,144,0.15)]"
              >
                Kembali ke Dashboard Sekarang
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* 4. MAIN CUSTOMERS POPUPS */}
      <AnimatePresence>
        {authOpen && (
          <AuthPopup
            isOpen={authOpen}
            onClose={() => { setAuthOpen(false); setPromptMessage(''); }}
            onLoginSuccess={handleLoginSuccess}
            allUsers={users}
            onRegisterUser={handleRegisterUser}
          />
        )}
      </AnimatePresence>

      {/* Alert toast if user trying to do actions without auth */}
      {promptMessage && (
        <div id="unauthorized-toast" className="fixed bottom-6 right-6 z-50 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 border border-amber-400/40 p-4 shadow-xl text-white flex items-center gap-3.5 max-w-sm text-left">
          <AlertCircle className="w-5 h-5 text-white shrink-0 mt-0.5" />
          <div className="text-xs">
            <h4 className="font-bold flex items-center gap-1.5 leading-none">Akses Memerlukan Akun!</h4>
            <p className="font-light mt-1">{promptMessage}</p>
            <div className="flex gap-2 mt-3 font-bold font-mono">
              <button 
                onClick={() => setAuthOpen(true)} 
                className="px-3 py-1 bg-white text-[#04091C] rounded-lg text-[9px] uppercase"
              >
                Login / Register
              </button>
              <button 
                onClick={() => setPromptMessage('')} 
                className="px-2 py-1 bg-black/25 text-white rounded-lg text-[9px] uppercase"
              >
                Sembunyikan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4.5. SECURE ADMIN ACCESS GATEWAY MODAL */}
      <AnimatePresence>
        {adminGateOpen && (
          <div id="admin-gate-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAdminGateOpen(false)}
              className="absolute inset-0 bg-[#04091C]/90 backdrop-blur-md"
            />

            {/* Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-red-500/30 bg-[#0B122E] p-6 shadow-[0_0_50px_rgba(239,68,68,0.15)] text-white"
            >
              {/* Close Button */}
              <button
                id="btn-close-admin-gate"
                onClick={() => setAdminGateOpen(false)}
                className="absolute top-4 right-4 text-[#A7B3D0] hover:text-white p-1 rounded-xl hover:bg-white/5 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 border-2 border-red-500/40 flex items-center justify-center text-red-500 mb-4 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                  <Shield className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-display font-extrabold tracking-tight text-white uppercase">
                  ADMINISTRATOR PORTAL
                </h3>
                <p className="text-xs text-[#A7B3D0] mt-1.5 leading-relaxed max-w-xs">
                  Sistem terenkripsi khusus internal pengembang dan manajemen pusat Mavix Store.
                </p>
              </div>

              <form onSubmit={handleAdminGateSubmit} className="space-y-4">
                {adminGateError && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-500/15 border border-red-500/30 text-red-300 rounded-xl text-xs font-semibold text-center"
                  >
                    {adminGateError}
                  </motion.div>
                )}

                {adminGateSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-[#35FF90]/15 border border-[#35FF90]/30 text-[#35FF90] rounded-xl text-xs font-semibold text-center"
                  >
                    {adminGateSuccess}
                  </motion.div>
                )}

                <div>
                  <label className="block text-[10px] font-mono font-bold text-[#A7B3D0] uppercase tracking-wider mb-1.5 pl-1">
                    ADMIN USERNAME
                  </label>
                  <input
                    id="admin-username"
                    type="text"
                    value={adminGateUsername}
                    onChange={(e) => setAdminGateUsername(e.target.value)}
                    placeholder="Masukkan username admin"
                    className="w-full rounded-xl bg-[#04091C] border border-white/10 px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 transition-all font-mono"
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-[#A7B3D0] uppercase tracking-wider mb-1.5 pl-1">
                    SECURITY ACCESS KEY
                  </label>
                  <input
                    id="admin-password"
                    type="password"
                    value={adminGatePassword}
                    onChange={(e) => setAdminGatePassword(e.target.value)}
                    placeholder="Masukkan security key"
                    className="w-full rounded-xl bg-[#04091C] border border-white/10 px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 transition-all font-mono"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setAdminGateOpen(false)}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-[#A7B3D0] hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer border border-white/5"
                  >
                    BATAL
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-xs font-bold shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all cursor-pointer"
                  >
                    MASUK SYSTEM
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>



      {/* 5. GLOBL FOOTER NAVIGATION */}
      <Footer 
        onNavigate={handleNavigate}
        onOpenAuth={() => { setPromptMessage(''); setAuthOpen(true); }}
        isLoggedIn={!!currentUser}
      />

    </div>
  );
}
