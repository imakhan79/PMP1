
import React from 'react';
import { useApp } from '../store';
import { motion } from 'framer-motion';
import { 
  Sun, Moon, Palette, Zap, 
  Monitor, Bell, Shield, 
  Check, Play, MousePointer2 
} from 'lucide-react';
import { AccentColor, ThemeMode } from '../types';

const SettingsView: React.FC = () => {
  const { workspace, updateWorkspaceSettings } = useApp();
  const settings = workspace.settings;

  const themes: { id: ThemeMode; label: string; icon: any }[] = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon }
  ];

  const accents: { id: AccentColor; label: string; color: string }[] = [
    { id: 'ocean', label: 'Ocean', color: '#0ea5e9' },
    { id: 'aurora', label: 'Aurora', color: '#d946ef' },
    { id: 'forest', label: 'Forest', color: '#10b981' },
    { id: 'ember', label: 'Ember', color: '#f43f5e' },
    { id: 'slate', label: 'Slate', color: '#475569' },
    { id: 'sunrise', label: 'Sunrise', color: '#f59e0b' },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto pb-24 space-y-12">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">Preferences</h1>
        <p className="text-slate-500 font-medium">Customize your workspace look and feel.</p>
      </header>

      {/* Theme Selection */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Palette className="w-6 h-6 text-[var(--primary)]" />
          <h2 className="text-xl font-bold">Appearance</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {themes.map(theme => (
            <button
              key={theme.id}
              onClick={() => updateWorkspaceSettings({ theme: theme.id })}
              className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200 ${
                settings.theme === theme.id 
                  ? 'border-[var(--primary)] bg-[var(--primary)]/5' 
                  : 'border-[var(--border)] bg-[var(--surface)] hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <theme.icon className={`w-5 h-5 ${settings.theme === theme.id ? 'text-[var(--primary)]' : 'text-slate-400'}`} />
                <span className="font-bold">{theme.label} Mode</span>
              </div>
              {settings.theme === theme.id && <Check className="w-5 h-5 text-[var(--primary)]" />}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Accent Color</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {accents.map(accent => (
              <button
                key={accent.id}
                onClick={() => updateWorkspaceSettings({ accent: accent.id })}
                className={`group flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                  settings.accent === accent.id 
                    ? 'border-[var(--primary)] bg-[var(--primary)]/5' 
                    : 'border-[var(--border)] bg-[var(--surface)] hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div 
                  className="w-8 h-8 rounded-full shadow-lg group-hover:scale-110 transition-transform" 
                  style={{ backgroundColor: accent.color }} 
                />
                <span className={`text-[10px] font-bold ${settings.accent === accent.id ? 'text-[var(--primary)]' : 'text-slate-500'}`}>
                  {accent.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Motion & Performance */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 text-[var(--primary)]" />
          <h2 className="text-xl font-bold">Performance</h2>
        </div>
        <div className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500">
                <Play className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm">Reduced Motion</p>
                <p className="text-xs text-slate-500">Minimize animations and transitions throughout the app.</p>
              </div>
            </div>
            <button 
              onClick={() => updateWorkspaceSettings({ reduceMotion: !settings.reduceMotion })}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.reduceMotion ? 'bg-[var(--primary)]' : 'bg-slate-200 dark:bg-slate-700'}`}
            >
              <motion.div 
                animate={{ x: settings.reduceMotion ? 26 : 4 }}
                className="w-4 h-4 bg-white rounded-full absolute top-1"
              />
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-[var(--primary)]" />
          <h2 className="text-xl font-bold">System</h2>
        </div>
        <div className="p-6 bg-[var(--surface)] border border-[var(--border)] rounded-3xl space-y-6">
           <div className="flex items-center justify-between opacity-50 cursor-not-allowed">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm">Desktop App</p>
                <p className="text-xs text-slate-500">Enable advanced features by downloading our native client.</p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md">COMING SOON</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsView;
