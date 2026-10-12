import React from 'react';
import { ShieldCheck, FileCheck, Search, Users, Truck, AlertTriangle } from 'lucide-react';

export const TrustResponsibility: React.FC = () => {
  const pillars = [
    {
      title: 'Organized Digital Inventory',
      description: 'Standardize item models, counts, memory configs, and physical conditions before scheduling intake.',
      icon: FileCheck
    },
    {
      title: 'Transparent Request Tracking',
      description: 'Follow pickup statuses from initial request submission through partner verification and receipt.',
      icon: Search
    },
    {
      title: 'Recovery Partner Information',
      description: 'Review verified processor capabilities, accepted streams, service territories, and minimum lot thresholds.',
      icon: Users
    },
    {
      title: 'Collection Documentation',
      description: 'Maintain consolidated records of equipment handoffs, transport manifests, and downstream recipient details.',
      icon: ShieldCheck
    },
    {
      title: 'Responsible Recycling Coordination',
      description: 'Prioritize circular hierarchies: device refurbishment first, harvested components second, and safe materials recycling third.',
      icon: Truck
    }
  ];

  return (
    <section id="trust" className="py-20 bg-[#FFFEFA] border-y border-[#E6E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#626B45]">
            <span>COMPLIANCE & GOVERNANCE</span>
          </div>

          <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-[42px] text-[#252A25] font-normal tracking-tight">
            Recovery With Responsibility at Its Core.
          </h2>

          <p className="text-base text-[#777A72] leading-relaxed">
            RESTOCK AI is engineered to help generators systematically identify appropriate recovery pathways 
            and coordinate with suitable authorized handlers.
          </p>
        </div>

        {/* 5 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-[#F7F4EC] border border-[#E6E2D8] rounded-2xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-[#DCE5D5] text-[#234D35] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#252A25] mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-[#777A72] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}

          {/* 6th Tile: Regulatory & Safety Advisory Banner */}
          <div className="bg-[#234D35] text-[#FFFEFA] rounded-2xl p-6 flex flex-col justify-between md:col-span-2 lg:col-span-1">
            <div>
              <div className="w-11 h-11 rounded-xl bg-white/10 text-[#DCE5D5] flex items-center justify-center mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Operational Verification
              </h3>
              <p className="text-xs text-[#DCE5D5]/90 leading-relaxed">
                Acceptance, collection, transport, and processing depend on individual partner capabilities and statutory requirements.
              </p>
            </div>
            <div className="text-[11px] text-[#DCE5D5]/70 pt-4 border-t border-white/10 mt-4">
              Direct verification required before batch release.
            </div>
          </div>
        </div>

        {/* Mandatory Explicit Requirement Box from Prompt */}
        <div className="bg-[#F7F4EC] border border-[#E6E2D8] rounded-2xl p-5 text-center max-w-4xl mx-auto text-xs text-[#626B45] leading-relaxed">
          <p className="font-medium">
            "Acceptance, collection, transport, and processing depend on partner capabilities and applicable requirements. Always verify authorization and documentation before arranging collection."
          </p>
        </div>

      </div>
    </section>
  );
};
