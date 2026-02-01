
import React, { useState, useMemo } from 'react';
import { useApp } from '../store';
import { WikiPage } from '../types';
import { 
  FileText, 
  Plus, 
  Search, 
  ChevronRight, 
  Edit3, 
  Save, 
  Trash2, 
  ChevronLeft,
  BookOpen,
  ArrowRight,
  Clock,
  User
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const WikiView: React.FC = () => {
  const { projectId } = useParams();
  const { wikiPages, createWikiPage, updateWikiPage, currentUser } = useApp();
  
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState('');
  const [showMobileList, setShowMobileList] = useState(true);

  const filteredPages = useMemo(() => {
    return wikiPages.filter(p => {
      const matchesContext = projectId ? p.projectId === projectId : true;
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
      return matchesContext && matchesSearch;
    });
  }, [wikiPages, projectId, search]);

  const selectedPage = filteredPages.find(p => p.id === selectedPageId) || filteredPages[0];

  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  React.useEffect(() => {
    if (selectedPage) {
      setEditTitle(selectedPage.title);
      setEditContent(selectedPage.content);
      setSelectedPageId(selectedPage.id);
    }
  }, [selectedPage]);

  const handleCreatePage = () => {
    const newPage: Partial<WikiPage> = {
      title: 'Untitled Guide',
      content: '',
      projectId: projectId || 'w1',
      updatedBy: currentUser.id,
    };
    createWikiPage(newPage);
    setIsEditing(true);
    setShowMobileList(false);
  };

  const handleSave = () => {
    if (selectedPage) {
      updateWikiPage(selectedPage.id, {
        title: editTitle,
        content: editContent,
      });
      setIsEditing(false);
    }
  };

  const selectPage = (id: string) => {
    setSelectedPageId(id);
    setShowMobileList(false);
    setIsEditing(false);
  };

  return (
    <div className="flex h-full bg-[var(--surface)] overflow-hidden relative">
      {/* Wiki Sidebar */}
      <aside className={`
        absolute inset-y-0 left-0 w-80 border-r border-[var(--border)] bg-slate-50/50 dark:bg-slate-950/20 flex flex-col z-20 transition-transform duration-300 lg:static lg:translate-x-0
        ${showMobileList ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-[var(--text)] flex items-center gap-3 tracking-tight">
              <BookOpen className="w-6 h-6 text-[var(--primary)]" />
              Library
            </h2>
            <button 
              onClick={handleCreatePage}
              className="p-2 bg-[var(--primary)] text-white rounded-xl hover:brightness-110 transition-all shadow-lg shadow-[var(--primary)]/20"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs font-bold focus:ring-2 focus:ring-[var(--primary)]/10 outline-none shadow-sm"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 pb-8 custom-scrollbar space-y-1">
          {filteredPages.length > 0 ? (
            filteredPages.map(page => (
              <button
                key={page.id}
                onClick={() => selectPage(page.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group ${
                  selectedPageId === page.id 
                    ? 'bg-[var(--surface)] text-[var(--primary)] shadow-sm border border-[var(--border)]' 
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <FileText className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${selectedPageId === page.id ? 'text-[var(--primary)]' : 'text-slate-400'}`} />
                <span className="truncate flex-1 text-left tracking-tight">{page.title}</span>
              </button>
            ))
          ) : (
            <div className="p-12 text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nothing found</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[var(--surface)] relative">
        <AnimatePresence mode="wait">
          {selectedPage ? (
            <motion.div 
              key={selectedPage.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex flex-col h-full"
            >
              <header className="h-20 border-b border-[var(--border)] flex items-center justify-between px-8 lg:px-12 shrink-0 glass sticky top-0 z-10">
                <div className="flex items-center gap-4 min-w-0">
                  <button onClick={() => setShowMobileList(true)} className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-xl">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span className="hover:text-[var(--primary)] cursor-pointer">Project Wiki</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-[var(--text)] truncate">{selectedPage.title}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {isEditing ? (
                    <button 
                      onClick={handleSave}
                      className="flex items-center gap-2 bg-[var(--primary)] text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-[var(--primary)]/20 hover:brightness-110 transition-all"
                    >
                      <Save className="w-4 h-4" /> Save
                    </button>
                  ) : (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                    >
                      <Edit3 className="w-4 h-4" /> Edit
                    </button>
                  )}
                  <button className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-4xl mx-auto px-8 lg:px-12 py-16 space-y-12">
                  {isEditing ? (
                    <div className="space-y-8">
                      <input 
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Page Title"
                        className="w-full text-5xl font-black text-[var(--text)] border-none p-0 focus:ring-0 placeholder:text-slate-100 dark:placeholder:text-slate-900 outline-none tracking-tight"
                      />
                      <textarea 
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        placeholder="Start typing your mission brief..."
                        className="w-full h-[60vh] text-lg text-slate-600 dark:text-slate-400 border-none p-0 focus:ring-0 placeholder:text-slate-100 outline-none resize-none font-medium leading-relaxed"
                      />
                    </div>
                  ) : (
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <h1 className="text-5xl font-black text-[var(--text)] mb-10 tracking-tight leading-tight">{selectedPage.title}</h1>
                      <div className="text-lg text-slate-600 dark:text-slate-400 leading-loose whitespace-pre-wrap font-medium">
                        {selectedPage.content || (
                          <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed border-[var(--border)] rounded-[40px] text-slate-300">
                            <BookOpen className="w-16 h-16 mb-6 opacity-20" />
                            <p className="text-sm font-black uppercase tracking-widest">Document Empty</p>
                            <button onClick={() => setIsEditing(true)} className="mt-6 text-xs font-black text-[var(--primary)] uppercase tracking-widest hover:underline">Begin writing</button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-16 border-t border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Admin`} className="w-10 h-10 rounded-xl border-2 border-white shadow-sm" />
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authored by</p>
                        <p className="text-sm font-black text-[var(--text)]">Aslam Admin</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-end">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Clock className="w-3 h-3" /> Last Synced
                        </p>
                        <p className="text-sm font-black text-slate-600">{new Date(selectedPage.updatedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-8"
            >
              <div className="w-32 h-32 bg-slate-50 dark:bg-slate-900 rounded-[48px] flex items-center justify-center shadow-inner relative overflow-hidden group">
                <BookOpen className="w-12 h-12 text-[var(--primary)] opacity-20 transition-transform group-hover:scale-110" />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-4 border-dashed border-[var(--primary)]/5 rounded-full"
                />
              </div>
              <div>
                <h2 className="text-3xl font-black tracking-tight">The Knowledge Base</h2>
                <p className="text-slate-500 font-medium max-w-sm mt-3">
                  Centralize your team's intelligence. Technical specs, playbooks, and strategy docs start here.
                </p>
              </div>
              <button 
                onClick={handleCreatePage}
                className="bg-[var(--primary)] text-white px-10 py-4 rounded-2xl text-sm font-black uppercase tracking-widest shadow-2xl shadow-[var(--primary)]/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-3"
              >
                <Plus className="w-5 h-5" />
                New Entry
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WikiView;
