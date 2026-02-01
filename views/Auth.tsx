
import React, { useState } from 'react';
import { useApp } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User as UserIcon, ArrowRight, Zap, CheckCircle2, ShieldCheck } from 'lucide-react';

const Auth: React.FC = () => {
  const { login, signup } = useApp();
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP' | 'FORGOT'>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(r => setTimeout(r, 1000));
    
    if (mode === 'LOGIN') {
      login(email);
    } else if (mode === 'SIGNUP') {
      signup(name, email);
    } else {
      setSuccessMsg('A reset link has been sent to your inbox.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--primary)]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-[48px] shadow-3xl overflow-hidden z-10"
      >
        <div className="p-10 text-center border-b border-[var(--border)] bg-slate-50/50 dark:bg-slate-900/20">
          <div className="w-16 h-16 bg-[var(--primary)] rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-[var(--primary)]/30 mb-6">
            <Zap className="w-8 h-8 text-white fill-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2">
            {mode === 'LOGIN' ? 'Welcome Back' : mode === 'SIGNUP' ? 'Create Account' : 'Recover Access'}
          </h1>
          <p className="text-slate-500 font-medium">Aslam PM — Project management with speed.</p>
        </div>

        <div className="p-10 space-y-6">
          <AnimatePresence mode="wait">
            {successMsg ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900/50 p-6 rounded-3xl text-center"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
                <h3 className="font-bold text-emerald-900 dark:text-emerald-400 mb-2">Success!</h3>
                <p className="text-sm text-emerald-700 dark:text-emerald-500">{successMsg}</p>
                <button onClick={() => setSuccessMsg('')} className="mt-6 text-xs font-black uppercase tracking-widest text-emerald-600 underline">Back to Login</button>
              </motion.div>
            ) : (
              <form key={mode} onSubmit={handleSubmit} className="space-y-6">
                {mode === 'SIGNUP' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        required type="text" value={name} onChange={e => setName(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-2xl text-sm font-bold focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      required type="email" value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-2xl text-sm font-bold focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all"
                      placeholder="admin@aslam.pm"
                    />
                  </div>
                </div>

                {mode !== 'FORGOT' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                      {mode === 'LOGIN' && (
                        <button type="button" onClick={() => setMode('FORGOT')} className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest">Forgot?</button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        required type="password" value={password} onChange={e => setPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-2xl text-sm font-bold focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                )}

                <button 
                  disabled={isLoading}
                  className="w-full py-5 bg-[var(--primary)] text-white rounded-[24px] text-sm font-black uppercase tracking-widest shadow-2xl shadow-[var(--primary)]/30 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                >
                  {isLoading ? 'Processing...' : mode === 'LOGIN' ? 'Secure Login' : mode === 'SIGNUP' ? 'Initialize Account' : 'Send Recovery Link'}
                  {!isLoading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            )}
          </AnimatePresence>

          <div className="pt-8 border-t border-[var(--border)] text-center space-y-4">
            {mode === 'LOGIN' ? (
              <p className="text-sm font-medium text-slate-500">
                New to Aslam PM? <button onClick={() => setMode('SIGNUP')} className="text-[var(--primary)] font-black uppercase tracking-widest text-[10px] ml-1">Join Workspace</button>
              </p>
            ) : (
              <p className="text-sm font-medium text-slate-500">
                Already have an account? <button onClick={() => setMode('LOGIN')} className="text-[var(--primary)] font-black uppercase tracking-widest text-[10px] ml-1">Sign In</button>
              </p>
            )}
            
            <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-60">
              <ShieldCheck className="w-3.5 h-3.5" />
              256-bit Enterprise Encryption
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
