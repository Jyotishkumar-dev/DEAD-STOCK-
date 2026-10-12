import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { optionalAuth, requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { 
  getDbInventory, 
  upsertDbInventoryItem, 
  deleteDbInventoryItem, 
  getDbRecoveryRequests, 
  upsertDbRecoveryRequest, 
  getDbPartners, 
  upsertDbPartner, 
  seedInitialDataIfEmpty 
} from './src/db/repository.ts';
import { getOrCreateUser } from './src/db/users.ts';
import { SAMPLE_PARTNERS, INITIAL_INVENTORY, INITIAL_REQUESTS } from './src/data/mockData.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '25mb' }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
    console.log('[RESTOCK AI Server] Gemini client initialized with server-side credentials.');
  } catch (err) {
    console.warn('[RESTOCK AI Server] Error instantiating GoogleGenAI:', err);
  }
} else {
  console.log('[RESTOCK AI Server] Running in Demo mode: GEMINI_API_KEY not provided.');
}

// Fallback intelligent simulation generator when key is unavailable or error occurs
function generateDemoAnalysis(description: string, deviceName?: string, userQuantity?: number, userCondition?: string) {
  const text = `${deviceName || ''} ${description}`.toLowerCase();
  
  let likelyCategory = 'Computers and office electronics';
  let standardizedName = deviceName || 'Generic Electronic Equipment';
  let extractedQuantity = userQuantity || 1;
  let reportedCondition: 'Functional' | 'Minor Wear' | 'Defective' | 'Parts Only' | 'Indeterminate' = 'Minor Wear';
  let primaryPathway: 
    | 'Reuse'
    | 'Professional assessment for refurbishment'
    | 'Authorized component recovery'
    | 'Authorized recycling'
    | 'Further inspection required' = 'Professional assessment for refurbishment';
  
  let pathwayExplanation = '';
  const missingInformation: string[] = [];

  // Categorization heuristics
  if (text.includes('laptop') || text.includes('notebook') || text.includes('thinkpad') || text.includes('macbook') || text.includes('latitude')) {
    likelyCategory = 'Laptops and Desktop Equipment';
    standardizedName = deviceName || 'Enterprise Laptop Batch';
    if (text.includes('screen cracked') || text.includes('broken')) {
      reportedCondition = 'Defective';
      primaryPathway = 'Authorized component recovery';
      pathwayExplanation = 'Chassis damage or display failure makes whole-device reuse uneconomical, but memory, storage, and motherboards are salvageable by certified technicians.';
    } else if (text.includes('works') || text.includes('working') || text.includes('power on')) {
      reportedCondition = 'Functional';
      primaryPathway = 'Reuse';
      pathwayExplanation = 'Device displays indications of functioning hardware suitable for direct corporate redeployment or secondary market reuse following certified data wiping.';
    } else {
      reportedCondition = 'Minor Wear';
      primaryPathway = 'Professional assessment for refurbishment';
      pathwayExplanation = 'Device requires diagnostic bench testing, battery cycle check, and serialized data sanitization before determining final refurbish tier.';
    }
    missingInformation.push('Confirmation of storage drive wipe or physical drive removal status');
    missingInformation.push('OEM AC power adapter presence and battery cycle health count');
  } else if (text.includes('server') || text.includes('motherboard') || text.includes('pcb') || text.includes('board') || text.includes('card')) {
    likelyCategory = 'Circuit Boards and Electronic Parts';
    standardizedName = deviceName || 'High-Density Printed Circuit Assemblies';
    reportedCondition = 'Parts Only';
    primaryPathway = 'Authorized component recovery';
    pathwayExplanation = 'Populated circuit boards carry high-value discrete components (PMICs, RAM, connectors) and gold contact traces best processed through selective harvesting and refining.';
    missingInformation.push('Verification of capacitor integrity and absence of hazardous electrolyte leakage');
    missingInformation.push('Specification of specific chipsets or board generation numbers');
  } else if (text.includes('cable') || text.includes('wire') || text.includes('copper') || text.includes('cord')) {
    likelyCategory = 'Cables and Electronic Accessories';
    standardizedName = deviceName || 'Assorted Copper Interconnect Cables';
    reportedCondition = 'Defective';
    primaryPathway = 'Authorized recycling';
    pathwayExplanation = 'High-purity copper and aluminum conductor wiring lots are ideal for granulation and polymer separation at licensed metal recovery facilities.';
    missingInformation.push('Approximate percentage of copper content vs insulated jacket weight');
    missingInformation.push('Presence of legacy toxic lead stabilizers in vintage PVC jackets');
  } else if (text.includes('phone') || text.includes('tablet') || text.includes('ipad') || text.includes('iphone') || text.includes('galaxy')) {
    likelyCategory = 'Mobile Devices and Components';
    standardizedName = deviceName || 'Fleet Mobile Handhelds';
    reportedCondition = 'Minor Wear';
    primaryPathway = 'Professional assessment for refurbishment';
    pathwayExplanation = 'Mobile equipment retains high reuse value if activation locks are removed and batteries meet minimum threshold capacity.';
    missingInformation.push('Cloud/MDM lock status (iCloud / Android Enterprise Enrollment)');
    missingInformation.push('Battery swelling or screen digitizer responsiveness check');
  } else {
    likelyCategory = 'Other Eligible Electronic Waste';
    standardizedName = deviceName || 'Unclassified Electronic Equipment Lot';
    reportedCondition = 'Indeterminate';
    primaryPathway = 'Further inspection required';
    pathwayExplanation = 'Provided specifications require physical visual examination and barcode identification to determine circular pathway suitability.';
    missingInformation.push('Manufacturer model number and electrical ratings label');
    missingInformation.push('Internal battery presence (Li-Ion vs Sealed Lead Acid)');
  }

  missingInformation.push('Exact facility dock access and loading requirements');

  const allPathways = [
    {
      pathwayName: 'Reuse' as const,
      suitability: primaryPathway === 'Reuse' ? ('Recommended' as const) : ('Viable Alternative' as const),
      rationale: 'Preserves the entire embedded energy and hardware functionality with minimal reprocessing.'
    },
    {
      pathwayName: 'Professional assessment for refurbishment' as const,
      suitability: primaryPathway === 'Professional assessment for refurbishment' ? ('Recommended' as const) : ('Viable Alternative' as const),
      rationale: 'Certified technicians run diagnostics, cosmetic renewal, and compliant wipe certification.'
    },
    {
      pathwayName: 'Authorized component recovery' as const,
      suitability: primaryPathway === 'Authorized component recovery' ? ('Recommended' as const) : ('Viable Alternative' as const),
      rationale: 'Harvests micro-chips, discrete silicon, and precious metal contacts before shredding.'
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
    id: `ai-sim-${Date.now()}`,
    analyzedAt: new Date().toISOString(),
    isLiveAi: false,
    analysisModeLabel: 'Demo AI Simulation Engine (Local Prototype Mode)',
    likelyCategory,
    standardizedDeviceName: standardizedName,
    extractedQuantity,
    reportedCondition,
    confidenceIndicator: {
      level: 'Moderate' as const,
      justification: 'Synthesized based on equipment nomenclature and reported operational condition keywords.'
    },
    missingInformation,
    primaryPathway,
    pathwayExplanation,
    allPathways,
    recommendedNextSteps: [
      'Confirm data sanitization and log serial numbers on the digital manifest',
      'Keep equipment in factory casing; do not open internal batteries or power supplies',
      'Submit request to connect with authorized recovery partners'
    ],
    handlingNotes: 'Store in moisture-controlled area on wooden pallets or ESD-safe crates prior to intake dispatch.',
    safetyDisclaimer: 'Preliminary advisory estimate based on submitted text descriptions. A photograph or description alone cannot determine internal component safety, hidden battery degradation, or exact metallurgical content. Final verification is performed by authorized handlers.'
  };
}

// ============================================================================
// DATABASE-BACKED API ENDPOINTS (PostgreSQL via Cloud SQL)
// ============================================================================

// 1. User Synchronization endpoint
app.post('/api/auth/sync-user', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { uid, email, name, role, organization, isDemo } = req.body;
    const effectiveUid = uid || req.user?.uid || `demo-user-${Date.now()}`;
    const effectiveEmail = email || req.user?.email || 'demo@restock.eco';

    const syncedUser = await getOrCreateUser(
      effectiveUid,
      effectiveEmail,
      name,
      role || 'business',
      organization,
      isDemo ?? false
    );

    res.json({ success: true, user: syncedUser });
  } catch (error: any) {
    console.error('[API] /api/auth/sync-user error:', error);
    res.status(500).json({ error: error.message || 'Failed to sync user' });
  }
});

// 2. Inventory Endpoints
app.get('/api/inventory', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const items = await getDbInventory();
    res.json(items);
  } catch (error: any) {
    console.error('[API] GET /api/inventory error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch inventory' });
  }
});

app.post('/api/inventory', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const item = req.body;
    if (!item.id || !item.category || !item.deviceType) {
      return res.status(400).json({ error: 'Missing required inventory item attributes' });
    }

    const userUid = req.user?.uid || 'demo-user-1';
    const saved = await upsertDbInventoryItem(item, userUid);
    res.json({ success: true, item: saved });
  } catch (error: any) {
    console.error('[API] POST /api/inventory error:', error);
    res.status(500).json({ error: error.message || 'Failed to save inventory item' });
  }
});

app.delete('/api/inventory/:id', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    await deleteDbInventoryItem(id);
    res.json({ success: true, id });
  } catch (error: any) {
    console.error('[API] DELETE /api/inventory/:id error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete inventory item' });
  }
});

// 3. Recovery Requests Endpoints
app.get('/api/requests', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const requests = await getDbRecoveryRequests();
    res.json(requests);
  } catch (error: any) {
    console.error('[API] GET /api/requests error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch recovery requests' });
  }
});

app.post('/api/requests', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const requestData = req.body;
    if (!requestData.id || !requestData.inventoryItemId) {
      return res.status(400).json({ error: 'Missing required request attributes' });
    }

    const userUid = req.user?.uid || 'demo-user-1';
    const saved = await upsertDbRecoveryRequest(requestData, userUid);
    res.json({ success: true, request: saved });
  } catch (error: any) {
    console.error('[API] POST /api/requests error:', error);
    res.status(500).json({ error: error.message || 'Failed to create recovery request' });
  }
});

app.put('/api/requests/:id', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const requestData = { ...req.body, id };
    const userUid = req.user?.uid || 'demo-user-1';
    const updated = await upsertDbRecoveryRequest(requestData, userUid);
    res.json({ success: true, request: updated });
  } catch (error: any) {
    console.error('[API] PUT /api/requests/:id error:', error);
    res.status(500).json({ error: error.message || 'Failed to update recovery request' });
  }
});

// 4. Recovery Partners Endpoints
app.get('/api/partners', async (_req, res) => {
  try {
    const partners = await getDbPartners();
    res.json(partners);
  } catch (error: any) {
    console.error('[API] GET /api/partners error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch recovery partners' });
  }
});

app.post('/api/partners', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const partner = req.body;
    if (!partner.id || !partner.name) {
      return res.status(400).json({ error: 'Missing required partner fields' });
    }
    const saved = await upsertDbPartner(partner);
    res.json({ success: true, partner: saved });
  } catch (error: any) {
    console.error('[API] POST /api/partners error:', error);
    res.status(500).json({ error: error.message || 'Failed to save partner' });
  }
});

// 5. API Route: AI Item Analysis
app.post('/api/analyze-item', async (req, res) => {
  try {
    const { description, deviceName, quantity, condition, imageBase64, imageMimeType } = req.body;

    if (!description && !deviceName) {
      return res.status(400).json({
        error: 'Please provide an item description or device name for analysis.'
      });
    }

    // If Gemini client is active, call live model
    if (aiClient) {
      try {
        const parts: any[] = [];
        
        if (imageBase64) {
          parts.push({
            inlineData: {
              data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
              mimeType: imageMimeType || 'image/jpeg'
            }
          });
        }

        const promptText = `
You are the AI Circular Resource & Electronics Recovery Engine for RESTOCK AI.
Analyze the following electronic waste / surplus resource submission and provide structured circular recovery recommendations.

User Submitted Details:
- Device / Item Title: ${deviceName || 'Not explicitly named'}
- Reported Description: ${description}
- Stated Quantity: ${quantity || 'Unspecified'}
- Reported Condition: ${condition || 'Unspecified'}

Mandatory Rules:
1. Identify the likely category from:
   - "Laptops and Desktop Equipment"
   - "Cables and Electronic Accessories"
   - "Mobile Devices and Components"
   - "Circuit Boards and Electronic Parts"
   - "Printers and Office Electronics"
   - "Other Eligible Electronic Waste"
2. Standardize the device name and extract or infer quantity.
3. Identify reported condition: "Functional", "Minor Wear", "Defective", "Parts Only", or "Indeterminate".
4. List specific MISSING INFORMATION that requires operational clarification before partner dispatch.
5. Recommend the primary circular pathway from the 5 supported pathways:
   - "Reuse"
   - "Professional assessment for refurbishment"
   - "Authorized component recovery"
   - "Authorized recycling"
   - "Further inspection required"
6. Evaluate each of the 5 pathways with a suitability rating and rationale.
7. Provide recommended next steps and handling notes.
8. NEVER claim that a photograph or text description alone can determine exact material composition, internal component health, hidden battery hazards, or guaranteed resale value. Include a clear safety disclaimer.
`;

        parts.push({ text: promptText });

        const geminiResponse = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: { parts },
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                likelyCategory: { type: Type.STRING },
                standardizedDeviceName: { type: Type.STRING },
                extractedQuantity: { type: Type.NUMBER },
                reportedCondition: { type: Type.STRING },
                confidenceLevel: { type: Type.STRING, description: "High, Moderate, or Preliminary" },
                confidenceJustification: { type: Type.STRING },
                missingInformation: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                primaryPathway: { type: Type.STRING },
                pathwayExplanation: { type: Type.STRING },
                allPathways: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      pathwayName: { type: Type.STRING },
                      suitability: { type: Type.STRING, description: "Recommended, Viable Alternative, Not Advised, or Requires Verification" },
                      rationale: { type: Type.STRING }
                    },
                    required: ["pathwayName", "suitability", "rationale"]
                  }
                },
                recommendedNextSteps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                handlingNotes: { type: Type.STRING },
                safetyDisclaimer: { type: Type.STRING }
              },
              required: [
                "likelyCategory",
                "standardizedDeviceName",
                "reportedCondition",
                "missingInformation",
                "primaryPathway",
                "pathwayExplanation",
                "allPathways",
                "recommendedNextSteps",
                "handlingNotes",
                "safetyDisclaimer"
              ]
            }
          }
        });

        const rawText = geminiResponse.text?.trim() || '';
        const parsed = JSON.parse(rawText);

        return res.json({
          success: true,
          isLiveAi: true,
          analysisModeLabel: 'Gemini 3.8 Flash Live Inference (Cloud Server)',
          result: {
            id: `ai-gemini-${Date.now()}`,
            analyzedAt: new Date().toISOString(),
            isLiveAi: true,
            analysisModeLabel: 'Gemini 3.8 Flash Live Inference (Cloud Server)',
            likelyCategory: parsed.likelyCategory,
            standardizedDeviceName: parsed.standardizedDeviceName,
            extractedQuantity: parsed.extractedQuantity || (quantity ? Number(quantity) : 1),
            reportedCondition: parsed.reportedCondition,
            confidenceIndicator: {
              level: parsed.confidenceLevel || 'Moderate',
              justification: parsed.confidenceJustification || 'Derived from multimodal technical specifications and standard IT asset disposition databases.'
            },
            missingInformation: parsed.missingInformation || [],
            primaryPathway: parsed.primaryPathway,
            pathwayExplanation: parsed.pathwayExplanation,
            allPathways: parsed.allPathways || [],
            recommendedNextSteps: parsed.recommendedNextSteps || [],
            handlingNotes: parsed.handlingNotes,
            safetyDisclaimer: parsed.safetyDisclaimer || 'Advisory analysis. Exact metallurgical composition, hazardous internal conditions, and certification manifests must be verified by licensed downstream partners.'
          }
        });
      } catch (geminiError: any) {
        console.warn('[RESTOCK AI Server] Live Gemini inference encountered an issue (e.g. quota/network), falling back to demo simulation engine:', geminiError?.message || geminiError);
        const fallback = generateDemoAnalysis(description, deviceName, quantity, condition);
        return res.json({
          success: true,
          isLiveAi: false,
          analysisModeLabel: 'Demo AI Simulation Engine (Live Quota Exceeded / Fallback)',
          result: fallback
        });
      }
    }

    // Default simulation engine
    const demoResult = generateDemoAnalysis(description, deviceName, quantity, condition);
    return res.json({
      success: true,
      isLiveAi: false,
      analysisModeLabel: 'Demo AI Simulation Engine (Local Prototype Mode)',
      result: demoResult
    });

  } catch (err: any) {
    console.error('[RESTOCK AI Server] Server error handling /api/analyze-item:', err);
    res.status(500).json({
      error: 'An unexpected error occurred during item analysis.',
      details: err?.message
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  // Seed database initially
  try {
    await seedInitialDataIfEmpty(SAMPLE_PARTNERS, INITIAL_INVENTORY, INITIAL_REQUESTS);
  } catch (seedErr) {
    console.warn('[RESTOCK AI Server] Notice during initial seed:', seedErr);
  }

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[RESTOCK AI] Server listening on http://0.0.0.0:${PORT} with PostgreSQL database backend.`);
  });
}

startServer();
