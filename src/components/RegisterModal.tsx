import React, { useState } from 'react';
import { CATEGORIES } from '../data/mockData';
import { CategoryItem, ResourceInventoryItem, RecoveryPathway } from '../types';
import { X, Sparkles, CheckCircle2, Plus, PackageCheck, AlertCircle, Trash2, ArrowRight } from 'lucide-react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: ResourceInventoryItem[];
  onAddInventoryItem: (item: ResourceInventoryItem) => void;
  onRemoveInventoryItem: (id: string) => void;
  preselectedCategory?: CategoryItem | null;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  inventory,
  onAddInventoryItem,
  onRemoveInventoryItem,
  preselectedCategory
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'ledger'>('create');
  
  // Form fields
  const [category, setCategory] = useState<string>(preselectedCategory?.title || CATEGORIES[0].title);
  const [deviceType, setDeviceType] = useState('');
  const [quantity, setQuantity] = useState<number>(10);
  const [condition, setCondition] = useState<ResourceInventoryItem['condition']>('Functional');
  const [location, setLocation] = useState('Central Warehouse Bay 3');
  const [notes, setNotes] = useState('');
  
  // AI recommendation state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendation, setRecommendation] = useState<{
    pathway: RecoveryPathway;
    handlingSummary: string;
    matchedPartners: number;
    valueStream: string;
  } | null>(null);

  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  // Presets helper
  const applyPreset = (preset: { category: string; title: string; qty: number; cond: ResourceInventoryItem['condition']; notes: string }) => {
    setCategory(preset.category);
    setDeviceType(preset.title);
    setQuantity(preset.qty);
    setCondition(preset.cond);
    setNotes(preset.notes);
    setRecommendation(null);
  };

  const handleRunAiAnalysis = () => {
    if (!deviceType.trim()) return;
    setIsAnalyzing(true);
    
    setTimeout(() => {
      let pathway: RecoveryPathway = 'Refurbishment & Reuse';
      let summary = 'Recommended for certified refurbisher; components intact.';
      let value = 'Secondary market hardware resale';
      let partners = 4;

      if (category.includes('Circuit') || condition === 'Parts Only') {
        pathway = 'Component Harvesting';
        summary = 'Precious metal contact reclamation and micro-soldering component rescue.';
        value = 'Gold/Copper metallurgical assay yield';
        partners = 3;
      } else if (category.includes('Cable') || condition === 'Defective') {
        pathway = 'Precious Metal & Material Recovery';
        summary = 'High-purity copper granulator and insulation polymer recovery.';
        value = 'Base commodity scrap recovery';
        partners = 2;
      } else if (category.includes('Printers') || category.includes('Other')) {
        pathway = 'Authorized Safe Recycling';
        summary = 'Mechanical demanufacturing and compliant shredder handling.';
        value = 'Responsible zero-landfill diversion';
        partners = 5;
      }

      setRecommendation({
        pathway,
        handlingSummary: summary,
        matchedPartners: partners,
        valueStream: value
      });
      setIsAnalyzing(false);
    }, 600);
  };

  const handleSubmitItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceType.trim()) return;

    const newItem: ResourceInventoryItem = {
      id: `inv-${Date.now().toString().slice(-4)}`,
      category,
      deviceType,
      quantity: Number(quantity),
      condition,
      location: location || 'Facility Storage',
      notes,
      status: 'Available',
      addedAt: 'Just now',
      aiRecommendation: recommendation ? {
        pathway: recommendation.pathway,
        handlingSummary: recommendation.handlingSummary,
        matchedPartners: recommendation.matchedPartners
      } : undefined
    };

    onAddInventoryItem(newItem);
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setActiveTab('ledger');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-3xl max-w-3xl w-full max-h-[90vh] shadow-2xl overflow-hidden flex flex-col my-auto relative">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E6E2D8] flex items-center justify-between bg-[#F7F4EC]">
          <div>
            <h3 className="font-serif-heading text-2xl text-[#252A25]">
              Resource Inventory Hub
            </h3>
            <p className="text-xs text-[#777A72]">
              Add equipment lots, run AI-assisted pathway checks, and prepare recovery requests
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

        {/* Tab Switcher */}
        <div className="px-6 pt-3 pb-2 border-b border-[#E6E2D8] flex items-center gap-3 bg-[#FFFEFA]">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
              activeTab === 'create'
                ? 'bg-[#234D35] text-[#FFFEFA]'
                : 'text-[#777A72] hover:bg-[#F7F4EC]'
            }`}
          >
            Register New Lot
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'ledger'
                ? 'bg-[#234D35] text-[#FFFEFA]'
                : 'text-[#777A72] hover:bg-[#F7F4EC]'
            }`}
          >
            <span>Current Digital Ledger</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20">
              {inventory.length}
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'create' ? (
            <div>
              {/* Presets Strip */}
              <div className="mb-6 p-3 rounded-2xl bg-[#F7F4EC] border border-[#E6E2D8]">
                <div className="text-[11px] font-semibold text-[#626B45] uppercase tracking-wider mb-2">
                  Quick Prototype Examples (Click to Autofill):
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => applyPreset({
                      category: 'Laptops and Desktop Equipment',
                      title: 'Dell Latitude 7490 Corporate Laptops (i5/16GB)',
                      qty: 45,
                      cond: 'Functional',
                      notes: 'Storage SSDs removed for internal data privacy; chargers bundled.'
                    })}
                    className="text-xs px-2.5 py-1 bg-[#FFFEFA] border border-[#E6E2D8] hover:border-[#234D35] rounded-lg text-[#252A25] transition-colors text-left"
                  >
                    45 Enterprise Laptops
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset({
                      category: 'Circuit Boards and Electronic Parts',
                      title: 'Server Line Cards & Daughterboards (1U Rack)',
                      qty: 120,
                      cond: 'Parts Only',
                      notes: 'Decommissioned telco cards with gold finger traces.'
                    })}
                    className="text-xs px-2.5 py-1 bg-[#FFFEFA] border border-[#E6E2D8] hover:border-[#234D35] rounded-lg text-[#252A25] transition-colors text-left"
                  >
                    120 Telecom PCBs
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset({
                      category: 'Cables and Electronic Accessories',
                      title: 'Bulk Copper Network Patch & AC Power Harnesses',
                      qty: 250,
                      cond: 'Defective',
                      notes: 'Surplus bundled wires from office server migration.'
                    })}
                    className="text-xs px-2.5 py-1 bg-[#FFFEFA] border border-[#E6E2D8] hover:border-[#234D35] rounded-lg text-[#252A25] transition-colors text-left"
                  >
                    250 kg Copper Cables
                  </button>
                </div>
              </div>

              {/* Input Form */}
              <form onSubmit={handleSubmitItem} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Category Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-[#252A25] mb-1.5">
                      Resource Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setRecommendation(null);
                      }}
                      className="w-full text-xs bg-[#FFFEFA] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#252A25] focus:border-[#234D35] focus:ring-1 focus:ring-[#234D35]"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.title}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Condition */}
                  <div>
                    <label className="block text-xs font-semibold text-[#252A25] mb-1.5">
                      Operating Condition
                    </label>
                    <select
                      value={condition}
                      onChange={(e) => {
                        setCondition(e.target.value as ResourceInventoryItem['condition']);
                        setRecommendation(null);
                      }}
                      className="w-full text-xs bg-[#FFFEFA] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#252A25] focus:border-[#234D35] focus:ring-1 focus:ring-[#234D35]"
                    >
                      <option value="Functional">Functional (Powers on / Good condition)</option>
                      <option value="Minor Wear">Minor Wear (Cosmetic flaws / Needs check)</option>
                      <option value="Defective">Defective (Non-functional / Obsolete)</option>
                      <option value="Parts Only">Parts Only (Harvesting / Subassemblies)</option>
                    </select>
                  </div>

                </div>

                {/* Device Type & Quantity */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#252A25] mb-1.5">
                      Equipment Model or Description *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., ThinkPad T480 laptops, Cisco 2960 switches..."
                      value={deviceType}
                      onChange={(e) => setDeviceType(e.target.value)}
                      className="w-full text-xs bg-[#FFFEFA] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#252A25] focus:border-[#234D35] focus:ring-1 focus:ring-[#234D35]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#252A25] mb-1.5">
                      Approximate Count / Qty *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full text-xs bg-[#FFFEFA] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#252A25] focus:border-[#234D35] focus:ring-1 focus:ring-[#234D35]"
                    />
                  </div>
                </div>

                {/* Storage Location & Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#252A25] mb-1.5">
                      Facility Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Building A - IT Room 204"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full text-xs bg-[#FFFEFA] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#252A25] focus:border-[#234D35] focus:ring-1 focus:ring-[#234D35]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#252A25] mb-1.5">
                      Important Details & Data Status
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Hard drives removed, chargers included"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full text-xs bg-[#FFFEFA] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#252A25] focus:border-[#234D35] focus:ring-1 focus:ring-[#234D35]"
                    />
                  </div>
                </div>

                {/* AI Analysis Trigger Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    disabled={!deviceType.trim() || isAnalyzing}
                    onClick={handleRunAiAnalysis}
                    className="w-full py-2.5 px-4 rounded-xl border border-[#234D35]/30 bg-[#DCE5D5]/40 hover:bg-[#DCE5D5] text-[#234D35] text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#234D35]" />
                    <span>
                      {isAnalyzing ? 'Running AI Pathway Analysis...' : 'Run AI Analysis Recommendation'}
                    </span>
                  </button>
                </div>

                {/* Recommendation Box if generated */}
                {recommendation && (
                  <div className="p-4 rounded-2xl bg-[#F7F4EC] border border-[#234D35]/30 space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#234D35]">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>AI Recovery Pathway Recommendation</span>
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#234D35] text-white">
                        {recommendation.pathway}
                      </span>
                    </div>
                    <p className="text-xs text-[#252A25]">
                      {recommendation.handlingSummary}
                    </p>
                    <div className="text-[11px] text-[#626B45] flex items-center gap-2 pt-1 border-t border-[#E6E2D8]">
                      <span>Potential Value: <strong>{recommendation.valueStream}</strong></span>
                      <span>·</span>
                      <span>Matched Handlers: <strong>{recommendation.matchedPartners} in region</strong></span>
                    </div>
                  </div>
                )}

                {/* Form Action */}
                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-medium text-[#777A72] hover:text-[#252A25]"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={!deviceType.trim()}
                    className="px-6 py-2.5 text-xs font-semibold text-[#FFFEFA] bg-[#234D35] hover:bg-[#1a3a28] rounded-full shadow-sm transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{submittedSuccess ? 'Item Cataloged!' : 'Save to Digital Inventory'}</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Digital Ledger Tab */
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#777A72]">
                <span>Logged Lots ({inventory.length} total)</span>
                <span className="italic">Ready for downstream recycler coordination</span>
              </div>

              {inventory.length === 0 ? (
                <div className="text-center py-12 bg-[#F7F4EC] rounded-2xl border border-[#E6E2D8] text-xs text-[#777A72]">
                  No equipment recorded yet. Click "Register New Lot" to add your first item.
                </div>
              ) : (
                <div className="space-y-3">
                  {inventory.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#F7F4EC] border border-[#E6E2D8] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-[#252A25]">
                            {item.deviceType}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-white text-[#234D35] border border-[#E6E2D8]">
                            Qty: {item.quantity}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#777A72] flex flex-wrap gap-x-3">
                          <span>Category: {item.category}</span>
                          <span>·</span>
                          <span>Condition: {item.condition}</span>
                          <span>·</span>
                          <span>{item.location}</span>
                        </div>
                        {item.aiRecommendation && (
                          <div className="text-[11px] text-[#234D35] font-medium pt-1">
                            Pathway: {item.aiRecommendation.pathway} ({item.aiRecommendation.matchedPartners} matched handlers)
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => onRemoveInventoryItem(item.id)}
                          className="p-1.5 text-[#777A72] hover:text-red-700 hover:bg-white rounded-lg transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Manifest Dispatch Action */}
              {inventory.length > 0 && (
                <div className="p-4 rounded-2xl bg-[#234D35] text-white flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <PackageCheck className="w-4 h-4 text-[#DCE5D5]" />
                      <span>Ready to Dispatch Collection Request</span>
                    </div>
                    <div className="text-[11px] text-[#DCE5D5]/80">
                      Consolidate your logged items into an authorized partner pickup tender
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      alert('Manifest generated! Connected with regional authorized recovery partners for batch quotation.');
                      onClose();
                    }}
                    className="px-4 py-2 text-xs font-semibold bg-[#FFFEFA] text-[#234D35] hover:bg-[#F7F4EC] rounded-full transition-colors cursor-pointer shrink-0"
                  >
                    Request Partner Match
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
