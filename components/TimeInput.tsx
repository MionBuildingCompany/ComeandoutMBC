import React from 'react';
import { Minus, Plus } from 'lucide-react';

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
      <div className="flex items-center gap-2">
        {/* Decrease Button */}
        <button
            onClick={(e) => { e.preventDefault(); adjustTime(isDuration ? -5 : -15); }}
            className="w-12 h-14 bg-[#111] border border-white/10 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all"
            type="button"
        >
            <Minus size={20} />
        </button>

        {/* Display / Native Input */}
        <div className="flex-1 relative h-14 bg-[#111] border border-white/10 rounded-lg overflow-hidden focus-within:border-red-600/50 transition-colors">
             <input
                type="time" 
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-full text-center text-xl font-black text-white bg-transparent outline-none [color-scheme:dark] px-2"
            />
        </div>

        {/* Increase Button */}
        <button
            onClick={(e) => { e.preventDefault(); adjustTime(isDuration ? 5 : 15); }}
            className="w-12 h-14 bg-[#111] border border-white/10 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all"
            type="button"
        >
            <Plus size={20} />
        </button>
      </div>
    </div>
  );
};