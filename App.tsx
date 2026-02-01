
import React from 'react';
import { HashRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { AppProvider } from './store';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import KanbanView from './views/KanbanView';
import MyTasks from './views/MyTasks';
import ProjectsDirectory from './views/ProjectsDirectory';
import ProjectSettings from './views/ProjectSettings';
import WikiView from './views/WikiView';
import BacklogView from './views/BacklogView';
import SettingsView from './views/SettingsView';
import MembersSettings from './views/MembersSettings';
import WorkspaceSettings from './views/WorkspaceSettings';
import BillingView from './views/BillingView';
import ProjectHeader from './components/ProjectHeader';
import { useApp } from './store';

const ProjectPage: React.FC = () => {
  const { projectId } = useParams();
  const { projects } = useApp();
  const project = projects.find(p => p.id === projectId);

  if (!project) return <div className="p-8 text-slate-500 font-bold uppercase tracking-widest text-xs text-center">Unauthorized: Project Access Denied</div>;

  return (
    <div className="flex flex-col h-full bg-[var(--bg)]">
      <ProjectHeader project={project} />
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <Routes>
          <Route index element={<KanbanView projectId={project.id} />} />
          <Route path="backlog" element={<BacklogView projectId={project.id} />} />
          <Route path="list" element={<div className="p-12 text-center text-slate-400 font-black uppercase tracking-widest text-xs">Module under encryption...</div>} />
          <Route path="calendar" element={<div className="p-12 text-center text-slate-400 font-black uppercase tracking-widest text-xs">Module under encryption...</div>} />
          <Route path="wiki" element={<WikiView />} />
          <Route path="settings" element={<ProjectSettings project={project} />} />
        </Routes>
      </div>
    </div>
  );
};

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="p-8 lg:p-12 max-w-7xl mx-auto">
    <h1 className="text-3xl font-black text-[var(--text)] tracking-tight">{title}</h1>
    <div className="mt-12 border-2 border-dashed border-[var(--border)] rounded-[48px] h-[500px] flex items-center justify-center text-slate-400 flex-col gap-6 bg-[var(--surface)]/50">
      <div className="w-24 h-24 bg-[var(--surface)] rounded-[32px] flex items-center justify-center shadow-xl border border-[var(--border)]">
        <span className="text-4xl font-black text-[var(--primary)] opacity-40">?</span>
      </div>
      <div className="text-center max-w-sm">
        <p className="text-lg font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">Accessing Secured Module</p>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">Connecting to engineering nodes...</p>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<ProjectsDirectory />} />
            <Route path="/projects/:projectId/*" element={<ProjectPage />} />
            <Route path="/my-tasks" element={<MyTasks />} />
            <Route path="/team" element={<PlaceholderPage title="Team Directory" />} />
            <Route path="/settings/members" element={<MembersSettings />} />
            <Route path="/settings/workspace" element={<WorkspaceSettings />} />
            <Route path="/settings/billing" element={<BillingView />} />
            <Route path="/wiki" element={<WikiView />} />
            <Route path="/time" element={<PlaceholderPage title="Timeline Tracking" />} />
            <Route path="/reports" element={<PlaceholderPage title="Intelligent Reports" />} />
            <Route path="/settings" element={<SettingsView />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
};

export default App;
