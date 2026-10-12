import React, { useState } from 'react';
import { RecoveryRequest, PickupCoordinationGroup } from '../../types';
import { generatePickupCoordinationGroups } from '../../services/partnerMatchingService';
import { 
  Truck, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertCircle,
  Layers,
  ArrowRight,
  Sparkles,
  Info,
  FileText,
  X,
  User,
  Boxes,
  Compass
} from 'lucide-react';

interface PickupTrackingViewProps {
  requests: RecoveryRequest[];
  onNavigateToRequests: () => void;
  onOpenNewRequest?: () => void;
}

export const PickupTrackingView: React.FC<PickupTrackingViewProps> = ({
  requests,
  onNavigateToRequests,
  onOpenNewRequest
}) => {
  const [activeTab, setActiveTab] = useState<'tracking' | 'coordination'>('tracking');
  const [selectedEbolPickup, setSelectedEbolPickup] = useState<RecoveryRequest | null>(null);

  // Filter requests that are in active transit / collection / tracking
  const activePickups = requests.filter(r => 
    r.status !== 'Draft' && r.status !== 'Cancelled'
  );

  // Generate transparent rule-based coordination groups
  const coordinationGroups = generatePickupCoordinationGroups(requests);

  // 7-Stage Tracker milestones
  const LIFECYCLE_STAGES = [
    { key: 'Request Submitted', label: '1. Submitted' },
    { key: 'Partner Response Pending', label: '2. Response Pending' },
    { key: 'Partner Accepted', label: '3. Partner Accepted' },
    { key: 'Pickup Scheduled', label: '4. Pickup Scheduled' },
    { key: 'Collection Completed', label: '5. Collected' },
    { key: 'Processing Pending', label: '6. Processing' },
    { key: 'Final Documentation Available', label: '7. Final Documentation' },
  ];

  const getStageIndex = (status: string) => {
    switch (status) {
      case 'Request Submitted':
      case 'Draft':
      case 'Submitted':
        return 0;
      case 'Partner Response Pending':
      case 'Awaiting Partner':
        return 1;
      case 'Partner Accepted':
        return 2;
      case 'Pickup Scheduled':
        return 3;
      case 'Collection Completed':
      case 'Collected':
        return 4;
      case 'Processing Pending':
      case 'Processing Confirmed':
        return 5;
      case 'Final Documentation Available':
      case 'Completed':
        return 6;
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header with Dual View Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E2D8]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif-heading text-2xl sm:text-3xl text-[#252A25]">
              Pickup Logistics & Route Coordination
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#777A72] mt-1">
            Track multi-stage chain of custody and plan consolidated freight collections
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center p-1 bg-[#FFFEFA] border border-[#E6E2D8] rounded-xl self-start sm:self-auto shadow-sm">
          <button
            onClick={() => setActiveTab('tracking')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'tracking'
                ? 'bg-[#234D35] text-white shadow-sm'
                : 'text-[#777A72] hover:text-[#252A25]'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Active Tracking ({activePickups.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('coordination')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'coordination'
                ? 'bg-[#234D35] text-white shadow-sm'
                : 'text-[#777A72] hover:text-[#252A25]'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Pickup Coordination ({coordinationGroups.length} Runs)</span>
          </button>
        </div>
      </div>

      {/* VIEW TAB 1: ACTIVE PICKUP TRACKING & FULL 7-STAGE LIFECYCLE */}
      {activeTab === 'tracking' && (
        <div className="space-y-6">
          {activePickups.length === 0 ? (
            <div className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-3xl p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#F7F4EC] text-[#626B45] flex items-center justify-center mx-auto">
                <Truck className="w-7 h-7" />
              </div>
              <h3 className="font-serif-heading text-xl text-[#252A25]">
                No Active Recovery Pickups
              </h3>
              <p className="text-xs text-[#777A72] max-w-sm mx-auto">
                Submit an inventory lot for collection to track live dispatch, custody transfers, and environmental recycling certificates.
              </p>
              <div className="pt-2">
                <button
                  onClick={onNavigateToRequests}
                  className="px-5 py-2.5 text-xs font-semibold text-[#FFFEFA] bg-[#234D35] hover:bg-[#1a3a28] rounded-full transition-colors cursor-pointer"
                >
                  View Recovery Requests
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {activePickups.map((pickup) => {
                const currentStageIdx = getStageIndex(pickup.status);

                return (
                  <div
                    key={pickup.id}
                    className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 transition-all hover:border-[#626B45]/40"
                  >
                    {/* Top Row: Title, Partner, Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E2D8]">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#234D35]">
                            {pickup.id}
                          </span>
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#DCE5D5] text-[#234D35]">
                            {pickup.status}
                          </span>
                        </div>
                        <h3 className="font-serif-heading text-xl text-[#252A25] mt-1">
                          {pickup.itemTitle}
                        </h3>
                        <span className="text-xs text-[#777A72]">
                          {pickup.quantity} units · {pickup.category}
                        </span>
                      </div>

                      <div className="sm:text-right">
                        <span className="text-[11px] text-[#777A72]">Assigned Recovery Partner</span>
                        <div className="text-xs font-bold text-[#252A25]">
                          {pickup.assignedPartnerName || 'Awaiting Partner Confirmation'}
                        </div>
                        {pickup.preferredDate && (
                          <div className="text-[11px] text-[#626B45] flex items-center sm:justify-end gap-1 mt-0.5">
                            <Calendar className="w-3 h-3" />
                            <span>{pickup.preferredDate} ({pickup.proposedTimeWindow || '09:00 - 12:00'})</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Complete 7-Stage Milestone Progress Bar */}
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-[#626B45] mb-3 flex items-center justify-between">
                        <span>7-Stage Custodial Lifecycle Tracking</span>
                        <span className="text-[11px] font-normal lowercase text-[#777A72]">
                          Stage {currentStageIdx + 1} of 7
                        </span>
                      </div>

                      {/* Stepper Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
                        {LIFECYCLE_STAGES.map((stage, idx) => {
                          const isDone = idx < currentStageIdx;
                          const isCurrent = idx === currentStageIdx;
                          return (
                            <div
                              key={stage.key}
                              className={`p-2.5 rounded-xl border text-center transition-all ${
                                isDone
                                  ? 'bg-[#DCE5D5]/50 border-[#234D35]/30 text-[#234D35]'
                                  : isCurrent
                                  ? 'bg-[#234D35] border-[#234D35] text-white shadow-sm'
                                  : 'bg-[#F7F4EC] border-[#E6E2D8] text-[#777A72]'
                              }`}
                            >
                              <div className="text-[10px] font-bold truncate">
                                {stage.label}
                              </div>
                              <div className="text-[9px] mt-0.5 opacity-80">
                                {isDone ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Logistics Vehicle & Location Details */}
                    <div className="p-4 rounded-2xl bg-[#F7F4EC] border border-[#E6E2D8] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-[#234D35] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-[#252A25]">Collection Bay Address</span>
                          <p className="text-[#777A72] text-[11px] leading-tight mt-0.5">
                            {pickup.collectionLocation}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <Truck className="w-4 h-4 text-[#234D35] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-[#252A25]">Carrier Vehicle & Driver</span>
                          <p className="text-[#777A72] text-[11px] leading-tight mt-0.5">
                            {pickup.driverDetails ? (
                              <span>{pickup.driverDetails.vehiclePlate} ({pickup.driverDetails.driverName})</span>
                            ) : (
                              <span>Dispatch Pending Driver Assignment</span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-[#234D35] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-[#252A25]">Chain of Custody Code</span>
                          <p className="text-[#777A72] text-[11px] leading-tight mt-0.5 font-mono">
                            {pickup.custodyReceiptId || 'eBOL Pending Handshake'}
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* Action Links */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                      <div className="text-[#777A72] text-[11px]">
                        Last updated from carrier dispatch terminal.
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedEbolPickup(pickup)}
                          className="px-3.5 py-1.5 rounded-full border border-[#E6E2D8] bg-white hover:bg-[#F7F4EC] font-semibold text-[#252A25] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#626B45]" />
                          <span>View Custodial e-BOL</span>
                        </button>
                        <button
                          onClick={onNavigateToRequests}
                          className="px-4 py-1.5 rounded-full bg-[#234D35] hover:bg-[#1a3a28] font-semibold text-white transition-colors cursor-pointer"
                        >
                          Manage in Requests
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW TAB 2: PICKUP COORDINATION & ROUTE BUNDLING PLANNING (FEATURE 4) */}
      {activeTab === 'coordination' && (
        <div className="space-y-6">
          
          {/* Transparent Rule-Based Methodology Card */}
          <div className="p-4 rounded-2xl bg-[#FFFEFA] border border-[#234D35]/30 shadow-sm space-y-2 text-xs">
            <div className="flex items-center gap-2 font-semibold text-[#234D35]">
              <Compass className="w-4 h-4 text-[#234D35]" />
              <span>Transparent Rule-Based Pickup Planning Engine</span>
            </div>
            <p className="text-[#777A72] text-[11px] leading-relaxed">
              To minimize transportation footprint and unnecessary carrier dispatches, RESTOCK AI evaluates submitted requests across <strong>geographic proximity (&lt; 8 km radius)</strong>, <strong>scheduled timing (&plusmn; 72-hour operating windows)</strong>, and <strong>material stream compatibility</strong>. 
              <br />
              <em>Prototype Disclosure: This algorithm utilizes transparent rule-based clustering heuristics and does not falsely claim an ungrounded real-world routing solver.</em>
            </p>
          </div>

          {coordinationGroups.length === 0 ? (
            <div className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-3xl p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#F7F4EC] text-[#626B45] flex items-center justify-center mx-auto">
                <Boxes className="w-7 h-7" />
              </div>
              <h3 className="font-serif-heading text-xl text-[#252A25]">
                No Eligible Coordination Groups Formed Yet
              </h3>
              <p className="text-xs text-[#777A72] max-w-sm mx-auto">
                When two or more requests share regional proximity and compatible timelines, route bundling suggestions appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {coordinationGroups.map((group) => (
                <div
                  key={group.id}
                  className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-3xl p-6 sm:p-8 shadow-sm space-y-5"
                >
                  {/* Bundle Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E2D8]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#626B45]">
                          {group.id}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DCE5D5] text-[#234D35]">
                          {group.status}
                        </span>
                      </div>
                      <h3 className="font-serif-heading text-xl sm:text-2xl text-[#252A25] mt-1">
                        {group.groupTitle}
                      </h3>
                      <p className="text-xs text-[#777A72] flex items-center gap-2 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#626B45]" />
                        <span>Zone: {group.zone} · Target Date: {group.suggestedDate}</span>
                      </p>
                    </div>

                    {/* Efficiency Stats */}
                    <div className="flex items-center gap-4 bg-[#F7F4EC] px-4 py-2.5 rounded-2xl border border-[#E6E2D8]">
                      <div className="text-center">
                        <span className="text-[10px] uppercase font-bold text-[#777A72]">Trips Saved</span>
                        <div className="font-mono text-lg font-bold text-[#234D35]">
                          {group.logisticsEfficiency.freightTripsSaved} Haul
                        </div>
                      </div>
                      <div className="h-8 w-px bg-[#E6E2D8]" />
                      <div className="text-center">
                        <span className="text-[10px] uppercase font-bold text-[#777A72]">Payload</span>
                        <div className="font-mono text-lg font-bold text-[#252A25]">
                          ~{group.totalWeightKg} kg
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Compatibility Rationale Breakdown */}
                  <div className="bg-[#F7F4EC] rounded-2xl p-4 border border-[#E6E2D8] space-y-2.5 text-xs">
                    <div className="font-semibold text-[#234D35] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#234D35]" />
                      <span>Clustering Compatibility Factors (Rule-Based):</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-[#777A72]">
                      <div className="bg-white p-3 rounded-xl border border-[#E6E2D8]">
                        <strong className="text-[#252A25] block mb-1">1. Proximity Fit</strong>
                        <span>{group.compatibilityRationale.locationProximity}</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-[#E6E2D8]">
                        <strong className="text-[#252A25] block mb-1">2. Timing Alignment</strong>
                        <span>{group.compatibilityRationale.timingAlignment}</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-[#E6E2D8]">
                        <strong className="text-[#252A25] block mb-1">3. Material Stream</strong>
                        <span>{group.compatibilityRationale.materialCompatibility}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bundled Requests List */}
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#626B45] mb-2.5">
                      Included Compatible Requests in this Consolidation ({group.requests.length}):
                    </div>
                    <div className="divide-y divide-[#E6E2D8] border border-[#E6E2D8] rounded-2xl overflow-hidden bg-white">
                      {group.requests.map((req) => (
                        <div key={req.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div>
                            <div className="font-semibold text-[#252A25] flex items-center gap-2">
                              <span>{req.itemTitle}</span>
                              <span className="font-mono text-[10px] text-[#777A72]">({req.id})</span>
                            </div>
                            <span className="text-[#777A72] text-[11px]">
                              {req.collectionLocation} · {req.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-right">
                            <span className="font-mono font-bold text-[#234D35]">
                              {req.quantity} units (~{req.estimatedWeightKg || 30} kg)
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F7F4EC] border border-[#E6E2D8] text-[#252A25]">
                              {req.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <span className="text-[11px] text-[#777A72]">
                      Carrier Assigned: <strong>{group.carrierPartnerName}</strong>
                    </span>
                    <button
                      onClick={() => {
                        alert(`Consolidated Run Manifest generated for ${group.id}. Partner notified of unified route window.`);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#FFFEFA] bg-[#234D35] hover:bg-[#1a3a28] rounded-full transition-colors cursor-pointer self-start sm:self-auto"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Lock Consolidated Run Schedule</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* ELECTRONIC BILL OF LADING (e-BOL) MODAL */}
      {selectedEbolPickup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-auto space-y-5">
            
            <div className="flex items-start justify-between pb-3 border-b border-[#E6E2D8]">
              <div>
                <span className="font-mono text-[10px] uppercase text-[#626B45]">
                  ELECTRONIC BILL OF LADING · CUSTODY TRANSFER
                </span>
                <h3 className="font-serif-heading text-xl text-[#252A25] mt-0.5">
                  e-BOL Manifest #{selectedEbolPickup.custodyReceiptId || 'eBOL-2026-9881'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEbolPickup(null)}
                className="p-1.5 text-[#777A72] hover:text-[#252A25] rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#F7F4EC] p-4 rounded-2xl border border-[#E6E2D8] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#777A72]">Generator Site:</span>
                <span className="font-semibold text-[#252A25]">{selectedEbolPickup.collectionLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777A72]">Carrier / Receiver:</span>
                <span className="font-semibold text-[#252A25]">{selectedEbolPickup.assignedPartnerName || 'Veritas Eco-Tech ITAD'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777A72]">Dispatched Material:</span>
                <span className="font-mono text-[#252A25]">{selectedEbolPickup.itemTitle} ({selectedEbolPickup.quantity} units)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777A72]">Carrier Driver:</span>
                <span className="text-[#252A25]">{selectedEbolPickup.driverDetails?.driverName || 'Marcus Vance'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777A72]">Transport Plate:</span>
                <span className="font-mono text-[#252A25]">{selectedEbolPickup.driverDetails?.vehiclePlate || 'WA-792-ECO'}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#E6E2D8] text-[11px] text-[#777A72]">
              <strong>Custodial Declaration:</strong> Both parties certify that electronic materials listed were transferred in protective packaging with serialized chain-of-custody tracking.
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => setSelectedEbolPickup(null)}
                className="px-4 py-2 text-xs font-medium text-[#777A72]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Electronic custody receipt eBOL-${selectedEbolPickup.id} copied to clipboard`);
                }}
                className="px-4 py-2 text-xs font-semibold text-[#FFFEFA] bg-[#234D35] hover:bg-[#1a3a28] rounded-full shadow-sm cursor-pointer"
              >
                Copy Sign-Off Hash
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
