
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
  MoreVertical,
  ChevronLeft,
  BookOpen,
  X
} from 'lucide-react';
import { useParams } from 'react-router-dom';

const WikiView: React.FC = () => {
  const { projectId } = useParams();
  const { wikiPages, createWikiPage, updateWikiPage, currentUser } = useApp();
  
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState('');
  const [showMobileList, setShowMobileList] = useState(true);

  // Filter pages based on project context if applicable
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
      title: 'Untitled Page',
      content: '',
      projectId: projectId || 'w1', // Default to workspace or current project
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
    <div className="flex h-full bg-white overflow-hidden relative">
      {/* Wiki Sidebar */}
      <aside className={`
        absolute inset-y-0 left-0 w-72 border-r border-slate-200 bg-slate-50 flex flex-col z-20 transition-transform duration-300 lg:static lg:translate-x-0
        ${showMobileList ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-4 border-b border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              Wiki Pages
            </h2>
            <button 
              onClick={handleCreatePage}
              className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search pages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
          {filteredPages.length > 0 ? (
            <div className="space-y-0.5">
              {filteredPages.map(page => (
                <button
                  key={page.id}
                  onClick={() => selectPage(page.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                    selectedPageId === page.id 
                      ? 'bg-indigo-50 text-indigo-700 font-semibold' 
                      : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
                  }`}
                >
                  <FileText className={`w-4 h-4 ${selectedPageId === page.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span className="truncate flex-1 text-left">{page.title}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-xs text-slate-400 italic">No pages found</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-white relative">
        {selectedPage ? (
          <>
            {/* Header */}
            <header className="h-14 border-b border-slate-100 flex items-center justify-between px-4 lg:px-8 shrink-0">
              <div className="flex items-center gap-4 min-w-0">
                <button 
                  onClick={() => setShowMobileList(true)}
                  className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-50 rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                  <span className="hover:text-slate-600 cursor-pointer">Wiki</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-slate-900 font-bold truncate">{selectedPage.title}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-200 transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                )}
                <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </header>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-12 custom-scrollbar">
              <div className="max-w-3xl mx-auto space-y-6">
                {isEditing ? (
                  <div className="space-y-6">
                    <input 
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Page Title"
                      className="w-full text-4xl font-extrabold text-slate-900 border-none p-0 focus:ring-0 placeholder:text-slate-200 outline-none"
                    />
                    <textarea 
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      placeholder="Start writing in markdown..."
                      className="w-full h-[60vh] text-lg text-slate-600 border-none p-0 focus:ring-0 placeholder:text-slate-200 outline-none resize-none font-mono"
                    />
                  </div>
                ) : (
                  <div className="prose prose-slate max-w-none">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-8">{selectedPage.title}</h1>
                    <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {selectedPage.content || (
                        <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl text-slate-400">
                          <BookOpen className="w-12 h-12 mb-4 opacity-20" />
                          <p className="text-sm font-medium">This page is empty</p>
                          <button 
                            onClick={() => setIsEditing(true)}
                            className="mt-4 text-xs font-bold text-indigo-600 hover:underline"
                          >
                            Add some content
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="pt-12 border-t border-slate-100 mt-12">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                      AA
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Last updated by <span className="font-bold text-slate-900">Aslam Admin</span></p>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">{new Date(selectedPage.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <BookOpen className="w-10 h-10 text-slate-200" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Welcome to Workspace Wiki</h2>
            <p className="text-slate-500 max-w-sm mt-2 mb-8">
              Store internal documentation, product specs, and team guides in one place.
            </p>
            <button 
              onClick={handleCreatePage}
              className="bg-indigo-600 text-white px-8 py-3 rounded-2xl text-sm font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create First Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WikiView;
