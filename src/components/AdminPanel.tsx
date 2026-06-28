import React, { useState, FormEvent, useEffect, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Layers, DollarSign, FileText, LifeBuoy, Tag, ShieldAlert, Cpu, 
  Settings as SettingsIcon, Plus, Trash2, Edit, CheckCircle, XCircle, Send, 
  PlusCircle, RefreshCw, ArrowLeftRight, Shield, Calendar, Terminal, Info, 
  AlertCircle, ToggleLeft, ToggleRight, Check, Eye, EyeOff
} from 'lucide-react';
import { User, UserServer, Invoice, SupportTicket, Announcement, MinecraftPackage } from '../types';

interface AdminPanelProps {
  currentUser: User | null;
  users: User[];
  servers: UserServer[];
  invoices: Invoice[];
  tickets: SupportTicket[];
  announcements: Announcement[];
  packages: MinecraftPackage[];
  onUpdateUsers: (updatedUsers: User[]) => void;
  onUpdateServers: (updatedServers: UserServer[]) => void;
  onUpdateInvoices: (updatedInvoices: Invoice[]) => void;
  onUpdateTickets: (updatedTickets: SupportTicket[]) => void;
  onUpdateAnnouncements: (updatedAnnouncements: Announcement[]) => void;
  onUpdatePackages: (updatedPackages: MinecraftPackage[]) => void;
}

export default function AdminPanel({
  currentUser,
  users,
  servers,
  invoices,
  tickets,
  announcements,
  packages,
  onUpdateUsers,
  onUpdateServers,
  onUpdateInvoices,
  onUpdateTickets,
  onUpdateAnnouncements,
  onUpdatePackages
}: AdminPanelProps) {
  
  const [activeAdminTab, setActiveAdminTab] = useState<string>('statistik');

  // --- FORM STATES FOR USER MANAGE ---
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const [userFormFirstName, setUserFormFirstName] = useState('');
  const [userFormLastName, setUserFormLastName] = useState('');
  const [userFormUsername, setUserFormUsername] = useState('');
  const [userFormEmail, setUserFormEmail] = useState('');
  const [userFormPhone, setUserFormPhone] = useState('');
  const [userFormDiscord, setUserFormDiscord] = useState('');
  const [userFormPassword, setUserFormPassword] = useState('');
  const [userFormRole, setUserFormRole] = useState<'user' | 'admin'>('user');
  
  // Balance modifier state
  const [selectedBalanceUser, setSelectedBalanceUser] = useState<User | null>(null);
  const [balanceAmount, setBalanceAmount] = useState<number>(10000);
  const [balanceLogs, setBalanceLogs] = useState<any[]>(() => {
    return JSON.parse(localStorage.getItem('mavix_balance_logs') || '[]');
  });

  // --- FORM STATES FOR SERVER MANAGE ---
  const [isAddServerOpen, setIsAddServerOpen] = useState(false);
  const [editingServerResource, setEditingServerResource] = useState<UserServer | null>(null);
  
  const [serverFormName, setServerFormName] = useState('');
  const [serverFormUserId, setServerFormUserId] = useState('');
  const [serverFormPackage, setServerFormPackage] = useState<'standar' | 'medium' | 'prime'>('standar');
  const [serverFormRam, setServerFormRam] = useState<number>(4);
  const [serverFormCpu, setServerFormCpu] = useState('Ryzen 9 5950X');
  const [serverFormRegion, setServerFormRegion] = useState('Region Indonesia');
  
  const [transferServerTarget, setTransferServerTarget] = useState<UserServer | null>(null);
  const [transferTargetUserId, setTransferTargetUserId] = useState('');

  // Reinstall progress simulation state
  const [reinstallingServerId, setReinstallingServerId] = useState<string | null>(null);
  const [reinstallProgress, setReinstallProgress] = useState(0);
  const [reinstallLogs, setReinstallLogs] = useState<string[]>([]);

  // --- FORM STATES FOR PACKAGE MANAGE ---
  const [isAddPackageOpen, setIsAddPackageOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<MinecraftPackage | null>(null);
  
  const [packageFormId, setPackageFormId] = useState('');
  const [packageFormName, setPackageFormName] = useState('');
  const [packageFormPrice, setPackageFormPrice] = useState<number>(10000);
  const [packageFormRam, setPackageFormRam] = useState<number>(4);
  const [packageFormCpu, setPackageFormCpu] = useState('Ryzen 9 5950X');
  const [packageFormRegion, setPackageFormRegion] = useState('Region Indonesia');
  const [packageFormStock, setPackageFormStock] = useState<number>(10);
  const [packageFormDesc, setPackageFormDesc] = useState('');
  const [packageFormFeatures, setPackageFormFeatures] = useState('');

  // --- PTERODACTYL CONFIG STATE ---
  const [pteroUrl, setPteroUrl] = useState(() => localStorage.getItem('ptero_panel_url') || 'https://panel.mavix.store');

  // Lite Configuration
  const [pteroLiteAppKey, setPteroLiteAppKey] = useState(() => localStorage.getItem('ptero_lite_app_key') || 'ptla_lite_kX93jHlkas92FsaK92J1asdaK931');
  const [pteroLiteNodeId, setPteroLiteNodeId] = useState(() => localStorage.getItem('ptero_lite_node_id') || '1');
  const [pteroLiteEggId, setPteroLiteEggId] = useState(() => localStorage.getItem('ptero_lite_egg_id') || '15');

  // Medium Configuration
  const [pteroMediumAppKey, setPteroMediumAppKey] = useState(() => localStorage.getItem('ptero_medium_app_key') || 'ptla_medium_asd82Ksa02Fka82J1asd82F72');
  const [pteroMediumNodeId, setPteroMediumNodeId] = useState(() => localStorage.getItem('ptero_medium_node_id') || '2');
  const [pteroMediumEggId, setPteroMediumEggId] = useState(() => localStorage.getItem('ptero_medium_egg_id') || '16');

  // Prime Configuration
  const [pteroPrimeAppKey, setPteroPrimeAppKey] = useState(() => localStorage.getItem('ptero_prime_app_key') || 'ptla_prime_ksf02Kla72Fsa82J1asd92K182');
  const [pteroPrimeNodeId, setPteroPrimeNodeId] = useState(() => localStorage.getItem('ptero_prime_node_id') || '3');
  const [pteroPrimeEggId, setPteroPrimeEggId] = useState(() => localStorage.getItem('ptero_prime_egg_id') || '17');

  // Show/Hide API key states
  const [showLiteAppKey, setShowLiteAppKey] = useState(false);
  const [showMediumAppKey, setShowMediumAppKey] = useState(false);
  const [showPrimeAppKey, setShowPrimeAppKey] = useState(false);

  // Connection testing states
  const [liteConnectionStatus, setLiteConnectionStatus] = useState<'connected' | 'invalid' | 'failed' | 'testing'>(
    () => (localStorage.getItem('ptero_standar_status') as any) || 'connected'
  );
  const [mediumConnectionStatus, setMediumConnectionStatus] = useState<'connected' | 'invalid' | 'failed' | 'testing'>(
    () => (localStorage.getItem('ptero_medium_status') as any) || 'connected'
  );
  const [primeConnectionStatus, setPrimeConnectionStatus] = useState<'connected' | 'invalid' | 'failed' | 'testing'>(
    () => (localStorage.getItem('ptero_prime_status') as any) || 'connected'
  );

  const [lastSyncTime, setLastSyncTime] = useState(
    () => localStorage.getItem('ptero_last_sync') || new Date().toLocaleString('id-ID')
  );
  const [isSyncing, setIsSyncing] = useState(false);
  const [pteroLogs, setPteroLogs] = useState<string[]>([]);
  const [isPteroTesting, setIsPteroTesting] = useState(false);

  const renderConnectionStatusBadge = (status: 'connected' | 'invalid' | 'failed' | 'testing') => {
    switch (status) {
      case 'testing':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] bg-cyan-500/10 text-cyan-300 font-bold px-2 py-0.5 rounded-lg border border-cyan-500/20 animate-pulse font-mono">
            <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" /> TESTING
          </span>
        );
      case 'connected':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/15 text-[#35FF90] font-bold px-2.5 py-0.5 rounded-lg border border-emerald-500/20 font-mono">
            <Check className="w-3 h-3 text-[#35FF90]" /> CONNECTED
          </span>
        );
      case 'invalid':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] bg-amber-500/15 text-amber-300 font-bold px-2.5 py-0.5 rounded-lg border border-amber-500/20 font-mono">
            <AlertCircle className="w-3 h-3 text-amber-400" /> INVALID CONFIG
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] bg-red-500/15 text-red-400 font-bold px-2.5 py-0.5 rounded-lg border border-red-500/20 font-mono">
            <XCircle className="w-3 h-3 text-red-400" /> FAILED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] bg-gray-500/10 text-gray-400 font-bold px-2.5 py-0.5 rounded-lg border border-white/5 font-mono">
            OFFLINE
          </span>
        );
    }
  };

  // --- WEBSITE MANAGE STATE ---
  const [siteLogoName, setSiteLogoName] = useState(() => localStorage.getItem('mavix_logo_name') || 'MAVIX STORE');
  const [siteName, setSiteName] = useState(() => localStorage.getItem('mavix_site_name') || 'Mavix Store');
  const [siteThemeColor, setSiteThemeColor] = useState(() => localStorage.getItem('mavix_theme_color') || '#35FF90');
  const [siteBanner, setSiteBanner] = useState(() => localStorage.getItem('mavix_banner_text') || 'Dapatkan diskon 15% untuk pembelian server menggunakan Virtual Account BCA!');
  const [siteFooter, setSiteFooter] = useState(() => localStorage.getItem('mavix_footer_text') || '© 2026 MAVIX STORE. Seluruh hak cipta dilindungi undang-undang.');
  const [siteContact, setSiteContact] = useState(() => localStorage.getItem('mavix_contact_info') || 'support@mavix.store | +62 812-3456-7890');
  const [siteDiscord, setSiteDiscord] = useState(() => localStorage.getItem('mavix_discord_link') || 'https://discord.gg/mavixstore');
  const [siteLogoUrl, setSiteLogoUrl] = useState(() => localStorage.getItem('mavix_logo_url') || '');
  const [siteFaviconUrl, setSiteFaviconUrl] = useState(() => localStorage.getItem('mavix_favicon_url') || '');
  const [siteSlogan, setSiteSlogan] = useState(() => localStorage.getItem('mavix_site_slogan') || 'Premium Minecraft Hosting & Game Servers');
  const [siteHomepageBannerUrl, setSiteHomepageBannerUrl] = useState(() => localStorage.getItem('mavix_homepage_banner_url') || '');
  const [siteHeroBgUrl, setSiteHeroBgUrl] = useState(() => localStorage.getItem('mavix_hero_bg_url') || '');
  const [siteTelegram, setSiteTelegram] = useState(() => localStorage.getItem('mavix_telegram_link') || 'https://t.me/mavixstore');
  const [siteWhatsapp, setSiteWhatsapp] = useState(() => localStorage.getItem('mavix_whatsapp_link') || 'https://wa.me/6281234567890');
  const [siteQrisUrl, setSiteQrisUrl] = useState(() => localStorage.getItem('mavix_qris_url') || 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&q=60&w=260');

  // --- SECURITY STATES ---
  const [secPasswordHashing, setSecPasswordHashing] = useState(true);
  const [secCsrfProtection, setSecCsrfProtection] = useState(true);
  const [secRateLimit, setSecRateLimit] = useState(true);
  const [secSessionMinutes, setSecSessionMinutes] = useState(60);

  // --- AUDIT LOG STATE ---
  const [auditLogs, setAuditLogs] = useState<any[]>(() => {
    return JSON.parse(localStorage.getItem('mavix_audit_logs') || '[]');
  });

  // --- ACCESS PROTECTION CHECKS ---
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div id="access-denied-view" className="min-h-screen flex flex-col items-center justify-center bg-[#04091C] text-white p-6 grid-bg">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-[#101935]/80 border border-red-500/30 rounded-2xl p-8 text-center glow-primary backdrop-blur-md"
        >
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-8 h-8 text-red-500 animate-pulse" />
          </div>
          <h2 className="font-display text-2xl font-black tracking-wider text-red-500">AKSES DITOLAK!</h2>
          <p className="text-xs text-[#A7B3D0] mt-3.5 leading-relaxed">
            Halaman Admin Panel ini hanya dapat diakses oleh akun dengan peran kepemimpinan <strong>Admin</strong>. Akun Anda saat ini tidak memiliki hak akses yang memadai.
          </p>
          <div className="border-t border-white/5 pt-5 mt-6 space-y-3">
            <p className="text-[10px] text-gray-400 font-mono">Role Anda: {currentUser ? currentUser.role.toUpperCase() : 'GUEST'}</p>
            <p className="text-[10px] text-gray-500">Harap keluar dan masuk kembali menggunakan kredensial Administrator yang sah.</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- CALCULATE SUMMARY METRICS ---
  const totalUserCount = users.length;
  const totalServerCount = servers.length;
  
  // Total Pendapatan = Paid Invoices of type 'hosting'
  const totalRevenue = invoices
    .filter(i => i.type === 'hosting' && i.status === 'paid')
    .reduce((sum, item) => sum + item.amount, 0);

  // Total Invoice Count
  const totalInvoiceCount = invoices.length;

  // Total Saldo Masuk = Paid Invoices of type 'topup'
  const totalSaldoMasuk = invoices
    .filter(i => i.type === 'topup' && i.status === 'paid')
    .reduce((sum, item) => sum + item.amount, 0);

  // Total Tickets Support
  const totalTicketCount = tickets.length;

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num);
  };

  // --- AUDIT LOG LOGGER HELPER ---
  const logAdminAction = (actionMessage: string) => {
    const newLog = {
      id: `log-${Date.now()}`,
      adminName: currentUser.username,
      action: actionMessage,
      timestamp: new Date().toISOString()
    };
    const updated = [newLog, ...auditLogs];
    setAuditLogs(updated);
    localStorage.setItem('mavix_audit_logs', JSON.stringify(updated));
  };

  // --- USER MANAGEMENT HANDLERS ---
  const handleCreateOrUpdateUser = (e: FormEvent) => {
    e.preventDefault();
    if (!userFormUsername || !userFormEmail || !userFormFirstName || !userFormLastName) {
      alert('Harap lengkapi semua kolom wajib!');
      return;
    }

    if (editingUser) {
      // Edit User
      const updated = users.map(u => {
        if (u.id === editingUser.id) {
          return {
            ...u,
            username: userFormUsername,
            email: userFormEmail,
            firstName: userFormFirstName,
            lastName: userFormLastName,
            phone: userFormPhone,
            discord: userFormDiscord,
            role: userFormRole,
            password: userFormPassword || u.password
          };
        }
        return u;
      });
      onUpdateUsers(updated);
      logAdminAction(`Mengedit informasi akun user: "${userFormUsername}" (${userFormEmail})`);
      setEditingUser(null);
      alert('Data user berhasil diperbarui!');
    } else {
      // Create User
      const newUser: User = {
        id: `user-${Date.now()}`,
        username: userFormUsername,
        email: userFormEmail,
        firstName: userFormFirstName,
        lastName: userFormLastName,
        phone: userFormPhone,
        discord: userFormDiscord || undefined,
        password: userFormPassword || 'MavixDefault123',
        role: userFormRole,
        balance: 0,
        registeredAt: new Date().toISOString(),
        status: 'active'
      };
      onUpdateUsers([...users, newUser]);
      logAdminAction(`Membuat user baru: "${userFormUsername}" (${userFormEmail})`);
      setIsAddUserOpen(false);
      alert('User baru berhasil ditambahkan!');
    }

    // Reset Form
    setUserFormFirstName('');
    setUserFormLastName('');
    setUserFormUsername('');
    setUserFormEmail('');
    setUserFormPhone('');
    setUserFormDiscord('');
    setUserFormPassword('');
    setUserFormRole('user');
  };

  const handleToggleSuspendUser = (userId: string, currentStatus: 'active' | 'suspended') => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    const updated = users.map(u => {
      if (u.id === userId) {
        return { ...u, status: nextStatus as 'active' | 'suspended' };
      }
      return u;
    });
    onUpdateUsers(updated);
    const targetUser = users.find(u => u.id === userId);
    logAdminAction(`${nextStatus === 'suspended' ? 'Menangguhkan (Suspend)' : 'Mengaktifkan kembali'} user: "${targetUser?.username}"`);
    alert(`Akun user berhasil di-${nextStatus === 'suspended' ? 'suspend' : 'unsuspend'}!`);
  };

  const handleDeleteUser = (userId: string) => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;
    if (confirm(`Apakah Anda yakin ingin menghapus user "${targetUser.username}" beserta seluruh datanya secara permanen?`)) {
      const updated = users.filter(u => u.id !== userId);
      onUpdateUsers(updated);
      logAdminAction(`Menghapus user secara permanen: "${targetUser.username}"`);
      alert('User berhasil dihapus!');
    }
  };

  const handleResetPassword = (userId: string) => {
    const newPass = prompt('Masukkan password baru untuk user ini:');
    if (!newPass || newPass.trim().length < 4) {
      alert('Password baru tidak valid (minimal 4 karakter).');
      return;
    }
    const updated = users.map(u => {
      if (u.id === userId) {
        return { ...u, password: newPass };
      }
      return u;
    });
    onUpdateUsers(updated);
    const targetUser = users.find(u => u.id === userId);
    logAdminAction(`Mereset password user: "${targetUser?.username}"`);
    alert(`Password user "${targetUser?.username}" berhasil direset.`);
  };

  const handleUpdateBalance = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedBalanceUser || balanceAmount === 0) return;

    const isAdding = balanceAmount > 0;
    const updatedUsers = users.map(u => {
      if (u.id === selectedBalanceUser.id) {
        return { ...u, balance: Math.max(0, u.balance + balanceAmount) };
      }
      return u;
    });
    onUpdateUsers(updatedUsers);

    // Add log entry
    const balLog = {
      id: `bal-${Date.now()}`,
      userId: selectedBalanceUser.id,
      userEmail: selectedBalanceUser.email,
      amount: balanceAmount,
      type: isAdding ? 'plus' : 'minus',
      adminName: currentUser.username,
      timestamp: new Date().toISOString()
    };
    const updatedLogs = [balLog, ...balanceLogs];
    setBalanceLogs(updatedLogs);
    localStorage.setItem('mavix_balance_logs', JSON.stringify(updatedLogs));

    logAdminAction(`${isAdding ? 'Menambahkan' : 'Mengurangi'} saldo user "${selectedBalanceUser.username}" sebesar ${formatIDR(Math.abs(balanceAmount))}`);
    setSelectedBalanceUser(null);
    setBalanceAmount(10000);
    alert('Saldo user berhasil dimodifikasi!');
  };

  // --- SERVER MANAGEMENT HANDLERS ---
  const handleCreateServerByAdmin = (e: FormEvent) => {
    e.preventDefault();
    if (!serverFormName || !serverFormUserId) {
      alert('Harap lengkapi semua bidang wajib!');
      return;
    }

    const targetUser = users.find(u => u.id === serverFormUserId);
    if (!targetUser) return;

    const newServer: UserServer = {
      id: `srv-${Date.now()}`,
      userId: serverFormUserId,
      name: serverFormName,
      packageId: serverFormPackage,
      packageName: `PAKET ${serverFormPackage.toUpperCase()}`,
      ram: serverFormRam,
      cpu: serverFormCpu,
      region: serverFormRegion,
      status: 'online',
      ipAddress: `103.142.${Math.floor(Math.random() * 254) + 1}.${Math.floor(Math.random() * 254) + 1}:25565`,
      createdAt: new Date().toISOString(),
      expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 Days expired
    };

    onUpdateServers([...servers, newServer]);
    logAdminAction(`Membuat server baru "${serverFormName}" untuk user "${targetUser.username}"`);
    setIsAddServerOpen(false);
    
    setServerFormName('');
    setServerFormUserId('');
    alert('Server baru berhasil dideploy otomatis!');
  };

  const handleToggleServerStatus = (serverId: string, currentStatus: 'online' | 'offline' | 'restarting') => {
    const targetServer = servers.find(s => s.id === serverId);
    if (!targetServer) return;
    const nextStatus = currentStatus === 'online' ? 'offline' : 'online';
    
    const updated = servers.map(s => {
      if (s.id === serverId) {
        return { ...s, status: nextStatus as 'online' | 'offline' };
      }
      return s;
    });
    onUpdateServers(updated);
    logAdminAction(`${nextStatus === 'offline' ? 'Melakukan Suspend' : 'Melakukan Unsuspend'} pada server "${targetServer.name}"`);
    alert(`Server status berhasil diubah ke ${nextStatus.toUpperCase()}!`);
  };

  const handleDeleteServerByAdmin = (serverId: string) => {
    const targetServer = servers.find(s => s.id === serverId);
    if (!targetServer) return;
    if (confirm(`Apakah Anda yakin ingin menghapus server "${targetServer.name}" secara permanen dari server-rack?`)) {
      const updated = servers.filter(s => s.id !== serverId);
      onUpdateServers(updated);
      logAdminAction(`Menghapus server secara permanen: "${targetServer.name}"`);
      alert('Server berhasil dihapus!');
    }
  };

  const handleReinstallServerSimulation = (serverId: string) => {
    const targetServer = servers.find(s => s.id === serverId);
    if (!targetServer) return;

    setReinstallingServerId(serverId);
    setReinstallProgress(0);
    setReinstallLogs(['[PTERODACTYL] Menghubungi Panel URL...', '[PTERODACTYL] Mengautentikasi kunci API...']);

    const interval = setInterval(() => {
      setReinstallProgress(prev => {
        const next = prev + 25;
        if (next === 25) {
          setReinstallLogs(l => [...l, '[PTERODACTYL] Menghentikan kontainer Java...', '[PTERODACTYL] Mengamankan file backup dunia (world)...']);
        } else if (next === 50) {
          setReinstallLogs(l => [...l, '[PTERODACTYL] Melakukan wipe folder server...', '[PTERODACTYL] Mengunduh ulang core Paper / Forge binaries...']);
        } else if (next === 75) {
          setReinstallLogs(l => [...l, '[PTERODACTYL] Unpacking server.jar...', '[PTERODACTYL] Memetakan port alokasi kontainer...']);
        } else if (next === 100) {
          setReinstallLogs(l => [...l, '[PTERODACTYL] Reinstall berhasil! Memulai boot up kontainer.', '● STATUS: SERVER ONLINE & READY']);
          clearInterval(interval);
          setTimeout(() => {
            setReinstallingServerId(null);
          }, 2000);
        }
        return next;
      });
    }, 800);

    logAdminAction(`Melakukan Reinstall Kontainer Server: "${targetServer.name}"`);
  };

  const handleTransferServer = (e: FormEvent) => {
    e.preventDefault();
    if (!transferServerTarget || !transferTargetUserId) return;

    const targetUser = users.find(u => u.id === transferTargetUserId);
    if (!targetUser) return;

    const updated = servers.map(s => {
      if (s.id === transferServerTarget.id) {
        return { ...s, userId: transferTargetUserId };
      }
      return s;
    });
    onUpdateServers(updated);
    logAdminAction(`Mentransfer kepemilikan server "${transferServerTarget.name}" ke user baru "${targetUser.username}"`);
    setTransferServerTarget(null);
    setTransferTargetUserId('');
    alert('Kepemilikan server berhasil ditransfer!');
  };

  const handleUpdateServerResources = (e: FormEvent) => {
    e.preventDefault();
    if (!editingServerResource) return;

    const updated = servers.map(s => {
      if (s.id === editingServerResource.id) {
        return { 
          ...s, 
          ram: editingServerResource.ram,
          cpu: editingServerResource.cpu
        };
      }
      return s;
    });
    onUpdateServers(updated);
    logAdminAction(`Mengubah alokasi resource server "${editingServerResource.name}" menjadi ${editingServerResource.ram}GB RAM, ${editingServerResource.cpu}`);
    setEditingServerResource(null);
    alert('Alokasi resource server berhasil disesuaikan!');
  };

  // --- PACKAGE MANAGEMENT HANDLERS ---
  const handleCreateOrUpdatePackage = (e: FormEvent) => {
    e.preventDefault();
    if (!packageFormId || !packageFormName || packageFormPrice <= 0) {
      alert('Harap lengkapi semua kolom wajib!');
      return;
    }

    const featureArray = packageFormFeatures
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    if (editingPackage) {
      // Edit Package
      const updated = packages.map(p => {
        if (p.id === editingPackage.id) {
          return {
            ...p,
            name: packageFormName,
            price: packageFormPrice,
            ram: packageFormRam,
            cpu: packageFormCpu,
            region: packageFormRegion,
            stock: packageFormStock,
            features: featureArray
          };
        }
        return p;
      });
      onUpdatePackages(updated);
      logAdminAction(`Mengedit paket Minecraft: "${packageFormName}" (Rp ${packageFormPrice}/GB)`);
      setEditingPackage(null);
      alert('Paket berhasil diperbarui!');
    } else {
      // Create Package
      const newPkg: MinecraftPackage = {
        id: packageFormId as any,
        name: packageFormName,
        price: packageFormPrice,
        ram: packageFormRam,
        cpu: packageFormCpu,
        region: packageFormRegion,
        stock: packageFormStock,
        features: featureArray
      };
      onUpdatePackages([...packages, newPkg]);
      logAdminAction(`Menambahkan paket Minecraft baru: "${packageFormName}"`);
      setIsAddPackageOpen(false);
      alert('Paket baru berhasil ditambahkan!');
    }

    // Reset Form
    setPackageFormId('');
    setPackageFormName('');
    setPackageFormPrice(10000);
    setPackageFormRam(4);
    setPackageFormCpu('Ryzen 9 5950X');
    setPackageFormRegion('Region Indonesia');
    setPackageFormStock(10);
    setPackageFormDesc('');
    setPackageFormFeatures('');
  };

  const handleDeletePackage = (packageId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus paket hosting ini secara permanen dari display toko?')) {
      const updated = packages.filter(p => p.id !== packageId);
      onUpdatePackages(updated);
      logAdminAction(`Menghapus paket hosting secara permanen: id "${packageId}"`);
      alert('Paket berhasil dihapus!');
    }
  };

  const handleUpdateStockDirect = (packageId: string, amount: number) => {
    const updated = packages.map(p => {
      if (p.id === packageId) {
        return { ...p, stock: Math.max(0, p.stock + amount) };
      }
      return p;
    });
    onUpdatePackages(updated);
    const targetPkg = packages.find(p => p.id === packageId);
    logAdminAction(`Mengubah stok paket "${targetPkg?.name}" langsung sebesar (${amount > 0 ? '+' : ''}${amount})`);
  };

  // --- TICKET SUPPORT HANDLERS ---
  const handleRespondToTicket = (ticketId: string, text: string) => {
    if (!text.trim()) return;

    const updated = tickets.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'answered' as const,
          responses: [
            ...t.responses,
            {
              id: `resp-${Date.now()}`,
              sender: 'admin' as const,
              senderName: `${currentUser.username} (Admin)`,
              message: text,
              createdAt: new Date().toISOString()
            }
          ]
        };
      }
      return t;
    });
    onUpdateTickets(updated);
    logAdminAction(`Membalas tiket support ID "${ticketId}"`);
    alert('Balasan Anda telah dikirim!');
  };

  const handleToggleCloseTicket = (ticketId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'closed' ? 'open' : 'closed';
    const updated = tickets.map(t => {
      if (t.id === ticketId) {
        return { ...t, status: nextStatus as any };
      }
      return t;
    });
    onUpdateTickets(updated);
    logAdminAction(`Mengubah status tiket ID "${ticketId}" menjadi ${nextStatus.toUpperCase()}`);
    alert(`Status tiket diubah menjadi ${nextStatus.toUpperCase()}!`);
  };

  const handleDeleteTicket = (ticketId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus tiket bantuan ini dari sistem?')) {
      const updated = tickets.filter(t => t.id !== ticketId);
      onUpdateTickets(updated);
      logAdminAction(`Menghapus tiket support secara permanen: ID "${ticketId}"`);
      alert('Tiket berhasil dihapus!');
    }
  };

  // --- FILE UPLOAD UTIL FOR BASE64 ---
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- WEBSITE CONFIG & PTERODACTYL SETTINGS HANDLERS ---
  const handleSaveWebsiteConfig = (e: FormEvent) => {
    e.preventDefault();
    localStorage.setItem('mavix_logo_name', siteLogoName);
    localStorage.setItem('mavix_site_name', siteName);
    localStorage.setItem('mavix_theme_color', siteThemeColor);
    localStorage.setItem('mavix_banner_text', siteBanner);
    localStorage.setItem('mavix_footer_text', siteFooter);
    localStorage.setItem('mavix_contact_info', siteContact);
    localStorage.setItem('mavix_discord_link', siteDiscord);
    localStorage.setItem('mavix_logo_url', siteLogoUrl);
    localStorage.setItem('mavix_favicon_url', siteFaviconUrl);
    localStorage.setItem('mavix_site_slogan', siteSlogan);
    localStorage.setItem('mavix_homepage_banner_url', siteHomepageBannerUrl);
    localStorage.setItem('mavix_hero_bg_url', siteHeroBgUrl);
    localStorage.setItem('mavix_telegram_link', siteTelegram);
    localStorage.setItem('mavix_whatsapp_link', siteWhatsapp);
    localStorage.setItem('mavix_qris_url', siteQrisUrl);
    
    logAdminAction('Memperbarui konfigurasi visual & branding website');
    alert('Konfigurasi website berhasil disimpan! Muat ulang halaman untuk menerapkan semua perubahan.');
  };

  const handleSavePterodactylConfig = (e: FormEvent) => {
    e.preventDefault();
    localStorage.setItem('ptero_panel_url', pteroUrl);
    
    localStorage.setItem('ptero_lite_app_key', pteroLiteAppKey);
    localStorage.setItem('ptero_lite_node_id', pteroLiteNodeId);
    localStorage.setItem('ptero_lite_egg_id', pteroLiteEggId);
    
    localStorage.setItem('ptero_medium_app_key', pteroMediumAppKey);
    localStorage.setItem('ptero_medium_node_id', pteroMediumNodeId);
    localStorage.setItem('ptero_medium_egg_id', pteroMediumEggId);
    
    localStorage.setItem('ptero_prime_app_key', pteroPrimeAppKey);
    localStorage.setItem('ptero_prime_node_id', pteroPrimeNodeId);
    localStorage.setItem('ptero_prime_egg_id', pteroPrimeEggId);
    
    logAdminAction('Menyimpan seluruh konfigurasi global dan per-paket Pterodactyl API');
    alert('Seluruh konfigurasi Pterodactyl berhasil disimpan!');
  };

  const handleTestConnection = (pkgType: 'standar' | 'medium' | 'prime') => {
    let setter: any;
    let apiKey = '';
    let nodeId = '';
    let eggId = '';
    let pkgLabel = '';

    if (pkgType === 'standar') {
      setter = setLiteConnectionStatus;
      apiKey = pteroLiteAppKey;
      nodeId = pteroLiteNodeId;
      eggId = pteroLiteEggId;
      pkgLabel = 'MaviX Lite';
    } else if (pkgType === 'medium') {
      setter = setMediumConnectionStatus;
      apiKey = pteroMediumAppKey;
      nodeId = pteroMediumNodeId;
      eggId = pteroMediumEggId;
      pkgLabel = 'MaviX Medium';
    } else {
      setter = setPrimeConnectionStatus;
      apiKey = pteroPrimeAppKey;
      nodeId = pteroPrimeNodeId;
      eggId = pteroPrimeEggId;
      pkgLabel = 'MaviX Prime';
    }

    setter('testing');
    setPteroLogs(l => [
      ...l,
      `[DIAGNOSTIK] Menguji konektivitas untuk ${pkgLabel}...`,
      `[DIAGNOSTIK] Menghubungi Panel URL: ${pteroUrl}...`,
      `[DIAGNOSTIK] Memverifikasi API Key (panjang: ${apiKey.length} karakter)...`
    ]);

    setTimeout(() => {
      const isValidUrl = pteroUrl.startsWith('http://') || pteroUrl.startsWith('https://');
      const isValidApiKey = apiKey.trim().startsWith('ptla_') && apiKey.trim().length > 10;
      const isValidNodeId = nodeId.trim() !== '' && !isNaN(Number(nodeId));
      
      const eggIdList = eggId.split(',').map(s => s.trim()).filter(s => s !== '');
      const isValidEggId = eggIdList.length > 0 && eggIdList.every(id => id !== '' && !isNaN(Number(id)));

      let result: 'connected' | 'invalid' | 'failed';
      let statusLog = '';

      if (!isValidUrl) {
        result = 'failed';
        statusLog = `❌ DIAGNOSTIK GAGAL: Koneksi gagal ke ${pteroUrl}. URL tidak valid.`;
      } else if (!isValidApiKey || !isValidNodeId || !isValidEggId) {
        result = 'invalid';
        statusLog = `⚠️ DIAGNOSTIK KHUSUS: Konfigurasi tidak valid. Harap periksa apakah API Key diawali 'ptla_' dan Node/Egg ID berupa numerik (bisa dipisah koma untuk multi-egg, misal: 1,7,5).`;
      } else {
        result = 'connected';
        statusLog = `✅ DIAGNOSTIK SUKSES: Koneksi stabil ke Panel URL! API Key Terverifikasi, Node ID ${nodeId} Online, Egg ID (${eggIdList.join(', ')}) Valid & Terdaftar.`;
      }

      setter(result);
      localStorage.setItem(`ptero_${pkgType}_status`, result);
      
      setPteroLogs(l => [...l, statusLog]);

      // Update sync time
      const nowStr = new Date().toLocaleString('id-ID');
      setLastSyncTime(nowStr);
      localStorage.setItem('ptero_last_sync', nowStr);
    }, 1200);

    logAdminAction(`Menguji koneksi API Pterodactyl untuk paket: ${pkgLabel}`);
  };

  const handleTestPteroFeature = (featureName: string) => {
    setIsPteroTesting(true);
    setPteroLogs([
      `[PTERODACTYL API] Memulai simulasi operasi: ${featureName.toUpperCase()}`,
      `[PTERODACTYL API] Panel Endpoint: ${pteroUrl}/api/application`,
      `[PTERODACTYL API] Header: Bearer ptla_**** (Autentikasi Aman)`,
    ]);

    setTimeout(() => {
      setPteroLogs(l => [...l, `[PTERODACTYL API] Memverifikasi parameter API Key... OK`]);
    }, 600);

    setTimeout(() => {
      if (featureName === 'create') {
        setPteroLogs(l => [...l, 
          `[PTERODACTYL API] Payload: Deploying using dynamic package nodes`,
          `[PTERODACTYL API] Auto Allocating IP port... Allocated Port 25565`,
          `[PTERODACTYL API] SUCCESS: Server baru berhasil dideploy dalam kontainer docker!`
        ]);
      } else if (featureName === 'suspend') {
        setPteroLogs(l => [...l, 
          `[PTERODACTYL API] Mengirim suspend call untuk server kontainer...`,
          `[PTERODACTYL API] SUCCESS: Kontainer dihentikan dan ditandai sebagai suspended!`
        ]);
      } else if (featureName === 'unsuspend') {
        setPteroLogs(l => [...l, 
          `[PTERODACTYL API] Mengirim unsuspend call untuk server kontainer...`,
          `[PTERODACTYL API] SUCCESS: Memulihkan hak akses kontainer dan mengaktifkan jaringan kembali!`
        ]);
      } else if (featureName === 'delete') {
        setPteroLogs(l => [...l, 
          `[PTERODACTYL API] Menghapus data kontainer dari node docker...`,
          `[PTERODACTYL API] SUCCESS: Server berhasil dihapus permanen dari Pterodactyl Node!`
        ]);
      } else if (featureName === 'reinstall') {
        setPteroLogs(l => [...l, 
          `[PTERODACTYL API] Menginstruksikan reinstall paket server.jar...`,
          `[PTERODACTYL API] SUCCESS: Berkas kontainer diunduh ulang!`
        ]);
      } else if (featureName === 'user') {
        setPteroLogs(l => [...l,
          `[PTERODACTYL API] Mengirim POST call ke /api/application/users...`,
          `[PTERODACTYL API] Memeriksa format Payload & Aturan Karakter Pterodactyl...`,
          `[PTERODACTYL API] - Email: valid (Belum terdaftar di panel)`,
          `[PTERODACTYL API] - Username: valid (Semua huruf kecil, tanpa spasi/simbol)`,
          `[PTERODACTYL API] Memeriksa Izin API Key (Application API Key)...`,
          `[PTERODACTYL API] WARNING: Jika terjadi error "403 Forbidden" atau "401 Unauthorized" pada real panel, pastikan Anda menggunakan APPLICATION API KEY (dimulai dengan 'ptla_'), bukan client key ('ptlc_'), serta beri akses READ & WRITE untuk Users dan Servers!`,
          `[PTERODACTYL API] SUCCESS: Pterodactyl User API terverifikasi berjalan lancar tanpa hambatan!`
        ]);
      } else {
        setPteroLogs(l => [...l, 
          `[PTERODACTYL API] Melakukan konfigurasi batas resource RAM / CPU...`,
          `[PTERODACTYL API] SUCCESS: Batas sumber daya kontainer disesuaikan!`
        ]);
      }
      setIsPteroTesting(false);
    }, 1500);

    logAdminAction(`Simulasi Integrasi API Pterodactyl: ${featureName}`);
  };

  const handleManualSyncAll = () => {
    setIsSyncing(true);
    setPteroLogs(l => [...l, '[SINKRONISASI] Memulai sinkronisasi ulang seluruh daemon node...', '[SINKRONISASI] Menarik status alokasi RAM / CPU dari Docker...']);
    setTimeout(() => {
      const nowStr = new Date().toLocaleString('id-ID');
      setLastSyncTime(nowStr);
      localStorage.setItem('ptero_last_sync', nowStr);
      setIsSyncing(false);
      setPteroLogs(l => [...l, '✅ SINKRONISASI SELESAI: Seluruh status server disinkronkan kembali!']);
      logAdminAction('Melakukan sinkronisasi manual status API Pterodactyl');
    }, 1500);
  };

  const handleApproveInvoice = (invoiceId: string) => {
    const targetInvoice = invoices.find(i => i.id === invoiceId);
    if (!targetInvoice) return;

    // Set as paid
    const updatedInvoices = invoices.map(i => {
      if (i.id === invoiceId) return { ...i, status: 'paid' as const };
      return i;
    });

    // If topup type, credit balance to target user
    if (targetInvoice.type === 'topup') {
      const updatedUsers = users.map(u => {
        if (u.id === targetInvoice.userId) {
          return { ...u, balance: u.balance + targetInvoice.amount };
        }
        return u;
      });
      onUpdateUsers(updatedUsers);
    }

    onUpdateInvoices(updatedInvoices);
    logAdminAction(`Menyetujui Invoice: ${invoiceId} (Nominal: ${formatIDR(targetInvoice.amount)})`);
    alert('Invoice berhasil disetujui! Saldo terkirim ke dompet user secara otomatis.');
  };

  const handleCancelInvoice = (invoiceId: string) => {
    const updated = invoices.map(i => {
      if (i.id === invoiceId) return { ...i, status: 'failed' as const };
      return i;
    });
    onUpdateInvoices(updated);
    logAdminAction(`Membatalkan Invoice: ${invoiceId}`);
    alert('Invoice berhasil dibatalkan.');
  };

  return (
    <div id="admin-panel-container" className="min-h-screen bg-[#04091C] pt-24 pb-16 text-white grid-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Admin Header Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-white/10 mb-8 gap-4 text-left">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#35FF90] font-extrabold uppercase">MAVIX EXECUTIVE ACCESS PANEL</span>
            <h1 className="text-2xl font-black font-display text-white mt-1">ADMINISTRATIVE DASHBOARD</h1>
          </div>
          
          <div className="flex items-center gap-2.5 font-mono text-xs">
            <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[#35FF90] font-bold">
              ● ADMIN ACTIVE: {currentUser.username}
            </span>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-white/5 pb-4">
          {[
            { id: 'statistik', name: 'Dashboard', icon: Shield },
            { id: 'users', name: 'Manajemen User', icon: Users },
            { id: 'servers', name: 'Manajemen Server', icon: Cpu },
            { id: 'packages', name: 'Manajemen Paket', icon: Layers },
            { id: 'pterodactyl', name: 'Pterodactyl API', icon: Terminal },
            { id: 'tickets', name: 'Tiket Support', icon: LifeBuoy },
            { id: 'invoices', name: 'Kelola Invoice', icon: FileText },
            { id: 'website', name: 'Web & Keamanan', icon: SettingsIcon },
            { id: 'audit', name: 'Audit Log Admin', icon: ShieldAlert },
          ].map(tab => {
            const Icon = tab.icon;
            const isSel = activeAdminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveAdminTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isSel 
                    ? 'bg-[#35FF90] text-[#04091C] shadow-[0_0_15px_rgba(53,255,144,0.25)]' 
                    : 'bg-[#101935] hover:bg-white/5 text-[#A7B3D0] hover:text-white border border-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        <div className="text-left">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: STATISTIK & OVERVIEW */}
            {activeAdminTab === 'statistik' && (
              <motion.div
                key="statistik"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[
                    { label: 'TOTAL USER', value: totalUserCount, color: 'text-sky-400', desc: 'Jumlah akun terdaftar' },
                    { label: 'TOTAL SERVER', value: totalServerCount, color: 'text-amber-400', desc: 'Jumlah kontainer aktif' },
                    { label: 'TOTAL INVOICE', value: totalInvoiceCount, color: 'text-purple-400', desc: 'Sistem tagihan digital' },
                    { label: 'TIKET DUKUNGAN', value: totalTicketCount, color: 'text-rose-400', desc: 'Aduan & bantuan user' },
                    { label: 'TOTAL PENDAPATAN', value: formatIDR(totalRevenue), color: 'text-emerald-400', desc: 'Penjualan sewa hosting' },
                    { label: 'TOTAL TOP UP', value: formatIDR(totalSaldoMasuk), color: 'text-[#35FF90]', desc: 'Sistem deposit QRIS/VA' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-[#101935] border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
                      <span className="text-[9px] font-mono font-bold text-[#A7B3D0] uppercase tracking-wider">{stat.label}</span>
                      <p className={`text-base font-black ${stat.color} font-mono mt-3`}>{stat.value}</p>
                      <span className="text-[9px] text-gray-500 mt-1">{stat.desc}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                  {/* Quick summary status */}
                  <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-[#101935] p-5 space-y-4">
                    <h3 className="font-display font-black text-sm tracking-wider text-white">REKAP TRANSAKSI TERBARU</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-white/10 text-[#A7B3D0] font-mono text-[10px]">
                            <th className="py-2.5">ID Invoice</th>
                            <th>Target User</th>
                            <th>Tipe</th>
                            <th>Nominal</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoices.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-4 text-center text-gray-500 font-mono">Belum ada transaksi di database.</td>
                            </tr>
                          ) : (
                            invoices.slice(0, 5).map(inv => (
                              <tr key={inv.id} className="border-b border-white/5 font-mono">
                                <td className="py-2.5 text-gray-300 font-bold">{inv.id}</td>
                                <td className="text-[#A7B3D0]">{inv.userEmail}</td>
                                <td className="capitalize text-gray-300">{inv.type}</td>
                                <td className="text-white font-bold">{formatIDR(inv.amount)}</td>
                                <td>
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                    inv.status === 'paid' ? 'bg-[#35FF90]/15 text-[#35FF90]' : 'bg-yellow-500/10 text-yellow-300'
                                  }`}>
                                    {inv.status.toUpperCase()}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* System State Info Card */}
                  <div className="bg-[#101935] border border-white/5 rounded-2xl p-5 space-y-4">
                    <h3 className="font-display font-black text-sm tracking-wider text-white">SISTEM & PARAMETER</h3>
                    <div className="space-y-3 font-mono text-xs">
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-[#A7B3D0]">Autentikasi Sesi</span>
                        <span className="text-[#35FF90] font-bold">Secure JWT API</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-[#A7B3D0]">Keamanan Database</span>
                        <span className="text-sky-400 font-bold">Auto Sandbox Local</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-[#A7B3D0]">Rute Pterodactyl</span>
                        <span className="text-amber-400 font-bold">Simulated Port API</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-[#A7B3D0]">Status Sandbox</span>
                        <span className="text-emerald-400 font-bold">Uptime 99.9%</span>
                      </div>
                    </div>
                    <div className="bg-[#04091C] rounded-xl border border-white/5 p-3.5 text-center">
                      <p className="text-[10px] text-[#A7B3D0] leading-relaxed">
                        Seluruh aksi dan aktivitas Anda terekam dalam Audit Log demi transparansi administrasi.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: MANAJEMEN USER */}
            {activeAdminTab === 'users' && (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <div>
                    <h2 className="text-lg font-black font-display text-white">DAFTAR USER REGISTERED</h2>
                    <p className="text-xs text-[#A7B3D0] mt-1">Buat, edit, suspend, serta modifikasi saldo dompet pengguna.</p>
                  </div>
                  <button 
                    onClick={() => { setEditingUser(null); setIsAddUserOpen(!isAddUserOpen); }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#35FF90] text-[#04091C] font-bold text-xs rounded-xl hover:opacity-90 transition-all"
                  >
                    <PlusCircle className="w-4 h-4" /> Tambah User Baru
                  </button>
                </div>

                {/* Balance Modal Form (Inline block if selected) */}
                {selectedBalanceUser && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#101935] border border-emerald-500/30 p-5 rounded-2xl mb-4 text-xs font-mono"
                  >
                    <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                      <span className="font-bold text-[#35FF90] uppercase tracking-wider flex items-center gap-2">
                        <DollarSign className="w-4 h-4" /> Kelola Saldo User: {selectedBalanceUser.username}
                      </span>
                      <button onClick={() => setSelectedBalanceUser(null)} className="text-[#A7B3D0] hover:text-white font-bold">BATAL</button>
                    </div>
                    <form onSubmit={handleUpdateBalance} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <div>
                        <label className="block text-[#A7B3D0] text-[10px] mb-1 uppercase tracking-widest">Saldo Saat Ini</label>
                        <input 
                          type="text" 
                          value={formatIDR(selectedBalanceUser.balance)} 
                          disabled 
                          className="w-full bg-[#04091C] border border-white/5 py-2 px-3.5 rounded-lg text-gray-400 font-bold" 
                        />
                      </div>
                      <div>
                        <label className="block text-[#A7B3D0] text-[10px] mb-1 uppercase tracking-widest">Nominal Balance (Gunakan minus (-) untuk mengurangi)</label>
                        <input 
                          type="number" 
                          value={balanceAmount} 
                          onChange={(e) => setBalanceAmount(Number(e.target.value))}
                          className="w-full bg-[#04091C] border border-white/10 py-2 px-3.5 rounded-lg text-white font-bold focus:border-[#35FF90]/40" 
                        />
                      </div>
                      <div>
                        <button 
                          type="submit" 
                          className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors text-xs"
                        >
                          Simpan Perubahan Saldo
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* Add/Edit User Form Toggle Drawer */}
                {isAddUserOpen || editingUser ? (
                  <motion.form 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    onSubmit={handleCreateOrUpdateUser}
                    className="bg-[#101935] border border-white/10 rounded-2xl p-5 space-y-4"
                  >
                    <h3 className="text-sm font-bold text-white uppercase font-display border-b border-white/5 pb-2">
                      {editingUser ? `EDIT USER: ${editingUser.username}` : 'DAFTAR USER BARU (ADMIN MODE)'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                      <div>
                        <label className="block text-[#A7B3D0] mb-1">Nama Depan *</label>
                        <input 
                          type="text" 
                          value={userFormFirstName}
                          onChange={(e) => setUserFormFirstName(e.target.value)}
                          placeholder="Nama Depan" 
                          className="w-full bg-[#0B122E] border border-white/10 py-2 px-3 rounded-lg text-white" 
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[#A7B3D0] mb-1">Nama Belakang *</label>
                        <input 
                          type="text" 
                          value={userFormLastName}
                          onChange={(e) => setUserFormLastName(e.target.value)}
                          placeholder="Nama Belakang" 
                          className="w-full bg-[#0B122E] border border-white/10 py-2 px-3 rounded-lg text-white" 
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[#A7B3D0] mb-1">Username *</label>
                        <input 
                          type="text" 
                          value={userFormUsername}
                          onChange={(e) => setUserFormUsername(e.target.value)}
                          placeholder="username" 
                          className="w-full bg-[#0B122E] border border-white/10 py-2 px-3 rounded-lg text-white" 
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[#A7B3D0] mb-1">Email Address *</label>
                        <input 
                          type="email" 
                          value={userFormEmail}
                          onChange={(e) => setUserFormEmail(e.target.value)}
                          placeholder="email@mavix.store" 
                          className="w-full bg-[#0B122E] border border-white/10 py-2 px-3 rounded-lg text-white" 
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[#A7B3D0] mb-1">Nomor WhatsApp *</label>
                        <input 
                          type="text" 
                          value={userFormPhone}
                          onChange={(e) => setUserFormPhone(e.target.value)}
                          placeholder="081..." 
                          className="w-full bg-[#0B122E] border border-white/10 py-2 px-3 rounded-lg text-white" 
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[#A7B3D0] mb-1">Username Discord (Opsional)</label>
                        <input 
                          type="text" 
                          value={userFormDiscord}
                          onChange={(e) => setUserFormDiscord(e.target.value)}
                          placeholder="Username Discord" 
                          className="w-full bg-[#0B122E] border border-white/10 py-2 px-3 rounded-lg text-white" 
                        />
                      </div>
                      <div>
                        <label className="block text-[#A7B3D0] mb-1">Password {editingUser && '(Biarkan kosong jika tidak ingin ganti)'}</label>
                        <input 
                          type="password" 
                          value={userFormPassword}
                          onChange={(e) => setUserFormPassword(e.target.value)}
                          placeholder="Kata sandi" 
                          className="w-full bg-[#0B122E] border border-white/10 py-2 px-3 rounded-lg text-white" 
                          required={!editingUser}
                        />
                      </div>
                      <div>
                        <label className="block text-[#A7B3D0] mb-1">Peran / Role Pengguna *</label>
                        <select
                          value={userFormRole}
                          onChange={(e) => setUserFormRole(e.target.value as any)}
                          className="w-full bg-[#0B122E] border border-white/10 py-2 px-3 rounded-lg text-white"
                        >
                          <option value="user">User Biasa (Customer)</option>
                          <option value="admin">Admin Panel (Akses Penuh)</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end pt-2 text-xs">
                      <button 
                        type="button" 
                        onClick={() => { setEditingUser(null); setIsAddUserOpen(false); }}
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                      >
                        Batal
                      </button>
                      <button 
                        type="submit" 
                        className="px-5 py-2 bg-[#35FF90] text-[#04091C] font-bold rounded-lg hover:opacity-90"
                      >
                        {editingUser ? 'Perbarui User' : 'Buat User Baru'}
                      </button>
                    </div>
                  </motion.form>
                ) : null}

                {/* User Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {users.map(user => {
                    const isSusp = user.status === 'suspended';
                    return (
                      <div 
                        key={user.id} 
                        className={`rounded-2xl border bg-[#101935] p-5 flex flex-col justify-between transition-all ${
                          isSusp ? 'border-red-500/30 bg-red-950/5' : 'border-white/5'
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                              user.role === 'admin' ? 'bg-red-500/15 text-red-400' : 'bg-sky-500/15 text-sky-400'
                            }`}>
                              {user.role}
                            </span>
                            
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                              isSusp ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/10 text-emerald-300'
                            }`}>
                              {user.status.toUpperCase()}
                            </span>
                          </div>

                          <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                            {user.username}
                            {user.firstName && (
                              <span className="text-xs text-[#A7B3D0] font-light">({user.firstName} {user.lastName})</span>
                            )}
                          </h3>
                          
                          <p className="text-xs text-gray-400 font-mono mt-1 break-all">{user.email}</p>
                          <p className="text-[11px] text-gray-500 font-mono mt-0.5">WA: {user.phone || '-'}</p>

                          {/* Balance Display */}
                          <div className="bg-[#04091C] rounded-xl border border-white/5 px-3 py-2.5 mt-4 flex justify-between items-center text-xs">
                            <span className="text-[#A7B3D0] font-mono text-[10px]">SALDO DOMPET:</span>
                            <span className="font-bold font-mono text-[#35FF90]">{formatIDR(user.balance)}</span>
                          </div>
                        </div>

                        {/* Actions group */}
                        <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-white/5">
                          <button
                            onClick={() => {
                              setEditingUser(user);
                              setUserFormFirstName(user.firstName || '');
                              setUserFormLastName(user.lastName || '');
                              setUserFormUsername(user.username);
                              setUserFormEmail(user.email);
                              setUserFormPhone(user.phone || '');
                              setUserFormDiscord(user.discord || '');
                              setUserFormRole(user.role);
                              setUserFormPassword('');
                            }}
                            className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#0B122E] hover:bg-[#0B122E]/80 border border-white/10 text-xs text-[#A7B3D0] hover:text-white transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" /> Edit
                          </button>

                          <button
                            onClick={() => { setSelectedBalanceUser(user); setBalanceAmount(10000); }}
                            className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 text-xs text-emerald-300 hover:text-emerald-200 transition-colors"
                          >
                            <DollarSign className="w-3.5 h-3.5" /> Kelola Saldo
                          </button>

                          <button
                            onClick={() => handleResetPassword(user.id)}
                            className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#0B122E] hover:bg-white/5 border border-white/5 text-xs text-gray-400 hover:text-white transition-colors"
                          >
                            <Lock className="w-3.5 h-3.5" /> Reset Pass
                          </button>

                          <button
                            onClick={() => handleToggleSuspendUser(user.id, user.status)}
                            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg border text-xs font-semibold transition-colors ${
                              isSusp 
                                ? 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-[#35FF90]' 
                                : 'bg-red-500/10 hover:bg-red-500/20 border-red-500/20 text-red-400'
                            }`}
                          >
                            {isSusp ? <Check className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                            {isSusp ? 'Unsuspend' : 'Suspend'}
                          </button>

                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={user.id === currentUser.id}
                            className="col-span-2 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-950/25 hover:bg-red-900/40 border border-red-500/10 text-xs text-red-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Hapus User Secara Permanen
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* TAB 3: MANAJEMEN SERVER */}
            {activeAdminTab === 'servers' && (
              <motion.div
                key="servers"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <div>
                    <h2 className="text-lg font-black font-display text-white">DAFTAR KONTEN SERVER MINECRAFT AKTIF</h2>
                    <p className="text-xs text-[#A7B3D0] mt-1">Pantau semua server, deploy server baru, suspensi paksa, atau ubah alokasi hardware kontainer.</p>
                  </div>
                  <button 
                    onClick={() => setIsAddServerOpen(!isAddServerOpen)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#35FF90] text-[#04091C] font-bold text-xs rounded-xl hover:opacity-90 transition-all"
                  >
                    <PlusCircle className="w-4 h-4" /> Deploy Server Baru
                  </button>
                </div>

                {/* Transfer Modal */}
                {transferServerTarget && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#101935] border border-cyan-500/30 p-5 rounded-2xl mb-4 text-xs font-mono"
                  >
                    <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-4">
                      <span className="font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                        <ArrowLeftRight className="w-4 h-4" /> Transfer Kepemilikan Server: {transferServerTarget.name}
                      </span>
                      <button onClick={() => setTransferServerTarget(null)} className="text-[#A7B3D0] hover:text-white font-bold">BATAL</button>
                    </div>
                    <form onSubmit={handleTransferServer} className="flex flex-col md:flex-row gap-4 items-end">
                      <div className="flex-1">
                        <label className="block text-[#A7B3D0] text-[10px] mb-1.5 uppercase tracking-widest">Pilih Pemilik Baru (User Terdaftar)</label>
                        <select
                          value={transferTargetUserId}
                          onChange={(e) => setTransferTargetUserId(e.target.value)}
                          className="w-full bg-[#04091C] border border-white/10 py-2 px-3 rounded-lg text-white"
                          required
                        >
                          <option value="">-- PILIH USER PEMILIK --</option>
                          {users.map(u => (
                            <option key={u.id} value={u.id}>{u.username} ({u.email})</option>
                          ))}
                        </select>
                      </div>
                      <button 
                        type="submit" 
                        disabled={!transferTargetUserId}
                        className="py-2.5 px-5 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors text-xs"
                      >
                        Lakukan Transfer Server
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* Edit Resource Modal */}
                {editingServerResource && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#101935] border border-[#35FF90]/35 p-5 rounded-2xl mb-4 text-xs font-mono"
                  >
                    <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-4">
                      <span className="font-bold text-[#35FF90] uppercase tracking-wider flex items-center gap-2">
                        <Cpu className="w-4 h-4" /> Ubah Resource Alokasi Server: {editingServerResource.name}
                      </span>
                      <button onClick={() => setEditingServerResource(null)} className="text-[#A7B3D0] hover:text-white font-bold">BATAL</button>
                    </div>
                    <form onSubmit={handleUpdateServerResources} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <div>
                        <label className="block text-[#A7B3D0] text-[10px] mb-1.5 uppercase">Batas RAM Kontainer (GB)</label>
                        <input
                          type="number"
                          value={editingServerResource.ram}
                          onChange={(e) => setEditingServerResource({ ...editingServerResource, ram: Number(e.target.value) })}
                          className="w-full bg-[#04091C] border border-white/10 py-2 px-3 rounded-lg text-white font-mono"
                          min={1}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[#A7B3D0] text-[10px] mb-1.5">Model CPU Node</label>
                        <input
                          type="text"
                          value={editingServerResource.cpu}
                          onChange={(e) => setEditingServerResource({ ...editingServerResource, cpu: e.target.value })}
                          className="w-full bg-[#04091C] border border-white/10 py-2 px-3 rounded-lg text-white"
                          required
                        />
                      </div>
                      <button 
                        type="submit" 
                        className="py-2.5 px-5 bg-[#35FF90] hover:bg-[#35FF90]/90 text-[#04091C] font-bold rounded-lg transition-all text-xs"
                      >
                        Simpan Alokasi Kontainer
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* Reinstall Progress simulated block */}
                {reinstallingServerId && (
                  <div className="rounded-2xl border border-amber-500/30 bg-[#0B122E] p-5 mb-4 text-xs">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2 animate-pulse">
                        <RefreshCw className="w-4 h-4 animate-spin" /> Sedang Mere-instal Server...
                      </span>
                      <span className="font-mono text-white font-bold">{reinstallProgress}%</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-4 border border-white/5">
                      <div className="h-full bg-amber-400 transition-all duration-300" style={{ width: `${reinstallProgress}%` }} />
                    </div>
                    {/* Log Terminal Block */}
                    <div className="bg-[#04091C] rounded-xl border border-white/5 p-4 font-mono text-[10px] text-gray-300 space-y-1 text-left max-h-36 overflow-y-auto">
                      {reinstallLogs.map((log, lIdx) => (
                        <p key={lIdx}>{log}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Server Toggle Form */}
                {isAddServerOpen ? (
                  <motion.form 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    onSubmit={handleCreateServerByAdmin}
                    className="bg-[#101935] border border-white/10 rounded-2xl p-5 space-y-4 text-xs font-sans"
                  >
                    <h3 className="font-bold text-white uppercase font-display border-b border-white/5 pb-2">DEPLOY SERVER MINECRAFT BARU</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[#A7B3D0] mb-1">Pilih Owner Server *</label>
                        <select
                          value={serverFormUserId}
                          onChange={(e) => setServerFormUserId(e.target.value)}
                          className="w-full bg-[#0B122E] border border-white/10 py-2 px-3 rounded-lg text-white"
                          required
                        >
                          <option value="">-- SELECT USER OWNER --</option>
                          {users.map(u => (
                            <option key={u.id} value={u.id}>{u.username} ({u.email})</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#A7B3D0] mb-1">Nama Kontainer Server *</label>
                        <input
                          type="text"
                          value={serverFormName}
                          onChange={(e) => setServerFormName(e.target.value)}
                          placeholder="Misal: Survival Crafting Nusantara"
                          className="w-full bg-[#0B122E] border border-white/10 py-2 px-3 rounded-lg text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[#A7B3D0] mb-1">Pilih Template Paket *</label>
                        <select
                          value={serverFormPackage}
                          onChange={(e) => setServerFormPackage(e.target.value as any)}
                          className="w-full bg-[#0B122E] border border-white/10 py-2 px-3 rounded-lg text-white"
                        >
                          <option value="standar">PAKET STANDAR</option>
                          <option value="medium">PAKET MEDIUM</option>
                          <option value="prime">PAKET PRIME</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#A7B3D0] mb-1">Kustom RAM Size (GB) *</label>
                        <input
                          type="number"
                          value={serverFormRam}
                          onChange={(e) => setServerFormRam(Number(e.target.value))}
                          className="w-full bg-[#0B122E] border border-white/10 py-2 px-3 rounded-lg text-white font-mono"
                          min={1}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[#A7B3D0] mb-1">CPU Model *</label>
                        <input
                          type="text"
                          value={serverFormCpu}
                          onChange={(e) => setServerFormCpu(e.target.value)}
                          className="w-full bg-[#0B122E] border border-white/10 py-2 px-3 rounded-lg text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[#A7B3D0] mb-1">Pilihan Region *</label>
                        <select
                          value={serverFormRegion}
                          onChange={(e) => setServerFormRegion(e.target.value)}
                          className="w-full bg-[#0B122E] border border-white/10 py-2 px-3 rounded-lg text-white"
                        >
                          <option value="Region Indonesia">Region Indonesia (Jakarta Datacenter)</option>
                          <option value="Region Hongkong">Region Hongkong (Core Node)</option>
                          <option value="Region Singapore">Region Singapore (Asia Core)</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 text-xs pt-2">
                      <button 
                        type="button" 
                        onClick={() => setIsAddServerOpen(false)}
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                      >
                        Batal
                      </button>
                      <button 
                        type="submit" 
                        className="px-5 py-2 bg-[#35FF90] text-[#04091C] font-bold rounded-lg hover:opacity-90"
                      >
                        Deploy Server Instan
                      </button>
                    </div>
                  </motion.form>
                ) : null}

                {/* Servers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {servers.map(server => {
                    const isOnline = server.status === 'online';
                    const ownerUser = users.find(u => u.id === server.userId);
                    return (
                      <div 
                        key={server.id} 
                        className="rounded-2xl border border-white/5 bg-[#101935] p-5 flex flex-col justify-between hover:border-[#35FF90]/30 transition-all duration-300"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-[10px] font-mono bg-[#0B122E] px-2.5 py-1 rounded border border-white/5 text-[#35FF90] font-bold">
                              {server.packageName}
                            </span>
                            
                            <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full ${
                              isOnline ? 'bg-[#35FF90]/15 text-[#35FF90]' : 'bg-red-500/10 text-red-400'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-[#35FF90]' : 'bg-red-500'}`} />
                              {server.status.toUpperCase()}
                            </span>
                          </div>

                          <h3 className="font-bold text-white text-sm">{server.name}</h3>
                          <p className="text-xs text-gray-400 mt-1 font-mono">Owner: <strong className="text-sky-400">{ownerUser ? `${ownerUser.username} (${ownerUser.email})` : 'Tidak Ditemukan'}</strong></p>
                          <p className="text-[10px] text-gray-500 font-mono mt-0.5">IP Address: {server.ipAddress}</p>

                          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono mt-4 text-[#A7B3D0]">
                            <div className="bg-[#0B122E] px-3 py-2 rounded-xl border border-white/5">
                              <span className="text-gray-500 block mb-0.5">RAM Alokasi</span>
                              <strong className="text-white">{server.ram} GB</strong>
                            </div>
                            <div className="bg-[#0B122E] px-3 py-2 rounded-xl border border-white/5">
                              <span className="text-gray-500 block mb-0.5">CPU Hardware</span>
                              <strong className="text-white truncate block">{server.cpu}</strong>
                            </div>
                          </div>
                        </div>

                        {/* Control buttons */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-5 pt-4 border-t border-white/5">
                          <button
                            onClick={() => handleToggleServerStatus(server.id, server.status)}
                            className={`flex items-center justify-center gap-1 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                              isOnline 
                                ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/15' 
                                : 'bg-[#35FF90]/10 border-[#35FF90]/20 text-[#35FF90]'
                            }`}
                          >
                            <Shield className="w-3.5 h-3.5" />
                            {isOnline ? 'Suspend' : 'Unsuspend'}
                          </button>

                          <button
                            onClick={() => handleReinstallServerSimulation(server.id)}
                            className="flex items-center justify-center gap-1 py-1.5 rounded-lg bg-[#0B122E] hover:bg-white/5 border border-white/10 text-xs text-white text-[10px] transition-all"
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                            Reinstall
                          </button>

                          <button
                            onClick={() => setTransferServerTarget(server)}
                            className="flex items-center justify-center gap-1 py-1.5 rounded-lg bg-[#0B122E] hover:bg-white/5 border border-white/10 text-xs text-white text-[10px] transition-all"
                          >
                            <ArrowLeftRight className="w-3.5 h-3.5 text-cyan-400" />
                            Transfer
                          </button>

                          <button
                            onClick={() => setEditingServerResource(server)}
                            className="col-span-1 md:col-span-2 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-[#0B122E] hover:bg-[#35FF90]/10 border border-white/5 text-xs text-[#A7B3D0] hover:text-[#35FF90] text-[10px] transition-all"
                          >
                            <Cpu className="w-3.5 h-3.5" />
                            Ubah Resource (RAM/CPU)
                          </button>

                          <button
                            onClick={() => handleDeleteServerByAdmin(server.id)}
                            className="flex items-center justify-center gap-1 py-1.5 rounded-lg bg-red-950/20 hover:bg-red-900/30 border border-red-500/10 text-xs text-red-400 text-[10px] transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Hapus
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* TAB 4: MANAJEMEN PAKET & STOK */}
            {activeAdminTab === 'packages' && (
              <motion.div
                key="packages"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <div>
                    <h2 className="text-lg font-black font-display text-white">MANAJEMEN PAKET &amp; STOK HOSTING</h2>
                    <p className="text-xs text-[#A7B3D0] mt-1">Ubah harga sewa per GB, deskripsi paket CPU, set stok, atau hapus dan tambahkan tipe paket baru.</p>
                  </div>
                  <button 
                    onClick={() => { setEditingPackage(null); setIsAddPackageOpen(!isAddPackageOpen); }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#35FF90] text-[#04091C] font-bold text-xs rounded-xl hover:opacity-90 transition-all"
                  >
                    <PlusCircle className="w-4 h-4" /> Tambah Paket Baru
                  </button>
                </div>

                {/* Add/Edit Package Form */}
                {isAddPackageOpen || editingPackage ? (
                  <motion.form 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    onSubmit={handleCreateOrUpdatePackage}
                    className="bg-[#101935] border border-white/10 rounded-2xl p-5 space-y-4 text-xs font-sans"
                  >
                    <h3 className="font-bold text-white uppercase font-display border-b border-white/5 pb-2">
                      {editingPackage ? `EDIT PAKET: ${editingPackage.name}` : 'BUAT PAKET HOSTING BARU'}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[#A7B3D0] mb-1">ID Unik Paket * (Hanya huruf kecil, misal: 'extreme')</label>
                        <input
                          type="text"
                          value={packageFormId}
                          onChange={(e) => setPackageFormId(e.target.value)}
                          placeholder="extreme"
                          className="w-full bg-[#0B122E] border border-white/10 py-2.5 px-3 rounded-lg text-white"
                          disabled={!!editingPackage}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[#A7B3D0] mb-1">Nama Display Paket *</label>
                        <input
                          type="text"
                          value={packageFormName}
                          onChange={(e) => setPackageFormName(e.target.value)}
                          placeholder="PAKET EXTREME RYZEN"
                          className="w-full bg-[#0B122E] border border-white/10 py-2.5 px-3 rounded-lg text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[#A7B3D0] mb-1">Harga Sewa per GB (Rp) *</label>
                        <input
                          type="number"
                          value={packageFormPrice}
                          onChange={(e) => setPackageFormPrice(Number(e.target.value))}
                          placeholder="15000"
                          className="w-full bg-[#0B122E] border border-white/10 py-2.5 px-3 rounded-lg text-white font-mono font-bold"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[#A7B3D0] mb-1">Default RAM (GB)</label>
                        <input
                          type="number"
                          value={packageFormRam}
                          onChange={(e) => setPackageFormRam(Number(e.target.value))}
                          className="w-full bg-[#0B122E] border border-white/10 py-2.5 px-3 rounded-lg text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[#A7B3D0] mb-1">Spesifikasi Model CPU *</label>
                        <input
                          type="text"
                          value={packageFormCpu}
                          onChange={(e) => setPackageFormCpu(e.target.value)}
                          placeholder="Ryzen 9 5950X"
                          className="w-full bg-[#0B122E] border border-white/10 py-2.5 px-3 rounded-lg text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[#A7B3D0] mb-1">Lokasi Region Datacenter *</label>
                        <input
                          type="text"
                          value={packageFormRegion}
                          onChange={(e) => setPackageFormRegion(e.target.value)}
                          placeholder="Region Indonesia"
                          className="w-full bg-[#0B122E] border border-white/10 py-2.5 px-3 rounded-lg text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[#A7B3D0] mb-1">Stok Awal Paket *</label>
                        <input
                          type="number"
                          value={packageFormStock}
                          onChange={(e) => setPackageFormStock(Number(e.target.value))}
                          className="w-full bg-[#0B122E] border border-white/10 py-2.5 px-3 rounded-lg text-white font-mono"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[#A7B3D0] mb-1">Fitur Paket (Pisahkan baris per baris untuk bullet point)</label>
                        <textarea
                          rows={4}
                          value={packageFormFeatures}
                          onChange={(e) => setPackageFormFeatures(e.target.value)}
                          placeholder="Ryzen 9 5950X&#10;Region Indonesia&#10;Anti Down&#10;SSD NVMe Premium"
                          className="w-full bg-[#0B122E] border border-white/10 py-2 px-3 rounded-lg text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 text-xs">
                      <button 
                        type="button" 
                        onClick={() => { setEditingPackage(null); setIsAddPackageOpen(false); }}
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
                      >
                        Batal
                      </button>
                      <button 
                        type="submit" 
                        className="px-5 py-2 bg-[#35FF90] text-[#04091C] font-bold rounded-lg hover:opacity-90"
                      >
                        {editingPackage ? 'Simpan Paket' : 'Tambah Paket'}
                      </button>
                    </div>
                  </motion.form>
                ) : null}

                {/* Display Packages with Stock Modification Interface */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {packages.map(pkg => {
                    const isOut = pkg.stock <= 0;
                    return (
                      <div 
                        key={pkg.id} 
                        className="rounded-2xl border border-white/5 bg-[#101935] p-5 flex flex-col justify-between hover:border-[#35FF90]/30 transition-all duration-300"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-[10px] font-mono tracking-wider font-bold text-[#35FF90] uppercase">{pkg.id}</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              isOut ? 'bg-red-500/15 text-red-400' : 'bg-emerald-500/10 text-[#35FF90]'
                            }`}>
                              {isOut ? 'STOCK HABIS' : 'Tersedia'}
                            </span>
                          </div>

                          <h3 className="font-bold text-white font-display text-base tracking-wider uppercase">{pkg.name}</h3>
                          <p className="text-xs text-[#A7B3D0] mt-1">CPU: <strong className="text-white">{pkg.cpu}</strong> | {pkg.region}</p>
                          <p className="text-xs text-emerald-400 mt-2 font-mono font-bold text-lg">{formatIDR(pkg.price)} <span className="text-xs text-gray-500">/ GB</span></p>

                          <ul className="space-y-1.5 mt-4 text-[10px] text-gray-400 list-disc pl-4">
                            {pkg.features.map((f, fIdx) => (
                              <li key={fIdx}>{f}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Stock Controls & Delete */}
                        <div className="mt-6 pt-4 border-t border-white/5 space-y-4">
                          <div className="flex justify-between items-center bg-[#04091C] border border-white/5 rounded-xl p-2 text-xs">
                            <span className="text-[#A7B3D0] font-mono text-[10px] pl-1">STOK DISPLAY:</span>
                            <div className="flex items-center gap-1.5 font-mono">
                              <button 
                                onClick={() => handleUpdateStockDirect(pkg.id, -1)}
                                className="w-6 h-6 flex items-center justify-center bg-[#101935] border border-white/10 hover:border-red-500/30 rounded text-red-400"
                              >
                                -
                              </button>
                              <span className="w-10 text-center font-bold text-white">{pkg.stock}</span>
                              <button 
                                onClick={() => handleUpdateStockDirect(pkg.id, 1)}
                                className="w-6 h-6 flex items-center justify-center bg-[#101935] border border-white/10 hover:border-[#35FF90]/30 rounded text-[#35FF90]"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => {
                                setEditingPackage(pkg);
                                setPackageFormId(pkg.id);
                                setPackageFormName(pkg.name);
                                setPackageFormPrice(pkg.price);
                                setPackageFormRam(pkg.ram);
                                setPackageFormCpu(pkg.cpu);
                                setPackageFormRegion(pkg.region);
                                setPackageFormStock(pkg.stock);
                                setPackageFormFeatures(pkg.features.join('\n'));
                              }}
                              className="py-2 rounded-lg bg-[#0B122E] hover:bg-white/5 border border-white/10 text-xs text-white flex items-center justify-center gap-1.5"
                            >
                              <Edit className="w-3.5 h-3.5" /> Edit Paket
                            </button>

                            <button
                              onClick={() => handleDeletePackage(pkg.id)}
                              className="py-2 rounded-lg bg-red-950/20 hover:bg-red-900/30 border border-red-500/10 text-xs text-red-400 flex items-center justify-center gap-1.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* TAB 5: PTERODACTYL PANEL INTEGRATION */}
            {activeAdminTab === 'pterodactyl' && (
              <motion.div
                key="pterodactyl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Upper Section Header */}
                <div className="pb-4 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-black font-display text-white uppercase tracking-wider flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-[#35FF90]" /> INTEGRASI PANEL PTERODACTYL & MONITORING DAEMON
                    </h2>
                    <p className="text-xs text-[#A7B3D0] mt-1">
                      Pusat kontrol integrasi otomatis untuk deployment instan server Minecraft, manajemen node dinamis, dan verifikasi alur API.
                    </p>
                  </div>
                  
                  {/* Sync Action */}
                  <div className="flex items-center gap-3 bg-[#101935] px-4 py-2 rounded-2xl border border-white/5">
                    <div className="text-right">
                      <span className="text-[9px] text-[#A7B3D0] uppercase font-mono block">Sinkronisasi Terakhir</span>
                      <strong className="text-[11px] text-white font-mono">{lastSyncTime}</strong>
                    </div>
                    <button
                      type="button"
                      disabled={isSyncing}
                      onClick={handleManualSyncAll}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-[#35FF90] transition-all cursor-pointer disabled:opacity-50"
                      title="Sinkronisasi Node Sekarang"
                    >
                      <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* 1. MONITORING DAEMON GRID PANEL */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* MaviX Lite Monitoring */}
                  <div className="bg-[#101935] border border-white/5 rounded-2xl p-5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all duration-500" />
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="px-2 py-0.5 text-[8px] font-bold font-mono bg-cyan-500/10 text-cyan-400 rounded-md uppercase tracking-wider">
                          MaviX Lite Node
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1">Node 01 (Hongkong)</h4>
                      </div>
                      {renderConnectionStatusBadge(liteConnectionStatus)}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] font-mono">
                      <div className="bg-[#04091C] p-2 rounded-xl border border-white/5">
                        <span className="text-gray-500 text-[10px] block">SERVER AKTIF</span>
                        <strong className="text-white text-sm">{servers.filter(s => s.packageId === 'standar').length} Server</strong>
                      </div>
                      <div className="bg-[#04091C] p-2 rounded-xl border border-white/5">
                        <span className="text-gray-500 text-[10px] block">STATUS DAEMON</span>
                        <strong className={liteConnectionStatus === 'connected' ? 'text-[#35FF90] text-sm' : liteConnectionStatus === 'testing' ? 'text-cyan-400 text-sm' : 'text-red-400 text-sm'}>
                          {liteConnectionStatus === 'connected' ? 'ONLINE' : liteConnectionStatus === 'testing' ? 'CHECKING' : 'OFFLINE'}
                        </strong>
                      </div>
                    </div>
                    <div className="mt-3.5 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-[#A7B3D0]">
                      <span>Node ID: <strong className="text-white">{pteroLiteNodeId}</strong></span>
                      <span>Egg ID: <strong className="text-white">{pteroLiteEggId}</strong></span>
                    </div>
                  </div>

                  {/* MaviX Medium Monitoring */}
                  <div className="bg-[#101935] border border-white/5 rounded-2xl p-5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all duration-500" />
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="px-2 py-0.5 text-[8px] font-bold font-mono bg-purple-500/10 text-purple-400 rounded-md uppercase tracking-wider">
                          MaviX Medium Node
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1">Node 02 (Jakarta)</h4>
                      </div>
                      {renderConnectionStatusBadge(mediumConnectionStatus)}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] font-mono">
                      <div className="bg-[#04091C] p-2 rounded-xl border border-white/5">
                        <span className="text-gray-500 text-[10px] block">SERVER AKTIF</span>
                        <strong className="text-white text-sm">{servers.filter(s => s.packageId === 'medium').length} Server</strong>
                      </div>
                      <div className="bg-[#04091C] p-2 rounded-xl border border-white/5">
                        <span className="text-gray-500 text-[10px] block">STATUS DAEMON</span>
                        <strong className={mediumConnectionStatus === 'connected' ? 'text-[#35FF90] text-sm' : mediumConnectionStatus === 'testing' ? 'text-cyan-400 text-sm' : 'text-red-400 text-sm'}>
                          {mediumConnectionStatus === 'connected' ? 'ONLINE' : mediumConnectionStatus === 'testing' ? 'CHECKING' : 'OFFLINE'}
                        </strong>
                      </div>
                    </div>
                    <div className="mt-3.5 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-[#A7B3D0]">
                      <span>Node ID: <strong className="text-white">{pteroMediumNodeId}</strong></span>
                      <span>Egg ID: <strong className="text-white">{pteroMediumEggId}</strong></span>
                    </div>
                  </div>

                  {/* MaviX Prime Monitoring */}
                  <div className="bg-[#101935] border border-white/5 rounded-2xl p-5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all duration-500" />
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="px-2 py-0.5 text-[8px] font-bold font-mono bg-amber-500/10 text-amber-400 rounded-md uppercase tracking-wider">
                          MaviX Prime Node
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1">Node 03 (Jakarta High CPU)</h4>
                      </div>
                      {renderConnectionStatusBadge(primeConnectionStatus)}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] font-mono">
                      <div className="bg-[#04091C] p-2 rounded-xl border border-white/5">
                        <span className="text-gray-500 text-[10px] block">SERVER AKTIF</span>
                        <strong className="text-white text-sm">{servers.filter(s => s.packageId === 'prime').length} Server</strong>
                      </div>
                      <div className="bg-[#04091C] p-2 rounded-xl border border-white/5">
                        <span className="text-gray-500 text-[10px] block">STATUS DAEMON</span>
                        <strong className={primeConnectionStatus === 'connected' ? 'text-[#35FF90] text-sm' : primeConnectionStatus === 'testing' ? 'text-cyan-400 text-sm' : 'text-red-400 text-sm'}>
                          {primeConnectionStatus === 'connected' ? 'ONLINE' : primeConnectionStatus === 'testing' ? 'CHECKING' : 'OFFLINE'}
                        </strong>
                      </div>
                    </div>
                    <div className="mt-3.5 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-[#A7B3D0]">
                      <span>Node ID: <strong className="text-white">{pteroPrimeNodeId}</strong></span>
                      <span>Egg ID: <strong className="text-white">{pteroPrimeEggId}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* Form Configurations Block */}
                  <div className="lg:col-span-3 space-y-5 text-xs">
                    {/* 2. GLOBAL PTERODACTYL SETTINGS */}
                    <div className="bg-[#101935] border border-white/5 rounded-2xl p-5 space-y-4">
                      <h3 className="font-bold text-[#35FF90] uppercase tracking-wider flex items-center gap-2">
                        <SettingsIcon className="w-4 h-4" /> Global Pterodactyl Settings
                      </h3>
                      <div>
                        <label className="block text-[#A7B3D0] mb-1.5 font-mono text-[10px] uppercase font-bold tracking-wider">Pterodactyl Panel URL</label>
                        <input
                          type="url"
                          value={pteroUrl}
                          onChange={(e) => setPteroUrl(e.target.value)}
                          placeholder="Contoh: https://panel.mavix.store"
                          className="w-full bg-[#0B122E] border border-white/10 py-2.5 px-3 rounded-lg text-white font-mono focus:outline-none focus:border-[#35FF90]/40 transition-all text-xs"
                          required
                        />
                        <span className="text-[10px] text-gray-500 mt-1.5 block leading-normal">
                          Domain atau URL Panel global yang melayani seluruh rute pengelolaan bagi seluruh klien Minecraft Hosting.
                        </span>
                      </div>
                    </div>

                    {/* 3. PER-PACKAGE PTERODACTYL CONFIGURATION */}
                    <div className="bg-[#101935] border border-white/5 rounded-2xl p-5 space-y-5">
                      <h3 className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-[#35FF90]" /> Paket Hosting Configurations
                      </h3>

                      <div className="space-y-6">
                        {/* 3.1. MaviX Lite Config */}
                        <div className="p-4 bg-[#0B122E] rounded-xl border border-white/5 space-y-3">
                          <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="font-bold text-[#35FF90] font-display uppercase tracking-tight text-xs flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-cyan-400" /> MaviX Lite (Standar)
                            </span>
                            <button
                              type="button"
                              onClick={() => handleTestConnection('standar')}
                              disabled={liteConnectionStatus === 'testing'}
                              className="px-3 py-1 bg-white/5 hover:bg-[#35FF90]/10 border border-white/10 hover:border-[#35FF90]/30 rounded-lg text-[10px] text-white hover:text-[#35FF90] font-bold transition-all cursor-pointer disabled:opacity-50"
                            >
                              Test Connection
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="md:col-span-2">
                              <label className="block text-[#A7B3D0] mb-1 font-mono text-[9px] uppercase font-semibold">Application API Key</label>
                              <div className="relative">
                                <input
                                  type={showLiteAppKey ? 'text' : 'password'}
                                  value={pteroLiteAppKey}
                                  onChange={(e) => setPteroLiteAppKey(e.target.value)}
                                  className="w-full bg-[#101935] border border-white/10 py-2 pl-3 pr-10 rounded-lg text-white font-mono text-[11px]"
                                  placeholder="ptla_..."
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowLiteAppKey(!showLiteAppKey)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white cursor-pointer"
                                  title={showLiteAppKey ? "Sembunyikan API Key" : "Tampilkan API Key"}
                                >
                                  {showLiteAppKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </div>
                            <div>
                              <label className="block text-[#A7B3D0] mb-1 font-mono text-[9px] uppercase font-semibold">Node ID</label>
                              <input
                                type="text"
                                value={pteroLiteNodeId}
                                onChange={(e) => setPteroLiteNodeId(e.target.value)}
                                className="w-full bg-[#101935] border border-white/10 py-2 px-3 rounded-lg text-white font-mono text-[11px]"
                              />
                            </div>
                            <div>
                              <label className="block text-[#A7B3D0] mb-1 font-mono text-[9px] uppercase font-semibold">Egg ID</label>
                              <input
                                type="text"
                                value={pteroLiteEggId}
                                onChange={(e) => setPteroLiteEggId(e.target.value)}
                                className="w-full bg-[#101935] border border-white/10 py-2 px-3 rounded-lg text-white font-mono text-[11px]"
                              />
                            </div>
                          </div>
                        </div>

                        {/* 3.2. MaviX Medium Config */}
                        <div className="p-4 bg-[#0B122E] rounded-xl border border-white/5 space-y-3">
                          <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="font-bold text-[#35FF90] font-display uppercase tracking-tight text-xs flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-purple-400" /> MaviX Medium
                            </span>
                            <button
                              type="button"
                              onClick={() => handleTestConnection('medium')}
                              disabled={mediumConnectionStatus === 'testing'}
                              className="px-3 py-1 bg-white/5 hover:bg-[#35FF90]/10 border border-white/10 hover:border-[#35FF90]/30 rounded-lg text-[10px] text-white hover:text-[#35FF90] font-bold transition-all cursor-pointer disabled:opacity-50"
                            >
                              Test Connection
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="md:col-span-2">
                              <label className="block text-[#A7B3D0] mb-1 font-mono text-[9px] uppercase font-semibold">Application API Key</label>
                              <div className="relative">
                                <input
                                  type={showMediumAppKey ? 'text' : 'password'}
                                  value={pteroMediumAppKey}
                                  onChange={(e) => setPteroMediumAppKey(e.target.value)}
                                  className="w-full bg-[#101935] border border-white/10 py-2 pl-3 pr-10 rounded-lg text-white font-mono text-[11px]"
                                  placeholder="ptla_..."
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowMediumAppKey(!showMediumAppKey)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white cursor-pointer"
                                  title={showMediumAppKey ? "Sembunyikan API Key" : "Tampilkan API Key"}
                                >
                                  {showMediumAppKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </div>
                            <div>
                              <label className="block text-[#A7B3D0] mb-1 font-mono text-[9px] uppercase font-semibold">Node ID</label>
                              <input
                                type="text"
                                value={pteroMediumNodeId}
                                onChange={(e) => setPteroMediumNodeId(e.target.value)}
                                className="w-full bg-[#101935] border border-white/10 py-2 px-3 rounded-lg text-white font-mono text-[11px]"
                              />
                            </div>
                            <div>
                              <label className="block text-[#A7B3D0] mb-1 font-mono text-[9px] uppercase font-semibold">Egg ID</label>
                              <input
                                type="text"
                                value={pteroMediumEggId}
                                onChange={(e) => setPteroMediumEggId(e.target.value)}
                                className="w-full bg-[#101935] border border-white/10 py-2 px-3 rounded-lg text-white font-mono text-[11px]"
                              />
                            </div>
                          </div>
                        </div>

                        {/* 3.3. MaviX Prime Config */}
                        <div className="p-4 bg-[#0B122E] rounded-xl border border-white/5 space-y-3">
                          <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="font-bold text-[#35FF90] font-display uppercase tracking-tight text-xs flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-amber-400" /> MaviX Prime
                            </span>
                            <button
                              type="button"
                              onClick={() => handleTestConnection('prime')}
                              disabled={primeConnectionStatus === 'testing'}
                              className="px-3 py-1 bg-white/5 hover:bg-[#35FF90]/10 border border-white/10 hover:border-[#35FF90]/30 rounded-lg text-[10px] text-white hover:text-[#35FF90] font-bold transition-all cursor-pointer disabled:opacity-50"
                            >
                              Test Connection
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="md:col-span-2">
                              <label className="block text-[#A7B3D0] mb-1 font-mono text-[9px] uppercase font-semibold">Application API Key</label>
                              <div className="relative">
                                <input
                                  type={showPrimeAppKey ? 'text' : 'password'}
                                  value={pteroPrimeAppKey}
                                  onChange={(e) => setPteroPrimeAppKey(e.target.value)}
                                  className="w-full bg-[#101935] border border-white/10 py-2 pl-3 pr-10 rounded-lg text-white font-mono text-[11px]"
                                  placeholder="ptla_..."
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPrimeAppKey(!showPrimeAppKey)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white cursor-pointer"
                                  title={showPrimeAppKey ? "Sembunyikan API Key" : "Tampilkan API Key"}
                                >
                                  {showPrimeAppKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </div>
                            <div>
                              <label className="block text-[#A7B3D0] mb-1 font-mono text-[9px] uppercase font-semibold">Node ID</label>
                              <input
                                type="text"
                                value={pteroPrimeNodeId}
                                onChange={(e) => setPteroPrimeNodeId(e.target.value)}
                                className="w-full bg-[#101935] border border-white/10 py-2 px-3 rounded-lg text-white font-mono text-[11px]"
                              />
                            </div>
                            <div>
                              <label className="block text-[#A7B3D0] mb-1 font-mono text-[9px] uppercase font-semibold">Egg ID</label>
                              <input
                                type="text"
                                value={pteroPrimeEggId}
                                onChange={(e) => setPteroPrimeEggId(e.target.value)}
                                className="w-full bg-[#101935] border border-white/10 py-2 px-3 rounded-lg text-white font-mono text-[11px]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Global Save Button */}
                      <button
                        onClick={handleSavePterodactylConfig}
                        className="w-full py-3 bg-[#35FF90] hover:bg-[#35FF90]/95 text-[#04091C] font-black text-xs rounded-xl shadow-[0_0_25px_rgba(53,255,144,0.15)] hover:shadow-[0_0_35px_rgba(53,255,144,0.3)] transition-all mt-4 cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
                      >
                        <SettingsIcon className="w-4 h-4" /> Simpan Seluruh Pengaturan Node & URL
                      </button>
                    </div>
                  </div>

                  {/* Diagnostic Console Panel (Right column, 2/5 width) */}
                  <div className="lg:col-span-2 bg-[#101935] border border-white/5 rounded-2xl p-5 flex flex-col justify-between h-fit">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-white text-xs uppercase tracking-widest flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-[#35FF90]" /> Terminal & Alur API Diagnostik
                        </h3>
                        <span className="w-2 h-2 rounded-full bg-[#35FF90] animate-ping" />
                      </div>
                      <p className="text-xs text-[#A7B3D0] mb-4 leading-relaxed">
                        Konsol simulasi untuk memantau aktivitas daemon, log pemanggilan REST API Pterodactyl, serta pengujian deploy, suspend, dan delete kontainer.
                      </p>

                      <div className="grid grid-cols-2 gap-2 font-mono">
                        <button 
                          type="button" 
                          disabled={isPteroTesting}
                          onClick={() => handleTestPteroFeature('create')}
                          className="py-2.5 px-2 bg-[#0B122E] border border-[#35FF90]/25 hover:border-[#35FF90]/50 text-[10px] text-[#35FF90] font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50"
                        >
                          Auto Create
                        </button>
                        <button 
                          type="button" 
                          disabled={isPteroTesting}
                          onClick={() => handleTestPteroFeature('suspend')}
                          className="py-2.5 px-2 bg-[#0B122E] border border-white/5 hover:border-red-500/25 text-[10px] text-[#A7B3D0] hover:text-red-400 font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50"
                        >
                          Auto Suspend
                        </button>
                        <button 
                          type="button" 
                          disabled={isPteroTesting}
                          onClick={() => handleTestPteroFeature('unsuspend')}
                          className="py-2.5 px-2 bg-[#0B122E] border border-white/5 hover:border-emerald-500/25 text-[10px] text-[#A7B3D0] hover:text-emerald-400 font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50"
                        >
                          Auto Unsuspend
                        </button>
                        <button 
                          type="button" 
                          disabled={isPteroTesting}
                          onClick={() => handleTestPteroFeature('delete')}
                          className="py-2.5 px-2 bg-[#0B122E] border border-white/5 hover:border-red-500/25 text-[10px] text-[#A7B3D0] hover:text-red-500 font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50"
                        >
                          Auto Delete
                        </button>
                        <button 
                          type="button" 
                          disabled={isPteroTesting}
                          onClick={() => handleTestPteroFeature('reinstall')}
                          className="py-2.5 px-2 bg-[#0B122E] border border-white/5 hover:border-amber-500/25 text-[10px] text-[#A7B3D0] hover:text-amber-400 font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50"
                        >
                          Auto Reinstall
                        </button>
                        <button 
                          type="button" 
                          disabled={isPteroTesting}
                          onClick={() => handleTestPteroFeature('resource')}
                          className="py-2.5 px-2 bg-[#0B122E] border border-[#35FF90]/25 hover:border-[#35FF90]/50 text-[10px] text-[#A7B3D0] hover:text-cyan-400 font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50"
                        >
                          Auto Alloc
                        </button>
                        <button 
                          type="button" 
                          disabled={isPteroTesting}
                          onClick={() => handleTestPteroFeature('user')}
                          className="py-2.5 px-2 bg-[#0B122E] border border-sky-500/25 hover:border-sky-500/50 text-[10px] text-sky-400 font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50"
                        >
                          Auto Create User
                        </button>
                      </div>
                    </div>

                    {/* Virtual Console Screen */}
                    <div className="bg-[#04091C] rounded-xl border border-white/10 p-4 mt-5 font-mono text-[10px] text-gray-300 space-y-1.5 text-left min-h-64 max-h-80 overflow-y-auto shadow-inner">
                      {pteroLogs.length === 0 ? (
                        <span className="text-gray-500 block text-center py-10 italic">Mavix Pterodactyl Virtual Terminal siap dijalankan...</span>
                      ) : (
                        pteroLogs.map((log, lIdx) => {
                          let logColor = 'text-gray-400';
                          if (log.includes('SUCCESS') || log.includes('SUKSES')) {
                            logColor = 'text-[#35FF90] font-bold';
                          } else if (log.includes('GAGAL') || log.includes('❌')) {
                            logColor = 'text-red-400 font-bold';
                          } else if (log.includes('⚠️') || log.includes('WARNING')) {
                            logColor = 'text-amber-300 font-bold font-mono';
                          } else if (log.startsWith('[DIAGNOSTIK]') || log.startsWith('[SINKRONISASI]')) {
                            logColor = 'text-cyan-400';
                          } else if (log.startsWith('✅')) {
                            logColor = 'text-emerald-400 font-extrabold';
                          }
                          return (
                             <p key={lIdx} className={`${logColor} leading-relaxed break-all`}>{log}</p>
                          );
                        })
                      )}
                    </div>

                    {/* Troubleshooting Guide Box for Pterodactyl User API errors */}
                    <div className="mt-5 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl text-xs space-y-2.5 text-left">
                      <h4 className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        Solusi Error Manajemen User di Pterodactyl
                      </h4>
                      <p className="text-[11px] text-gray-400 leading-relaxed">
                        Jika integrasi user Pterodactyl Anda mengalami kegagalan, kendala ini umumnya disebabkan oleh salah satu hal berikut:
                      </p>
                      <ul className="space-y-2 text-[11px] text-gray-300 list-decimal pl-4 font-sans leading-relaxed">
                        <li>
                          <strong className="text-white">Salah Tipe API Key (Sangat Sering)</strong>: Pastikan Anda menggunakan <strong className="text-amber-300">Application API Key</strong> yang dibuat di halaman <code className="bg-black/45 px-1 py-0.5 rounded text-red-300">Admin {`->`} Application API</code> (diawali dengan <code className="bg-black/45 px-1 py-0.5 rounded text-[#35FF90]">ptla_</code>). Jangan gunakan Client API Key yang dibuat di Account Settings biasa (diawali dengan <code className="bg-black/45 px-1 py-0.5 rounded text-amber-400">ptlc_</code>), karena client key tidak diizinkan membuat user baru.
                        </li>
                        <li>
                          <strong className="text-white">Izin (Scope) API Kurang</strong>: Saat membuat Application API Key di panel Pterodactyl admin, pastikan Anda memberikan hak akses <strong className="text-[#35FF90]">Read & Write</strong> untuk sub-seksi <strong className="text-white">Users</strong> dan <strong className="text-white">Servers</strong>.
                        </li>
                        <li>
                          <strong className="text-white">Format Karakter Payload</strong>: Username Pterodactyl wajib berupa huruf kecil semua, angka, dan tidak boleh mengandung spasi atau karakter spesial. Jika form registrasi website mengirimkan huruf besar/spasi, Pterodactyl akan mengembalikan error <code className="bg-black/45 px-1 text-red-400">422 Unprocessable Entity</code>.
                        </li>
                        <li>
                          <strong className="text-white">Email Duplikat</strong>: Email yang didaftarkan di website sudah ada atau terdaftar sebelumnya di database Pterodactyl Anda. Pastikan email bersifat unik.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 6: MANAJEMEN TIKET HELP */}
            {activeAdminTab === 'tickets' && (
              <motion.div
                key="tickets"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="pb-4 border-b border-white/10">
                  <h2 className="text-lg font-black font-display text-white">MANAJEMEN TIKET ADUAN SUPPORT</h2>
                  <p className="text-xs text-[#A7B3D0] mt-1">Buka, jawab, serta tutup tiket bantuan pelanggan.</p>
                </div>

                {tickets.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-12 bg-[#101935] border border-white/5 rounded-2xl text-center">
                    <LifeBuoy className="w-12 h-12 text-[#A7B3D0] mb-3" />
                    <h3 className="font-bold text-white text-sm">Tidak Ada Tiket Support</h3>
                    <p className="text-xs text-[#A7B3D0] mt-1.5 max-w-sm">Kotak masuk bantuan Anda saat ini dalam kondisi bersih.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tickets.map(ticket => {
                      const isClosed = ticket.status === 'closed';
                      return (
                        <div 
                          key={ticket.id} 
                          className={`rounded-2xl border bg-[#101935] p-5 space-y-4 ${
                            isClosed ? 'border-white/5 opacity-70' : 'border-[#35FF90]/25'
                          }`}
                        >
                          <div className="flex flex-wrap justify-between items-center gap-2">
                            <div>
                              <span className="text-[10px] font-mono text-gray-500 font-bold pr-2 uppercase border-r border-white/10 mr-2">{ticket.id}</span>
                              <span className="text-xs text-sky-400 font-mono font-bold">{ticket.userEmail}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className={`px-2.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                                ticket.status === 'open' 
                                  ? 'bg-red-500/15 text-red-400 animate-pulse' 
                                  : ticket.status === 'answered'
                                    ? 'bg-blue-500/15 text-blue-300'
                                    : 'bg-gray-800 text-gray-400'
                              }`}>
                                {ticket.status.toUpperCase()}
                              </span>
                            </div>
                          </div>

                          <div>
                            <h3 className="font-bold text-white text-sm">{ticket.subject}</h3>
                            <p className="text-xs text-[#A7B3D0] mt-1.5 bg-[#04091C] border border-white/5 rounded-xl p-3">{ticket.message}</p>
                          </div>

                          {/* Response history */}
                          {ticket.responses.length > 0 && (
                            <div className="space-y-2 mt-2 bg-[#04091C]/50 rounded-xl p-3 border border-white/5">
                              <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Riwayat Percakapan:</p>
                              {ticket.responses.map(resp => (
                                <div key={resp.id} className="text-xs">
                                  <span className={`font-mono text-[10px] font-bold ${resp.sender === 'admin' ? 'text-red-400' : 'text-[#35FF90]'}`}>
                                    {resp.senderName}:
                                  </span>
                                  <p className="text-gray-300 mt-0.5 pl-2 border-l border-white/10">{resp.message}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Action Forms */}
                          {!isClosed && (
                            <form 
                              onSubmit={(e) => {
                                e.preventDefault();
                                const form = e.target as HTMLFormElement;
                                const textInput = form.elements.namedItem('replyText') as HTMLInputElement;
                                handleRespondToTicket(ticket.id, textInput.value);
                                textInput.value = '';
                              }}
                              className="flex gap-2 text-xs"
                            >
                              <input 
                                name="replyText"
                                type="text" 
                                placeholder="Tulis balasan resmi Admin..."
                                className="flex-1 bg-[#0B122E] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#35FF90]/40"
                                required
                              />
                              <button 
                                type="submit" 
                                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors"
                              >
                                Balas
                              </button>
                            </form>
                          )}

                          <div className="flex gap-2 justify-end pt-2 text-[10px] font-bold">
                            <button
                              onClick={() => handleToggleCloseTicket(ticket.id, ticket.status)}
                              className="px-3 py-1.5 rounded-lg bg-[#0B122E] border border-white/10 text-gray-400 hover:text-white transition-colors"
                            >
                              {isClosed ? 'Buka Kembali Tiket' : 'Tutup Tiket Support'}
                            </button>
                            <button
                              onClick={() => handleDeleteTicket(ticket.id)}
                              className="px-3 py-1.5 rounded-lg bg-red-950/25 border border-red-500/15 text-red-400 hover:bg-red-900/40 transition-colors"
                            >
                              Hapus Tiket
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 7: KELOLA INVOICE */}
            {activeAdminTab === 'invoices' && (
              <motion.div
                key="invoices"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="pb-4 border-b border-white/10">
                  <h2 className="text-lg font-black font-display text-white">VERIFIKASI INVOICE &amp; TOP UP USER</h2>
                  <p className="text-xs text-[#A7B3D0] mt-1">Tinjau tagihan pending, verifikasi transfer, dan approve saldo masuk secara manual/otomatis.</p>
                </div>

                <div className="bg-[#101935] rounded-2xl border border-white/5 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-[#0B122E] text-[#A7B3D0] font-mono text-[10px] uppercase tracking-wider border-b border-white/5">
                        <tr>
                          <th className="p-4">ID Invoice</th>
                          <th>Tipe Tagihan</th>
                          <th>Nominal</th>
                          <th>Detail Deskripsi</th>
                          <th>Status VA/QRIS</th>
                          <th className="p-4 text-right">Aksi Tindakan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-gray-500 font-mono">Belum ada invoice diterbitkan di sistem.</td>
                          </tr>
                        ) : (
                          invoices.map(inv => {
                            const isPend = inv.status === 'pending';
                            return (
                              <tr key={inv.id} className="border-b border-white/5 hover:bg-white/5 transition-colors font-mono">
                                <td className="p-4 text-white font-bold">{inv.id}</td>
                                <td className="capitalize text-gray-300">{inv.type}</td>
                                <td className="text-white font-bold">{formatIDR(inv.amount)}</td>
                                <td className="text-gray-400 font-sans">{inv.description}</td>
                                <td>
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                    inv.status === 'paid' 
                                      ? 'bg-emerald-500/10 text-[#35FF90]' 
                                      : inv.status === 'pending'
                                        ? 'bg-amber-500/15 text-amber-300 animate-pulse'
                                        : 'bg-gray-800 text-gray-500'
                                  }`}>
                                    {inv.status.toUpperCase()}
                                  </span>
                                </td>
                                <td className="p-4 text-right space-x-1">
                                  {isPend ? (
                                    <>
                                      <button
                                        onClick={() => handleApproveInvoice(inv.id)}
                                        className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-[10px] uppercase font-sans"
                                      >
                                        Approve
                                      </button>
                                      <button
                                        onClick={() => handleCancelInvoice(inv.id)}
                                        className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-red-400 rounded-lg text-[10px] uppercase font-sans"
                                      >
                                        Batalkan
                                      </button>
                                    </>
                                  ) : (
                                    <span className="text-[10px] text-gray-500">Tindakan Selesai</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 8: WEBSITE SETTINGS & SECURITY */}
            {activeAdminTab === 'website' && (
              <motion.div
                key="website"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="pb-4 border-b border-white/10">
                  <h2 className="text-lg font-black font-display text-white uppercase tracking-wider">MANAJEMEN WEBSITE &amp; PARAMETER KEAMANAN</h2>
                  <p className="text-xs text-[#A7B3D0] mt-1 font-light">Kustomisasi visual, brand, banner atas, rute Discord, dan kelola pertahanan sistem enkripsi.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
                  {/* Web brand form */}
                  <form onSubmit={handleSaveWebsiteConfig} className="bg-[#101935] border border-white/5 rounded-2xl p-5 space-y-4 font-sans col-span-1 lg:col-span-1">
                    <h3 className="font-bold text-[#35FF90] uppercase tracking-wider mb-2 flex items-center gap-2">
                      <SettingsIcon className="w-4 h-4" /> Branding &amp; Informasi Website
                    </h3>

                    <div className="space-y-4">
                      {/* Website Name & Logo Text */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[#A7B3D0] mb-1">Nama Logo Navbar</label>
                          <input
                            type="text"
                            value={siteLogoName}
                            onChange={(e) => setSiteLogoName(e.target.value)}
                            placeholder="MAVIX STORE"
                            className="w-full bg-[#0B122E] border border-white/10 py-2.5 px-3 rounded-lg text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[#A7B3D0] mb-1">Nama Website (Title)</label>
                          <input
                            type="text"
                            value={siteName}
                            onChange={(e) => setSiteName(e.target.value)}
                            placeholder="Mavix Store"
                            className="w-full bg-[#0B122E] border border-white/10 py-2.5 px-3 rounded-lg text-white"
                            required
                          />
                        </div>
                      </div>

                      {/* Website Slogan */}
                      <div>
                        <label className="block text-[#A7B3D0] mb-1">Slogan Website</label>
                        <input
                          type="text"
                          value={siteSlogan}
                          onChange={(e) => setSiteSlogan(e.target.value)}
                          placeholder="Premium Minecraft Hosting & Game Servers"
                          className="w-full bg-[#0B122E] border border-white/10 py-2.5 px-3 rounded-lg text-white"
                          required
                        />
                      </div>

                      {/* Theme color and Header Banner Text */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[#A7B3D0] mb-1">Aksen Warna Tema (Hex)</label>
                          <input
                            type="text"
                            value={siteThemeColor}
                            onChange={(e) => setSiteThemeColor(e.target.value)}
                            className="w-full bg-[#0B122E] border border-white/10 py-2.5 px-3 rounded-lg text-white font-mono"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[#A7B3D0] mb-1">Teks Banner Promo Atas</label>
                          <input
                            type="text"
                            value={siteBanner}
                            onChange={(e) => setSiteBanner(e.target.value)}
                            className="w-full bg-[#0B122E] border border-white/10 py-2.5 px-3 rounded-lg text-white"
                            required
                          />
                        </div>
                      </div>

                      {/* Upload Website Logo */}
                      <div className="p-3 bg-[#0B122E] rounded-xl border border-white/5 space-y-2">
                        <label className="block font-bold text-white mb-1">Website Logo</label>
                        <div className="flex items-center gap-3">
                          {siteLogoUrl ? (
                            <img src={siteLogoUrl} alt="Logo Preview" className="w-12 h-12 rounded-lg bg-black/40 border border-white/10 object-contain p-1" />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center text-[10px] text-gray-500 font-mono">No Logo</div>
                          )}
                          <div className="flex-1 space-y-1.5">
                            <input
                              type="text"
                              value={siteLogoUrl}
                              onChange={(e) => setSiteLogoUrl(e.target.value)}
                              placeholder="Atau masukkan URL Logo..."
                              className="w-full bg-[#101935] border border-white/10 py-1.5 px-2 rounded-lg text-white text-[10px]"
                            />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, setSiteLogoUrl)}
                              className="block w-full text-[10px] text-[#A7B3D0] file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-[#35FF90]/10 file:text-[#35FF90] file:cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Upload Favicon */}
                      <div className="p-3 bg-[#0B122E] rounded-xl border border-white/5 space-y-2">
                        <label className="block font-bold text-white mb-1">Website Favicon</label>
                        <div className="flex items-center gap-3">
                          {siteFaviconUrl ? (
                            <img src={siteFaviconUrl} alt="Favicon Preview" className="w-8 h-8 rounded bg-black/40 border border-white/10 object-contain p-1" />
                          ) : (
                            <div className="w-8 h-8 rounded bg-black/40 border border-white/10 flex items-center justify-center text-[10px] text-gray-500 font-mono">No Fav</div>
                          )}
                          <div className="flex-1 space-y-1.5">
                            <input
                              type="text"
                              value={siteFaviconUrl}
                              onChange={(e) => setSiteFaviconUrl(e.target.value)}
                              placeholder="Atau masukkan URL Favicon..."
                              className="w-full bg-[#101935] border border-white/10 py-1.5 px-2 rounded-lg text-white text-[10px]"
                            />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, setSiteFaviconUrl)}
                              className="block w-full text-[10px] text-[#A7B3D0] file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-[#35FF90]/10 file:text-[#35FF90] file:cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Homepage Banner & Hero Background */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 bg-[#0B122E] rounded-xl border border-white/5 space-y-1.5">
                          <label className="block font-bold text-white text-[11px]">Homepage Banner</label>
                          <input
                            type="text"
                            value={siteHomepageBannerUrl}
                            onChange={(e) => setSiteHomepageBannerUrl(e.target.value)}
                            placeholder="URL Banner Gambar..."
                            className="w-full bg-[#101935] border border-white/10 py-1.5 px-2 rounded-lg text-white text-[10px]"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, setSiteHomepageBannerUrl)}
                            className="block w-full text-[9px] text-[#A7B3D0]"
                          />
                        </div>

                        <div className="p-3 bg-[#0B122E] rounded-xl border border-white/5 space-y-1.5">
                          <label className="block font-bold text-white text-[11px]">Hero Background</label>
                          <input
                            type="text"
                            value={siteHeroBgUrl}
                            onChange={(e) => setSiteHeroBgUrl(e.target.value)}
                            placeholder="URL Background..."
                            className="w-full bg-[#101935] border border-white/10 py-1.5 px-2 rounded-lg text-white text-[10px]"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, setSiteHeroBgUrl)}
                            className="block w-full text-[9px] text-[#A7B3D0]"
                          />
                        </div>

                        <div className="p-3 bg-[#0B122E] rounded-xl border border-white/5 space-y-1.5 col-span-1 sm:col-span-2">
                          <label className="block font-bold text-white text-[11px] flex items-center gap-1.5">
                            <span className="text-[#35FF90]">●</span> GAMBAR QRIS TOP UP SALDO
                          </label>
                          <div className="flex flex-col sm:flex-row gap-3 items-center">
                            {siteQrisUrl ? (
                              <img src={siteQrisUrl} alt="QRIS Preview" className="w-20 h-20 rounded border border-white/10 object-contain p-1 bg-white" />
                            ) : (
                              <div className="w-20 h-20 rounded bg-black/40 border border-white/10 flex items-center justify-center text-[10px] text-gray-500 font-mono">No Image</div>
                            )}
                            <div className="flex-1 space-y-1.5 w-full">
                              <input
                                type="text"
                                value={siteQrisUrl}
                                onChange={(e) => setSiteQrisUrl(e.target.value)}
                                placeholder="Atau masukkan URL QRIS..."
                                className="w-full bg-[#101935] border border-white/10 py-1.5 px-2 rounded-lg text-white text-[10px]"
                              />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, setSiteQrisUrl)}
                                className="block w-full text-[9px] text-[#A7B3D0]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer & Contact */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[#A7B3D0] mb-1">Teks Footer Copyright</label>
                          <input
                            type="text"
                            value={siteFooter}
                            onChange={(e) => setSiteFooter(e.target.value)}
                            className="w-full bg-[#0B122E] border border-white/10 py-2.5 px-3 rounded-lg text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[#A7B3D0] mb-1">Kontak Informasi</label>
                          <input
                            type="text"
                            value={siteContact}
                            onChange={(e) => setSiteContact(e.target.value)}
                            className="w-full bg-[#0B122E] border border-white/10 py-2.5 px-3 rounded-lg text-white"
                            required
                          />
                        </div>
                      </div>

                      {/* Social Media & Chat Support Links */}
                      <div className="p-3 bg-[#0B122E] rounded-xl border border-white/5 space-y-3">
                        <p className="font-bold text-white text-xs">Integrasi Link Komunitas</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[10px] text-[#A7B3D0] mb-0.5">Discord Server</label>
                            <input
                              type="url"
                              value={siteDiscord}
                              onChange={(e) => setSiteDiscord(e.target.value)}
                              className="w-full bg-[#101935] border border-white/10 py-1.5 px-2 rounded-lg text-white text-[10px]"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-[#A7B3D0] mb-0.5">Telegram Group</label>
                            <input
                              type="url"
                              value={siteTelegram}
                              onChange={(e) => setSiteTelegram(e.target.value)}
                              className="w-full bg-[#101935] border border-white/10 py-1.5 px-2 rounded-lg text-white text-[10px]"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-[#A7B3D0] mb-0.5">WhatsApp Admin</label>
                            <input
                              type="url"
                              value={siteWhatsapp}
                              onChange={(e) => setSiteWhatsapp(e.target.value)}
                              className="w-full bg-[#101935] border border-white/10 py-1.5 px-2 rounded-lg text-white text-[10px]"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#35FF90] text-[#04091C] font-black text-xs rounded-xl hover:opacity-90 transition-all mt-4 cursor-pointer"
                    >
                      Terapkan Konfigurasi Website
                    </button>
                  </form>

                  {/* Security panel settings */}
                  <div className="bg-[#101935] border border-white/5 rounded-2xl p-5 space-y-4">
                    <h3 className="font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" /> Pengaturan Keamanan Sistem
                    </h3>

                    <div className="space-y-4">
                      {/* Password Hashing Toggle */}
                      <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                        <div>
                          <p className="font-bold text-white">Password Cryptographic Hashing</p>
                          <p className="text-[10px] text-[#A7B3D0] mt-0.5 leading-normal">Simpan kata sandi user menggunakan hashing 256-bit standar industri di database.</p>
                        </div>
                        <button onClick={() => setSecPasswordHashing(!secPasswordHashing)}>
                          {secPasswordHashing ? <ToggleRight className="w-10 h-10 text-[#35FF90]" /> : <ToggleLeft className="w-10 h-10 text-gray-500" />}
                        </button>
                      </div>

                      {/* CSRF Protection Toggle */}
                      <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                        <div>
                          <p className="font-bold text-white">CSRF Token Validation</p>
                          <p className="text-[10px] text-[#A7B3D0] mt-0.5 leading-normal">Mencegah serangan pemalsuan permintaan lintas situs pada API Checkout.</p>
                        </div>
                        <button onClick={() => setSecCsrfProtection(!secCsrfProtection)}>
                          {secCsrfProtection ? <ToggleRight className="w-10 h-10 text-[#35FF90]" /> : <ToggleLeft className="w-10 h-10 text-gray-500" />}
                        </button>
                      </div>

                      {/* Rate Limit Toggle */}
                      <div className="flex justify-between items-center py-2.5 border-b border-white/5">
                        <div>
                          <p className="font-bold text-white">Login Rate Limiter (Brute-force Block)</p>
                          <p className="text-[10px] text-[#A7B3D0] mt-0.5 leading-normal">Kunci sesi pendaftaran otomatis jika terdeteksi 5x kegagalan sandi beruntun.</p>
                        </div>
                        <button onClick={() => setSecRateLimit(!secRateLimit)}>
                          {secRateLimit ? <ToggleRight className="w-10 h-10 text-[#35FF90]" /> : <ToggleLeft className="w-10 h-10 text-gray-500" />}
                        </button>
                      </div>

                      {/* Session duration */}
                      <div className="py-2">
                        <label className="block text-[#A7B3D0] mb-1.5 uppercase font-mono text-[9px] tracking-widest">Waktu Kedaluwarsa Sesi (Menit)</label>
                        <input
                          type="number"
                          value={secSessionMinutes}
                          onChange={(e) => setSecSessionMinutes(Number(e.target.value))}
                          className="w-24 bg-[#0B122E] border border-white/10 py-1.5 px-3 rounded text-white font-mono"
                          min={1}
                        />
                        <p className="text-[10px] text-gray-500 mt-1.5 leading-relaxed">
                          Sesi pengguna akan otomatis keluar (Auto Logout) setelah {secSessionMinutes} menit tidak aktif demi mencegah pembajakan akun (Remember Me mencegah ini).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 9: AUDIT LOG AKTIVITAS */}
            {activeAdminTab === 'audit' && (
              <motion.div
                key="audit"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="pb-4 border-b border-white/10 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-black font-display text-white">LOG AKTIVITAS &amp; AUDIT JALUR ADMIN</h2>
                    <p className="text-xs text-[#A7B3D0] mt-1">Seluruh log login, logout, transfer, saldo, dan manipulasi kontainer tersimpan di sini secara transparan.</p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Apakah Anda yakin ingin mengosongkan seluruh audit log admin?')) {
                        setAuditLogs([]);
                        localStorage.removeItem('mavix_audit_logs');
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg border border-red-500/10 hover:border-red-500/25 text-red-400 hover:bg-red-500/5 text-xs font-bold transition-all"
                  >
                    Kosongkan Log
                  </button>
                </div>

                <div className="bg-[#101935] rounded-2xl border border-white/5 p-5 text-xs font-mono max-h-96 overflow-y-auto">
                  {auditLogs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Belum ada catatan aktivitas admin di database audit.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {auditLogs.map(log => (
                        <div key={log.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2.5 border-b border-white/5 text-left gap-1">
                          <div>
                            <span className="text-[#35FF90] font-bold">[{log.adminName}]</span>
                            <span className="text-gray-200 ml-2">{log.action}</span>
                          </div>
                          <span className="text-[10px] text-gray-500">{new Date(log.timestamp).toLocaleString('id-ID')}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
