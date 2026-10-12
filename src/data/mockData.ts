import { CategoryItem, SolutionItem, AiCapability, RecoveryPartner, CaseStudy, ResourceInventoryItem } from '../types';

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'laptops-desktops',
    title: 'Laptops and Desktop Equipment',
    description: 'Workstations, business laptops, micro-desktops, displays, docking hubs, and associated power supplies.',
    examples: ['Enterprise Laptops', 'Tower PCs', 'All-in-One Monitors', 'Server Blades', 'Power Bricks'],
    primaryPathway: 'Refurbishment & Reuse',
    acceptedCondition: 'Functional, cosmetic wear, or de-inventoried units with erased drives',
    svgType: 'laptops'
  },
  {
    id: 'cables-accessories',
    title: 'Cables and Electronic Accessories',
    description: 'High-purity copper cabling, network interconnects, bulk power cords, adapters, and peripheral harnesses.',
    examples: ['Cat6/Fiber Cables', 'AC Power Harnesses', 'Docking Cords', 'Surge Strips', 'Dongles'],
    primaryPathway: 'Precious Metal & Material Recovery',
    acceptedCondition: 'Tangled, sheared, obsolete, or bundled wiring lots',
    svgType: 'cables'
  },
  {
    id: 'mobile-devices',
    title: 'Mobile Devices and Components',
    description: 'Corporate smartphones, rugged barcode scanners, warehouse handhelds, tablets, and display assemblies.',
    examples: ['Enterprise Tablets', 'Fleet Handhelds', 'Corporate Phones', 'Display Assemblies', 'Digitizers'],
    primaryPathway: 'Refurbishment & Reuse',
    acceptedCondition: 'Locked, cracked screen, or decommissioned fleet inventory',
    svgType: 'mobile'
  },
  {
    id: 'circuit-boards',
    title: 'Circuit Boards and Electronic Parts',
    description: 'Populated PCBs, telecom line cards, daughterboards, memory modules (RAM), GPUs, and power controllers.',
    examples: ['Telecom Line Cards', 'Server Motherboards', 'RAM Modules', 'PCIe Cards', 'DC Regulators'],
    primaryPathway: 'Component Harvesting',
    acceptedCondition: 'Depleted boards, unsold surplus stock, and de-soldered assemblies',
    svgType: 'circuits'
  },
  {
    id: 'printers-office',
    title: 'Printers and Office Electronics',
    description: 'Departmental laser copiers, thermal labelers, VOIP desktop sets, conference audio bars, and network switches.',
    examples: ['Laser Copiers', 'Desktop VOIP Phones', 'Thermal Label Printers', 'Managed Switches', 'Audio Bars'],
    primaryPathway: 'Authorized Safe Recycling',
    acceptedCondition: 'End-of-lease units, mechanical jams, and decommissioned telecom',
    svgType: 'printers'
  },
  {
    id: 'other-e-waste',
    title: 'Other Eligible Electronic Waste',
    description: 'Uninterruptible power supplies (UPS without loose lead acid), testing meters, sensor clusters, and lab controls.',
    examples: ['Rackmount UPS Casings', 'Multimeters & Scopes', 'HVAC Controllers', 'POS Terminals', 'Sensor Hubs'],
    primaryPathway: 'Authorized Safe Recycling',
    acceptedCondition: 'Factory surplus, lab test benches, and consolidated batch lots',
    svgType: 'misc'
  }
];

export const SOLUTIONS: SolutionItem[] = [
  {
    id: 'businesses-offices',
    title: 'Businesses and Offices',
    subtitle: 'Streamlined IT asset retirement',
    description: 'Manage obsolete electronics, organize inventory, and simplify responsible disposal without taking up valuable storage room.',
    highlights: [
      'Digital ledger for retired laptops, monitors, and server racks',
      'Data sanitization readiness checklist before handoff',
      'Direct matchmaking with verified electronics recovery specialists'
    ],
    audience: 'Corporate IT, Facilities Directors, Operations Leads',
    iconName: 'Building2'
  },
  {
    id: 'educational-institutions',
    title: 'Educational Institutions',
    subtitle: 'Campus tech consolidation',
    description: 'Track unused equipment across departments and coordinate recovery for eligible electronic resources cleanly and affordably.',
    highlights: [
      'Multi-department inventory aggregation for bulk pickups',
      'Prioritization for refurbishers serving digital-divide initiatives',
      'Simplified audit-ready documentation for institutional compliance'
    ],
    audience: 'University Tech Labs, School District IT, Research Depots',
    iconName: 'GraduationCap'
  },
  {
    id: 'repair-refurbishers',
    title: 'Repair and Refurbishment Businesses',
    subtitle: 'Harvesting & component rescue',
    description: 'Organize reusable components and identify appropriate recovery or refurbishment opportunities for working subassemblies.',
    highlights: [
      'Source candidate devices with viable screens, processors, and boards',
      'Filter batches by specific chipsets, modular parts, and generations',
      'Re-route non-repairable remnants to authorized material shredders'
    ],
    audience: 'Refurbishment Centers, Hardware Technicians, Circular Shops',
    iconName: 'Wrench'
  },
  {
    id: 'authorized-partners',
    title: 'Authorized Recovery Partners',
    subtitle: 'Qualified intake & route coordination',
    description: 'Discover available recovery requests, review material details, and coordinate potential collections with pre-screened generators.',
    highlights: [
      'Access pre-cataloged batches with estimated quantities and photos',
      'Set service radius and preferred material intake streams',
      'Consolidate regional pickups to lower transport costs and emissions'
    ],
    audience: 'Licensed ITAD Vendors, E-Scrap Processors, Smelting Depots',
    iconName: 'ShieldCheck'
  }
];

export const AI_CAPABILITIES: AiCapability[] = [
  {
    id: 'smart-inventory',
    letter: 'A',
    title: 'Smart Inventory Classification',
    tagline: 'From unorganized piles to structured catalog records',
    description: 'Organize submitted items by device type, quantity, condition, and material category automatically from equipment descriptions and basic inputs.',
    sampleInput: {
      item: '45 mixed Dell & Lenovo laptops from 2019-2021',
      details: 'All have Intel i5/i7 stickers, 35 power adapters, removed hard drives',
      quantity: '45 units',
      condition: 'Power on tested, good chassis, no storage media'
    },
    sampleOutput: {
      suggestedPathway: 'Refurbishment & Reuse',
      confidenceLabel: 'High Refurbishment Viability',
      potentialValueStream: 'High secondary market utility via memory/chassis preservation',
      handlingNote: 'Maintain units in protective gaylord or padded crates to prevent chassis denting',
      partnerMatchReason: 'Matches ITAD refurbishers accepting drive-less enterprise laptops'
    }
  },
  {
    id: 'recovery-recommendations',
    letter: 'B',
    title: 'Recovery Recommendations',
    tagline: 'Guidance tailored to circular economic hierarchy',
    description: 'Suggest possible reuse, refurbishment, component recovery, or authorized recycling pathways based on available item specifications and market utility.',
    sampleInput: {
      item: 'Pallet of obsolete telecom rack cards and power units',
      details: '2008 era equipment, high density gold-plated contact fingers',
      quantity: '1 pallet (~380 kg)',
      condition: 'Decommissioned, non-functional for modern networks'
    },
    sampleOutput: {
      suggestedPathway: 'Component Harvesting',
      confidenceLabel: 'Material Refining Candidate',
      potentialValueStream: 'High precious metal contact yield (Gold / Copper / Palladium traces)',
      handlingNote: 'Route directly to metallurgical refiner rather than mechanical shredder',
      partnerMatchReason: 'Matches authorized circuit smelters with chemical assay verification'
    }
  },
  {
    id: 'partner-matching',
    letter: 'C',
    title: 'Partner Matching',
    tagline: 'Connect with handlers equipped for your specific stream',
    description: 'Recommend potentially suitable partners using material acceptance criteria, service area radius, minimum lot sizes, and operational capabilities.',
    sampleInput: {
      item: '180 assorted LCD & LED monitors, 22-27 inch',
      details: 'Working backlights, bundled with stand arms and power cords',
      quantity: '180 units',
      condition: 'Functional display, corporate refresh surplus'
    },
    sampleOutput: {
      suggestedPathway: 'Refurbishment & Reuse',
      confidenceLabel: 'Optimal Match Found',
      potentialValueStream: 'Eligible for community redeployment or educational refurbishment',
      handlingNote: 'Panels must be face-to-face stacked with foam separators',
      partnerMatchReason: 'Found 3 certified regional refurbishers within 35 miles accepting lots >50 units'
    }
  },
  {
    id: 'pickup-coordination',
    letter: 'D',
    title: 'Pickup Coordination',
    tagline: 'Intelligent logistics & route consolidation',
    description: 'Help organize collection requests and identify opportunities to combine compatible nearby pickups to minimize transit footprint and logistics overhead.',
    sampleInput: {
      item: '2 gaylord bins of unsorted peripheral cords & copper wiring',
      details: 'Mixed IEC power cords, copper patch cables, stripped adapters',
      quantity: 'Approx. 520 kg',
      condition: 'Tangled surplus scrap'
    },
    sampleOutput: {
      suggestedPathway: 'Precious Metal & Material Recovery',
      confidenceLabel: 'Route Bundling Recommended',
      potentialValueStream: 'Secondary copper smelting & polymer insulation separation',
      handlingNote: 'Ready for standard pallet jack collection at loading dock',
      partnerMatchReason: 'Consolidatable with an adjacent industrial pickup scheduled in zip code sector 94107'
    }
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'case-1',
    title: 'Office Equipment Recovery',
    subtitle: 'Financial District Corporate Refresh',
    category: 'Commercial Enterprise Use Case',
    tagline: '140 decommissioned workstations routed away from shredding',
    scope: '140 Laptops & 70 Monitors · 1.8 Tons E-Material',
    description: 'A growing fintech firm relocated offices and cataloged obsolete 8th-generation workstations through RESTOCK AI. The system recommended splitting the lot: 110 units met certified refurbishment specs, while damaged units were routed to local harvested-parts technicians.',
    recoveryPathway: 'Refurbishment & Parts Harvest',
    impactMetrics: [
      { label: 'Units Preserved for Reuse', value: '78%' },
      { label: 'Turnaround to Partner Intake', value: '4 Business Days' },
      { label: 'Documentation Generated', value: 'Chain of Custody & Wipe Proof' }
    ]
  },
  {
    id: 'case-2',
    title: 'Campus Electronics Collection',
    subtitle: 'State University Science & Engineering Depot',
    category: 'Educational Institution Use Case',
    tagline: 'Coordinating multi-lab legacy hardware into unified pickup',
    scope: '5 Departments · 320 Devices · 4.2 Tons Total',
    description: 'Five separate biology and robotics research labs had accumulated obsolete sensor boxes, CRT-era scopes, and spare wiring across storage cages. RESTOCK AI consolidated the listings into a single scheduled lot with an authorized regional e-scrap consolidator.',
    recoveryPathway: 'Material Refining & Education Reuse',
    impactMetrics: [
      { label: 'Labs Cleared Simultaneously', value: '5 Depots' },
      { label: 'Logistics Trips Combined', value: '1 Consolidated Haul' },
      { label: 'Disposal Cost Saved', value: '100% Zero Landfill Fee' }
    ]
  },
  {
    id: 'case-3',
    title: 'Electronic Components Reuse',
    subtitle: 'Regional Hardware Repair Cooperative',
    category: 'Circular Repair Network Use Case',
    tagline: 'Matching discarded motherboards with micro-soldering specialists',
    scope: '450 High-Grade Server Blades & Memory Chips',
    description: 'A municipal data center upgrade yielded legacy server cards that would typically be granulated. Through RESTOCK AI partner matching, a cooperative of independent motherboard repair technicians claimed the lot to harvest rare power ICs and RAM modules.',
    recoveryPathway: 'Component Harvesting & Micro-Repair',
    impactMetrics: [
      { label: 'Working Micro-ICs Salvaged', value: '1,200+ Chips' },
      { label: 'Downstream Shred Reduction', value: '62% by Weight' },
      { label: 'Circular Value Re-injected', value: 'High Repair ROI' }
    ]
  }
];

export const SAMPLE_PARTNERS: RecoveryPartner[] = [
  {
    id: 'p-1',
    name: 'Veritas Eco-Tech ITAD',
    type: 'Certified IT Asset Disposition & Refurbisher',
    serviceArea: 'West Coast / Pacific Northwest',
    regionsServed: ['Pacific Northwest', 'Northern California', 'Seattle Metro', 'San Francisco Bay Area'],
    acceptedMaterials: ['Laptops and Desktops', 'Mobile Devices', 'Server Racks', 'Enterprise Monitors'],
    availableServices: [
      'On-site serialized asset inventory',
      'NIST 800-88 compliant data wiping',
      'Refurbishment & resale sharing',
      'Lift-gate truck scheduled pickup'
    ],
    contactInfo: {
      phone: '+1 (555) 382-9011',
      email: 'intake@veritasecotech-demo.org',
      facilityAddress: '4820 Harbor Boulevard, Industrial Park 4, Seattle, WA',
      dispatchHub: 'Regional Terminal B-9'
    },
    verificationStatus: 'Demo Verified',
    verificationDetails: 'Demo Record: Evaluated for hardware testing protocols and data erasure standards (simulated prototype status).',
    operationalNotes: 'Dock height access preferred; gaylords supplied on arrival. Hard drive serials recorded before transport.',
    minimumLot: '15 units or 1 pallet (~30 kg)',
    minUnits: 15,
    minWeightKg: 30,
    logisticsSupport: 'Dock pickup, lift-gate trucks, secure serialized bins',
    verifiedBadges: ['Data Wipe Capable', 'Prototype Verified', 'On-Site Inventory Tagging'],
    description: 'Specializes in high-grade corporate IT asset recovery, component diagnostics, and compliant data sanitization for working corporate electronics.',
    leadTimeDays: 2
  },
  {
    id: 'p-2',
    name: 'Sylvan Circuit & Precious Smelting',
    type: 'Authorized Metallurgical & PCB Refining Depot',
    serviceArea: 'National Logistics Network',
    regionsServed: ['National', 'West Coast', 'Midwest', 'East Coast'],
    acceptedMaterials: ['Circuit Boards and Parts', 'Cables and Accessories', 'Telecom Line Cards'],
    availableServices: [
      'High-yield precious metal assaying (Au, Ag, Cu, Pd)',
      'Bulk copper cable granulated stripping',
      'Thermal processing & hydrometallurgy',
      'Zero-landfill destruction certificate'
    ],
    contactInfo: {
      phone: '+1 (555) 749-2180',
      email: 'logistics@sylvancircuit-demo.com',
      facilityAddress: '1290 Smelting Way, Logistics Zone East, Sparks, NV',
      dispatchHub: 'Intermodal Freight Dock 12'
    },
    verificationStatus: 'Demo Verified',
    verificationDetails: 'Demo Record: Compliant with safe metals handling standards (simulated prototype status).',
    operationalNotes: 'Batteries must be completely disconnected and segregated in fire-rated drums prior to carrier arrival.',
    minimumLot: '100 kg net weight',
    minUnits: 10,
    minWeightKg: 100,
    logisticsSupport: 'Freight pallet dispatch, gaylord container drop-off',
    verifiedBadges: ['Thermal Processing Compliant', 'Zero Landfill Mandate', 'Assay Certificate Provided'],
    description: 'Downstream refinery extracting copper, silver, and gold from obsolete telecommunications hardware, raw PCBs, and bulk wiring harnesses.',
    leadTimeDays: 4
  },
  {
    id: 'p-3',
    name: 'Helix Circular Component Exchange',
    type: 'Independent Repair Collective & Parts Harvester',
    serviceArea: 'Tri-State & Regional Hubs',
    regionsServed: ['San Francisco Bay Area', 'Silicon Valley', 'Oakland Metro', 'San Jose'],
    acceptedMaterials: ['Laptops and Desktops', 'Circuit Boards and Parts', 'Mobile Devices'],
    availableServices: [
      'Micro-soldering salvage of rare ICs',
      'Testing & matching of memory modules',
      'Educational STEM lab donation',
      'Courier drop-box collection'
    ],
    contactInfo: {
      phone: '+1 (555) 891-4432',
      email: 'salvage@helixcircular-demo.net',
      facilityAddress: '710 Innovation Loop, Suite 102, Oakland, CA',
      dispatchHub: 'Oakland East Bay Depot'
    },
    verificationStatus: 'Demo Verified',
    verificationDetails: 'Demo Record: Non-profit electronics repair cooperative partnership (simulated prototype status).',
    operationalNotes: 'Accepts partial non-working lots down to 5 pieces for board level diagnosis.',
    minimumLot: '5 units (Low minimum for rare components)',
    minUnits: 5,
    minWeightKg: 5,
    logisticsSupport: 'Courier pickup or secure parcel shipping kit',
    verifiedBadges: ['Hardware Level Diagnostics', 'Component Level Testing', 'School Tech Donation Partner'],
    description: 'Repurposes functional silicon, discrete capacitors, LCD panels, and power circuits for independent electronics repairers and STEM education labs.',
    leadTimeDays: 1
  },
  {
    id: 'p-4',
    name: 'TerraCycle E-Logistics & Safe Scrap',
    type: 'Universal E-Waste Aggregator & Materials Handler',
    serviceArea: 'Midwest & Great Lakes',
    regionsServed: ['Midwest', 'Great Lakes', 'Chicago Metro', 'Minneapolis'],
    acceptedMaterials: ['Printers and Office Electronics', 'Other Eligible E-Waste', 'Cables and Accessories'],
    availableServices: [
      'Universal office electronics recycling',
      'Heavy printer & photocopier dismantling',
      'Consolidated milk-run logistics',
      'Recycling compliance manifest generation'
    ],
    contactInfo: {
      phone: '+1 (555) 624-7800',
      email: 'dispatch@terracycle-demo.org',
      facilityAddress: '3100 Industrial Parkway, Chicago, IL',
      dispatchHub: 'Midwest Intermodal Yard 4'
    },
    verificationStatus: 'Pending Audit',
    verificationDetails: 'Demo Record: Audit pending for downstream shred separation standards (simulated prototype status).',
    operationalNotes: 'Heavy equipment over 50kg requires ground-floor or freight elevator loading dock.',
    minimumLot: '50 kg or 1 standard gaylord',
    minUnits: 2,
    minWeightKg: 50,
    logisticsSupport: 'Regular milk-run route consolidation, flatbed pickup',
    verifiedBadges: ['State Permitted', 'Full Manifest Records'],
    description: 'Large-scale collection hub handling office equipment, broken copiers, mixed adapters, and departmental office electronic cleanouts.',
    leadTimeDays: 3
  }
];

export const INITIAL_INVENTORY: ResourceInventoryItem[] = [
  {
    id: 'inv-101',
    category: 'Laptops and Desktop Equipment',
    deviceType: 'Dell Latitude 7490 Laptops (Core i5, 16GB)',
    quantity: 32,
    estimatedWeightKg: 48,
    condition: 'Functional',
    location: 'Building B - Tech Storage 2',
    description: 'Corporate refresh units, batteries intact, chargers bundled.',
    preferredCollectionDate: '2026-10-20',
    specialHandlingNotes: 'Hard drives removed in accordance with corporate data protocol.',
    status: 'Scheduled',
    addedAt: '2 days ago',
    aiRecommendation: {
      pathway: 'Refurbishment & Reuse',
      handlingSummary: 'Ideal for certified ITAD refurbisher; high memory and panel utility.',
      matchedPartners: 4
    }
  },
  {
    id: 'inv-102',
    category: 'Circuit Boards and Electronic Parts',
    deviceType: 'High-Density Server Motherboards & Line Cards',
    quantity: 65,
    estimatedWeightKg: 85,
    condition: 'Parts Only',
    location: 'Warehouse Dock Bay 1',
    description: 'Legacy 1U server boards, no CPU installed, populated PCIe and gold fingers intact.',
    preferredCollectionDate: '2026-10-24',
    specialHandlingNotes: 'Packaged in anti-static foam lined boxes.',
    status: 'Request Created',
    addedAt: '4 days ago',
    aiRecommendation: {
      pathway: 'Component Harvesting',
      handlingSummary: 'Recommended for metallurgical extraction of high-purity contact gold.',
      matchedPartners: 3
    }
  },
  {
    id: 'inv-103',
    category: 'Cables and Electronic Accessories',
    deviceType: 'Mixed Copper Patch & IEC Power Cables',
    quantity: 180,
    estimatedWeightKg: 140,
    condition: 'Defective',
    location: 'Facilities Basement Locker',
    description: 'Decommissioned server room wiring bundle, coiled and stripped.',
    preferredCollectionDate: '2026-10-28',
    specialHandlingNotes: 'Palletized with stretch wrap for forklift loading.',
    status: 'Available',
    addedAt: '1 week ago',
    aiRecommendation: {
      pathway: 'Precious Metal & Material Recovery',
      handlingSummary: 'Consolidate for scheduled milk-run pickup with regional copper processor.',
      matchedPartners: 2
    }
  },
  {
    id: 'inv-104',
    category: 'Printers and Office Electronics',
    deviceType: 'HP LaserJet Enterprise Flow MFP Copiers',
    quantity: 4,
    estimatedWeightKg: 210,
    condition: 'Minor Wear',
    location: 'Finance Floor 3 Copy Room',
    description: 'End-of-lease multi-function copiers, toner cartridges removed.',
    preferredCollectionDate: '2026-11-02',
    specialHandlingNotes: 'Requires elevator / pallet jack transport; heavy units.',
    status: 'Available',
    addedAt: 'Just now',
    aiRecommendation: {
      pathway: 'Authorized Safe Recycling',
      handlingSummary: 'Direct intake for mechanical dismantling and authorized shredding.',
      matchedPartners: 3
    }
  }
];

export const INITIAL_REQUESTS: import('../types').RecoveryRequest[] = [
  {
    id: 'REQ-2026-0814',
    inventoryItemId: 'inv-101',
    itemTitle: 'Dell Latitude 7490 Laptops (Core i5, 16GB)',
    category: 'Laptops and Desktop Equipment',
    quantity: 32,
    estimatedWeightKg: 48,
    collectionLocation: 'Building B - Tech Storage 2, Dock 4',
    preferredDate: '2026-10-20',
    proposedTimeWindow: '09:00 - 12:00 Local',
    specialNotes: 'Dock height access available; security clearance provided.',
    assignedPartnerId: 'p-1',
    assignedPartnerName: 'Veritas Eco-Tech ITAD',
    status: 'Pickup Scheduled',
    createdAt: '2026-10-10',
    driverDetails: {
      driverName: 'Marcus Vance',
      vehiclePlate: 'WA-792-ECO',
      dispatchId: 'DSP-9921'
    },
    pickupContact: {
      name: 'Sarah Jenkins',
      phone: '+1 (555) 234-8901'
    },
    statusHistory: [
      { status: 'Request Submitted', timestamp: '2026-10-09 11:15', note: 'Request submitted with preferred window' },
      { status: 'Partner Response Pending', timestamp: '2026-10-09 12:00', note: 'Transmitted to Veritas Eco-Tech ITAD dispatch queue' },
      { status: 'Partner Accepted', timestamp: '2026-10-10 14:20', note: 'Partner accepted lot intake for refurbishment stream' },
      { status: 'Pickup Scheduled', timestamp: '2026-10-10 16:45', note: 'Confirmed vehicle dispatch: Lift-gate truck DSP-9921 for Oct 20' }
    ]
  },
  {
    id: 'REQ-2026-0792',
    inventoryItemId: 'inv-102',
    itemTitle: 'High-Density Server Motherboards & Line Cards',
    category: 'Circuit Boards and Electronic Parts',
    quantity: 65,
    estimatedWeightKg: 85,
    collectionLocation: 'Warehouse Dock Bay 1',
    preferredDate: '2026-10-24',
    proposedTimeWindow: '13:00 - 16:00 Local',
    specialNotes: 'Assay receipt requested upon metallurgical intake.',
    assignedPartnerId: 'p-2',
    assignedPartnerName: 'Sylvan Circuit & Precious Smelting',
    status: 'Partner Response Pending',
    createdAt: '2026-10-11',
    pickupContact: {
      name: 'David Chen',
      phone: '+1 (555) 345-6789'
    },
    statusHistory: [
      { status: 'Request Submitted', timestamp: '2026-10-11 10:00', note: 'Submitted for metallurgical refining intake' },
      { status: 'Partner Response Pending', timestamp: '2026-10-11 10:30', note: 'Awaiting partner capacity check and freight availability' }
    ]
  },
  {
    id: 'REQ-2026-0650',
    inventoryItemId: 'inv-100',
    itemTitle: 'Obsolete Telecom Switch Blades & Wiring',
    category: 'Circuit Boards and Electronic Parts',
    quantity: 40,
    estimatedWeightKg: 120,
    collectionLocation: 'Central Data Hub South',
    preferredDate: '2026-09-28',
    proposedTimeWindow: '10:00 - 13:00 Local',
    specialNotes: 'Full destruction manifest received.',
    assignedPartnerId: 'p-2',
    assignedPartnerName: 'Sylvan Circuit & Precious Smelting',
    status: 'Final Documentation Available',
    createdAt: '2026-09-20',
    custodyReceiptId: 'eBOL-2026-9881',
    certificateOfDestructionUrl: '#cert-doc-2026-650',
    driverDetails: {
      driverName: 'Robert Lang',
      vehiclePlate: 'NV-441-MET',
      dispatchId: 'DSP-8812'
    },
    statusHistory: [
      { status: 'Request Submitted', timestamp: '2026-09-20 08:00', note: 'Request posted for authorized partner' },
      { status: 'Partner Accepted', timestamp: '2026-09-21 11:00', note: 'Sylvan accepted high-grade PCB lot' },
      { status: 'Pickup Scheduled', timestamp: '2026-09-22 14:00', note: 'Pickup scheduled for Sept 28' },
      { status: 'Collection Completed', timestamp: '2026-09-28 11:30', note: 'Custody transferred via signed e-BOL #9881' },
      { status: 'Processing Pending', timestamp: '2026-10-01 09:00', note: 'Lot staged for thermal separation at smelting depot' },
      { status: 'Final Documentation Available', timestamp: '2026-10-04 10:15', note: 'Issued Certificate of Destruction & Refining Report' }
    ]
  }
];

