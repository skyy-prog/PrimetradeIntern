import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, KeyRound, User as UserIcon, Loader2, ArrowRight } from 'lucide-react';

const Register = ({ onNavigateToLogin }) => {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register(username, email, password, role);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fcfcfc] px-4 relative grid-dots">
      <div className="w-full max-w-md bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] p-8 flex flex-col items-center animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-[#ff9ff3] border-4 border-black flex items-center justify-center mb-6 shadow-[3px_3px_0px_0px_#000000]">
          <UserPlus className="text-black" size={28} />
        </div>

        <h2 className="text-3xl font-black text-black tracking-tight text-center mb-2 uppercase">
          Register Node
        </h2>
        <p className="text-slate-650 text-xs font-bold uppercase tracking-widest text-center mb-8">
          Initialize database credentials
        </p>

        {error && (
          <div className="w-full p-4 text-xs font-bold text-black bg-[#ff6b6b] border-2 border-black shadow-[3px_3px_0px_0px_#000000] mb-5 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div className="relative">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={18} />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-12 pr-4 py-3 brutal-input text-slate-900 font-bold placeholder-slate-400 text-sm"
              placeholder="ENTER UNIQUE USERNAME"
              required
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 brutal-input text-slate-900 font-bold placeholder-slate-400 text-sm"
              placeholder="ENTER EMAIL ADDRESS"
              required
            />
          </div>

          <div className="relative">
            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={18} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-3 brutal-input text-slate-900 font-bold placeholder-slate-400 text-sm"
              placeholder="ENTER PASSWORD (MIN 6 CHARS)"
              required
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
              Privilege Level
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`py-2.5 px-4 font-black text-xs uppercase tracking-wider transition-all border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000000] ${
                  role === 'user' ? 'bg-[#54a0ff] text-black' : 'bg-white text-black'
                }`}
              >
                Regular User
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2.5 px-4 font-black text-xs uppercase tracking-wider transition-all border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000000] ${
                  role === 'admin' ? 'bg-[#ff9ff3] text-black' : 'bg-white text-black'
                }`}
              >
                Administrator
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#000000] text-white border-2 border-black font-black uppercase tracking-wider text-sm hover:bg-slate-900 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#1dd1a1] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000000] disabled:opacity-50 flex items-center justify-center space-x-2 transition-all"
          >
            {loading ? (
              <Loader2 className="animate-spin text-white" size={18} />
            ) : (
              <>
                <span>Initialize node</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          <span>Active credentials?</span>
          <button
            onClick={onNavigateToLogin}
            className="font-black text-rose-500 hover:underline transition-all"
          >
            Access System
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
