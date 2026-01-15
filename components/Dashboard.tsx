import React, { useState, useEffect, useMemo } from 'react';
import { Site, Worker, WorkRecord } from '../types';
import { TimeInput } from './TimeInput';
import { CheckCircle2, Play, StopCircle, Clock, MapPin, HardHat, CalendarCheck, Zap } from 'lucide-react';

interface DashboardProps {
  sites: Site[];
  workers: Worker[];
  records: WorkRecord[];
  onAddRecord: (record: Omit<WorkRecord, 'id' | 'createdAt'>) => void;
  onUpdateRecord: (id: string, updates: Partial<WorkRecord>) => void;
  foremanName: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ sites, workers, records, onAddRecord, onUpdateRecord, foremanName }) => {
  const [selectedSiteId, setSelectedSiteId] = useState<string>('');
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const [startTime, setStartTime] = useState('07:00');
  const [lunchDuration, setLunchDuration] = useState('00:30');
  const [endTime, setEndTime] = useState('16:30');
  
  // Replaced toggle with a clearer mode state
  const [mode, setMode] = useState<'live' | 'manual'>('live');
  
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayMessage, setOverlayMessage] = useState('Uložené!');

  // Check if selected worker has an active record for today
  const activeRecord = useMemo(() => {
    if (!selectedWorkerId || !date) return undefined;
    // Find a record for this worker, this date, which is NOT completed
    return records.find(r => 
        r.workerId === selectedWorkerId && 
        r.date === date && 
        r.status === 'active'
    );
  }, [selectedWorkerId, date, records]);

  // Set default site
  useEffect(() => {
    if (sites.length > 0 && !selectedSiteId) setSelectedSiteId(sites[0].id);
  }, [sites, selectedSiteId]);

  // When active record is found, sync state with it
  useEffect(() => {
    if (activeRecord) {
        setStartTime(activeRecord.startTime);
        setSelectedSiteId(activeRecord.siteId); // Lock site to where they started
        // Switch to live mode automatically if we select a worker who is working
        setMode('live'); 
    } 
  }, [activeRecord]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSiteId || !selectedWorkerId) return;

    // Logic 1: Live Mode - Check-Out
    if (mode === 'live' && activeRecord) {
        onUpdateRecord(activeRecord.id, {
            lunchDuration,
            endTime,
            status: 'completed'
        });
        setOverlayMessage('Zmena Ukončená');
    } 
    // Logic 2: Live Mode - Check-In
    else if (mode === 'live' && !activeRecord) {
        onAddRecord({
            foremanName,
            siteId: selectedSiteId,
            workerId: selectedWorkerId,
            date,
            startTime,
            lunchDuration: '', // Not set yet
            endTime: '', // Not set yet
            status: 'active'
        });
        setOverlayMessage('Zmena Začatá');
    }
    // Logic 3: Manual Mode (Retroactive / Full)
    else {
        onAddRecord({
            foremanName,
            siteId: selectedSiteId,
            workerId: selectedWorkerId,
            date,
            startTime,
            lunchDuration,
            endTime,
            status: 'completed'
        });
        setOverlayMessage('Zmena Uložená');
    }

    // Animation & Reset
    setShowOverlay(true);
    
    // Reset fields
    setSelectedWorkerId('');       
    if (mode === 'manual') {
        setStartTime('07:00');
        setEndTime('16:30');
    }
    
    setTimeout(() => {
      setShowOverlay(false);
    }, 1200);
  };

  // Get list of currently active workers for the "Active Shifts" card
  const activeWorkers = useMemo(() => {
    return records
        .filter(r => r.status === 'active' && r.date === new Date().toISOString().split('T')[0])
        .map(r => {
            const w = workers.find(w => w.id === r.workerId);
            const s = sites.find(s => s.id === r.siteId);
            return { record: r, worker: w, site: s };
        });
  }, [records, workers, sites]);

  if (sites.length === 0 || workers.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-xl font-bold text-white mb-2">Žiadne dáta</h2>
        <p className="text-zinc-500 mb-6">Pridajte stavby a pracovníkov v sekcii "Správa".</p>
      </div>
    );
  }

  // Determine UI State variables
  const isWorking = !!activeRecord;
  const isManual = mode === 'manual';

  return (
    <>
      {/* Full Screen Success Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={`p-8 rounded-full mb-6 animate-in zoom-in duration-300 border shadow-[0_0_50px_-12px] ${overlayMessage.includes('Začatá') ? 'bg-green-500/10 border-green-500/20 shadow-green-500/50' : 'bg-red-500/10 border-red-500/20 shadow-red-500/50'}`}>
                {overlayMessage.includes('Začatá') ? (
                    <Play size={80} className="text-green-500 ml-2" fill="currentColor" />
                ) : (
                    <CheckCircle2 size={80} className="text-red-600" />
                )}
            </div>
            <h3 className="text-3xl font-black text-white uppercase italic tracking-widest animate-in slide-in-from-bottom-4 duration-300">
                {overlayMessage}
            </h3>
        </div>
      )}

      {/* Main Container */}
      <div className="p-4 pt-8 pb-24 md:p-12 md:pb-12 max-w-lg md:max-w-6xl mx-auto">
        
        {/* Header with Title */}
        <header className="mb-6 md:mb-8 border-b border-white/10 pb-6">
            <div className="flex justify-between items-center">
                <div>
                     <div className="md:hidden flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 bg-red-600 rounded-lg -skew-x-12 flex items-center justify-center">
                            <span className="text-white font-black text-sm italic">M</span>
                        </div>
                        <span className="text-white font-black text-xl italic tracking-tighter">MION</span>
                    </div>
                     <h2 className="hidden md:block text-3xl font-black text-white uppercase italic tracking-wide">Nová Zmena</h2>
                     <p className="text-zinc-500 text-xs md:text-sm mt-1">Evidencia príchodov a odchodov</p>
                </div>
                <div className="text-right hidden md:block">
                     <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Stavbyvedúci</p>
                     <p className="text-sm font-bold text-white uppercase">{foremanName}</p>
                </div>
            </div>
        </header>

        {/* MODE TABS - THE BIG SWITCH */}
        <div className="bg-[#111] p-1.5 rounded-2xl flex gap-2 mb-8 border border-white/10">
            <button 
                onClick={() => setMode('live')}
                className={`flex-1 py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${mode === 'live' ? 'bg-[#050505] shadow-lg border border-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
            >
                <Zap size={20} className={mode === 'live' ? 'text-green-500 fill-current' : ''} />
                <div className="text-left">
                    <span className="block text-xs font-black uppercase tracking-widest leading-none mb-1">TERAZ (Live)</span>
                    <span className="block text-[10px] opacity-60 font-medium">Príchod / Odchod</span>
                </div>
            </button>
            <button 
                onClick={() => setMode('manual')}
                className={`flex-1 py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${mode === 'manual' ? 'bg-[#050505] shadow-lg border border-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
            >
                <CalendarCheck size={20} className={mode === 'manual' ? 'text-blue-500' : ''} />
                <div className="text-left">
                    <span className="block text-xs font-black uppercase tracking-widest leading-none mb-1">DOPLNIŤ</span>
                    <span className="block text-[10px] opacity-60 font-medium">Celá zmena</span>
                </div>
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
          
          <div className="md:grid md:grid-cols-2 md:gap-12">
              
              {/* Left Column: Data Selection */}
              <div className="space-y-6">
                  {/* Date - Always visible */}
                  <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Dátum</label>
                      <input 
                          type="date" 
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-4 text-white font-medium outline-none focus:border-red-600 transition-all [color-scheme:dark]"
                      />
                  </div>

                  {/* Worker Selection - Key interaction */}
                  <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Pracovník</label>
                      <div className="relative">
                        <select 
                            value={selectedWorkerId}
                            onChange={(e) => setSelectedWorkerId(e.target.value)}
                            className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-4 text-white appearance-none outline-none focus:border-red-600 transition-all font-bold"
                        >
                            <option value="" disabled className="text-zinc-500">Vyberte pracovníka...</option>
                            {workers.map(worker => {
                                const workerActive = records.some(r => r.workerId === worker.id && r.date === date && r.status === 'active');
                                return (
                                    <option key={worker.id} value={worker.id}>
                                        {worker.name} {workerActive ? '(V práci 🟢)' : ''}
                                    </option>
                                );
                            })}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                             <HardHat size={18} />
                        </div>
                      </div>
                  </div>

                  {/* Site Selection */}
                  <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Stavba</label>
                      <div className="relative">
                        <select 
                            value={selectedSiteId}
                            onChange={(e) => setSelectedSiteId(e.target.value)}
                            disabled={isWorking && !isManual}
                            className={`w-full bg-[#111] border border-white/10 rounded-xl px-4 py-4 text-white appearance-none outline-none focus:border-red-600 transition-all ${isWorking && !isManual ? 'opacity-50' : ''}`}
                        >
                        {sites.map(site => (
                            <option key={site.id} value={site.id}>{site.name}</option>
                        ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                             <MapPin size={18} />
                        </div>
                      </div>
                  </div>
              </div>

              {/* Right Column: Time & Actions */}
              <div className="space-y-6 md:mt-0 mt-8">
                  
                  {/* Status Box for Live Mode */}
                  {mode === 'live' && selectedWorkerId && (
                      <div className={`p-4 rounded-xl border flex items-center gap-4 transition-all duration-300 ${isWorking ? 'bg-red-900/10 border-red-500/20' : 'bg-green-900/10 border-green-500/20'}`}>
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-lg ${isWorking ? 'bg-red-600 text-white shadow-red-900/40' : 'bg-green-500 text-black shadow-green-900/40'}`}>
                                {isWorking ? <StopCircle size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                          </div>
                          <div>
                              <p className={`text-xs font-black uppercase tracking-widest ${isWorking ? 'text-red-500' : 'text-green-500'}`}>
                                  {isWorking ? 'UKONČIŤ ZMENU' : 'ZAČAŤ ZMENU'}
                              </p>
                              <p className="text-sm text-white font-medium opacity-80">
                                  {isWorking ? 'Pracovník je momentálne na stavbe.' : 'Pracovník ešte nemá dnešný záznam.'}
                              </p>
                          </div>
                      </div>
                  )}

                  {/* TIME INPUTS */}
                  <div className={`space-y-4 transition-all duration-300 ${!selectedWorkerId ? 'opacity-30 blur-[2px] pointer-events-none' : 'opacity-100'}`}>
                      
                      {/* Show Start Time: If Check-In OR Manual */}
                      {(!isWorking || isManual) && (
                         <TimeInput label="Čas príchodu (Začiatok)" value={startTime} onChange={setStartTime} />
                      )}

                      {/* Show End Time: If Check-Out OR Manual */}
                      {(isWorking || isManual) && (
                          <div className="animate-in slide-in-from-right-4 fade-in duration-300">
                             <TimeInput label="Čas odchodu (Koniec)" value={endTime} onChange={setEndTime} />
                          </div>
                      )}

                      {/* Show Lunch: If Check-Out OR Manual */}
                      {(isWorking || isManual) && (
                          <div className="animate-in slide-in-from-bottom-2 fade-in duration-300 pt-2">
                              <TimeInput label="Obed (Dĺžka prestávky)" value={lunchDuration} onChange={setLunchDuration} isDuration={true} />
                          </div>
                      )}
                  </div>
              </div>
          </div>

          {/* MAIN ACTION BUTTON */}
          <div className="pt-4">
            <button 
                type="submit" 
                disabled={!selectedWorkerId}
                className={`
                    w-full py-5 rounded-xl shadow-xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-3
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                    ${mode === 'manual' 
                        ? 'bg-zinc-800 hover:bg-zinc-700 text-white' 
                        : isWorking 
                            ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-900/30' 
                            : 'bg-green-600 hover:bg-green-700 text-white shadow-green-900/30'
                    }
                `}
            >
                {mode === 'manual' ? (
                    <>
                        <span className="font-black uppercase tracking-widest text-sm">Uložiť zmenu</span>
                        <CalendarCheck size={20} />
                    </>
                ) : isWorking ? (
                    <>
                        <span className="font-black uppercase tracking-widest text-sm">Ukončiť a Zapísať</span>
                        <StopCircle size={20} fill="currentColor" />
                    </>
                ) : (
                    <>
                         <span className="font-black uppercase tracking-widest text-sm">Potvrdiť Príchod</span>
                         <Play size={20} fill="currentColor" />
                    </>
                )}
            </button>
          </div>
        </form>

        {/* Active Workers List */}
        {activeWorkers.length > 0 && new Date().toISOString().split('T')[0] === date && (
            <div className="mt-12 border-t border-white/10 pt-8 animate-in slide-in-from-bottom-8 duration-500">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]"></div>
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Práve na stavbe ({activeWorkers.length})</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeWorkers.map(({ record, worker, site }) => (
                        <div 
                            key={record.id} 
                            onClick={() => {
                                setSelectedWorkerId(worker?.id || '');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="bg-[#111] p-4 rounded-xl border border-white/5 hover:border-green-500/30 cursor-pointer transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-green-500/10 to-transparent pointer-events-none"></div>
                            
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <HardHat size={14} className="text-green-500" />
                                        <span className="font-bold text-white group-hover:text-green-400 transition-colors">{worker?.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-zinc-500 text-xs">
                                        <MapPin size={12} />
                                        <span className="truncate max-w-[150px]">{site?.name}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-green-500 text-xs font-mono bg-green-900/10 px-2 py-1 rounded border border-green-500/10">
                                        <Clock size={12} />
                                        <span>{record.startTime}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

      </div>
    </>
  );
};