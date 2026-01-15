import React, { useState, useMemo } from 'react';
import { Worker, WorkRecord, Site } from '../types';
import { ArrowLeft, Calendar, Clock, Briefcase, MapPin, ChevronRight } from 'lucide-react';

interface WorkerProfileProps {
  worker: Worker;
  records: WorkRecord[];
  sites: Site[];
  onBack: () => void;
}

export const WorkerProfile: React.FC<WorkerProfileProps> = ({ worker, records, sites, onBack }) => {
  // Default to current month YYYY-MM
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));

  // Helper to calculate hours
  const calculateHours = (start: string, end: string, lunch: string) => {
    if (!end || !lunch) return 0;
    const parse = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
    let s = parse(start);
    let e = parse(end);
    let l = parse(lunch);
    if (e < s) e += 24 * 60;
    return Math.max(0, (e - s - l) / 60);
  };

  const getSiteName = (id: string) => sites.find(s => s.id === id)?.name || 'Neznáma stavba';

  // Filter records for this worker and month
  const monthlyData = useMemo(() => {
    return records
      .filter(r => r.workerId === worker.id && r.date.startsWith(selectedMonth))
      .sort((a, b) => b.date.localeCompare(a.date)) // Newest first
      .map(r => ({
        ...r,
        hours: r.status === 'active' ? 0 : calculateHours(r.startTime, r.endTime, r.lunchDuration)
      }));
  }, [records, worker.id, selectedMonth]);

  // Stats
  const totalHours = monthlyData.reduce((sum, r) => sum + r.hours, 0);
  // Only count completed shifts for average
  const completedShifts = monthlyData.filter(r => r.status === 'completed').length;
  const avgHours = completedShifts > 0 ? totalHours / completedShifts : 0;

  return (
    <div className="p-4 pt-8 pb-24 md:p-12 md:pb-12 max-w-lg md:max-w-5xl mx-auto animate-in slide-in-from-right-4 duration-300">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-wide">{worker.name}</h2>
          <p className="text-red-600 font-bold text-xs uppercase tracking-widest">{worker.role}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-[#111] p-4 rounded-xl border border-white/5 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600/10 rounded-lg text-red-600">
                <Calendar size={20} />
            </div>
            <span className="text-sm font-bold text-zinc-400 uppercase tracking-wide hidden md:inline">Vyberte mesiac</span>
        </div>
        <input 
            type="month" 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-[#050505] border border-white/10 rounded-lg px-4 py-2 text-white font-bold outline-none focus:border-red-600 [color-scheme:dark]"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 md:gap-6 mb-8">
        <div className="bg-[#111] p-4 rounded-xl border border-white/5 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-800"></div>
            <span className="block text-2xl md:text-3xl font-black text-white mb-1">{totalHours.toFixed(1)}</span>
            <span className="text-[9px] md:text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Odpracované Hodiny</span>
        </div>
        <div className="bg-[#111] p-4 rounded-xl border border-white/5 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-zinc-700"></div>
            <span className="block text-2xl md:text-3xl font-black text-white mb-1">{completedShifts}</span>
            <span className="text-[9px] md:text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Počet Zmien</span>
        </div>
        <div className="bg-[#111] p-4 rounded-xl border border-white/5 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-zinc-700"></div>
            <span className="block text-2xl md:text-3xl font-black text-white mb-1">{avgHours.toFixed(1)}</span>
            <span className="text-[9px] md:text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Priemer / Deň</span>
        </div>
      </div>

      {/* Records List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 pl-1">História - {selectedMonth}</h3>
        
        {monthlyData.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
                <p className="text-zinc-600 text-sm">Žiadne záznamy v tomto mesiaci</p>
            </div>
        ) : (
            monthlyData.map(record => (
                <div key={record.id} className={`bg-[#111] p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${record.status === 'active' ? 'border-green-500/20 bg-green-900/5' : 'border-white/5 hover:border-white/10'}`}>
                    
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg border flex flex-col items-center justify-center shrink-0 ${record.status === 'active' ? 'bg-green-500/10 border-green-500/20' : 'bg-[#050505] border-white/5'}`}>
                            <span className={`text-[10px] uppercase font-bold ${record.status === 'active' ? 'text-green-500' : 'text-zinc-500'}`}>{new Date(record.date).toLocaleDateString('sk-SK', { weekday: 'short' })}</span>
                            <span className="text-lg font-black text-white leading-none">{new Date(record.date).getDate()}</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
                                <MapPin size={12} />
                                <span>{getSiteName(record.siteId)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-white font-bold text-sm">
                                <Clock size={14} className={record.status === 'active' ? 'text-green-500' : 'text-red-600'} />
                                {record.status === 'active' ? (
                                    <span className="text-green-500 uppercase tracking-wider text-xs font-black">Práve v práci ({record.startTime})</span>
                                ) : (
                                    <>
                                        <span>{record.startTime} - {record.endTime}</span>
                                        <span className="text-zinc-600 text-xs font-normal">({record.lunchDuration} obed)</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end md:gap-8 pt-3 md:pt-0 border-t border-white/5 md:border-0">
                         <div className="md:text-right">
                             <span className="block text-[9px] text-zinc-500 uppercase tracking-wider">Zapísal</span>
                             <span className="text-xs text-zinc-300">{record.foremanName}</span>
                         </div>
                         <div className="text-right">
                            {record.status === 'active' ? (
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-auto"></div>
                            ) : (
                                <span className="block text-xl font-black text-white">{record.hours.toFixed(1)}<span className="text-xs text-red-600 ml-0.5">h</span></span>
                            )}
                         </div>
                    </div>

                </div>
            ))
        )}
      </div>
    </div>
  );
};