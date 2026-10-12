import React, { useState } from 'react';
import { 
  ResourceInventoryItem, 
  AiInventoryAnalysis, 
  StandardRecoveryPathway,
  OriginalItemSubmission 
} from '../../types';
import { analyzeItemWithAi } from '../../services/aiAnalysisService';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert, 
  Upload, 
  X, 
  Plus, 
  ArrowRight, 
  Edit3, 
  FileText, 
  Layers, 
  HelpCircle, 
  ShieldCheck, 
  RefreshCw,
  Info,
  Check
} from 'lucide-react';

interface AiAnalysisViewProps {
  onSaveItemToInventory: (item: ResourceInventoryItem) => void;
  onNavigateToInventory: () => void;
  onNavigateToRequests: () => void;
}

export const AiAnalysisView: React.FC<AiAnalysisViewProps> = ({
  onSaveItemToInventory,
  onNavigateToInventory,
  onNavigateToRequests
}) => {
  // Submission inputs
  const [description, setDescription] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [condition, setCondition] = useState('Minor Wear');
  const [location, setLocation] = useState('Main Logistics Bay');
  
  // Image
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);

  // Status
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AiInventoryAnalysis | null>(null);
  const [originalSubmission, setOriginalSubmission] = useState<OriginalItemSubmission | null>(null);

  // Correction / Edit mode states
  const [isEditingAiResult, setIsEditingAiResult] = useState(false);
  const [editedCategory, setEditedCategory] = useState('');
  const [editedDeviceName, setEditedDeviceName] = useState('');
  const [editedQuantity, setEditedQuantity] = useState<number>(1);
  const [editedPathway, setEditedPathway] = useState<StandardRecoveryPathway>('Professional assessment for refurbishment');
  const [editedCondition, setEditedCondition] = useState<any>('Minor Wear');

  // Success save state
  const [savedSuccessItem, setSavedSuccessItem] = useState<ResourceInventoryItem | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Example presets
  const samplePresets = [
    {
      label: '45 Enterprise Laptops with Removed Storage',
      name: 'Dell Latitude 7490 Corporate Laptops',
      qty: 45,
      cond: 'Minor Wear',
      desc: '45 business laptops refreshed after 3 years of service. All hard drives removed in compliance with data policy. LCD panels and keyboards are functional. Power chargers bundled in separate boxes.'
    },
    {
      label: 'Pallet of Telecom PCBs & Server Line Cards',
      name: 'High-Density Server Motherboards & Line Cards',
      qty: 120,
      cond: 'Parts Only',
      desc: 'Decommissioned server blades and telecom line cards with intact PCIe slots and high-purity gold contact traces. No loose batteries. Non-working for modern data center protocols.'
    },
    {
      label: 'Surplus Copper Network Cabling',
      name: 'Cat6 & AC Power Interconnect Cables',
      qty: 180,
      cond: 'Defective',
      desc: 'Bundled copper patch cords and power harnesses removed from data center overhaul. Untangled and packaged in bulk gaylord containers.'
    }
  ];

  const handleApplyPreset = (preset: typeof samplePresets[0]) => {
    setDeviceName(preset.name);
    setQuantity(preset.qty);
    setCondition(preset.cond);
    setDescription(preset.desc);
    setErrorMessage(null);
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

  const handleRunAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() && !deviceName.trim()) {
      setErrorMessage('Please provide an equipment description or device name.');
      return;
    }

    setErrorMessage(null);
    setIsAnalyzing(true);
    setSavedSuccessItem(null);

    const submission: OriginalItemSubmission = {
      rawDescription: description.trim(),
      rawDeviceName: deviceName.trim(),
      userQuantity: quantity ? Number(quantity) : undefined,
      userCondition: condition,
      location: location.trim(),
      uploadedImageUrl: imagePreview || undefined,
      submittedAt: new Date().toISOString()
    };
    setOriginalSubmission(submission);

    try {
      const response = await analyzeItemWithAi({
        description: description.trim(),
        deviceName: deviceName.trim(),
        quantity: quantity ? Number(quantity) : undefined,
        condition,
        imageBase64: imagePreview || undefined,
        imageMimeType: 'image/jpeg'
      });

      setAnalysisResult(response.analysis);

      // Initialize edit fields
      setEditedCategory(response.analysis.likelyCategory);
      setEditedDeviceName(response.analysis.standardizedDeviceName);
      setEditedQuantity(response.analysis.extractedQuantity || 1);
      setEditedPathway(response.analysis.primaryPathway);
      setEditedCondition(response.analysis.reportedCondition || 'Minor Wear');
      setIsEditingAiResult(false);
    } catch (err: any) {
      setErrorMessage('Failed to generate analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveToInventory = () => {
    if (!analysisResult || !originalSubmission) return;

    // Use edited values if corrected
    const finalCategory = isEditingAiResult ? editedCategory : analysisResult.likelyCategory;
    const finalDeviceName = isEditingAiResult ? editedDeviceName : analysisResult.standardizedDeviceName;
    const finalQuantity = isEditingAiResult ? editedQuantity : (analysisResult.extractedQuantity || 1);
    const finalCondition = isEditingAiResult ? editedCondition : (analysisResult.reportedCondition === 'Indeterminate' ? 'Minor Wear' : analysisResult.reportedCondition);
    const finalPathway = isEditingAiResult ? editedPathway : analysisResult.primaryPathway;

    const newItem: ResourceInventoryItem = {
      id: `inv-${Date.now().toString().slice(-4)}`,
      category: finalCategory,
      deviceType: finalDeviceName,
      quantity: Number(finalQuantity),
      condition: finalCondition,
      location: originalSubmission.location || 'Central Facility Storage',
      description: originalSubmission.rawDescription,
      imageUrl: originalSubmission.uploadedImageUrl,
      status: 'Available',
      addedAt: 'Just now',
      originalSubmission,
      aiAnalysis: {
        ...analysisResult,
        primaryPathway: finalPathway,
        userCorrectionsApplied: isEditingAiResult
      },
      aiRecommendation: {
        pathway: finalPathway === 'Reuse' ? 'Refurbishment & Reuse' : 
                 finalPathway === 'Authorized component recovery' ? 'Component Harvesting' :
                 finalPathway === 'Authorized recycling' ? 'Authorized Safe Recycling' : 'Refurbishment & Reuse',
        handlingSummary: analysisResult.handlingNotes,
        matchedPartners: 4
      }
    };

    onSaveItemToInventory(newItem);
    setSavedSuccessItem(newItem);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E2D8]">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#234D35] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI DECISION ASSISTANT · MODULE 3.0</span>
          </div>
          <h1 className="font-serif-heading text-2xl sm:text-3xl text-[#252A25]">
            AI Item Analysis & Recovery Recommendations
          </h1>
          <p className="text-xs sm:text-sm text-[#777A72] mt-1">
            Submit equipment descriptions and photos to extract classifications, identify missing data, and evaluate recovery pathways
          </p>
        </div>

        <button
          onClick={onNavigateToInventory}
          className="text-xs font-semibold text-[#626B45] hover:text-[#234D35] px-3.5 py-2 rounded-xl bg-[#F7F4EC] border border-[#E6E2D8] hover:border-[#234D35] transition-colors self-start sm:self-auto cursor-pointer"
        >
          View Inventory Ledger
        </button>
      </div>

      {/* Mandatory Regulatory / Physical Inspection Notice */}
      <div className="p-4 rounded-2xl bg-[#DCE5D5]/40 border border-[#234D35]/20 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-[#234D35] shrink-0 mt-0.5" />
        <div className="text-xs text-[#252A25] space-y-1">
          <span className="font-bold text-[#234D35] uppercase tracking-wide">
            Advisory Scope & Inspection Notice:
          </span>
          <p className="text-[#626B45] leading-relaxed">
            Recommendations provide decision support for initial logistics triage. A photograph or description alone cannot establish internal component health, hidden battery swelling, exact metallurgical content, or guaranteed resale value. Certified downstream handlers perform final physical assays.
          </p>
        </div>
      </div>

      {/* Presets Bar */}
      <div className="p-4 rounded-2xl bg-[#FFFEFA] border border-[#E6E2D8] shadow-sm">
        <div className="text-xs font-bold uppercase tracking-wider text-[#626B45] mb-2.5 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-[#234D35]" />
          <span>Interactive Test Batches (Click to Populate):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {samplePresets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="text-xs px-3 py-1.5 bg-[#F7F4EC] hover:bg-[#DCE5D5] border border-[#E6E2D8] hover:border-[#234D35] rounded-xl text-[#252A25] transition-colors cursor-pointer text-left font-medium"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submission Form */}
      <form onSubmit={handleRunAnalysis} className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#E6E2D8]">
          <h2 className="font-serif-heading text-lg text-[#252A25]">
            Submit Item for AI Analysis
          </h2>
          <span className="text-xs text-[#777A72]">
            Step 1: Input Raw Data
          </span>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#252A25] mb-1">
              Device or Material Title
            </label>
            <input
              type="text"
              placeholder="e.g. Dell Latitude 7490, Cisco Catalyst Switch"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#252A25] focus:border-[#234D35] focus:ring-1 focus:ring-[#234D35]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#252A25] mb-1">
              Quantity (if known)
            </label>
            <input
              type="number"
              min={1}
              placeholder="e.g. 45"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#252A25] focus:border-[#234D35] focus:ring-1 focus:ring-[#234D35]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#252A25] mb-1">
            Item Description & Known Operational State *
          </label>
          <textarea
            required
            rows={3}
            placeholder="Describe hardware models, components present or removed (e.g., hard drives, RAM), cosmetic condition, and testing observations..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#252A25] focus:border-[#234D35] focus:ring-1 focus:ring-[#234D35]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#252A25] mb-1">
              Reported Condition
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#252A25] focus:border-[#234D35] focus:ring-1 focus:ring-[#234D35]"
            >
              <option value="Functional">Functional (Powers on / Minimal wear)</option>
              <option value="Minor Wear">Minor Wear (Cosmetic scuffs / Needs diagnostics)</option>
              <option value="Defective">Defective (Broken screen / Does not boot)</option>
              <option value="Parts Only">Parts Only (Subassemblies / Stripped chassis)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#252A25] mb-1">
              Facility Storage Location
            </label>
            <input
              type="text"
              placeholder="e.g. Building C - Dock Bay 4"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#252A25] focus:border-[#234D35] focus:ring-1 focus:ring-[#234D35]"
            />
          </div>
        </div>

        {/* Photo Upload Attachment */}
        <div>
          <label className="block text-xs font-semibold text-[#252A25] mb-1">
            Equipment Photo (Optional)
          </label>
          {imagePreview ? (
            <div className="relative inline-block border border-[#E6E2D8] rounded-2xl overflow-hidden bg-[#F7F4EC] p-2">
              <img src={imagePreview} alt="Hardware preview" className="w-36 h-24 object-cover rounded-xl" />
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
              <div className="text-[10px] text-[#777A72] mt-1 max-w-[144px] truncate">
                {imageName}
              </div>
            </div>
          ) : (
            <label className="border-2 border-dashed border-[#E6E2D8] hover:border-[#234D35] rounded-2xl p-4 flex items-center justify-center gap-3 cursor-pointer transition-colors bg-[#F7F4EC]/50 hover:bg-[#F7F4EC]">
              <Upload className="w-5 h-5 text-[#626B45]" />
              <span className="text-xs text-[#252A25]">
                Attach photo of batch label or equipment chassis
              </span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isAnalyzing}
            className="inline-flex items-center gap-2 px-7 py-3 text-xs font-semibold text-[#FFFEFA] bg-[#234D35] hover:bg-[#1a3a28] rounded-full shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isAnalyzing ? 'Running AI Inference...' : 'Analyze Item & Generate Recommendations'}</span>
          </button>
        </div>
      </form>

      {/* Analysis Results Display (FEATURE 2 & FEATURE 3) */}
      {analysisResult && originalSubmission && (
        <div className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-3xl p-6 sm:p-8 shadow-md space-y-8 animate-in fade-in">
          
          {/* Header & Engine Mode Label */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E6E2D8]">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif-heading text-2xl text-[#252A25]">
                  AI Circular Analysis Report
                </h2>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  analysisResult.isLiveAi 
                    ? 'bg-[#234D35] text-white' 
                    : 'bg-[#F7F4EC] border border-[#E6E2D8] text-[#626B45]'
                }`}>
                  {analysisResult.analysisModeLabel}
                </span>
              </div>
              <p className="text-xs text-[#777A72] mt-0.5">
                Evaluation generated {new Date(analysisResult.analyzedAt).toLocaleTimeString()}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditingAiResult(!isEditingAiResult)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#234D35] bg-[#DCE5D5]/50 hover:bg-[#DCE5D5] rounded-xl border border-[#234D35]/20 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditingAiResult ? 'Done Correcting' : 'Correct AI Estimates'}</span>
              </button>
            </div>
          </div>

          {/* Section: Clear Distinction Between User-Provided vs AI-Generated */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* User-Provided Raw Information */}
            <div className="bg-[#F7F4EC] rounded-2xl p-5 border border-[#E6E2D8] space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#626B45] flex items-center justify-between">
                <span>User-Provided Information (Raw)</span>
                <span className="text-[10px] font-mono text-[#777A72]">Source: Generator</span>
              </div>

              <div className="text-xs space-y-2">
                <div>
                  <span className="text-[#777A72] block">Input Device Name:</span>
                  <span className="font-semibold text-[#252A25]">{originalSubmission.rawDeviceName || 'Unspecified'}</span>
                </div>
                <div>
                  <span className="text-[#777A72] block">Input Description:</span>
                  <p className="text-[#252A25] leading-relaxed">{originalSubmission.rawDescription}</p>
                </div>
                <div className="flex gap-4 pt-1 border-t border-[#E6E2D8]/80 text-[11px] text-[#777A72]">
                  <span>Stated Qty: <strong>{originalSubmission.userQuantity || 'Unspecified'}</strong></span>
                  <span>·</span>
                  <span>Reported Condition: <strong>{originalSubmission.userCondition}</strong></span>
                  <span>·</span>
                  <span>Location: <strong>{originalSubmission.location}</strong></span>
                </div>
              </div>
            </div>

            {/* AI-Generated Classification (with Edit Mode Support) */}
            <div className="bg-[#FFFEFA] rounded-2xl p-5 border border-[#234D35]/30 shadow-sm space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#234D35] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI-Generated Classification</span>
                </span>
                <span className="text-[10px] font-mono text-[#234D35]">Inferred</span>
              </div>

              {isEditingAiResult ? (
                /* Editable mode */
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#252A25] mb-1">
                      Category (User Corrected)
                    </label>
                    <input
                      type="text"
                      value={editedCategory}
                      onChange={(e) => setEditedCategory(e.target.value)}
                      className="w-full bg-[#F7F4EC] border border-[#E6E2D8] rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#252A25] mb-1">
                      Standardized Name (User Corrected)
                    </label>
                    <input
                      type="text"
                      value={editedDeviceName}
                      onChange={(e) => setEditedDeviceName(e.target.value)}
                      className="w-full bg-[#F7F4EC] border border-[#E6E2D8] rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#252A25] mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={editedQuantity}
                        onChange={(e) => setEditedQuantity(Number(e.target.value))}
                        className="w-full bg-[#F7F4EC] border border-[#E6E2D8] rounded-lg p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#252A25] mb-1">
                        Condition
                      </label>
                      <select
                        value={editedCondition}
                        onChange={(e) => setEditedCondition(e.target.value)}
                        className="w-full bg-[#F7F4EC] border border-[#E6E2D8] rounded-lg p-2 text-xs"
                      >
                        <option value="Functional">Functional</option>
                        <option value="Minor Wear">Minor Wear</option>
                        <option value="Defective">Defective</option>
                        <option value="Parts Only">Parts Only</option>
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                /* Read-only AI classification */
                <div className="text-xs space-y-2">
                  <div>
                    <span className="text-[#777A72] block">Likely Device Category:</span>
                    <span className="font-semibold text-[#252A25]">{analysisResult.likelyCategory}</span>
                  </div>
                  <div>
                    <span className="text-[#777A72] block">Standardized Title:</span>
                    <span className="font-semibold text-[#234D35]">{analysisResult.standardizedDeviceName}</span>
                  </div>
                  <div className="flex gap-4 pt-1 border-t border-[#E6E2D8]/80 text-[11px] text-[#777A72]">
                    <span>Extracted Qty: <strong>{analysisResult.extractedQuantity || '1'} units</strong></span>
                    <span>·</span>
                    <span>Classified Condition: <strong>{analysisResult.reportedCondition}</strong></span>
                  </div>
                </div>
              )}

              {/* Confidence Indicator if meaningfully supported */}
              {analysisResult.confidenceIndicator && (
                <div className="pt-2 border-t border-[#E6E2D8] text-[11px] text-[#626B45] flex items-center justify-between">
                  <span>Confidence: <strong>{analysisResult.confidenceIndicator.level}</strong></span>
                  <span className="text-[10px] text-[#777A72] max-w-xs text-right truncate">
                    {analysisResult.confidenceIndicator.justification}
                  </span>
                </div>
              )}
            </div>

          </div>

          {/* FEATURE 2: 5 Potential Recovery Pathways Evaluation */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif-heading text-xl text-[#252A25]">
                  Recovery Pathway Recommendations
                </h3>
                <p className="text-xs text-[#777A72]">
                  Comparative assessment across circular economy hierarchy options
                </p>
              </div>

              {/* User corrected pathway dropdown if in edit mode */}
              {isEditingAiResult && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#252A25]">Override Primary:</span>
                  <select
                    value={editedPathway}
                    onChange={(e) => setEditedPathway(e.target.value as StandardRecoveryPathway)}
                    className="text-xs bg-[#F7F4EC] border border-[#234D35] rounded-xl px-2.5 py-1 text-[#234D35] font-semibold"
                  >
                    <option value="Reuse">Reuse</option>
                    <option value="Professional assessment for refurbishment">Assessment for refurbishment</option>
                    <option value="Authorized component recovery">Component recovery</option>
                    <option value="Authorized recycling">Authorized recycling</option>
                    <option value="Further inspection required">Further inspection required</option>
                  </select>
                </div>
              )}
            </div>

            {/* Primary Recommended Pathway Highlight Card */}
            <div className="mb-6 p-5 rounded-2xl bg-[#DCE5D5]/50 border border-[#234D35]/30">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#234D35] mb-1">
                    Primary Recommended Pathway
                  </div>
                  <div className="font-serif-heading text-xl text-[#234D35]">
                    {isEditingAiResult ? editedPathway : analysisResult.primaryPathway}
                  </div>
                  <p className="text-xs text-[#252A25] mt-1.5 leading-relaxed">
                    {analysisResult.pathwayExplanation}
                  </p>
                </div>

                <div className="w-10 h-10 rounded-full bg-[#234D35] text-[#FFFEFA] flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
              </div>
            </div>

            {/* 5 Pathways Evaluation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {analysisResult.allPathways.map((p, idx) => {
                const isSelected = (isEditingAiResult ? editedPathway : analysisResult.primaryPathway) === p.pathwayName;
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl p-4 border flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'bg-[#234D35] text-white border-[#234D35] shadow-sm'
                        : 'bg-[#F7F4EC] text-[#252A25] border-[#E6E2D8]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-[#DCE5D5] text-[#234D35]'
                        }`}>
                          Pathway {idx + 1}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#DCE5D5]" />}
                      </div>

                      <h4 className="text-xs font-bold mb-1 leading-snug">
                        {p.pathwayName}
                      </h4>

                      <div className={`text-[11px] font-semibold mb-2 ${
                        isSelected ? 'text-[#DCE5D5]' : 'text-[#626B45]'
                      }`}>
                        {p.suitability}
                      </div>

                      <p className={`text-[11px] leading-relaxed ${
                        isSelected ? 'text-white/80' : 'text-[#777A72]'
                      }`}>
                        {p.rationale}
                      </p>
                    </div>

                    {isEditingAiResult && (
                      <button
                        type="button"
                        onClick={() => setEditedPathway(p.pathwayName)}
                        className={`mt-3 py-1 px-2 text-[10px] font-semibold rounded-lg border cursor-pointer ${
                          isSelected ? 'bg-white text-[#234D35]' : 'bg-[#FFFEFA] text-[#252A25]'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Select'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Missing Information & Recommended Next Steps */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-[#E6E2D8]">
            
            {/* Missing Information */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#626B45] flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#234D35]" />
                <span>Missing Information Requiring Clarification</span>
              </h3>
              <ul className="space-y-2">
                {analysisResult.missingInformation.map((info, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-[#252A25] bg-[#F7F4EC] p-2.5 rounded-xl border border-[#E6E2D8]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#626B45] mt-1.5 shrink-0" />
                    <span>{info}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Next Steps */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#234D35] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#234D35]" />
                <span>Recommended Operational Next Steps</span>
              </h3>
              <ul className="space-y-2">
                {analysisResult.recommendedNextSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-[#252A25] bg-[#F7F4EC] p-2.5 rounded-xl border border-[#E6E2D8]">
                    <Check className="w-3.5 h-3.5 text-[#234D35] mt-0.5 shrink-0" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Safety Disclaimer Banner */}
          <div className="p-3.5 rounded-2xl bg-[#F7F4EC] border border-[#E6E2D8] text-[11px] text-[#777A72] flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#626B45] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Notice:</strong> {analysisResult.safetyDisclaimer}
            </p>
          </div>

          {/* Success Save Banner or Save Action */}
          {savedSuccessItem ? (
            <div className="p-5 rounded-2xl bg-[#DCE5D5]/60 border border-[#234D35]/30 space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2.5 text-[#234D35]">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-serif-heading text-lg font-normal">
                  Item Saved to Digital Inventory Ledger!
                </span>
              </div>
              <p className="text-xs text-[#252A25]">
                <strong>{savedSuccessItem.deviceType}</strong> (Qty: {savedSuccessItem.quantity}) has been registered with both original user inputs and AI analysis recommendations stored separately.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  onClick={onNavigateToInventory}
                  className="px-5 py-2 text-xs font-semibold text-[#FFFEFA] bg-[#234D35] hover:bg-[#1a3a28] rounded-full transition-colors cursor-pointer"
                >
                  View in My Inventory
                </button>
                <button
                  onClick={onNavigateToRequests}
                  className="px-5 py-2 text-xs font-semibold text-[#252A25] bg-[#FFFEFA] hover:bg-[#F7F4EC] border border-[#E6E2D8] rounded-full transition-colors cursor-pointer"
                >
                  Create Recovery Request
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 border-t border-[#E6E2D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-[#777A72]">
                {isEditingAiResult ? 'User corrections are applied to this record.' : 'Review complete. Ready to store in digital ledger.'}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingAiResult(!isEditingAiResult)}
                  className="px-4 py-2 text-xs font-medium text-[#777A72] hover:text-[#252A25]"
                >
                  {isEditingAiResult ? 'Keep Original AI Output' : 'Edit Before Saving'}
                </button>

                <button
                  type="button"
                  onClick={handleSaveToInventory}
                  className="inline-flex items-center gap-2 px-7 py-3 text-xs font-semibold text-[#FFFEFA] bg-[#234D35] hover:bg-[#1a3a28] rounded-full shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save Reviewed Item to Inventory</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
