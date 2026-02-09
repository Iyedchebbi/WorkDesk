
import React, { useState, useEffect, useRef } from 'react';
import { User, Bell, Shield, Palette, Save, Briefcase, CheckCircle2, Upload, Camera, CreditCard, Zap, ExternalLink } from 'lucide-react';
import { UserProfile } from '../types';
import { STRIPE_LINKS } from '../constants';

interface SettingsProps {
  user: UserProfile;
  onUpdateUser: (u: UserProfile) => Promise<void>;
}

const CLOUDINARY_CLOUD_NAME = 'dcgucncag'; 
const CLOUDINARY_UPLOAD_PRESET = 've80qejl';

export const Settings: React.FC<SettingsProps> = ({ user, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'billing'>('profile');
  const [formData, setFormData] = useState(user);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: data });
      if (!response.ok) throw new Error('Cloudinary upload failed');
      const result = await response.json();
      return result.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return null;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File is too large. Please select an image under 5MB.");
        return;
      }
      setIsUploading(true);
      const imageUrl = await uploadToCloudinary(file);
      if (imageUrl) {
        const updated = { ...formData, avatar: imageUrl };
        setFormData(updated);
        try {
          await onUpdateUser(updated);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        } catch (err) { console.error("Auto-save avatar failed", err); }
      }
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setShowSuccess(false);
    try {
      await onUpdateUser(formData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err: any) {
      alert('Error updating profile: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const planName = user.planType === 'free' ? 'Free Starter' : user.planType === 'pro' ? 'Professional' : 'Agency';

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-[#F8FAFC]">Settings</h1>
        <p className="text-[#94A3B8]">Manage your professional profile and billing details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1 space-y-1">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'billing', label: 'Billing', icon: CreditCard },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === item.id 
                  ? 'bg-[#22D3EE]/10 text-[#22D3EE] shadow-[inset_0_0_10px_rgba(34,211,238,0.05)]' 
                  : 'text-[#475569] hover:bg-[#1E293B] hover:text-[#F8FAFC]'
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
          <div className="pt-4 px-4">
             <div className="p-3 rounded-xl bg-gradient-to-br from-[#22D3EE]/5 to-transparent border border-[#22D3EE]/10">
                <p className="text-[10px] font-black text-[#22D3EE] uppercase tracking-[0.2em] mb-1">Active Plan</p>
                <p className="text-sm font-bold text-white mb-2">{planName}</p>
                <div className="w-full h-1 bg-[#1E293B] rounded-full overflow-hidden">
                   <div className="h-full bg-[#22D3EE]" style={{ width: '100%' }}></div>
                </div>
             </div>
          </div>
        </aside>

        <div className="md:col-span-3">
          {activeTab === 'profile' ? (
            <form onSubmit={handleSubmit} className="p-8 rounded-2xl border border-[#1E293B] bg-[#0F172A] space-y-6 shadow-2xl relative">
              {showSuccess && (
                <div className="absolute top-4 right-8 animate-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-sm font-medium shadow-lg">
                    <CheckCircle2 size={16} />
                    Changes saved!
                  </div>
                </div>
              )}

              <div className="flex items-center gap-6 pb-6 border-b border-[#1E293B]">
                <div className="relative group cursor-pointer" onClick={triggerFileInput}>
                  <div className={`w-24 h-24 rounded-[2rem] border-2 border-[#1E2938] overflow-hidden bg-[#1E2938] transition-all group-hover:border-[#22D3EE]/50 ${isUploading ? 'opacity-50' : ''}`}>
                    <img 
                      src={formData.avatar} 
                      className="w-full h-full object-cover" 
                      alt="Profile" 
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=22D3EE&color=020617`; }}
                    />
                    {isUploading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-[#22D3EE] border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity text-white">
                    <Camera size={24} />
                  </div>
                </div>
                
                <div>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                  <button type="button" onClick={triggerFileInput} disabled={isUploading} className="flex items-center gap-2 px-4 py-2 bg-[#1E293B] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#2D3748] transition-all border border-[#1E293B] shadow-sm">
                    <Upload size={14} /> {isUploading ? 'Uploading...' : 'Update Avatar'}
                  </button>
                  <p className="text-[10px] text-[#475569] uppercase tracking-widest mt-3 font-bold">Max size 5MB • PNG, JPG</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#475569] uppercase tracking-[0.2em]">Full Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-[#020617] border border-[#1E2938] rounded-xl p-3 text-white focus:border-[#22D3EE] outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#475569] uppercase tracking-[0.2em]">Email Address</label>
                  <input type="email" value={formData.email} disabled className="w-full bg-[#020617]/50 border border-[#1E2938] rounded-xl p-3 text-[#475569] cursor-not-allowed outline-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#475569] uppercase tracking-[0.2em]">Professional Role</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-[#475569]" size={18} />
                  <input type="text" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} placeholder="e.g. Lead Developer" className="w-full bg-[#020617] border border-[#1E2938] rounded-xl py-3 pl-10 pr-4 text-white focus:border-[#22D3EE] outline-none transition-all" />
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <button type="submit" disabled={isSaving || isUploading} className="flex items-center gap-2 px-8 py-4 bg-[#22D3EE] text-[#020617] font-black uppercase tracking-widest rounded-2xl hover:bg-cyan-300 transition-all shadow-lg shadow-[#22D3EE20] disabled:opacity-50">
                  {isSaving ? <div className="w-5 h-5 border-2 border-[#020617]/30 border-t-[#020617] rounded-full animate-spin" /> : <><Save size={18} /> Save Settings</>}
                </button>
              </div>
            </form>
          ) : (
            <div className="p-8 rounded-2xl border border-[#1E293B] bg-[#0F172A] shadow-2xl space-y-8 animate-in slide-in-from-right-4">
              <div className="flex items-start justify-between p-6 rounded-2xl bg-[#020617] border border-[#22D3EE]/20 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Zap size={100} className="text-[#22D3EE]" />
                 </div>
                 <div className="relative z-10">
                    <p className="text-[10px] font-black text-[#22D3EE] uppercase tracking-[0.4em] mb-2">Current Subscription</p>
                    <h2 className="text-3xl font-black text-white">{planName}</h2>
                    <p className="text-sm text-[#94A3B8] mt-2">Your plan is active. You have <b>{user.credits} credits</b> remaining to use for projects and tasks.</p>
                 </div>
                 <div className="text-right relative z-10">
                    <p className="text-2xl font-black text-white">${user.planType === 'free' ? '0' : user.planType === 'pro' ? '5' : '10'}</p>
                    <p className="text-[10px] font-bold text-[#475569] uppercase tracking-widest">per month</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <a href={`${STRIPE_LINKS.pro}?prefilled_email=${encodeURIComponent(user.email)}`} target="_blank" rel="noopener noreferrer" className={`p-6 rounded-2xl border transition-all ${user.planType === 'pro' ? 'border-[#22D3EE] bg-[#22D3EE]/5' : 'border-[#1E293B] bg-[#020617] hover:border-[#22D3EE]/50 group'}`}>
                    <div className="flex justify-between items-start mb-4">
                       <h3 className="font-bold text-white">Professional</h3>
                       {user.planType === 'pro' ? <CheckCircle2 className="text-[#22D3EE]" size={20} /> : <div className="w-5 h-5 rounded-full border border-[#1E2938]" />}
                    </div>
                    <p className="text-xs text-[#94A3B8] leading-relaxed mb-6">10 credits per month, advanced analytics, and priority project support.</p>
                    <div className="flex items-center justify-between mt-auto">
                       <span className="text-xl font-black text-white">$5<span className="text-[10px] text-[#475569] font-bold">/mo</span></span>
                       <span className="text-[10px] font-black uppercase tracking-widest text-[#22D3EE] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">Upgrade <ExternalLink size={10}/></span>
                    </div>
                 </a>
                 <a href={`${STRIPE_LINKS.agency}?prefilled_email=${encodeURIComponent(user.email)}`} target="_blank" rel="noopener noreferrer" className={`p-6 rounded-2xl border transition-all ${user.planType === 'agency' ? 'border-[#22D3EE] bg-[#22D3EE]/5' : 'border-[#1E293B] bg-[#020617] hover:border-[#22D3EE]/50 group'}`}>
                    <div className="flex justify-between items-start mb-4">
                       <h3 className="font-bold text-white">Agency</h3>
                       {user.planType === 'agency' ? <CheckCircle2 className="text-[#22D3EE]" size={20} /> : <div className="w-5 h-5 rounded-full border border-[#1E2938]" />}
                    </div>
                    <p className="text-xs text-[#94A3B8] leading-relaxed mb-6">50 credits per month, multi-user access, and custom white-label reports.</p>
                    <div className="flex items-center justify-between mt-auto">
                       <span className="text-xl font-black text-white">$10<span className="text-[10px] text-[#475569] font-bold">/mo</span></span>
                       <span className="text-[10px] font-black uppercase tracking-widest text-[#22D3EE] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">Upgrade <ExternalLink size={10}/></span>
                    </div>
                 </a>
              </div>

              <div className="pt-6 border-t border-[#1E2938]">
                 <h4 className="text-sm font-bold text-white mb-4">Usage & Credits</h4>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-[#020617] border border-[#1E2938] text-xs font-medium">
                       <div className="flex items-center gap-3">
                          <Zap size={14} className="text-amber-400" />
                          <span className="text-[#94A3B8]">Remaining Balance</span>
                       </div>
                       <span className="text-white font-bold">{user.credits} Credits</span>
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
