import React from 'react';
import { CASE_STUDIES } from '../data/mockData';
import { Building, Sparkles, Laptop, BookOpen } from 'lucide-react';

export const CaseStudies: React.FC = () => {
  return (
    <section id="case-studies" className="py-20 bg-[#F7F4EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14 text-left">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#626B45] mb-2">
            <span>ILLUSTRATIVE RECOVERY MODELS</span>
          </div>

          <h2 className="font-serif-heading text-3xl sm:text-4xl text-[#252A25] font-normal tracking-tight mb-3">
            Small Changes. Meaningful Recovery.
          </h2>

          <p className="text-base text-[#777A72] leading-relaxed">
            Examine how diverse sectors can convert unorganized technology surplus into recoverable resource streams.
          </p>

          <div className="mt-3 inline-flex items-center gap-2 text-xs text-[#626B45] bg-[#DCE5D5]/60 px-3.5 py-1.5 rounded-lg border border-[#234D35]/10">
            <BookOpen className="w-3.5 h-3.5 text-[#234D35]" />
            <span className="font-medium">
              Representative Framework: Below models depict proposed use case workflows and operational pathways.
            </span>
          </div>
        </div>

        {/* 3 Case Study Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CASE_STUDIES.map((study) => (
            <div
              key={study.id}
              className="bg-[#FFFEFA] border border-[#E6E2D8] hover:border-[#626B45]/40 rounded-3xl overflow-hidden shadow-[0_4px_20px_-8px_rgba(35,77,53,0.06)] hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Visual Header with Botanical Tech Accent */}
                <div className="h-44 bg-gradient-to-br from-[#234D35] via-[#2c533c] to-[#1d3d29] p-5 text-[#FFFEFA] relative flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-white/15 text-[#DCE5D5]">
                      {study.category}
                    </span>
                    <span className="text-[11px] text-[#DCE5D5] italic">Proposed Model</span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-serif-heading text-xl text-white font-normal leading-snug">
                      {study.title}
                    </h3>
                    <p className="text-xs text-[#DCE5D5]/90">
                      {study.subtitle}
                    </p>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-4">
                  <div className="text-xs font-semibold text-[#234D35] bg-[#F7F4EC] px-3 py-1.5 rounded-lg border border-[#E6E2D8]">
                    Scope: {study.scope}
                  </div>

                  <p className="text-xs text-[#777A72] leading-relaxed">
                    {study.description}
                  </p>

                  {/* Quantitative Model Indicators */}
                  <div className="pt-2 border-t border-[#E6E2D8] space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#626B45]">
                      Recovery Pathway: <span className="text-[#252A25] font-semibold">{study.recoveryPathway}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {study.impactMetrics.slice(0, 2).map((metric, idx) => (
                        <div key={idx} className="bg-[#F7F4EC] p-2 rounded-xl text-left">
                          <div className="text-xs font-bold text-[#234D35] font-mono tabular-nums">
                            {metric.value}
                          </div>
                          <div className="text-[10px] text-[#777A72] leading-tight">
                            {metric.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Note */}
              <div className="px-6 pb-5 pt-1 text-[11px] text-[#777A72] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#626B45]" />
                <span>Standardized RESTOCK AI cataloging model</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
