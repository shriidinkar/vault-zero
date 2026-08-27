import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  KeyRound,
  CheckCircle2,
  Building2,
  Fingerprint,
} from 'lucide-react';
import { UserProfile } from '../types.js';

interface LoginScreenProps {
  onLogin: (user: UserProfile) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('s.jenkins@apexglobal.corp');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<'CFO' | 'AP_DIRECTOR' | 'TREASURER' | 'PROCUREMENT_LEAD'>('CFO');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const demoUsers: UserProfile[] = [
    {
      id: 'usr_cfo_01',
      name: 'Sarah Jenkins',
      email: 's.jenkins@apexglobal.corp',
      role: 'CFO',
      avatarInitials: 'SJ',
      department: 'Executive Finance & Treasury',
    },
    {
      id: 'usr_ap_02',
      name: 'David Sterling',
      email: 'd.sterling@apexglobal.corp',
      role: 'AP_DIRECTOR',
      avatarInitials: 'DS',
      department: 'Accounts Payable & Controls',
    },
    {
      id: 'usr_proc_03',
      name: 'Marcus Vance',
      email: 'm.vance@apexglobal.corp',
      role: 'PROCUREMENT_LEAD',
      avatarInitials: 'MV',
      department: 'Strategic Sourcing & Vendor Ops',
    },
  ];

  const handleQuickLogin = (user: UserProfile) => {
    setIsAuthenticating(true);
    setTimeout(() => {
      onLogin(user);
    }, 450);
  };

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    const matched = demoUsers.find((u) => u.role === selectedRole) || demoUsers[0];
    setTimeout(() => {
      onLogin({
        ...matched,
        email: email || matched.email,
      });
    }, 450);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans selection:bg-blue-600 selection:text-white">
      {/* Subtle Background Circuit Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card Container */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6 animate-in fade-in zoom-in-95 duration-300">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-950 border border-slate-700 text-emerald-400 shadow-inner mb-1">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
          </div>
          <div className="flex items-center justify-center space-x-2">
            <h1 className="text-2xl font-black font-mono tracking-tight uppercase text-white">
              Vault-Zero
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800 font-bold uppercase tracking-wider">
              IAM 2.0
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Autonomous Accounts Payable &amp; Zero-Trust Forensics
          </p>
        </div>

        {/* Step 1 in Flow Diagram Callout */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex items-center space-x-3 text-xs font-mono">
          <div className="w-6 h-6 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-black">
            1
          </div>
          <div className="flex-1">
            <span className="text-slate-400 block text-[11px]">System Authentication Flow</span>
            <span className="text-emerald-400 font-bold">Step 1: Secure Enterprise Login</span>
          </div>
          <Lock className="w-4 h-4 text-slate-500" />
        </div>

        {/* 1-Click Role Profiles */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider text-[10px] font-mono text-slate-500">
              Select Verified Executive Profile
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">1-Click Fast Auth</span>
          </div>

          <div className="space-y-2">
            {demoUsers.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => handleQuickLogin(user)}
                disabled={isAuthenticating}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 group-hover:bg-blue-600 text-slate-300 group-hover:text-white flex items-center justify-center font-bold text-xs font-mono transition-colors">
                    {user.avatarInitials}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                        {user.name}
                      </span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 group-hover:bg-blue-900 group-hover:text-blue-200">
                        {user.role}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block truncate max-w-[210px]">
                      {user.department}
                    </span>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-[10px] uppercase font-mono text-slate-500 font-bold">
            Or Corporate SSO
          </span>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleStandardSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400 block font-semibold">
              Corporate Email ID
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-mono transition-colors"
                placeholder="name@company.com"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400 block font-semibold">
              Zero-Trust Hardware Token / Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-mono transition-colors"
                placeholder="••••••••••••"
              />
              <Fingerprint className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isAuthenticating}
            className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-blue-600/20 cursor-pointer disabled:opacity-50"
          >
            {isAuthenticating ? (
              <span className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Authenticating Session...</span>
              </span>
            ) : (
              <>
                <span>Enter AP Dashboard &amp; Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Security Badges */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span className="flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>FIPS 140-3 Enclave</span>
          </span>
          <span>SOC2 Type II Certified</span>
        </div>
      </div>
    </div>
  );
};
