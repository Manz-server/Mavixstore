import { MinecraftPackage, User, UserServer, Invoice, SupportTicket, Announcement } from '../types';

export const INITIAL_PACKAGES: MinecraftPackage[] = [
  {
    id: 'standar',
    name: 'PAKET STANDAR',
    price: 6000,
    ram: 2,
    cpu: 'Intel Platinum 8370C',
    region: 'Region Hongkong',
    stock: 100,
    features: [
      'Intel Platinum 8370C',
      'Region Hongkong',
      'Anti Down',
      'SSD NVMe',
      'Unlimited Slot',
      'Support Cepat'
    ]
  },
  {
    id: 'medium',
    name: 'PAKET MEDIUM',
    price: 10000,
    ram: 4,
    cpu: 'AMD EPYC 7351',
    region: 'Region Indonesia',
    stock: 50,
    badge: 'POPULER',
    features: [
      'AMD EPYC 7351',
      'Region Indonesia',
      'Anti Down',
      'SSD NVMe',
      'Prioritas Support'
    ]
  },
  {
    id: 'prime',
    name: 'PAKET PRIME',
    price: 15000,
    ram: 8,
    cpu: 'Ryzen 9 5950X',
    region: 'Region Indonesia',
    stock: 25,
    badge: 'TERBAIK',
    features: [
      'Ryzen 9 5950X',
      'Region Indonesia',
      'Anti Down',
      'SSD NVMe Premium',
      'Prioritas Tinggi'
    ]
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'u-admin',
    username: 'manz',
    email: 'admin@mavix.store',
    role: 'admin',
    balance: 1000000,
    registeredAt: '2026-06-01T00:00:00Z',
    status: 'active',
    firstName: 'Mavix',
    lastName: 'Admin',
    phone: '08123456789',
    discord: 'admin_discord',
    password: '4826e7976c8363e903c100262b8f5a184aa25f56ca18ddcb232276b8fa61fb75' // SHA-256 hash of "111013"
  },
  {
    id: 'u-user',
    username: 'demo_user',
    email: 'user@mavix.store',
    role: 'user',
    balance: 500000,
    registeredAt: '2026-06-01T00:00:00Z',
    status: 'active',
    firstName: 'Demo',
    lastName: 'User',
    phone: '08123456780',
    discord: 'demo_user',
    password: 'b60a34ba5d7df53b7547ff570d51ffdae111a8fb9f82d277be9e7100b730623f' // SHA-256 hash of "user123"
  }
];

export const INITIAL_SERVERS: UserServer[] = [];

export const INITIAL_INVOICES: Invoice[] = [];

export const INITIAL_TICKETS: SupportTicket[] = [];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Migrasi Node Hongkong Selesai!',
    content: 'Node standar Hongkong telah dimigrasikan ke CPU Intel Platinum 8370C generasi terbaru. Latency kini 15-20ms lebih rendah untuk regional Indonesia!',
    type: 'success',
    createdAt: '2026-06-18T00:00:00Z'
  },
  {
    id: 'ann-2',
    title: 'Perawatan Rutin Datacenter Indonesia',
    content: 'Akan dilakukan pemeliharaan router utama pada 25 Juni 2026 pukul 02:00 - 04:00 WIB. Server Anda mungkin mengalami interupsi singkat sekitar 3-5 menit.',
    type: 'warning',
    createdAt: '2026-06-20T00:00:00Z'
  }
];

export const TESTIMONIALS = [
  {
    name: 'Andi Setiawan',
    role: 'Server Owner "IndoCraft"',
    rating: 5,
    comment: 'Sangat terkesan dengan stabilitas ping di Mavix Store! TPS konstan di 20.0 meskipun player online mencapai 80 orang. Recomended banget!',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'
  },
  {
    name: 'Reynaldo Timothy',
    role: 'Developer Survival Community Jakarta',
    rating: 5,
    comment: 'Aktivasi hitungan detik, panel Pterodactyl sangat responsif, dan performa Ryzen 9 nya beneran monster. Gak nyesel langganan Prime.',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=120'
  },
  {
    name: 'Sarah Amanda',
    role: 'Streamer & Content Creator',
    rating: 4,
    comment: 'Admin support sangat proaktif membantu setup backup harian dan pembersihan database server. Terimakasih Mavix Store!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120'
  }
];

export const FAQ_ITEMS = [
  {
    question: 'Apakah server aktif otomatis?',
    answer: 'Ya, sistem Mavix Store terintegrasi penuh secara otomatis. Setelah pembayaran terverifikasi, server Anda langsung dibuat secara instan.'
  },
  {
    question: 'Apakah support plugin?',
    answer: 'Tentu saja! Kami mendukung semua versi Spigot, Paper, Purpur, Bukkit, dan engine server Java Edition lainnya yang memungkinkan Anda memasang plugin secara bebas.'
  },
  {
    question: 'Apakah support modpack?',
    answer: 'Ya, Anda bisa menjalankan modpack favorit Anda seperti Pixelmon, RLCraft, SkyFactory, atau kustom modpack buatan sendiri lewat platform Forge atau Fabric.'
  },
  {
    question: 'Apakah tersedia backup?',
    answer: 'Kami menyediakan pencadangan (backup) otomatis secara berkala untuk menjaga keutuhan data dunia dan file konfigurasi server Anda.'
  }
];

export const KNOWLEDGE_BASE_ARTICLES = [
  {
    category: 'Panduan Dasar',
    articles: [
      {
        title: 'Cara Menghubungkan Server untuk Pertama Kali',
        content: 'Untuk masuk ke server Minecraft Anda, copy alamat IP Address yang tertera di menu "My Servers". Jalankan launcher Minecraft Anda, pastikan versi game cocok, masuk ke "Multiplayer", klik "Add Server", paste alamat IP tersebut, lalu klik "Done" dan "Join Server".'
      },
      {
        title: 'Mengatur Status Whitelist di Server Anda',
        content: 'Gunakan konsol di manajemen server lalu ketik `whitelist on` untuk mengaktifkan daftar izin. Untuk memasukkan pemain tertentu, ketik `whitelist add [UsernamePemain]`. Hanya pemain di whitelist tersebut yang bisa masuk.'
      }
    ]
  },
  {
    category: 'Optimasi & Modifikasi',
    articles: [
      {
        title: 'Cara Meningkatkan FPS dan TPS Server Minecraft',
        content: 'Untuk meminimalisir lag, disarankan menggunakan core Paper, Purpur, atau Pufferfish alih-alih Vanilla. Ubah setelan view-distance di file server.properties dari 10 ke 6 atau 8. Batasi spawn rate mobs di bukkit.yml.'
      },
      {
        title: 'Instalasi Plugin Menggunakan Panel Kontrol',
        content: 'Gunakan Folder "plugins" di File Manager server Anda. Upload file plugin yang berformat `.jar` ke dalam folder tersebut, lalu restart server Anda. Anda juga bisa menginstalnya langsung melalui menu Plugin Installer di Dashboard.'
      }
    ]
  }
];
