import React, { useState } from 'react';
import { AI_CAPABILITIES } from '../data/mockData';
import { Sparkles, ArrowRight, ShieldAlert, Cpu, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface AiIntelligenceProps {
  onOpenRegister: () => void;
}

export const AiIntelligence: React.FC<AiIntelligenceProps> = ({ onOpenRegister }) => {
  const [activeTab, setActiveTab] = useState(0);
  const currentCapability = AI_CAPABILITIES[activeTab];

  return (
    <section id="ai-intelligence" className="py-24 bg-[#FFFEFA] border-b border-[#E6E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#234D35] px-3.5 py-1 rounded-full bg-[#DCE5D5]/60 border border-[#234D35]/15">
            <Sparkles className="w-3.5 h-3.5 text-[#234D35]" />
            <span>ASSISTIVE RECOVERY INTELLIGENCE</span>
          </div>

          <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-[44px] text-[#252A25] font-normal tracking-tight">
            Make Better Decisions With AI.
          </h2>

          <p className="text-base sm:text-lg text-[#777A72] leading-relaxed max-w-2xl mx-auto">
            Transform unorganized electronic waste records into actionable recovery insights.
          </p>

          {/* Explicit disclaimer note per prompt requirement */}
          <div className="flex items-center justify-center gap-2 text-xs text-[#777A72] pt-2">
            <ShieldAlert className="w-4 h-4 text-[#626B45] shrink-0" />
            <span className="italic max-w-xl text-center">
              Recommendations provide operational decision support based on submitted descriptions; material assays and certification documentation are verified by authorized downstream partners.
            </span>
          </div>
        </div>

        {/* Interactive Capability Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {AI_CAPABILITIES.map((cap, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={cap.id}
                onClick={() => setActiveTab(idx)}
                className={`text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-[#234D35] text-[#FFFEFA] border-[#234D35] shadow-md'
                    : 'bg-[#F7F4EC] text-[#252A25] border-[#E6E2D8] hover:border-[#626B45]/40 hover:bg-[#F2EFE5]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#DCE5D5] text-[#234D35]'
                  }`}>
                    Module {cap.letter}
                  </span>
                  {isActive && <CheckCircle2 className="w-4 h-4 text-[#DCE5D5]" />}
                </div>
                <div className="text-sm font-semibold leading-snug">
                  {cap.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Feature Detail Showcase Card */}
        <div className="bg-[#F7F4EC] border border-[#E6E2D8] rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left: Capability Explanatory Column */}
            <div className="lg:col-span-5 space-y-5 text-left">
              <div className="inline-block text-xs font-bold uppercase tracking-wider text-[#626B45]">
                {currentCapability.tagline}
              </div>

              <h3 className="font-serif-heading text-2xl sm:text-3xl text-[#252A25] font-normal">
                {currentCapability.title}
              </h3>

              <p className="text-sm sm:text-base text-[#777A72] leading-relaxed">
                {currentCapability.description}
              </p>

              <div className="pt-2">
                <button
                  onClick={onOpenRegister}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-[#FFFEFA] bg-[#234D35] hover:bg-[#1a3a28] rounded-full transition-colors cursor-pointer shadow-sm"
                >
                  <span>Explore AI Capabilities</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: Live Interactive Input vs AI Recommendation Preview */}
            <div className="lg:col-span-7">
              <div className="bg-[#FFFEFA] rounded-2xl border border-[#E6E2D8] p-5 sm:p-6 shadow-sm space-y-5">
                
                {/* Step 1: Simulated Raw Inventory Record */}
                <div>
                  <div className="flex items-center justify-between text-xs text-[#777A72] mb-2">
                    <span className="font-semibold uppercase tracking-wider text-[#252A25]">
                      1. Submitted Inventory Input
                    </span>
                    <span className="font-mono text-[11px] text-[#626B45]">Status: Parsed</span>
                  </div>
                  <div className="bg-[#F7F4EC] p-3.5 rounded-xl border border-[#E6E2D8]/80 text-xs text-[#252A25] space-y-1">
                    <div className="font-medium text-[#234D35]">
                      {currentCapability.sampleInput.item}
                    </div>
                    <div className="text-[#777A72]">
                      <span className="font-medium text-[#252A25]">Reported Details:</span> {currentCapability.sampleInput.details}
                    </div>
                    <div className="flex gap-4 text-[11px] text-[#626B45] pt-1">
                      <span>Qty: <strong>{currentCapability.sampleInput.quantity}</strong></span>
                      <span>·</span>
                      <span>Condition: <strong>{currentCapability.sampleInput.condition}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Step 2: Assistive Recommendation Output */}
                <div>
                  <div className="flex items-center justify-between text-xs text-[#777A72] mb-2">
                    <span className="font-semibold uppercase tracking-wider text-[#234D35] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#234D35]" />
                      2. AI Assistive Recovery Pathway
                    </span>
                    <span className="text-[11px] font-medium text-[#234D35]">
                      {currentCapability.sampleOutput.confidenceLabel}
                    </span>
                  </div>

                  <div className="border border-[#234D35]/25 bg-[#DCE5D5]/20 p-4 rounded-xl space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-[#626B45]">Recommended Pathway:</span>
                      <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#234D35] text-[#FFFEFA]">
                        {currentCapability.sampleOutput.suggestedPathway}
                      </span>
                    </div>

                    <div className="text-xs text-[#252A25] space-y-1">
                      <div className="font-medium text-[#234D35]">Potential Value Stream:</div>
                      <div className="text-[#777A72]">{currentCapability.sampleOutput.potentialValueStream}</div>
                    </div>

                    <div className="text-xs text-[#252A25] space-y-1">
                      <div className="font-medium text-[#234D35]">Handling & Preparation Guideline:</div>
                      <div className="text-[#777A72]">{currentCapability.sampleOutput.handlingNote}</div>
                    </div>

                    <div className="pt-2 border-t border-[#234D35]/15 text-[11px] text-[#626B45]">
                      <strong>Partner Criteria:</strong> {currentCapability.sampleOutput.partnerMatchReason}
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
