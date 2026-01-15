import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Management } from './components/Management';
import { Login } from './components/Login';
import { Tabs } from './components/ui/Tabs';
import { History } from './components/History';
import { Reports } from './components/Reports';
import { Site, Worker, WorkRecord, ViewState } from './types';
import { LayoutDashboard, Users, History as HistoryIcon, LogOut, FileBarChart } from 'lucide-react';

// Mock data to initialize if localStorage is empty
const INITIAL_SITES: Site[] = [
  { id: '1', name: 'Rezidencia Horský Park', address: 'Bratislava, Horská 10' },
  { id: '2', name: 'Business Centrum Nivy', address: 'Bratislava, Mlynské Nivy 5' },
];

const INITIAL_WORKERS: Worker[] = [
  { id: '1', name: 'Ján Novák', role: 'Murár' },
  { id: '2', name: 'Peter Kováč', role: 'Zvárač' },
  { id: '3', name: 'Marek Horváth', role: 'Pomocný robotník' },
];

const App: React.FC = () => {
  // State initialization with LocalStorage
  // LOGIN TEMPORARILY DISABLED/COMMENTED OUT
  // const [user, setUser] = useState<string | null>(() => localStorage.getItem('app_user'));
  const [user, setUser] = useState<string | null>('Štefan Kukučka'); // Default user for development

  const [view, setView] = useState<ViewState>('dashboard');
  
  const [sites, setSites] = useState<Site[]>(() => {
    const saved = localStorage.getItem('app_sites');
    return saved ? JSON.parse(saved) : INITIAL_SITES;
  });
  
  const [workers, setWorkers] = useState<Worker[]>(() => {
    const saved = localStorage.getItem('app_workers');
    return saved ? JSON.parse(saved) : INITIAL_WORKERS;
  });

  const [records, setRecords] = useState<WorkRecord[]>(() => {
    const saved = localStorage.getItem('app_records');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistence Effects
  useEffect(() => localStorage.setItem('app_sites', JSON.stringify(sites)), [sites]);
  useEffect(() => localStorage.setItem('app_workers', JSON.stringify(workers)), [workers]);
  useEffect(() => localStorage.setItem('app_records', JSON.stringify(records)), [records]);
  useEffect(() => {
    if (user) localStorage.setItem('app_user', user);
    else localStorage.removeItem('app_user');
  }, [user]);

  // Handlers
  const handleLogin = (name: string) => {
    setUser(name);
    setView('dashboard');
  };

  const handleLogout = () => {
    // setUser(null); // Disabled logout clearing user
    // setView('login');
    alert("Logout temporarily disabled during development");
  };

  const addRecord = (recordData: Omit<WorkRecord, 'id' | 'createdAt'>) => {
    const newRecord: WorkRecord = {
      ...recordData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setRecords(prev => [newRecord, ...prev]);
  };

  const deleteRecord = (id: string) => {
      setRecords(prev => prev.filter(r => r.id !== id));
  };

  const addSite = (name: string, address: string) => {
    const newSite: Site = { id: crypto.randomUUID(), name, address };
    setSites(prev => [...prev, newSite]);
  };

  const removeSite = (id: string) => {
    setSites(prev => prev.filter(s => s.id !== id));
  };

  const addWorker = (name: string, role: string) => {
    const newWorker: Worker = { id: crypto.randomUUID(), name, role };
    setWorkers(prev => [...prev, newWorker]);
  };

  const removeWorker = (id: string) => {
    setWorkers(prev => prev.filter(w => w.id !== id));
  };

  // Helper for Desktop Sidebar Links
  const SidebarLink = ({ targetView, icon: Icon, label }: { targetView: ViewState, icon: any, label: string }) => {
    const isActive = view === targetView;
    return (
        <button 
            onClick={() => setView(targetView)}
            className={`
                w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group relative overflow-hidden
                ${isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-200'}
            `}
        >
            {/* Active Background with Gradient */}
            {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 opacity-90 border border-red-500/20 shadow-[0_0_30px_-5px_rgba(220,38,38,0.4)]" />
            )}
            
            {/* Hover Background for inactive */}
            {!isActive && (
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors" />
            )}

            <Icon size={22} className={`relative z-10 ${isActive ? 'text-white' : 'text-zinc-500 group-hover:text-white transition-colors'}`} strokeWidth={isActive ? 2.5 : 2} />
            <span className={`relative z-10 font-bold text-sm uppercase tracking-wider ${isActive ? 'translate-x-1' : ''} transition-transform`}>{label}</span>
        </button>
    );
  };

  // Render Logic
  // LOGIN LOGIC COMMENTED OUT
  /* 
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }
  */

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-600 selection:text-white relative overflow-hidden flex">
      
      {/* Background Image Layer */}
      <div 
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(8px)'
        }}
      />

      {/* Desktop Sidebar (Visible only on md+) */}
      <aside className="hidden md:flex flex-col w-80 h-screen sticky top-0 p-6 z-20 border-r border-white/5 bg-black/40 backdrop-blur-2xl">
        <div className="flex items-center gap-3 mb-16 px-4">
            <div className="w-10 h-10 bg-red-600 rounded-lg -skew-x-12 flex items-center justify-center shadow-lg shadow-red-900/40 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
                <span className="text-white font-black text-lg italic relative z-10">M</span>
            </div>
            <div>
                <h1 className="text-2xl font-black text-white italic leading-none tracking-tighter">MION</h1>
                <p className="text-zinc-500 font-bold tracking-[0.3em] text-[8px] uppercase">Building Company</p>
            </div>
        </div>

        <nav className="flex-1 space-y-3">
            <SidebarLink targetView="dashboard" icon={LayoutDashboard} label="Záznam Práce" />
            <SidebarLink targetView="reports" icon={FileBarChart} label="Reporty & Export" />
            <SidebarLink targetView="manage" icon={Users} label="Správa Dát" />
            <SidebarLink targetView="history" icon={HistoryIcon} label="História" />
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
            <div className="px-4 py-4 mb-2 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Prihlásený ako</p>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <p className="text-sm font-bold text-white truncate">{user}</p>
                </div>
            </div>
            <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-zinc-500 hover:bg-white/5 hover:text-red-500 transition-all group mt-2"
            >
                <LogOut size={20} className="group-hover:text-red-500 transition-colors" />
                <span className="font-bold text-sm uppercase tracking-wide">Odhlásiť</span>
            </button>
            
            {/* Credits Footer */}
            <p className="text-[9px] text-zinc-700 text-center font-medium mt-6 tracking-wider opacity-60 hover:opacity-100 transition-opacity cursor-default">
                Vytvoril a spravuje Stoler Danil  2026 ©
            </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto relative z-10 w-full no-scrollbar">
        {view === 'dashboard' && (
          <Dashboard 
            sites={sites} 
            workers={workers} 
            onAddRecord={addRecord} 
            foremanName={user || 'Admin'}
          />
        )}
        {view === 'manage' && (
          <Management 
            sites={sites} 
            workers={workers}
            onAddSite={addSite}
            onRemoveSite={removeSite}
            onAddWorker={addWorker}
            onRemoveWorker={removeWorker}
          />
        )}
        {view === 'history' && (
            <History 
                records={records}
                sites={sites}
                workers={workers}
                onDeleteRecord={deleteRecord}
            />
        )}
        {view === 'reports' && (
            <Reports 
                records={records}
                sites={sites}
                workers={workers}
            />
        )}
      </main>

      <Tabs currentView={view} setView={setView} onLogout={handleLogout} />
    </div>
  );
};

export default App;