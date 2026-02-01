
import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, Layers, CheckSquare, Calendar, BarChart2, Clock, FileText, 
  Settings, Plus, Search, Bell, Users, Hash, Menu, X, Briefcase, Maximize2, Minimize2, 
  ChevronRight, ChevronDown, LogOut, User as UserIcon, Settings2, ShieldCheck, Zap,
  Building2, CreditCard
} from 'lucide-react';
import { useApp } from '../store';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CreateTaskModal from './CreateTaskModal';
import CreateProjectModal from './CreateProjectModal';
import Auth from '../views/Auth';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarItem: React.FC<{ icon: any; label: string; to: string; active?: boolean; onClick?: () => void }> = ({ icon: Icon, label, to, active, onClick }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden ${active ? 'text-white shadow-xl shadow-[var(--primary)]/25' : 'text-slate-500 hover:bg-[var(--primary)]/5 dark:hover:bg-slate-800'}`}
  >
    {active && (
      <motion.div 
        layoutId="sidebar-active-pill" 
        className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-indigo-500 -z-10" 
      />
    )}
    <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${active ? 'text-white' : 'text-slate-400 group-hover:text-[var(--primary)]'}`} />
    <span className="text-sm font-black tracking-tight uppercase tracking-widest text-[10px]">{label}</span>
  </Link>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    currentUser, workspaces, currentWorkspaceId, memberships, switchWorkspace, logout, can, userRoleInWorkspace 
  } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [showWsSwitcher, setShowWsSwitcher] = useState(false);
  const wsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wsRef.current && !wsRef.current.contains(e.target as Node)) setShowWsSwitcher(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser) return <Auth />;

  const currentWorkspace = workspaces.find(w => w.id === currentWorkspaceId) || workspaces[0];
  const myWorkspaces = workspaces.filter(w => memberships.some(m => m.workspaceId === w.id && m.userId === currentUser.id));

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className={`flex h-screen overflow-hidden relative bg-transparent text-[var(--text)]`}>
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
        )}
      </AnimatePresence>

      {!isFocusMode && (
        <motion.aside 
          initial={false}
          animate={{ x: isSidebarOpen ? 0 : (window.innerWidth < 1024 ? -280 : 0) }}
          className="fixed lg:static inset-y-0 left-0 w-64 border-r border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-2xl flex flex-col shrink-0 z-50 transition-transform lg:translate-x-0"
        >
          {/* Workspace Switcher */}
          <div className="p-6 relative" ref={wsRef}>
            <button 
              onClick={() => setShowWsSwitcher(!showWsSwitcher)}
              className="w-full flex items-center justify-between p-4 rounded-[28px] bg-slate-100/50 dark:bg-slate-900/50 border border-[var(--border)] hover:border-[var(--primary)]/50 transition-all group shadow-inner"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary)] to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black shadow-xl shadow-[var(--primary)]/25 group-hover:scale-105 transition-transform">
                  {currentWorkspace.name.charAt(0)}
                </div>
                <div className="min-w-0 text-left">
                  <h1 className="text-xs font-black tracking-tight truncate w-24 uppercase tracking-widest">{currentWorkspace.name}</h1>
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{userRoleInWorkspace}</p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-transform group-hover:translate-y-0.5" />
            </button>

            <AnimatePresence>
              {showWsSwitcher && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-6 right-6 mt-4 bg-[var(--surface)] border border-[var(--border)] rounded-[32px] shadow-3xl z-[60] overflow-hidden backdrop-blur-xl"
                >
                  <div className="p-3 space-y-1">
                    <p className="px-4 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest">Select Node</p>
                    {myWorkspaces.map(ws => (
                      <button 
                        key={ws.id}
                        onClick={() => { switchWorkspace(ws.id); setShowWsSwitcher(false); navigate('/'); }}
                        className={`w-full flex items-center gap-3 p-3 rounded-[24px] text-xs font-bold transition-all ${ws.id === currentWorkspaceId ? 'bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 shadow-sm' : 'hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent'}`}
                      >
                        <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black">
                          {ws.name.charAt(0)}
                        </div>
                        <span className="truncate font-black uppercase tracking-widest text-[10px]">{ws.name}</span>
                      </button>
                    ))}
                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-2 mx-2" />
                    <button className="w-full flex items-center gap-3 p-3 rounded-[24px] text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
                      <Plus className="w-4 h-4" /> New Workspace
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-10 custom-scrollbar">
            <div>
              <SidebarItem icon={LayoutDashboard} label="Overview" to="/" active={isActive('/')} />
              <SidebarItem icon={CheckSquare} label="My Work" to="/my-tasks" active={isActive('/my-tasks')} />
              <SidebarItem icon={Briefcase} label="Projects" to="/projects" active={isActive('/projects')} />
            </div>

            <div>
              <div className="mb-4 px-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-60">Organization</span>
              </div>
              <div className="space-y-1">
                <SidebarItem icon={Users} label="People" to="/settings/members" active={isActive('/settings/members')} />
                <SidebarItem icon={Building2} label="Settings" to="/settings/workspace" active={isActive('/settings/workspace')} />
                <SidebarItem icon={CreditCard} label="Billing" to="/settings/billing" active={isActive('/settings/billing')} />
                <SidebarItem icon={FileText} label="Library" to="/wiki" active={isActive('/wiki')} />
                <SidebarItem icon={BarChart2} label="Analytics" to="/reports" active={isActive('/reports')} />
              </div>
            </div>
          </nav>

          <div className="p-4 mt-auto border-t border-[var(--border)] space-y-2">
            <div className="group relative">
                <button className="w-full flex items-center gap-3 px-4 py-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-[32px] border border-[var(--border)] hover:border-[var(--primary)] transition-all overflow-hidden shadow-inner">
                    <img src={currentUser.avatar} className="w-11 h-11 rounded-2xl shadow-lg border-2 border-white dark:border-slate-800" />
                    <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-black truncate text-[var(--text)]">{currentUser.name}</p>
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter truncate">{userRoleInWorkspace}</p>
                    </div>
                </button>
                <div className="absolute bottom-full left-0 right-0 mb-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all pointer-events-none group-hover:pointer-events-auto">
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[40px] shadow-3xl p-3 space-y-1 overflow-hidden backdrop-blur-2xl">
                        <Link to="/settings" className="flex items-center gap-3 p-4 rounded-[24px] text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
                            <Settings2 className="w-4 h-4 text-slate-400" /> Preferences
                        </Link>
                        <button onClick={logout} className="w-full flex items-center gap-3 p-4 rounded-[24px] text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all">
                            <LogOut className="w-4 h-4" /> Secure Logout
                        </button>
                    </div>
                </div>
            </div>
          </div>
        </motion.aside>
      )}

      <main className="flex-1 flex flex-col overflow-hidden w-full relative">
        <header className="h-16 glass sticky top-0 border-b border-[var(--border)] flex items-center justify-between px-8 shrink-0 z-30">
          <div className="flex items-center gap-6 flex-1">
            {!isFocusMode && (
              <button className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors" onClick={() => setIsSidebarOpen(true)}>
                <Menu className="w-5 h-5" />
              </button>
            )}
            <div className="relative max-w-lg w-full hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Jump to anywhere..." className="w-full pl-12 pr-12 py-2.5 bg-slate-100 dark:bg-slate-900/50 border border-transparent focus:border-[var(--primary)]/30 rounded-2xl text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-[var(--primary)]/5 outline-none transition-all shadow-inner" />
            </div>
          </div>
          <div className="flex items-center gap-5">
            <button onClick={() => setIsFocusMode(!isFocusMode)} className="p-2.5 text-slate-400 hover:text-[var(--primary)] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
              {isFocusMode ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsCreateModalOpen(true)} className="bg-gradient-to-r from-[var(--primary)] to-indigo-600 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:brightness-110 active:scale-95 transition-all shadow-2xl shadow-[var(--primary)]/30">
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline">Launch Mission</span>
            </button>
            <div className="w-px h-8 bg-[var(--border)] mx-1" />
            <button className="relative p-2.5 text-slate-400 hover:text-[var(--primary)] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all group">
              <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--primary)] rounded-full border-2 border-[var(--surface)]" />
            </button>
          </div>
        </header>

        <section className="flex-1 overflow-auto custom-scrollbar relative">
          <AnimatePresence mode="wait">
            <motion.div 
              key={location.pathname} 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -15 }} 
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} 
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>

      <CreateTaskModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      <CreateProjectModal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} />
    </div>
  );
};

export default Layout;
