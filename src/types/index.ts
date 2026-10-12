export type RecoveryPathway = 
  | 'Refurbishment & Reuse'
  | 'Component Harvesting'
  | 'Precious Metal & Material Recovery'
  | 'Authorized Safe Recycling';

export type UserRole = 'business' | 'partner';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
  isDemo: boolean;
}

export type StandardRecoveryPathway = 
  | 'Reuse'
  | 'Professional assessment for refurbishment'
  | 'Authorized component recovery'
  | 'Authorized recycling'
  | 'Further inspection required';

export interface PathwayEvaluation {
  pathwayName: StandardRecoveryPathway;
  suitability: 'Recommended' | 'Viable Alternative' | 'Not Advised' | 'Requires Verification';
  rationale: string;
}

export interface AiInventoryAnalysis {
  id: string;
  analyzedAt: string;
  isLiveAi: boolean;
  analysisModeLabel: string;
  likelyCategory: string;
  standardizedDeviceName: string;
  extractedQuantity: number | null;
  reportedCondition: 'Functional' | 'Minor Wear' | 'Defective' | 'Parts Only' | 'Indeterminate';
  confidenceIndicator?: {
    level: 'High' | 'Moderate' | 'Preliminary';
    justification: string;
  };
  missingInformation: string[];
  primaryPathway: StandardRecoveryPathway;
  pathwayExplanation: string;
  allPathways: PathwayEvaluation[];
  recommendedNextSteps: string[];
  handlingNotes: string;
  safetyDisclaimer: string;
  userCorrectionsApplied?: boolean;
}

export interface OriginalItemSubmission {
  rawDescription: string;
  rawDeviceName?: string;
  userQuantity?: number;
  userCondition?: string;
  location?: string;
  uploadedImageUrl?: string;
  submittedAt: string;
}

export type InventoryItemStatus = 'Available' | 'Request Created' | 'Scheduled' | 'Recovered';

export interface ResourceInventoryItem {
  id: string;
  category: string;
  deviceType: string;
  quantity: number;
  estimatedWeightKg?: number;
  condition: 'Functional' | 'Minor Wear' | 'Defective' | 'Parts Only';
  location: string;
  description?: string;
  notes?: string;
  imageUrl?: string;
  preferredCollectionDate?: string;
  specialHandlingNotes?: string;
  status: InventoryItemStatus;
  addedAt: string;
  aiRecommendation?: {
    pathway: RecoveryPathway;
    handlingSummary: string;
    matchedPartners: number;
  };
  originalSubmission?: OriginalItemSubmission;
  aiAnalysis?: AiInventoryAnalysis;
}

// Phase 4: Standardized 7-stage lifecycle tracking statuses
export type RecoveryRequestStatus = 
  | 'Request Submitted'
  | 'Partner Response Pending'
  | 'Partner Accepted'
  | 'Pickup Scheduled'
  | 'Collection Completed'
  | 'Processing Pending'
  | 'Final Documentation Available'
  // Legacy aliases for backward compatibility with initial fixtures
  | 'Draft'
  | 'Submitted'
  | 'Awaiting Partner'
  | 'Collected'
  | 'Processing Confirmed'
  | 'Completed'
  | 'Cancelled';

export interface StatusHistoryEntry {
  status: RecoveryRequestStatus;
  timestamp: string;
  note: string;
}

export interface RecoveryRequest {
  id: string;
  inventoryItemId: string;
  itemTitle: string;
  category: string;
  quantity: number;
  estimatedWeightKg?: number;
  collectionLocation: string;
  preferredDate?: string;
  proposedTimeWindow?: string;
  specialNotes?: string;
  assignedPartnerId?: string;
  assignedPartnerName?: string;
  status: RecoveryRequestStatus;
  createdAt: string;
  statusHistory: StatusHistoryEntry[];
  pickupContact?: {
    name: string;
    phone: string;
  };
  partnerResponseNotes?: string;
  driverDetails?: {
    driverName: string;
    vehiclePlate: string;
    dispatchId: string;
  };
  custodyReceiptId?: string;
  certificateOfDestructionUrl?: string;
  coordinationGroupId?: string;
}

export interface CategoryItem {
  id: string;
  title: string;
  description: string;
  examples: string[];
  primaryPathway: RecoveryPathway;
  acceptedCondition: string;
  svgType: 'laptops' | 'cables' | 'mobile' | 'circuits' | 'printers' | 'misc';
}

export interface SolutionItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  audience: string;
  iconName: string;
}

export interface AiCapability {
  id: string;
  letter: string;
  title: string;
  tagline: string;
  description: string;
  sampleInput: {
    item: string;
    details: string;
    quantity: string;
    condition: string;
  };
  sampleOutput: {
    suggestedPathway: RecoveryPathway;
    confidenceLabel: string;
    potentialValueStream: string;
    handlingNote: string;
    partnerMatchReason: string;
  };
}

// Phase 4: Enriched Recovery Partner schema
export interface RecoveryPartner {
  id: string;
  name: string;
  type: string;
  serviceArea: string;
  regionsServed: string[];
  acceptedMaterials: string[];
  availableServices: string[];
  contactInfo: {
    phone: string;
    email: string;
    facilityAddress: string;
    dispatchHub?: string;
  };
  verificationStatus: 'Demo Verified' | 'Pending Audit' | 'Self-Reported Demo';
  verificationDetails: string;
  operationalNotes: string;
  minimumLot: string;
  minUnits?: number;
  minWeightKg?: number;
  logisticsSupport: string;
  verifiedBadges: string[];
  description: string;
  leadTimeDays: number;
}

// Phase 4: Matching evaluation result
export interface PartnerMatchFactor {
  factor: 'Material Compatibility' | 'Service Area Fit' | 'Quantity Threshold' | 'Logistics & Handling';
  score: number; // 0 to 100
  status: 'Matched' | 'Partial' | 'Incompatible';
  details: string;
}

export interface PartnerMatchResult {
  partner: RecoveryPartner;
  matchScore: number; // 0 to 100
  isRecommended: boolean;
  factors: PartnerMatchFactor[];
  summaryWhy: string;
}

// Phase 4: Pickup Coordination & Grouped compatible requests
export interface PickupCoordinationGroup {
  id: string;
  groupTitle: string;
  zone: string;
  suggestedDate: string;
  carrierPartnerName: string;
  requests: RecoveryRequest[];
  totalUnits: number;
  totalWeightKg: number;
  compatibilityRationale: {
    locationProximity: string;
    timingAlignment: string;
    materialCompatibility: string;
  };
  logisticsEfficiency: {
    freightTripsSaved: number;
    estimatedCo2ReductionKg: number;
    ruleDescription: string;
  };
  status: 'Suggested Coordination' | 'Consolidated Dispatch';
}

export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  tagline: string;
  scope: string;
  description: string;
  recoveryPathway: string;
  impactMetrics: {
    label: string;
    value: string;
  }[];
}
