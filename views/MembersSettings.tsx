
import React, { useState, useMemo } from 'react';
import { useApp } from '../store';
import { UserRole, MembershipStatus } from '../types';
import { Users, Mail, Shield, ShieldCheck, Trash2, Plus, Zap, UserPlus, CheckCircle2, UserMinus, UserCheck, MoreHorizontal, Search, Filter, Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MembersSettings: React.FC = () => {
  const { users, memberships, invites, currentWorkspaceId, updateMemberRole, updateMemberStatus, removeMember, bulkUpdateMembers, inviteUser, can, plans } = useApp();
  
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('MEMBER');
  
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const workspaceMembers = useMemo(() => {
    return memberships
      .filter(m => m.workspaceId === currentWorkspaceId)
      .map(m => ({ ...m, user: users.find(u => u.id === m.userId)! }))
      .filter(m => {
        const matchesSearch = m.user.name.toLowerCase().includes(search.toLowerCase()) || m.user.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === 'ALL' || m.role === roleFilter;
        return matchesSearch && matchesRole;
      });
  }, [memberships, users, currentWorkspaceId, search, roleFilter]);

  const pendingInvites = invites.filter(i => i.workspaceId === currentWorkspaceId && i.status === 'PENDING');
  const plan = plans.find(p => p.workspaceId === currentWorkspaceId);

  const handleExportCSV = () => {
    const headers = 'Name,Email,Role,Status,JoinedAt\n';
    const rows = workspaceMembers.map(m => `${m.user.name},${m.user.email},${m.role},${m.status},${m.joinedAt}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `members-${currentWorkspaceId}.csv`;
    a.click();
  };

  const toggleUserSelection = (id: string) => {
    setSelectedUsers(prev => prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]);
  };

  const handleBulkSuspend = () => {
    bulkUpdateMembers(selectedUsers, { status: 'SUSPENDED' });
    setSelectedUsers([]);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    inviteUser(inviteEmail, inviteRole);
    setInviteEmail('');
    setShowInviteModal(false);
  };

  const RoleIcon = ({ role }: { role: UserRole }) => {
    switch (role) {
      case 'OWNER': return <ShieldCheck className="w-4 h-4 text-[var(--primary)]" />;
      case 'ADMIN': return <Shield className="w-4 h-4 text-indigo-500" />;
      case 'MEMBER': return <Zap className="w-4 h-4 text-emerald-500" />;
      default: return <Users className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto space-y-12 pb-32">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-[10px] font-black rounded-full uppercase tracking-widest">Directory</div>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-[var(--text)]">Organization Team</h1>
          <p className="text-slate-500 font-medium">Control access levels, invite collaborators, and manage active seats.</p>
        </div>
        <div className="flex gap-3">
            <button onClick={handleExportCSV} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:brightness-95 transition-all">
                <Download className="w-4 h-4" /> Export CSV
            </button>
            <button onClick={() => setShowInviteModal(true)} className="bg-[var(--primary)] text-white px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-widest shadow-2xl shadow-[var(--primary)]/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-3">
                <UserPlus className="w-5 h-5" /> Invite User
            </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-lg">
            <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search members..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-2xl text-xs font-bold focus:ring-4 focus:ring-[var(--primary)]/10 outline-none" />
            </div>
            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value as any)} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl px-4 py-3 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer">
                <option value="ALL">All Roles</option>
                <option value="OWNER">Owner</option>
                <option value="ADMIN">Admin</option>
                <option value="MEMBER">Member</option>
                <option value="VIEWER">Viewer</option>
            </select>
        </div>
        {selectedUsers.length > 0 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 bg-[var(--primary)]/5 p-2 rounded-2xl border border-[var(--primary)]/20">
                <span className="text-[10px] font-black text-[var(--primary)] px-2">{selectedUsers.length} Selected</span>
                <button onClick={handleBulkSuspend} className="text-[9px] font-black bg-rose-500 text-white px-3 py-1.5 rounded-xl uppercase tracking-widest">Suspend</button>
                <button onClick={() => setSelectedUsers([])} className="p-1.5 text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
            </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[40px] overflow-hidden shadow-sm">
            <div className="p-8 border-b border-[var(--border)] flex items-center justify-between bg-slate-50/20 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <div className="flex items-center gap-6">
                <input type="checkbox" checked={selectedUsers.length === workspaceMembers.length} onChange={() => setSelectedUsers(selectedUsers.length === workspaceMembers.length ? [] : workspaceMembers.map(m => m.userId))} className="w-4 h-4 rounded border-slate-300" />
                <span>Seat Details</span>
              </div>
              <span>Authority & Status</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {workspaceMembers.map(member => (
                <div key={member.userId} className={`p-6 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors ${member.status === 'SUSPENDED' ? 'opacity-60 bg-slate-50/50' : ''}`}>
                  <div className="flex items-center gap-6">
                    <input type="checkbox" checked={selectedUsers.includes(member.userId)} onChange={() => toggleUserSelection(member.userId)} className="w-4 h-4 rounded border-slate-300" />
                    <div className="flex items-center gap-4">
                        <img src={member.user.avatar} className="w-12 h-12 rounded-2xl shadow-sm border-2 border-white dark:border-slate-800" />
                        <div>
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-black text-[var(--text)]">{member.user.name}</p>
                            {member.status === 'SUSPENDED' && <span className="text-[8px] font-black bg-rose-100 text-rose-600 px-2 py-0.5 rounded uppercase">Suspended</span>}
                        </div>
                        <p className="text-xs text-slate-500 font-medium">{member.user.email}</p>
                        </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-2 mb-1">
                        <RoleIcon role={member.role} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">{member.role}</span>
                      </div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Joined {new Date(member.joinedAt).toLocaleDateString()}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        {can('MANAGE_ROLES') && (
                            <select value={member.role} onChange={(e) => updateMemberRole(member.userId, e.target.value as UserRole)} className="bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-[10px] font-black uppercase tracking-widest px-3 py-2 outline-none cursor-pointer">
                                <option value="OWNER">Owner</option>
                                <option value="ADMIN">Admin</option>
                                <option value="MEMBER">Member</option>
                                <option value="VIEWER">Viewer</option>
                            </select>
                        )}
                        <div className="relative group/actions">
                           <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"><MoreHorizontal className="w-4 h-4" /></button>
                           <div className="absolute right-0 bottom-full mb-2 opacity-0 group-hover/actions:opacity-100 translate-y-2 group-hover/actions:translate-y-0 transition-all pointer-events-none group-hover/actions:pointer-events-auto z-50">
                              <div className="bg-white dark:bg-slate-800 border border-[var(--border)] rounded-2xl shadow-2xl p-2 w-48 space-y-1">
                                 <button onClick={() => updateMemberStatus(member.userId, member.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED')} className="w-full flex items-center gap-3 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-amber-500 hover:bg-amber-50 rounded-xl transition-all">
                                      {member.status === 'SUSPENDED' ? <UserCheck className="w-4 h-4" /> : <UserMinus className="w-4 h-4" />} {member.status === 'SUSPENDED' ? 'Unsuspend' : 'Suspend'}
                                 </button>
                                 <button onClick={() => removeMember(member.userId)} className="w-full flex items-center gap-3 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                                    <Trash2 className="w-4 h-4" /> Remove Seats
                                 </button>
                              </div>
                           </div>
                        </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-[var(--surface)] p-8 rounded-[40px] border border-[var(--border)] shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black tracking-tight">Active Plan</h3>
                <Zap className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-[var(--border)]">
                    <span className="text-[10px] font-black uppercase text-slate-400">Seats Utilized</span>
                    <span className="text-sm font-black text-[var(--primary)]">{workspaceMembers.length} / {plan?.maxMembers}</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--primary)]" style={{ width: `${(workspaceMembers.length / (plan?.maxMembers || 1)) * 100}%` }} />
                </div>
            </div>
          </div>
          <div className="bg-[var(--surface)] p-8 rounded-[40px] border border-[var(--border)] shadow-sm space-y-6">
            <h3 className="text-lg font-black tracking-tight">Pending Access</h3>
            <div className="space-y-4">
              {pendingInvites.map(invite => (
                <div key={invite.id} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-[var(--border)] flex items-center justify-between">
                  <div className="min-w-0"><p className="text-xs font-black truncate">{invite.email}</p></div>
                  <button className="text-[9px] font-black uppercase tracking-widest text-rose-500 hover:underline">Revoke</button>
                </div>
              ))}
              {pendingInvites.length === 0 && <p className="text-center py-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">No requests</p>}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowInviteModal(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-[var(--surface)] w-full max-w-md rounded-[48px] shadow-3xl overflow-hidden z-10 border border-[var(--border)]">
              <div className="p-8 border-b border-[var(--border)] text-center bg-slate-50/30">
                <h3 className="text-2xl font-black tracking-tight">Add Collaborator</h3>
                <p className="text-xs text-slate-500 font-medium">Issue a new access token to a team member.</p>
              </div>
              <form onSubmit={handleInvite} className="p-10 space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input required type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-[var(--border)] rounded-2xl text-sm font-bold focus:ring-4 focus:ring-[var(--primary)]/10 outline-none transition-all" placeholder="colleague@company.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Role</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['ADMIN', 'MEMBER', 'VIEWER'] as UserRole[]).map(role => (
                      <button key={role} type="button" onClick={() => setInviteRole(role)} className={`px-4 py-3 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${inviteRole === role ? 'border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)]' : 'border-[var(--border)] text-slate-400 hover:border-slate-300'}`}>
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
                <button className="w-full py-4 bg-[var(--primary)] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl shadow-[var(--primary)]/20 hover:brightness-110 active:scale-95 transition-all">Send Invitation</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MembersSettings;
