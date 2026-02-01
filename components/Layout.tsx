
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
  ChevronDown,
  Users,
  Box,
  Hash,
  Menu,
  X,
  Briefcase
} from 'lucide-react';
import { useApp } from '../store';
import { Link, useLocation } from 'react-router-dom';
import CreateTaskModal from './CreateTaskModal';
import CreateProjectModal from './CreateProjectModal';

const SidebarItem: React.FC<{ icon: any; label: string; to: string; active?: boolean; onClick?: () => void }> = ({ icon: Icon, label, to, active, onClick }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${active ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
  >
    <Icon className="w-5 h-5" />
    <span className="text-sm font-medium">{label}</span>
  </Link>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { workspace, currentUser, notifications, projects } = useApp();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 w-64 border-r border-slate-200 bg-white flex flex-col shrink-0 z-50 transition-transform duration-300 lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-4 border-bottom flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold">
              A
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 truncate w-32">{workspace.name}</h1>
              <p className="text-[10px] text-slate-500 font-medium tracking-tight">Enterprise Plan</p>
            </div>
          </div>
          <button className="lg:hidden p-1 text-slate-400" onClick={closeSidebar}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          <div className="space-y-1">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/" active={location.pathname === '/'} onClick={closeSidebar} />
            <SidebarItem icon={CheckSquare} label="My Tasks" to="/my-tasks" active={location.pathname === '/my-tasks'} onClick={closeSidebar} />
            <SidebarItem icon={Briefcase} label="All Projects" to="/projects" active={location.pathname === '/projects'} onClick={closeSidebar} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2 px-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recent Projects</span>
              <button 
                onClick={(e) => { e.preventDefault(); setIsProjectModalOpen(true); }}
                className="text-slate-400 hover:text-indigo-600 p-1"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-1">
              {projects.slice(0, 5).map(project => (
                <Link 
                  key={project.id} 
                  to={`/projects/${project.id}`}
                  onClick={closeSidebar}
                  className={`flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm transition-colors ${location.pathname.includes(project.id) ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Hash className="w-4 h-4 text-slate-400" />
                  {project.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 px-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Workspace</span>
            </div>
            <div className="space-y-1">
              <SidebarItem icon={Users} label="Team" to="/team" active={location.pathname === '/team'} onClick={closeSidebar} />
              <SidebarItem icon={FileText} label="Wiki" to="/wiki" active={location.pathname === '/wiki'} onClick={closeSidebar} />
              <SidebarItem icon={Clock} label="Timesheets" to="/time" active={location.pathname === '/time'} onClick={closeSidebar} />
              <SidebarItem icon={BarChart2} label="Reports" to="/reports" active={location.pathname === '/reports'} onClick={closeSidebar} />
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <SidebarItem icon={Settings} label="Settings" to="/settings" active={location.pathname === '/settings'} onClick={closeSidebar} />
          <div className="mt-4 flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full bg-slate-200" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{currentUser.name}</p>
              <p className="text-xs text-slate-500 truncate capitalize">{currentUser.role.toLowerCase()}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Topbar */}
        <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-3 flex-1">
            <button 
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
              onClick={toggleSidebar}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative max-w-md w-full hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search anything (Cmd + K)"
                className="w-full pl-10 pr-4 py-1.5 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 lg:gap-4">
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline">Create</span>
            </button>
            <div className="hidden lg:block w-px h-6 bg-slate-200" />
            <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-lg">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
              )}
            </button>
          </div>
        </header>

        <section className="flex-1 overflow-auto custom-scrollbar">
          {children}
        </section>
      </main>

      {/* Responsive FAB for mobile */}
      <button 
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed bottom-6 right-6 lg:hidden w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Modals */}
      <CreateTaskModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      <CreateProjectModal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} />
    </div>
  );
};

const NotificationsIcon = ({ className }: { className?: string }) => <div className={className}><Bell className="w-5 h-5" /></div>;

export default Layout;
