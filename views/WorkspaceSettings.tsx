
import React, { useState, useMemo } from 'react';
import { useApp } from '../store';
import { Palette, Globe, Save, AlertTriangle, CheckCircle2, Layout, Sliders, Activity, User, ShieldAlert, Trash, Archive } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AccentColor } from '../types';

const WorkspaceSettings: React.FC = () => {
  const { workspaces, currentWorkspaceId, updateWorkspace, archiveWorkspace, deleteWorkspace, can, auditLogs, users } = useApp();
  const workspace = workspaces.find(w => w.id === currentWorkspaceId);
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'BRANDING' | 'LOCALIZATION' | 'AUDIT'>('GENERAL');
  const [success, setSuccess] = useState(false);

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => log.workspaceId === currentWorkspaceId).slice(0, 20);
  }, [auditLogs, currentWorkspaceId]);

  if (!workspace) return null;

  const handleSave = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const accents: { id: AccentColor; color: string }[] = [
    { id: 'ocean', color: '#0ea5e9' }, { id: 'aurora', color: '#d946ef' }, { id: 'forest', color: '#10b981' }, { id: 'ember', color: '#f43f5e' }, { id: 'slate', color: '#475569' }, { id: 'sunrise', color: '#f59e0b' },
  ];

  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto space-y-12 pb-32">
      <header className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight">Organization Node</h1>
        <p className="text-slate-500 font-medium">Calibrate organizational parameters, branding, and visibility logs.</p>
      </header>

      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900/50 rounded-2xl w-fit">
        {['GENERAL', 'BRANDING', 'LOCALIZATION', 'AUDIT'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === tab ? 'bg-white dark:bg-slate-800 text-[var(--primary)] shadow-sm border border-[var(--border)]' : 'text-slate-500 hover:text-slate-700'}`}>
            {tab === 'AUDIT' ? 'Audit Trail' : tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence mode="wait">
            {activeTab === 'GENERAL' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="bg-[var(--surface)] p-8 rounded-[40px] border border-[var(--border)] shadow-sm space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Workspace Name</label>
                      <input type="text" value={workspace.name} onChange={e => updateWorkspace(workspace.id, { name: e.target.value })} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-2xl text-sm font-bold focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unique Slug</label>
                      <input type="text" value={workspace.slug} onChange={e => updateWorkspace(workspace.id, { slug: e.target.value })} className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-2xl text-sm font-bold focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all" />
                    </div>
                  </div>
                </div>

                <div className="bg-rose-50 dark:bg-rose-950/20 p-8 rounded-[40px] border border-rose-100 dark:border-rose-900/30 space-y-6">
                  <div className="flex items-center gap-3 text-rose-600"><ShieldAlert className="w-6 h-6" /><h3 className="text-lg font-black tracking-tight">System Termination</h3></div>
                  <p className="text-xs text-rose-700 dark:text-rose-500/80 font-medium">Archive removes write access for all users. Delete permanently flags the organization for removal.</p>
                  <div className="flex gap-4">
                    <button onClick={() => archiveWorkspace(workspace.id)} className="px-5 py-2.5 bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-rose-500/20 hover:brightness-110 active:scale-95 transition-all"><Archive className="w-4 h-4" /> Archive</button>
                    <button onClick={() => deleteWorkspace(workspace.id)} className="px-5 py-2.5 border border-rose-500 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-rose-500 hover:text-white transition-all"><Trash className="w-4 h-4" /> Delete</button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'AUDIT' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-[var(--surface)] rounded-[40px] border border-[var(--border)] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-[var(--border)] bg-slate-50/20 flex items-center justify-between"><h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Security & Event Log</h3><Activity className="w-4 h-4 text-slate-300" /></div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredLogs.map(log => {
                    const actor = users.find(u => u.id === log.actorId);
                    return (
                      <div key={log.id} className="p-4 flex items-center gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                        <img src={actor?.avatar} className="w-8 h-8 rounded-lg shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold truncate"><span className="text-[var(--primary)]">{actor?.name}</span> executed <span className="font-black text-slate-900 dark:text-slate-100 uppercase text-[9px] tracking-tighter">{log.action}</span> on {log.targetType}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{new Date(log.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                    );
                  })}
                  {filteredLogs.length === 0 && <div className="p-12 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">No recent records</div>}
                </div>
              </motion.div>
            )}

            {activeTab === 'LOCALIZATION' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-[var(--surface)] p-8 rounded-[40px] border border-[var(--border)] shadow-sm space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Week Start</label>
                        <select className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-2xl text-sm font-bold focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all cursor-pointer">
                            <option value="1">Monday (Standard)</option>
                            <option value="0">Sunday</option>
                            <option value="6">Saturday</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">System Timezone</label>
                        <select className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-2xl text-sm font-bold focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all cursor-pointer">
                            <option value="UTC">UTC (Universal)</option>
                            <option value="PST">Pacific (PST)</option>
                            <option value="EST">Eastern (EST)</option>
                        </select>
                    </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex items-center justify-between pt-6">
            <AnimatePresence>{success && <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest"><CheckCircle2 className="w-4 h-4" /> Config Synced</motion.div>}</AnimatePresence>
            <button onClick={handleSave} className="px-8 py-3 bg-[var(--primary)] text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-2xl shadow-[var(--primary)]/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-3"><Save className="w-5 h-5" /> Save State</button>
          </div>
        </div>
        <div className="space-y-8">
           <div className="bg-slate-900 dark:bg-slate-100 p-8 rounded-[40px] text-white dark:text-slate-900 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform"><Sliders className="w-24 h-24" /></div>
              <h3 className="text-lg font-black tracking-tight mb-4 relative">State Health</h3>
              <div className="space-y-4 relative">
                  <div className="flex items-center justify-between"><span className="text-[10px] font-black uppercase tracking-widest opacity-60">Status</span><span className="text-[10px] font-black uppercase bg-emerald-500 text-white px-2 py-0.5 rounded">{workspace.status}</span></div>
                  <div className="flex items-center justify-between"><span className="text-[10px] font-black uppercase tracking-widest opacity-60">Last Sync</span><span className="text-[10px] font-black uppercase">{new Date(workspace.updatedAt).toLocaleDateString()}</span></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSettings;
