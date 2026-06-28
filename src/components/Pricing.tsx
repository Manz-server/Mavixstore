import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, AlertCircle, ShoppingCart, Cpu, Server, Shield, Globe, 
  Terminal, ChevronRight, HelpCircle, HardDrive, Info, Layers, RefreshCw, Sparkles, MessageSquare, ArrowLeft, ArrowRight
} from 'lucide-react';
import { MinecraftPackage } from '../types';

interface PricingProps {
  packages: MinecraftPackage[];
  onOrderClick: (pkg: MinecraftPackage, selectedRam: number) => void;
  currentUser?: any;
  onPurchaseServer?: (
    serverName: string, 
    pkgId: 'standar' | 'medium' | 'prime', 
    ram: number, 
    customCpu?: string, 
    customRegion?: string, 
    customStorage?: string, 
    eggSoftware?: string,
    durationMonths?: number
  ) => { success: boolean; error?: string };
  onNavigate?: (section: string) => void;
}

export default function Pricing({ packages, onOrderClick, currentUser, onPurchaseServer, onNavigate }: PricingProps) {
  // State to manage the selected hosting class category
  // null = Homepage overview (Gambar 2)
  // 'lite' = Lite Hosting landing subpage (Gambar 3 & 4)
  // 'medium' = Medium Hosting landing subpage (Gambar 3 & 4)
  // 'premium' = Premium Hosting landing subpage (Gambar 3 & 4)
  const [selectedClass, setSelectedClass] = useState<null | 'lite' | 'medium' | 'premium'>(null);

  // Auto scroll references
  const packagesListRef = useRef<HTMLDivElement>(null);
  const configSectionRef = useRef<HTMLDivElement>(null);

  // Configurator inputs states
  const [selectedConfigPkg, setSelectedConfigPkg] = useState<MinecraftPackage | null>(null);
  const [configSoftware, setConfigSoftware] = useState<string>('PaperMC');
  const [configRegion, setConfigRegion] = useState<string>('Region Indonesia');
  const [configRam, setConfigRam] = useState<number>(4);
  const [configServerName, setConfigServerName] = useState<string>('');
  const [configDuration, setConfigDuration] = useState<number>(1); // 1, 3, or 6 months
  
  // Custom add-ons state
  const [addonPort, setAddonPort] = useState<boolean>(false);
  const [addonBackup, setAddonBackup] = useState<boolean>(false);
  const [addonSupport, setAddonSupport] = useState<boolean>(false);

  // Alerts
  const [configError, setConfigError] = useState<string>('');
  const [configSuccess, setConfigSuccess] = useState<string>('');

  // Re-sync package selections when selectedClass changes
  useEffect(() => {
    if (selectedClass) {
      // Clear configuration on category change
      setSelectedConfigPkg(null);
    }
  }, [selectedClass]);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  // Predefined specific Tiers based on selected category (Matches Gambar 4 pricing structure)
  const getTiersForClass = () => {
    if (selectedClass === 'lite') {
      const basePkg = packages.find(p => p.id === 'standar') || { price: 6000 };
      return [
        { id: 1, ram: 1, storage: 10, cpu: 'Intel Platinum 8370C', cores: 1, price: basePkg.price * 1 },
        { id: 2, ram: 2, storage: 20, cpu: 'Intel Platinum 8370C', cores: 1, price: basePkg.price * 2 },
        { id: 3, ram: 4, storage: 40, cpu: 'Intel Platinum 8370C', cores: 2, price: basePkg.price * 4 },
        { id: 4, ram: 8, storage: 80, cpu: 'Intel Platinum 8370C', cores: 2, price: basePkg.price * 8 },
        { id: 5, ram: 12, storage: 120, cpu: 'Intel Platinum 8370C', cores: 3, price: basePkg.price * 12 }
      ];
    } else if (selectedClass === 'medium') {
      const basePkg = packages.find(p => p.id === 'medium') || { price: 10000 };
      return [
        { id: 1, ram: 2, storage: 25, cpu: 'AMD EPYC 7351', cores: 1, price: basePkg.price * 2 },
        { id: 2, ram: 4, storage: 50, cpu: 'AMD EPYC 7351', cores: 2, price: basePkg.price * 4 },
        { id: 3, ram: 8, storage: 100, cpu: 'AMD EPYC 7351', cores: 2, price: basePkg.price * 8 },
        { id: 4, ram: 12, storage: 150, cpu: 'AMD EPYC 7351', cores: 3, price: basePkg.price * 12 }
      ];
    } else if (selectedClass === 'premium') {
      const basePkg = packages.find(p => p.id === 'prime') || { price: 15000 };
      return [
        { id: 1, ram: 4, storage: 60, cpu: 'Ryzen 9 5950X', cores: 2, price: basePkg.price * 4 },
        { id: 2, ram: 8, storage: 120, cpu: 'Ryzen 9 5950X', cores: 2, price: basePkg.price * 8 },
        { id: 3, ram: 12, storage: 180, cpu: 'Ryzen 9 5950X', cores: 3, price: basePkg.price * 12 }
      ];
    }
    return [];
  };

  const handleSelectClass = (cls: 'lite' | 'medium' | 'premium') => {
    const hash = cls === 'lite' ? 'standar' : cls;
    window.location.hash = hash;
    if (onNavigate) {
      onNavigate('hosting');
    }
  };

  const handleScrollToPackages = () => {
    packagesListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSewaNow = (tier: any) => {
    // Find the master package definition
    const pkgIdMap = { lite: 'standar', medium: 'medium', premium: 'prime' };
    const masterPkg = packages.find(p => p.id === pkgIdMap[selectedClass as 'lite' | 'medium' | 'premium']);
    
    if (masterPkg) {
      setSelectedConfigPkg({
        ...masterPkg,
        cpu: tier.cpu,
        ram: tier.ram,
      });
      setConfigRam(tier.ram);
      setConfigRegion(masterPkg.region || 'Region Indonesia');
      setConfigServerName(`${selectedClass ? selectedClass.toUpperCase() : 'Game'} Tier ${tier.ram}G Server`);
      setConfigError('');
      setConfigSuccess('');
      
      setTimeout(() => {
        configSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  };

  // Calculate prices dynamically for receipt card
  const getCalculatedPricing = () => {
    if (!selectedConfigPkg) return { baseCost: 0, addCost: 0, discount: 0, grandTotal: 0 };
    
    // Per month cost
    const baseCost = selectedConfigPkg.price * configRam;
    
    // Addons monthly cost
    let addCost = 0;
    if (addonPort) addCost += 10000;
    if (addonBackup) addCost += 5000;
    if (addonSupport) addCost += 7500;

    const monthlySubtotal = baseCost + addCost;
    const multiMonthSubtotal = monthlySubtotal * configDuration;

    // Duration discounts
    let discountPercent = 0;
    if (configDuration === 3) discountPercent = 0.05; // 5% discount
    if (configDuration === 6) discountPercent = 0.15; // 15% discount

    const discount = Math.round(multiMonthSubtotal * discountPercent);
    const grandTotal = multiMonthSubtotal - discount;

    return {
      baseCost,
      addCost,
      discount,
      grandTotal
    };
  };

  const handleCheckoutConfiguredServer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConfigPkg) return;

    if (!currentUser) {
      setConfigError('Silakan masuk ke akun Anda terlebih dahulu untuk menyewa server.');
      return;
    }

    if (onPurchaseServer) {
      const res = onPurchaseServer(
        configServerName,
        selectedConfigPkg.id as any,
        configRam,
        selectedConfigPkg.cpu,
        configRegion,
        `${configRam * 10} GB NVMe SSD`,
        configSoftware,
        configDuration
      );

      if (res.success) {
        setConfigSuccess('BERHASIL! Server Minecraft Anda telah dibuat di panel Pterodactyl!');
        setConfigError('');
        
        // Auto navigate back to dashboard after 2.5 seconds
        setTimeout(() => {
          setSelectedConfigPkg(null);
          setSelectedClass(null);
          if (onNavigate) {
            onNavigate('dashboard');
          }
        }, 2500);
      } else {
        setConfigError(res.error || 'Terjadi kegagalan memproses server.');
      }
    } else {
      onOrderClick(selectedConfigPkg, configRam);
    }
  };

  const availableRams = [1, 2, 4, 8, 12];

  return (
    <section id="pricing-section" className="py-24 bg-[#020617] relative border-t border-white/5 scroll-mt-24">
      
      {/* Background spotlights */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#35FF90]/5 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        <AnimatePresence mode="wait">
          
          {/* STAGE A: NULL (MAIN CATEGORY CARDS - GAMBAR KEDUA) */}
          {selectedClass === null ? (
            <motion.div
              key="main-overview"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-16"
            >
              {/* Section Header */}
              <div className="text-center max-w-3xl mx-auto">
                <p className="text-xs font-mono font-bold uppercase tracking-widest text-[#35FF90] mb-3">
                  MAVIX PREMIUM CATALOG
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Pilihan Layanan Hosting Kami
                </h2>
                <div className="h-1 w-12 bg-[#35FF90] mx-auto rounded-full mt-4" />
                <p className="text-sm sm:text-base text-gray-400 mt-4 font-light leading-relaxed">
                  Pilih tipe hosting yang paling sesuai dengan kebutuhan proyek game Anda. Dapatkan performa handal anti-lag.
                </p>
              </div>

              {/* Grid with 3 Cards (Matching Gambar 2 precisely) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-2">
                
                {/* 1. LITE HOSTING */}
                <motion.div
                  className="relative rounded-2xl bg-[#0b1329] border border-white/10 hover:border-[#35FF90]/40 flex flex-col p-6 sm:p-8 transition-all duration-300 w-full hover:scale-[1.02] group"
                >
                  {/* Space/Glow layer */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#35FF90]/0 to-[#35FF90]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  
                  {/* Content */}
                  <div className="space-y-4 flex-1">
                    <h3 className="font-display font-black text-white text-xl tracking-wide">
                      Lite Hosting
                    </h3>
                    <div className="inline-flex items-baseline gap-1">
                      <span className="text-3xl font-black font-mono text-[#35FF90]">Rp6.000</span>
                      <span className="text-[10px] text-gray-500 font-mono">/bulan</span>
                    </div>

                    {/* Specs Box */}
                    <div className="bg-[#020617] rounded-xl p-3 border border-white/5 space-y-2 text-xs font-mono">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Cpu className="w-4 h-4 text-[#35FF90]" />
                        <span>Intel Platinum 8370C</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <Layers className="w-4 h-4 text-[#35FF90]" />
                        <span>1 - 12 GB Ram</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 font-light leading-relaxed pt-2">
                      Performa stabil untuk server kecil hingga menengah. Cocok untuk bermain santai dengan teman.
                    </p>
                  </div>

                  <button
                    onClick={() => handleSelectClass('lite')}
                    className="w-full flex items-center justify-center gap-2 py-4 mt-8 rounded-xl text-xs font-bold tracking-wider transition-all duration-300 bg-[#020617] border border-white/10 text-white hover:border-[#35FF90] hover:text-[#35FF90] hover:bg-[#35FF90]/5 cursor-pointer"
                  >
                    <span>Lihat Paket</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </motion.div>

                {/* 2. MEDIUM HOSTING (Most Popular) */}
                <motion.div
                  className="relative rounded-2xl bg-[#0b1329] border border-[#35FF90]/60 flex flex-col p-6 sm:p-8 transition-all duration-300 w-full hover:scale-[1.03] group shadow-[0_0_25px_rgba(53,255,144,0.08)] md:-translate-y-2 z-10"
                >
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 uppercase tracking-widest text-[9px] font-black px-4 py-1.5 rounded-full bg-[#35FF90] text-[#020617] shadow-[0_0_15px_rgba(53,255,144,0.3)]">
                    MOST POPULAR
                  </span>

                  {/* Content */}
                  <div className="space-y-4 flex-1">
                    <h3 className="font-display font-black text-white text-xl tracking-wide pt-2">
                      Medium Hosting
                    </h3>
                    <div className="inline-flex items-baseline gap-1">
                      <span className="text-3xl font-black font-mono text-[#35FF90]">Rp10.000</span>
                      <span className="text-[10px] text-gray-500 font-mono">/bulan</span>
                    </div>

                    {/* Specs Box */}
                    <div className="bg-[#020617] rounded-xl p-3 border border-[#35FF90]/10 space-y-2 text-xs font-mono">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Cpu className="w-4 h-4 text-[#35FF90]" />
                        <span>AMD EPYC 7351</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <Layers className="w-4 h-4 text-[#35FF90]" />
                        <span>1 - 12 GB Ram</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 font-light leading-relaxed pt-2">
                      Keseimbangan performa dan kapasitas. Ideal untuk modpack ringan dan plugin dasar.
                    </p>
                  </div>

                  <button
                    onClick={() => handleSelectClass('medium')}
                    className="w-full flex items-center justify-center gap-2 py-4 mt-8 rounded-xl text-xs font-bold tracking-wider transition-all duration-300 bg-[#35FF90] text-[#020617] hover:bg-[#35FF90]/90 font-black shadow-[0_0_15px_rgba(53,255,144,0.25)] cursor-pointer"
                  >
                    <span>Lihat Paket</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>

                {/* 3. PREMIUM HOSTING */}
                <motion.div
                  className="relative rounded-2xl bg-[#0b1329] border border-white/10 hover:border-[#35FF90]/40 flex flex-col p-6 sm:p-8 transition-all duration-300 w-full hover:scale-[1.02] group"
                >
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 uppercase tracking-widest text-[9px] font-black px-4 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
                    CLOSE FRIENDS + MODS
                  </span>

                  {/* Content */}
                  <div className="space-y-4 flex-1">
                    <h3 className="font-display font-black text-white text-xl tracking-wide pt-2">
                      Premium Hosting
                    </h3>
                    <div className="inline-flex items-baseline gap-1">
                      <span className="text-3xl font-black font-mono text-[#35FF90]">Rp15.000</span>
                      <span className="text-[10px] text-gray-500 font-mono">/bulan</span>
                    </div>

                    {/* Specs Box */}
                    <div className="bg-[#020617] rounded-xl p-3 border border-white/5 space-y-2 text-xs font-mono">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Cpu className="w-4 h-4 text-[#35FF90]" />
                        <span>Ryzen 9 5950X</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <Layers className="w-4 h-4 text-[#35FF90]" />
                        <span>1 - 12 GB Ram</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 font-light leading-relaxed pt-2">
                      Performa tinggi untuk modpack besar dan komunitas aktif. Tanpa lag, tanpa batas.
                    </p>
                  </div>

                  <button
                    onClick={() => handleSelectClass('premium')}
                    className="w-full flex items-center justify-center gap-2 py-4 mt-8 rounded-xl text-xs font-bold tracking-wider transition-all duration-300 bg-[#020617] border border-white/10 text-white hover:border-[#35FF90] hover:text-[#35FF90] hover:bg-[#35FF90]/5 cursor-pointer"
                  >
                    <span>Lihat Paket</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </motion.div>

              </div>
            </motion.div>
          ) : (
            /* STAGE B: ACTIVE SUBPAGE CATEGORY (GAMBAR TIGA & EMPAT) */
            <motion.div
              key="sub-category-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-16"
            >
              
              {/* BACK NAVIGATION BUTTON */}
              <button
                onClick={() => setSelectedClass(null)}
                className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-[#35FF90] transition-colors cursor-pointer group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span>KEMBALI KE PILIHAN UTAMA</span>
              </button>

              {/* 3. LANDING HERO HEADER SUBPAGE (Matches Gambar 3 precisely) */}
              <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0b1329] py-16 px-6 sm:px-12 text-center relative">
                
                {/* Background image overlay */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none" 
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1607988795691-3d0147b43231?q=80&w=1200')`, filter: 'blur(3px)' }}
                />

                <div className="relative z-10 max-w-4xl mx-auto space-y-6">
                  
                  {/* Top Badge */}
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/20 text-[#35FF90] text-[10px] font-mono tracking-wider uppercase font-black">
                    🏆 HOSTING #1 TERMURAH DENGAN PERFORMA TINGGI
                  </span>

                  {/* Title */}
                  <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
                    {selectedClass === 'lite' && 'Lite Hosting'}
                    {selectedClass === 'medium' && 'Medium Hosting'}
                    {selectedClass === 'premium' && 'Premium Hosting'}
                    {' '}Minecraft
                  </h1>

                  {/* Description */}
                  <p className="text-xs sm:text-sm md:text-base text-gray-300 font-light leading-relaxed max-w-2xl mx-auto">
                    {selectedClass === 'lite' && 'Rasakan hosting server yang terjangkau dengan performa seimbang, sempurna untuk pemula dan lingkungan testing. Handal, ramah kantong, dan kaya fitur.'}
                    {selectedClass === 'medium' && 'Kapasitas performa stabil mumpuni untuk menjalankan modpack ringan maupun plugin-plugin utama. Keseimbangan terbaik antara harga dan kekuatan CPU.'}
                    {selectedClass === 'premium' && 'Kekuatan penuh AMD EPYC modern dengan clock speed turbo melimpah untuk modpack raksasa, custom worlds berat, dan ratusan slot pemain serentak tanpa lag.'}
                  </p>

                  {/* Checkmarks */}
                  <div className="flex flex-wrap justify-center gap-6 text-[11px] font-mono text-gray-400 pt-2">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#35FF90]" />
                      99.9% Uptime
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#35FF90]" />
                      DDoS Protection
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#35FF90]" />
                      24/7 Support
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center flex-wrap gap-4 pt-4">
                    <button
                      onClick={handleScrollToPackages}
                      className="px-6 py-3 bg-[#35FF90] text-[#020617] rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#35FF90]/90 shadow-lg shadow-[#35FF90]/15 cursor-pointer"
                    >
                      Lihat Paket
                    </button>
                    <a
                      href="https://discord.gg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-[#020617] border border-white/10 hover:border-[#35FF90]/30 rounded-xl text-xs font-bold uppercase tracking-wider text-white hover:text-[#35FF90] cursor-pointer"
                    >
                      Bergabung Discord Kami
                    </a>
                  </div>

                </div>
              </div>


              {/* 4. DETAILED SPECIFIC PACKAGES LISTING (Matches Gambar 4 precisely) */}
              <div ref={packagesListRef} className="scroll-mt-24 space-y-12">
                
                {/* Header for Tiering list */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-white/5 pb-6 gap-4 text-left">
                  <div>
                    <h2 className="text-2xl font-black font-display text-white uppercase tracking-tight">
                      Paket {selectedClass === 'lite' && 'Lite'}
                      {selectedClass === 'medium' && 'Medium'}
                      {selectedClass === 'premium' && 'Premium'} Hosting
                    </h2>
                    <p className="text-xs text-gray-400 font-light mt-1 max-w-xl">
                      Harga terjangkau dengan fitur premium. Semua paket termasuk dukungan ahli 24/7, setup instan, dan jaminan uptime 99.9%.
                    </p>
                  </div>
                  
                  {/* Real-time stock status badge */}
                  <div className="inline-flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/20 px-3 py-1.5 rounded-full text-[10px] font-mono text-[#35FF90] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#35FF90] animate-pulse" />
                    <span>Stok Real-Time</span>
                    <RefreshCw className="w-3 h-3 text-[#35FF90] animate-spin-slow cursor-pointer ml-1" />
                  </div>
                </div>

                {/* Card Grid list of RAM sizes tiers */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {getTiersForClass().map((tier, idx) => {
                    const tierName = `${selectedClass?.toUpperCase()} HOSTING ${tier.id}`;
                    return (
                      <div
                        key={tier.id}
                        className="rounded-2xl border border-white/5 hover:border-[#35FF90]/30 bg-[#0b1329] p-6 flex flex-col text-left transition-all duration-300 hover:scale-[1.02] group"
                      >
                        {/* Tersedia badge */}
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-[10px] text-gray-500 font-mono">Product: {tierName}</span>
                          <span className="inline-flex items-center gap-1 bg-emerald-950/40 text-[#35FF90] text-[8px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/25">
                            <span className="w-1 h-1 rounded-full bg-[#35FF90] animate-pulse" />
                            TERSEDIA
                          </span>
                        </div>

                        {/* Title and Price */}
                        <div className="space-y-1 mb-4 pb-4 border-b border-white/5">
                          <h4 className="text-sm font-black font-display text-white tracking-wide">{tierName}</h4>
                          <div className="inline-flex items-baseline gap-1">
                            <span className="text-2xl font-black font-mono text-[#35FF90]">
                              {formatIDR(tier.price)}
                            </span>
                            <span className="text-[10px] text-gray-500 font-mono">/bulan</span>
                          </div>
                        </div>

                        {/* High-visibility pill specs row */}
                        <div className="flex gap-1.5 flex-wrap mb-5">
                          <span className="px-2 py-1 bg-[#020617] border border-white/5 rounded text-[9px] font-mono text-gray-300">
                            {tier.ram} GB
                          </span>
                          <span className="px-2 py-1 bg-[#020617] border border-white/5 rounded text-[9px] font-mono text-gray-300">
                            {tier.storage} GB SSD
                          </span>
                          <span className="px-2 py-1 bg-[#020617] border border-white/5 rounded text-[9px] font-mono text-gray-300 truncate max-w-[130px]">
                            {tier.cores} vCore {tier.cpu.split(' ')[2]}
                          </span>
                        </div>

                        {/* Specs Checklist */}
                        <ul className="space-y-2 flex-1 text-xs text-gray-400 font-light mb-6">
                          <li className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-[#35FF90]" />
                            <span>{tier.ram} GB Dedicated RAM</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-[#35FF90]" />
                            <span>{tier.storage} GB Enterprise NVMe SSD</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-[#35FF90]" />
                            <span>{tier.cores} vCore {tier.cpu}</span>
                          </li>
                        </ul>

                        {/* CTA Order Button */}
                        <button
                          onClick={() => handleSewaNow(tier)}
                          className="w-full py-3 rounded-xl bg-emerald-950/20 hover:bg-[#35FF90]/15 text-[#35FF90] border border-[#35FF90]/25 hover:border-[#35FF90]/50 text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer text-center"
                        >
                          Sewa Sekarang
                        </button>
                      </div>
                    );
                  })}
                </div>

              </div>

            </motion.div>
          )}

        </AnimatePresence>

        {/* 5. CONFIGURATOR WORKSPACE FOR BOTH MODAL AND INTEGRATED FLOW */}
        <div ref={configSectionRef} className="scroll-mt-24 mt-20">
          <AnimatePresence>
            {selectedConfigPkg && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                className="rounded-3xl border border-[#35FF90]/20 bg-[#0b1329] p-6 sm:p-10 relative overflow-hidden shadow-2xl shadow-[#35FF90]/5 text-left"
              >
                {/* Accent top edge line */}
                <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#35FF90] via-emerald-400 to-[#35FF90]/20" />
                
                {/* Header Title */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-6 mb-8 gap-4">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-[#35FF90] font-black uppercase flex items-center gap-1.5">
                      <Terminal className="w-3 h-3 animate-pulse" />
                      Step 2: CONFIGURATION BUILDER
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1 uppercase font-display">
                      Konfigurasikan Minecraft Server Anda
                    </h3>
                  </div>
                  <button 
                    onClick={() => setSelectedConfigPkg(null)}
                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Batal Pilih
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                  
                  {/* Left Column: Form Settings Inputs */}
                  <form onSubmit={handleCheckoutConfiguredServer} className="lg:col-span-8 space-y-6">
                    
                    {/* INPUT 1: Server name */}
                    <div>
                      <label className="block text-xs font-mono font-bold tracking-wider text-gray-400 uppercase mb-2">
                        1. Nama Server Minecraft Anda
                      </label>
                      <input
                        type="text"
                        value={configServerName}
                        onChange={(e) => setConfigServerName(e.target.value)}
                        placeholder="Contoh: Survival Server ID"
                        className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-[#35FF90]/40 font-mono tracking-wide"
                        required
                      />
                      <p className="text-[10px] text-gray-500 font-sans mt-1">Nama ini digunakan untuk identifikasi di list server Anda.</p>
                    </div>

                    {/* INPUT 2: Server Software Engine */}
                    <div>
                      <label className="block text-xs font-mono font-bold tracking-wider text-gray-400 uppercase mb-2">
                        2. Pilih Software / Game Engine
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {[
                          { name: 'PaperMC', sub: 'Ringan, Stabil' },
                          { name: 'Purpur', sub: 'Performa Terbaik' },
                          { name: 'Fabric', sub: 'Modded Ringan' },
                          { name: 'Forge', sub: 'Mods Berat' },
                          { name: 'Spigot', sub: 'Standar Plugins' },
                          { name: 'Vanilla', sub: 'Asli Minecraft' },
                          { name: 'Bedrock PE', sub: 'Pocket Edition Mobile' }
                        ].map((soft) => (
                          <button
                            key={soft.name}
                            type="button"
                            onClick={() => setConfigSoftware(soft.name)}
                            className={`p-3 rounded-xl border transition-all text-left flex flex-col justify-between h-20 cursor-pointer ${
                              configSoftware === soft.name
                                ? 'bg-[#35FF90]/10 border-[#35FF90] text-[#35FF90] shadow-sm'
                                : 'bg-[#020617] border-white/5 text-gray-400 hover:border-white/15 hover:text-white'
                            }`}
                          >
                            <span className="text-xs font-bold block">{soft.name}</span>
                            <span className="text-[9px] text-gray-500 font-mono font-light block leading-none">{soft.sub}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* INPUT 3: Billing Cycle Durasi */}
                    <div>
                      <label className="block text-xs font-mono font-bold tracking-wider text-gray-400 uppercase mb-2">
                        3. Siklus Tagihan (Billing Cycle)
                      </label>
                      <div className="grid grid-cols-3 gap-3 font-mono text-xs text-center">
                        {[
                          { val: 1, label: '1 Bulan', disc: 'Harga Normal' },
                          { val: 3, label: '3 Bulan', disc: 'Diskon 5%' },
                          { val: 6, label: '6 Bulan', disc: 'Diskon 15%!' }
                        ].map((cycle) => (
                          <button
                            key={cycle.val}
                            type="button"
                            onClick={() => setConfigDuration(cycle.val)}
                            className={`p-3 rounded-xl border flex flex-col items-center justify-center cursor-pointer ${
                              configDuration === cycle.val
                                ? 'bg-[#35FF90]/10 border-[#35FF90] text-[#35FF90]'
                                : 'bg-[#020617] border-white/5 text-gray-400 hover:border-white/15 hover:text-white'
                            }`}
                          >
                            <span className="font-bold">{cycle.label}</span>
                            <span className={`text-[9px] mt-1 ${configDuration === cycle.val ? 'text-emerald-400' : 'text-gray-500'}`}>
                              {cycle.disc}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* INPUT 4: Optional Addons */}
                    <div>
                      <label className="block text-xs font-mono font-bold tracking-wider text-gray-400 uppercase mb-2">
                        4. Layanan Tambahan (Add-ons)
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3 bg-[#020617] border border-white/5 p-3.5 rounded-xl cursor-pointer hover:border-white/10">
                          <input
                            type="checkbox"
                            checked={addonPort}
                            onChange={(e) => setAddonPort(e.target.checked)}
                            className="w-4 h-4 rounded text-[#35FF90] accent-[#35FF90]"
                          />
                          <div className="text-xs text-left">
                            <span className="font-bold text-white block">Dedicated Port IP (25565)</span>
                            <span className="text-[10px] text-gray-400 font-light block mt-0.5">Mendapatkan IP port utama standard Minecraft tanpa tambahan port acak (+Rp 10.000 / bln)</span>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 bg-[#020617] border border-white/5 p-3.5 rounded-xl cursor-pointer hover:border-white/10">
                          <input
                            type="checkbox"
                            checked={addonBackup}
                            onChange={(e) => setAddonBackup(e.target.checked)}
                            className="w-4 h-4 rounded text-[#35FF90] accent-[#35FF90]"
                          />
                          <div className="text-xs text-left">
                            <span className="font-bold text-white block">Backup Harian & Auto Restore</span>
                            <span className="text-[10px] text-gray-400 font-light block mt-0.5">Backup otomatis harian yang disimpan aman di cloud storage backup (+Rp 5.000 / bln)</span>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 bg-[#020617] border border-white/5 p-3.5 rounded-xl cursor-pointer hover:border-white/10">
                          <input
                            type="checkbox"
                            checked={addonSupport}
                            onChange={(e) => setAddonSupport(e.target.checked)}
                            className="w-4 h-4 rounded text-[#35FF90] accent-[#35FF90]"
                          />
                          <div className="text-xs text-left">
                            <span className="font-bold text-white block">Dukungan VIP & Setup Bantuan</span>
                            <span className="text-[10px] text-gray-400 font-light block mt-0.5">Antrean support prioritas utama dan bantuan pemindahan file gratis (+Rp 7.500 / bln)</span>
                          </div>
                        </label>
                      </div>
                    </div>

                  </form>

                  {/* Right Column: Receipt Payment Summary */}
                  <div className="lg:col-span-4 bg-[#020617] border border-white/10 rounded-2xl p-6 space-y-6 sticky top-24">
                    
                    <div>
                      <span className="text-[9px] font-mono bg-[#35FF90]/15 text-[#35FF90] font-black px-2.5 py-1 rounded-md tracking-wider">
                        RINCIAN PEMBAYARAN
                      </span>
                      <h4 className="text-sm font-black font-display text-white mt-3 uppercase tracking-wider">
                        {selectedConfigPkg.name}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-mono mt-1">
                        Specs: {selectedConfigPkg.cpu} | {configRegion.split(' ')[1] || 'Global'}
                      </p>
                    </div>

                    <div className="border-t border-white/5 pt-4 space-y-3.5 text-xs font-mono">
                      
                      <div className="flex justify-between text-gray-400">
                        <span>Sewa Base:</span>
                        <span className="text-white font-bold">{formatIDR(selectedConfigPkg.price)}/GB</span>
                      </div>

                      <div className="flex justify-between text-gray-400">
                        <span>Alokasi RAM:</span>
                        <span className="text-white font-bold">{configRam} GB</span>
                      </div>

                      <div className="flex justify-between text-gray-400">
                        <span>Durasi Sewa:</span>
                        <span className="text-[#35FF90] font-black">{configDuration} Bulan</span>
                      </div>

                      {(addonPort || addonBackup || addonSupport) && (
                        <div className="border-t border-white/5 pt-3.5 space-y-2">
                          <span className="text-[9px] text-gray-500 font-bold uppercase block">Add-ons Aktif:</span>
                          {addonPort && (
                            <div className="flex justify-between text-[11px] text-gray-400">
                              <span>• Dedicated Port:</span>
                              <span className="text-white">{formatIDR(10000 * configDuration)}</span>
                            </div>
                          )}
                          {addonBackup && (
                            <div className="flex justify-between text-[11px] text-gray-400">
                              <span>• Cloud Backups:</span>
                              <span className="text-white">{formatIDR(5000 * configDuration)}</span>
                            </div>
                          )}
                          {addonSupport && (
                            <div className="flex justify-between text-[11px] text-gray-400">
                              <span>• Bantuan VIP:</span>
                              <span className="text-white">{formatIDR(7500 * configDuration)}</span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="border-t border-white/5 pt-3.5 flex justify-between text-gray-300">
                        <span>Harga Kotor:</span>
                        <span>{formatIDR((selectedConfigPkg.price * configRam + (addonPort ? 10000 : 0) + (addonBackup ? 5000 : 0) + (addonSupport ? 7500 : 0)) * configDuration)}</span>
                      </div>

                      {getCalculatedPricing().discount > 0 && (
                        <div className="flex justify-between text-red-400 font-bold">
                          <span>Potongan Harga:</span>
                          <span>-{formatIDR(getCalculatedPricing().discount)}</span>
                        </div>
                      )}

                    </div>

                    <div className="bg-[#0b1329] rounded-xl p-4 border border-[#35FF90]/15 text-center">
                      <span className="text-[10px] text-gray-400 font-mono block">TOTAL HARGA SEWA</span>
                      <span className="text-2xl font-black font-mono text-[#35FF90] block mt-1">
                        {formatIDR(getCalculatedPricing().grandTotal)}
                      </span>
                    </div>

                    {configError && (
                      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-[11px] text-red-400 font-bold font-mono text-center">
                        {configError}
                      </div>
                    )}

                    {configSuccess && (
                      <div className="p-3 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-[11px] text-[#35FF90] font-black font-mono animate-pulse text-center">
                        {configSuccess}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleCheckoutConfiguredServer}
                      className="w-full py-4 bg-[#35FF90] hover:bg-[#35FF90]/90 text-[#020617] font-black text-xs rounded-xl tracking-wider uppercase shadow-[0_0_15px_rgba(53,255,144,0.35)] transition-all transform active:scale-95 duration-200 cursor-pointer"
                    >
                      SEWA & DEPLOY SERVER SEKARANG
                    </button>

                    <p className="text-[9px] text-gray-500 text-center leading-normal">
                      Server di-deploy secara real-time di node panel Pterodactyl. Saldo Anda akan langsung didebet aman sesuai dengan rincian di atas.
                    </p>

                  </div>

                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
