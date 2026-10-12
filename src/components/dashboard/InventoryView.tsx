import React, { useState } from 'react';
import { ResourceInventoryItem } from '../../types';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  Send, 
  Package, 
  Layers, 
  AlertTriangle,
  X,
  Check,
  LayoutGrid,
  List,
  Sparkles,
  Info
} from 'lucide-react';

interface InventoryViewProps {
  inventory: ResourceInventoryItem[];
  onUpdateItem: (item: ResourceInventoryItem) => void;
  onDeleteItem: (id: string) => void;
  onNavigateToAdd: () => void;
  onCreateRequestForItem: (item: ResourceInventoryItem) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  inventory,
  onUpdateItem,
  onDeleteItem,
  onNavigateToAdd,
  onCreateRequestForItem
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [conditionFilter, setConditionFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Edit item state
  const [editingItem, setEditingItem] = useState<ResourceInventoryItem | null>(null);
  
  // Delete confirmation state
  const [itemToDelete, setItemToDelete] = useState<ResourceInventoryItem | null>(null);

  // View AI details state
  const [viewingDetailsItem, setViewingDetailsItem] = useState<ResourceInventoryItem | null>(null);

  // Filtered items
  const filteredItems = inventory.filter((item) => {
    const matchesSearch = 
      item.deviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesCondition = conditionFilter === 'All' || item.condition === conditionFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

    return matchesSearch && matchesCategory && matchesCondition && matchesStatus;
  });

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    onUpdateItem(editingItem);
    setEditingItem(null);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      onDeleteItem(itemToDelete.id);
      setItemToDelete(null);
    }
  };

  const getStatusBadge = (status: ResourceInventoryItem['status']) => {
    switch (status) {
      case 'Available':
        return <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#DCE5D5] text-[#234D35]">Available</span>;
      case 'Request Created':
        return <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#E6E2D8] text-[#252A25]">Request Created</span>;
      case 'Scheduled':
        return <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#234D35] text-white">Pickup Scheduled</span>;
      case 'Recovered':
        return <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#626B45] text-white">Recovered</span>;
      default:
        return <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#E6E2D8] text-[#252A25]">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E2D8]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif-heading text-2xl sm:text-3xl text-[#252A25]">
              Resource Inventory
            </h1>
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-[#F7F4EC] border border-[#E6E2D8] text-[#234D35]">
              {filteredItems.length} of {inventory.length} lots
            </span>
          </div>
          <p className="text-xs text-[#777A72] mt-1">
            Manage your cataloged electronics, edit details, and dispatch recovery requests
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-[#FFFEFA] text-[#234D35] shadow-sm' : 'text-[#777A72] hover:text-[#252A25]'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'cards' ? 'bg-[#FFFEFA] text-[#234D35] shadow-sm' : 'text-[#777A72] hover:text-[#252A25]'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onNavigateToAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-[#FFFEFA] bg-[#234D35] hover:bg-[#1a3a28] rounded-full transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add E-Waste Item</span>
          </button>
        </div>
      </div>

      {/* Persistence Note */}
      <div className="p-3 rounded-2xl bg-[#F7F4EC] border border-[#E6E2D8] flex items-center justify-between text-xs text-[#626B45]">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#234D35] shrink-0" />
          <span>Demo Data Storage: All changes are persisted locally in your browser storage for this demonstration.</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-2xl p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Search */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-[#777A72] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by device model, category, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl pl-9 pr-3.5 py-2 text-[#252A25] focus:border-[#234D35] focus:ring-1 focus:ring-[#234D35]"
            />
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3 py-2 text-[#252A25] focus:border-[#234D35] focus:ring-1 focus:ring-[#234D35]"
            >
              <option value="All">All Categories</option>
              <option value="Computers and office electronics">Computers & Office</option>
              <option value="Laptops and Desktop Equipment">Laptops & Desktops</option>
              <option value="Cables and accessories">Cables & Accessories</option>
              <option value="Cables and Electronic Accessories">Cables & Accessories (alt)</option>
              <option value="Mobile devices">Mobile Devices</option>
              <option value="Circuit boards">Circuit Boards</option>
              <option value="Circuit Boards and Electronic Parts">Circuit Boards (alt)</option>
              <option value="Printers">Printers</option>
              <option value="Printers and Office Electronics">Printers & Office (alt)</option>
              <option value="Other eligible electronic waste">Other E-Waste</option>
            </select>
          </div>

          {/* Condition Filter */}
          <div className="md:col-span-2">
            <select
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
              className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3 py-2 text-[#252A25] focus:border-[#234D35] focus:ring-1 focus:ring-[#234D35]"
            >
              <option value="All">All Conditions</option>
              <option value="Functional">Functional</option>
              <option value="Minor Wear">Minor Wear</option>
              <option value="Defective">Defective</option>
              <option value="Parts Only">Parts Only</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3 py-2 text-[#252A25] focus:border-[#234D35] focus:ring-1 focus:ring-[#234D35]"
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Request Created">Request Created</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Recovered">Recovered</option>
            </select>
          </div>

        </div>
      </div>

      {/* Main Content: Table or Cards */}
      {filteredItems.length === 0 ? (
        /* Empty State */
        <div className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-3xl p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#F7F4EC] text-[#626B45] flex items-center justify-center mx-auto">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="font-serif-heading text-xl text-[#252A25]">
            No Inventory Lots Found
          </h3>
          <p className="text-xs text-[#777A72] max-w-sm mx-auto">
            No items matched your current filter criteria or search query. Adjust your filters or register a new e-waste item.
          </p>
          <div className="pt-2">
            <button
              onClick={onNavigateToAdd}
              className="px-5 py-2.5 text-xs font-semibold text-[#FFFEFA] bg-[#234D35] hover:bg-[#1a3a28] rounded-full transition-colors cursor-pointer"
            >
              Add New Item
            </button>
          </div>
        </div>
      ) : viewMode === 'table' ? (
        /* Table View */
        <div className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F7F4EC] border-b border-[#E6E2D8] text-[#626B45] font-semibold">
                  <th className="py-3.5 px-4 font-semibold">Item & Model</th>
                  <th className="py-3.5 px-4 font-semibold">Category</th>
                  <th className="py-3.5 px-4 font-semibold">Quantity / Weight</th>
                  <th className="py-3.5 px-4 font-semibold">Condition</th>
                  <th className="py-3.5 px-4 font-semibold">Location</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E2D8]">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F7F4EC]/60 transition-colors">
                    
                    {/* Item & Model */}
                    <td className="py-4 px-4">
                      <div className="font-semibold text-[#252A25]">{item.deviceType}</div>
                      {item.aiRecommendation && (
                        <div className="text-[11px] text-[#234D35] flex items-center gap-1 mt-0.5">
                          <Sparkles className="w-3 h-3 text-[#234D35]" />
                          <span>{item.aiRecommendation.pathway}</span>
                        </div>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 text-[#777A72]">
                      {item.category}
                    </td>

                    {/* Quantity / Weight */}
                    <td className="py-4 px-4">
                      <span className="font-semibold font-mono text-[#252A25]">
                        {item.quantity} units
                      </span>
                      {item.estimatedWeightKg && (
                        <span className="text-[11px] text-[#777A72] block font-mono">
                          ~{item.estimatedWeightKg} kg
                        </span>
                      )}
                    </td>

                    {/* Condition */}
                    <td className="py-4 px-4">
                      <span className="text-[11px] text-[#252A25] font-medium">
                        {item.condition}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-4 text-[#777A72]">
                      {item.location}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      {getStatusBadge(item.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Create Request Action */}
                        {item.status === 'Available' && (
                          <button
                            onClick={() => onCreateRequestForItem(item)}
                            className="px-2.5 py-1.5 text-[11px] font-semibold text-[#234D35] hover:bg-[#DCE5D5]/60 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                            title="Create Recovery Request"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Request</span>
                          </button>
                        )}

                        {/* View Details / AI Analysis */}
                        {(item.aiAnalysis || item.originalSubmission) && (
                          <button
                            onClick={() => setViewingDetailsItem(item)}
                            className="p-1.5 text-[#234D35] hover:bg-[#DCE5D5]/60 rounded-lg transition-colors cursor-pointer"
                            title="View AI Analysis & Original Submission"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Edit */}
                        <button
                          onClick={() => setEditingItem({ ...item })}
                          className="p-1.5 text-[#777A72] hover:text-[#252A25] hover:bg-[#F7F4EC] rounded-lg transition-colors cursor-pointer"
                          title="Edit Item"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => setItemToDelete(item)}
                          className="p-1.5 text-[#777A72] hover:text-red-700 hover:bg-[#F7F4EC] rounded-lg transition-colors cursor-pointer"
                          title="Delete Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#FFFEFA] border border-[#E6E2D8] hover:border-[#626B45]/40 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="font-semibold text-sm text-[#252A25]">
                    {item.deviceType}
                  </h4>
                  {getStatusBadge(item.status)}
                </div>

                <div className="text-xs text-[#777A72] mb-3">
                  {item.category}
                </div>

                <div className="bg-[#F7F4EC] rounded-xl p-3 border border-[#E6E2D8]/80 text-xs space-y-1 mb-4">
                  <div className="flex justify-between">
                    <span className="text-[#777A72]">Quantity:</span>
                    <span className="font-mono font-semibold text-[#252A25]">{item.quantity} units</span>
                  </div>
                  {item.estimatedWeightKg && (
                    <div className="flex justify-between">
                      <span className="text-[#777A72]">Weight:</span>
                      <span className="font-mono text-[#252A25]">~{item.estimatedWeightKg} kg</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[#777A72]">Condition:</span>
                    <span className="text-[#252A25]">{item.condition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#777A72]">Location:</span>
                    <span className="text-[#252A25]">{item.location}</span>
                  </div>
                </div>

                {item.aiRecommendation && (
                  <div className="text-[11px] text-[#234D35] bg-[#DCE5D5]/30 p-2.5 rounded-lg border border-[#234D35]/15 mb-4">
                    <div className="font-semibold">Pathway: {item.aiRecommendation.pathway}</div>
                    <div className="text-[10px] text-[#777A72] mt-0.5">{item.aiRecommendation.handlingSummary}</div>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-[#E6E2D8] flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingItem({ ...item })}
                    className="p-1.5 text-[#777A72] hover:text-[#252A25] rounded-lg transition-colors cursor-pointer"
                    title="Edit Item"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setItemToDelete(item)}
                    className="p-1.5 text-[#777A72] hover:text-red-700 rounded-lg transition-colors cursor-pointer"
                    title="Delete Item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {(item.aiAnalysis || item.originalSubmission) && (
                    <button
                      onClick={() => setViewingDetailsItem(item)}
                      className="p-1.5 text-[#234D35] hover:bg-[#DCE5D5]/60 rounded-lg transition-colors cursor-pointer"
                      title="View AI Analysis"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {item.status === 'Available' ? (
                  <button
                    onClick={() => onCreateRequestForItem(item)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#FFFEFA] bg-[#234D35] hover:bg-[#1a3a28] rounded-full transition-colors cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Create Request</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-[#777A72]">Request Active</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Record Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-3xl max-w-lg w-full p-6 shadow-2xl relative my-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E6E2D8]">
              <h3 className="font-serif-heading text-xl text-[#252A25]">
                Edit Inventory Lot
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1.5 text-[#777A72] hover:text-[#252A25] rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#252A25] mb-1">
                  Device or Material Name
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.deviceType}
                  onChange={(e) => setEditingItem({ ...editingItem, deviceType: e.target.value })}
                  className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3 py-2 text-[#252A25]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#252A25] mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={editingItem.quantity}
                    onChange={(e) => setEditingItem({ ...editingItem, quantity: Number(e.target.value) })}
                    className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3 py-2 text-[#252A25]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#252A25] mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editingItem.estimatedWeightKg || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, estimatedWeightKg: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3 py-2 text-[#252A25]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#252A25] mb-1">
                    Condition
                  </label>
                  <select
                    value={editingItem.condition}
                    onChange={(e) => setEditingItem({ ...editingItem, condition: e.target.value as ResourceInventoryItem['condition'] })}
                    className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3 py-2 text-[#252A25]"
                  >
                    <option value="Functional">Functional</option>
                    <option value="Minor Wear">Minor Wear</option>
                    <option value="Defective">Defective</option>
                    <option value="Parts Only">Parts Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#252A25] mb-1">
                    Status
                  </label>
                  <select
                    value={editingItem.status}
                    onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value as ResourceInventoryItem['status'] })}
                    className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3 py-2 text-[#252A25]"
                  >
                    <option value="Available">Available</option>
                    <option value="Request Created">Request Created</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Recovered">Recovered</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#252A25] mb-1">
                  Location
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.location}
                  onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                  className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3 py-2 text-[#252A25]"
                />
              </div>

              <div className="pt-3 border-t border-[#E6E2D8] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-xs font-medium text-[#777A72]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-[#FFFEFA] bg-[#234D35] hover:bg-[#1a3a28] rounded-full shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-serif-heading text-lg text-[#252A25]">
                Confirm Record Deletion
              </h3>
              <p className="text-xs text-[#777A72] mt-1 leading-relaxed">
                Are you sure you want to remove <strong>{itemToDelete.deviceType}</strong> (Qty: {itemToDelete.quantity}) from your inventory ledger? This action cannot be undone.
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 text-xs font-medium text-[#777A72] hover:text-[#252A25]"
              >
                Keep Record
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded-full shadow-sm"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Analysis & Original Submission Inspector Modal */}
      {viewingDetailsItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E2D8]">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#234D35] flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>AI Circular Audit Inspection</span>
                </div>
                <h3 className="font-serif-heading text-xl text-[#252A25]">
                  {viewingDetailsItem.deviceType}
                </h3>
              </div>
              <button
                onClick={() => setViewingDetailsItem(null)}
                className="p-1.5 text-[#777A72] hover:text-[#252A25] rounded-full hover:bg-[#F7F4EC]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Original User Submission Box */}
              <div className="bg-[#F7F4EC] rounded-2xl p-4 border border-[#E6E2D8] space-y-2 text-xs">
                <span className="font-bold text-[#626B45] uppercase tracking-wide text-[10px] block">
                  Original User Submission
                </span>
                <div>
                  <span className="text-[#777A72]">Raw Description:</span>
                  <p className="text-[#252A25] mt-0.5">
                    {viewingDetailsItem.originalSubmission?.rawDescription || viewingDetailsItem.description || 'No raw notes provided.'}
                  </p>
                </div>
                <div className="pt-2 border-t border-[#E6E2D8] text-[11px] text-[#777A72] space-y-1">
                  <div>Initial Qty: <strong>{viewingDetailsItem.originalSubmission?.userQuantity || viewingDetailsItem.quantity}</strong></div>
                  <div>Reported Condition: <strong>{viewingDetailsItem.originalSubmission?.userCondition || viewingDetailsItem.condition}</strong></div>
                </div>
              </div>

              {/* AI Analysis Estimates Box */}
              <div className="bg-[#DCE5D5]/30 rounded-2xl p-4 border border-[#234D35]/20 space-y-2 text-xs">
                <span className="font-bold text-[#234D35] uppercase tracking-wide text-[10px] block">
                  AI Estimates & Recommendations
                </span>
                <div>
                  <span className="text-[#626B45]">Primary Circular Pathway:</span>
                  <div className="font-bold text-[#234D35] text-sm mt-0.5">
                    {viewingDetailsItem.aiAnalysis?.primaryPathway || viewingDetailsItem.aiRecommendation?.pathway}
                  </div>
                </div>
                <p className="text-[#252A25] text-[11px] leading-relaxed">
                  {viewingDetailsItem.aiAnalysis?.pathwayExplanation || viewingDetailsItem.aiRecommendation?.handlingSummary}
                </p>
                {viewingDetailsItem.aiAnalysis?.confidenceIndicator && (
                  <div className="pt-2 border-t border-[#234D35]/15 text-[10px] text-[#626B45]">
                    Confidence Level: <strong>{viewingDetailsItem.aiAnalysis.confidenceIndicator.level}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Missing Info & Action Items if present */}
            {viewingDetailsItem.aiAnalysis?.missingInformation && viewingDetailsItem.aiAnalysis.missingInformation.length > 0 && (
              <div className="bg-[#F7F4EC] p-4 rounded-2xl border border-[#E6E2D8] space-y-2 text-xs">
                <span className="font-semibold text-[#252A25]">
                  Data Points Requiring Physical Partner Clarification:
                </span>
                <ul className="list-disc pl-4 space-y-1 text-[#777A72] text-[11px]">
                  {viewingDetailsItem.aiAnalysis.missingInformation.map((info, idx) => (
                    <li key={idx}>{info}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-[#E6E2D8]">
              <button
                onClick={() => setViewingDetailsItem(null)}
                className="px-5 py-2 text-xs font-semibold text-[#FFFEFA] bg-[#234D35] hover:bg-[#1a3a28] rounded-full transition-colors cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
