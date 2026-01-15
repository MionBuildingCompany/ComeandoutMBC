import React from 'react';
import { LayoutDashboard, Users, History, LogOut, FileBarChart } from 'lucide-react';
import { ViewState } from '../../types';

interface TabsProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  onLogout: () => void;
  isAdmin: boolean;
}

export const Tabs: React.FC<TabsProps> = ({ currentView, setView, onLogout, isAdmin }) => {
  
  const NavItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => {
    const isActive = currentView === view;
    return (
      <button 
        onClick={() => setView(view)} 
        className={`relative flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 group`}
      >
        {/* Active Top Indicator */}
        {isActive && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[3px] bg-red-600 rounded-b-full shadow-[0_0_15px_rgba(220,38,38,0.6)]" />
        )}

        <div className={`mb-1 transition-all duration-300 ${isActive ? 'text-white -translate-y-1' : 'text-zinc-600 group-hover:text-zinc-400'}`}>
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
        </div>
        <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-white' : 'text-zinc-600'}`}>
            {label}
        </span>
      </button>
    );
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a] border-t border-white/10 h-[84px] pb-5 pt-1">
        <div className="flex items-center justify-between h-full px-2">
            <NavItem view="dashboard" icon={LayoutDashboard} label="Záznam" />
            
            {isAdmin && (
                <>
                    <NavItem view="reports" icon={FileBarChart} label="Reporty" />
                    <NavItem view="manage" icon={Users} label="Správa" />
                </>
            )}

            <NavItem view="history" icon={History} label="História" />
            
            <button 
                onClick={onLogout} 
                className="flex flex-col items-center justify-center flex-1 h-full text-zinc-600 hover:text-red-600 transition-colors group"
            >
                <div className="mb-1 group-hover:scale-110 transition-transform">
                    <LogOut size={24} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest">Odhlásiť</span>
            </button>
        </div>
    </div>
  );
};