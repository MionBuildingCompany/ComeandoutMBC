import React, { useState, useMemo } from 'react';
import { WorkRecord, Site, Worker } from '../types';
import { Filter, Calendar, Download, Calculator } from 'lucide-react';

interface ReportsProps {
  records: WorkRecord[];
  sites: Site[];
  workers: Worker[];
}

export const Reports: React.FC<ReportsProps> = ({ records, sites, workers }) => {
  // Date defaults: First day of current month to today
  const today = new Date().toISOString().split('T')[0];
  const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

  const [dateFrom, setDateFrom] = useState(firstDay);
  const [dateTo, setDateTo] = useState(today);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('all');
  const [selectedSiteId, setSelectedSiteId] = useState<string>('all');

  // Helpers
  const parseTime = (time: string) => {
    if (!time) return 0;
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  const calculateHours = (start: string, end: string, lunch: string) => {
    let startMins = parseTime(start);
    let endMins = parseTime(end);
    let lunchMins = parseTime(lunch);

    if (endMins < startMins) endMins += 24 * 60; // Handle overnight

    const durationMins = endMins - startMins - lunchMins;
    return Math.max(0, durationMins / 60);
  };

  // Filter Logic
  const filteredData = useMemo(() => {
    return records
    .filter(record => record.status !== 'active') // Exclude active shifts from reports
    .filter(record => {
      const recordDate = record.date;
      const matchesDate = recordDate >= dateFrom && recordDate <= dateTo;
      const matchesWorker = selectedWorkerId === 'all' || record.workerId === selectedWorkerId;
      const matchesSite = selectedSiteId === 'all' || record.siteId === selectedSiteId;
      
      return matchesDate && matchesWorker && matchesSite;
    }).map(record => {
        const hours = calculateHours(record.startTime, record.endTime, record.lunchDuration);
        const worker = workers.find(w => w.id === record.workerId);
        const site = sites.find(s => s.id === record.siteId);
        
        return {
            ...record,
            workerName: worker?.name || 'Neznámy',
            workerRole: worker?.role || 'Neznámy',
            siteName: site?.name || 'Neznáma stavba',
            hours
        };
    });
  }, [records, dateFrom, dateTo, selectedWorkerId, selectedSiteId, sites, workers]);

  const totalHours = filteredData.reduce((sum, item) => sum + item.hours, 0);

  // Export Logic
  const handleExport = () => {
    // Check if XLSX is available (loaded from CDN in index.html)
    // @ts-ignore
    if (typeof XLSX === 'undefined') {
        alert('Export library not loaded. Please check internet connection.');
        return;
    }

    const exportData = filteredData.map(item => ({
        "Dátum": item.date,
        "Stavba": item.siteName,
        "Pracovník": item.workerName,
        "Pozícia": item.workerRole,
        "Začiatok": item.startTime,
        "Koniec": item.endTime,
        "Obed": item.lunchDuration,
        "Odpracované hodiny": Number(item.hours.toFixed(2)),
        "Zapísal": item.foremanName
    }));

    // @ts-ignore
    const ws = XLSX.utils.json_to_sheet(exportData);
    // @ts-ignore
    const wb = XLSX.utils.book_new();
    // @ts-ignore
    XLSX.utils.book_append_sheet(wb, ws, "Výkaz Práce");
    // @ts-ignore
    XLSX.writeFile(wb, `MION_Report_${dateFrom}_${dateTo}.xlsx`);
  };

  return (
    <div className="p-4 pt-8 pb-24 md:p-12 md:pb-12 max-w-lg md:max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="md:hidden w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-black italic text-sm shadow-lg shadow-red-900/50">
            04
        </div>
        <h2 className="text-xl md:text-3xl font-black text-white uppercase italic tracking-wide">Export & Reporty</h2>
      </div>

      {/* Filters */}
      <div className="bg-[#111] p-5 rounded-xl border border-white/5 space-y-4 mb-6 relative overflow-hidden md:p-6">
        <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
        
        <div className="flex items-center gap-2 mb-2 text-zinc-400">
            <Filter size={16} />
            <span className="text-[10px] uppercase font-bold tracking-widest">Nastavenia Filtra</span>
        </div>

        {/* Responsive Grid for Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
             <div className="space-y-1">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Od</label>
                <input 
                    type="date" 
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded-lg px-2 py-2 text-xs text-white outline-none focus:border-red-600 [color-scheme:dark] md:py-3 md:text-sm"
                />
            </div>
            <div className="space-y-1">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Do</label>
                <input 
                    type="date" 
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded-lg px-2 py-2 text-xs text-white outline-none focus:border-red-600 [color-scheme:dark] md:py-3 md:text-sm"
                />
            </div>

            <div className="space-y-1 col-span-2 md:col-span-1">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Pracovník</label>
                <select 
                    value={selectedWorkerId}
                    onChange={(e) => setSelectedWorkerId(e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-2 md:py-3 text-sm text-white outline-none focus:border-red-600 appearance-none"
                >
                    <option value="all">Všetci pracovníci</option>
                    {workers.map(w => (
                        <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-1 col-span-2 md:col-span-1">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Stavba</label>
                <select 
                    value={selectedSiteId}
                    onChange={(e) => setSelectedSiteId(e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 rounded-lg px-3 py-2 md:py-3 text-sm text-white outline-none focus:border-red-600 appearance-none"
                >
                    <option value="all">Všetky stavby</option>
                    {sites.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>
            </div>
        </div>
      </div>

      {/* Stats Summary - Responsive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#111] p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center">
            <Calculator className="text-red-600 mb-2" size={24} />
            <span className="text-2xl font-black text-white">{totalHours.toFixed(1)}</span>
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Celkom Hodín</span>
        </div>
        <div className="bg-[#111] p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center">
             <Calendar className="text-zinc-500 mb-2" size={24} />
            <span className="text-2xl font-black text-white">{filteredData.length}</span>
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Záznamov</span>
        </div>
        <div className="col-span-2 md:col-start-4">
             <button 
                onClick={handleExport}
                disabled={filteredData.length === 0}
                className="w-full h-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-green-900/20 transition-all flex items-center justify-center gap-3 group uppercase tracking-wider"
            >
                <Download size={20} className="group-hover:scale-110 transition-transform" />
                <span>Export .XLSX</span>
            </button>
        </div>
      </div>

      {/* Preview List (Responsive Table/List) */}
      <div className="space-y-2">
        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 pl-1">Náhľad (posledných 10)</h3>
        
        <div className="hidden md:block bg-[#111] rounded-xl border border-white/5 overflow-hidden">
             <table className="w-full text-left">
                <thead>
                    <tr className="bg-white/5 border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        <th className="p-3">Dátum</th>
                        <th className="p-3">Pracovník</th>
                        <th className="p-3">Stavba</th>
                        <th className="p-3 text-right">Hodiny</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {filteredData.slice(0, 10).map(item => (
                         <tr key={item.id} className="text-sm">
                            <td className="p-3 text-white">{new Date(item.date).toLocaleDateString('sk-SK')}</td>
                            <td className="p-3 text-white font-bold">{item.workerName}</td>
                            <td className="p-3 text-zinc-400">{item.siteName}</td>
                            <td className="p-3 text-right font-mono text-white">{item.hours.toFixed(1)}h</td>
                         </tr>
                    ))}
                </tbody>
             </table>
        </div>

        {/* Mobile Preview */}
        <div className="md:hidden space-y-2">
            {filteredData.slice(0, 5).map(item => (
                <div key={item.id} className="bg-[#111] p-3 rounded-lg border border-white/5 flex justify-between items-center text-xs">
                    <div>
                        <span className="text-white font-bold block">{item.workerName}</span>
                        <span className="text-zinc-500">{item.siteName}</span>
                    </div>
                    <div className="text-right">
                        <span className="text-white font-bold block">{item.hours.toFixed(1)}h</span>
                        <span className="text-zinc-500">{new Date(item.date).toLocaleDateString('sk-SK')}</span>
                    </div>
                </div>
            ))}
        </div>

        {filteredData.length === 0 && (
            <div className="text-center py-4 text-zinc-600 text-xs">Žiadne dáta pre zvolený filter</div>
        )}
      </div>

    </div>
  );
};