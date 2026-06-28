import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, Shield, Cpu, HardDrive, MapPin, Zap, AlertCircle, 
  ShoppingCart, ArrowUpRight, HelpCircle, Layers, Star, MessageSquare, Play, Info
} from 'lucide-react';
import { MinecraftPackage, User } from '../types';

interface HostingPlansProps {
  packages: MinecraftPackage[];
  currentUser: User | null;
  onOrderClick: (pkg: MinecraftPackage, selectedRam: number) => void;
  onOpenAuth: () => void;
}

type ClassType = 'standar' | 'medium' | 'prime';

export default function HostingPlans({
  packages,
  currentUser,
  onOrderClick,
  onOpenAuth
}: HostingPlansProps) {
  const [activeClass, setActiveClass] = useState<ClassType>('standar');
  const pricingSectionRef = useRef<HTMLDivElement>(null);

  // Sync tab with URL hash if present
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.includes('medium')) {
        setActiveClass('medium');
      } else if (hash.includes('prime') || hash.includes('premium')) {
        setActiveClass('prime');
      } else if (hash.includes('standar') || hash.includes('lite')) {
        setActiveClass('standar');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    
    // Scroll to top on mount
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const handleScrollToPricing = () => {
    if (pricingSectionRef.current) {
      pricingSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Get master package details
  const currentMasterPkg = packages.find(p => p.id === activeClass) || packages[0];

  // Config parameters for each class
  const classConfigs = {
    standar: {
      id: 'lite',
      title: 'Lite Hosting Minecraft',
      tagline: 'Hosting #1 termurah dengan performa tinggi',
      subtitle: 'Rasakan hosting server yang terjangkau dengan performa seimbang, sempurna untuk pemula dan lingkungan testing. Handal, ramah kantong, dan kaya fitur.',
      cpu: 'Intel Platinum 8370C (Up to 3.5 GHz)',
      region: 'Region Hongkong (HK Node)',
      basePrice: 6000,
      themeColor: '#00E5FF', // Electric Cyan
      glowShadow: 'shadow-[0_0_50px_rgba(0,229,255,0.15)]',
      textAccent: 'text-cyan-400',
      btnBg: 'bg-cyan-500 hover:bg-cyan-400 text-slate-900',
      badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      badgeGlow: 'shadow-[0_0_15px_rgba(0,229,255,0.25)]',
      accentBorder: 'border-cyan-500/30',
      hoverAccentBorder: 'hover:border-cyan-400',
      gradientFrom: 'from-cyan-500/20',
      getCores: (ram: number) => {
        if (ram <= 4) return 1;
        if (ram <= 8) return 2;
        if (ram <= 12) return 3;
        return 4;
      },
      getStorage: (ram: number) => ram * 10,
    },
    medium: {
      id: 'medium',
      title: 'Medium Hosting Minecraft',
      tagline: 'Performa AMD EPYC stabil mumpuni tanpa lag',
      subtitle: 'Kapasitas performa stabil mumpuni untuk menjalankan modpack ringan maupun plugin-plugin utama. Keseimbangan terbaik antara harga dan kekuatan CPU.',
      cpu: 'AMD EPYC 7351 (Up to 3.0 GHz)',
      region: 'Region Indonesia (Cyber DC Jakarta)',
      basePrice: 10000,
      themeColor: '#D500F9', // Neon Purple
      glowShadow: 'shadow-[0_0_50px_rgba(213,0,249,0.15)]',
      textAccent: 'text-purple-400',
      btnBg: 'bg-purple-600 hover:bg-purple-500 text-white',
      badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      badgeGlow: 'shadow-[0_0_15px_rgba(213,0,249,0.25)]',
      accentBorder: 'border-purple-500/30',
      hoverAccentBorder: 'hover:border-purple-400',
      gradientFrom: 'from-purple-500/20',
      getCores: (ram: number) => {
        if (ram <= 2) return 1;
        if (ram <= 6) return 2;
        if (ram <= 10) return 3;
        return 4;
      },
      getStorage: (ram: number) => ram * 15,
    },
    prime: {
      id: 'premium',
      title: 'Premium Hosting Ryzen 9',
      tagline: 'Kasta Tertinggi Minecraft Hosting di Indonesia',
      subtitle: 'Kekuatan penuh AMD Ryzen 9 5950X modern dengan clock speed turbo melimpah untuk modpack raksasa, custom worlds berat, dan ratusan slot pemain serentak tanpa lag.',
      cpu: 'Ryzen 9 5950X (Up to 4.9 GHz)',
      region: 'Region Indonesia (Cyber DC Jakarta)',
      basePrice: 15000,
      themeColor: '#FF9100', // Gold/Orange
      glowShadow: 'shadow-[0_0_50px_rgba(255,145,0,0.15)]',
      textAccent: 'text-amber-400',
      btnBg: 'bg-amber-500 hover:bg-amber-400 text-slate-900',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      badgeGlow: 'shadow-[0_0_15px_rgba(255,145,0,0.25)]',
      accentBorder: 'border-amber-500/30',
      hoverAccentBorder: 'hover:border-amber-400',
      gradientFrom: 'from-amber-500/20',
      getCores: (ram: number) => {
        if (ram <= 4) return 2;
        if (ram <= 8) return 3;
        if (ram <= 12) return 4;
        return 6;
      },
      getStorage: (ram: number) => ram * 20,
    }
  };

  const config = classConfigs[activeClass];

  // Generate 1 to 16 GB RAM tiers sequentially
  const ramTiers = Array.from({ length: 16 }, (_, i) => {
    const ram = i + 1;
    const cores = config.getCores(ram);
    const storage = config.getStorage(ram);
    const price = config.basePrice * ram;
    return {
      ram,
      cores,
      storage,
      price,
      cpu: config.cpu,
      region: config.region
    };
  });

  return (
    <div className="bg-[#020617] text-white min-h-screen relative overflow-hidden font-sans">
      
      {/* 1. HERO SECTION - Identical to NexusCloud style screenshots */}
      <section className="relative pt-36 pb-28 flex items-center min-h-[90vh]">
        
        {/* Dynamic Glowing Ambient Spheres */}
        <div className="absolute top-1/4 left-1/10 w-[450px] h-[450px] rounded-full blur-[150px] opacity-20 pointer-events-none transition-all duration-700"
          style={{ backgroundColor: config.themeColor }} />
        <div className="absolute bottom-10 right-1/10 w-[350px] h-[350px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none" />

        {/* Dynamic Grid Background Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column Content */}
            <div className="lg:col-span-7 text-left space-y-6">
              
              {/* Pulsing Header Badge */}
              <motion.div 
                key={`${activeClass}-badge`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-black uppercase tracking-wider border bg-slate-900/80 ${config.badgeBg} ${config.badgeGlow}`}
              >
                <Star className="w-3.5 h-3.5 fill-current animate-pulse" />
                <span>{config.tagline}</span>
              </motion.div>

              {/* Master Display Heading */}
              <motion.h1 
                key={`${activeClass}-title`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight leading-none uppercase text-white"
              >
                {config.title.split(' ')[0]} <span style={{ color: config.themeColor }} className="transition-colors duration-500">{config.title.split(' ').slice(1).join(' ')}</span>
              </motion.h1>

              {/* Tag Description */}
              <motion.p 
                key={`${activeClass}-desc`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed max-w-2xl"
              >
                {config.subtitle}
              </motion.p>

              {/* Core Features Checklines */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] sm:text-xs font-mono font-bold text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>99.9% Uptime</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>DDoS Protection</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>24/7 Support</span>
                </div>
              </div>

              {/* Hero Call To Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={handleScrollToPricing}
                  className={`px-8 py-4 rounded-2xl font-mono text-xs font-black tracking-widest uppercase flex items-center gap-2.5 shadow-lg hover:scale-105 transition-all cursor-pointer ${config.btnBg}`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Lihat Paket</span>
                </button>
                <a
                  href="https://discord.gg/mavixstore"
                  target="_blank"
                  rel="noreferrer"
                  className="px-8 py-4 rounded-2xl font-mono text-xs font-black tracking-widest uppercase flex items-center gap-2.5 bg-slate-900 border border-white/10 hover:border-white/20 hover:bg-slate-800 transition-all text-slate-300 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-[#5865F2]" />
                  <span>Discord Kami</span>
                </a>
              </div>

            </div>

            {/* Right Column Visual 3D Graphic Mock */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              
              {/* Backglow mesh */}
              <div className="absolute w-72 h-72 rounded-full filter blur-[80px] opacity-30 animate-pulse pointer-events-none"
                style={{ backgroundColor: config.themeColor }} />

              {/* Graphic container */}
              <div className="relative w-72 sm:w-80 h-96 rounded-3xl border border-white/5 bg-[#0b122e]/60 backdrop-blur-xl p-6 flex flex-col justify-between overflow-hidden shadow-2xl">
                
                {/* Floating blocks abstract */}
                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full border border-white/5 pointer-events-none" />
                <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full border border-white/5 pointer-events-none" />

                {/* Floating code block representing active config */}
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/50" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">mavix-node.conf</span>
                  </div>
                  
                  <div className="space-y-2 font-mono text-[10px] text-slate-400">
                    <p><span className="text-[#35FF90]">system_class</span> = "{activeClass.toUpperCase()}"</p>
                    <p><span className="text-[#35FF90]">processor_core</span> = "{config.cpu}"</p>
                    <p><span className="text-[#35FF90]">datacenter_location</span> = "{config.region}"</p>
                    <p><span className="text-[#35FF90]">allocation_range</span> = "1GB - 16GB RAM"</p>
                    <p><span className="text-[#35FF90]">setup_trigger</span> = "INSTANT_PROVISION"</p>
                    <p><span className="text-[#35FF90]">ddos_status</span> = "SHIELD_GATEWAY_ACTIVE"</p>
                  </div>
                </div>

                <div className="space-y-3 relative z-10 border-t border-white/5 pt-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300">
                      <Cpu className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-[10px] text-slate-500 font-mono leading-none">CPU ARCHITECTURE</h4>
                      <p className="text-xs font-bold text-white mt-1">{config.cpu.split(' ')[0]} {config.cpu.split(' ')[1] || ''}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300">
                      <MapPin className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-[10px] text-slate-500 font-mono leading-none">NETWORK GATEWAY</h4>
                      <p className="text-xs font-bold text-white mt-1">{config.region.replace('Region ', '')}</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 2. SPEC CATEGORY TOGGLER SUB-NAV - Floats beautifully on screen boundary */}
      <div className="sticky top-[72px] z-30 bg-[#020617]/80 backdrop-blur-md border-y border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6 flex-wrap md:flex-nowrap">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="font-mono text-[10px] font-bold tracking-widest text-slate-400 uppercase">Pilih Spesifikasi Paket:</span>
          </div>

          <div className="grid grid-cols-3 p-1 bg-[#0b122e] border border-white/5 rounded-2xl w-full md:w-auto md:min-w-[480px]">
            {(['standar', 'medium', 'prime'] as ClassType[]).map((cls) => {
              const isSel = activeClass === cls;
              const itemConf = classConfigs[cls];
              return (
                <button
                  key={cls}
                  onClick={() => {
                    setActiveClass(cls);
                    window.location.hash = cls;
                    handleScrollToPricing();
                  }}
                  className={`py-3 px-4 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider transition-all duration-300 relative cursor-pointer flex flex-col items-center justify-center gap-0.5`}
                  style={{ color: isSel ? itemConf.themeColor : '#64748B' }}
                >
                  {isSel && (
                    <motion.div
                      layoutId="active-plan-tab-bg-v2"
                      className="absolute inset-0 bg-white/5 rounded-xl border border-white/10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{cls === 'standar' ? 'Lite/Standar' : cls === 'medium' ? 'Medium' : 'Ryzen 9 Prime'}</span>
                  <span className="text-[8px] font-mono font-bold text-gray-500 relative z-10 leading-none mt-0.5">
                    {cls === 'standar' ? 'Rp6K/GB' : cls === 'medium' ? 'Rp10K/GB' : 'Rp15K/GB'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. DYNAMIC PRICING CARDS SECTION - 16 GB Sequential, NexusCloud ID exact replication */}
      <section ref={pricingSectionRef} id="pricing-section" className="py-24 bg-[#040a21] relative z-10 border-t border-white/5">
        
        {/* Glow ambient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-full bg-[radial-gradient(circle_at_center,rgba(53,255,144,0.02)_0,transparent_60%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            
            <div className="inline-flex items-center gap-1.5 bg-[#0b122e] border border-white/10 rounded-full px-4 py-1.5 text-[10px] font-mono font-bold tracking-widest text-[#35FF90] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#35FF90] animate-ping" />
              <span>STOK REAL-TIME AKTIF</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight leading-tight uppercase">
              PAKET {config.title.toUpperCase()}
            </h2>
            
            <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
              Spesifikasi hardware terisolasi penuh dengan kontrol panel Pterodactyl instan. Pilih alokasi RAM berkelanjutan dari <strong className="text-white font-bold">1 GB hingga 16 GB</strong> untuk efisiensi budget server Minecraft Anda.
            </p>
          </div>

          {/* Pricing Grid Layout - 16 consecutive tiers, gorgeous cards matching NexusCloud */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ramTiers.map((tier) => {
              const label = `${config.id.toUpperCase()} HOSTING ${tier.ram}`;
              const productCode = `Product: ${label}`;

              return (
                <motion.div
                  key={tier.ram}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                  className={`group relative overflow-hidden rounded-3xl bg-[#080d24]/90 border border-white/5 hover:border-slate-700 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:${config.glowShadow}`}
                >
                  
                  {/* Subtle top decoration bar glowing in theme color */}
                  <div className="absolute top-0 inset-x-0 h-1 transition-all duration-300 group-hover:opacity-100 opacity-50"
                    style={{ backgroundColor: config.themeColor }} />

                  {/* Card Content Top part */}
                  <div className="space-y-4 text-left">
                    
                    {/* Header + Available Badge */}
                    <div className="flex justify-between items-center gap-2">
                      <h3 className="font-display font-black text-white text-base tracking-tight uppercase truncate">
                        {label}
                      </h3>
                      <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-2.5 py-0.5 text-[8px] font-mono font-bold tracking-wider uppercase">
                        <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                        Tersedia
                      </span>
                    </div>

                    {/* Product ID Label */}
                    <p className="text-[10px] text-slate-500 font-mono leading-none">
                      {productCode}
                    </p>

                    {/* Price Tag with clean dynamic numbering */}
                    <div className="pt-2 border-t border-white/5 pb-2">
                      <span className="text-2xl sm:text-3xl font-black font-mono text-[#35FF90] tracking-tight">
                        {formatIDR(tier.price)}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono ml-1">/ bulan</span>
                    </div>

                    {/* Specifications badges row */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[9px] font-mono text-slate-300 font-bold">
                        {tier.ram} GB
                      </span>
                      <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[9px] font-mono text-slate-300 font-bold">
                        {tier.storage} GB NVMe
                      </span>
                      <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[9px] font-mono text-slate-300 font-bold truncate max-w-[120px]">
                        {tier.cores} vCore
                      </span>
                    </div>

                    {/* Bullets Specification List with icons */}
                    <ul className="space-y-2.5 pt-4 text-[10px] sm:text-xs font-sans text-slate-300">
                      <li className="flex items-center gap-2.5 leading-none">
                        <Layers className="w-4 h-4 text-slate-500 group-hover:text-[#35FF90] shrink-0 transition-colors" />
                        <span><strong>{tier.ram} GB</strong> Dedicated DDR4 RAM</span>
                      </li>
                      <li className="flex items-center gap-2.5 leading-none">
                        <HardDrive className="w-4 h-4 text-slate-500 group-hover:text-[#35FF90] shrink-0 transition-colors" />
                        <span><strong>{tier.storage} GB</strong> NVMe SSD Storage</span>
                      </li>
                      <li className="flex items-center gap-2.5 leading-none">
                        <Cpu className="w-4 h-4 text-slate-500 group-hover:text-[#35FF90] shrink-0 transition-colors" />
                        <span><strong>{tier.cores} vCPU Cores</strong> Dedicated</span>
                      </li>
                      <li className="flex items-center gap-2.5 leading-none">
                        <Zap className="w-4 h-4 text-slate-500 group-hover:text-[#35FF90] shrink-0 transition-colors" />
                        <span>Instan Pterodactyl Provision</span>
                      </li>
                      <li className="flex items-center gap-2.5 leading-none">
                        <Shield className="w-4 h-4 text-slate-500 group-hover:text-[#35FF90] shrink-0 transition-colors" />
                        <span>Anti-DDoS Mitigated Network</span>
                      </li>
                    </ul>

                  </div>

                  {/* Order Button inside Card */}
                  <div className="pt-6 mt-6 border-t border-white/5">
                    <button
                      onClick={() => {
                        if (!currentUser) {
                          onOpenAuth();
                        } else {
                          onOrderClick(currentMasterPkg, tier.ram);
                        }
                      }}
                      className="w-full py-3.5 rounded-2xl font-mono text-[10px] font-black tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer text-slate-900 bg-white group-hover:bg-[#35FF90]"
                      style={{ 
                        backgroundColor: '#FFFFFF',
                        color: '#020617'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = config.themeColor;
                        e.currentTarget.style.boxShadow = `0 0 20px ${config.themeColor}80`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Sewa Sekarang</span>
                    </button>
                  </div>

                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. QUALITY GUARANTEES FEATURES BAR (NexusCloud style features footer) */}
      <section className="py-24 bg-[#020617] border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              {
                icon: Shield,
                title: '99.9% Uptime SLA Guarantee',
                desc: 'Infrastruktur datacenter tier III kami ditenagai dengan redundansi pasokan daya ganda N+1 untuk menjamin server Anda terus menyala tanpa interupsi.'
              },
              {
                icon: Zap,
                title: 'Instant Automated Provisioning',
                desc: 'Server Anda akan otomatis terinstal dan menyala di panel Pterodactyl kami seketika setelah pembayaran tagihan saldo store diverifikasi oleh sistem.'
              },
              {
                icon: HelpCircle,
                title: '24/7/365 Professional Support',
                desc: 'Butuh bantuan optimasi atau penanganan server Minecraft? Tim administrasi senior kami siaga membantu menyelesaikan masalah Anda kapan saja.'
              }
            ].map((feat, idx) => {
              const IconComponent = feat.icon;
              return (
                <div key={idx} className="bg-[#0b122e] border border-white/5 rounded-3xl p-6 space-y-4 hover:border-slate-700 transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-[#35FF90]/10 border border-[#35FF90]/20 flex items-center justify-center text-[#35FF90]">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-black font-display text-white uppercase tracking-wider">
                    {feat.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

    </div>
  );
}
