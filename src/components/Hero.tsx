import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Cpu, 
  Laptop, 
  Layers, 
  ArrowUpRight, 
  Building2, 
  Recycle, 
  Compass, 
  Truck, 
  Play 
} from 'lucide-react';

interface HeroProps {
  onStartRecovering: () => void;
  onExploreHowItWorks: () => void;
  onLaunchDemo?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  onStartRecovering, 
  onExploreHowItWorks,
  onLaunchDemo 
}) => {
  return (
    <section id="home" className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden bg-[#F7F4EC]">
      {/* Subtle organic botanical ambient shapes */}
      <div 
        aria-hidden="true" 
        className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#DCE5D5]/35 blur-3xl pointer-events-none" 
      />
      <div 
        aria-hidden="true" 
        className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-[#626B45]/10 blur-2xl pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-12">
        
        {/* Main Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCE5D5]/80 border border-[#234D35]/15 text-[#234D35] text-xs font-semibold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#234D35]" />
              <span>AI-POWERED WASTE RECOVERY & RESOURCE REUSE</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif-heading text-4xl sm:text-5xl lg:text-[56px] text-[#252A25] font-normal leading-[1.12] tracking-tight text-balance">
              Turn Electronic Waste Into <span className="italic text-[#234D35]">New Opportunities.</span>
            </h1>

            {/* Tagline & Supporting Text */}
            <div className="space-y-2">
              <p className="text-base sm:text-lg font-medium text-[#234D35]">
                Give Every Resource a Second Life. Smarter recovery. Better reuse. Less waste.
              </p>
              <p className="text-sm sm:text-base text-[#777A72] leading-relaxed max-w-2xl font-normal">
                RESTOCK AI connects waste generators with authorized recyclers and recovery partners. 
                AI assists with waste inventory, item categorization, recovery recommendations, partner matching, 
                and pickup coordination to turn unused electronic equipment into verifiable circular value.
              </p>
            </div>

            {/* Primary, Secondary, & Hackathon Demo CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={onStartRecovering}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm sm:text-base font-semibold text-[#FFFEFA] bg-[#234D35] hover:bg-[#1a3a28] rounded-full shadow-[0_6px_20px_-6px_rgba(35,77,53,0.35)] hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-[0.98]"
              >
                <span>Start Recovering Value</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {onLaunchDemo && (
                <button
                  onClick={onLaunchDemo}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm sm:text-base font-semibold text-[#234D35] bg-[#DCE5D5] hover:bg-[#d0ddc7] border border-[#234D35]/20 rounded-full transition-all duration-200 cursor-pointer shadow-sm"
                >
                  <Play className="w-4 h-4 fill-[#234D35]" />
                  <span>Interactive Live Demo</span>
                </button>
              )}

              <button
                onClick={onExploreHowItWorks}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm sm:text-base font-medium text-[#252A25] bg-[#FFFEFA] hover:bg-[#FFFEFA]/80 border border-[#E6E2D8] rounded-full hover:border-[#626B45]/40 transition-all duration-200 cursor-pointer shadow-sm"
              >
                <span>How It Works</span>
              </button>
            </div>

            {/* Trust Statement */}
            <div className="pt-1 flex items-center gap-2.5 text-xs text-[#626B45] font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#234D35] shrink-0" />
              <span className="leading-snug">
                Organized inventory · Verified circular partners · Audit-ready electronic manifests
              </span>
            </div>

          </div>

          {/* Right Column: High-End Visual Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Visual Card: Clean Professional Recovery Workspace */}
              <div className="relative rounded-3xl overflow-hidden bg-[#FFFEFA] border border-[#E6E2D8] shadow-[0_16px_40px_-16px_rgba(35,77,53,0.12)] p-4 sm:p-5">
                
                {/* Visual Header Graphic */}
                <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#234D35] via-[#2f5c40] to-[#1c3e2b] p-6 text-[#FFFEFA] flex flex-col justify-between">
                  
                  {/* Subtle technical overlay grid */}
                  <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#FFFEFA_1px,transparent_1px)] [background-size:16px_16px]" />
                  
                  {/* Top Bar inside graphic */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#DCE5D5]" />
                      <span className="text-xs uppercase tracking-wider font-semibold text-[#DCE5D5]/90">
                        Intake Node · Regional Depot
                      </span>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/90">
                      R-BATCH #2940
                    </span>
                  </div>

                  {/* Center Architectural Illustration of Clean Organized Electronics */}
                  <div className="relative z-10 my-auto py-2">
                    <div className="grid grid-cols-3 gap-3">
                      
                      {/* Box 1: Laptops */}
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 flex flex-col items-center text-center">
                        <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center mb-2">
                          <Laptop className="w-5 h-5 text-[#DCE5D5]" />
                        </div>
                        <span className="text-xs font-semibold leading-tight">45 Laptops</span>
                        <span className="text-[10px] text-white/70 mt-0.5">Refurbish Stream</span>
                      </div>

                      {/* Box 2: Circuit Boards */}
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 flex flex-col items-center text-center">
                        <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center mb-2">
                          <Cpu className="w-5 h-5 text-[#DCE5D5]" />
                        </div>
                        <span className="text-xs font-semibold leading-tight">120 PCBs</span>
                        <span className="text-[10px] text-white/70 mt-0.5">Component Pick</span>
                      </div>

                      {/* Box 3: Cabling */}
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 flex flex-col items-center text-center">
                        <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center mb-2">
                          <Layers className="w-5 h-5 text-[#DCE5D5]" />
                        </div>
                        <span className="text-xs font-semibold leading-tight">380 kg Copper</span>
                        <span className="text-[10px] text-white/70 mt-0.5">Refining Lot</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom strip in graphic */}
                  <div className="relative z-10 flex items-center justify-between text-xs pt-2 border-t border-white/15">
                    <div className="flex items-center gap-1.5 text-[#DCE5D5]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Multi-Pathway Engine Active</span>
                    </div>
                    <span className="text-white/80 font-medium">94% Circular Route</span>
                  </div>
                </div>

                {/* Sub-card: Interactive Live Inventory Preview Banner */}
                <div className="mt-4 p-4 rounded-2xl bg-[#F7F4EC] border border-[#E6E2D8] flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold text-[#252A25] flex items-center gap-1.5">
                      <span>Enterprise Hardware Stream</span>
                      <span className="text-[#626B45]">· Ready for pickup</span>
                    </div>
                    <p className="text-[12px] text-[#777A72] mt-0.5">
                      Matched with 2 licensed regional ITAD handlers
                    </p>
                  </div>
                  <button
                    onClick={onStartRecovering}
                    className="shrink-0 p-2 text-xs font-semibold text-[#234D35] hover:text-[#1a3a28] hover:bg-[#DCE5D5]/50 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>View</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

              {/* Floating Accent Capsule */}
              <div className="absolute -bottom-4 -left-4 sm:-bottom-5 sm:-left-5 bg-[#FFFEFA] border border-[#E6E2D8] shadow-lg rounded-2xl p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#DCE5D5] flex items-center justify-center text-[#234D35]">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#252A25]">Digital Manifest</div>
                  <div className="text-[11px] text-[#777A72]">Audit-ready tracking</div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Feature 6: Immediate Startup Hackathon 4-Pillar Presentation Grid */}
        <div className="pt-8 border-t border-[#E6E2D8] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
          
          {/* Pillar 1: What RESTOCK AI Does */}
          <div className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-3xl p-5 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-xl bg-[#DCE5D5]/60 text-[#234D35] flex items-center justify-center">
              <Recycle className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#626B45] block">
              1. What It Does
            </span>
            <h4 className="font-serif-heading text-base text-[#252A25]">
              Intelligent E-Waste Recovery
            </h4>
            <p className="text-xs text-[#777A72] leading-relaxed">
              Turns unused electronics into recoverable secondary value through structured digital inventory, verified downstream routing, and chain-of-custody tracking.
            </p>
          </div>

          {/* Pillar 2: Who It Serves */}
          <div className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-3xl p-5 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-xl bg-[#DCE5D5]/60 text-[#234D35] flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#626B45] block">
              2. Who It Serves
            </span>
            <h4 className="font-serif-heading text-base text-[#252A25]">
              The Recovery Ecosystem
            </h4>
            <p className="text-xs text-[#777A72] leading-relaxed">
              Businesses & corporate offices, educational institutions, independent repair collectives, and licensed ITAD recyclers seeking verified supply.
            </p>
          </div>

          {/* Pillar 3: How AI Helps */}
          <div className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-3xl p-5 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-xl bg-[#DCE5D5]/60 text-[#234D35] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#626B45] block">
              3. How AI Helps
            </span>
            <h4 className="font-serif-heading text-base text-[#252A25]">
              Automated Decisioning
            </h4>
            <p className="text-xs text-[#777A72] leading-relaxed">
              AI classifies raw hardware descriptions, recommends circular pathways (Reuse vs Refurb vs Smelt), calculates partner compatibility, and bundles nearby pickup runs.
            </p>
          </div>

          {/* Pillar 4: How Recovery Works */}
          <div className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-3xl p-5 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-xl bg-[#DCE5D5]/60 text-[#234D35] flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#626B45] block">
              4. Recovery Workflow
            </span>
            <h4 className="font-serif-heading text-base text-[#252A25]">
              4-Stage Circular Process
            </h4>
            <p className="text-xs text-[#777A72] leading-relaxed">
              1. Catalog Lots → 2. AI Pathway Evaluation → 3. Partner Intake Match → 4. Coordinated Pickup with verifiable e-BOL manifests.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
