
import React from 'react';
import { HashRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { AppProvider } from './store';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import KanbanView from './views/KanbanView';
import ListView from './views/ListView';
import CalendarView from './views/CalendarView';
import MyTasks from './views/MyTasks';
import ProjectsDirectory from './views/ProjectsDirectory';
import ProjectSettings from './views/ProjectSettings';
import WikiView from './views/WikiView';
import BacklogView from './views/BacklogView';
import SettingsView from './views/SettingsView';
import MembersSettings from './views/MembersSettings';
import WorkspaceSettings from './views/WorkspaceSettings';
import BillingView from './views/BillingView';
import ReportsView from './views/ReportsView';
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
          <Route path="list" element={<ListView projectId={project.id} />} />
          <Route path="calendar" element={<CalendarView projectId={project.id} />} />
          <Route path="wiki" element={<WikiView />} />
          <Route path="settings" element={<ProjectSettings project={project} />} />
        </Routes>
      </div>
    </div>
  );
};

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
            <Route path="/settings/members" element={<MembersSettings />} />
            <Route path="/settings/workspace" element={<WorkspaceSettings />} />
            <Route path="/settings/billing" element={<BillingView />} />
            <Route path="/wiki" element={<WikiView />} />
            <Route path="/reports" element={<ReportsView />} />
            <Route path="/settings" element={<SettingsView />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
};

export default App;
