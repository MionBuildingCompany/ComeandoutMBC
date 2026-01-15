import React, { useState } from 'react';
import { Site, Worker } from '../types';
import { Plus, Trash2, MapPin, HardHat, Search } from 'lucide-react';

interface ManagementProps {
  sites: Site[];
  workers: Worker[];
  onAddSite: (name: string, address: string) => void;
  onRemoveSite: (id: string) => void;
  onAddWorker: (name: string, role: string) => void;
  onRemoveWorker: (id: string) => void;
}

export const Management: React.FC<ManagementProps> = ({ 
  sites, workers, onAddSite, onRemoveSite, onAddWorker, onRemoveWorker 
}) => {
  const [activeTab, setActiveTab] = useState<'sites' | 'workers'>('sites');

  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteAddress, setNewSiteAddress] = useState('');
  const [newWorkerName, setNewWorkerName] = useState('');
  const [newWorkerRole, setNewWorkerRole] = useState('');

  // Search states
  const [siteSearch, setSiteSearch] = useState('');
  const [workerSearch, setWorkerSearch] = useState('');

  const handleAddSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSiteName.trim()) {
      onAddSite(newSiteName, newSiteAddress);
      setNewSiteName('');
      setNewSiteAddress('');
    }
  };

  const handleAddWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWorkerName.trim()) {
      onAddWorker(newWorkerName, newWorkerRole || 'Robotník');
      setNewWorkerName('');
      setNewWorkerRole('');
    }
  };

  // Filter logic
  const filteredSites = sites.filter(site => 
    site.name.toLowerCase().includes(siteSearch.toLowerCase()) ||
    site.address.toLowerCase().includes(siteSearch.toLowerCase())
  );

  const filteredWorkers = workers.filter(worker => 
    worker.name.toLowerCase().includes(workerSearch.toLowerCase()) ||
    worker.role.toLowerCase().includes(workerSearch.toLowerCase())
  );

  const SitesContent = () => (
    <>
        <form onSubmit={handleAddSite} className="bg-[#111] p-4 rounded-xl border border-dashed border-white/20 mb-6">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Pridať novú stavbu</h3>
            <div className="space-y-3">
            <input 
                placeholder="Názov (napr. Rezidencia Park)" 
                value={newSiteName}
                onChange={e => setNewSiteName(e.target.value)}
                className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-3 text-sm text-white outline-none focus:border-red-600"
            />
            <input 
                placeholder="Adresa" 
                value={newSiteAddress}
                onChange={e => setNewSiteAddress(e.target.value)}
                className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-3 text-sm text-white outline-none focus:border-red-600"
            />
            <button type="submit" className="w-full bg-white text-black rounded-lg py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-200">
                <Plus size={14} /> Pridať
            </button>
            </div>
        </form>

        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                <input 
                    placeholder="Hľadať stavbu..." 
                    value={siteSearch}
                    onChange={e => setSiteSearch(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white outline-none focus:border-red-600/50 transition-all placeholder:text-zinc-600"
                />
            </div>

            <div className="space-y-2">
                {filteredSites.map(site => (
                <div key={site.id} className="bg-[#111] p-4 rounded-xl border border-white/5 flex items-center justify-between group hover:border-white/10 transition-colors">
                    <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-600/10 rounded-lg text-red-600 shrink-0">
                        <MapPin size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-white text-sm">{site.name}</p>
                        {site.address && <p className="text-xs text-zinc-500">{site.address}</p>}
                    </div>
                    </div>
                    <button onClick={() => onRemoveSite(site.id)} className="text-zinc-600 hover:text-red-600 transition-colors p-2 shrink-0">
                    <Trash2 size={18} />
                    </button>
                </div>
                ))}
                {filteredSites.length === 0 && <p className="text-center text-zinc-600 text-xs uppercase tracking-widest py-4">Žiadne výsledky</p>}
            </div>
        </div>
    </>
  );

  const WorkersContent = () => (
    <>
        <form onSubmit={handleAddWorker} className="bg-[#111] p-4 rounded-xl border border-dashed border-white/20 mb-6">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Pridať nového pracovníka</h3>
            <div className="space-y-3">
            <input 
                placeholder="Meno a Priezvisko" 
                value={newWorkerName}
                onChange={e => setNewWorkerName(e.target.value)}
                className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-3 text-sm text-white outline-none focus:border-red-600"
            />
            <input 
                placeholder="Pozícia (predvolená: Robotník)" 
                value={newWorkerRole}
                onChange={e => setNewWorkerRole(e.target.value)}
                className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-3 text-sm text-white outline-none focus:border-red-600"
            />
            <button type="submit" className="w-full bg-white text-black rounded-lg py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-200">
                <Plus size={14} /> Pridať
            </button>
            </div>
        </form>

        <div className="space-y-4">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                <input 
                    placeholder="Hľadať pracovníka..." 
                    value={workerSearch}
                    onChange={e => setWorkerSearch(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-600"
                />
            </div>

            <div className="space-y-2">
                {filteredWorkers.map(worker => (
                <div key={worker.id} className="bg-[#111] p-4 rounded-xl border border-white/5 flex items-center justify-between group hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 shrink-0">
                        <HardHat size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-white text-sm">{worker.name}</p>
                        <p className="text-xs text-zinc-500">{worker.role}</p>
                    </div>
                    </div>
                    <button onClick={() => onRemoveWorker(worker.id)} className="text-zinc-600 hover:text-red-600 transition-colors p-2 shrink-0">
                    <Trash2 size={18} />
                    </button>
                </div>
                ))}
                {filteredWorkers.length === 0 && <p className="text-center text-zinc-600 text-xs uppercase tracking-widest py-4">Žiadne výsledky</p>}
            </div>
        </div>
    </>
  );

  return (
    <div className="p-4 pt-8 pb-24 md:p-12 md:pb-12 max-w-lg md:max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="md:hidden w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-black italic text-sm shadow-lg shadow-red-900/50">
            02
        </div>
        <h2 className="text-xl md:text-3xl font-black text-white uppercase italic tracking-wide">Správa Dát</h2>
      </div>

      {/* Mobile Tabs */}
      <div className="md:hidden flex bg-[#111] p-1 rounded-xl mb-6 border border-white/10">
        <button 
          onClick={() => setActiveTab('sites')}
          className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === 'sites' ? 'bg-[#222] text-white shadow-sm border border-white/5' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          Stavby
        </button>
        <button 
          onClick={() => setActiveTab('workers')}
          className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === 'workers' ? 'bg-[#222] text-white shadow-sm border border-white/5' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
          Pracovníci
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Mobile View: Toggle based on activeTab */}
        <div className="md:hidden space-y-4">
            {activeTab === 'sites' ? <SitesContent /> : <WorkersContent />}
        </div>

        {/* Desktop View: Grid side-by-side */}
        <div className="hidden md:grid md:grid-cols-2 md:gap-8">
            <div className="space-y-4">
                <h3 className="text-red-600 font-bold uppercase tracking-widest border-b border-white/10 pb-4 mb-4">Stavby</h3>
                <SitesContent />
            </div>
            <div className="space-y-4">
                 <h3 className="text-blue-500 font-bold uppercase tracking-widest border-b border-white/10 pb-4 mb-4">Pracovníci</h3>
                <WorkersContent />
            </div>
        </div>
      </div>
    </div>
  );
};