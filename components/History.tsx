import React, { useState } from 'react';
import { WorkRecord, Site, Worker } from '../types';
import { Calendar, MapPin, User, ArrowRight, Trash2, X, Filter, Clock } from 'lucide-react';

interface HistoryProps {
  records: WorkRecord[];
  sites: Site[];
  workers: Worker[];
  onDeleteRecord: (id: string) => void;
}

export const History: React.FC<HistoryProps> = ({ records, sites, workers, onDeleteRecord }) => {
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  const sortedRecords = [...records]
    .filter(record => {
      if (dateFrom && record.date < dateFrom) return false;
      if (dateTo && record.date > dateTo) return false;
      return true;
    })
    .sort((a, b) => b.createdAt - a.createdAt);

  const getSiteName = (id: string) => sites.find(s => s.id === id)?.name || 'Neznáma stavba';
  const getWorkerName = (id: string) => workers.find(w => w.id === id)?.name || 'Neznámy pracovník';

  return (
    <div className="p-4 pt-8 pb-24 md:p-12 md:pb-12 max-w-lg md:max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="md:hidden w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-black italic text-sm shadow-lg shadow-red-900/50">
            03
        </div>
        <h2 className="text-xl md:text-3xl font-black text-white uppercase italic tracking-wide">História Záznamov</h2>
      </div>

      {/* Date Range Filter */}
      <div className="bg-[#111] p-4 rounded-xl border border-white/5 mb-6">
        <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
                <Filter size={14} className="text-red-600" />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Filtrovať obdobie</span>
            </div>
            {(dateFrom || dateTo) && (
                <button 
                    onClick={() => { setDateFrom(''); setDateTo(''); }}
                    className="flex items-center gap-1 text-[10px] font-bold text-zinc-500 hover:text-red-500 uppercase tracking-wider transition-colors"
                >
                    <X size={12} />
                    Vymazať
                </button>
            )}
        </div>
        <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Od</label>
                <input 
                    type="date" 
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-xs md:text-sm text-white font-medium outline-none focus:border-red-600 transition-all [color-scheme:dark]"
                />
            </div>
            <div className="space-y-1">
                 <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Do</label>
                 <input 
                    type="date" 
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-2 text-xs md:text-sm text-white font-medium outline-none focus:border-red-600 transition-all [color-scheme:dark]"
                 />
            </div>
        </div>
      </div>

      {sortedRecords.length === 0 ? (
        <div className="text-center py-10 text-zinc-600 uppercase tracking-widest text-xs border border-dashed border-white/10 rounded-xl">
          {(dateFrom || dateTo) ? <p>Žiadne záznamy pre zvolené obdobie.</p> : <p>Zatiaľ žiadne záznamy.</p>}
        </div>
      ) : (
        <>
            {/* Mobile View: Cards */}
            <div className="md:hidden space-y-3">
            {sortedRecords.map(record => {
                const isActive = record.status === 'active';
                return (
                <div key={record.id} className={`bg-[#111] p-5 rounded-xl border relative group ${isActive ? 'border-green-500/20' : 'border-white/5'}`}>
                <div className="flex justify-between items-start mb-4">
                    <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-green-500' : 'text-red-600'}`}>
                    <Calendar size={12} />
                    <span>{new Date(record.date).toLocaleDateString('sk-SK')}</span>
                    {isActive && <span className="ml-2 bg-green-500/10 px-2 py-0.5 rounded text-green-500">LIVE</span>}
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">{record.foremanName}</span>
                        <button 
                            onClick={() => onDeleteRecord(record.id)}
                            className="text-zinc-600 hover:text-red-600 transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                <div className="flex items-start gap-3 mb-5">
                    <div className="mt-1">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? 'bg-green-500/10 text-green-500' : 'bg-white/5 text-zinc-400'}`}>
                        <User size={16} />
                    </div>
                    </div>
                    <div>
                    <h3 className="font-bold text-white text-lg">{getWorkerName(record.workerId)}</h3>
                    <div className="flex items-center gap-1 text-zinc-500 text-xs mt-1">
                        <MapPin size={12} />
                        <span>{getSiteName(record.siteId)}</span>
                    </div>
                    </div>
                </div>

                <div className="flex items-center justify-between bg-[#050505] border border-white/5 rounded-lg p-3">
                    <div className="text-center">
                    <span className="block text-[9px] text-zinc-500 uppercase tracking-wider mb-1">Začiatok</span>
                    <span className="block font-bold text-white text-sm">{record.startTime}</span>
                    </div>
                    <div className="text-zinc-700">
                    <ArrowRight size={14} />
                    </div>
                    
                    {isActive ? (
                        <div className="flex items-center gap-2 text-green-500 text-xs font-bold uppercase tracking-widest w-full justify-center">
                            <Clock size={14} className="animate-pulse" />
                            V práci
                        </div>
                    ) : (
                        <>
                            <div className="text-center">
                            <span className="block text-[9px] text-zinc-500 uppercase tracking-wider mb-1">Obed</span>
                            <span className="block font-bold text-zinc-400 text-sm">{record.lunchDuration}</span>
                            </div>
                            <div className="text-zinc-700">
                            <ArrowRight size={14} />
                            </div>
                            <div className="text-center">
                            <span className="block text-[9px] text-zinc-500 uppercase tracking-wider mb-1">Koniec</span>
                            <span className="block font-bold text-white text-sm">{record.endTime}</span>
                            </div>
                        </>
                    )}
                </div>
                </div>
            )})}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block bg-[#111] rounded-xl border border-white/5 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/5">
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Dátum</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Pracovník</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Stavba</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Čas</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Zapísal</th>
                            <th className="p-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Akcia</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {sortedRecords.map(record => {
                            const isActive = record.status === 'active';
                            return (
                            <tr key={record.id} className="hover:bg-white/5 transition-colors group">
                                <td className="p-4 text-sm font-medium text-white">
                                    {new Date(record.date).toLocaleDateString('sk-SK')}
                                </td>
                                <td className="p-4 text-sm font-bold text-white">
                                    {getWorkerName(record.workerId)}
                                </td>
                                <td className="p-4 text-sm text-zinc-400">
                                    {getSiteName(record.siteId)}
                                </td>
                                <td className="p-4 text-sm font-mono text-zinc-300">
                                    {isActive ? (
                                        <div className="flex items-center gap-2 text-green-500">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                            <span>{record.startTime} — ...</span>
                                        </div>
                                    ) : (
                                        <span>{record.startTime} - {record.endTime} <span className="text-zinc-600">({record.lunchDuration} obed)</span></span>
                                    )}
                                </td>
                                <td className="p-4 text-xs text-zinc-500 uppercase font-bold tracking-wider">
                                    {record.foremanName}
                                </td>
                                <td className="p-4 text-right">
                                    <button 
                                        onClick={() => onDeleteRecord(record.id)}
                                        className="p-2 text-zinc-600 hover:text-red-600 hover:bg-red-600/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        )})}
                    </tbody>
                </table>
            </div>
        </>
      )}
    </div>
  );
};