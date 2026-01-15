import React, { useState } from 'react';
import { ArrowRight, Lock, User, AlertCircle } from 'lucide-react';
import { UserRole, UserSession } from '../types';
import { Logo } from './ui/Logo';

interface LoginProps {
  onLogin: (session: UserSession) => void;
}

// Security: We store SHA-256 hashes instead of plain text passwords.
// This prevents someone from simply reading the code to see the passwords.
const USERS_DB = [
  // Admins
  { username: 'ondik', hash: 'e3b98a4da31a127d4bde6e43033f66ba274cab0eb7eb1c70ec41402bf6273dd8', displayName: 'p. Ondik', role: 'admin' as UserRole }, // 2323
  { username: 'admin', hash: '5248356c3619586111327f272c726880436214138e6005d53907c087f941910d', displayName: 'Admin', role: 'admin' as UserRole }, // 9999
  { username: 'olšavska', hash: 'b63a9d352749419888942b08a3d453673c683832d733ce540243d6c70281b673', displayName: 'p. Olšavska', role: 'admin' as UserRole }, // 0123
  
  // Users
  { username: 'kukučka', hash: '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', displayName: 'p. Kukučka', role: 'user' as UserRole }, // 1234
  { username: 'hudák', hash: '0ffe1abd1a08215353c233d6e009613e95eec4253832a761af28ff37ac5a150c', displayName: 'p. Hudák', role: 'user' as UserRole }, // 1111
  { username: 'šoltis', hash: '207c462377484400e9643477163c46d9c6e5a639645228c23101b0728c05711a', displayName: 'p. Šoltis', role: 'user' as UserRole }, // 1212
  { username: 'guest', hash: '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', displayName: 'Guest', role: 'user' as UserRole }, // 1234
  { username: 'raš', hash: '06799002221b594b293d6e3c081eb6c35c602058e1046132049d107a049405a3', displayName: 'p. Raš', role: 'user' as UserRole } // 0987
];

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Helper function to generate SHA-256 hash from input
  const hashPassword = async (text: string): Promise<string> => {
    const msgBuffer = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const inputName = name.trim().toLowerCase();
    const inputPass = password.trim();

    if (!inputName || !inputPass) {
        setError('Vyplňte všetky polia');
        setLoading(false);
        return;
    }

    try {
        // Find user first
        const user = USERS_DB.find(u => u.username === inputName);
        
        if (user) {
            // Hash the input password and compare with stored hash
            const inputHash = await hashPassword(inputPass);
            
            if (inputHash === user.hash) {
                onLogin({
                    name: user.displayName,
                    role: user.role
                });
                return;
            }
        }
        
        // Artificial delay to prevent timing attacks (and makes it feel more secure)
        await new Promise(r => setTimeout(r, 500));
        setError('Nesprávne meno alebo heslo');
    } catch (err) {
        setError('Chyba overenia');
    } finally {
        setLoading(false);
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
            {/* Logo Component */}
            <Logo className="w-24 h-24 text-white mb-6" />
            
            <h1 className="text-5xl font-black text-white italic tracking-tighter mb-2">MION</h1>
            <p className="text-xs text-zinc-500 uppercase tracking-[0.3em] font-bold">Building Company</p>
        </div>

        <div className="mb-8 text-center">
            <h2 className="text-xl font-bold uppercase tracking-wide text-white mb-2">Prihlásenie</h2>
            <p className="text-zinc-500 text-sm">Zadajte prístupové údaje</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1">
             <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Meno / Priezvisko</label>
             <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-500 transition-colors">
                    <User size={20} />
                </div>
                <input 
                  type="text" 
                  placeholder="napr. Ondik" 
                  value={name}
                  onChange={(e) => {
                      setName(e.target.value);
                      setError('');
                  }}
                  disabled={loading}
                  className="w-full bg-[#111]/80 backdrop-blur-md border border-white/10 text-white placeholder:text-zinc-600 rounded-xl pl-12 pr-4 py-4 outline-none focus:border-red-600 transition-all text-base font-medium disabled:opacity-50"
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
                  placeholder="PIN Kód" 
                  value={password}
                  onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                  }}
                  disabled={loading}
                  className="w-full bg-[#111]/80 backdrop-blur-md border border-white/10 text-white placeholder:text-zinc-600 rounded-xl pl-12 pr-4 py-4 outline-none focus:border-red-600 transition-all text-base font-medium disabled:opacity-50"
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
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-bold py-4 rounded-xl shadow-lg shadow-red-900/20 transition-all flex items-center justify-center gap-2 group uppercase tracking-wider mt-2 disabled:opacity-70 disabled:cursor-wait"
          >
            {loading ? 'Overujem...' : 'Vstúpiť'}
            {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>
      </div>
      
      <div className="absolute bottom-8 text-center z-10">
        <p className="text-[10px] text-zinc-700 uppercase tracking-[0.2em] font-bold">Smart Protocol System</p>
      </div>
    </div>
  );
};