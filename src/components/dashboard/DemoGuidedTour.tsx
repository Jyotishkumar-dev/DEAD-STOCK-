import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  Package, 
  Users, 
  Send, 
  Truck, 
  FileText, 
  Building2,
  Info
} from 'lucide-react';

interface DemoGuidedTourProps {
  currentTab: string;
  onNavigateTab: (tab: string) => void;
  onPrepopulateDemoLot?: () => void;
}

export const DemoGuidedTour: React.FC<DemoGuidedTourProps> = ({
  currentTab,
  onNavigateTab,
  onPrepopulateDemoLot
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const steps = [
    {
      step: 1,
      title: 'Demo Business Profile',
      tab: 'overview',
      description: 'Logged in as Pacific Cloud Systems (Sarah Jenkins), a regional enterprise managing corporate IT surplus.',
      icon: Building2
    },
    {
      step: 2,
      title: 'Add E-Waste Surplus',
      tab: 'add-ewaste',
      description: 'Catalog decommissioned equipment with quantity, condition, location, and handling notes.',
      icon: Package
    },
    {
      step: 3,
      title: 'AI Item Analysis',
      tab: 'ai-analysis',
      description: 'AI model infers device specs, missing data, and circular recovery pathways (Reuse vs Harvesting vs Recycling).',
      icon: Sparkles
    },
    {
      step: 4,
      title: 'Partner Discovery & Matching',
      tab: 'find-partners',
      description: 'Evaluate candidate recovery partners using transparent 4-dimensional compatibility scores.',
      icon: Users
    },
    {
      step: 5,
      title: 'Submit Pickup Request',
      tab: 'requests',
      description: 'Propose collection date, time window, and loading dock access to the selected partner.',
      icon: Send
    },
    {
      step: 6,
      title: 'Simulate Partner Intake & Transit',
      tab: 'pickup-tracking',
      description: 'Record simulated partner acceptance, driver dispatch, and custodial transfer (e-BOL).',
      icon: Truck
    },
    {
      step: 7,
      title: 'Final Report & Audit Manifest',
      tab: 'reports',
      description: 'Inspect verified recovery documentation, circular impact metrics, and Certificates of Safe Destruction.',
      icon: FileText
    }
  ];

  // Determine current active step index based on current tab
  const getActiveStepIndex = () => {
    switch (currentTab) {
      case 'overview': return 0;
      case 'add-ewaste': return 1;
      case 'ai-analysis': return 2;
      case 'find-partners': return 3;
      case 'requests': return 4;
      case 'pickup-tracking': return 5;
      case 'reports': return 6;
      default: return 0;
    }
  };

  const activeIdx = getActiveStepIndex();

  return (
    <div className="bg-[#FFFEFA] border border-[#234D35]/25 rounded-3xl p-4 sm:p-5 shadow-sm transition-all mb-6">
      
      {/* Banner Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#DCE5D5] text-[#234D35] flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif-heading text-base sm:text-lg text-[#252A25]">
                Guided Customer Demo Workflow
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#DCE5D5] text-[#234D35]">
                Phase 5 Interactive Tour
              </span>
            </div>
            <p className="text-[11px] text-[#777A72]">
              Step-by-step walkthrough demonstrating end-to-end electronic resource recovery
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-[#777A72] hover:text-[#252A25] rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle demo tour details"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-[#E6E2D8] space-y-4 animate-in fade-in">
          
          {/* 7-Step Navigation Rail */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {steps.map((s, idx) => {
              const isCurrent = idx === activeIdx;
              const isPast = idx < activeIdx;
              const Icon = s.icon;

              return (
                <button
                  key={s.step}
                  onClick={() => onNavigateTab(s.tab)}
                  className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-[#234D35] text-white border-[#234D35] shadow-sm ring-2 ring-[#234D35]/20'
                      : isPast
                      ? 'bg-[#DCE5D5]/40 text-[#234D35] border-[#234D35]/20 hover:bg-[#DCE5D5]'
                      : 'bg-[#F7F4EC] text-[#777A72] border-[#E6E2D8] hover:bg-[#E6E2D8]/60 hover:text-[#252A25]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-mono font-bold ${isCurrent ? 'text-[#DCE5D5]' : 'text-[#626B45]'}`}>
                      0{s.step}
                    </span>
                    <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-[#DCE5D5]' : 'text-[#626B45]'}`} />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold leading-tight line-clamp-1">
                      {s.title}
                    </div>
                    <div className="text-[9px] mt-0.5 opacity-80">
                      {isCurrent ? 'Active View' : isPast ? 'Visited' : 'Click to View'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Step Description Card */}
          <div className="bg-[#F7F4EC] rounded-2xl p-3.5 border border-[#E6E2D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="font-semibold text-[#252A25] flex items-center gap-1.5">
                <span className="text-[#234D35]">Step {steps[activeIdx].step} of 7:</span>
                <span>{steps[activeIdx].title}</span>
              </div>
              <p className="text-[#777A72] text-[11px]">
                {steps[activeIdx].description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {activeIdx < steps.length - 1 ? (
                <button
                  onClick={() => onNavigateTab(steps[activeIdx + 1].tab)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#FFFEFA] bg-[#234D35] hover:bg-[#1a3a28] rounded-full transition-colors cursor-pointer"
                >
                  <span>Next Step: {steps[activeIdx + 1].title.split(' ')[0]}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              ) : (
                <button
                  onClick={() => onNavigateTab('overview')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#234D35] bg-[#DCE5D5] hover:bg-[#d0ddc7] rounded-full transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Restart Tour</span>
                </button>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
