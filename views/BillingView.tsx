
import React from 'react';
import { useApp } from '../store';
import { Shield, Zap, Target, Users, Server, CreditCard, ChevronRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { PlanType } from '../types';

const BillingView: React.FC = () => {
  const { plans, usage, currentWorkspaceId, upgradePlan } = useApp();
  const plan = plans.find(p => p.workspaceId === currentWorkspaceId);
  const currentUsage = usage.find(u => u.workspaceId === currentWorkspaceId);

  if (!plan || !currentUsage) return null;

  const tiers: { id: PlanType; label: string; price: string; features: string[] }[] = [
    { id: 'FREE', label: 'Starter', price: '$0', features: ['Up to 5 members', '3 active projects', '1GB Storage', 'Core reporting'] },
    { id: 'PRO', label: 'Professional', price: '$12', features: ['Up to 20 members', '15 active projects', '10GB Storage', 'Advanced automations', 'Priority support'] },
    { id: 'BUSINESS', label: 'Business', price: '$39', features: ['Up to 100 members', 'Unlimited projects', '100GB Storage', 'SSO & Advanced Security', 'Custom workflows'] }
  ];

  const UsageMeter = ({ label, current, max, icon: Icon }: { label: string; current: number; max: number; icon: any }) => {
    const percentage = Math.min((current / max) * 100, 100);
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className="w-4 h-4 text-slate-400" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
          </div>
          <span className="text-xs font-black">{current} / {max}</span>
        </div>
        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} className={`h-full ${percentage > 90 ? 'bg-rose-500' : 'bg-[var(--primary)]'} transition-all`} />
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto space-y-12 pb-32">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-[10px] font-black rounded-full uppercase tracking-widest">Billing & Subscription</div>
          </div>
          <h1 className="text-4xl font-black tracking-tight">Plan Usage</h1>
          <p className="text-slate-500 font-medium">Manage your subscription tier and monitor organizational quotas.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-[var(--surface)] p-8 rounded-[40px] border border-[var(--border)] shadow-sm space-y-10">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Plan</p>
              <h2 className="text-3xl font-black text-[var(--primary)]">{plan.plan}</h2>
            </div>
            
            <div className="space-y-8">
              <UsageMeter label="Workspace Seats" current={currentUsage.membersCount} max={plan.maxMembers} icon={Users} />
              <UsageMeter label="Active Projects" current={currentUsage.projectsCount} max={plan.maxProjects} icon={Target} />
              <UsageMeter label="Cloud Storage" current={Math.round(currentUsage.storageBytes / (1024 * 1024 * 1024))} max={plan.storageQuotaGb} icon={Server} />
            </div>

            <button className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-[var(--border)] hover:border-[var(--primary)] transition-all group">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-slate-400" />
                <span className="text-xs font-black uppercase tracking-widest">Manage Cards</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
          {tiers.map(tier => (
            <div key={tier.id} className={`p-8 rounded-[40px] border-2 flex flex-col transition-all ${plan.plan === tier.id ? 'border-[var(--primary)] bg-[var(--primary)]/5' : 'border-[var(--border)] bg-[var(--surface)] hover:border-slate-300'}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black tracking-tight">{tier.label}</h3>
                {plan.plan === tier.id && <div className="px-3 py-1 bg-[var(--primary)] text-white text-[8px] font-black uppercase tracking-widest rounded-full">Current</div>}
              </div>
              <div className="mb-8">
                <span className="text-4xl font-black">{tier.price}</span>
                <span className="text-xs font-bold text-slate-400"> / month</span>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {tier.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-400">
                    <Check className="w-4 h-4 text-emerald-500" /> {f}
                  </li>
                ))}
              </ul>
              {plan.plan !== tier.id && (
                <button 
                  onClick={() => upgradePlan(tier.id as any)}
                  className="w-full py-4 bg-[var(--primary)] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[var(--primary)]/20 hover:brightness-110 active:scale-95 transition-all"
                >
                  {tier.id === 'FREE' ? 'Switch to Starter' : 'Upgrade Workspace'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BillingView;
