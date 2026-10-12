import React, { useState } from 'react';
import { SAMPLE_PARTNERS } from '../../data/mockData';
import { RecoveryPartner, ResourceInventoryItem } from '../../types';
import { 
  Search, 
  MapPin, 
  Truck, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Building2, 
  Info, 
  Sparkles, 
  AlertTriangle,
  X,
  Layers,
  Clock
} from 'lucide-react';

interface FindPartnersViewProps {
  onSelectPartnerForInquiry: (partner: RecoveryPartner) => void;
  onLaunchPartnerMatch?: (partner?: RecoveryPartner) => void;
  inventory?: ResourceInventoryItem[];
}

export const FindPartnersView: React.FC<FindPartnersViewProps> = ({
  onSelectPartnerForInquiry,
  onLaunchPartnerMatch,
  inventory = []
}) => {
  const [search, setSearch] = useState('');
  const [materialFilter, setMaterialFilter] = useState('All');
  const [verificationFilter, setVerificationFilter] = useState('All');
  const [selectedPartnerDetail, setSelectedPartnerDetail] = useState<RecoveryPartner | null>(null);

  const filtered = SAMPLE_PARTNERS.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.type.toLowerCase().includes(search.toLowerCase()) ||
      p.serviceArea.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.availableServices.some(s => s.toLowerCase().includes(search.toLowerCase()));

    const matchesMat = 
      materialFilter === 'All' || 
      p.acceptedMaterials.some(m => m.toLowerCase().includes(materialFilter.toLowerCase()));

    const matchesVerif = 
      verificationFilter === 'All' || 
      p.verificationStatus === verificationFilter;

    return matchesSearch && matchesMat && matchesVerif;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E2D8]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif-heading text-2xl sm:text-3xl text-[#252A25]">
              Recovery Partner Directory
            </h1>
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-[#F7F4EC] border border-[#E6E2D8] text-[#234D35]">
              {filtered.length} Facilities Listed
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#777A72] mt-1">
            Discover authorized recyclers, ITAD processors, and metallurgical refiners with verified capabilities
          </p>
        </div>

        {onLaunchPartnerMatch && (
          <button
            onClick={() => onLaunchPartnerMatch()}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#FFFEFA] bg-[#234D35] hover:bg-[#1a3a28] rounded-full transition-all cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Smart Matchmaker</span>
          </button>
        )}
      </div>

      {/* Mandatory Regulatory & Demo Data Disclosure Banner */}
      <div className="p-4 rounded-2xl bg-[#F7F4EC] border border-[#E6E2D8] flex items-start gap-3 text-xs">
        <Info className="w-4 h-4 text-[#626B45] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-semibold text-[#252A25]">Demonstration Environment Notice</span>
          <p className="text-[#777A72] leading-relaxed text-[11px]">
            Partner profiles and facility data displayed here are fictional demonstration records constructed for prototype evaluation. RESTOCK AI does not falsely claim unverified organizations are certified. In production, certifications and permits are validated against state environmental registers and authorized audit bodies.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-[#777A72] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search facility name, service, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl pl-9 pr-3.5 py-2 text-[#252A25] focus:border-[#234D35] focus:ring-1 focus:ring-[#234D35]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs w-full md:w-auto">
          {['All', 'Laptops', 'Circuit Boards', 'Cables', 'Printers'].map((mat) => (
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
          
          <div className="h-4 w-px bg-[#E6E2D8] mx-1 hidden sm:block" />

          {['All', 'Demo Verified', 'Pending Audit'].map((verif) => (
            <button
              key={verif}
              onClick={() => setVerificationFilter(verif)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                verificationFilter === verif
                  ? 'bg-[#626B45] text-white'
                  : 'bg-[#F7F4EC] text-[#777A72] hover:bg-[#E6E2D8]'
              }`}
            >
              {verif}
            </button>
          ))}
        </div>
      </div>

      {/* Partners List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((partner) => (
          <div
            key={partner.id}
            className="bg-[#FFFEFA] border border-[#E6E2D8] hover:border-[#626B45]/40 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Partner Header */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h3 className="font-serif-heading text-lg text-[#252A25]">
                    {partner.name}
                  </h3>
                  <div className="text-xs font-semibold text-[#626B45] mt-0.5">
                    {partner.type}
                  </div>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 shrink-0 ${
                  partner.verificationStatus === 'Demo Verified'
                    ? 'bg-[#DCE5D5] text-[#234D35]'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  <ShieldCheck className="w-3 h-3" />
                  <span>{partner.verificationStatus}</span>
                </div>
              </div>

              {/* Service Area */}
              <div className="flex items-center gap-1.5 text-xs text-[#777A72] mb-3">
                <MapPin className="w-3.5 h-3.5 text-[#626B45] shrink-0" />
                <span>Service Radius: <strong>{partner.serviceArea}</strong></span>
              </div>

              <p className="text-xs text-[#777A72] leading-relaxed mb-4">
                {partner.description}
              </p>

              {/* Available Services */}
              <div className="mb-4">
                <div className="text-[11px] font-semibold text-[#252A25] uppercase tracking-wider mb-1.5">
                  Available Services & Capabilities:
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-[#252A25]">
                  {partner.availableServices.map((srv, idx) => (
                    <li key={idx} className="flex items-center gap-1.5 text-[#777A72]">
                      <Check className="w-3 h-3 text-[#234D35] shrink-0" />
                      <span className="truncate">{srv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Accepted materials */}
              <div className="mb-4">
                <div className="text-[11px] font-semibold text-[#252A25] uppercase tracking-wider mb-1.5">
                  Accepted Material Streams:
                </div>
                <div className="flex flex-wrap gap-1">
                  {partner.acceptedMaterials.map((m, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#F7F4EC] text-[#252A25] border border-[#E6E2D8]"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Operational & Logistics notes */}
              <div className="bg-[#F7F4EC] rounded-xl p-3 border border-[#E6E2D8] text-[11px] text-[#777A72] space-y-1.5 mb-4">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#234D35] shrink-0" />
                  <span>Logistics: <strong>{partner.logisticsSupport}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#626B45] shrink-0" />
                  <span>Intake Notice: <strong>{partner.leadTimeDays} business days</strong> (Min: {partner.minimumLot})</span>
                </div>
                <div className="text-[10px] text-[#777A72] italic pt-1 border-t border-[#E6E2D8]/60">
                  Notes: {partner.operationalNotes}
                </div>
              </div>

              {/* Verified Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {partner.verifiedBadges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#234D35]"
                  >
                    <Check className="w-3 h-3 text-[#234D35]" />
                    <span>{badge}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="pt-4 border-t border-[#E6E2D8] flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedPartnerDetail(partner)}
                className="text-xs font-semibold text-[#626B45] hover:text-[#234D35] hover:underline cursor-pointer"
              >
                View Full Profile & Facility
              </button>
              
              <div className="flex items-center gap-2">
                {onLaunchPartnerMatch && (
                  <button
                    onClick={() => onLaunchPartnerMatch(partner)}
                    className="px-3 py-1.5 text-xs font-semibold text-[#234D35] bg-[#DCE5D5]/50 hover:bg-[#DCE5D5] rounded-full border border-[#234D35]/20 transition-colors cursor-pointer"
                    title="Match with your registered lots"
                  >
                    Match Lots
                  </button>
                )}
                <button
                  onClick={() => onSelectPartnerForInquiry(partner)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#FFFEFA] bg-[#234D35] hover:bg-[#1a3a28] rounded-full transition-colors cursor-pointer"
                >
                  <span>Request Intake</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Partner Full Profile Modal */}
      {selectedPartnerDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-auto space-y-5">
            
            <div className="flex items-start justify-between pb-4 border-b border-[#E6E2D8]">
              <div>
                <span className="font-mono text-xs text-[#626B45]">
                  Facility ID: {selectedPartnerDetail.id}
                </span>
                <h3 className="font-serif-heading text-2xl text-[#252A25]">
                  {selectedPartnerDetail.name}
                </h3>
                <p className="text-xs font-semibold text-[#626B45]">
                  {selectedPartnerDetail.type}
                </p>
              </div>
              <button
                onClick={() => setSelectedPartnerDetail(null)}
                className="p-1.5 text-[#777A72] hover:text-[#252A25] rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Verification & Demo Notice */}
            <div className="p-3.5 rounded-2xl bg-[#F7F4EC] border border-[#E6E2D8] text-xs space-y-1">
              <div className="font-semibold text-[#234D35] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#234D35]" />
                <span>Status: {selectedPartnerDetail.verificationStatus}</span>
              </div>
              <p className="text-[#777A72] text-[11px]">
                {selectedPartnerDetail.verificationDetails}
              </p>
            </div>

            {/* Contact Details */}
            <div className="bg-[#FFFEFA] p-4 rounded-2xl border border-[#E6E2D8] space-y-2 text-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#626B45]">
                Facility Address & Intake Contacts
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#252A25]">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#234D35]" />
                  <span>{selectedPartnerDetail.contactInfo.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#234D35]" />
                  <span className="truncate">{selectedPartnerDetail.contactInfo.email}</span>
                </div>
                <div className="flex items-start gap-2 col-span-1 sm:col-span-2">
                  <Building2 className="w-3.5 h-3.5 text-[#234D35] shrink-0 mt-0.5" />
                  <span>{selectedPartnerDetail.contactInfo.facilityAddress}</span>
                </div>
                {selectedPartnerDetail.contactInfo.dispatchHub && (
                  <div className="flex items-center gap-2 col-span-1 sm:col-span-2 text-[#777A72] text-[11px]">
                    <Truck className="w-3.5 h-3.5 text-[#626B45]" />
                    <span>Dispatch Hub: {selectedPartnerDetail.contactInfo.dispatchHub}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Operational Notes */}
            <div className="p-4 rounded-2xl bg-[#F7F4EC] border border-[#E6E2D8] text-xs space-y-1">
              <div className="font-semibold text-[#252A25]">Operational Receiving Requirements</div>
              <p className="text-[#777A72] text-[11px] leading-relaxed">
                {selectedPartnerDetail.operationalNotes}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-[#E6E2D8] flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedPartnerDetail(null)}
                className="px-4 py-2 text-xs font-medium text-[#777A72]"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                {onLaunchPartnerMatch && (
                  <button
                    onClick={() => {
                      const p = selectedPartnerDetail;
                      setSelectedPartnerDetail(null);
                      onLaunchPartnerMatch(p);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-[#234D35] bg-[#DCE5D5] hover:bg-[#d0ddc7] rounded-full transition-colors cursor-pointer"
                  >
                    Match With Inventory
                  </button>
                )}
                <button
                  onClick={() => {
                    const p = selectedPartnerDetail;
                    setSelectedPartnerDetail(null);
                    onSelectPartnerForInquiry(p);
                  }}
                  className="px-5 py-2 text-xs font-semibold text-[#FFFEFA] bg-[#234D35] hover:bg-[#1a3a28] rounded-full shadow-sm cursor-pointer"
                >
                  Initiate Intake Request
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
