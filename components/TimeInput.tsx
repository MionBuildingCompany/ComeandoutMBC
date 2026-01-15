import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface TimeInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isDuration?: boolean; 
}

export const TimeInput: React.FC<TimeInputProps> = ({ label, value, onChange, isDuration = false }) => {
  
  const parseMinutes = (timeStr: string): number => {
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const formatMinutes = (totalMinutes: number): string => {
    let m = totalMinutes % 60;
    let h = Math.floor(totalMinutes / 60);
    
    if (!isDuration) {
        if (h >= 24) h = h % 24;
        if (h < 0) h = 23; 
    } else {
        if (h < 0) h = 0;
        if (h === 0 && m < 0) m = 0;
    }

    const hStr = h.toString().padStart(2, '0');
    const mStr = Math.abs(m).toString().padStart(2, '0');
    return `${hStr}:${mStr}`;
  };

  const adjustTime = (delta: number) => {
    const currentMins = parseMinutes(value);
    const newMins = currentMins + delta;
    onChange(formatMinutes(newMins));
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</label>
      <div className="flex items-center bg-[#111] border border-white/10 rounded-lg overflow-hidden h-14 transition-colors focus-within:border-red-600/50">
        <input
          type="time" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-4 text-xl font-bold text-white outline-none h-full bg-transparent [color-scheme:dark]"
        />
        <div className="flex flex-col border-l border-white/10 h-full w-12">
          <button
            onClick={(e) => { e.preventDefault(); adjustTime(isDuration ? 5 : 15); }}
            className="flex-1 flex items-center justify-center hover:bg-white/10 active:bg-white/20 transition-colors text-zinc-400"
            type="button"
          >
            <ChevronUp size={16} />
          </button>
          <div className="h-[1px] bg-white/10 w-full" />
          <button
            onClick={(e) => { e.preventDefault(); adjustTime(isDuration ? -5 : -15); }}
            className="flex-1 flex items-center justify-center hover:bg-white/10 active:bg-white/20 transition-colors text-zinc-400"
            type="button"
          >
            <ChevronDown size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};