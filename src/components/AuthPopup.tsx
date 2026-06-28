import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Mail, Lock, User as UserIcon, ShieldAlert, CheckCircle, 
  ArrowRight, Phone, MessageSquare, Shield, Info, HelpCircle
} from 'lucide-react';
import { User } from '../types';
import MavixLogo from './MavixLogo';

interface AuthPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  allUsers: User[];
  onRegisterUser: (newUser: User) => void;
}

// Secure industry-standard SHA-256 password hashing helper using Web Crypto API
async function hashPassword(password: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function AuthPopup({
  isOpen,
  onClose,
  onLoginSuccess,
  allUsers,
  onRegisterUser
}: AuthPopupProps) {
  const [isLogin, setIsLogin] = useState(true);
  
  // Login fields
  const [loginIdent, setLoginIdent] = useState(''); // Email or Username
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Register fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [discord, setDiscord] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isAdminRegister, setIsAdminRegister] = useState(false);
  const [adminCode, setAdminCode] = useState('');

  // Status states
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Rate limiting & Security states
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  if (!isOpen) return null;

  const validateEmail = (mail: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
  };

  const validateUsername = (user: string) => {
    // Min 4 chars, alphanumeric + underscore
    return user.length >= 4 && /^[a-zA-Z0-9_]+$/.test(user);
  };

  const validatePassword = (pass: string) => {
    // Min 8 chars, must contain letter and number
    return pass.length >= 8 && /[a-zA-Z]/.test(pass) && /[0-9]/.test(pass);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (isLocked) {
      setErrorMsg('Akun terkunci sementara karena terlalu banyak kegagalan masuk. Silakan tunggu beberapa saat.');
      return;
    }

    setIsSubmitting(true);

    // Simulate small delay for loading state
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (isLogin) {
      // --- LOGIN LOGIC ---
      if (!loginIdent || !loginPassword) {
        setErrorMsg('Harap masukkan username/email dan password.');
        setIsSubmitting(false);
        return;
      }

      // Check users registered in state/localStorage
      const foundUser = allUsers.find(
        u => u.email.toLowerCase() === loginIdent.toLowerCase() || u.username.toLowerCase() === loginIdent.toLowerCase()
      );

      if (!foundUser) {
        setLoginAttempts(prev => {
          const next = prev + 1;
          if (next >= 5) {
            setIsLocked(true);
            setTimeout(() => {
              setIsLocked(false);
              setLoginAttempts(0);
            }, 60000); // 1 minute lock
          }
          return next;
        });
        setErrorMsg('Kredensial salah atau akun tidak terdaftar.');
        setIsSubmitting(false);
        return;
      }

      // Check password (simulated verification with actual stored value)
      const hashedInput = await hashPassword(loginPassword);
      if (foundUser.password !== hashedInput) {
        setLoginAttempts(prev => {
          const next = prev + 1;
          if (next >= 5) {
            setIsLocked(true);
            setTimeout(() => {
              setIsLocked(false);
              setLoginAttempts(0);
            }, 60000);
          }
          return next;
        });
        setErrorMsg('Kata sandi yang Anda masukkan salah.');
        setIsSubmitting(false);
        return;
      }

      if (foundUser.status === 'suspended') {
        setErrorMsg('Akun Anda ditangguhkan (suspended) oleh administrator. Harap hubungi dukungan.');
        setIsSubmitting(false);
        return;
      }

      // Login success
      const mockToken = `mvx_jwt_${btoa(foundUser.email)}_${Date.now()}`;
      localStorage.setItem('mavix_session_token', mockToken);
      localStorage.setItem('mavix_logged_user_id', foundUser.id);
      
      if (rememberMe) {
        localStorage.setItem('mavix_remember_me', 'true');
      } else {
        localStorage.removeItem('mavix_remember_me');
      }

      // Store in audit logs if admin
      if (foundUser.role === 'admin') {
        const currentLogs = JSON.parse(localStorage.getItem('mavix_audit_logs') || '[]');
        currentLogs.unshift({
          id: `log-${Date.now()}`,
          adminName: foundUser.username,
          action: `Admin Login (${foundUser.email})`,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('mavix_audit_logs', JSON.stringify(currentLogs));
      }

      setSuccessMsg(`Berhasil masuk! Selamat datang kembali, ${foundUser.username}.`);
      setTimeout(() => {
        setIsSubmitting(false);
        onLoginSuccess(foundUser);
        onClose();
      }, 1000);

    } else {
      // --- REGISTER LOGIC ---
      if (!firstName || !lastName || !username || !email || !password || !confirmPassword || !phone) {
        setErrorMsg('Harap lengkapi seluruh bidang formulir yang wajib diisi.');
        setIsSubmitting(false);
        return;
      }

      // Validations
      if (!validateUsername(username)) {
        setErrorMsg('Username minimal 4 karakter dan hanya boleh berisi huruf, angka, atau underscore (_).');
        setIsSubmitting(false);
        return;
      }

      if (!validateEmail(email)) {
        setErrorMsg('Format email tidak valid.');
        setIsSubmitting(false);
        return;
      }

      if (!validatePassword(password)) {
        setErrorMsg('Password minimal 8 karakter dan wajib mengandung kombinasi huruf serta angka.');
        setIsSubmitting(false);
        return;
      }

      if (password !== confirmPassword) {
        setErrorMsg('Konfirmasi password tidak cocok dengan password yang dimasukkan.');
        setIsSubmitting(false);
        return;
      }

      if (!agreeTerms) {
        setErrorMsg('Anda harus menyetujui Syarat & Ketentuan untuk mendaftar.');
        setIsSubmitting(false);
        return;
      }

      // Check existing
      if (allUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        setErrorMsg('Alamat email sudah terdaftar.');
        setIsSubmitting(false);
        return;
      }

      if (allUsers.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        setErrorMsg('Username sudah digunakan.');
        setIsSubmitting(false);
        return;
      }

      const finalRole: 'user' | 'admin' = 'user';

      const newUser: User = {
        id: `user-${Date.now()}`,
        username,
        email,
        role: finalRole,
        balance: 0,
        registeredAt: new Date().toISOString(),
        status: 'active',
        firstName,
        lastName,
        phone,
        discord: discord || undefined,
        password: await hashPassword(password) // Saved securely as SHA-256 hash
      };

      onRegisterUser(newUser);

      // Auto login
      const mockToken = `mvx_jwt_${btoa(newUser.email)}_${Date.now()}`;
      localStorage.setItem('mavix_session_token', mockToken);
      localStorage.setItem('mavix_logged_user_id', newUser.id);

      setSuccessMsg('Pendaftaran Berhasil! Mengalihkan Anda ke Dashboard...');
      setTimeout(() => {
        setIsSubmitting(false);
        onLoginSuccess(newUser);
        onClose();
      }, 1200);
    }
  };

  return (
    <div id="auth-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        id="auth-backdrop" 
        className="fixed inset-0 bg-black/85 backdrop-blur-md z-40"
        onClick={onClose}
      />

      {/* Modal Card */}
      <motion.div
        id="auth-card"
        initial={{ opacity: 0, scale: 0.93, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 15 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-xl rounded-2xl border border-[#35FF90]/25 bg-[#04091C]/90 p-6 md:p-8 text-white glow-primary z-50 my-8 shadow-2xl overflow-hidden"
      >
        {/* Neon Green subtle glows */}
        <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-[#35FF90]/10 blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-cyan-500/10 blur-[80px] pointer-events-none" />

        {/* Close Button */}
        <button 
          id="btn-close-auth"
          onClick={onClose}
          className="absolute top-5 right-5 rounded-xl p-2 text-[#A7B3D0] hover:bg-white/10 hover:text-white transition-all z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Brand & Title */}
        <div className="flex flex-col items-center text-center mb-6 mt-2">
          <div className="flex items-center justify-center w-12 h-12 mb-3 relative">
            <MavixLogo className="w-12 h-12 drop-shadow-[0_0_12px_rgba(53,255,144,0.4)]" />
          </div>
          <h2 className="font-display text-2xl font-extrabold tracking-wider text-white">
            {isLogin ? 'MASUK AKUN' : 'BUAT AKUN'}
          </h2>
          <p className="text-xs text-[#A7B3D0] mt-1.5 max-w-sm">
            {isLogin 
              ? 'Silakan masuk menggunakan kredensial terdaftar Anda.' 
              : 'Lengkapi data Anda untuk mengakses layanan premium Mavix Store.'}
          </p>
        </div>

        {/* Message Banner */}
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            id="auth-err-msg" 
            className="mb-5 flex items-start gap-2.5 rounded-xl bg-red-500/15 border border-red-500/30 p-3.5 text-xs text-red-300"
          >
            <ShieldAlert className="h-4.5 w-4.5 shrink-0 text-red-400 mt-0.5" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            id="auth-success-msg" 
            className="mb-5 flex items-start gap-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 p-3.5 text-xs text-emerald-300"
          >
            <CheckCircle className="h-4.5 w-4.5 shrink-0 text-[#35FF90] mt-0.5" />
            <span>{successMsg}</span>
          </motion.div>
        )}

        {/* Form Container */}
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          
          {isLogin ? (
            /* ================= LOGIN FORM ================= */
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#A7B3D0] uppercase tracking-wider mb-1.5">
                  Email atau Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A7B3D0]" />
                  <input
                    id="auth-input-email"
                    type="text"
                    placeholder="Masukkan Email atau Username Anda"
                    value={loginIdent}
                    onChange={(e) => setLoginIdent(e.target.value)}
                    className="w-full rounded-xl bg-[#0B122E] border border-white/10 py-3 pl-11 pr-4 text-sm text-white placeholder-white/35 focus:outline-none focus:border-[#35FF90]/50 focus:ring-1 focus:ring-[#35FF90]/20 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[11px] font-bold text-[#A7B3D0] uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-[10px] text-[#35FF90] hover:underline cursor-pointer">Lupa Password?</span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A7B3D0]" />
                  <input
                    id="auth-input-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full rounded-xl bg-[#0B122E] border border-white/10 py-3 pl-11 pr-4 text-sm text-white placeholder-white/35 focus:outline-none focus:border-[#35FF90]/50 focus:ring-1 focus:ring-[#35FF90]/20 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-white/10 bg-[#0B122E] text-[#35FF90] focus:ring-0 focus:ring-offset-0 h-4 w-4"
                  />
                  <span className="text-xs text-[#A7B3D0]">Ingat Saya</span>
                </label>
              </div>
            </div>
          ) : (
            /* ================= REGISTER FORM ================= */
            <div className="space-y-4">
              {/* Row 1: Nama Depan & Nama Belakang */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#A7B3D0] uppercase tracking-wider mb-1.5">
                    Nama Depan *
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A7B3D0]" />
                    <input
                      type="text"
                      placeholder="Nama Depan"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-xl bg-[#0B122E] border border-white/10 py-2.5 pl-11 pr-4 text-xs text-white placeholder-white/35 focus:outline-none focus:border-[#35FF90]/50 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#A7B3D0] uppercase tracking-wider mb-1.5">
                    Nama Belakang *
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A7B3D0]" />
                    <input
                      type="text"
                      placeholder="Nama Belakang"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full rounded-xl bg-[#0B122E] border border-white/10 py-2.5 pl-11 pr-4 text-xs text-white placeholder-white/35 focus:outline-none focus:border-[#35FF90]/50 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Username & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#A7B3D0] uppercase tracking-wider mb-1.5">
                    Username * (Min. 4 Karakter)
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A7B3D0]" />
                    <input
                      type="text"
                      placeholder="Hanya huruf/angka/underscore"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full rounded-xl bg-[#0B122E] border border-white/10 py-2.5 pl-11 pr-4 text-xs text-white placeholder-white/35 focus:outline-none focus:border-[#35FF90]/50 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#A7B3D0] uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A7B3D0]" />
                    <input
                      type="email"
                      placeholder="contoh@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl bg-[#0B122E] border border-white/10 py-2.5 pl-11 pr-4 text-xs text-white placeholder-white/35 focus:outline-none focus:border-[#35FF90]/50 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Password & Konfirmasi Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#A7B3D0] uppercase tracking-wider mb-1.5">
                    Password * (Min. 8 Karakter, Huruf + Angka)
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A7B3D0]" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl bg-[#0B122E] border border-white/10 py-2.5 pl-11 pr-4 text-xs text-white placeholder-white/35 focus:outline-none focus:border-[#35FF90]/50 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#A7B3D0] uppercase tracking-wider mb-1.5">
                    Konfirmasi Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A7B3D0]" />
                    <input
                      type="password"
                      placeholder="Ulangi password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-xl bg-[#0B122E] border border-white/10 py-2.5 pl-11 pr-4 text-xs text-white placeholder-white/35 focus:outline-none focus:border-[#35FF90]/50 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Nomor WhatsApp & Discord Username */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#A7B3D0] uppercase tracking-wider mb-1.5">
                    Nomor WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A7B3D0]" />
                    <input
                      type="tel"
                      placeholder="Contoh: 08123456789"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl bg-[#0B122E] border border-white/10 py-2.5 pl-11 pr-4 text-xs text-white placeholder-white/35 focus:outline-none focus:border-[#35FF90]/50 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#A7B3D0] uppercase tracking-wider mb-1.5">
                    Username Discord (Opsional)
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A7B3D0]" />
                    <input
                      type="text"
                      placeholder="Username Discord Anda"
                      value={discord}
                      onChange={(e) => setDiscord(e.target.value)}
                      className="w-full rounded-xl bg-[#0B122E] border border-white/10 py-2.5 pl-11 pr-4 text-xs text-white placeholder-white/35 focus:outline-none focus:border-[#35FF90]/50 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="rounded border-white/10 bg-[#0B122E] text-[#35FF90] focus:ring-0 focus:ring-offset-0 h-4 w-4 mt-0.5"
                  />
                  <span className="text-xs text-[#A7B3D0] leading-relaxed">
                    Saya menyetujui <span className="text-[#35FF90] hover:underline">Syarat &amp; Ketentuan</span> layanan serta kebijakan privasi data Mavix Store.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            id="auth-submit-btn"
            type="submit"
            disabled={isSubmitting || (!isLogin && !agreeTerms)}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all duration-300 transform hover:scale-[1.01] active:scale-95 shadow-lg ${
              isSubmitting || (!isLogin && !agreeTerms)
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5'
                : 'bg-gradient-to-r from-[#35FF90] to-cyan-400 text-[#04091C] hover:shadow-[0_0_20px_rgba(53,255,144,0.3)]'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-current" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>MEMPROSES...</span>
              </span>
            ) : (
              <>
                <span>{isLogin ? 'MASUK SEKARANG' : 'BUAT AKUN MAVIX'}</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center text-xs">
          <p className="text-[#A7B3D0]">
            {isLogin ? (
              <>
                Belum punya akun?{' '}
                <button 
                  onClick={() => { setIsLogin(false); setErrorMsg(''); setSuccessMsg(''); }}
                  className="text-[#35FF90] font-bold hover:underline"
                >
                  Daftar sekarang.
                </button>
              </>
            ) : (
              <>
                Sudah memiliki akun?{' '}
                <button 
                  onClick={() => { setIsLogin(true); setErrorMsg(''); setSuccessMsg(''); }}
                  className="text-[#35FF90] font-bold hover:underline"
                >
                  Masuk ke Akun
                </button>
              </>
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
