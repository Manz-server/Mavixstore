export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  balance: number;
  registeredAt: string;
  status: 'active' | 'suspended';
  firstName?: string;
  lastName?: string;
  phone?: string;
  discord?: string;
  password?: string; // stored securely for real credentials checking
}

export interface PterodactylConfig {
  panelUrl: string;
  applicationApiKey: string;
  clientApiKey: string;
  nodeId: string;
  nestId: string;
  eggId: string;
  locationId: string;
}

export interface WebsiteConfig {
  logoName: string;
  siteName: string;
  themeColor: string;
  bannerText: string;
  footerText: string;
  contactInfo: string;
  discordLink: string;
}

export interface AuditLog {
  id: string;
  adminName: string;
  action: string;
  timestamp: string;
}

export interface MinecraftPackage {
  id: 'standar' | 'medium' | 'prime';
  name: string;
  price: number; // Rp per GB
  ram: number; // in GB
  cpu: string;
  region: string;
  features: string[];
  stock: number;
  badge?: string;
}

export interface UserServer {
  id: string;
  userId: string;
  name: string;
  packageId: 'standar' | 'medium' | 'prime';
  packageName: string;
  ram: number;
  cpu: string;
  region: string;
  status: 'online' | 'offline' | 'restarting';
  ipAddress: string;
  expiredAt: string;
  createdAt: string;
  pteroPanelUrl?: string;
  pteroApiKey?: string;
  pteroNodeId?: string;
  pteroEggId?: string;
}

export interface Invoice {
  id: string;
  userId: string;
  userEmail: string;
  type: 'hosting' | 'topup';
  description: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  method?: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userEmail: string;
  subject: string;
  message: string;
  status: 'open' | 'answered' | 'closed';
  responses: Array<{
    id: string;
    sender: 'user' | 'admin';
    senderName: string;
    message: string;
    createdAt: string;
  }>;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success';
  createdAt: string;
}
