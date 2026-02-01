
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
import ProjectHeader from './components/ProjectHeader';
import { useApp } from './store';

const ProjectPage: React.FC = () => {
  const { projectId } = useParams();
  const { projects } = useApp();
  const project = projects.find(p => p.id === projectId);

  if (!project) return <div className="p-8 text-slate-500">Project not found</div>;

  return (
    <div className="flex flex-col h-full bg-[var(--bg)]">
      <ProjectHeader project={project} />
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <Routes>
          <Route index element={<KanbanView projectId={project.id} />} />
          <Route path="backlog" element={<BacklogView projectId={project.id} />} />
          <Route path="list" element={<div className="p-12 text-center text-slate-400 font-medium">List View is coming soon to your workspace.</div>} />
          <Route path="calendar" element={<div className="p-12 text-center text-slate-400 font-medium">Calendar View is coming soon to your workspace.</div>} />
          <Route path="wiki" element={<WikiView />} />
          <Route path="settings" element={<ProjectSettings project={project} />} />
        </Routes>
      </div>
    </div>
  );
};

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="p-8 lg:p-12 max-w-7xl mx-auto">
    <h1 className="text-3xl font-extrabold text-[var(--text)] tracking-tight">{title}</h1>
    <div className="mt-12 border-2 border-dashed border-[var(--border)] rounded-[40px] h-[500px] flex items-center justify-center text-slate-400 flex-col gap-6 bg-[var(--surface)]/50">
      <div className="w-24 h-24 bg-[var(--surface)] rounded-3xl flex items-center justify-center shadow-xl border border-[var(--border)]">
        <span className="text-4xl font-black text-[var(--primary)] opacity-40">?</span>
      </div>
      <div className="text-center max-w-sm">
        <p className="text-lg font-bold text-slate-900 dark:text-slate-100">Work in Progress</p>
        <p className="text-sm font-medium text-slate-500">Our team is actively building out the {title} module. Check back soon!</p>
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
            <Route path="/inbox" element={<PlaceholderPage title="Inbox" />} />
            <Route path="/team" element={<PlaceholderPage title="Team Directory" />} />
            <Route path="/wiki" element={<WikiView />} />
            <Route path="/time" element={<PlaceholderPage title="Timesheets" />} />
            <Route path="/reports" element={<PlaceholderPage title="Reports" />} />
            <Route path="/settings" element={<SettingsView />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
};

export default App;
