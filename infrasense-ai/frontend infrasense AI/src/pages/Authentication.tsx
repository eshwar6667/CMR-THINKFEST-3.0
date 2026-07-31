import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Mail, Lock, User as UserIcon, Phone, MapPin, Building2 } from 'lucide-react';

export const Authentication: React.FC = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'Citizen' | 'Municipal Officer'>('Citizen');
  
  // Login form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Signup form fields
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupWard, setSignupWard] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      await login(email || 'citizen@example.com', role);
      if (role === 'Citizen') {
        navigate('/citizen/dashboard');
      } else {
        navigate('/officer/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      await signup(signupName, signupEmail, signupPhone, signupWard);
      navigate('/citizen/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-darkbg py-12 px-4 sm:px-6 lg:px-8 select-none transition-colors duration-200">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white dark:bg-darkbg-card rounded-3xl overflow-hidden shadow-glass border border-slate-100 dark:border-darkbg-border">
        
        {/* Visual Info Card (Left) */}
        <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-brand-700 via-brand-600 to-tealbrand-600 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/5 translate-x-20 -translate-y-10 blur-2xl" />
          
          <div className="flex items-center gap-2 relative z-10">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
              <Compass className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm uppercase tracking-wider">InfraSense AI</h2>
              <span className="text-[9px] text-brand-100">Smart City Sentinel</span>
            </div>
          </div>

          <div className="space-y-4 relative z-10">
            <h1 className="text-2xl font-extrabold leading-tight">
              AI-Powered Civic Maintenance
            </h1>
            <p className="text-xs text-brand-100 leading-relaxed">
              Report public damages with coordinates, track progress timelines, and verify repairs seamlessly with smart routing algorithms.
            </p>
          </div>

          <div className="text-[10px] text-brand-200 relative z-10">
            © 2026 Smart City Authorities. All Rights Reserved.
          </div>
        </div>

        {/* Form Card (Right) */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              {isLogin ? 'Welcome Back' : 'Create Citizen Account'}
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              {isLogin ? 'Access your smart city portal' : 'Register to submit damage reports'}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 text-critical text-xs rounded-xl border border-red-200 dark:border-red-900/30 text-center font-medium animate-shake">
              {errorMsg}
            </div>
          )}

          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              {/* Role Toggle Selector */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 block">Portal Access Role</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-darkbg-input rounded-xl">
                  <button
                    type="button"
                    onClick={() => { setRole('Citizen'); setErrorMsg(null); }}
                    className={`py-2 text-center rounded-lg font-bold transition-all ${
                      role === 'Citizen' 
                        ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                    }`}
                  >
                    Citizen
                  </button>
                  <button
                    type="button"
                    onClick={() => { setRole('Municipal Officer'); setErrorMsg(null); }}
                    className={`py-2 text-center rounded-lg font-bold transition-all ${
                      role === 'Municipal Officer'
                        ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                    }`}
                  >
                    Officer
                  </button>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 block">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={role === 'Citizen' ? 'citizen@example.com' : 'officer@example.com'}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 block">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              {role === 'Municipal Officer' && (
                <div className="p-3 bg-blue-50/50 dark:bg-blue-950/10 text-brand-600 dark:text-brand-400 border border-brand-100 dark:border-brand-900/20 rounded-xl flex items-start gap-2 select-none">
                  <Building2 className="h-4 w-4 shrink-0 mt-0.5" />
                  <span className="text-[10px] font-medium leading-relaxed">
                    Municipal accounts are issued by the administration. Signup is restricted.
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md transition-colors"
              >
                {loading ? 'Authenticating...' : 'Sign In Portal'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setIsLogin(false); setErrorMsg(null); }}
                  className="text-brand-500 hover:underline font-semibold"
                >
                  Need a citizen account? Sign up
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-4 text-xs">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 block">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <UserIcon className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 block">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 block">Phone Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <Phone className="h-4 w-4" />
                  </span>
                  <input
                    type="tel"
                    required
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    placeholder="555-0199"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              {/* Ward / Address */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 block">Address / Municipal Ward</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={signupWard}
                    onChange={(e) => setSignupWard(e.target.value)}
                    placeholder="Ward 4, Green Avenue"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 block">Create Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-darkbg-border bg-white dark:bg-darkbg-input text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md transition-colors"
              >
                {loading ? 'Registering...' : 'Sign Up Account'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setIsLogin(true); setErrorMsg(null); }}
                  className="text-brand-500 hover:underline font-semibold"
                >
                  Already have an account? Log in
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
export default Authentication;
