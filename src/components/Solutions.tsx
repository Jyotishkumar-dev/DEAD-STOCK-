import React, { useState } from 'react';
import { SOLUTIONS } from '../data/mockData';
import { SolutionItem } from '../types';
import { Building2, GraduationCap, Wrench, ShieldCheck, ArrowRight, Check, X } from 'lucide-react';

interface SolutionsProps {
  onRegisterInterest: (solutionTitle: string) => void;
}

export const Solutions: React.FC<SolutionsProps> = ({ onRegisterInterest }) => {
  const [selectedSolution, setSelectedSolution] = useState<SolutionItem | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2':
        return <Building2 className="w-6 h-6" />;
      case 'GraduationCap':
        return <GraduationCap className="w-6 h-6" />;
      case 'Wrench':
        return <Wrench className="w-6 h-6" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6" />;
      default:
        return <Building2 className="w-6 h-6" />;
    }
  };

  return (
    <section id="solutions" className="py-20 bg-[#F7F4EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 text-left">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#626B45] mb-3">
            <span>ECOSYSTEM ARCHITECTURE</span>
          </div>
          
          <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-[42px] text-[#252A25] font-normal tracking-tight mb-4">
            Designed for Every Part of the Recovery Ecosystem.
          </h2>
          
          <p className="text-base text-[#777A72] leading-relaxed max-w-2xl">
            Whether generating surplus electronics or orchestrating recycling logistics, RESTOCK AI creates a direct, transparent conduit for responsible material recovery.
          </p>

          <p className="text-xs text-[#777A72] italic mt-3">
            *RESTOCK AI operates as a coordination software platform and facilitator, connecting generators with licensed downstream recycling entities.
          </p>
        </div>

        {/* 4 Solutions Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SOLUTIONS.map((solution) => (
            <div
              key={solution.id}
              className="bg-[#FFFEFA] border border-[#E6E2D8] hover:border-[#626B45]/40 rounded-3xl p-8 transition-all duration-300 shadow-[0_4px_20px_-8px_rgba(35,77,53,0.06)] hover:shadow-[0_12px_32px_-12px_rgba(35,77,53,0.12)] flex flex-col justify-between"
            >
              <div>
                {/* Header row with icon and audience */}
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#DCE5D5]/60 text-[#234D35] flex items-center justify-center shrink-0">
                    {getIcon(solution.iconName)}
                  </div>
                  <span className="text-xs text-[#777A72] font-medium text-right">
                    {solution.audience}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h3 className="font-serif-heading text-2xl text-[#252A25] font-normal mb-1">
                  {solution.title}
                </h3>
                <div className="text-xs font-semibold text-[#626B45] tracking-wide uppercase mb-4">
                  {solution.subtitle}
                </div>

                {/* Description */}
                <p className="text-sm text-[#777A72] leading-relaxed mb-6">
                  {solution.description}
                </p>

                {/* Highlights List */}
                <ul className="space-y-2.5 mb-8">
                  {solution.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-[#252A25]">
                      <div className="w-4 h-4 rounded-full bg-[#DCE5D5] text-[#234D35] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-[#E6E2D8] flex items-center justify-between">
                <button
                  onClick={() => setSelectedSolution(solution)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#234D35] hover:text-[#1a3a28] cursor-pointer hover:underline"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onRegisterInterest(solution.title)}
                  className="px-4 py-1.5 text-xs font-medium text-[#252A25] bg-[#F7F4EC] hover:bg-[#DCE5D5] rounded-full transition-colors cursor-pointer"
                >
                  Get Involved
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Modal for "Learn More" */}
      {selectedSolution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-3xl max-w-lg w-full p-7 shadow-2xl relative">
            <button
              onClick={() => setSelectedSolution(null)}
              className="absolute top-5 right-5 p-1.5 text-[#777A72] hover:text-[#252A25] rounded-full hover:bg-[#F7F4EC]"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#DCE5D5] text-[#234D35] flex items-center justify-center mb-4">
              {getIcon(selectedSolution.iconName)}
            </div>

            <h3 className="font-serif-heading text-2xl text-[#252A25] mb-1">
              {selectedSolution.title}
            </h3>
            <p className="text-xs text-[#626B45] font-semibold uppercase mb-4">
              {selectedSolution.subtitle}
            </p>

            <p className="text-sm text-[#777A72] leading-relaxed mb-6">
              {selectedSolution.description}
            </p>

            <div className="bg-[#F7F4EC] rounded-2xl p-4 border border-[#E6E2D8] mb-6 space-y-2.5">
              <div className="text-xs font-bold text-[#252A25] uppercase tracking-wider">
                Operational Advantages
              </div>
              {selectedSolution.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-[#252A25]">
                  <Check className="w-3.5 h-3.5 text-[#234D35] shrink-0 mt-0.5" />
                  <span>{h}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedSolution(null)}
                className="px-4 py-2 text-xs font-medium text-[#777A72] hover:text-[#252A25]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const title = selectedSolution.title;
                  setSelectedSolution(null);
                  onRegisterInterest(title);
                }}
                className="px-5 py-2 text-xs font-semibold text-[#FFFEFA] bg-[#234D35] hover:bg-[#1a3a28] rounded-full shadow-sm"
              >
                Register as {selectedSolution.title.split(' ')[0]}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
