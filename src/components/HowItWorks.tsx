import React from 'react';
import { ClipboardList, Sparkles, Building, Route, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onOpenRegister: () => void;
  onOpenPartnerExplorer: () => void;
  onOpenAiExplorer: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({
  onOpenRegister,
  onOpenPartnerExplorer,
  onOpenAiExplorer
}) => {
  const steps = [
    {
      number: '01',
      title: 'Register Your Resources',
      description: 'Add unused electronic devices, components, cables, and other eligible electronic waste to your digital inventory.',
      icon: ClipboardList,
      actionText: 'Add an Item',
      onClick: onOpenRegister
    },
    {
      number: '02',
      title: 'AI-Powered Analysis',
      description: 'Organize items by category, condition, quantity, and potential recovery pathway automatically.',
      icon: Sparkles,
      actionText: 'Explore AI Engine',
      onClick: onOpenAiExplorer
    },
    {
      number: '03',
      title: 'Find the Right Partner',
      description: 'Discover suitable recovery partners based on accepted materials, service areas, and operational requirements.',
      icon: Building,
      actionText: 'Browse Partners',
      onClick: onOpenPartnerExplorer
    },
    {
      number: '04',
      title: 'Coordinate and Track',
      description: 'Manage pickup requests, follow collection progress, and maintain organized transaction records.',
      icon: Route,
      actionText: 'View Tracking Flow',
      onClick: onOpenRegister
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#FFFEFA] border-y border-[#E6E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#626B45]">
            <span className="w-6 h-px bg-[#626B45]/40" />
            <span>STREAMLINED WORKFLOW</span>
            <span className="w-6 h-px bg-[#626B45]/40" />
          </div>
          
          <h2 className="font-serif-heading text-3xl sm:text-4xl text-[#252A25] font-normal tracking-tight">
            Recovery Made Simple.
          </h2>
          
          <p className="text-base text-[#777A72] leading-relaxed">
            From unused equipment to responsible recovery, every step is easier with RESTOCK AI.
          </p>
        </div>

        {/* 4 Elegant Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="group relative bg-[#F7F4EC] hover:bg-[#F2EFE5] border border-[#E6E2D8] hover:border-[#626B45]/40 rounded-3xl p-7 transition-all duration-300 flex flex-col justify-between shadow-[0_4px_16px_-8px_rgba(35,77,53,0.04)] hover:shadow-[0_12px_28px_-12px_rgba(35,77,53,0.12)] hover:-translate-y-1"
              >
                <div>
                  {/* Top Row: Editorial Step Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-serif-heading text-2xl text-[#626B45] font-normal">
                      {step.number}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-[#FFFEFA] border border-[#E6E2D8] flex items-center justify-center text-[#234D35] group-hover:bg-[#234D35] group-hover:text-[#FFFEFA] transition-colors duration-300 shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Card Title */}
                  <h3 className="text-lg font-bold text-[#252A25] mb-3 group-hover:text-[#234D35] transition-colors">
                    {step.title}
                  </h3>

                  {/* Card Description */}
                  <p className="text-sm text-[#777A72] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Subtle Interactive Action */}
                <div className="pt-6 mt-6 border-t border-[#E6E2D8]/60">
                  <button
                    onClick={step.onClick}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#234D35] hover:text-[#1a3a28] cursor-pointer group-hover:underline underline-offset-4"
                  >
                    <span>{step.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
