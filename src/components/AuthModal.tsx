import React, { useState } from 'react';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'generator' | 'partner';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'generator'
}) => {
  const [role, setRole] = useState<'generator' | 'partner'>(defaultRole);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoggedIn(true);
    setTimeout(() => {
      setLoggedIn(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-3xl max-w-md w-full shadow-2xl overflow-hidden my-auto relative">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E6E2D8] flex items-center justify-between bg-[#F7F4EC]">
          <div>
            <h3 className="font-serif-heading text-2xl text-[#252A25]">
              {mode === 'signin' ? 'Sign In to RESTOCK AI' : 'Create an Account'}
            </h3>
            <p className="text-xs text-[#777A72]">
              Access your digital inventory or partner dispatch board
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#777A72] hover:text-[#252A25] rounded-full hover:bg-white transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Segmented Selector */}
        <div className="p-6 border-b border-[#E6E2D8] bg-[#FFFEFA]">
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#F7F4EC] rounded-xl border border-[#E6E2D8]">
            <button
              type="button"
              onClick={() => setRole('generator')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                role === 'generator'
                  ? 'bg-[#FFFEFA] text-[#234D35] shadow-sm'
                  : 'text-[#777A72] hover:text-[#252A25]'
              }`}
            >
              Resource Generator
            </button>
            <button
              type="button"
              onClick={() => setRole('partner')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                role === 'partner'
                  ? 'bg-[#FFFEFA] text-[#234D35] shadow-sm'
                  : 'text-[#777A72] hover:text-[#252A25]'
              }`}
            >
              Recovery Partner
            </button>
          </div>
        </div>

        {/* Body Form */}
        <div className="p-6">
          {loggedIn ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#DCE5D5] text-[#234D35] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="font-serif-heading text-xl text-[#252A25]">
                Welcome Back
              </h4>
              <p className="text-xs text-[#777A72]">
                Session initialized for {email || 'user'} ({role === 'generator' ? 'Generator Portal' : 'Partner Portal'})
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#252A25] mb-1">
                  Work Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@organization.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#252A25] focus:border-[#234D35] focus:ring-1 focus:ring-[#234D35]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#252A25] mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#252A25] focus:border-[#234D35] focus:ring-1 focus:ring-[#234D35]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 text-xs font-semibold text-[#FFFEFA] bg-[#234D35] hover:bg-[#1a3a28] rounded-full transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span>{mode === 'signin' ? 'Sign In to Dashboard' : 'Register Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-2 text-center text-xs text-[#777A72]">
                {mode === 'signin' ? (
                  <span>
                    New to RESTOCK AI?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signup')}
                      className="font-semibold text-[#234D35] hover:underline cursor-pointer"
                    >
                      Create an account
                    </button>
                  </span>
                ) : (
                  <span>
                    Already have credentials?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signin')}
                      className="font-semibold text-[#234D35] hover:underline cursor-pointer"
                    >
                      Sign In
                    </button>
                  </span>
                )}
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
