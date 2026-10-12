import React, { useState } from 'react';
import { 
  RecoveryRequest, 
  RecoveryRequestStatus, 
  ResourceInventoryItem, 
  RecoveryPartner 
} from '../../types';
import { SAMPLE_PARTNERS } from '../../data/mockData';
import { matchPartnersForItem } from '../../services/partnerMatchingService';
import { 
  Plus, 
  Search, 
  Clock, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  FileText, 
  ArrowRight, 
  X, 
  ChevronRight,
  Sparkles,
  AlertCircle,
  Calendar,
  Building2,
  Check,
  Download,
  Info,
  UserCheck
} from 'lucide-react';

interface RecoveryRequestsViewProps {
  requests: RecoveryRequest[];
  inventory: ResourceInventoryItem[];
  onCreateRequest: (request: RecoveryRequest) => void;
  onUpdateRequestStatus: (requestId: string, newStatus: RecoveryRequestStatus, note?: string) => void;
  initialSelectedItemId?: string | null;
  initialSelectedPartnerId?: string | null;
  onOpenMatchmaker?: (item?: ResourceInventoryItem) => void;
}

export const RecoveryRequestsView: React.FC<RecoveryRequestsViewProps> = ({
  requests,
  inventory,
  onCreateRequest,
  onUpdateRequestStatus,
  initialSelectedItemId,
  initialSelectedPartnerId,
  onOpenMatchmaker
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(Boolean(initialSelectedItemId));
  const [selectedRequestDetail, setSelectedRequestDetail] = useState<RecoveryRequest | null>(null);
  const [partnerAcceptanceModalReq, setPartnerAcceptanceModalReq] = useState<RecoveryRequest | null>(null);
  const [viewingCertDocReq, setViewingCertDocReq] = useState<RecoveryRequest | null>(null);

  // Create form state
  const [selectedInventoryId, setSelectedInventoryId] = useState<string>(
    initialSelectedItemId || (inventory[0]?.id || '')
  );
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(
    initialSelectedPartnerId || SAMPLE_PARTNERS[0].id
  );
  const [requestQty, setRequestQty] = useState<number>(10);
  const [collectionLocation, setCollectionLocation] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [proposedTimeWindow, setProposedTimeWindow] = useState('09:00 - 12:00 Local');
  const [contactName, setContactName] = useState('Sarah Jenkins');
  const [contactPhone, setContactPhone] = useState('+1 (555) 234-8901');
  const [specialNotes, setSpecialNotes] = useState('');

  // Partner Acceptance form state
  const [partnerResponseNote, setPartnerResponseNote] = useState('');
  const [assignedDriverName, setAssignedDriverName] = useState('Marcus Vance');
  const [assignedVehiclePlate, setAssignedVehiclePlate] = useState('WA-792-ECO');

  // Synchronize location and qty when inventory item changes
  const handleInventorySelect = (id: string) => {
    setSelectedInventoryId(id);
    const item = inventory.find(i => i.id === id);
    if (item) {
      setRequestQty(item.quantity);
      setCollectionLocation(item.location);
      if (item.preferredCollectionDate) {
        setPreferredDate(item.preferredCollectionDate);
      }
      // Re-evaluate best partner match
      const matches = matchPartnersForItem({
        category: item.category,
        deviceType: item.deviceType,
        quantity: item.quantity,
        location: item.location
      });
      if (matches[0]) {
        setSelectedPartnerId(matches[0].partner.id);
      }
    }
  };

  const filteredRequests = requests.filter((req) => {
    const matchesSearch = 
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.itemTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.collectionLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.assignedPartnerName && req.assignedPartnerName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: RecoveryRequestStatus) => {
    switch (status) {
      case 'Request Submitted':
      case 'Submitted':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Request Submitted
          </span>
        );
      case 'Partner Response Pending':
      case 'Awaiting Partner':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            Partner Response Pending
          </span>
        );
      case 'Partner Accepted':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200 font-bold">
            Partner Accepted
          </span>
        );
      case 'Pickup Scheduled':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#DCE5D5] text-[#234D35] border border-[#234D35]/30 font-bold">
            Pickup Scheduled
          </span>
        );
      case 'Collection Completed':
      case 'Collected':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#234D35] text-white">
            Collection Completed
          </span>
        );
      case 'Processing Pending':
      case 'Processing Confirmed':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#626B45] text-white">
            Processing Pending
          </span>
        );
      case 'Final Documentation Available':
      case 'Completed':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-800 text-white font-bold inline-flex items-center gap-1">
            <Check className="w-3 h-3" />
            <span>Documentation Ready</span>
          </span>
        );
      case 'Draft':
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#E6E2D8] text-[#777A72]">
            Draft
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#E6E2D8] text-[#252A25]">
            {status}
          </span>
        );
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item = inventory.find(i => i.id === selectedInventoryId);
    if (!item) return;

    const partner = SAMPLE_PARTNERS.find(p => p.id === selectedPartnerId) || SAMPLE_PARTNERS[0];
    const newReqId = `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString().split('T')[0];

    const newRequest: RecoveryRequest = {
      id: newReqId,
      inventoryItemId: item.id,
      itemTitle: item.deviceType,
      category: item.category,
      quantity: Number(requestQty),
      estimatedWeightKg: item.estimatedWeightKg,
      collectionLocation: collectionLocation || item.location,
      preferredDate: preferredDate || item.preferredCollectionDate || '2026-10-25',
      proposedTimeWindow,
      specialNotes,
      status: 'Partner Response Pending',
      createdAt: now,
      assignedPartnerId: partner.id,
      assignedPartnerName: partner.name,
      pickupContact: {
        name: contactName,
        phone: contactPhone
      },
      statusHistory: [
        { 
          status: 'Request Submitted', 
          timestamp: `${now} 09:30`, 
          note: `Submitted intake request to ${partner.name} for ${requestQty} units` 
        },
        { 
          status: 'Partner Response Pending', 
          timestamp: `${now} 09:35`, 
          note: `Queued in partner dispatch console for capacity verification and date confirmation` 
        }
      ]
    };

    onCreateRequest(newRequest);
    setIsCreateModalOpen(false);
  };

  // 7-Stage Lifecycle Progression mapping
  const getNextStage = (current: RecoveryRequestStatus): RecoveryRequestStatus | null => {
    switch (current) {
      case 'Request Submitted':
      case 'Draft':
        return 'Partner Response Pending';
      case 'Partner Response Pending':
      case 'Awaiting Partner':
        return 'Partner Accepted';
      case 'Partner Accepted':
        return 'Pickup Scheduled';
      case 'Pickup Scheduled':
        return 'Collection Completed';
      case 'Collection Completed':
      case 'Collected':
        return 'Processing Pending';
      case 'Processing Pending':
      case 'Processing Confirmed':
        return 'Final Documentation Available';
      default:
        return null;
    }
  };

  // Partner Acceptance Action (Feature 3 simulated event)
  const handlePartnerAcceptanceConfirm = () => {
    if (!partnerAcceptanceModalReq) return;
    const req = partnerAcceptanceModalReq;
    const note = partnerResponseNote || `Partner verified capacity and approved proposed window for ${req.itemTitle}. Assigned driver ${assignedDriverName}.`;
    
    onUpdateRequestStatus(req.id, 'Partner Accepted', note);
    setPartnerAcceptanceModalReq(null);

    if (selectedRequestDetail && selectedRequestDetail.id === req.id) {
      setSelectedRequestDetail({
        ...selectedRequestDetail,
        status: 'Partner Accepted',
        assignedPartnerName: req.assignedPartnerName,
        driverDetails: {
          driverName: assignedDriverName,
          vehiclePlate: assignedVehiclePlate,
          dispatchId: `DSP-${Math.floor(1000 + Math.random() * 9000)}`
        },
        statusHistory: [
          ...selectedRequestDetail.statusHistory,
          { status: 'Partner Accepted', timestamp: 'Just now', note }
        ]
      });
    }
  };

  // User Pickup Schedule Confirmation
  const handleConfirmPickupBooking = (req: RecoveryRequest) => {
    const note = `Pickup confirmed with partner carrier. Vehicle ${req.driverDetails?.vehiclePlate || 'WA-792-ECO'} locked for ${req.preferredDate}.`;
    onUpdateRequestStatus(req.id, 'Pickup Scheduled', note);

    if (selectedRequestDetail && selectedRequestDetail.id === req.id) {
      setSelectedRequestDetail({
        ...selectedRequestDetail,
        status: 'Pickup Scheduled',
        statusHistory: [
          ...selectedRequestDetail.statusHistory,
          { status: 'Pickup Scheduled', timestamp: 'Just now', note }
        ]
      });
    }
  };

  // General Status Advance for Testing
  const handleAdvanceGeneralStatus = (req: RecoveryRequest) => {
    const next = getNextStage(req.status);
    if (!next) return;

    if (next === 'Partner Accepted') {
      // Open the simulated partner acceptance modal so user experiences the event!
      setPartnerAcceptanceModalReq(req);
      return;
    }

    let note = `Status advanced to ${next} in verified logistics sequence`;
    if (next === 'Collection Completed') {
      note = `Custody transferred at dock. Signed electronic bill of lading eBOL-2026-${Math.floor(1000 + Math.random() * 9000)}.`;
    } else if (next === 'Final Documentation Available') {
      note = `Refining & recycling certificate finalized with mass-balance destruction audit.`;
    }

    onUpdateRequestStatus(req.id, next, note);

    if (selectedRequestDetail && selectedRequestDetail.id === req.id) {
      setSelectedRequestDetail({
        ...selectedRequestDetail,
        status: next,
        statusHistory: [
          ...selectedRequestDetail.statusHistory,
          { status: next, timestamp: 'Just now', note }
        ]
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E2D8]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif-heading text-2xl sm:text-3xl text-[#252A25]">
              Recovery Requests & Dispatch
            </h1>
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-[#F7F4EC] border border-[#E6E2D8] text-[#234D35]">
              {filteredRequests.length} Active Records
            </span>
          </div>
          <p className="text-xs text-[#777A72] mt-1">
            Dispatch inventory lots to authorized recyclers, record partner acceptance, and track the complete 7-stage chain of custody
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenMatchmaker && (
            <button
              onClick={() => onOpenMatchmaker()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-[#234D35] bg-[#DCE5D5]/60 hover:bg-[#DCE5D5] rounded-full border border-[#234D35]/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Match Partners</span>
            </button>
          )}

          <button
            onClick={() => {
              const firstItem = inventory[0];
              if (firstItem) {
                setSelectedInventoryId(firstItem.id);
                setRequestQty(firstItem.quantity);
                setCollectionLocation(firstItem.location);
              }
              setIsCreateModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-[#FFFEFA] bg-[#234D35] hover:bg-[#1a3a28] rounded-full transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Recovery Request</span>
          </button>
        </div>
      </div>

      {/* Demo Disclosure Banner */}
      <div className="p-3.5 rounded-2xl bg-[#F7F4EC] border border-[#E6E2D8] flex items-center gap-2.5 text-xs text-[#777A72]">
        <Info className="w-4 h-4 text-[#626B45] shrink-0" />
        <span>
          Full 7-Stage Tracking Lifecycle enabled: Request Submitted → Partner Response Pending → Partner Accepted → Pickup Scheduled → Collection Completed → Processing Pending → Final Documentation Available.
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="w-full md:w-72 relative">
          <Search className="w-4 h-4 text-[#777A72] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search request ID, item, or partner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl pl-9 pr-3.5 py-2 text-[#252A25] focus:border-[#234D35] focus:ring-1 focus:ring-[#234D35]"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto overflow-x-auto text-xs">
          {[
            'All',
            'Partner Response Pending',
            'Partner Accepted',
            'Pickup Scheduled',
            'Collection Completed',
            'Final Documentation Available'
          ].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#234D35] text-white shadow-sm'
                  : 'bg-[#F7F4EC] text-[#252A25] hover:bg-[#E6E2D8]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Table */}
      {filteredRequests.length === 0 ? (
        <div className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-3xl p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#F7F4EC] text-[#626B45] flex items-center justify-center mx-auto">
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="font-serif-heading text-xl text-[#252A25]">
            No Matching Recovery Requests Found
          </h3>
          <p className="text-xs text-[#777A72] max-w-sm mx-auto">
            Create a recovery request from your registered inventory to match with verified downstream recyclers.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-5 py-2.5 text-xs font-semibold text-[#FFFEFA] bg-[#234D35] hover:bg-[#1a3a28] rounded-full transition-colors cursor-pointer"
            >
              Create New Request
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F7F4EC] border-b border-[#E6E2D8] text-[#626B45] font-semibold">
                  <th className="py-3.5 px-4 font-semibold">Request ID</th>
                  <th className="py-3.5 px-4 font-semibold">Item & Category</th>
                  <th className="py-3.5 px-4 font-semibold">Quantity / Weight</th>
                  <th className="py-3.5 px-4 font-semibold">Location</th>
                  <th className="py-3.5 px-4 font-semibold">Assigned Partner</th>
                  <th className="py-3.5 px-4 font-semibold">Lifecycle Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E2D8]">
                {filteredRequests.map((req) => {
                  const nextStage = getNextStage(req.status);
                  return (
                    <tr key={req.id} className="hover:bg-[#F7F4EC]/60 transition-colors">
                      
                      {/* ID & Date */}
                      <td className="py-4 px-4 font-mono">
                        <button
                          onClick={() => setSelectedRequestDetail(req)}
                          className="font-bold text-[#234D35] hover:underline cursor-pointer"
                        >
                          {req.id}
                        </button>
                        <span className="text-[10px] text-[#777A72] block">
                          {req.createdAt}
                        </span>
                      </td>

                      {/* Item Details */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-[#252A25]">{req.itemTitle}</div>
                        <span className="text-[11px] text-[#777A72]">{req.category}</span>
                      </td>

                      {/* Quantity */}
                      <td className="py-4 px-4">
                        <span className="font-semibold font-mono text-[#252A25]">
                          {req.quantity} units
                        </span>
                        {req.estimatedWeightKg && (
                          <span className="text-[11px] text-[#777A72] block font-mono">
                            ~{req.estimatedWeightKg} kg
                          </span>
                        )}
                      </td>

                      {/* Location */}
                      <td className="py-4 px-4 text-[#777A72]">
                        <span className="truncate block max-w-[140px]" title={req.collectionLocation}>
                          {req.collectionLocation}
                        </span>
                      </td>

                      {/* Assigned Partner */}
                      <td className="py-4 px-4">
                        <div className="font-medium text-[#252A25]">
                          {req.assignedPartnerName || 'Awaiting Matching'}
                        </div>
                        {req.preferredDate && (
                          <span className="text-[10px] text-[#626B45] flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{req.preferredDate}</span>
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {getStatusBadge(req.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          
                          {/* If Partner Response Pending, offer simulated Partner Acceptance action */}
                          {(req.status === 'Partner Response Pending' || req.status === 'Awaiting Partner' || req.status === 'Submitted') && (
                            <button
                              onClick={() => setPartnerAcceptanceModalReq(req)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-purple-800 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                              title="Simulate partner reviewing and accepting the request"
                            >
                              <UserCheck className="w-3 h-3" />
                              <span>Partner Review</span>
                            </button>
                          )}

                          {/* If Partner Accepted, offer user confirm booking */}
                          {req.status === 'Partner Accepted' && (
                            <button
                              onClick={() => handleConfirmPickupBooking(req)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-[#234D35] bg-[#DCE5D5] hover:bg-[#d0ddc7] rounded-lg transition-colors cursor-pointer"
                              title="Confirm booking and lock pickup schedule"
                            >
                              <span>Confirm Pickup</span>
                            </button>
                          )}

                          {/* If Final Documentation Available, offer view certificate */}
                          {(req.status === 'Final Documentation Available' || req.status === 'Completed') && (
                            <button
                              onClick={() => setViewingCertDocReq(req)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                              title="View Certificate of Recycling & Destruction"
                            >
                              <FileText className="w-3 h-3" />
                              <span>View Cert</span>
                            </button>
                          )}

                          {/* Advance demo status */}
                          {nextStage && (
                            <button
                              onClick={() => handleAdvanceGeneralStatus(req)}
                              className="px-2 py-1 text-[10px] text-[#777A72] hover:text-[#252A25] bg-[#F7F4EC] hover:bg-[#E6E2D8] rounded border border-[#E6E2D8]"
                              title={`Advance demo step to: ${nextStage}`}
                            >
                              Next →
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedRequestDetail(req)}
                            className="p-1.5 text-[#777A72] hover:text-[#252A25] hover:bg-[#F7F4EC] rounded-lg transition-colors cursor-pointer"
                            title="View Full Request Timeline"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE NEW RECOVERY REQUEST MODAL (With Integrated Partner Selection) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-auto space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E2D8]">
              <div>
                <h3 className="font-serif-heading text-xl sm:text-2xl text-[#252A25]">
                  Initiate Pickup & Intake Request
                </h3>
                <p className="text-xs text-[#777A72]">
                  Select an inventory lot, choose an authorized partner, and propose collection schedule
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-[#777A72] hover:text-[#252A25] rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              
              {/* Select Inventory Lot */}
              <div>
                <label className="block text-xs font-semibold text-[#252A25] mb-1">
                  1. Select Registered Inventory Lot *
                </label>
                <select
                  value={selectedInventoryId}
                  onChange={(e) => handleInventorySelect(e.target.value)}
                  className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#252A25] font-medium"
                >
                  {inventory.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.deviceType} ({item.quantity} units · {item.condition} · {item.location})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Target Partner */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#252A25]">
                    2. Select Recovery Partner *
                  </label>
                  <span className="text-[11px] text-[#626B45]">
                    Filtered by material stream
                  </span>
                </div>
                <select
                  value={selectedPartnerId}
                  onChange={(e) => setSelectedPartnerId(e.target.value)}
                  className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#252A25] font-medium"
                >
                  {SAMPLE_PARTNERS.map((partner) => (
                    <option key={partner.id} value={partner.id}>
                      {partner.name} ({partner.serviceArea} · Min: {partner.minimumLot})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity & Proposed Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#252A25] mb-1">
                    Lot Quantity to Dispatch *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={requestQty}
                    onChange={(e) => setRequestQty(Number(e.target.value))}
                    className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#252A25]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#252A25] mb-1">
                    Proposed Collection Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#252A25]"
                  />
                </div>
              </div>

              {/* Time Window & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#252A25] mb-1">
                    Proposed Time Window
                  </label>
                  <select
                    value={proposedTimeWindow}
                    onChange={(e) => setProposedTimeWindow(e.target.value)}
                    className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#252A25]"
                  >
                    <option value="09:00 - 12:00 Local">Morning (09:00 - 12:00)</option>
                    <option value="12:00 - 15:00 Local">Midday (12:00 - 15:00)</option>
                    <option value="15:00 - 18:00 Local">Afternoon (15:00 - 18:00)</option>
                    <option value="Flexible All Day">Flexible All Day Window</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#252A25] mb-1">
                    Site Contact Name
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#252A25]"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-semibold text-[#252A25] mb-1">
                  Loading Dock & Facility Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Loading Dock 4, Building B Tech Storage"
                  value={collectionLocation}
                  onChange={(e) => setCollectionLocation(e.target.value)}
                  className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#252A25]"
                />
              </div>

              {/* Special Handling Notes */}
              <div>
                <label className="block text-xs font-semibold text-[#252A25] mb-1">
                  Handling, Packaging & Security Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Pallet wrapped; hard drives removed; elevator access."
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#252A25]"
                />
              </div>

              <div className="pt-3 border-t border-[#E6E2D8] flex items-center justify-between">
                <span className="text-[10px] text-[#777A72]">
                  Status initializes as <strong>Partner Response Pending</strong>.
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-[#777A72]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-semibold text-[#FFFEFA] bg-[#234D35] hover:bg-[#1a3a28] rounded-full shadow-sm cursor-pointer"
                  >
                    Transmit Request to Partner
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* SIMULATED PARTNER ACCEPTANCE MODAL (Feature 3 Confirmation Event) */}
      {partnerAcceptanceModalReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-auto space-y-5">
            
            <div className="flex items-start justify-between pb-3 border-b border-[#E6E2D8]">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold mb-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Partner Dispatch Portal Simulation</span>
                </div>
                <h3 className="font-serif-heading text-xl text-[#252A25]">
                  Review & Accept Recovery Intake
                </h3>
                <p className="text-xs text-[#777A72]">
                  Simulate {partnerAcceptanceModalReq.assignedPartnerName} reviewing the request
                </p>
              </div>
              <button
                onClick={() => setPartnerAcceptanceModalReq(null)}
                className="p-1.5 text-[#777A72] hover:text-[#252A25] rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Request Summary */}
            <div className="bg-[#F7F4EC] p-4 rounded-2xl border border-[#E6E2D8] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#777A72]">Lot:</span>
                <strong className="text-[#252A25]">{partnerAcceptanceModalReq.itemTitle}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777A72]">Quantity:</span>
                <span className="font-mono font-bold text-[#252A25]">{partnerAcceptanceModalReq.quantity} units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777A72]">Proposed Window:</span>
                <span className="text-[#252A25] font-medium">
                  {partnerAcceptanceModalReq.preferredDate} ({partnerAcceptanceModalReq.proposedTimeWindow || 'Morning'})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777A72]">Pickup Dock:</span>
                <span className="text-[#252A25]">{partnerAcceptanceModalReq.collectionLocation}</span>
              </div>
            </div>

            {/* Carrier Driver Assignment Fields */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-[#252A25]">
                Carrier Vehicle & Driver Details:
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-[#777A72] mb-1">Driver Name</label>
                  <input
                    type="text"
                    value={assignedDriverName}
                    onChange={(e) => setAssignedDriverName(e.target.value)}
                    className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3 py-2 text-[#252A25]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#777A72] mb-1">Vehicle Plate</label>
                  <input
                    type="text"
                    value={assignedVehiclePlate}
                    onChange={(e) => setAssignedVehiclePlate(e.target.value)}
                    className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3 py-2 text-[#252A25]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-[#777A72] mb-1">
                  Partner Intake Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Capacity confirmed; lift-gate truck dispatched."
                  value={partnerResponseNote}
                  onChange={(e) => setPartnerResponseNote(e.target.value)}
                  className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3 py-2 text-[#252A25]"
                />
              </div>
            </div>

            {/* Acceptance Actions */}
            <div className="pt-3 border-t border-[#E6E2D8] flex items-center justify-between">
              <button
                onClick={() => setPartnerAcceptanceModalReq(null)}
                className="px-4 py-2 text-xs font-medium text-[#777A72]"
              >
                Cancel
              </button>
              <button
                onClick={handlePartnerAcceptanceConfirm}
                className="px-5 py-2.5 text-xs font-semibold text-[#FFFEFA] bg-purple-700 hover:bg-purple-800 rounded-full shadow-sm cursor-pointer"
              >
                Record Partner Acceptance
              </button>
            </div>

          </div>
        </div>
      )}

      {/* REQUEST DETAIL & 7-STAGE TIMELINE DRAWER */}
      {selectedRequestDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-auto space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E2D8]">
              <div>
                <span className="font-mono text-xs text-[#626B45]">
                  {selectedRequestDetail.id}
                </span>
                <h3 className="font-serif-heading text-xl text-[#252A25]">
                  {selectedRequestDetail.itemTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRequestDetail(null)}
                className="p-1.5 text-[#777A72] hover:text-[#252A25] rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status & Handler Summary */}
            <div className="p-4 rounded-2xl bg-[#F7F4EC] border border-[#E6E2D8] flex items-center justify-between">
              <div>
                <div className="text-[11px] text-[#777A72]">Current Workflow Status</div>
                <div className="mt-1">{getStatusBadge(selectedRequestDetail.status)}</div>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-[#777A72]">Assigned Handler</div>
                <div className="text-xs font-semibold text-[#252A25] mt-1">
                  {selectedRequestDetail.assignedPartnerName || 'Awaiting Partner Matching'}
                </div>
              </div>
            </div>

            {/* Scope info */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-[#FFFEFA] p-3 rounded-xl border border-[#E6E2D8]">
              <div>
                <span className="text-[#777A72]">Lot Quantity:</span>{' '}
                <strong className="text-[#252A25] font-mono">{selectedRequestDetail.quantity} units</strong>
              </div>
              <div>
                <span className="text-[#777A72]">Estimated Weight:</span>{' '}
                <strong className="text-[#252A25] font-mono">{selectedRequestDetail.estimatedWeightKg || 'N/A'} kg</strong>
              </div>
              <div className="col-span-2">
                <span className="text-[#777A72]">Collection Location:</span>{' '}
                <strong className="text-[#252A25]">{selectedRequestDetail.collectionLocation}</strong>
              </div>
              {selectedRequestDetail.driverDetails && (
                <div className="col-span-2 pt-1 border-t border-[#E6E2D8]/60 text-[11px] text-[#234D35]">
                  <span>Carrier Vehicle: <strong>{selectedRequestDetail.driverDetails.vehiclePlate}</strong> · Driver: <strong>{selectedRequestDetail.driverDetails.driverName}</strong></span>
                </div>
              )}
            </div>

            {/* Progression Timeline */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#626B45] mb-3 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#234D35]" />
                <span>Lifecycle Status History (7-Stage Workflow)</span>
              </div>

              <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E6E2D8] pl-2 max-h-48 overflow-y-auto">
                {selectedRequestDetail.statusHistory.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-3 pl-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#234D35] mt-1 shrink-0 -ml-[7px]" />
                    <div className="text-xs space-y-0.5">
                      <div className="font-semibold text-[#252A25] flex items-center gap-2">
                        <span>{step.status}</span>
                        <span className="text-[10px] text-[#777A72] font-mono">{step.timestamp}</span>
                      </div>
                      <p className="text-[#777A72] text-[11px]">{step.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer with Advance Demo Workflow action */}
            <div className="pt-3 border-t border-[#E6E2D8] flex items-center justify-between">
              {getNextStage(selectedRequestDetail.status) ? (
                <button
                  onClick={() => handleAdvanceGeneralStatus(selectedRequestDetail)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#FFFEFA] bg-[#234D35] hover:bg-[#1a3a28] rounded-full shadow-sm cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Advance Status to: {getNextStage(selectedRequestDetail.status)}</span>
                </button>
              ) : (
                <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Request completed & documentation archived</span>
                </span>
              )}

              <button
                onClick={() => setSelectedRequestDetail(null)}
                className="px-4 py-2 text-xs font-medium text-[#777A72]"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* FINAL DOCUMENTATION / CERTIFICATE MODAL */}
      {viewingCertDocReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-[#FFFEFA] border-2 border-[#234D35]/30 rounded-3xl max-w-lg w-full p-8 shadow-2xl relative my-auto space-y-6">
            
            <div className="flex items-start justify-between pb-4 border-b border-[#E6E2D8]">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#626B45]">
                  RESTOCK AI · CIRCULAR AUDIT MANIFEST
                </div>
                <h3 className="font-serif-heading text-2xl text-[#252A25] mt-1">
                  Certificate of Safe Recycling & Recovery
                </h3>
              </div>
              <button
                onClick={() => setViewingCertDocReq(null)}
                className="p-1.5 text-[#777A72] hover:text-[#252A25] rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#F7F4EC] p-5 rounded-2xl border border-[#E6E2D8] space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-[#777A72]">Certificate ID:</span>
                <span className="font-mono font-bold text-[#234D35]">CERT-CIRCULAR-{viewingCertDocReq.id.slice(-4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777A72]">Dispatched Lot:</span>
                <span className="font-bold text-[#252A25]">{viewingCertDocReq.itemTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777A72]">Net Verified Quantity:</span>
                <span className="font-mono text-[#252A25]">{viewingCertDocReq.quantity} units (~{viewingCertDocReq.estimatedWeightKg || 45} kg)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777A72]">Authorized Processor:</span>
                <span className="font-bold text-[#252A25]">{viewingCertDocReq.assignedPartnerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777A72]">Custody Transfer Code:</span>
                <span className="font-mono text-[#252A25]">eBOL-2026-9881</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50 text-[11px] text-emerald-900 space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Zero-Landfill Circular Handoff Verified</span>
              </div>
              <p className="text-emerald-800/80 leading-relaxed">
                Material successfully processed in compliance with state environmental resource guidelines. All serialized memory media wiped or destroyed.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => setViewingCertDocReq(null)}
                className="px-4 py-2 text-xs font-medium text-[#777A72]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Downloading simulated verification audit for ${viewingCertDocReq.id}`);
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-[#FFFEFA] bg-[#234D35] hover:bg-[#1a3a28] rounded-full shadow-sm cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF Audit Copy</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
