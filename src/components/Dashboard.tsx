import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User as UserIcon, Wallet, Layers, FileText, History as HistoryIcon, HelpCircle, 
  LifeBuoy, Settings as SettingsIcon, LayoutGrid, Cpu, Play, Square, RefreshCcw, 
  FileCheck, ShieldAlert, CreditCard, ChevronRight, Send, AlertCircle, PlusCircle, CheckCircle,
  ShoppingCart, Clock, Copy, Server as ServerIcon, MapPin, HardDrive, Check, ArrowRight, Shield
} from 'lucide-react';
import { User, UserServer, Invoice, SupportTicket, Announcement, MinecraftPackage } from '../types';
import { KNOWLEDGE_BASE_ARTICLES } from '../data/initialData';

interface DashboardProps {
  currentUser: User | null;
  userServers: UserServer[];
  invoices: Invoice[];
  tickets: SupportTicket[];
  announcements: Announcement[];
  packages: MinecraftPackage[];
  activeSubTab: string;
  onChangeSubTab: (tab: string) => void;
  onAddBalance: (amount: number, method: string) => void;
  onPurchaseServer: (
    name: string, 
    pkgId: 'standar' | 'medium' | 'prime', 
    ram: number,
    customCpu?: string,
    customRegion?: string,
    customStorage?: string,
    eggSoftware?: string,
    durationMonths?: number
  ) => { success: boolean; error?: string };
  onRestartServer: (serverId: string) => void;
  onExtendServer: (serverId: string) => void;
  onNewTicket: (subject: string, message: string) => void;
  onReplyTicket: (ticketId: string, message: string) => void;
  onUpdateUser: (username: string, email: string) => void;
  checkoutPrefill?: { pkg: MinecraftPackage; ram: number } | null;
  onClearPrefill?: () => void;
}

export default function Dashboard({
  currentUser,
  userServers,
  invoices,
  tickets,
  announcements,
  packages,
  activeSubTab,
  onChangeSubTab,
  onAddBalance,
  onPurchaseServer,
  onRestartServer,
  onExtendServer,
  onNewTicket,
  onReplyTicket,
  onUpdateUser,
  checkoutPrefill,
  onClearPrefill
}: DashboardProps) {
  
  // Local states for forms
  const [topupAmount, setTopupAmount] = useState<number>(20000);
  const [selectedMethod, setSelectedMethod] = useState<string>('QRIS');
  const [qrCodeGenerated, setQrCodeGenerated] = useState<boolean>(false);
  const [topupPendingAmount, setTopupPendingAmount] = useState<number>(0);
  const [topupSuccessState, setTopupSuccessState] = useState<boolean>(false);
  const [topupWaitingConfirmation, setTopupWaitingConfirmation] = useState<boolean>(false);

  // Checkout states
  const [pendingCheckoutPackage, setPendingCheckoutPackage] = useState<MinecraftPackage | null>(null);
  const [selectedRamSize, setSelectedRamSize] = useState<number>(4);
  const [serverCustomName, setServerCustomName] = useState<string>('Server Survival ID');
  const [checkoutSuccessMessage, setCheckoutSuccessMessage] = useState<string>('');
  const [purchasedServerDetails, setPurchasedServerDetails] = useState<{ ip: string; port: number; name: string } | null>(null);
  
  // Custom specifications
  const [selectedEgg, setSelectedEgg] = useState<string>('Paper');
  const [selectedRegion, setSelectedRegion] = useState<string>('Region Indonesia');
  const [selectedDuration, setSelectedDuration] = useState<number>(1);

  // Ticket form states
  const [newSubject, setNewSubject] = useState<string>('');
  const [newMessage, setNewMessage] = useState<string>('');
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [ticketReply, setTicketReply] = useState<string>('');

  // Profile forms
  const [formUsername, setFormUsername] = useState<string>(currentUser?.username || '');
  const [formEmail, setFormEmail] = useState<string>(currentUser?.email || '');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string>('');

  // Copy indicator state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Handle outside checkout redirect prefill
  useEffect(() => {
    if (checkoutPrefill && currentUser) {
      setPendingCheckoutPackage(checkoutPrefill.pkg);
      setSelectedRamSize(checkoutPrefill.ram);
      setServerCustomName(`${currentUser.username}'s ${checkoutPrefill.pkg.name.split(' ')[1] || 'Minecraft'} Server`);
      setCheckoutSuccessMessage('');
      setPurchasedServerDetails(null);
      setSelectedEgg('Paper');
      setSelectedRegion(checkoutPrefill.pkg.region || 'Region Indonesia');
      setSelectedDuration(1);
      
      if (onClearPrefill) {
        onClearPrefill();
      }
    }
  }, [checkoutPrefill, currentUser]);

  if (!currentUser) return null;

  // Sidebar items list matching NexusCloud
  const sidebarItems = [
    { id: 'main', label: 'Dashboard Home', icon: LayoutGrid },
    { id: 'servers', label: 'Layanan Server', icon: ServerIcon },
    { id: 'order', label: 'Sewa Hosting Baru', icon: PlusCircle },
    { id: 'topup', label: 'Top Up Saldo', icon: Wallet },
    { id: 'invoice', label: 'Riwayat Tagihan', icon: FileText },
    { id: 'riwayat', label: 'Riwayat Transaksi', icon: HistoryIcon },
    { id: 'kb', label: 'Panduan & KB', icon: HelpCircle },
    { id: 'ticket', label: 'Support Tiket', icon: LifeBuoy },
    { id: 'profile', label: 'Pengaturan Profil', icon: UserIcon },
    { id: 'settings', label: 'Setelan Panel', icon: SettingsIcon },
  ];

  // Calculated stats
  const activeServersCount = userServers.filter(s => s.status === 'online').length;
  
  const totalSpend = invoices
    .filter(i => i.type === 'hosting' && i.status === 'paid')
    .reduce((sum, current) => sum + current.amount, 0);

  const totalTopUp = invoices
    .filter(i => i.type === 'topup' && i.status === 'paid')
    .reduce((sum, current) => sum + current.amount, 0);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const handleCopyText = (text: string, elementId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(elementId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Trigger top up payment sequence
  const handleTopUpSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (topupAmount < 1000) {
      alert('Minimal top up adalah Rp 1.000');
      return;
    }
    setTopupPendingAmount(topupAmount);
    setTopupWaitingConfirmation(false);
    onAddBalance(topupAmount, 'QRIS');
    setQrCodeGenerated(true);
  };

  // Launch pre-filled checkout view
  const openCheckout = (pkg: MinecraftPackage, ram: number) => {
    setPendingCheckoutPackage(pkg);
    setSelectedRamSize(ram);
    setServerCustomName(`${currentUser.username}'s ${pkg.name.split(' ')[1] || 'Minecraft'} Server`);
    setCheckoutSuccessMessage('');
    setPurchasedServerDetails(null);
    setSelectedEgg('Paper');
    setSelectedRegion(pkg.region || 'Region Indonesia');
    setSelectedDuration(1);
    onChangeSubTab('checkout');
  };

  const getCheckoutTotalCost = () => {
    if (!pendingCheckoutPackage) return 0;
    return pendingCheckoutPackage.price * selectedRamSize * selectedDuration;
  };

  // Specs helper functions depending on package selection
  const getCores = (pkgId: string, ram: number) => {
    if (pkgId === 'standar') {
      if (ram <= 4) return 1;
      if (ram <= 8) return 2;
      if (ram <= 12) return 3;
      return 4;
    } else if (pkgId === 'medium') {
      if (ram <= 2) return 1;
      if (ram <= 6) return 2;
      if (ram <= 10) return 3;
      return 4;
    } else { // prime
      if (ram <= 4) return 2;
      if (ram <= 8) return 3;
      if (ram <= 12) return 4;
      return 6;
    }
  };

  const getStorage = (pkgId: string, ram: number) => {
    const mult = pkgId === 'standar' ? 10 : pkgId === 'medium' ? 15 : 20;
    return ram * mult;
  };

  const getCpuName = (pkgId: string) => {
    if (pkgId === 'standar') return 'Intel Platinum 8370C (Up to 3.5 GHz)';
    if (pkgId === 'medium') return 'AMD EPYC 7351 (Up to 3.0 GHz)';
    return 'Ryzen 9 5950X (Up to 4.9 GHz)';
  };

  const handleCheckoutSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!pendingCheckoutPackage) return;

    if (!serverCustomName.trim()) {
      alert('Nama server tidak boleh kosong!');
      return;
    }

    const totalCost = getCheckoutTotalCost();
    if (currentUser.balance < totalCost) {
      alert('Saldo tidak mencukupi untuk melakukan pemesanan ini. Silakan top up terlebih dahulu.');
      onChangeSubTab('topup');
      return;
    }

    const cpuLimit = getCpuName(pendingCheckoutPackage.id);
    const coresCount = getCores(pendingCheckoutPackage.id, selectedRamSize);
    const storageLimit = `${getStorage(pendingCheckoutPackage.id, selectedRamSize)} GB NVMe`;

    const res = onPurchaseServer(
      serverCustomName, 
      pendingCheckoutPackage.id, 
      selectedRamSize,
      `${coresCount} vCore - ${cpuLimit}`,
      selectedRegion,
      storageLimit,
      selectedEgg,
      selectedDuration
    );

    if (res.success) {
      // Simulate allocating server credentials info
      const randomPort = Math.floor(10000 + Math.random() * 55000);
      const hostIp = pendingCheckoutPackage.id === 'standar' ? 'hk-node1.mavix.store' : 'id-node3.mavix.store';
      
      setCheckoutSuccessMessage('Sukses! Server Minecraft Anda berhasil dikonfigurasi dan online seketika.');
      setPurchasedServerDetails({
        ip: hostIp,
        port: randomPort,
        name: serverCustomName
      });

      // We do not close instantly, let user read their server details, IP connection, and panel
    } else if (res.error) {
      alert(res.error);
    }
  };

  const submitTicketAction = (e: FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessage.trim()) return;
    onNewTicket(newSubject, newMessage);
    setNewSubject('');
    setNewMessage('');
    alert('Tiket berhasil dikirim. Tim Support kami akan menjawab segera!');
  };

  const submitTicketReplyAction = (e: FormEvent) => {
    e.preventDefault();
    if (!ticketReply.trim() || !activeTicketId) return;
    onReplyTicket(activeTicketId, ticketReply);
    setTicketReply('');
    alert('Balasan tiket terkirim.');
  };

  const handleProfileUpdateSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formUsername.trim() || !formEmail.trim()) return;
    onUpdateUser(formUsername, formEmail);
    setProfileSuccessMsg('Profil berhasil diperbaharui!');
    setTimeout(() => setProfileSuccessMsg(''), 2500);
  };

  return (
    <section id="dashboard-section" className="min-h-screen bg-[#020617] pt-28 pb-16 text-white relative overflow-hidden font-sans">
      
      {/* Background Ambience */}
      <div className="absolute top-10 left-10 w-[350px] h-[350px] bg-[#35FF90]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Dashboard Left Sidebar - Styled after premium billing panels */}
          <div className="lg:col-span-3 rounded-2xl bg-[#090f24] border border-white/5 p-4 space-y-1">
            <div className="px-3 pb-3 mb-4 border-b border-white/5 text-left">
              <span className="text-[10px] font-mono tracking-widest text-[#35FF90] uppercase font-black">NEXUS BILLING CLIENT</span>
              <p className="text-sm font-black text-white mt-1 uppercase font-display">Klien Portal</p>
            </div>
            
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeSubTab === item.id || (item.id === 'order' && activeSubTab === 'checkout');
              return (
                <button
                  id={`side-nav-${item.id}`}
                  key={item.id}
                  onClick={() => {
                    setPurchasedServerDetails(null);
                    setCheckoutSuccessMessage('');
                    onChangeSubTab(item.id);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                    isActive 
                      ? 'bg-[#35FF90]/10 border border-[#35FF90]/30 text-[#35FF90] shadow-[0_0_15px_rgba(53,255,144,0.05)]' 
                      : 'text-slate-400 border border-transparent hover:text-white hover:bg-white/5'
                  }`}
                >
                  <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#35FF90]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Core Dynamic Screen Column */}
          <div className="lg:col-span-9 w-full min-h-[550px]">
            
            <AnimatePresence mode="wait">
              
              {/* TAB 1: MAIN DASHBOARD HOME */}
              {activeSubTab === 'main' && (
                <motion.div
                  key="main"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Premium Welcoming Header */}
                  <div id="dashboard-welcome-card" className="relative overflow-hidden rounded-2xl border border-[#35FF90]/15 bg-[#090f24] p-6 sm:p-8 text-left shadow-[0_0_50px_rgba(53,255,144,0.02)]">
                    <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[#35FF90]/5 blur-[100px] pointer-events-none" />
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
                      <div>
                        <span className="text-[10px] font-mono tracking-widest text-[#35FF90] font-black uppercase bg-[#35FF90]/10 border border-[#35FF90]/20 rounded-full px-3 py-1">KUNCI AKTIF SECURE</span>
                        <h2 className="text-2xl sm:text-3xl font-black text-white font-display mt-3 uppercase tracking-tight">Selamat Datang, {currentUser.username}!</h2>
                        <span className="text-xs text-slate-400 mt-1 block font-mono">{currentUser.email} • ID Sesi: {currentUser.id}</span>
                      </div>
                      
                      <div className="flex flex-col gap-1.5 text-xs text-slate-400 bg-black/40 border border-white/5 rounded-xl p-3 font-mono">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#35FF90]" />
                          <span>Status Akun: <strong className="text-white capitalize">{currentUser.status}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#35FF90]" />
                          <span>Grup Otoritas: <strong className="text-[#35FF90] uppercase">{currentUser.role}</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Announcement System Widget */}
                  {announcements.length > 0 && (
                    <div id="announcement-area" className="space-y-2.5 text-left">
                      <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">PEMBERITAHUAN UTAMA</span>
                      {announcements.slice(0, 1).map((ann) => (
                        <div 
                          key={ann.id} 
                          className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs text-emerald-300"
                        >
                          <div className="flex items-center gap-2 font-bold mb-1 font-display uppercase tracking-wider text-white">
                            <span className="w-2 h-2 rounded-full bg-[#35FF90] animate-ping" />
                            <span>{ann.title}</span>
                          </div>
                          <p className="font-light text-slate-300">{ann.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* BENTO STATS / METRICS GRID - Exact billing.nexuscloud.id look */}
                  <div id="statistics-grid" className="space-y-3.5 text-left">
                    <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">RINGKASAN BILLING ANDA</span>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      
                      {/* CARD 1: Credit Balance / Saldo Store */}
                      <div className="bg-[#090f24] border border-[#35FF90]/15 rounded-2xl p-5 flex flex-col justify-between shadow-[0_0_30px_rgba(53,255,144,0.03)] group">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider">Saldo Store</span>
                          <Wallet className="w-4 h-4 text-[#35FF90]" />
                        </div>
                        <div className="mt-4">
                          <p className="text-xl sm:text-2xl font-black text-[#35FF90] font-mono leading-none">{formatIDR(currentUser.balance)}</p>
                          <button 
                            onClick={() => onChangeSubTab('topup')}
                            className="mt-3 text-[10px] bg-[#35FF90] text-slate-900 font-mono font-black uppercase tracking-wider py-1.5 px-3 rounded-lg hover:bg-emerald-400 transition-all flex items-center justify-center gap-1 w-full"
                          >
                            <PlusCircle className="w-3 h-3" /> Top Up Saldo
                          </button>
                        </div>
                      </div>

                      {/* CARD 2: Active Services */}
                      <div className="bg-[#090f24] border border-white/5 rounded-2xl p-5 flex flex-col justify-between hover:border-[#35FF90]/30 transition-all">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider">Server Aktif</span>
                          <ServerIcon className="w-4 h-4 text-sky-400" />
                        </div>
                        <div className="mt-4">
                          <p className="text-xl sm:text-2xl font-black text-white leading-none">{userServers.length} Unit</p>
                          <button 
                            onClick={() => onChangeSubTab('servers')}
                            className="mt-3 text-[10px] bg-slate-800 text-slate-300 font-mono font-black uppercase tracking-wider py-1.5 px-3 rounded-lg hover:text-white hover:bg-slate-700 transition-all flex items-center justify-center gap-1 w-full"
                          >
                            Kelola Layanan <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* CARD 3: Unpaid / total bills */}
                      <div className="bg-[#090f24] border border-white/5 rounded-2xl p-5 flex flex-col justify-between hover:border-[#35FF90]/30 transition-all">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider">Total Tagihan</span>
                          <FileText className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="mt-4">
                          <p className="text-xl sm:text-2xl font-black text-white leading-none">{invoices.length} Tagihan</p>
                          <button 
                            onClick={() => onChangeSubTab('invoice')}
                            className="mt-3 text-[10px] bg-slate-800 text-slate-300 font-mono font-black uppercase tracking-wider py-1.5 px-3 rounded-lg hover:text-white hover:bg-slate-700 transition-all flex items-center justify-center gap-1 w-full"
                          >
                            Lihat Invoice <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* CARD 4: Support Ticket status */}
                      <div className="bg-[#090f24] border border-white/5 rounded-2xl p-5 flex flex-col justify-between hover:border-[#35FF90]/30 transition-all">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider">Tiket Support</span>
                          <LifeBuoy className="w-4 h-4 text-purple-400" />
                        </div>
                        <div className="mt-4">
                          <p className="text-xl sm:text-2xl font-black text-white leading-none">{tickets.length} Tiket</p>
                          <button 
                            onClick={() => onChangeSubTab('ticket')}
                            className="mt-3 text-[10px] bg-slate-800 text-slate-300 font-mono font-black uppercase tracking-wider py-1.5 px-3 rounded-lg hover:text-white hover:bg-slate-700 transition-all flex items-center justify-center gap-1 w-full"
                          >
                            Buka Tiket <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Active servers shortcut list */}
                  <div className="space-y-3.5 text-left">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">LAYANAN MINECRAFT AKTIF</span>
                      <button 
                        onClick={() => onChangeSubTab('order')}
                        className="text-xs text-[#35FF90] font-bold hover:underline flex items-center gap-1"
                      >
                        <PlusCircle className="w-3.5 h-3.5" /> Pesan Baru
                      </button>
                    </div>

                    {userServers.length === 0 ? (
                      <div className="flex flex-col items-center justify-center p-12 bg-[#090f24] border border-white/5 rounded-2xl text-center">
                        <AlertCircle className="w-12 h-12 text-slate-500 mb-3" />
                        <h3 className="font-bold text-white text-sm">Anda Belum Memiliki Layanan</h3>
                        <p className="text-xs text-slate-400 mt-1 max-w-sm">Dapatkan hosting server Minecraft premium dengan performa hardware tinggi sekarang juga.</p>
                        <button 
                          onClick={() => onChangeSubTab('order')}
                          className="mt-4 px-5 py-2 bg-[#35FF90] text-slate-900 text-xs font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all"
                        >
                          Sewa Server Sekarang
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userServers.map((server) => {
                          const isOnline = server.status === 'online';
                          const isRestarting = server.status === 'restarting';
                          const isStandar = server.packageName.toLowerCase().includes('standar') || server.packageName.toLowerCase().includes('lite');
                          const isMedium = server.packageName.toLowerCase().includes('medium');
                          const accentText = isStandar ? 'text-cyan-400' : isMedium ? 'text-purple-400' : 'text-amber-400';
                          const fakeCpuLoad = Math.floor(15 + Math.random() * 40);
                          const fakeRamLoad = Math.floor(30 + Math.random() * 35);
                          const connectionString = server.ipAddress;

                          return (
                            <div
                              key={server.id}
                              className="rounded-2xl border border-white/5 bg-[#090f24] p-5 flex flex-col justify-between hover:border-[#35FF90]/30 transition-all duration-300"
                            >
                              <div>
                                <div className="flex justify-between items-start mb-3">
                                  <span className={`text-[9px] font-mono bg-black/40 px-2.5 py-1 rounded-lg border border-white/5 font-black uppercase ${accentText}`}>
                                    {server.packageName}
                                  </span>
                                  <span className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-full border border-white/5 text-[9px] font-black uppercase font-mono">
                                    <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-[#35FF90] animate-pulse' : isRestarting ? 'bg-amber-400 animate-spin' : 'bg-red-500'}`} />
                                    <span className={isOnline ? 'text-[#35FF90]' : isRestarting ? 'text-amber-400' : 'text-red-500'}>
                                      {isOnline ? 'ONLINE' : isRestarting ? 'REBOOTING' : 'OFFLINE'}
                                    </span>
                                  </span>
                                </div>

                                <h3 className="font-display font-black text-white text-base tracking-tight uppercase">
                                  {server.name}
                                </h3>

                                <div className="mt-3.5 space-y-2 text-[10px] font-mono text-slate-400">
                                  {/* Host IP with copy button */}
                                  <div className="flex items-center justify-between bg-black/20 px-3 py-2 rounded-xl border border-white/5">
                                    <span className="text-gray-500">IP ADDRESS</span>
                                    <div className="flex items-center gap-1.5 text-white">
                                      <span className="font-bold">{connectionString}</span>
                                      <button 
                                        onClick={() => handleCopyText(connectionString, server.id)}
                                        className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-[#35FF90] transition-all"
                                        title="Copy IP Address"
                                      >
                                        {copiedId === server.id ? (
                                          <span className="text-[9px] text-[#35FF90] font-sans font-bold">Copied!</span>
                                        ) : (
                                          <Copy className="w-3 h-3" />
                                        )}
                                      </button>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2 mt-2">
                                    <div className="bg-black/20 p-2.5 rounded-xl border border-white/5">
                                      <div className="flex justify-between text-gray-500 text-[8px] uppercase">
                                        <span>CPU LIMIT</span>
                                        <span className="text-white font-bold">{fakeCpuLoad}%</span>
                                      </div>
                                      <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                                        <div className="bg-[#35FF90] h-full" style={{ width: `${fakeCpuLoad}%` }} />
                                      </div>
                                    </div>
                                    <div className="bg-black/20 p-2.5 rounded-xl border border-white/5">
                                      <div className="flex justify-between text-gray-500 text-[8px] uppercase">
                                        <span>RAM ALLOC</span>
                                        <span className="text-white font-bold">{server.ram} GB</span>
                                      </div>
                                      <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                                        <div className="bg-[#35FF90] h-full" style={{ width: `${fakeRamLoad}%` }} />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex justify-between text-gray-500 text-[9px] pt-1">
                                    <span>LOKASI NODE</span>
                                    <span className="text-white font-semibold">{server.region.replace('Region ', '')}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-3 gap-2">
                                <a
                                  href="https://panel.mavix.store"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="col-span-2 flex items-center justify-center gap-1.5 py-2.5 text-[10px] font-mono font-black uppercase tracking-wider rounded-xl bg-[#35FF90] hover:bg-emerald-400 text-slate-900 transition-all text-center cursor-pointer"
                                >
                                  <Play className="w-3 h-3 fill-current" />
                                  <span>Buka Panel</span>
                                </a>
                                
                                <button
                                  onClick={() => onRestartServer(server.id)}
                                  className="flex items-center justify-center gap-1.5 py-2.5 text-[10px] font-mono font-black uppercase tracking-wider rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all cursor-pointer"
                                >
                                  <RefreshCcw className="w-3 h-3 text-slate-400" />
                                  <span>Reboot</span>
                                </button>
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </motion.div>
              )}

              {/* TAB 2: MY SERVERS / SERVICES */}
              {activeSubTab === 'servers' && (
                <motion.div
                  key="servers"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 text-left"
                >
                  <div className="flex justify-between items-center pb-4 border-b border-white/5">
                    <div>
                      <h2 className="text-lg font-black font-display text-white uppercase tracking-wider">LAYANAN MINECRAFT SAYA</h2>
                      <p className="text-xs text-slate-400 font-light">Status real-time dan konfigurasi server Anda.</p>
                    </div>
                    <button 
                      onClick={() => onChangeSubTab('order')}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#35FF90] text-slate-900 font-mono font-black text-xs uppercase tracking-wider rounded-xl hover:bg-emerald-400 transition-all"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Order Baru
                    </button>
                  </div>

                  {userServers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 bg-[#090f24] border border-white/5 rounded-2xl text-center">
                      <AlertCircle className="w-12 h-12 text-slate-500 mb-3" />
                      <h3 className="font-bold text-white text-sm">Belum Ada Layanan Terdaftar</h3>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm">Mulailah petualangan server Anda dengan performa anti lag dari hardware kelas tinggi.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userServers.map((server) => {
                        const isOnline = server.status === 'online';
                        const isRestarting = server.status === 'restarting';
                        const expiresDate = new Date(server.expiredAt);
                        const isExpiredSoon = (expiresDate.getTime() - Date.now()) < 5 * 24 * 60 * 60 * 1000;
                        const connectionString = server.ipAddress;

                        return (
                          <div
                            key={server.id}
                            className="rounded-2xl border border-white/5 bg-[#090f24] p-6 hover:border-[#35FF90]/25 transition-all duration-300"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                              
                              <div className="md:col-span-4 space-y-2">
                                <span className="text-[9px] font-mono bg-[#35FF90]/10 border border-[#35FF90]/20 text-[#35FF90] px-2.5 py-0.5 rounded-lg font-bold uppercase">
                                  {server.packageName}
                                </span>
                                <h3 className="text-lg font-black text-white font-display uppercase tracking-tight leading-none mt-2">
                                  {server.name}
                                </h3>
                                <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                                  <MapPin className="w-3.5 h-3.5 text-gray-500" />
                                  <span>{server.region}</span>
                                </div>
                              </div>

                              <div className="md:col-span-5 space-y-2.5 text-xs font-mono text-slate-300">
                                <div className="flex justify-between py-1 border-b border-white/5">
                                  <span className="text-slate-500 text-[10px]">ALOKASI RAM</span>
                                  <span className="text-white font-bold">{server.ram} GB Dedicated DDR4</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-white/5">
                                  <span className="text-slate-500 text-[10px]">HOST / IP ALAMAT</span>
                                  <div className="flex items-center gap-1 font-bold text-[#35FF90]">
                                    <span>{connectionString}</span>
                                    <button 
                                      onClick={() => handleCopyText(connectionString, `srv-lay-${server.id}`)}
                                      className="p-0.5 hover:bg-white/5 rounded text-slate-400"
                                    >
                                      {copiedId === `srv-lay-${server.id}` ? (
                                        <span className="text-[8px] text-[#35FF90] font-sans">Copied!</span>
                                      ) : (
                                        <Copy className="w-3 h-3" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                                <div className="flex justify-between py-1">
                                  <span className="text-slate-500 text-[10px]">TANGGAL KADALUARSA</span>
                                  <span className={`font-bold ${isExpiredSoon ? 'text-red-400 animate-pulse' : 'text-slate-300'}`}>
                                    {expiresDate.toLocaleDateString('id-ID')} ({isExpiredSoon ? 'Segera Expired!' : 'Aktif'})
                                  </span>
                                </div>
                              </div>

                              <div className="md:col-span-3 flex flex-col gap-2">
                                <a
                                  href="https://panel.mavix.store"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full py-2.5 rounded-xl font-mono text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2 bg-[#35FF90] text-slate-900 hover:bg-emerald-400 transition-all cursor-pointer"
                                >
                                  <Play className="w-3.5 h-3.5 fill-current" />
                                  <span>Panel Konsol</span>
                                </a>

                                <button
                                  onClick={() => onExtendServer(server.id)}
                                  className="w-full py-2.5 rounded-xl font-mono text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2 bg-slate-800 text-[#35FF90] border border-[#35FF90]/20 hover:border-[#35FF90]/40 transition-all cursor-pointer"
                                >
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>Perpanjang Sewa</span>
                                </button>
                              </div>

                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 3: ORDER HOSTING - SEWA HOSTING BARU */}
              {activeSubTab === 'order' && (
                <motion.div
                  key="order"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-6 text-left"
                >
                  <div className="pb-4 border-b border-white/5">
                    <h2 className="text-lg font-black font-display text-white uppercase tracking-wider">PESAN SERVER HOSTING BARU</h2>
                    <p className="text-xs text-slate-400 font-light font-sans">Pilih jenis node hardware premium kami di bawah ini untuk memulai.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
                    {packages.map((pkg) => {
                      const isOut = pkg.stock <= 0;
                      const isStandar = pkg.id === 'standar';
                      const isMedium = pkg.id === 'medium';
                      const colorTheme = isStandar ? '#00E5FF' : isMedium ? '#D500F9' : '#FF9100';
                      const accentText = isStandar ? 'text-cyan-400' : isMedium ? 'text-purple-400' : 'text-amber-400';

                      return (
                        <div 
                          key={pkg.id} 
                          className="rounded-2xl border border-white/5 bg-[#090f24] p-6 flex flex-col justify-between hover:border-slate-700 transition-all duration-300 hover:-translate-y-1"
                        >
                          <div>
                            <div className="flex justify-between items-center mb-4">
                              <h3 className={`text-xs font-mono font-black tracking-widest uppercase ${accentText}`}>{pkg.name}</h3>
                              {pkg.badge && (
                                <span className="bg-[#35FF90]/10 text-[#35FF90] border border-[#35FF90]/20 text-[9px] font-black px-2.5 py-0.5 rounded-full font-mono uppercase">
                                  {pkg.badge}
                                </span>
                              )}
                            </div>
                            
                            <p className="text-xs text-slate-300 mb-5 font-light leading-relaxed">
                              Hardware handal menggunakan <strong className="text-white">{pkg.cpu}</strong> dengan performa stabil, anti lag, dan rute koneksi optimal di <strong className="text-white">{pkg.region}</strong>.
                            </p>

                            <ul className="space-y-2.5 mb-6 text-[11px] text-slate-400">
                              {pkg.features.map((feat, i) => (
                                <li key={i} className="flex items-center gap-2">
                                  <Check className="w-3.5 h-3.5 text-[#35FF90] shrink-0 stroke-[3]" />
                                  <span>{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="pt-4 border-t border-white/5">
                            <div className="flex justify-between items-center mb-4 text-xs font-mono">
                              <span className="text-slate-500">Biaya Alokasi:</span>
                              <strong className="text-white">{formatIDR(pkg.price)} / GB / bln</strong>
                            </div>
                            
                            <button
                              disabled={isOut}
                              onClick={() => openCheckout(pkg, pkg.ram)}
                              className={`w-full py-3 text-xs font-mono font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer ${
                                isOut 
                                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                                  : 'bg-white hover:bg-[#35FF90] text-slate-900'
                              }`}
                              style={{
                                color: isOut ? '#64748B' : '#020617'
                              }}
                              onMouseEnter={(e) => {
                                if (!isOut) {
                                  e.currentTarget.style.backgroundColor = colorTheme;
                                  e.currentTarget.style.boxShadow = `0 0 20px ${colorTheme}60`;
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isOut) {
                                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                                  e.currentTarget.style.boxShadow = 'none';
                                }
                              }}
                            >
                              {isOut ? 'STOCK HABIS' : 'PILIH PAKET'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* TAB 3 (SUB): DETAILED CHECKOUT SECTION - Styled like billing.nexuscloud.id/plans/lite-hosting-2 */}
              {activeSubTab === 'checkout' && pendingCheckoutPackage && (
                <motion.div
                  key="checkout"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6 text-left font-sans"
                >
                  {/* Title Bar */}
                  <div className="pb-4 border-b border-white/5 flex items-center gap-3">
                    <ShoppingCart className="w-5 h-5 text-[#35FF90]" />
                    <div>
                      <h2 className="text-lg font-black font-display text-white uppercase tracking-wider">
                        {pendingCheckoutPackage.id === 'standar' ? 'Lite' : pendingCheckoutPackage.id === 'medium' ? 'Medium' : 'Ryzen 9 Prime'} Hosting {selectedRamSize} GB RAM
                      </h2>
                      <p className="text-xs text-slate-400 font-light font-sans">Konfigurasi alokasi hardware game server Minecraft Anda sebelum melakukan aktivasi instan.</p>
                    </div>
                  </div>

                  {/* Checkout Success Alert Card */}
                  {checkoutSuccessMessage && purchasedServerDetails && (
                    <div className="rounded-2xl border border-[#35FF90]/30 bg-[#35FF90]/10 p-6 space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-[#35FF90] shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-black text-white font-display uppercase tracking-wider">PEMESANAN HOSTING BERHASIL!</h4>
                          <p className="text-xs text-slate-300 mt-1">Sistem billing kami telah memproses transaksi saldo Anda dan mengalokasikan server instan di control panel Pterodactyl.</p>
                        </div>
                      </div>

                      {/* Purchased specs details box */}
                      <div className="bg-black/40 border border-white/5 rounded-xl p-4 font-mono text-xs space-y-3.5">
                        <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                          <span className="text-slate-500 uppercase tracking-wider text-[10px]">NAMA SERVER</span>
                          <strong className="text-white uppercase">{purchasedServerDetails.name}</strong>
                        </div>
                        <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                          <span className="text-slate-500 uppercase tracking-wider text-[10px]">ALAMAT IP / PORT</span>
                          <div className="flex items-center gap-1.5 font-bold text-[#35FF90]">
                            <span>{purchasedServerDetails.ip}:{purchasedServerDetails.port}</span>
                            <button 
                              onClick={() => handleCopyText(`${purchasedServerDetails.ip}:${purchasedServerDetails.port}`, 'bought-srv-ip')}
                              className="p-1 hover:bg-white/5 rounded text-slate-300"
                            >
                              {copiedId === 'bought-srv-ip' ? 'Copied!' : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                          <span className="text-slate-500 uppercase tracking-wider text-[10px]">CPU ENGINE</span>
                          <strong className="text-white uppercase">{getCpuName(pendingCheckoutPackage.id)}</strong>
                        </div>
                        <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                          <span className="text-slate-500 uppercase tracking-wider text-[10px]">SOFTWARE GAME</span>
                          <strong className="text-[#35FF90] uppercase">{selectedEgg}</strong>
                        </div>
                        <div className="flex justify-between items-center py-1.5">
                          <span className="text-slate-500 uppercase tracking-wider text-[10px]">MEMBER AREA PANEL</span>
                          <strong className="text-white uppercase">PTERODACTYL ACTIVE</strong>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <a
                          href="https://panel.mavix.store"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-3 text-center bg-[#35FF90] text-slate-900 font-mono font-black text-xs uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-all cursor-pointer"
                        >
                          Masuk Ke Panel Pterodactyl
                        </a>
                        <button
                          onClick={() => {
                            setPurchasedServerDetails(null);
                            setCheckoutSuccessMessage('');
                            onChangeSubTab('servers');
                          }}
                          className="flex-1 py-3 text-center bg-slate-800 border border-white/10 text-white font-mono font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-700 transition-all cursor-pointer"
                        >
                          Kelola Layanan Server
                        </button>
                      </div>
                    </div>
                  )}

                  {!purchasedServerDetails && (
                    <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-sans">
                      
                      {/* Configuration form on left column (7 cols) */}
                      <div className="lg:col-span-7 space-y-6">
                        
                        {/* Server custom name input */}
                        <div className="bg-[#090f24] border border-white/5 p-5 rounded-2xl space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 bg-[#35FF90]/10 border border-[#35FF90]/20 rounded-lg text-[#35FF90] font-mono font-black text-xs flex items-center justify-center">1</span>
                            <label className="block text-xs font-mono font-black uppercase tracking-widest text-[#35FF90]">
                              Nama Identitas Server
                            </label>
                          </div>
                          <input
                            type="text"
                            value={serverCustomName}
                            onChange={(e) => setServerCustomName(e.target.value)}
                            placeholder="Contoh: Minecraft Survival ID"
                            className="w-full bg-[#020617] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#35FF90]/30 font-mono font-bold"
                            required
                          />
                          <p className="text-[10px] text-slate-500">Nama unik ini akan muncul di panel dan daftar server klan Anda.</p>
                        </div>

                        {/* Minecraft software engine (egg) selector */}
                        <div className="bg-[#090f24] border border-white/5 p-5 rounded-2xl space-y-4">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 bg-[#35FF90]/10 border border-[#35FF90]/20 rounded-lg text-[#35FF90] font-mono font-black text-xs flex items-center justify-center">2</span>
                            <span className="block text-xs font-mono font-black uppercase tracking-widest text-[#35FF90]">
                              Pilih Software Game Server
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
                            {[
                              { name: 'Paper', desc: 'Optimal & Ringan' },
                              { name: 'Purpur', desc: 'Performa Terbaik API' },
                              { name: 'Forge', desc: 'Dukungan Modpack' },
                              { name: 'Fabric', desc: 'Modding Modern' },
                              { name: 'Spigot', desc: 'Standard Plugins' },
                              { name: 'Vanilla', desc: 'Sesuai Aslinya' }
                            ].map((egg) => (
                              <button
                                key={egg.name}
                                type="button"
                                onClick={() => setSelectedEgg(egg.name)}
                                className={`p-3 rounded-xl border transition-all text-left flex flex-col justify-between font-bold cursor-pointer ${
                                  selectedEgg === egg.name
                                    ? 'bg-[#35FF90]/5 border-[#35FF90] text-[#35FF90] shadow-[0_0_15px_rgba(53,255,144,0.05)]'
                                    : 'bg-[#020617] border-white/5 text-slate-400 hover:border-white/10'
                                }`}
                              >
                                <span className="text-xs text-white font-black">{egg.name}</span>
                                <span className="text-[9px] text-slate-500 font-normal mt-1">{egg.desc}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Datacenter Region Information Box */}
                        <div className="bg-[#090f24] border border-white/5 p-5 rounded-2xl space-y-4">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 bg-[#35FF90]/10 border border-[#35FF90]/20 rounded-lg text-[#35FF90] font-mono font-black text-xs flex items-center justify-center">3</span>
                            <span className="block text-xs font-mono font-black uppercase tracking-widest text-[#35FF90]">
                              Lokasi Node & Jaringan Jaminan
                            </span>
                          </div>

                          <div className="bg-[#020617] border border-white/5 p-4 rounded-xl flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[#35FF90]">
                              <MapPin className="w-5 h-5" />
                            </div>
                            <div className="text-left font-sans text-xs">
                              <h4 className="font-bold text-white uppercase tracking-wide">
                                {pendingCheckoutPackage.region} Datacenter
                              </h4>
                              <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                                IP node terisolasi penuh dengan konektivitas port 10 Gbps uplink, latensi rendah dari Indonesia, dan proteksi DDoS mitigasi otomatis.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Automatic specs list */}
                        <div className="bg-[#090f24] border border-white/5 p-5 rounded-2xl space-y-4">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 bg-[#35FF90]/10 border border-[#35FF90]/20 rounded-lg text-[#35FF90] font-mono font-black text-xs flex items-center justify-center">4</span>
                            <span className="block text-xs font-mono font-black uppercase tracking-widest text-[#35FF90]">
                              Spesifikasi Hardware (Otomatis Sesuai RAM)
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
                            <div className="p-3 bg-[#020617] rounded-xl border border-white/5 text-left">
                              <span className="text-slate-500 text-[9px] block uppercase">MEMORI RAM</span>
                              <strong className="text-white text-sm block mt-1">{selectedRamSize} GB DDR4</strong>
                              <span className="text-[9px] text-[#35FF90] font-bold">Terisolasi Penuh</span>
                            </div>

                            <div className="p-3 bg-[#020617] rounded-xl border border-white/5 text-left">
                              <span className="text-slate-500 text-[9px] block uppercase">CPU CORES</span>
                              <strong className="text-white text-sm block mt-1">{getCores(pendingCheckoutPackage.id, selectedRamSize)} vCore</strong>
                              <span className="text-[9px] text-[#35FF90] font-bold truncate max-w-full block leading-none">{getCpuName(pendingCheckoutPackage.id).split(' ')[0]}</span>
                            </div>

                            <div className="p-3 bg-[#020617] rounded-xl border border-white/5 text-left">
                              <span className="text-slate-500 text-[9px] block uppercase">NVMe STORAGE</span>
                              <strong className="text-white text-sm block mt-1">{getStorage(pendingCheckoutPackage.id, selectedRamSize)} GB SSD</strong>
                              <span className="text-[9px] text-[#35FF90] font-bold">R/W Super Cepat</span>
                            </div>
                          </div>
                        </div>

                        {/* Duration Period Selector */}
                        <div className="bg-[#090f24] border border-white/5 p-5 rounded-2xl space-y-4">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 bg-[#35FF90]/10 border border-[#35FF90]/20 rounded-lg text-[#35FF90] font-mono font-black text-xs flex items-center justify-center">5</span>
                            <span className="block text-xs font-mono font-black uppercase tracking-widest text-[#35FF90]">
                              Durasi Siklus Pembayaran
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                            {[
                              { months: 1, label: '1 Bulan', promo: 'Standard' },
                              { months: 3, label: '3 Bulan', promo: 'Hemat 5%' },
                              { months: 6, label: '6 Bulan', promo: 'Hemat 10%' }
                            ].map((cycle) => (
                              <button
                                key={cycle.months}
                                type="button"
                                onClick={() => setSelectedDuration(cycle.months)}
                                className={`p-3 rounded-xl border text-left flex flex-col justify-between font-bold cursor-pointer ${
                                  selectedDuration === cycle.months
                                    ? 'bg-[#35FF90]/5 border-[#35FF90] text-[#35FF90]'
                                    : 'bg-[#020617] border-white/5 text-slate-400'
                                }`}
                              >
                                <span className="text-white font-black block">{cycle.label}</span>
                                <span className="text-[9px] text-slate-500 font-normal mt-1 leading-none">{cycle.promo}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Sticky Order billing summary on right column (5 cols) */}
                      <div className="lg:col-span-5 space-y-6 sticky top-28">
                        
                        <div className="bg-[#090f24] border border-[#35FF90]/15 p-6 rounded-2xl space-y-5 shadow-[0_0_40px_rgba(53,255,144,0.03)]">
                          <h3 className="font-display font-black text-white text-sm tracking-wide uppercase border-b border-white/5 pb-3.5 flex items-center gap-2">
                            <ShoppingCart className="w-4 h-4 text-[#35FF90]" />
                            <span>Rincian Transaksi Anda</span>
                          </h3>

                          {/* Line item breakdown */}
                          <div className="space-y-3.5 text-xs font-mono">
                            <div className="flex justify-between items-center text-slate-400 leading-none">
                              <span>Tipe Hosting</span>
                              <span className="text-white font-bold uppercase">{pendingCheckoutPackage.name}</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-400 leading-none">
                              <span>Alokasi RAM</span>
                              <span className="text-white font-bold">{selectedRamSize} GB DDR4</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-400 leading-none">
                              <span>Biaya Satuan</span>
                              <span className="text-white font-bold">{formatIDR(pendingCheckoutPackage.price)} / GB / bln</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-400 leading-none">
                              <span>Software Pilihan</span>
                              <span className="text-[#35FF90] font-bold">{selectedEgg}</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-400 leading-none">
                              <span>Durasi Sewa</span>
                              <span className="text-white font-bold">{selectedDuration} Bulan</span>
                            </div>
                            
                            <div className="border-t border-white/5 pt-4 mt-2 flex justify-between items-center font-bold text-white text-sm">
                              <span className="font-display font-black uppercase tracking-wider text-xs">Total Pembayaran:</span>
                              <span className="text-lg text-[#35FF90] font-mono leading-none">{formatIDR(getCheckoutTotalCost())}</span>
                            </div>
                          </div>

                          {/* Store balance inspector */}
                          <div className="bg-[#020617] border border-white/5 rounded-xl p-4 space-y-3.5 font-mono text-xs">
                            <div className="flex justify-between items-center text-slate-400 leading-none">
                              <span>Saldo Store Anda:</span>
                              <span className="text-white font-bold">{formatIDR(currentUser.balance)}</span>
                            </div>
                            
                            <div className="flex justify-between items-center text-slate-400 leading-none">
                              <span>Saldo Setelah Transaksi:</span>
                              <span className={`font-black ${
                                currentUser.balance >= getCheckoutTotalCost()
                                  ? 'text-[#35FF90]'
                                  : 'text-red-400'
                              }`}>
                                {formatIDR(currentUser.balance - getCheckoutTotalCost())}
                              </span>
                            </div>
                          </div>

                          {/* Action button conditional state */}
                          {currentUser.balance >= getCheckoutTotalCost() ? (
                            <button
                              type="submit"
                              className="w-full py-4 text-slate-900 bg-[#35FF90] hover:bg-emerald-400 font-mono font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(53,255,144,0.15)] flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              <span>Aktivasi Layanan Server</span>
                            </button>
                          ) : (
                            <div className="space-y-3">
                              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-xs text-red-300 flex items-start gap-2.5">
                                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                <p className="leading-normal">
                                  Saldo Anda tidak mencukupi untuk pembayaran ini. Sisa kekurangan: <strong>{formatIDR(getCheckoutTotalCost() - currentUser.balance)}</strong>.
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => onChangeSubTab('topup')}
                                className="w-full py-4 text-slate-900 bg-[#35FF90] hover:bg-emerald-400 font-mono font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                              >
                                <PlusCircle className="w-4 h-4" />
                                <span>Top Up Saldo Sekarang</span>
                              </button>
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setPendingCheckoutPackage(null);
                              onChangeSubTab('order');
                            }}
                            className="w-full py-3 bg-transparent border border-white/5 hover:border-white/10 rounded-xl text-xs font-mono font-bold text-slate-400 hover:text-white transition-colors"
                          >
                            Batal & Kembali
                          </button>
                        </div>

                      </div>

                    </form>
                  )}
                </motion.div>
              )}

              {/* TAB 4: TOP UP SALDO STORE */}
              {activeSubTab === 'topup' && (
                <motion.div
                  key="topup"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="max-w-xl mx-auto text-left"
                >
                  <div className="pb-4 border-b border-white/5 mb-6">
                    <h2 className="text-lg font-black font-display text-white uppercase tracking-wider">TOP UP SALDO STORE</h2>
                    <p className="text-xs text-slate-400 font-light font-sans">Deposit saldo instan untuk aktivasi sewa server Minecraft VPS Anda.</p>
                  </div>

                  {topupSuccessState && (
                    <div className="mb-6 rounded-xl bg-[#35FF90]/10 border border-[#35FF90]/30 p-5 text-center flex flex-col items-center">
                      <CheckCircle className="w-12 h-12 text-[#35FF90] mb-3" />
                      <h3 className="font-bold text-white text-sm font-display uppercase">Top Up Terverifikasi!</h3>
                      <p className="text-xs text-[#35FF90] mt-1 max-w-sm leading-relaxed font-mono">Deposit Anda sukses disetujui. Saldo store telah terupdate.</p>
                    </div>
                  )}

                  {topupWaitingConfirmation && (
                    <div className="mb-6 rounded-xl bg-amber-500/10 border border-amber-500/30 p-5 text-center flex flex-col items-center font-sans">
                      <Clock className="w-12 h-12 text-amber-400 mb-3 animate-pulse" />
                      <h3 className="font-bold text-white text-sm uppercase tracking-wider font-display">Menunggu Konfirmasi Admin</h3>
                      <p className="text-xs text-slate-300 mt-2 max-w-sm leading-relaxed">
                        Konfirmasi pembayaran Anda telah dikirim! Deposit Anda sedang diverifikasi admin (<strong>sekitar 15 menit</strong>).
                      </p>
                      <button 
                        onClick={() => onChangeSubTab('invoice')}
                        className="text-[10px] text-[#35FF90] font-mono font-black uppercase mt-3 hover:underline"
                      >
                        Pantau Status Tagihan
                      </button>
                    </div>
                  )}

                  {!qrCodeGenerated ? (
                    <form onSubmit={handleTopUpSubmit} className="bg-[#090f24] border border-white/5 rounded-2xl p-6 space-y-6 font-sans">
                      
                      {/* Presets */}
                      <div>
                        <label className="block text-xs font-mono font-black text-slate-400 uppercase tracking-widest mb-3">
                          Pilih Nominal Cepat
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[5000, 10000, 20000, 50000, 75000, 100000].map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => setTopupAmount(preset)}
                              className={`py-2 rounded-xl font-mono text-xs font-black transition-all border cursor-pointer ${
                                topupAmount === preset
                                  ? 'bg-[#35FF90] text-slate-900 border-[#35FF90]'
                                  : 'bg-[#020617] text-slate-400 border-white/5 hover:border-white/15'
                              }`}
                            >
                              {formatIDR(preset).replace(',00', '')}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Manual input */}
                      <div>
                        <label className="block text-xs font-mono font-black text-slate-400 uppercase tracking-widest mb-2.5">
                          Atau Tulis Jumlah Nominal Kustom (Rp)
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-xs font-black text-slate-500">Rp</span>
                          <input
                            type="number"
                            min="1000"
                            placeholder="Contoh: 15000"
                            value={topupAmount}
                            onChange={(e) => setTopupAmount(Number(e.target.value))}
                            className="w-full rounded-xl bg-[#020617] border border-white/5 py-3.5 pl-12 pr-4 text-xs text-white focus:outline-none focus:border-[#35FF90]/30 font-mono font-black"
                            required
                          />
                        </div>
                      </div>

                      {/* Payment method selection */}
                      <div>
                        <label className="block text-xs font-mono font-black text-slate-400 uppercase tracking-widest mb-3">
                          Metode Pembayaran Tersedia
                        </label>
                        <div className="flex items-center gap-3 rounded-xl border border-[#35FF90]/25 bg-[#35FF90]/5 p-4 text-xs text-left transition-all">
                          <CreditCard className="w-5 h-5 text-[#35FF90] shrink-0" />
                          <div>
                            <strong className="text-white font-bold block leading-none">QRIS (Gopay/OVO/Dana/M-Banking)</strong>
                            <span className="text-[10px] text-slate-400 mt-1 block">Verifikasi mutasi manual oleh admin (diproses sekitar 15 menit)</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-4 bg-[#35FF90] text-slate-900 hover:bg-emerald-400 font-mono font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_15px_rgba(53,255,144,0.1)] cursor-pointer"
                      >
                        BUAT INVOICE TOP UP DEPOSIT
                      </button>

                    </form>
                  ) : (
                    <div id="qris-payment-flow" className="bg-[#090f24] border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6 flex flex-col items-center">
                      
                      <span className="text-[10px] font-mono tracking-widest text-[#35FF90] uppercase font-black bg-[#35FF90]/10 border border-[#35FF90]/20 rounded-full px-3 py-1">PEMBAYARAN QRIS MANUAL</span>
                      <h3 className="text-white font-black text-sm tracking-wide uppercase font-display leading-none mt-2">Pindai QRIS & Bayar Tagihan</h3>

                      <div className="bg-white rounded-xl p-5 border border-white/5 flex flex-col items-center shadow-lg">
                        <img
                          referrerPolicy="no-referrer"
                          src={localStorage.getItem('mavix_qris_url') || "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&q=60&w=260"}
                          alt="QRIS QR"
                          className="w-44 h-44 object-contain rounded"
                        />
                        <span className="text-[10px] text-slate-900 font-mono font-bold mt-2">NEXUS_MEMBER_ID: {currentUser.id}</span>
                      </div>

                      <div className="rounded-xl bg-black/40 border border-white/5 p-4 text-xs font-mono w-full text-left space-y-2.5">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Jumlah Deposit:</span>
                          <span className="text-white font-bold">{formatIDR(topupPendingAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Biaya Administrasi:</span>
                          <span className="text-[#35FF90]">Rp 0 (Gratis)</span>
                        </div>
                        <div className="flex justify-between text-yellow-400 font-bold border-t border-white/5 pt-2 mt-2">
                          <span>Total Tagihan:</span>
                          <span>{formatIDR(topupPendingAmount)}</span>
                        </div>
                      </div>

                      {/* Manual Verification Info */}
                      <div className="rounded-xl bg-amber-500/5 border border-amber-500/25 p-4 text-xs text-amber-200 w-full text-center space-y-1.5 leading-relaxed font-sans">
                        <p className="font-bold flex items-center justify-center gap-1.5 uppercase font-mono text-[10px] text-amber-400">
                          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                          PROSES VERIFIKASI SEKITAR 15 MENIT
                        </p>
                        <p className="text-[10px] text-slate-400 leading-normal">
                          Silakan scan kode QRIS di atas dan bayar. Setelah membayar, klik tombol di bawah agar admin memverifikasi mutasi dan menyetujui saldo Anda dalam waktu <strong>sekitar 15 menit</strong>.
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setTopupWaitingConfirmation(true);
                          setQrCodeGenerated(false);
                        }}
                        className="w-full py-4 bg-[#35FF90] text-slate-900 font-mono font-black text-xs uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-all shadow-[0_0_15px_rgba(53,255,144,0.15)] cursor-pointer"
                      >
                        SAYA SUDAH MEMBAYAR
                      </button>

                      <button
                        onClick={() => setQrCodeGenerated(false)}
                        className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                      >
                        Batal
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 5: INVOICE / RIWAYAT TAGIHAN */}
              {activeSubTab === 'invoice' && (
                <motion.div
                  key="invoice"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 text-left"
                >
                  <div className="pb-4 border-b border-white/5">
                    <h2 className="text-lg font-black font-display text-white uppercase tracking-wider">RIWAYAT INVOICE & TAGIHAN</h2>
                    <p className="text-xs text-slate-400 font-light">Status pembayaran tagihan atau sewa Minecraft VPS Anda.</p>
                  </div>

                  <div className="bg-[#090f24] rounded-2xl border border-white/5 overflow-hidden font-mono">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left text-white">
                        <thead className="bg-black/40 text-slate-400 text-[10px] uppercase tracking-wider border-b border-white/5">
                          <tr>
                            <th className="py-3.5 px-5">Invoice ID</th>
                            <th className="py-3.5 px-5">Deskripsi</th>
                            <th className="py-3.5 px-5">Kategori</th>
                            <th className="py-3.5 px-5">Nominal</th>
                            <th className="py-3.5 px-5">Status</th>
                            <th className="py-3.5 px-5">Tanggal Dibuat</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-sans">
                          {invoices.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-8 text-center text-slate-500 font-mono text-xs">Tidak ada riwayat invoice.</td>
                            </tr>
                          ) : (
                            invoices.map((inv) => (
                              <tr key={inv.id} className="hover:bg-white/5 transition-colors font-mono">
                                <td className="py-3.5 px-5 font-black text-[#35FF90]">{inv.id}</td>
                                <td className="py-3.5 px-5 font-sans font-light max-w-[200px] truncate">{inv.description}</td>
                                <td className="py-3.5 px-5 font-sans capitalize">{inv.type === 'hosting' ? 'Sewa Hosting' : 'Top Up Saldo'}</td>
                                <td className="py-3.5 px-5 text-white font-bold">{formatIDR(inv.amount)}</td>
                                <td className="py-3.5 px-5">
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                    inv.status === 'paid' 
                                      ? 'bg-[#35FF90]/10 text-[#35FF90] border border-[#35FF90]/20' 
                                      : inv.status === 'pending' 
                                        ? 'bg-yellow-500/10 text-yellow-300 border border-yellow-500/20' 
                                        : 'bg-red-500/10 text-red-300 border border-red-500/20'
                                  }`}>
                                    {inv.status}
                                  </span>
                                  {inv.status === 'pending' && inv.type === 'topup' && (
                                    <span className="block text-[8px] text-yellow-400 mt-1 leading-tight font-sans">
                                      Menunggu konfirmasi admin (~15 menit)
                                    </span>
                                  )}
                                </td>
                                <td className="py-3.5 px-5 text-slate-400 font-light">
                                  {new Date(inv.createdAt).toLocaleString('id-ID')}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 6: RIWAYAT TRANSAKSI */}
              {activeSubTab === 'riwayat' && (
                <motion.div
                  key="riwayat"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 text-left"
                >
                  <div className="pb-4 border-b border-white/5">
                    <h2 className="text-lg font-black font-display text-white uppercase tracking-wider">RIWAYAT MUTASI TRANSAKSI</h2>
                    <p className="text-xs text-slate-400 font-light">Laporan mutasi debit dan kredit dompet billing Anda.</p>
                  </div>

                  <div className="bg-[#090f24] rounded-2xl border border-white/5 overflow-hidden font-mono">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left text-white">
                        <thead className="bg-black/40 text-slate-400 text-[10px] uppercase tracking-wider border-b border-white/5">
                          <tr>
                            <th className="py-3.5 px-5">Invoice ID</th>
                            <th className="py-3.5 px-5">Keterangan</th>
                            <th className="py-3.5 px-5">Nominal</th>
                            <th className="py-3.5 px-5">Mutasi</th>
                            <th className="py-3.5 px-5">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {invoices.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">Tidak ada riwayat transaksi.</td>
                            </tr>
                          ) : (
                            invoices.map((inv) => (
                              <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                                <td className="py-3.5 px-5 font-black">{inv.id}</td>
                                <td className="py-3.5 px-5 font-sans font-light">{inv.description}</td>
                                <td className="py-3.5 px-5 text-white font-bold">{formatIDR(inv.amount)}</td>
                                <td className="py-3.5 px-5">
                                  <span className={`font-black text-[9px] uppercase px-2 py-0.5 rounded-lg ${inv.type === 'topup' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'}`}>
                                    {inv.type === 'topup' ? '(+) DEPOSIT' : '(-) DEBET'}
                                  </span>
                                </td>
                                <td className="py-3.5 px-5">
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                    inv.status === 'paid' 
                                      ? 'bg-[#35FF90]/10 text-[#35FF90] border border-[#35FF90]/20' 
                                      : 'bg-yellow-400/10 text-yellow-300 border border-yellow-400/20'
                                  }`}>
                                    {inv.status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 7: KNOWLEDGE BASE / PANDUAN */}
              {activeSubTab === 'kb' && (
                <motion.div
                  key="kb"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 text-left"
                >
                  <div className="pb-4 border-b border-white/5">
                    <h2 className="text-lg font-black font-display text-white uppercase tracking-wider">PANDUAN & KNOWLEDGE BASE</h2>
                    <p className="text-xs text-slate-400 font-light">Pelajari panduan dasar manajemen administrasi server Minecraft Anda.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                    {KNOWLEDGE_BASE_ARTICLES.map((cat, idx) => (
                      <div key={idx} className="rounded-2xl border border-white/5 bg-[#090f24] p-5 space-y-4">
                        <h3 className="font-display font-black text-[#35FF90] uppercase tracking-wide text-xs">
                          📁 {cat.category}
                        </h3>
                        <div className="space-y-3">
                          {cat.articles.map((art, aIdx) => (
                            <div key={aIdx} className="bg-[#020617] p-4 rounded-xl border border-white/5">
                              <h4 className="text-xs font-black text-white mb-1.5">{art.title}</h4>
                              <p className="text-[11px] text-slate-400 leading-relaxed font-light">{art.content}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TAB 8: SUPPORT TICKET */}
              {activeSubTab === 'ticket' && (
                <motion.div
                  key="ticket"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 text-left font-sans"
                >
                  <div className="pb-4 border-b border-white/5">
                    <h2 className="text-lg font-black font-display text-white uppercase tracking-wider">TIKET BANTUAN TEKNIS</h2>
                    <p className="text-xs text-slate-400 font-light">Hubungi teknisi kami untuk memecahkan kendala atau optimasi server Minecraft.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
                    
                    {/* Send client ticket */}
                    <div className="lg:col-span-5 rounded-2xl bg-[#090f24] border border-white/5 p-5">
                      <h3 className="text-xs font-black font-display uppercase tracking-wider text-white mb-4">Buat Tiket Pertanyaan</h3>
                      
                      <form onSubmit={submitTicketAction} className="space-y-4">
                        <div>
                          <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 mb-1.5">Subject Masalah</label>
                          <input
                            type="text"
                            placeholder="Contoh: Upgrade Server / Plugin Crash"
                            value={newSubject}
                            onChange={(e) => setNewSubject(e.target.value)}
                            className="w-full rounded-xl bg-[#020617] border border-white/5 p-3 text-xs text-white focus:outline-none focus:border-[#35FF90]/30 font-bold"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 mb-1.5">Penjelasan Masalah</label>
                          <textarea
                            rows={4}
                            placeholder="Tuliskan secara lengkap error logs atau kendala server Minecraft Anda..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="w-full rounded-xl bg-[#020617] border border-white/5 p-3 text-xs text-white focus:outline-none focus:border-[#35FF90]/30"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full flex items-center justify-center gap-2 py-3 bg-[#35FF90] text-slate-900 font-mono font-black text-xs uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-all font-display"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Kirim Tiket Masalah
                        </button>
                      </form>
                    </div>

                    {/* Active list feedback logs */}
                    <div className="lg:col-span-7 space-y-4">
                      <h3 className="text-xs font-black font-display uppercase tracking-wider text-white">Daftar Tiket Anda ({tickets.length})</h3>

                      {tickets.length === 0 ? (
                        <div className="p-8 bg-[#090f24] border border-white/5 rounded-2xl text-center text-xs text-slate-500 font-mono">
                          Tidak ada tiket bantuan yang aktif saat ini.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {tickets.map((tck) => {
                            const isSelected = activeTicketId === tck.id;
                            return (
                              <div
                                key={tck.id}
                                className={`rounded-2xl border p-5 transition-all duration-300 bg-[#090f24] ${
                                  isSelected ? 'border-[#35FF90]/40' : 'border-white/5'
                                }`}
                              >
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-mono text-[9px] text-[#35FF90] font-bold">{tck.id}</span>
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                    tck.status === 'open' 
                                      ? 'bg-amber-500/10 text-amber-300' 
                                      : tck.status === 'answered' 
                                        ? 'bg-[#35FF90]/10 text-[#35FF90]' 
                                        : 'bg-slate-800 text-slate-400'
                                  }`}>
                                    {tck.status}
                                  </span>
                                </div>

                                <h4 className="text-xs font-black text-white mb-1.5 uppercase font-display">{tck.subject}</h4>
                                <p className="text-[11px] text-slate-300 font-light italic mb-3">"{tck.message}"</p>

                                <span className="text-[9px] text-slate-500 block mb-3 font-mono">Dibuat pada: {new Date(tck.createdAt).toLocaleString('id-ID')}</span>

                                {tck.responses.length > 0 && (
                                  <div className="border-t border-white/5 pt-3 mt-3 space-y-3">
                                    <p className="text-[9px] font-black font-mono tracking-wider uppercase text-slate-500 mb-1">Response Logs:</p>
                                    {tck.responses.map((resp) => (
                                      <div 
                                        key={resp.id} 
                                        className={`rounded-xl p-3 text-[11px] ${
                                          resp.sender === 'admin' 
                                            ? 'bg-[#35FF90]/5 border-l-2 border-[#35FF90] text-slate-200' 
                                            : 'bg-[#020617] border-l-2 border-slate-500 text-slate-300'
                                        }`}
                                      >
                                        <div className="flex justify-between font-bold mb-1 col-span-2">
                                          <span>{resp.senderName} ({resp.sender.toUpperCase()})</span>
                                          <span className="text-[9px] font-mono text-slate-500">{new Date(resp.createdAt).toLocaleTimeString('id-ID')}</span>
                                        </div>
                                        <p className="font-light">{resp.message}</p>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                <div className="pt-4 mt-3 border-t border-white/5">
                                  <button
                                    onClick={() => setActiveTicketId(isSelected ? null : tck.id)}
                                    className="w-full text-center py-2.5 bg-[#020617] border border-white/5 text-[10px] font-mono font-black uppercase tracking-wider rounded-lg text-slate-400 hover:text-[#35FF90] transition-colors cursor-pointer"
                                  >
                                    {isSelected ? 'Tutup Balasan' : 'Balas Tiket Masalah'}
                                  </button>
                                </div>

                                {isSelected && (
                                  <form onSubmit={submitTicketReplyAction} className="mt-4 pt-4 border-t border-white/5 space-y-2">
                                    <textarea
                                      rows={2}
                                      value={ticketReply}
                                      onChange={(e) => setTicketReply(e.target.value)}
                                      placeholder="Tulis balasan Anda..."
                                      className="w-full rounded-lg bg-[#020617] border border-white/5 p-3 text-xs text-white focus:outline-none focus:border-[#35FF90]/30"
                                      required
                                    />
                                    <button
                                      type="submit"
                                      className="w-full py-2 bg-[#35FF90] text-slate-900 font-mono font-black text-[10px] uppercase tracking-wider rounded-lg cursor-pointer"
                                    >
                                      Kirim Pesan
                                    </button>
                                  </form>
                                )}

                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                  </div>
                </motion.div>
              )}

              {/* TAB 9: PROFILE */}
              {activeSubTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="max-w-md mx-auto text-left"
                >
                  <div className="pb-4 border-b border-white/5 mb-6">
                    <h2 className="text-lg font-black font-display text-white uppercase tracking-wider">PENGATURAN PROFIL KLIEN</h2>
                    <p className="text-xs text-slate-400 font-light">Edit identitas nama atau email terdaftar Akun billing Anda.</p>
                  </div>

                  {profileSuccessMsg && (
                    <div className="mb-4 text-xs font-semibold bg-emerald-500/10 border border-emerald-500/25 p-3 rounded-xl text-emerald-300">
                      {profileSuccessMsg}
                    </div>
                  )}

                  <form onSubmit={handleProfileUpdateSubmit} className="bg-[#090f24] border border-white/5 rounded-2xl p-6 space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase font-mono font-black tracking-widest text-slate-400 mb-1.5">Username Akun</label>
                      <input
                        type="text"
                        value={formUsername}
                        onChange={(e) => setFormUsername(e.target.value)}
                        className="w-full rounded-xl bg-[#020617] border border-white/5 p-3 text-xs text-white focus:outline-none focus:border-[#35FF90]/30 font-bold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-mono font-black tracking-widest text-slate-400 mb-1.5">Email Kontak</label>
                      <input
                        type="email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        className="w-full rounded-xl bg-[#020617] border border-white/5 p-3 text-xs text-white focus:outline-none focus:border-[#35FF90]/30 font-bold"
                        required
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-3 bg-[#35FF90] text-slate-900 font-mono font-black text-xs uppercase tracking-widest rounded-xl hover:scale-105 transition-all font-display"
                      >
                        SIMPAN PERUBAHAN
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* TAB 10: SETTINGS */}
              {activeSubTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="max-w-md mx-auto text-left"
                >
                  <div className="pb-4 border-b border-white/5 mb-6">
                    <h2 className="text-lg font-black font-display text-white uppercase tracking-wider">SETELAN PANEL KLIEN</h2>
                    <p className="text-xs text-slate-400 font-light">Setelan otentikasi ganda dan notifikasi otomatis portal.</p>
                  </div>

                  <div className="bg-[#090f24] border border-white/5 rounded-2xl p-6 space-y-4 text-xs font-sans">
                    <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                      <div>
                        <strong className="text-white block">Email Multi-Factor Auth (MFA)</strong>
                        <span className="text-[10px] text-slate-400">Amankan login member dengan kode otentikasi ganda email.</span>
                      </div>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input id="toggle-mfa" type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-9 h-5 bg-[#020617] border border-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#35FF90]" />
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                      <div>
                        <strong className="text-white block">Instan Auto-Renewal Server</strong>
                        <span className="text-[10px] text-slate-400">Debit saldo store otomatis sebelum server sewa kadaluarsa.</span>
                      </div>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input id="toggle-autorenew" type="checkbox" className="sr-only peer" />
                        <div className="w-9 h-5 bg-[#020617] border border-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#35FF90]" />
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-2.5">
                      <div>
                        <strong className="text-white block">Discord Webhooks Synchronizer</strong>
                        <span className="text-[10px] text-slate-400">Terima pemberitahuan push status server langsung ke saluran Discord.</span>
                      </div>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input id="toggle-discord" type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-9 h-5 bg-[#020617] border border-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#35FF90]" />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={() => alert('Fitur pengaturan tersimpan secara global.')}
                        className="w-full py-2.5 bg-transparent hover:bg-white/5 border border-white/10 text-white font-mono font-black text-xs uppercase tracking-wider rounded-xl transition-colors"
                      >
                        SIMPAN PERUBAHAN SETELAN
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
