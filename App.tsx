import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Management } from './components/Management';
import { Login } from './components/Login';
import { Tabs } from './components/ui/Tabs';
import { History } from './components/History';
import { Reports } from './components/Reports';
import { WorkerProfile } from './components/WorkerProfile';
import { Logo } from './components/ui/Logo';
import { Site, Worker, WorkRecord, ViewState, UserSession } from './types';
import { LayoutDashboard, Users, History as HistoryIcon, LogOut, FileBarChart, Lock } from 'lucide-react';

// Firebase Imports
import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';

const App: React.FC = () => {
  // Session still uses LocalStorage for "Keep me logged in" functionality on this specific device
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('app_session');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            return null;
        }
    }
    return null;
  });

  const [view, setView] = useState<ViewState>('dashboard');
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
  
  // Data State (Loaded from Firebase)
  const [sites, setSites] = useState<Site[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [records, setRecords] = useState<WorkRecord[]>([]);

  // --- FIREBASE LISTENERS ---

  // 1. Listen for SITES
  useEffect(() => {
    const q = query(collection(db, 'sites'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sitesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Site[];
      setSites(sitesData);
    });
    return () => unsubscribe();
  }, []);

  // 2. Listen for WORKERS
  useEffect(() => {
    const q = query(collection(db, 'workers'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const workersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Worker[];
      setWorkers(workersData);
    });
    return () => unsubscribe();
  }, []);

  // 3. Listen for RECORDS
  useEffect(() => {
    // Ordering by createdAt desc to show newest first
    const q = query(collection(db, 'records'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const recordsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as WorkRecord[];
      setRecords(recordsData);
    });
    return () => unsubscribe();
  }, []);

  // Session Persistence
  useEffect(() => {
    if (currentUser) localStorage.setItem('app_session', JSON.stringify(currentUser));
    else localStorage.removeItem('app_session');
  }, [currentUser]);

  // Handlers
  const handleLogin = (session: UserSession) => {
    setCurrentUser(session);
    setView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('dashboard');
  };

  // --- FIREBASE ACTIONS ---

  const addRecord = async (recordData: Omit<WorkRecord, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, 'records'), {
        ...recordData,
        createdAt: Date.now(),
      });
    } catch (e) {
      console.error("Error adding record: ", e);
      alert("Chyba pri ukladaní záznamu. Skontrolujte pripojenie.");
    }
  };

  const updateRecord = async (id: string, updates: Partial<WorkRecord>) => {
    try {
      const recordRef = doc(db, 'records', id);
      await updateDoc(recordRef, updates);
    } catch (e) {
      console.error("Error updating record: ", e);
    }
  };

  const deleteRecord = async (id: string) => {
    if(window.confirm('Naozaj chcete zmazať tento záznam?')) {
        try {
            await deleteDoc(doc(db, 'records', id));
        } catch (e) {
            console.error("Error deleting record: ", e);
        }
    }
  };

  const addSite = async (name: string, address: string) => {
    try {
        await addDoc(collection(db, 'sites'), { name, address });
    } catch (e) {
        console.error("Error adding site: ", e);
    }
  };

  const removeSite = async (id: string) => {
    if(window.confirm('Naozaj zmazať túto stavbu?')) {
        try {
            await deleteDoc(doc(db, 'sites', id));
        } catch (e) {
            console.error("Error removing site: ", e);
        }
    }
  };

  const addWorker = async (name: string, role: string) => {
    try {
        await addDoc(collection(db, 'workers'), { name, role });
    } catch (e) {
        console.error("Error adding worker: ", e);
    }
  };

  const removeWorker = async (id: string) => {
    if(window.confirm('Naozaj zmazať pracovníka? História záznamov ostane zachovaná.')) {
        try {
            await deleteDoc(doc(db, 'workers', id));
        } catch (e) {
            console.error("Error removing worker: ", e);
        }
    }
  };

  const handleSelectWorker = (workerId: string) => {
    setSelectedWorkerId(workerId);
    setView('worker_profile');
  };

  // Helper for Desktop Sidebar Links
  const SidebarLink = ({ targetView, icon: Icon, label }: { targetView: ViewState, icon: any, label: string }) => {
    const isActive = view === targetView || (view === 'worker_profile' && targetView === 'manage');
    return (
        <button 
            onClick={() => setView(targetView)}
            className={`
                w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group relative overflow-hidden
                ${isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-200'}
            `}
        >
            {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 opacity-90 border border-red-500/20 shadow-[0_0_30px_-5px_rgba(220,38,38,0.4)]" />
            )}
            {!isActive && (
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors" />
            )}
            <Icon size={22} className={`relative z-10 ${isActive ? 'text-white' : 'text-zinc-500 group-hover:text-white transition-colors'}`} strokeWidth={isActive ? 2.5 : 2} />
            <span className={`relative z-10 font-bold text-sm uppercase tracking-wider ${isActive ? 'translate-x-1' : ''} transition-transform`}>{label}</span>
        </button>
    );
  };

  // Render Login if no user
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const isAdmin = currentUser.role === 'admin';
  const selectedWorker = workers.find(w => w.id === selectedWorkerId);

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
        <div className="mb-12 px-2">
            <div className="flex flex-col items-start">
                <div className="mb-4">
                  <Logo className="h-16 w-16 text-white" />
                </div>
                
                <h1 className="text-4xl font-black text-white italic tracking-tighter leading-none">MION</h1>
                <p className="text-[10px] text-zinc-500 uppercase tracking-[0.25em] font-bold mt-1 ml-0.5">Building Company</p>
            </div>
        </div>

        <nav className="flex-1 space-y-3">
            <SidebarLink targetView="dashboard" icon={LayoutDashboard} label="Zmena" />
            {isAdmin && (
                <>
                    <SidebarLink targetView="reports" icon={FileBarChart} label="Reporty & Export" />
                    <SidebarLink targetView="manage" icon={Users} label="Správa Dát" />
                </>
            )}
            <SidebarLink targetView="history" icon={HistoryIcon} label="História" />
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
            <div className="px-4 py-4 mb-2 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Prihlásený ako</p>
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${isAdmin ? 'bg-red-500' : 'bg-green-500'}`}></div>
                    <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
                </div>
            </div>
            <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-zinc-500 hover:bg-white/5 hover:text-red-500 transition-all group mt-2"
            >
                <LogOut size={20} className="group-hover:text-red-500 transition-colors" />
                <span className="font-bold text-sm uppercase tracking-wide">Odhlásiť</span>
            </button>
            
            <p className="text-[9px] text-zinc-700 text-center font-medium mt-6 tracking-wider opacity-60 hover:opacity-100 transition-opacity cursor-default">
                Vytvoril a spravuje Stoler Danil © 2026
            </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto relative z-10 w-full no-scrollbar">
        {view === 'dashboard' && (
          <Dashboard 
            sites={sites} 
            workers={workers} 
            records={records}
            onAddRecord={addRecord} 
            onUpdateRecord={updateRecord}
            foremanName={currentUser.name || 'Admin'}
          />
        )}
        
        {view === 'manage' && isAdmin && (
          <Management 
            sites={sites} 
            workers={workers}
            onAddSite={addSite}
            onRemoveSite={removeSite}
            onAddWorker={addWorker}
            onRemoveWorker={removeWorker}
            onSelectWorker={handleSelectWorker}
          />
        )}

        {view === 'worker_profile' && selectedWorker && isAdmin && (
            <WorkerProfile 
                worker={selectedWorker}
                records={records}
                sites={sites}
                onBack={() => setView('manage')}
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

        {view === 'reports' && isAdmin && (
            <Reports 
                records={records}
                sites={sites}
                workers={workers}
            />
        )}

        {((view === 'manage' || view === 'reports' || view === 'worker_profile') && !isAdmin) && (
            <div className="flex items-center justify-center h-full flex-col p-6 text-center">
                 <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mb-4">
                    <Lock size={32} className="text-red-600" />
                 </div>
                 <h2 className="text-xl font-bold text-white uppercase tracking-wide">Prístup zamietnutý</h2>
                 <p className="text-zinc-500 mt-2 text-sm max-w-xs">Táto sekcia je dostupná len pre administrátorov (Ondik, Olšavska, Admin).</p>
                 <button onClick={() => setView('dashboard')} className="mt-6 text-sm font-bold text-white border-b border-red-600 pb-1">Späť na nástenku</button>
            </div>
        )}
      </main>

      <Tabs 
        currentView={view === 'worker_profile' ? 'manage' : view} 
        setView={setView} 
        onLogout={handleLogout} 
        isAdmin={isAdmin} 
      />
    </div>
  );
};

export default App;