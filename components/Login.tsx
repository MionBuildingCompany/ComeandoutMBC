import React, { useState } from 'react';
import { ArrowRight, Lock, User, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (name: string) => void;
}

// Hardcoded users for authentication
const ALLOWED_USERS = [
  { name: 'Štefan Kukučka', password: '190305' }
];

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !password.trim()) {
        setError('Vyplňte všetky polia');
        return;
    }

    // Case-insensitive name check
    const user = ALLOWED_USERS.find(u => u.name.toLowerCase() === name.trim().toLowerCase());

    if (user && user.password === password.trim()) {
      onLogin(user.name);
    } else {
      setError('Nesprávne meno alebo heslo');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Image - Three Workers with Laptop */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(4px)'
        }}
      />
      
      {/* Background glow effects */}
      <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[300px] h-[300px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="w-full max-w-sm relative z-10">
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-red-600 rounded-lg -skew-x-12 flex items-center justify-center shadow-lg shadow-red-900/40">
                <span className="text-white font-black text-2xl italic">M</span>
            </div>
            <div className="flex flex-col">
                <h1 className="text-3xl font-black text-white italic leading-none tracking-tighter">MION</h1>
            </div>
          </div>
          <p className="text-red-600 font-bold tracking-[0.3em] text-[10px] uppercase pl-1">Building Company</p>
        </div>

        <div className="mb-8 text-center">
            <h2 className="text-xl font-bold uppercase tracking-wide text-white mb-2">Prihlásenie</h2>
            <p className="text-zinc-500 text-sm">Zadajte prístupové údaje</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1">
             <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Meno</label>
             <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-500 transition-colors">
                    <User size={20} />
                </div>
                <input 
                  type="text" 
                  placeholder="Meno a Priezvisko" 
                  value={name}
                  onChange={(e) => {
                      setName(e.target.value);
                      setError('');
                  }}
                  className="w-full bg-[#111]/80 backdrop-blur-md border border-white/10 text-white placeholder:text-zinc-600 rounded-xl pl-12 pr-4 py-4 outline-none focus:border-red-600 transition-all text-base font-medium"
                />
             </div>
          </div>

          <div className="space-y-1">
             <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Heslo</label>
             <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-500 transition-colors">
                    <Lock size={20} />
                </div>
                <input 
                  type="password" 
                  placeholder="Heslo" 
                  value={password}
                  onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                  }}
                  className="w-full bg-[#111]/80 backdrop-blur-md border border-white/10 text-white placeholder:text-zinc-600 rounded-xl pl-12 pr-4 py-4 outline-none focus:border-red-600 transition-all text-base font-medium"
                />
             </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-sm font-medium animate-in slide-in-from-top-2">
                <AlertCircle size={16} />
                <span>{error}</span>
            </div>
          )}
          
          <button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-bold py-4 rounded-xl shadow-lg shadow-red-900/20 transition-all flex items-center justify-center gap-2 group uppercase tracking-wider mt-2"
          >
            Vstúpiť
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
      
      <div className="absolute bottom-8 text-center z-10">
        <p className="text-[10px] text-zinc-700 uppercase tracking-[0.2em] font-bold">Smart Protocol System</p>
      </div>
    </div>
  );
};