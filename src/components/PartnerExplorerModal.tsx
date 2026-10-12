import React, { useState } from 'react';
import { SAMPLE_PARTNERS } from '../data/mockData';
import { RecoveryPartner } from '../types';
import { X, Search, ShieldCheck, MapPin, Truck, Layers, ArrowRight, Check } from 'lucide-react';

interface PartnerExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPartnerForInquiry: (partner: RecoveryPartner) => void;
}

export const PartnerExplorerModal: React.FC<PartnerExplorerModalProps> = ({
  isOpen,
  onClose,
  onSelectPartnerForInquiry
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [materialFilter, setMaterialFilter] = useState('All');

  if (!isOpen) return null;

  const filteredPartners = SAMPLE_PARTNERS.filter((partner) => {
    const matchesQuery = 
      partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesMaterial = 
      materialFilter === 'All' ||
      partner.acceptedMaterials.some(m => m.toLowerCase().includes(materialFilter.toLowerCase()));

    return matchesQuery && matchesMaterial;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-3xl max-w-4xl w-full max-h-[90vh] shadow-2xl overflow-hidden flex flex-col my-auto relative">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#E6E2D8] flex items-center justify-between bg-[#F7F4EC]">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#626B45]">
              VERIFIED RECOVERY NETWORK
            </div>
            <h3 className="font-serif-heading text-2xl text-[#252A25]">
              Authorized Recovery Partners
            </h3>
            <p className="text-xs text-[#777A72]">
              Explore downstream recyclers, refurbishers, and component harvesters by capability and intake criteria
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

        {/* Filter and Search Bar */}
        <div className="p-6 border-b border-[#E6E2D8] bg-[#FFFEFA] space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-[#777A72] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search partner by name, facility type, or focus area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl pl-9 pr-4 py-2.5 text-[#252A25] focus:border-[#234D35] focus:ring-1 focus:ring-[#234D35]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#626B45] font-semibold text-[11px] uppercase mr-1">Material Stream:</span>
            {['All', 'Laptops', 'Circuit Boards', 'Cables', 'Mobile', 'Printers'].map((mat) => (
              <button
                key={mat}
                onClick={() => setMaterialFilter(mat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  materialFilter === mat
                    ? 'bg-[#234D35] text-white shadow-sm'
                    : 'bg-[#F7F4EC] text-[#252A25] hover:bg-[#E6E2D8]'
                }`}
              >
                {mat}
              </button>
            ))}
          </div>
        </div>

        {/* Partners List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {filteredPartners.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#777A72]">
              No authorized recovery partners matching current criteria. Try adjusting your search query.
            </div>
          ) : (
            filteredPartners.map((partner) => (
              <div
                key={partner.id}
                className="bg-[#F7F4EC] border border-[#E6E2D8] hover:border-[#626B45]/40 rounded-2xl p-5 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif-heading text-lg text-[#252A25]">
                        {partner.name}
                      </h4>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#DCE5D5] text-[#234D35]">
                        {partner.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#626B45] mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{partner.serviceArea}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onSelectPartnerForInquiry(partner);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#FFFEFA] bg-[#234D35] hover:bg-[#1a3a28] rounded-full transition-colors cursor-pointer shrink-0"
                  >
                    <span>Request Intake</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-[#777A72] leading-relaxed">
                  {partner.description}
                </p>

                {/* Accepted Materials */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-medium text-[#252A25] mr-1">Accepted:</span>
                  {partner.acceptedMaterials.map((mat, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded bg-white border border-[#E6E2D8] text-[#252A25]"
                    >
                      {mat}
                    </span>
                  ))}
                </div>

                {/* Operational Details */}
                <div className="pt-3 border-t border-[#E6E2D8] flex flex-wrap items-center justify-between gap-y-2 text-[11px] text-[#777A72]">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#234D35]" />
                    <span>Logistics: {partner.logisticsSupport}</span>
                  </div>
                  <div>
                    <span>Min. Lot: <strong>{partner.minimumLot}</strong></span>
                  </div>
                </div>

                {/* Verified Badges */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {partner.verifiedBadges.map((badge, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-[10px] text-[#234D35] font-semibold"
                    >
                      <Check className="w-3 h-3 text-[#234D35]" />
                      <span>{badge}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer note */}
        <div className="px-6 py-4 bg-[#F7F4EC] border-t border-[#E6E2D8] text-center text-xs text-[#777A72]">
          All partner handlers undergo credentials review prior to listing on RESTOCK AI.
        </div>

      </div>
    </div>
  );
};
