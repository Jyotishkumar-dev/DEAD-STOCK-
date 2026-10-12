import React from 'react';
import { ArrowRight, Sparkles, Building2, ShieldCheck } from 'lucide-react';

interface CtaBannerProps {
  onRegisterBusiness: () => void;
  onBecomePartner: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({
  onRegisterBusiness,
  onBecomePartner
}) => {
  return (
    <section className="py-20 bg-[#F7F4EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Large Olive / Forest Green Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#234D35] via-[#2a553c] to-[#1a3a28] p-8 sm:p-14 lg:p-16 text-[#FFFEFA] shadow-xl border border-[#234D35]/30">
          
          {/* Subtle Organic Botanical Geometry */}
          <div 
            aria-hidden="true" 
            className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-[#626B45]/20 blur-2xl pointer-events-none" 
          />
          <div 
            aria-hidden="true" 
            className="absolute bottom-0 left-10 w-64 h-64 rounded-full bg-[#DCE5D5]/10 blur-3xl pointer-events-none" 
          />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#DCE5D5] bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15">
              <Sparkles className="w-3.5 h-3.5" />
              <span>COMMENCE RESPONSIBLE RECOVERY</span>
            </div>

            <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl text-white font-normal leading-tight tracking-tight">
              Your Unused Resources Have <span className="italic text-[#DCE5D5]">More to Give.</span>
            </h2>

            <p className="text-base sm:text-lg text-[#DCE5D5]/90 max-w-xl mx-auto leading-relaxed">
              Start organizing your electronic resources and discover better recovery opportunities.
            </p>

            {/* Dual Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={onRegisterBusiness}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-[#234D35] bg-[#FFFEFA] hover:bg-[#F7F4EC] rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-[0.98]"
              >
                <Building2 className="w-4 h-4" />
                <span>Register Your Business</span>
              </button>

              <button
                onClick={onBecomePartner}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-[#FFFEFA] bg-[#626B45] hover:bg-[#525a39] border border-white/20 rounded-full transition-all duration-200 cursor-pointer shadow-sm hover:shadow active:scale-[0.98]"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Become a Recovery Partner</span>
              </button>
            </div>

            {/* Reassurance text */}
            <div className="text-xs text-[#DCE5D5]/70 pt-2">
              Free digital onboarding · Transparent request handling · Direct certified recycler network
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
