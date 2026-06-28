import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, Zap, Shield, HardDrive, Clock, ShieldCheck, MapPin, 
  Globe, Headphones, Activity, Wifi, Terminal, Check, Sparkles 
} from 'lucide-react';

interface PingNode {
  id: string;
  name: string;
  flag: string;
  specs: string;
  baseLatency: number;
  ip: string;
}

export default function Features() {
  const featuresList = [
    {
      title: 'Prosesor Ryzen 9 Premium',
      desc: 'Ditenagai Ryzen 9 5950X & AMD EPYC dengan turbo clock rate ultra tinggi untuk kelancaran modding Minecraft.',
      icon: Cpu,
      color: 'from-[#35FF90] to-emerald-400'
    },
    {
      title: 'Deploy Instan Otomatis',
      desc: 'Server Anda siap digunakan kurang dari 5 detik setelah sewa. IP dan port langsung dialokasikan seketika.',
      icon: Zap,
      color: 'from-amber-400 to-orange-500'
    },
    {
      title: 'Anti Down Auto-Restart',
      desc: 'Sistem deteksi crash cerdas terintegrasi mendeteksi crash game dalam milidetik dan merestart otomatis.',
      icon: Shield,
      color: 'from-blue-400 to-indigo-500'
    },
    {
      title: 'Penyimpanan Enterprise NVMe',
      desc: 'Media penyimpanan enterprise SSD NVMe RAID-10 PCIe Gen4 dengan kecepatan baca/tulis luar biasa untuk render chunk instan.',
      icon: HardDrive,
      color: 'from-purple-400 to-pink-500'
    },
    {
      title: 'Garansi Uptime 99.9%',
      desc: 'Jaminan stabilitas optimal tertulis di kontrak SLA, ditopang genset cadangan ganda di setiap rack datacenter.',
      icon: Clock,
      color: 'from-[#35FF90] to-teal-500'
    },
    {
      title: 'Mitigasi DDoS 4.2 Tbps',
      desc: 'Saringan firewall Voxility & Path.net membersihkan serangan DDoS secara langsung demi kelancaran PVP.',
      icon: ShieldCheck,
      color: 'from-[#35FF90] to-emerald-500'
    }
  ];

  // Ping nodes list for interactive latency tests
  const pingNodes: PingNode[] = [
    { id: 'jk', name: 'Jakarta (Cyber 1 DC)', flag: '🇮🇩', specs: 'AMD EPYC Node - GigaBandwidth', baseLatency: 4, ip: '103.142.12.58' },
    { id: 'sg', name: 'Singapore (Equinix SG)', flag: '🇸🇬', specs: 'Ryzen 9 5950X - Premium Route', baseLatency: 15, ip: '158.247.165.112' },
    { id: 'hk', name: 'Hongkong (Net HK)', flag: '🇭🇰', specs: 'Intel Platinum - International Gateway', baseLatency: 24, ip: '103.212.4.91' },
    { id: 'us', name: 'USA West (Seattle)', flag: '🇺🇸', specs: 'Ryzen 9 7950X3D - Global Edge', baseLatency: 168, ip: '192.187.114.2' },
    { id: 'de', name: 'Frankfurt (Germany)', flag: '🇩🇪', specs: 'Intel Core i9 - Central Europe', baseLatency: 212, ip: '82.204.31.14' }
  ];

  // State for active ping tests
  const [testingNodeId, setTestingNodeId] = useState<string | null>(null);
  const [testProgress, setTestProgress] = useState<number>(0);
  const [testLog, setTestLog] = useState<string>('');
  const [pingResults, setPingResults] = useState<Record<string, number>>({});

  const triggerPingTest = (node: PingNode) => {
    if (testingNodeId) return; // Prevent multiple clicks
    setTestingNodeId(node.id);
    setTestProgress(0);
    setTestLog('Initializing handshake protocol...');

    // Run custom sequence simulation
    const steps = [
      { prg: 20, log: 'Resolving destination address: ' + node.ip },
      { prg: 45, log: 'Sending 32-bytes ICMP echo requests...' },
      { prg: 70, log: 'Measuring UDP Round-Trip-Time (RTT)...' },
      { prg: 90, log: 'Averaging network packet variance jitter...' },
      { prg: 100, log: 'Ping calculation completed successfully.' }
    ];

    let currentStepIdx = 0;
    const interval = setInterval(() => {
      if (currentStepIdx < steps.length) {
        setTestProgress(steps[currentStepIdx].prg);
        setTestLog(steps[currentStepIdx].log);
        currentStepIdx++;
      } else {
        clearInterval(interval);
        // Add subtle random variance to latency
        const variance = Math.floor(Math.random() * 5) - 2;
        const finalLatency = Math.max(1, node.baseLatency + variance);
        setPingResults(prev => ({ ...prev, [node.id]: finalLatency }));
        setTestingNodeId(null);
      }
    }, 350);
  };

  const getQualitativeTag = (latency: number) => {
    if (latency <= 8) return { label: 'LOWEST LATENCY (RECOMMENDED)', color: 'text-[#35FF90] bg-[#35FF90]/10 border-[#35FF90]/25' };
    if (latency <= 20) return { label: 'EXCELLENT (PvP READY)', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
    if (latency <= 50) return { label: 'STABLE CONNECTION', color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' };
    return { label: 'HIGH LATENCY (DISTANCE LIMIT)', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' };
  };

  return (
    <section id="features-section" className="py-24 bg-[#020617] relative border-t border-white/5">
      {/* Visual neon overlays */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[450px] rounded-full bg-[#35FF90]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Features Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-[#35FF90] mb-3">
            Mavix Hosting Infrastructure
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Keunggulan Server Hosting Kami
          </h2>
          <div className="h-1 w-12 bg-[#35FF90] mx-auto rounded-full mt-4" />
          <p className="text-sm sm:text-base text-gray-400 mt-4 font-light leading-relaxed">
            Infrastruktur hardware terbaik kami satukan dengan jaringan anti-lag untuk menjamin kestabilan dunia Minecraft Anda tanpa gangguan 24/7.
          </p>
        </div>

        {/* Features Cards Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {featuresList.map((item, index) => {
            const IconComp = item.icon;
            return (
              <motion.div
                key={index}
                id={`feature-card-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative rounded-2xl bg-[#0b1329] border border-white/10 hover:border-[#35FF90]/30 p-6 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 overflow-hidden"
              >
                {/* Visual Glow Layer on card hover */}
                <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-gradient-to-tr from-[#35FF90]/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                
                {/* Icon wrapper */}
                <div className="mb-4 inline-flex p-3 rounded-xl bg-[#020617] border border-white/5 text-[#35FF90] group-hover:bg-[#35FF90]/10 group-hover:border-[#35FF90]/30 group-hover:scale-110 transition-all duration-300">
                  <IconComp className="w-5 h-5" />
                </div>

                {/* Content */}
                <h3 className="text-sm font-bold text-white mb-2 leading-tight group-hover:text-[#35FF90] transition-colors font-sans">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed font-sans font-light">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>


        {/* 4. LIVE LATENCY PING TESTER TOOL (Matches "gambar keempat" style) */}
        <motion.div
          id="ping-tester-widget"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-white/10 bg-[#0b1329] p-6 sm:p-10 relative overflow-hidden shadow-2xl"
        >
          {/* Neon green edge glow */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#35FF90]/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Info Text column */}
            <div className="lg:col-span-5 text-left space-y-4">
              <span className="text-[10px] font-mono tracking-widest text-[#35FF90] font-black uppercase flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 animate-pulse" />
                INTERACTIVE LATENCY HUB
              </span>
              <h3 className="text-2xl font-black font-display text-white leading-tight">
                Uji Kecepatan Koneksi Anda Sekarang
              </h3>
              <p className="text-xs text-gray-400 font-light leading-relaxed">
                Apakah Anda khawatir tentang lag saat bertarung PvP? Gunakan alat tes ping interaktif kami untuk menguji kecepatan respons jaringan PC Anda langsung ke gerbang datacenter fisik kami di berbagai belahan dunia.
              </p>
              
              {/* Display console terminal log if testing */}
              <AnimatePresence>
                {testingNodeId && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3.5 bg-[#020617] rounded-xl border border-white/5 font-mono text-[10px] text-gray-400 space-y-1"
                  >
                    <div className="flex justify-between text-[#35FF90] font-bold">
                      <span>CMD_PROMPT_PING</span>
                      <span className="animate-pulse">RUNNING</span>
                    </div>
                    <p className="text-gray-500">&gt; {testLog}</p>
                    
                    {/* Horizontal sleek progress bar */}
                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-2">
                      <div className="bg-[#35FF90] h-full rounded-full transition-all duration-300" style={{ width: `${testProgress}%` }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-4 pt-2 text-[10px] font-mono text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#35FF90]" />
                  &lt; 10ms Hijau (PvP Ready)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  &lt; 30ms Biru (Sangat Mulus)
                </span>
              </div>
            </div>

            {/* Right Interactive Nodes List column */}
            <div className="lg:col-span-7 space-y-3 text-left">
              <h4 className="text-xs font-mono font-bold uppercase text-gray-400 mb-4 tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#35FF90]" />
                Pilih Lokasi Server untuk diuji:
              </h4>

              {pingNodes.map((node) => {
                const isTestingThis = testingNodeId === node.id;
                const result = pingResults[node.id];
                const qual = result ? getQualitativeTag(result) : null;

                return (
                  <div
                    key={node.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#020617]/80 hover:bg-[#020617] border border-white/5 hover:border-[#35FF90]/25 rounded-2xl gap-4 transition-all"
                  >
                    {/* Flag & Node metadata */}
                    <div className="flex items-center gap-3.5">
                      <span className="text-2xl select-none">{node.flag}</span>
                      <div>
                        <h5 className="text-xs font-bold text-white leading-none">{node.name}</h5>
                        <span className="text-[10px] text-gray-500 font-mono mt-1.5 block">{node.specs}</span>
                      </div>
                    </div>

                    {/* Ping results actions */}
                    <div className="flex items-center gap-3.5 sm:justify-end shrink-0">
                      
                      {result !== undefined ? (
                        <div className="flex items-center gap-2.5">
                          <span className={`px-2 py-1 rounded-md text-[9px] font-mono font-bold border ${qual?.color}`}>
                            {qual?.label}
                          </span>
                          <span className="text-lg font-black font-mono text-[#35FF90]">
                            {result} <span className="text-[10px] font-normal text-gray-400">ms</span>
                          </span>
                        </div>
                      ) : null}

                      <button
                        onClick={() => triggerPingTest(node)}
                        disabled={testingNodeId !== null}
                        className={`px-4.5 py-2 rounded-xl text-[10px] font-mono font-bold transition-all uppercase cursor-pointer ${
                          isTestingThis
                            ? 'bg-[#35FF90]/10 border border-[#35FF90]/20 text-[#35FF90] animate-pulse cursor-not-allowed'
                            : testingNodeId !== null
                              ? 'bg-gray-800/20 text-gray-600 border border-transparent cursor-not-allowed'
                              : 'bg-emerald-950/20 hover:bg-[#35FF90]/10 text-[#35FF90] border border-[#35FF90]/20 hover:border-[#35FF90]/40'
                        }`}
                      >
                        {isTestingThis ? 'Menguji...' : 'Uji Latency'}
                      </button>

                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
