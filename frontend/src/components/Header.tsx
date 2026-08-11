import React, { useEffect, useState } from 'react';
import { ShieldCheck, Server, User, Clock, Radio, LogIn, Lock, Users, Plus, X, CheckCircle2 } from 'lucide-react';
import { SubjectIdentity, SystemHealth } from '../types';

interface HeaderProps {
  identity: SubjectIdentity | null;
  health: SystemHealth | null;
  onIdentityChange?: (newIdentity: SubjectIdentity) => void;
}

export const Header: React.FC<HeaderProps> = ({ identity, health, onIdentityChange }) => {
  const [time, setTime] = useState<string>('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserMgmtModal, setShowUserMgmtModal] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Atlas2026!');
  const [loginError, setLoginError] = useState('');
  const [usersList, setUsersList] = useState<any[]>([]);

  // Add User State
  const [newUsername, setNewUsername] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newCapability, setNewCapability] = useState('C3');
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadUsers = async () => {
    try {
      const res = await fetch('/api/v1/identity/users');
      if (res.ok) {
        setUsersList(await res.json());
      }
    } catch {
      // fallback
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const res = await fetch('/api/v1/identity/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setLoginError(errData.detail || 'Giriş başarısız. Şifreyi kontrol edin.');
        return;
      }

      const data = await res.json();
      const newIdent: SubjectIdentity = {
        subject_id: data.user_id,
        display_name: data.display_name,
        environment: 'production',
        roles: data.roles,
        scopes: data.scopes,
        max_capability_class: data.max_capability_class || 'C5',
        is_development_identity: false,
      };

      if (onIdentityChange) {
        onIdentityChange(newIdent);
      }

      setShowLoginModal(false);
      setNotification(`Giriş Başarılı! Rol: ${data.max_capability_class} Super Admin`);
      setTimeout(() => setNotification(''), 4000);
    } catch {
      setLoginError('Sunucuya bağlanılamadı.');
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/identity/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: newUsername,
          display_name: newDisplayName,
          email: newEmail,
          max_capability_class: newCapability,
        }),
      });

      if (res.ok) {
        setNotification(`Kullanıcı '${newUsername}' (${newCapability}) başarıyla eklendi!`);
        setNewUsername('');
        setNewDisplayName('');
        setNewEmail('');
        loadUsers();
      }
    } catch {
      // fallback
    }
  };

  const isHealthy = health?.status === 'healthy';
  const currentCapability = identity?.max_capability_class || 'C5';

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-50">
      {/* Brand & Logo */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Server className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight gradient-text-cyan">
                PROJECT ATLAS
              </h1>
              <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
                v1.0.0
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400 tracking-wider uppercase -mt-0.5">
              AI Infrastructure Operations Platform
            </p>
          </div>
        </div>

        {/* Live System Health Badge */}
        <div className={`badge-pill ${isHealthy ? 'badge-emerald' : 'badge-rose'} ml-2 cursor-pointer`}>
          <span className={`pulse-dot ${isHealthy ? 'bg-emerald-400' : 'bg-rose-400'}`} />
          <span>API: {health ? health.status.toUpperCase() : 'ONLINE'}</span>
        </div>
      </div>

      {/* Operator Identity Context & Telemetry Header */}
      <div className="flex items-center gap-4 font-mono text-xs">
        {/* System Time */}
        <div className="hidden lg:flex items-center gap-2 text-slate-400 bg-slate-900/90 px-3.5 py-1.5 rounded-xl border border-slate-800/80 shadow-inner">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{time || '12:00:00'} UTC</span>
        </div>

        {/* Active Environment */}
        <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800/80 text-slate-300">
          <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span className="text-[11px] uppercase font-semibold text-slate-400">ENV:</span>
          <span className="font-bold text-indigo-300 capitalize">{health?.environment || 'production'}</span>
        </div>

        {/* Capability Scope Pill (ADR-003) */}
        <div className="flex items-center gap-2 bg-cyan-950/60 border border-cyan-800/40 px-3.5 py-1.5 rounded-xl text-cyan-200">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span className="text-[11px] text-slate-400">YETKİ:</span>
          <span className="font-bold text-cyan-300">{currentCapability} SUPERUSER</span>
        </div>

        {/* User Management Button (C5 Superuser) */}
        <button
          onClick={() => { loadUsers(); setShowUserMgmtModal(true); }}
          title="Kullanıcı ve Yetki Yönetimi (IAM)"
          className="flex items-center gap-2 bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-800/40 text-indigo-300 px-3 py-1.5 rounded-xl transition-all"
        >
          <Users className="w-3.5 h-3.5 text-indigo-400" />
          <span>Kullanıcı Yönetimi</span>
        </button>

        {/* Login / Profile Button */}
        <button
          onClick={() => setShowLoginModal(true)}
          className="flex items-center gap-2.5 bg-slate-900/90 hover:bg-cyan-950/60 border border-slate-800/80 hover:border-cyan-500/40 px-3.5 py-1.5 rounded-xl transition-all duration-200 cursor-pointer"
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-cyan-500/20">
            <User className="w-3.5 h-3.5" />
          </div>
          <div className="text-left">
            <div className="font-bold text-slate-200 text-xs">{identity?.display_name || 'Root Super Admin'}</div>
            <div className="text-[10px] text-cyan-400 font-mono -mt-0.5 flex items-center gap-1">
              <LogIn className="w-2.5 h-2.5" /> Giriş Yap / Rol Değiştir
            </div>
          </div>
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-5 right-5 p-4 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs font-mono flex items-center gap-2 z-50 animate-fadeIn shadow-2xl">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Super Admin Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn font-sans">
          <div className="atlas-glass-panel p-6 max-w-md w-full space-y-5 border-cyan-500/40 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Kullanıcı Girişi & Kimlik Doğrulama</h3>
                  <p className="text-xs font-mono text-cyan-400">Class C5 Root / Security Administrator Access</p>
                </div>
              </div>
              <button onClick={() => setShowLoginModal(false)} className="text-slate-400 hover:text-white p-1 rounded bg-slate-900 border border-slate-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 font-mono text-xs">
              {loginError && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-300 text-xs">
                  {loginError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Kullanıcı Adı</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin veya operator"
                  className="w-full bg-slate-950 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-800 outline-none focus:border-cyan-500"
                />
                <div className="text-[10px] text-slate-500">Örnekler: admin (Root C5 Superuser), operator (C0 Operator)</div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Şifre</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-800 outline-none focus:border-cyan-500"
                />
                <div className="text-[10px] text-cyan-400">Varsayılan Şifre: Atlas2026!</div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setShowLoginModal(false)} className="btn-secondary text-xs">
                  İptal
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Sisteme Giriş Yap (Class C5 Superuser)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User & Role IAM Management Modal */}
      {showUserMgmtModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn font-sans">
          <div className="atlas-glass-panel p-6 max-w-2xl w-full space-y-5 border-indigo-500/40 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Kullanıcılar ve Yetki Sınıfları (IAM Governance)</h3>
                  <p className="text-xs font-mono text-cyan-400">Class C0 (Read-only) ➔ Class C5 (Platform Superuser)</p>
                </div>
              </div>
              <button onClick={() => setShowUserMgmtModal(false)} className="text-slate-400 hover:text-white p-1 rounded bg-slate-900 border border-slate-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Registered Users List Table */}
            <div className="space-y-2 font-mono text-xs">
              <div className="text-slate-300 font-bold">Kayıtlı Platform Kullanıcıları ({usersList.length})</div>
              <div className="bg-slate-950 rounded-xl border border-slate-800 divide-y divide-slate-800/80 overflow-hidden">
                {usersList.map((u, i) => (
                  <div key={i} className="p-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-xs">{u.display_name} ({u.username})</div>
                      <div className="text-[10px] text-slate-400">{u.email} • Son Giriş: {u.last_login?.substring(0, 10)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`badge-pill ${u.max_capability_class === 'C5' ? 'badge-cyan' : 'badge-emerald'}`}>
                        {u.max_capability_class} CAPABILITY
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Create New User Form */}
            <form onSubmit={handleAddUser} className="space-y-3 font-mono text-xs pt-3 border-t border-slate-800">
              <div className="text-slate-300 font-bold flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-cyan-400" /> Yeni Kullanıcı ve Yetki Tanımla
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Kullanıcı Adı (Örn: ahmet.yilmaz)"
                  className="bg-slate-950 text-slate-100 px-3 py-2 rounded-xl border border-slate-800 outline-none focus:border-cyan-500 text-xs"
                />
                <input
                  type="text"
                  required
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  placeholder="Ad Soyad (Örn: Ahmet Yılmaz)"
                  className="bg-slate-950 text-slate-100 px-3 py-2 rounded-xl border border-slate-800 outline-none focus:border-cyan-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="E-Posta Adresi"
                  className="bg-slate-950 text-slate-100 px-3 py-2 rounded-xl border border-slate-800 outline-none focus:border-cyan-500 text-xs"
                />
                <select
                  value={newCapability}
                  onChange={(e) => setNewCapability(e.target.value)}
                  className="bg-slate-950 text-slate-100 px-3 py-2 rounded-xl border border-slate-800 outline-none focus:border-cyan-500 text-xs"
                >
                  <option value="C0">Class C0 (Read-Only Operator)</option>
                  <option value="C1">Class C1 (Diagnostic Analyst)</option>
                  <option value="C2">Class C2 (Change Planner)</option>
                  <option value="C3">Class C3 (Operations Lead)</option>
                  <option value="C4">Class C4 (Infrastructure Admin)</option>
                  <option value="C5">Class C5 (Platform Superuser / Admin)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="submit" className="btn-primary text-xs">
                  Kullanıcıyı Kaydet & Yetkilendir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
