import React, { useState } from 'react';
import { ResourceInventoryItem, RecoveryPathway } from '../../types';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert, 
  Upload, 
  X, 
  Plus, 
  ArrowRight,
  Info,
  Calendar,
  Layers,
  MapPin,
  FileText
} from 'lucide-react';

interface AddEWasteViewProps {
  onAddItem: (item: ResourceInventoryItem) => void;
  onNavigateToInventory: () => void;
  onNavigateToRequests: () => void;
  onNavigateToAiAnalysis?: () => void;
}

export const AddEWasteView: React.FC<AddEWasteViewProps> = ({
  onAddItem,
  onNavigateToInventory,
  onNavigateToRequests,
  onNavigateToAiAnalysis
}) => {
  // Supported categories
  const categories = [
    'Computers and office electronics',
    'Cables and accessories',
    'Mobile devices',
    'Circuit boards',
    'Printers',
    'Other eligible electronic waste'
  ];

  // Form states
  const [category, setCategory] = useState(categories[0]);
  const [deviceType, setDeviceType] = useState('');
  const [quantity, setQuantity] = useState<number | ''>(1);
  const [estimatedWeightKg, setEstimatedWeightKg] = useState<number | ''>('');
  const [condition, setCondition] = useState<ResourceInventoryItem['condition']>('Functional');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [specialHandlingNotes, setSpecialHandlingNotes] = useState('');
  
  // Image upload simulation
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);

  // Validation
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState<ResourceInventoryItem | null>(null);

  // AI Recommendation simulation
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<{
    pathway: RecoveryPathway;
    handlingSummary: string;
    matchedPartners: number;
  } | null>(null);

  const validate = () => {
    const errs: { [key: string]: string } = {};

    if (!deviceType.trim()) {
      errs.deviceType = 'Device or material name is required';
    }

    if (!quantity || Number(quantity) <= 0) {
      errs.quantity = 'Please enter a valid quantity of 1 or more';
    }

    if (!location.trim()) {
      errs.location = 'Storage location or room number is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunAiAnalysis = () => {
    if (!deviceType.trim()) {
      setErrors({ ...errors, deviceType: 'Enter device name first to generate AI recommendation' });
      return;
    }

    setIsAnalyzing(true);
    setTimeout(() => {
      let pathway: RecoveryPathway = 'Refurbishment & Reuse';
      let summary = 'High reuse potential; preserves chassis, memory, and functional sub-systems.';
      let partners = 4;

      if (category.includes('Circuit') || condition === 'Parts Only') {
        pathway = 'Component Harvesting';
        summary = 'Precious metal contact reclamation and micro-soldering component rescue.';
        partners = 3;
      } else if (category.includes('Cables') || condition === 'Defective') {
        pathway = 'Precious Metal & Material Recovery';
        summary = 'High-purity copper granulator and insulation polymer separation stream.';
        partners = 2;
      } else if (category.includes('Printers') || category.includes('Other')) {
        pathway = 'Authorized Safe Recycling';
        summary = 'Mechanical demanufacturing and compliant shredder handling.';
        partners = 5;
      }

      setAiRecommendation({
        pathway,
        handlingSummary: summary,
        matchedPartners: partners
      });
      setIsAnalyzing(false);
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newItem: ResourceInventoryItem = {
        id: `inv-${Date.now().toString().slice(-4)}`,
        category,
        deviceType: deviceType.trim(),
        quantity: Number(quantity),
        estimatedWeightKg: estimatedWeightKg ? Number(estimatedWeightKg) : undefined,
        condition,
        location: location.trim(),
        description: description.trim(),
        imageUrl: imagePreview || undefined,
        preferredCollectionDate: preferredDate || undefined,
        specialHandlingNotes: specialHandlingNotes.trim(),
        status: 'Available',
        addedAt: 'Just now',
        aiRecommendation: aiRecommendation || {
          pathway: category.includes('Circuit') ? 'Component Harvesting' : 'Refurbishment & Reuse',
          handlingSummary: 'Standard inspection and serialization before partner intake.',
          matchedPartners: 3
        }
      };

      onAddItem(newItem);
      setSavedSuccess(newItem);
      setIsSubmitting(false);
    }, 500);
  };

  const handleResetForm = () => {
    setSavedSuccess(null);
    setDeviceType('');
    setQuantity(1);
    setEstimatedWeightKg('');
    setLocation('');
    setDescription('');
    setPreferredDate('');
    setSpecialHandlingNotes('');
    setImagePreview(null);
    setImageName(null);
    setAiRecommendation(null);
    setErrors({});
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E2D8]">
        <div>
          <h1 className="font-serif-heading text-2xl sm:text-3xl text-[#252A25]">
            Add E-Waste Resource
          </h1>
          <p className="text-xs sm:text-sm text-[#777A72] mt-1">
            Register surplus electronics into your digital ledger to identify recovery pathways
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onNavigateToAiAnalysis && (
            <button
              type="button"
              onClick={onNavigateToAiAnalysis}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#234D35] bg-[#DCE5D5]/60 hover:bg-[#DCE5D5] rounded-xl border border-[#234D35]/20 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#234D35]" />
              <span>Full AI Analysis Engine</span>
            </button>
          )}

          <button
            onClick={onNavigateToInventory}
            className="text-xs font-semibold text-[#626B45] hover:text-[#234D35] px-3.5 py-2 rounded-xl bg-[#F7F4EC] border border-[#E6E2D8] hover:border-[#234D35] transition-colors self-start sm:self-auto cursor-pointer"
          >
            View Existing Inventory
          </button>
        </div>
      </div>

      {/* Critical Safety Advisory */}
      <div className="p-4 rounded-2xl bg-[#DCE5D5]/40 border border-[#234D35]/20 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-[#234D35] shrink-0 mt-0.5" />
        <div className="text-xs text-[#252A25] space-y-1">
          <span className="font-bold text-[#234D35] uppercase tracking-wide">
            Mandatory Safety & Handling Guidance:
          </span>
          <p className="text-[#626B45] leading-relaxed">
            Do not open, tamper with, or dismantle batteries or sealed electronic enclosures. All units must remain intact for authorized, certified downstream intake and hazardous materials handling.
          </p>
        </div>
      </div>

      {/* Success Notification Banner */}
      {savedSuccess ? (
        <div className="p-6 rounded-3xl bg-[#FFFEFA] border border-[#234D35]/30 shadow-lg space-y-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#DCE5D5] text-[#234D35] flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif-heading text-xl text-[#252A25]">
                Resource Cataloged Successfully!
              </h3>
              <p className="text-xs text-[#777A72]">
                <strong>{savedSuccess.deviceType}</strong> (Qty: {savedSuccess.quantity}) is logged in your local digital inventory.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F7F4EC] border border-[#E6E2D8] text-xs space-y-1">
            <div className="text-[#234D35] font-semibold">
              AI Suggested Pathway: {savedSuccess.aiRecommendation?.pathway}
            </div>
            <div className="text-[#777A72]">
              {savedSuccess.aiRecommendation?.handlingSummary}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onNavigateToInventory}
              className="px-5 py-2.5 text-xs font-semibold text-[#FFFEFA] bg-[#234D35] hover:bg-[#1a3a28] rounded-full transition-colors cursor-pointer"
            >
              Go to Inventory
            </button>
            <button
              onClick={onNavigateToRequests}
              className="px-5 py-2.5 text-xs font-semibold text-[#252A25] bg-[#F7F4EC] hover:bg-[#E6E2D8] rounded-full border border-[#E6E2D8] transition-colors cursor-pointer"
            >
              Create Recovery Request
            </button>
            <button
              onClick={handleResetForm}
              className="px-4 py-2.5 text-xs font-medium text-[#777A72] hover:text-[#252A25] cursor-pointer"
            >
              Add Another Item
            </button>
          </div>
        </div>
      ) : (
        /* The Registration Form */
        <form onSubmit={handleSubmit} className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          
          {/* Section 1: Item Classification */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#626B45] mb-4 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#234D35]" />
              <span>1. Item Classification & Model</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-[#252A25] mb-1.5">
                  Item Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setAiRecommendation(null);
                  }}
                  className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#252A25] focus:border-[#234D35] focus:ring-1 focus:ring-[#234D35]"
                >
                  {categories.map((cat, i) => (
                    <option key={i} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Device or Material Name */}
              <div>
                <label className="block text-xs font-semibold text-[#252A25] mb-1.5">
                  Device or Material Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dell Latitude 7490, Cisco 3850 Switch"
                  value={deviceType}
                  onChange={(e) => {
                    setDeviceType(e.target.value);
                    if (errors.deviceType) setErrors({ ...errors, deviceType: '' });
                  }}
                  className={`w-full text-xs bg-[#F7F4EC] border rounded-xl px-3.5 py-2.5 text-[#252A25] focus:ring-1 focus:ring-[#234D35] ${
                    errors.deviceType ? 'border-red-500' : 'border-[#E6E2D8] focus:border-[#234D35]'
                  }`}
                />
                {errors.deviceType && <p className="text-[11px] text-red-600 mt-1">{errors.deviceType}</p>}
              </div>

            </div>

            {/* AI Assistant Quick Probe Button */}
            <div className="mt-3">
              <button
                type="button"
                onClick={handleRunAiAnalysis}
                disabled={isAnalyzing}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#234D35] hover:text-[#1a3a28] px-3 py-1.5 rounded-lg bg-[#DCE5D5]/50 border border-[#234D35]/15 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAnalyzing ? 'Evaluating Pathway...' : 'Generate AI Pathway Recommendation'}</span>
              </button>

              {aiRecommendation && (
                <div className="mt-2.5 p-3 rounded-xl bg-[#F7F4EC] border border-[#234D35]/20 text-xs text-[#252A25] flex items-center justify-between gap-3 animate-in fade-in">
                  <div>
                    <span className="font-semibold text-[#234D35]">
                      Suggested Pathway: {aiRecommendation.pathway}
                    </span>
                    <p className="text-[#777A72] text-[11px] mt-0.5">
                      {aiRecommendation.handlingSummary}
                    </p>
                  </div>
                  <span className="shrink-0 text-[11px] font-mono px-2 py-1 rounded bg-[#DCE5D5] text-[#234D35] font-semibold">
                    {aiRecommendation.matchedPartners} Matches
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Quantities, Weight & Condition */}
          <div className="pt-4 border-t border-[#E6E2D8]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#626B45] mb-4 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-[#234D35]" />
              <span>2. Quantity, Condition & Weight</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Quantity */}
              <div>
                <label className="block text-xs font-semibold text-[#252A25] mb-1.5">
                  Quantity (Units) *
                </label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(e.target.value === '' ? '' : Number(e.target.value));
                    if (errors.quantity) setErrors({ ...errors, quantity: '' });
                  }}
                  className={`w-full text-xs bg-[#F7F4EC] border rounded-xl px-3.5 py-2.5 text-[#252A25] focus:ring-1 focus:ring-[#234D35] ${
                    errors.quantity ? 'border-red-500' : 'border-[#E6E2D8] focus:border-[#234D35]'
                  }`}
                />
                {errors.quantity && <p className="text-[11px] text-red-600 mt-1">{errors.quantity}</p>}
              </div>

              {/* Estimated Weight */}
              <div>
                <label className="block text-xs font-semibold text-[#252A25] mb-1.5">
                  Estimated Weight (kg, optional)
                </label>
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  placeholder="e.g. 25"
                  value={estimatedWeightKg}
                  onChange={(e) => setEstimatedWeightKg(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#252A25] focus:border-[#234D35] focus:ring-1 focus:ring-[#234D35]"
                />
              </div>

              {/* Condition */}
              <div>
                <label className="block text-xs font-semibold text-[#252A25] mb-1.5">
                  Operating Condition *
                </label>
                <select
                  value={condition}
                  onChange={(e) => {
                    setCondition(e.target.value as ResourceInventoryItem['condition']);
                    setAiRecommendation(null);
                  }}
                  className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#252A25] focus:border-[#234D35] focus:ring-1 focus:ring-[#234D35]"
                >
                  <option value="Functional">Functional (Powers on / Good)</option>
                  <option value="Minor Wear">Minor Wear (Cosmetic flaws)</option>
                  <option value="Defective">Defective (Obsolete / Broken)</option>
                  <option value="Parts Only">Parts Only (Subassemblies / Scrap)</option>
                </select>
              </div>

            </div>
          </div>

          {/* Section 3: Facility Location & Logistics */}
          <div className="pt-4 border-t border-[#E6E2D8]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#626B45] mb-4 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#234D35]" />
              <span>3. Location & Collection Logistics</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Storage Location */}
              <div>
                <label className="block text-xs font-semibold text-[#252A25] mb-1.5">
                  Storage Location / Department *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Building B, Room 302, Loading Bay 4"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    if (errors.location) setErrors({ ...errors, location: '' });
                  }}
                  className={`w-full text-xs bg-[#F7F4EC] border rounded-xl px-3.5 py-2.5 text-[#252A25] focus:ring-1 focus:ring-[#234D35] ${
                    errors.location ? 'border-red-500' : 'border-[#E6E2D8] focus:border-[#234D35]'
                  }`}
                />
                {errors.location && <p className="text-[11px] text-red-600 mt-1">{errors.location}</p>}
              </div>

              {/* Preferred Collection Date */}
              <div>
                <label className="block text-xs font-semibold text-[#252A25] mb-1.5">
                  Preferred Collection Date (optional)
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#252A25] focus:border-[#234D35] focus:ring-1 focus:ring-[#234D35]"
                />
              </div>

            </div>

            {/* Description */}
            <div className="mt-4">
              <label className="block text-xs font-semibold text-[#252A25] mb-1.5">
                Technical Description & Context
              </label>
              <textarea
                rows={2}
                placeholder="Include specifications, generation, brand notes, or packaging condition..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#252A25] focus:border-[#234D35] focus:ring-1 focus:ring-[#234D35]"
              />
            </div>

            {/* Special Handling Notes */}
            <div className="mt-4">
              <label className="block text-xs font-semibold text-[#252A25] mb-1.5">
                Special Handling Notes & Sanitization
              </label>
              <input
                type="text"
                placeholder="e.g. Storage drives securely wiped; bundled with power adapters; palletized"
                value={specialHandlingNotes}
                onChange={(e) => setSpecialHandlingNotes(e.target.value)}
                className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#252A25] focus:border-[#234D35] focus:ring-1 focus:ring-[#234D35]"
              />
            </div>
          </div>

          {/* Section 4: Image Upload */}
          <div className="pt-4 border-t border-[#E6E2D8]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#626B45] mb-2 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-[#234D35]" />
              <span>4. Equipment Photo Verification (Optional)</span>
            </h2>
            <p className="text-[11px] text-[#777A72] mb-3">
              Upload clear external photographs of the batch or labeling to assist downstream partners with intake estimation.
            </p>

            {imagePreview ? (
              <div className="relative inline-block border border-[#E6E2D8] rounded-2xl overflow-hidden bg-[#F7F4EC] p-2">
                <img 
                  src={imagePreview} 
                  alt="Uploaded hardware preview" 
                  className="w-32 h-24 object-cover rounded-xl" 
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setImageName(null);
                  }}
                  className="absolute top-3 right-3 p-1 rounded-full bg-black/60 text-white hover:bg-black"
                  aria-label="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <div className="text-[10px] text-[#777A72] mt-1 max-w-[128px] truncate">
                  {imageName}
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-[#E6E2D8] hover:border-[#234D35] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#F7F4EC]/50 hover:bg-[#F7F4EC]">
                <Upload className="w-6 h-6 text-[#626B45] mb-2" />
                <span className="text-xs font-semibold text-[#252A25]">
                  Click to select photo or batch manifest image
                </span>
                <span className="text-[11px] text-[#777A72] mt-0.5">
                  PNG, JPG, or WEBP up to 10MB
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Submit Actions */}
          <div className="pt-6 border-t border-[#E6E2D8] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleResetForm}
              className="px-4 py-2 text-xs font-medium text-[#777A72] hover:text-[#252A25]"
            >
              Reset
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-7 py-3 text-xs font-semibold text-[#FFFEFA] bg-[#234D35] hover:bg-[#1a3a28] rounded-full shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Registering Resource...' : 'Save to Inventory Ledger'}</span>
            </button>
          </div>

        </form>
      )}

    </div>
  );
};
