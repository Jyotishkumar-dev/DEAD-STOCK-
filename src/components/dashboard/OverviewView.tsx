import React from 'react';
import { ResourceInventoryItem, RecoveryRequest, User } from '../../types';
import { 
  Package, 
  Clock, 
  Truck, 
  CheckCircle2, 
  Plus, 
  ArrowRight, 
  Sparkles, 
  AlertCircle,
  Building2,
  Layers,
  Search,
  ExternalLink
} from 'lucide-react';

interface OverviewViewProps {
  user: User;
  inventory: ResourceInventoryItem[];
  requests: RecoveryRequest[];
  onNavigateTab: (tab: string) => void;
  onOpenNewRequest: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  user,
  inventory,
  requests,
  onNavigateTab,
  onOpenNewRequest
}) => {
  // Compute metric calculations
  const totalRegisteredItems = inventory.reduce((acc, curr) => acc + (curr.quantity || 0), 0);
  
  const pendingRequests = requests.filter(r => 
    r.status === 'Draft' || 
    r.status === 'Submitted' || 
    r.status === 'Request Submitted' || 
    r.status === 'Partner Response Pending' || 
    r.status === 'Awaiting Partner' || 
    r.status === 'Partner Accepted'
  ).length;

  const scheduledPickups = requests.filter(r => r.status === 'Pickup Scheduled').length;

  const completedCollections = requests.filter(r => 
    r.status === 'Collected' || 
    r.status === 'Collection Completed' || 
    r.status === 'Processing Confirmed' || 
    r.status === 'Processing Pending' || 
    r.status === 'Final Documentation Available' || 
    r.status === 'Completed'
  ).length;

  // Recent requests preview
  const recentRequests = requests.slice(0, 4);
  const recentInventory = inventory.slice(0, 4);

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#626B45] mb-2">
            <span className="w-2 h-2 rounded-full bg-[#234D35]" />
            <span>ORGANIZATION DASHBOARD · {user.organization}</span>
          </div>

          <h1 className="font-serif-heading text-2xl sm:text-3xl text-[#252A25]">
            Welcome back, {user.name}
          </h1>

          <p className="text-xs sm:text-sm text-[#777A72] mt-1 max-w-xl">
            Monitor surplus electronic inventory, coordinate with licensed recovery handlers, and follow material diversion records.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigateTab('ai-analysis')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-[#234D35] bg-[#DCE5D5]/60 hover:bg-[#DCE5D5] rounded-full border border-[#234D35]/20 transition-all cursor-pointer shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-[#234D35]" />
            <span>AI Item Analysis</span>
          </button>

          <button
            onClick={() => onNavigateTab('add-ewaste')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-[#FFFEFA] bg-[#234D35] hover:bg-[#1a3a28] rounded-full transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add E-Waste Item</span>
          </button>

          <button
            onClick={onOpenNewRequest}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-[#252A25] bg-[#F7F4EC] hover:bg-[#E6E2D8] rounded-full border border-[#E6E2D8] transition-colors cursor-pointer"
          >
            <span>Create Recovery Request</span>
          </button>
        </div>
      </div>

      {/* Demo Data Disclaimer Badge */}
      <div className="p-3.5 rounded-2xl bg-[#F7F4EC] border border-[#E6E2D8] flex items-center justify-between gap-3 text-xs text-[#626B45]">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#234D35] shrink-0" />
          <span>Demonstration Environment · Showing local demo data for interactive evaluation.</span>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#FFFEFA] border border-[#E6E2D8] text-[#777A72]">
          Session Storage
        </span>
      </div>

      {/* 4 Primary KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1: Total Registered Items */}
        <div className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#626B45]">
                Registered Items
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#DCE5D5]/60 text-[#234D35] flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold font-mono text-[#252A25] tabular-nums">
              {totalRegisteredItems}
            </div>
            <div className="text-[11px] text-[#777A72] mt-1">
              Across {inventory.length} cataloged inventory lots
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('inventory')}
            className="pt-4 mt-4 border-t border-[#E6E2D8] text-xs font-semibold text-[#234D35] hover:underline flex items-center justify-between cursor-pointer"
          >
            <span>View All Inventory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* KPI 2: Pending Recovery Requests */}
        <div className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#626B45]">
                Pending Requests
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold font-mono text-[#252A25] tabular-nums">
              {pendingRequests}
            </div>
            <div className="text-[11px] text-[#777A72] mt-1">
              Awaiting partner quotes or review
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('requests')}
            className="pt-4 mt-4 border-t border-[#E6E2D8] text-xs font-semibold text-[#234D35] hover:underline flex items-center justify-between cursor-pointer"
          >
            <span>Review Pending Requests</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* KPI 3: Scheduled Pickups */}
        <div className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#626B45]">
                Scheduled Pickups
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#234D35] text-white flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold font-mono text-[#252A25] tabular-nums">
              {scheduledPickups}
            </div>
            <div className="text-[11px] text-[#777A72] mt-1">
              Collection confirmed by authorized partner
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('pickup-tracking')}
            className="pt-4 mt-4 border-t border-[#E6E2D8] text-xs font-semibold text-[#234D35] hover:underline flex items-center justify-between cursor-pointer"
          >
            <span>Track Pickup Schedule</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* KPI 4: Completed Collections */}
        <div className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#626B45]">
                Completed Collections
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#DCE5D5] text-[#234D35] flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold font-mono text-[#252A25] tabular-nums">
              {completedCollections}
            </div>
            <div className="text-[11px] text-[#777A72] mt-1">
              Verified processing & manifests received
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('reports')}
            className="pt-4 mt-4 border-t border-[#E6E2D8] text-xs font-semibold text-[#234D35] hover:underline flex items-center justify-between cursor-pointer"
          >
            <span>View Diversion Reports</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Two Column Grid: Recent Requests & Available Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Active Recovery Requests */}
        <div className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-heading text-lg text-[#252A25]">
              Active Recovery Requests
            </h3>
            <button
              onClick={() => onNavigateTab('requests')}
              className="text-xs font-semibold text-[#234D35] hover:underline cursor-pointer"
            >
              See all ({requests.length})
            </button>
          </div>

          <div className="space-y-3">
            {recentRequests.map((req) => (
              <div
                key={req.id}
                className="p-3.5 rounded-2xl bg-[#F7F4EC] border border-[#E6E2D8] flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#234D35]">
                      {req.id}
                    </span>
                    <span className="text-xs font-semibold text-[#252A25]">
                      {req.itemTitle}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#777A72] mt-0.5">
                    Qty: {req.quantity} · {req.collectionLocation}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white text-[#234D35] border border-[#E6E2D8]">
                    {req.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Unallocated Available Inventory */}
        <div className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-heading text-lg text-[#252A25]">
              Ready for Recovery Dispatch
            </h3>
            <button
              onClick={() => onNavigateTab('inventory')}
              className="text-xs font-semibold text-[#234D35] hover:underline cursor-pointer"
            >
              See all ({inventory.length})
            </button>
          </div>

          <div className="space-y-3">
            {recentInventory.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-[#F7F4EC] border border-[#E6E2D8] flex items-center justify-between gap-3"
              >
                <div>
                  <div className="text-xs font-semibold text-[#252A25]">
                    {item.deviceType}
                  </div>
                  <div className="text-[11px] text-[#777A72] mt-0.5">
                    {item.category} · Condition: {item.condition}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono font-bold text-[#234D35]">
                    {item.quantity} units
                  </span>
                  {item.status === 'Available' && (
                    <button
                      onClick={onOpenNewRequest}
                      className="px-2 py-1 text-[11px] font-semibold bg-[#234D35] text-white rounded-lg hover:bg-[#1a3a28] cursor-pointer"
                    >
                      Dispatch
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
