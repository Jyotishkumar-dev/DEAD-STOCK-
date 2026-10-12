import { AiInventoryAnalysis } from '../types';

export interface AnalysisInput {
  description: string;
  deviceName?: string;
  quantity?: number;
  condition?: string;
  imageBase64?: string;
  imageMimeType?: string;
}

// Client-side fallback simulation if network/server is unavailable
function fallbackClientAnalysis(input: AnalysisInput): AiInventoryAnalysis {
  const text = `${input.deviceName || ''} ${input.description}`.toLowerCase();
  
  let likelyCategory = 'Computers and office electronics';
  let standardizedName = input.deviceName || 'Generic Enterprise Hardware';
  let extractedQuantity = input.quantity || 1;
  let reportedCondition: 'Functional' | 'Minor Wear' | 'Defective' | 'Parts Only' | 'Indeterminate' = 'Minor Wear';
  let primaryPathway: 
    | 'Reuse'
    | 'Professional assessment for refurbishment'
    | 'Authorized component recovery'
    | 'Authorized recycling'
    | 'Further inspection required' = 'Professional assessment for refurbishment';
  let pathwayExplanation = '';
  const missingInformation: string[] = [];

  if (text.includes('laptop') || text.includes('notebook') || text.includes('thinkpad') || text.includes('macbook') || text.includes('latitude')) {
    likelyCategory = 'Laptops and Desktop Equipment';
    standardizedName = input.deviceName || 'Enterprise Laptop Batch';
    if (text.includes('screen cracked') || text.includes('broken')) {
      reportedCondition = 'Defective';
      primaryPathway = 'Authorized component recovery';
      pathwayExplanation = 'Broken displays or casing fractures make direct redeployment impractical, but intact logic boards, memory, and processors have immediate harvest utility.';
    } else if (text.includes('working') || text.includes('powers on') || text.includes('functional')) {
      reportedCondition = 'Functional';
      primaryPathway = 'Reuse';
      pathwayExplanation = 'Equipment demonstrates verified operational status, making it prime candidate for direct corporate redeployment or secondary market resale.';
    } else {
      reportedCondition = 'Minor Wear';
      primaryPathway = 'Professional assessment for refurbishment';
      pathwayExplanation = 'Hardware requires diagnostic bench testing, battery degradation assessment, and serialized sanitization before tier grading.';
    }
    missingInformation.push('Confirmation of storage drive wipe method (NIST 800-88 / physical removal)');
    missingInformation.push('AC power adapter bundled status and internal battery cycle count');
  } else if (text.includes('server') || text.includes('pcb') || text.includes('board') || text.includes('card') || text.includes('motherboard')) {
    likelyCategory = 'Circuit Boards and Electronic Parts';
    standardizedName = input.deviceName || 'Populated High-Density Circuit Assemblies';
    reportedCondition = 'Parts Only';
    primaryPathway = 'Authorized component recovery';
    pathwayExplanation = 'Populated boards possess high-grade discrete silicon, power controller ICs, and precious gold contact fingers best routed to micro-harvesting and metallurgical refining.';
    missingInformation.push('Confirmation of capacitor health and absence of electrolytic swelling');
    missingInformation.push('Specific bus architecture or generation identifiers (PCIe, DDR3/DDR4)');
  } else if (text.includes('cable') || text.includes('copper') || text.includes('cord') || text.includes('wire')) {
    likelyCategory = 'Cables and Electronic Accessories';
    standardizedName = input.deviceName || 'High-Purity Copper Wiring Interconnects';
    reportedCondition = 'Defective';
    primaryPathway = 'Authorized recycling';
    pathwayExplanation = 'Secondary copper and telecom interconnect harnesses are optimal for mechanical granulation, jacket stripping, and copper smelting.';
    missingInformation.push('Estimated recovery yield percentage (copper conductor vs insulation weight)');
    missingInformation.push('Verification of absence of vintage halogenated jacket formulations');
  } else if (text.includes('phone') || text.includes('tablet') || text.includes('ipad') || text.includes('android')) {
    likelyCategory = 'Mobile Devices and Components';
    standardizedName = input.deviceName || 'Fleet Mobile Devices';
    reportedCondition = 'Minor Wear';
    primaryPathway = 'Professional assessment for refurbishment';
    pathwayExplanation = 'Corporate mobile hardware holds substantial circular value provided enterprise management locks (MDM) and iCloud/Google accounts are detached.';
    missingInformation.push('Mobile Device Management (MDM) enrollment release status');
    missingInformation.push('Battery swelling or physical glass delamination inspection');
  } else {
    likelyCategory = 'Other Eligible Electronic Waste';
    standardizedName = input.deviceName || 'Unclassified Technology Resource';
    reportedCondition = 'Indeterminate';
    primaryPathway = 'Further inspection required';
    pathwayExplanation = 'Provided specifications require physical visual examination and barcode parsing to establish circular route feasibility.';
    missingInformation.push('OEM manufacturer model badge and electrical input voltage specifications');
    missingInformation.push('Hazardous battery composition identification (Li-Ion vs Sealed Lead Acid)');
  }

  missingInformation.push('Packaging and staging condition (palletized vs loose containers)');

  const allPathways = [
    {
      pathwayName: 'Reuse' as const,
      suitability: primaryPathway === 'Reuse' ? ('Recommended' as const) : ('Viable Alternative' as const),
      rationale: 'Preserves the entire embedded energy and hardware functionality with minimal reprocessing overhead.'
    },
    {
      pathwayName: 'Professional assessment for refurbishment' as const,
      suitability: primaryPathway === 'Professional assessment for refurbishment' ? ('Recommended' as const) : ('Viable Alternative' as const),
      rationale: 'Certified technicians run diagnostics, cosmetic renewal, and certified wipe verification.'
    },
    {
      pathwayName: 'Authorized component recovery' as const,
      suitability: primaryPathway === 'Authorized component recovery' ? ('Recommended' as const) : ('Viable Alternative' as const),
      rationale: 'Harvests viable micro-chips, discrete silicon, and precious metal contacts before commodity shredding.'
    },
    {
      pathwayName: 'Authorized recycling' as const,
      suitability: primaryPathway === 'Authorized recycling' ? ('Recommended' as const) : ('Not Advised' as const),
      rationale: 'Mechanical granulating and smelting separation for non-functional commodity materials.'
    },
    {
      pathwayName: 'Further inspection required' as const,
      suitability: primaryPathway === 'Further inspection required' ? ('Recommended' as const) : ('Requires Verification' as const),
      rationale: 'Necessary when dangerous battery chemistry or unknown hazardous elements are suspected.'
    }
  ];

  return {
    id: `ai-client-sim-${Date.now()}`,
    analyzedAt: new Date().toISOString(),
    isLiveAi: false,
    analysisModeLabel: 'Demo Analysis Engine (Client Fallback Mode)',
    likelyCategory,
    standardizedDeviceName: standardizedName,
    extractedQuantity,
    reportedCondition,
    confidenceIndicator: {
      level: 'Moderate',
      justification: 'Synthesized from device classification keywords and reported operational parameters.'
    },
    missingInformation,
    primaryPathway,
    pathwayExplanation,
    allPathways,
    recommendedNextSteps: [
      'Document serialized inventory and verify data wiping certificates',
      'Keep equipment enclosures intact; do not dismantle internal batteries or power supplies',
      'Publish pickup request to matched authorized recovery handlers'
    ],
    handlingNotes: 'Stage equipment in ESD-safe gaylords or stretch-wrapped pallets at warehouse dock.',
    safetyDisclaimer: 'Preliminary advisory estimate based on submitted text descriptions. A photograph or description alone cannot determine internal component safety, hidden battery degradation, or exact metallurgical content. Final verification is performed by authorized handlers.'
  };
}

export async function analyzeItemWithAi(input: AnalysisInput): Promise<{
  analysis: AiInventoryAnalysis;
  isLiveAi: boolean;
  modeLabel: string;
}> {
  try {
    const response = await fetch('/api/analyze-item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(input)
    });

    if (response.ok) {
      const data = await response.json();
      if (data.result) {
        return {
          analysis: data.result,
          isLiveAi: Boolean(data.isLiveAi),
          modeLabel: data.analysisModeLabel || (data.isLiveAi ? 'Gemini Live' : 'Demo Mode')
        };
      }
    }
  } catch (error) {
    console.warn('[RESTOCK AI] Network call to /api/analyze-item failed or offline, switching to client demo analyzer:', error);
  }

  // Graceful client-side fallback
  const fallback = fallbackClientAnalysis(input);
  return {
    analysis: fallback,
    isLiveAi: false,
    modeLabel: 'Demo AI Simulation Engine (Client Fallback)'
  };
}
