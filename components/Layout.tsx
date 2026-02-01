
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
    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group relative ${active ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
  >
    <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${active ? 'text-white' : 'text-slate-400 group-hover:text-[var(--primary)]'}`} />
    <span className="text-sm font-semibold tracking-tight">{label}</span>
    {active && (
      <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-[var(--primary)] rounded-xl -z-10" />
    )}
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

  return (
    <div className={`flex h-screen overflow-hidden relative bg-[var(--bg)] text-[var(--text)]`}>
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
        )}
      </AnimatePresence>

      {!isFocusMode && (
        <motion.aside 
          initial={false}
          animate={{ x: isSidebarOpen ? 0 : (window.innerWidth < 1024 ? -256 : 0) }}
          className="fixed lg:static inset-y-0 left-0 w-64 border-r border-[var(--border)] bg-[var(--surface)] flex flex-col shrink-0 z-50 transition-transform lg:translate-x-0"
        >
          {/* Workspace Switcher */}
          <div className="p-6 relative" ref={wsRef}>
            <button 
              onClick={() => setShowWsSwitcher(!showWsSwitcher)}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-[var(--border)] hover:border-[var(--primary)]/50 transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 bg-[var(--primary)] rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-[var(--primary)]/20">
                  {currentWorkspace.name.charAt(0)}
                </div>
                <div className="min-w-0 text-left">
                  <h1 className="text-xs font-black tracking-tight truncate w-24">{currentWorkspace.name}</h1>
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{userRoleInWorkspace}</p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-300 group-hover:text-slate-500" />
            </button>

            <AnimatePresence>
              {showWsSwitcher && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-6 right-6 mt-2 bg-[var(--surface)] border border-[var(--border)] rounded-[32px] shadow-2xl z-[60] overflow-hidden"
                >
                  <div className="p-2 space-y-1">
                    {myWorkspaces.map(ws => (
                      <button 
                        key={ws.id}
                        onClick={() => { switchWorkspace(ws.id); setShowWsSwitcher(false); }}
                        className={`w-full flex items-center gap-3 p-3 rounded-2xl text-xs font-bold transition-all ${ws.id === currentWorkspaceId ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'hover:bg-slate-50 dark:hover:bg-slate-900'}`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black">
                          {ws.name.charAt(0)}
                        </div>
                        <span className="truncate">{ws.name}</span>
                      </button>
                    ))}
                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-1 mx-2" />
                    <button className="w-full flex items-center gap-3 p-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
                      <Plus className="w-4 h-4" /> New Workspace
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-8 custom-scrollbar">
            <div className="space-y-1">
              <SidebarItem icon={LayoutDashboard} label="Overview" to="/" active={location.pathname === '/'} />
              <SidebarItem icon={CheckSquare} label="My Work" to="/my-tasks" active={location.pathname === '/my-tasks'} />
              <SidebarItem icon={Briefcase} label="Projects" to="/projects" active={location.pathname === '/projects'} />
            </div>

            <div>
              <div className="mb-3 px-4">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest opacity-70">Workspace</span>
              </div>
              <div className="space-y-1">
                <SidebarItem icon={Users} label="People" to="/settings/members" active={location.pathname === '/settings/members'} />
                <SidebarItem icon={Building2} label="Settings" to="/settings/workspace" active={location.pathname === '/settings/workspace'} />
                <SidebarItem icon={CreditCard} label="Billing" to="/settings/billing" active={location.pathname === '/settings/billing'} />
                <SidebarItem icon={FileText} label="Library" to="/wiki" active={location.pathname === '/wiki'} />
                <SidebarItem icon={BarChart2} label="Analytics" to="/reports" active={location.pathname === '/reports'} />
              </div>
            </div>
          </nav>

          <div className="p-4 mt-auto border-t border-[var(--border)] space-y-2">
            <div className="group relative">
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-[var(--border)] hover:border-[var(--primary)] transition-all overflow-hidden">
                    <img src={currentUser.avatar} className="w-10 h-10 rounded-xl shadow-sm border border-white dark:border-slate-800" />
                    <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-black truncate">{currentUser.name}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter truncate">{userRoleInWorkspace}</p>
                    </div>
                </button>
                <div className="absolute bottom-full left-0 right-0 mb-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all pointer-events-none group-hover:pointer-events-auto">
                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[32px] shadow-2xl p-2 space-y-1 overflow-hidden">
                        <Link to="/settings" className="flex items-center gap-3 p-3 rounded-2xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
                            <Settings2 className="w-4 h-4 text-slate-400" /> Preferences
                        </Link>
                        <button onClick={logout} className="w-full flex items-center gap-3 p-3 rounded-2xl text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all">
                            <LogOut className="w-4 h-4" /> Secure Logout
                        </button>
                    </div>
                </div>
            </div>
          </div>
        </motion.aside>
      )}

      <main className="flex-1 flex flex-col overflow-hidden w-full">
        <header className="h-16 glass sticky top-0 border-b border-[var(--border)] flex items-center justify-between px-6 shrink-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            {!isFocusMode && (
              <button className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors" onClick={() => setIsSidebarOpen(true)}>
                <Menu className="w-5 h-5" />
              </button>
            )}
            <div className="relative max-w-lg w-full hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Jump to anywhere..." className="w-full pl-10 pr-12 py-2 bg-slate-100 dark:bg-slate-900/50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-[var(--primary)]/20 outline-none" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsFocusMode(!isFocusMode)} className="p-2 text-slate-400 hover:text-[var(--primary)] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
              {isFocusMode ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsCreateModalOpen(true)} className="bg-[var(--primary)] text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[var(--primary)]/25">
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline">New Task</span>
            </button>
            <div className="w-px h-6 bg-[var(--border)] mx-1" />
            <button className="relative p-2 text-slate-400 hover:text-[var(--primary)] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </header>

        <section className="flex-1 overflow-auto custom-scrollbar relative">
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="h-full">
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
