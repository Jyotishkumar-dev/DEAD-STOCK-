import React, { useState } from 'react';
import { ResourceInventoryItem, RecoveryPartner } from '../../types';
import { matchPartnersForItem } from '../../services/partnerMatchingService';
import { SAMPLE_PARTNERS } from '../../data/mockData';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Truck, 
  Clock, 
  ChevronRight, 
  Layers, 
  AlertCircle,
  ArrowRight,
  Info
} from 'lucide-react';

interface PartnerMatchingModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: ResourceInventoryItem[];
  preselectedItemId?: string;
  onSelectPartnerForRequest: (partner: RecoveryPartner, item: ResourceInventoryItem) => void;
}

export const PartnerMatchingModal: React.FC<PartnerMatchingModalProps> = ({
  isOpen,
  onClose,
  inventory,
  preselectedItemId,
  onSelectPartnerForRequest
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string>(
    preselectedItemId || (inventory[0]?.id || '')
  );

  if (!isOpen) return null;

  const activeItem = inventory.find(i => i.id === selectedItemId) || inventory[0];

  const matchResults = activeItem 
    ? matchPartnersForItem({
        category: activeItem.category,
        deviceType: activeItem.deviceType,
        quantity: activeItem.quantity,
        estimatedWeightKg: activeItem.estimatedWeightKg,
        location: activeItem.location,
        specialHandlingNotes: activeItem.specialHandlingNotes
      })
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative my-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#E6E2D8]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#DCE5D5] text-[#234D35] text-[11px] font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Transparent Rule-Based Matchmaker</span>
            </div>
            <h3 className="font-serif-heading text-2xl text-[#252A25]">
              Match Recovery Partners
            </h3>
            <p className="text-xs text-[#777A72]">
              Evaluates material streams, minimum lot size, service radius, and handling capabilities
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#777A72] hover:text-[#252A25] rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Disclaimer */}
        <div className="p-3 rounded-xl bg-[#F7F4EC] border border-[#E6E2D8] flex items-center gap-2 text-xs text-[#777A72]">
          <Info className="w-4 h-4 text-[#626B45] shrink-0" />
          <span>Fictional sample records for prototyping only. Verifications and permits are simulated for testing.</span>
        </div>

        {/* Item Selector */}
        {inventory.length > 0 && (
          <div className="bg-[#F7F4EC] p-4 rounded-2xl border border-[#E6E2D8] space-y-2">
            <label className="block text-xs font-semibold text-[#252A25]">
              Select Inventory Lot to Match:
            </label>
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="w-full text-xs bg-[#FFFEFA] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#252A25] font-medium"
            >
              {inventory.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.deviceType} ({item.quantity} units · {item.category} · {item.location})
                </option>
              ))}
            </select>

            {activeItem && (
              <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#777A72] pt-1">
                <span>Category: <strong className="text-[#252A25]">{activeItem.category}</strong></span>
                <span>Quantity: <strong className="text-[#252A25]">{activeItem.quantity} units</strong></span>
                <span>Location: <strong className="text-[#252A25]">{activeItem.location}</strong></span>
                {activeItem.estimatedWeightKg && (
                  <span>Weight: <strong className="text-[#252A25]">~{activeItem.estimatedWeightKg} kg</strong></span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Matching Results List */}
        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
          <div className="text-xs font-bold uppercase tracking-wider text-[#626B45] flex items-center justify-between">
            <span>Ranked Compatible Partners ({matchResults.length})</span>
            <span className="text-[11px] font-normal lowercase text-[#777A72]">
              Scored via 4-dimensional criteria
            </span>
          </div>

          {matchResults.map((result, idx) => {
            const { partner, matchScore, isRecommended, factors, summaryWhy } = result;

            return (
              <div
                key={partner.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isRecommended
                    ? 'bg-[#FFFEFA] border-[#234D35]/40 shadow-sm'
                    : 'bg-[#FFFEFA] border-[#E6E2D8]'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif-heading text-lg text-[#252A25]">
                        {partner.name}
                      </h4>
                      {isRecommended && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DCE5D5] text-[#234D35]">
                          Recommended Match
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#626B45] font-medium mt-0.5">
                      {partner.type} · {partner.serviceArea}
                    </div>
                  </div>

                  {/* Match Score Badge */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-bold text-[#777A72]">
                        Match Score
                      </div>
                      <div className="font-mono text-xl font-bold text-[#234D35]">
                        {matchScore}%
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-[#DCE5D5] flex items-center justify-center font-bold text-xs text-[#234D35] bg-[#F7F4EC]">
                      #{idx + 1}
                    </div>
                  </div>
                </div>

                {/* Why This Partner Is Suggested */}
                <div className="bg-[#F7F4EC] rounded-xl p-3 border border-[#E6E2D8] text-xs space-y-1 mb-3">
                  <div className="font-semibold text-[#234D35] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#234D35]" />
                    <span>Why Suggested:</span>
                  </div>
                  <p className="text-[11px] text-[#777A72] leading-relaxed">
                    {summaryWhy}
                  </p>
                </div>

                {/* Compatibility Factor Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 text-[11px]">
                  {factors.map((f, fIdx) => (
                    <div
                      key={fIdx}
                      className="p-2.5 rounded-xl bg-white border border-[#E6E2D8] space-y-0.5"
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-[#252A25]">{f.factor}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                          f.status === 'Matched'
                            ? 'text-emerald-700 bg-emerald-50'
                            : f.status === 'Partial'
                            ? 'text-amber-700 bg-amber-50'
                            : 'text-red-700 bg-red-50'
                        }`}>
                          {f.status} ({f.score}%)
                        </span>
                      </div>
                      <p className="text-[#777A72] text-[10px] leading-tight">
                        {f.details}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Partner Logistics & Dispatch summary */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E6E2D8] text-xs">
                  <div className="flex items-center gap-3 text-[#777A72] text-[11px]">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3 h-3 text-[#234D35]" />
                      <span>{partner.logisticsSupport}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#626B45]" />
                      <span>Lead Time: ~{partner.leadTimeDays} days</span>
                    </span>
                  </div>

                  {activeItem && (
                    <button
                      onClick={() => {
                        onSelectPartnerForRequest(partner, activeItem);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-[#FFFEFA] bg-[#234D35] hover:bg-[#1a3a28] rounded-full transition-colors cursor-pointer"
                    >
                      <span>Select Partner & Propose Pickup</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#E6E2D8] flex items-center justify-between">
          <span className="text-[11px] text-[#777A72]">
            Matching algorithm considers material types, site location, lot size thresholds, and freight readiness.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#777A72] hover:text-[#252A25]"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
