import React, { useState, useEffect } from 'react';
import { Site, Worker, WorkRecord } from '../types';
import { TimeInput } from './TimeInput';
import { CheckCircle2 } from 'lucide-react';

interface DashboardProps {
  sites: Site[];
  workers: Worker[];
  onAddRecord: (record: Omit<WorkRecord, 'id' | 'createdAt'>) => void;
  foremanName: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ sites, workers, onAddRecord, foremanName }) => {
  const [selectedSiteId, setSelectedSiteId] = useState<string>('');
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const [startTime, setStartTime] = useState('07:00');
  const [lunchDuration, setLunchDuration] = useState('00:30');
  const [endTime, setEndTime] = useState('16:30');
  
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    // Only auto-select site, let worker be chosen manually to allow reset
    if (sites.length > 0 && !selectedSiteId) setSelectedSiteId(sites[0].id);
  }, [sites, selectedSiteId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSiteId || !selectedWorkerId) return;

    onAddRecord({
      foremanName,
      siteId: selectedSiteId,
      workerId: selectedWorkerId,
      date,
      startTime,
      lunchDuration,
      endTime
    });

    // Show overlay
    setShowOverlay(true);

    // Reset fields to standard values immediately
    setSelectedWorkerId('');       
    setStartTime('07:00');         
    setLunchDuration('00:30');     
    setEndTime('16:30');           
    
    // Hide overlay after 1 second
    setTimeout(() => {
      setShowOverlay(false);
    }, 1000);
  };

  if (sites.length === 0 || workers.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-xl font-bold text-white mb-2">Žiadne dáta</h2>
        <p className="text-zinc-500 mb-6">Pridajte stavby a pracovníkov v sekcii "Správa".</p>
      </div>
    );
  }

  return (
    <>
      {/* Full Screen Success Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="p-8 bg-green-500/10 rounded-full mb-6 animate-in zoom-in duration-300 border border-green-500/20 shadow-[0_0_50px_-12px_rgba(34,197,94,0.5)]">
                <CheckCircle2 size={80} className="text-green-500" />
            </div>
            <h3 className="text-3xl font-black text-white uppercase italic tracking-widest animate-in slide-in-from-bottom-4 duration-300">
                Uložené!
            </h3>
        </div>
      )}

      {/* Main Container - expanded width for desktop */}
      <div className="p-4 pt-8 pb-24 md:p-12 md:pb-12 max-w-lg md:max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-end border-b border-white/10 pb-6">
          <div>
             {/* Mobile Logo (hidden on desktop because sidebar has it) */}
             <div className="md:hidden">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-red-600 rounded-lg -skew-x-12 flex items-center justify-center">
                        <span className="text-white font-black text-sm italic">M</span>
                    </div>
                    <span className="text-white font-black text-xl italic tracking-tighter">MION</span>
                </div>
                <p className="text-[10px] text-red-600 font-bold uppercase tracking-[0.25em]">Building Company</p>
             </div>
             {/* Desktop Title */}
             <div className="hidden md:block">
                 <h2 className="text-3xl font-black text-white uppercase italic tracking-wide">Nový Záznam</h2>
                 <p className="text-zinc-500 mt-1">Vyplňte údaje o práci zamestnanca</p>
             </div>
          </div>
          <div className="text-right md:hidden">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Stavbyvedúci</p>
              <p className="text-sm font-bold text-white uppercase">{foremanName}</p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section Header - Mobile Only */}
          <div className="md:hidden flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-black italic text-sm shadow-lg shadow-red-900/50">
                  01
              </div>
              <h2 className="text-xl font-black text-white uppercase italic tracking-wide">Pracovný Záznam</h2>
          </div>

          {/* Form Grid for Desktop */}
          <div className="md:grid md:grid-cols-2 md:gap-12">
              
              {/* Left Column: Selection */}
              <div className="space-y-6">
                 <h3 className="hidden md:block text-xs font-bold text-red-600 uppercase tracking-widest border-b border-white/10 pb-2 mb-6">Základné Údaje</h3>
                  
                  {/* Date */}
                  <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Dátum</label>
                      <input 
                          type="date" 
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white font-medium outline-none focus:border-red-600 transition-all [color-scheme:dark]"
                      />
                  </div>

                  {/* Site */}
                  <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Stavba / Projekt</label>
                      <select 
                      value={selectedSiteId}
                      onChange={(e) => setSelectedSiteId(e.target.value)}
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white appearance-none outline-none focus:border-red-600 transition-all"
                      >
                      {sites.map(site => (
                          <option key={site.id} value={site.id}>{site.name}</option>
                      ))}
                      </select>
                  </div>

                  {/* Worker */}
                  <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Pracovník</label>
                      <select 
                      value={selectedWorkerId}
                      onChange={(e) => setSelectedWorkerId(e.target.value)}
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white appearance-none outline-none focus:border-red-600 transition-all"
                      >
                      <option value="" disabled className="text-zinc-500">Vyberte pracovníka...</option>
                      {workers.map(worker => (
                          <option key={worker.id} value={worker.id}>{worker.name} — {worker.role}</option>
                      ))}
                      </select>
                  </div>
              </div>

              {/* Right Column: Time */}
              <div className="space-y-6 md:mt-0 mt-8">
                  <h3 className="hidden md:block text-xs font-bold text-red-600 uppercase tracking-widest border-b border-white/10 pb-2 mb-6">Časový Rozvrh</h3>
                  
                  {/* Time Grid */}
                  <div className="grid grid-cols-2 gap-4">
                      <TimeInput label="Začiatok" value={startTime} onChange={setStartTime} />
                      <TimeInput label="Koniec" value={endTime} onChange={setEndTime} />
                      <div className="col-span-2">
                          <TimeInput label="Obed (trvanie)" value={lunchDuration} onChange={setLunchDuration} isDuration={true} />
                      </div>
                  </div>
              </div>
          </div>

          <div className="md:flex md:justify-end md:mt-12">
            <button 
                type="submit" 
                disabled={!selectedWorkerId}
                className="w-full md:w-auto md:px-12 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest py-5 rounded-xl shadow-lg shadow-red-900/30 transition-all transform active:scale-[0.98] mt-8 md:mt-0 text-sm"
            >
                Uložiť Protokol
            </button>
          </div>

        </form>
      </div>
    </>
  );
};