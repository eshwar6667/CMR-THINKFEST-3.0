import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';
import { Compass, Lock, Mail, User as UserIcon } from 'lucide-react';

export const Authentication: React.FC = () => {
  const navigate = useNavigate();
  const { login, signup, forgotPassword, verifyOtp, resetPassword } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'forgot' | 'otp' | 'reset'>('login');
  const [role, setRole] = useState<UserRole>('Municipality Officer');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setErrorMsg('');
    try {
      await login(email, role);
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMsg('Login failed. Please inspect details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !password) return;
    setLoading(true);
    setErrorMsg('');
    try {
      await signup(name, email, role);
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg('Signup failed. Account validation error.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setErrorMsg('');
    try {
      await forgotPassword(email);
      setSuccessMsg('One-time verification code dispatched to email address.');
      setActiveTab('otp');
    } catch (err) {
      setErrorMsg('Email address not registered.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const ok = await verifyOtp(otp);
      if (ok) {
        setSuccessMsg('Authentication verified. Set new password credentials.');
        setActiveTab('reset');
      } else {
        setErrorMsg('Invalid code entered.');
      }
    } catch (err) {
      setErrorMsg('Otp error.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    setErrorMsg('');
    try {
      await resetPassword(password);
      setSuccessMsg('Password updated. Proceed to sign in.');
      setActiveTab('login');
    } catch (err) {
      setErrorMsg('Error updating password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-slate-900 px-4 select-none relative overflow-hidden font-sans">
      {/* Decorative gradient glowing spheres */}
      <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-brand-500/10 blur-[100px]" />
      <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-tealbrand-500/10 blur-[100px]" />

      <div className="w-full max-w-md bg-slate-800/60 border border-slate-700/60 rounded-3xl p-8 backdrop-blur-md shadow-glass-dark space-y-6">
        {/* Brand */}
        <div className="text-center flex flex-col items-center gap-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-tealbrand-500 shadow-md">
            <Compass className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-wider text-white uppercase">
              InfraSense AI
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-0.5">
              Infrastructure Analytics Platform
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 text-xs text-red-400 bg-red-950/20 border border-red-900/30 rounded-xl">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 text-xs text-green-400 bg-green-950/20 border border-green-900/30 rounded-xl">
            {successMsg}
          </div>
        )}

        {/* Tab selection for Login vs SignUp */}
        {(activeTab === 'login' || activeTab === 'signup') && (
          <div className="flex border-b border-slate-700">
            <button
              onClick={() => {
                setActiveTab('login');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 pb-3 text-xs font-bold transition-all ${
                activeTab === 'login' ? 'text-brand-400 border-b-2 border-brand-500' : 'text-slate-400'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setActiveTab('signup');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 pb-3 text-xs font-bold transition-all ${
                activeTab === 'signup' ? 'text-brand-400 border-b-2 border-brand-500' : 'text-slate-400'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Login Page */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Role dropdown selection */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Access Clearance Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full text-xs p-3 rounded-xl border border-slate-700 bg-slate-900/50 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="Citizen">Citizen User</option>
                <option value="Municipality Officer">Municipality Officer</option>
                <option value="Engineer">Lead Engineer</option>
                <option value="Admin">Administrator</option>
                <option value="State Authority">State Oversight Authority</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. officer@city.gov"
                  className="w-full text-xs p-3 pl-10 rounded-xl border border-slate-700 bg-slate-900/50 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  required
                />
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Password</label>
                <button
                  type="button"
                  onClick={() => setActiveTab('forgot')}
                  className="text-[10px] text-brand-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs p-3 pl-10 rounded-xl border border-slate-700 bg-slate-900/50 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  required
                />
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white text-xs font-bold rounded-xl transition-all shadow-lg hover:shadow-brand-900/10"
            >
              {loading ? 'Authorizing Access...' : 'Authenticate Credentials'}
            </button>
          </form>
        )}

        {/* Signup Page */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Clearance Clearance Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full text-xs p-3 rounded-xl border border-slate-700 bg-slate-900/50 text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="Citizen">Citizen User</option>
                <option value="Municipality Officer">Municipality Officer</option>
                <option value="Engineer">Lead Engineer</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sarah Connor"
                  className="w-full text-xs p-3 pl-10 rounded-xl border border-slate-700 bg-slate-900/50 text-slate-200 focus:outline-none"
                  required
                />
                <UserIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@city.gov"
                  className="w-full text-xs p-3 pl-10 rounded-xl border border-slate-700 bg-slate-900/50 text-slate-200 focus:outline-none"
                  required
                />
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Choose strong password"
                  className="w-full text-xs p-3 pl-10 rounded-xl border border-slate-700 bg-slate-900/50 text-slate-200 focus:outline-none"
                  required
                />
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-brand-600 to-brand-700 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
            >
              {loading ? 'Scaffolding profile...' : 'Initialize User Profile'}
            </button>
          </form>
        )}

        {/* Forgot Password */}
        {activeTab === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <div>
              <h2 className="text-sm font-bold text-white mb-1">Verify Account Ownership</h2>
              <p className="text-[10px] text-slate-450 leading-normal">
                Enter your registered municipal email to dispatch a secure 6-digit verification code.
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@city.gov"
                className="w-full text-xs p-3 rounded-xl border border-slate-700 bg-slate-900/50 text-slate-200 focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl"
            >
              Request Code
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className="w-full text-center text-xs text-slate-400 hover:underline pt-2"
            >
              Back to Sign In
            </button>
          </form>
        )}

        {/* OTP Input */}
        {activeTab === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div>
              <h2 className="text-sm font-bold text-white mb-1">Enter Verification Code</h2>
              <p className="text-[10px] text-slate-450 leading-normal">
                A verification code has been dispatched to your inbox. Enter the code below to reset password credentials. (Hint: enter '123456')
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Verification Code</label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full text-center text-sm font-mono tracking-widest p-3 rounded-xl border border-slate-700 bg-slate-900/50 text-slate-200 focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl"
            >
              Validate Code
            </button>
          </form>
        )}

        {/* Reset Password */}
        {activeTab === 'reset' && (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <div>
              <h2 className="text-sm font-bold text-white mb-1">Set New Password</h2>
              <p className="text-[10px] text-slate-450 leading-normal">
                Set a strong password to guard access to the command center database.
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs p-3 rounded-xl border border-slate-700 bg-slate-900/50 text-slate-200 focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl"
            >
              Update Credentials
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
export default Authentication;
