import React, { useState } from 'react';
import { Logo } from '../Logo';
import { User, UserRole } from '../../types';
import { signInWithGoogle, syncUserToDb } from '../../services/apiService';
import { 
  Building2, 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Lock,
  Mail,
  User as UserIcon,
  Eye,
  EyeOff
} from 'lucide-react';

interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
  onBackToHome: () => void;
  initialMode?: 'signin' | 'signup' | 'forgot';
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onLoginSuccess,
  onBackToHome,
  initialMode = 'signin'
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>('business');
  
  // Form fields
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  // Validate form
  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please provide a valid email format';
    }

    if (mode !== 'forgot') {
      if (!password) {
        newErrors.password = 'Password is required';
      } else if (password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }

    if (mode === 'signup') {
      if (!name.trim()) newErrors.name = 'Full name is required';
      if (!organization.trim()) newErrors.organization = 'Organization or company name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setIsGoogleLoading(true);
    try {
      const user = await signInWithGoogle();
      onLoginSuccess(user);
    } catch (err: any) {
      console.error('Google Sign In error:', err);
      setAuthError(err?.message || 'Google authentication was cancelled or could not be completed.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (mode === 'forgot') {
        setIsSubmitting(false);
        setResetSent(true);
      } else {
        const loggedUser: User = {
          id: `usr-${Date.now().toString().slice(-4)}`,
          name: mode === 'signup' ? name : (selectedRole === 'business' ? 'Sarah Jenkins' : 'Marcus Vance'),
          email: email.trim(),
          role: selectedRole,
          organization: mode === 'signup' ? organization : (selectedRole === 'business' ? 'Pacific Cloud Systems' : 'Veritas Eco-Tech ITAD'),
          isDemo: false
        };
        const synced = await syncUserToDb(loggedUser);
        setIsSubmitting(false);
        onLoginSuccess(synced);
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setAuthError('Failed to sign in. Please try again.');
    }
  };

  // Instant one-click demo login helpers
  const handleQuickDemoLogin = async (role: UserRole) => {
    setIsSubmitting(true);
    setAuthError(null);
    const demoUser: User = role === 'business' ? {
      id: 'demo-biz-01',
      name: 'Sarah Jenkins (IT Director)',
      email: 's.jenkins@pacificcloud.io',
      role: 'business',
      organization: 'Pacific Cloud Systems',
      isDemo: true
    } : {
      id: 'demo-part-01',
      name: 'Marcus Vance (Intake Lead)',
      email: 'm.vance@veritasecotech.com',
      role: 'partner',
      organization: 'Veritas Eco-Tech ITAD',
      isDemo: true
    };

    try {
      const synced = await syncUserToDb(demoUser);
      setIsSubmitting(false);
      onLoginSuccess(synced);
    } catch {
      setIsSubmitting(false);
      onLoginSuccess(demoUser);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F4EC] flex flex-col justify-between selection:bg-[#DCE5D5] selection:text-[#234D35]">
      
      {/* Top Bar */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-[#E6E2D8] bg-[#FFFEFA]">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#626B45] hover:text-[#234D35] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public Website</span>
        </button>

        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); onBackToHome(); }}
          className="cursor-pointer"
        >
          <Logo size="sm" />
        </a>

        <div className="text-xs text-[#777A72] hidden sm:block">
          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#F7F4EC] border border-[#E6E2D8]">
            Database Powered
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg bg-[#FFFEFA] border border-[#E6E2D8] rounded-3xl p-6 sm:p-10 shadow-[0_12px_40px_-16px_rgba(35,77,53,0.1)] relative">
          
          {authError && (
            <div className="mb-5 p-3 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>{authError}</div>
            </div>
          )}

          {/* Quick Demo Login Shortcuts */}
          <div className="mb-6 pb-6 border-b border-[#E6E2D8]">
            <div className="text-xs font-bold uppercase tracking-wider text-[#252A25] mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#234D35]" />
              <span>One-Click Role Preview</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('business')}
                className="p-3 rounded-xl border border-[#234D35]/30 bg-[#DCE5D5]/40 hover:bg-[#DCE5D5] text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="w-4 h-4 text-[#234D35]" />
                  <span className="text-xs font-bold text-[#234D35]">Waste Generator</span>
                </div>
                <div className="text-[11px] text-[#777A72]">
                  Acme Tech · Enterprise IT
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('partner')}
                className="p-3 rounded-xl border border-[#626B45]/30 bg-[#F7F4EC] hover:bg-[#F2EFE5] text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-4 h-4 text-[#626B45]" />
                  <span className="text-xs font-bold text-[#626B45]">Recovery Partner</span>
                </div>
                <div className="text-[11px] text-[#777A72]">
                  Veritas ITAD · Certified Intake
                </div>
              </button>
            </div>
          </div>

          {/* Google Single Sign-On Button */}
          {mode !== 'forgot' && (
            <div className="mb-6">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                className="w-full inline-flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-[#E6E2D8] bg-[#FFFEFA] hover:bg-[#F7F4EC] text-xs font-semibold text-[#252A25] transition-all cursor-pointer shadow-sm disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E6E2D8]" />
                </div>
                <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
                  <span className="bg-[#FFFEFA] px-2 text-[#777A72]">Or continue with email</span>
                </div>
              </div>
            </div>
          )}

          {/* Header Title */}
          <div className="mb-6">
            <h1 className="font-serif-heading text-2xl sm:text-3xl text-[#252A25]">
              {mode === 'signin' && 'Sign In to RESTOCK AI'}
              {mode === 'signup' && 'Create Your Account'}
              {mode === 'forgot' && 'Reset Your Password'}
            </h1>
            <p className="text-xs text-[#777A72] mt-1">
              {mode === 'signin' && 'Access your digital inventory and recovery dispatch records'}
              {mode === 'signup' && 'Register your company or recycling facility to begin'}
              {mode === 'forgot' && 'Enter your verified email to receive prototype password recovery'}
            </p>
          </div>

          {/* Role Selection (for Sign In & Sign Up) */}
          {mode !== 'forgot' && (
            <div className="mb-6">
              <label className="block text-xs font-semibold text-[#252A25] mb-2">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl">
                <button
                  type="button"
                  onClick={() => setSelectedRole('business')}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    selectedRole === 'business'
                      ? 'bg-[#FFFEFA] text-[#234D35] shadow-sm'
                      : 'text-[#777A72] hover:text-[#252A25]'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Waste Generator</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('partner')}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    selectedRole === 'partner'
                      ? 'bg-[#FFFEFA] text-[#234D35] shadow-sm'
                      : 'text-[#777A72] hover:text-[#252A25]'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Recovery Partner</span>
                </button>
              </div>
            </div>
          )}

          {/* Reset password sent confirmation */}
          {mode === 'forgot' && resetSent ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#DCE5D5] text-[#234D35] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif-heading text-xl text-[#252A25]">
                Reset Link Dispatched
              </h3>
              <p className="text-xs text-[#777A72] leading-relaxed max-w-sm mx-auto">
                In this environment, a reset token has been registered for <strong>{email}</strong>. You may now return to the sign-in form.
              </p>
              <button
                type="button"
                onClick={() => {
                  setResetSent(false);
                  setMode('signin');
                }}
                className="px-6 py-2.5 text-xs font-semibold text-[#FFFEFA] bg-[#234D35] hover:bg-[#1a3a28] rounded-full transition-colors cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            /* Interactive Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Sign Up Specific Fields */}
              {mode === 'signup' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#252A25] mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-[#777A72] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="e.g. Sarah Jenkins"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name) setErrors({ ...errors, name: '' });
                        }}
                        className={`w-full text-xs bg-[#F7F4EC] border rounded-xl pl-9 pr-3.5 py-2.5 text-[#252A25] focus:ring-1 focus:ring-[#234D35] ${
                          errors.name ? 'border-red-500' : 'border-[#E6E2D8] focus:border-[#234D35]'
                        }`}
                      />
                    </div>
                    {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#252A25] mb-1">
                      {selectedRole === 'business' ? 'Company / Institution Name *' : 'Recycling Facility Name *'}
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-[#777A72] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder={selectedRole === 'business' ? 'e.g. Acme Tech Labs' : 'e.g. Sylvan Recyclers'}
                        value={organization}
                        onChange={(e) => {
                          setOrganization(e.target.value);
                          if (errors.organization) setErrors({ ...errors, organization: '' });
                        }}
                        className={`w-full text-xs bg-[#F7F4EC] border rounded-xl pl-9 pr-3.5 py-2.5 text-[#252A25] focus:ring-1 focus:ring-[#234D35] ${
                          errors.organization ? 'border-red-500' : 'border-[#E6E2D8] focus:border-[#234D35]'
                        }`}
                      />
                    </div>
                    {errors.organization && <p className="text-[11px] text-red-600 mt-1">{errors.organization}</p>}
                  </div>
                </>
              )}

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-[#252A25] mb-1">
                  Work Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#777A72] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="name@organization.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    className={`w-full text-xs bg-[#F7F4EC] border rounded-xl pl-9 pr-3.5 py-2.5 text-[#252A25] focus:ring-1 focus:ring-[#234D35] ${
                      errors.email ? 'border-red-500' : 'border-[#E6E2D8] focus:border-[#234D35]'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-[#252A25]">
                      Password *
                    </label>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => {
                          setErrors({});
                          setMode('forgot');
                        }}
                        className="text-[11px] text-[#626B45] hover:text-[#234D35] hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#777A72] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors({ ...errors, password: '' });
                      }}
                      className={`w-full text-xs bg-[#F7F4EC] border rounded-xl pl-9 pr-9 py-2.5 text-[#252A25] focus:ring-1 focus:ring-[#234D35] ${
                        errors.password ? 'border-red-500' : 'border-[#E6E2D8] focus:border-[#234D35]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777A72] hover:text-[#252A25] p-1"
                      aria-label="Toggle password view"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-[11px] text-red-600 mt-1">{errors.password}</p>}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold text-[#FFFEFA] bg-[#234D35] hover:bg-[#1a3a28] rounded-full shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50"
                >
                  <span>
                    {isSubmitting
                      ? 'Connecting...'
                      : mode === 'signin'
                      ? 'Sign In to Dashboard'
                      : mode === 'signup'
                      ? 'Create Account & Enter'
                      : 'Send Reset Instructions'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Mode Toggle Footer */}
              <div className="pt-3 text-center text-xs text-[#777A72]">
                {mode === 'signin' ? (
                  <span>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setErrors({});
                        setMode('signup');
                      }}
                      className="font-semibold text-[#234D35] hover:underline cursor-pointer"
                    >
                      Create an account
                    </button>
                  </span>
                ) : mode === 'signup' ? (
                  <span>
                    Already registered?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setErrors({});
                        setMode('signin');
                      }}
                      className="font-semibold text-[#234D35] hover:underline cursor-pointer"
                    >
                      Sign In
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setErrors({});
                      setMode('signin');
                    }}
                    className="font-semibold text-[#234D35] hover:underline cursor-pointer"
                  >
                    Back to Sign In
                  </button>
                )}
              </div>

            </form>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-[#E6E2D8] bg-[#FFFEFA] text-center text-[11px] text-[#777A72]">
        RESTOCK AI · Intelligent Resource Recovery and E-Waste Coordination · PostgreSQL Cloud SQL
      </footer>

    </div>
  );
};
