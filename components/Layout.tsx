
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  CheckSquare, 
  Calendar, 
  BarChart2, 
  Clock, 
  FileText, 
  Settings, 
  Plus, 
  Search, 
  Bell, 
  Users,
  Hash,
  Menu,
  X,
  Briefcase,
  Command,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useApp } from '../store';
import { Link, useLocation } from 'react-router-dom';
import CreateTaskModal from './CreateTaskModal';
import CreateProjectModal from './CreateProjectModal';
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
      <motion.div 
        layoutId="sidebar-active"
        className="absolute inset-0 bg-[var(--primary)] rounded-xl -z-10"
      />
    )}
  </Link>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { workspace, currentUser, notifications, projects } = useApp();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className={`flex h-screen overflow-hidden relative bg-[var(--bg)] text-[var(--text)]`}>
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-40 lg:hidden"
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      {!isFocusMode && (
        <motion.aside 
          initial={false}
          animate={{ x: isSidebarOpen ? 0 : (window.innerWidth < 1024 ? -256 : 0) }}
          className={`
            fixed lg:static inset-y-0 left-0 w-64 border-r border-[var(--border)] bg-[var(--surface)] flex flex-col shrink-0 z-50 transition-transform lg:translate-x-0
          `}
        >
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--primary)] rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-[var(--primary)]/30">
                A
              </div>
              <div>
                <h1 className="text-sm font-extrabold tracking-tight truncate w-32">{workspace.name}</h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest opacity-60">PRO</p>
              </div>
            </div>
            <button className="lg:hidden p-2 text-slate-400 hover:text-slate-600 transition-colors" onClick={closeSidebar}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-8 custom-scrollbar">
            <div className="space-y-1">
              <SidebarItem icon={LayoutDashboard} label="Overview" to="/" active={location.pathname === '/'} onClick={closeSidebar} />
              <SidebarItem icon={CheckSquare} label="My Work" to="/my-tasks" active={location.pathname === '/my-tasks'} onClick={closeSidebar} />
              <SidebarItem icon={Briefcase} label="Projects" to="/projects" active={location.pathname === '/projects'} onClick={closeSidebar} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3 px-4">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest opacity-70">Starred</span>
                <button 
                  onClick={(e) => { e.preventDefault(); setIsProjectModalOpen(true); }}
                  className="text-slate-400 hover:text-[var(--primary)] p-1 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1">
                {projects.slice(0, 4).map(project => (
                  <Link 
                    key={project.id} 
                    to={`/projects/${project.id}`}
                    onClick={closeSidebar}
                    className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${location.pathname.includes(project.id) ? 'bg-slate-100 dark:bg-slate-800 text-[var(--primary)]' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                  >
                    <Hash className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{project.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 px-4">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest opacity-70">Workspace</span>
              </div>
              <div className="space-y-1">
                <SidebarItem icon={Users} label="People" to="/team" active={location.pathname === '/team'} onClick={closeSidebar} />
                <SidebarItem icon={FileText} label="Library" to="/wiki" active={location.pathname === '/wiki'} onClick={closeSidebar} />
                <SidebarItem icon={Clock} label="Timeline" to="/time" active={location.pathname === '/time'} onClick={closeSidebar} />
                <SidebarItem icon={BarChart2} label="Analytics" to="/reports" active={location.pathname === '/reports'} onClick={closeSidebar} />
              </div>
            </div>
          </nav>

          <div className="p-4 mt-auto border-t border-[var(--border)]">
            <SidebarItem icon={Settings} label="Preferences" to="/settings" active={location.pathname === '/settings'} onClick={closeSidebar} />
            <div className="mt-4 flex items-center gap-3 px-3 py-2 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl border border-[var(--border)]">
              <img src={currentUser.avatar} alt={currentUser.name} className="w-9 h-9 rounded-xl shadow-sm border border-white dark:border-slate-800" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{currentUser.name}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter truncate">{currentUser.role}</p>
              </div>
            </div>
          </div>
        </motion.aside>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Topbar */}
        <header className="h-16 glass sticky top-0 border-b border-[var(--border)] flex items-center justify-between px-6 shrink-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            {!isFocusMode && (
              <button 
                className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                onClick={toggleSidebar}
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <div className="relative max-w-lg w-full hidden sm:block">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                <Search className="w-4 h-4 text-slate-400" />
              </div>
              <input 
                type="text" 
                placeholder="Jump to project, task or wiki..."
                className="w-full pl-10 pr-12 py-2 bg-slate-100 dark:bg-slate-900/50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-[var(--primary)]/20 transition-all outline-none"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <span className="px-1.5 py-0.5 rounded-md bg-[var(--surface)] text-[10px] font-bold border border-[var(--border)] text-slate-400 shadow-sm">⌘</span>
                <span className="px-1.5 py-0.5 rounded-md bg-[var(--surface)] text-[10px] font-bold border border-[var(--border)] text-slate-400 shadow-sm">K</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsFocusMode(!isFocusMode)}
              className="p-2 text-slate-400 hover:text-[var(--primary)] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              title="Focus Mode"
            >
              {isFocusMode ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-[var(--primary)] text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[var(--primary)]/25"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline">New Task</span>
            </button>
            <div className="w-px h-6 bg-[var(--border)] mx-1" />
            <button className="relative p-2 text-slate-400 hover:text-[var(--primary)] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 border-2 border-[var(--surface)] rounded-full animate-pulse shadow-sm"></span>
              )}
            </button>
          </div>
        </header>

        <section className="flex-1 overflow-auto custom-scrollbar relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>

      {/* Floating Action Menu for mobile */}
      <motion.button 
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed bottom-8 right-8 lg:hidden w-16 h-16 bg-[var(--primary)] text-white rounded-2xl shadow-2xl flex items-center justify-center z-40"
      >
        <Plus className="w-8 h-8" />
      </motion.button>

      {/* Modals */}
      <CreateTaskModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      <CreateProjectModal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} />
    </div>
  );
};

export default Layout;
