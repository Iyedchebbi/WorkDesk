
import React, { useState } from 'react';
// Fix: Use namespace import to resolve 'no exported member' errors for react-router-dom components
import * as ReactRouterDOM from 'react-router-dom';
const { Link, useNavigate } = ReactRouterDOM as any;
import { Briefcase, User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { auth, db, googleProvider } from '../firebase';

export const Signup: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(formData.email, formData.password);
      const user = userCredential.user;
      
      if (user) {
        await user.updateProfile({
          displayName: formData.name,
          photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=22D3EE&color=020617`
        });

        await db.collection('profiles').doc(user.uid).set({
          name: formData.name,
          email: formData.email,
          role: 'Freelancer',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=22D3EE&color=020617`,
          planType: 'free',
          credits: 3,
          createdAt: new Date().toISOString()
        });
      }

      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const result = await auth.signInWithPopup(googleProvider);
      const user = result.user;

      if (user) {
        await db.collection('profiles').doc(user.uid).set({
          name: user.displayName || 'New User',
          email: user.email || '',
          role: 'Freelancer',
          avatar: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=22D3EE&color=020617`,
          planType: 'free',
          credits: 3,
          createdAt: new Date().toISOString()
        }, { merge: true });
      }

      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google signup failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  const passwordStrength = (pwd: string) => {
    if (pwd.length === 0) return 0;
    let strength = 0;
    if (pwd.length > 6) strength += 1;
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    return strength;
  };

  const strength = passwordStrength(formData.password);

  return (
    <div className="min-h-screen bg-[#020617] text-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-900/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8">
          <Link to="/home" className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-tr from-[#22D3EE] to-[#3B82F6] p-2 rounded-lg">
              <Briefcase size={28} className="text-white" />
            </div>
            <span className="text-3xl font-bold tracking-tight">WorkDesk</span>
          </Link>
          <h2 className="text-2xl font-bold">Create your desk</h2>
          <p className="text-[#94A3B8] mt-2">Join 10,000+ freelancers managing their business better.</p>
        </div>

        <div className="bg-[#0F172A] border border-[#1E2938] p-8 rounded-2xl shadow-2xl">
          {error && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleSignUp}
            disabled={googleLoading || loading}
            className="w-full mb-6 py-3 px-4 bg-white text-gray-900 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-gray-100 transition-all disabled:opacity-50"
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin"></div>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign up with Google
              </>
            )}
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#1E2938]"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0F172A] px-2 text-[#94A3B8]">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#94A3B8]">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Alex Rivera"
                  className="w-full bg-[#020617] border border-[#1E2938] rounded-xl py-3 pl-10 pr-4 text-[#F8FAFC] focus:outline-none focus:border-[#22D3EE] transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#94A3B8]">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full bg-[#020617] border border-[#1E2938] rounded-xl py-3 pl-10 pr-4 text-[#F8FAFC] focus:outline-none focus:border-[#22D3EE] transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#94A3B8]">Create Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-[#020617] border border-[#1E2938] rounded-xl py-3 pl-10 pr-12 text-[#F8FAFC] focus:outline-none focus:border-[#22D3EE] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {formData.password && (
                <div className="pt-2">
                  <div className="flex gap-1 h-1.5 mb-2">
                    <div className={`flex-1 rounded-full transition-colors ${strength >= 1 ? 'bg-rose-500' : 'bg-[#1E2938]'}`}></div>
                    <div className={`flex-1 rounded-full transition-colors ${strength >= 2 ? 'bg-amber-500' : 'bg-[#1E2938]'}`}></div>
                    <div className={`flex-1 rounded-full transition-colors ${strength >= 3 ? 'bg-emerald-500' : 'bg-[#1E2938]'}`}></div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full bg-[#22D3EE] text-[#020617] py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-cyan-300 transition-all disabled:opacity-50 mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#020617]/30 border-t-[#020617] rounded-full animate-spin"></div>
              ) : (
                <>Create Account <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-[#94A3B8]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#22D3EE] font-bold hover:underline">Log in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
