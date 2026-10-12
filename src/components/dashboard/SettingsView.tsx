import React, { useState } from 'react';
import { User } from '../../types';
import { Building2, ShieldCheck, RefreshCw, CheckCircle2, User as UserIcon, Bell } from 'lucide-react';

interface SettingsViewProps {
  user: User;
  onResetDemoData: () => void;
  onUpdateUser: (updated: Partial<User>) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onResetDemoData,
  onUpdateUser
}) => {
  const [name, setName] = useState(user.name);
  const [organization, setOrganization] = useState(user.organization);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ name, organization });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-3xl space-y-6">
      
      {/* Header */}
      <div className="pb-4 border-b border-[#E6E2D8]">
        <h1 className="font-serif-heading text-2xl sm:text-3xl text-[#252A25]">
          Account & Portal Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#777A72] mt-1">
          Manage your organizational profile, prototype credentials, and local simulation state
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-[#DCE5D5]/50 border border-[#234D35]/20 flex items-center gap-2 text-xs text-[#234D35]">
          <CheckCircle2 className="w-4 h-4 text-[#234D35]" />
          <span>Profile updated successfully in current session.</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        <h3 className="font-serif-heading text-lg text-[#252A25]">
          Organization Profile
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#252A25] mb-1">
              Account Holder Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#252A25]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#252A25] mb-1">
              Organization Name
            </label>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#252A25]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#252A25] mb-1">
              Registered Email (Read-only)
            </label>
            <input
              type="email"
              disabled
              value={user.email}
              className="w-full text-xs bg-[#F7F4EC]/60 border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#777A72]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#252A25] mb-1">
              Assigned System Role
            </label>
            <div className="w-full text-xs bg-[#F7F4EC]/60 border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#234D35] font-semibold flex items-center gap-1.5">
              {user.role === 'business' ? <Building2 className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              <span>{user.role === 'business' ? 'Waste Generator (Business / Institution)' : 'Recovery Partner (Authorized Recycler)'}</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-[#E6E2D8] flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-semibold text-[#FFFEFA] bg-[#234D35] hover:bg-[#1a3a28] rounded-full transition-colors cursor-pointer"
          >
            Save Profile
          </button>
        </div>
      </form>

      {/* Reset Demo Data Card */}
      <div className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-serif-heading text-lg text-[#252A25]">
              Demo Data Management
            </h3>
            <p className="text-xs text-[#777A72] mt-1 leading-relaxed max-w-lg">
              Reset all locally stored demo inventory items and recovery requests back to their initial factory demonstration states.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset demo inventory and requests to initial sample state?')) {
                onResetDemoData();
              }
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#252A25] bg-[#F7F4EC] hover:bg-[#E6E2D8] rounded-full border border-[#E6E2D8] transition-colors cursor-pointer shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo State</span>
          </button>
        </div>
      </div>

    </div>
  );
};
