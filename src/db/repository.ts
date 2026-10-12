import { db } from './index.ts';
import { inventoryItems, recoveryRequests, recoveryPartners, users } from './schema.ts';
import { eq, desc } from 'drizzle-orm';
import { ResourceInventoryItem, RecoveryRequest, RecoveryPartner } from '../types/index.ts';

/**
 * INVENTORY ITEMS REPOSITORY
 */
export async function getDbInventory(userUid?: string): Promise<ResourceInventoryItem[]> {
  try {
    const rows = userUid 
      ? await db.select().from(inventoryItems).where(eq(inventoryItems.userUid, userUid)).orderBy(desc(inventoryItems.createdAt))
      : await db.select().from(inventoryItems).orderBy(desc(inventoryItems.createdAt));

    return rows.map(r => ({
      id: r.id,
      category: r.category,
      deviceType: r.deviceType,
      quantity: r.quantity,
      estimatedWeightKg: r.estimatedWeightKg ?? undefined,
      condition: r.condition as any,
      location: r.location,
      description: r.description ?? undefined,
      notes: r.notes ?? undefined,
      imageUrl: r.imageUrl ?? undefined,
      preferredCollectionDate: r.preferredCollectionDate ?? undefined,
      specialHandlingNotes: r.specialHandlingNotes ?? undefined,
      status: r.status as any,
      addedAt: r.addedAt,
      originalSubmission: (r.originalSubmission as any) ?? undefined,
      aiRecommendation: (r.aiRecommendation as any) ?? undefined,
      aiAnalysis: (r.aiAnalysis as any) ?? undefined,
    }));
  } catch (error) {
    console.error('Database getDbInventory error:', error);
    throw new Error('Failed to retrieve inventory items from database.', { cause: error });
  }
}

export async function upsertDbInventoryItem(item: ResourceInventoryItem, userUid?: string) {
  try {
    const result = await db.insert(inventoryItems)
      .values({
        id: item.id,
        userUid: userUid || null,
        category: item.category,
        deviceType: item.deviceType,
        quantity: item.quantity,
        estimatedWeightKg: item.estimatedWeightKg ?? null,
        condition: item.condition,
        location: item.location,
        description: item.description ?? null,
        notes: item.notes ?? null,
        imageUrl: item.imageUrl ?? null,
        preferredCollectionDate: item.preferredCollectionDate ?? null,
        specialHandlingNotes: item.specialHandlingNotes ?? null,
        status: item.status,
        addedAt: item.addedAt,
        originalSubmission: item.originalSubmission ?? null,
        aiRecommendation: item.aiRecommendation ?? null,
        aiAnalysis: item.aiAnalysis ?? null,
      })
      .onConflictDoUpdate({
        target: inventoryItems.id,
        set: {
          category: item.category,
          deviceType: item.deviceType,
          quantity: item.quantity,
          estimatedWeightKg: item.estimatedWeightKg ?? null,
          condition: item.condition,
          location: item.location,
          description: item.description ?? null,
          notes: item.notes ?? null,
          imageUrl: item.imageUrl ?? null,
          preferredCollectionDate: item.preferredCollectionDate ?? null,
          specialHandlingNotes: item.specialHandlingNotes ?? null,
          status: item.status,
          originalSubmission: item.originalSubmission ?? null,
          aiRecommendation: item.aiRecommendation ?? null,
          aiAnalysis: item.aiAnalysis ?? null,
        }
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database upsertDbInventoryItem error:', error);
    throw new Error('Failed to save inventory item to database.', { cause: error });
  }
}

export async function deleteDbInventoryItem(id: string) {
  try {
    const result = await db.delete(inventoryItems).where(eq(inventoryItems.id, id)).returning();
    return result[0];
  } catch (error) {
    console.error('Database deleteDbInventoryItem error:', error);
    throw new Error('Failed to delete inventory item from database.', { cause: error });
  }
}

/**
 * RECOVERY REQUESTS REPOSITORY
 */
export async function getDbRecoveryRequests(userUid?: string): Promise<RecoveryRequest[]> {
  try {
    const rows = userUid 
      ? await db.select().from(recoveryRequests).where(eq(recoveryRequests.userUid, userUid))
      : await db.select().from(recoveryRequests);

    return rows.map(r => ({
      id: r.id,
      inventoryItemId: r.inventoryItemId,
      itemTitle: r.itemTitle,
      category: r.category,
      quantity: r.quantity,
      estimatedWeightKg: r.estimatedWeightKg ?? undefined,
      collectionLocation: r.collectionLocation,
      preferredDate: r.preferredDate ?? undefined,
      proposedTimeWindow: r.proposedTimeWindow ?? undefined,
      specialNotes: r.specialNotes ?? undefined,
      assignedPartnerId: r.assignedPartnerId ?? undefined,
      assignedPartnerName: r.assignedPartnerName ?? undefined,
      status: r.status as any,
      createdAt: r.createdAt,
      statusHistory: (r.statusHistory as any) || [],
      pickupContact: (r.pickupContact as any) ?? undefined,
      partnerResponseNotes: r.partnerResponseNotes ?? undefined,
      driverDetails: (r.driverDetails as any) ?? undefined,
      custodyReceiptId: r.custodyReceiptId ?? undefined,
      certificateOfDestructionUrl: r.certificateOfDestructionUrl ?? undefined,
      coordinationGroupId: r.coordinationGroupId ?? undefined,
    }));
  } catch (error) {
    console.error('Database getDbRecoveryRequests error:', error);
    throw new Error('Failed to retrieve recovery requests from database.', { cause: error });
  }
}

export async function upsertDbRecoveryRequest(req: RecoveryRequest, userUid?: string) {
  try {
    const result = await db.insert(recoveryRequests)
      .values({
        id: req.id,
        userUid: userUid || null,
        inventoryItemId: req.inventoryItemId,
        itemTitle: req.itemTitle,
        category: req.category,
        quantity: req.quantity,
        estimatedWeightKg: req.estimatedWeightKg ?? null,
        collectionLocation: req.collectionLocation,
        preferredDate: req.preferredDate ?? null,
        proposedTimeWindow: req.proposedTimeWindow ?? null,
        specialNotes: req.specialNotes ?? null,
        assignedPartnerId: req.assignedPartnerId ?? null,
        assignedPartnerName: req.assignedPartnerName ?? null,
        status: req.status,
        statusHistory: req.statusHistory || [],
        pickupContact: req.pickupContact ?? null,
        partnerResponseNotes: req.partnerResponseNotes ?? null,
        driverDetails: req.driverDetails ?? null,
        custodyReceiptId: req.custodyReceiptId ?? null,
        certificateOfDestructionUrl: req.certificateOfDestructionUrl ?? null,
        coordinationGroupId: req.coordinationGroupId ?? null,
        createdAt: req.createdAt,
      })
      .onConflictDoUpdate({
        target: recoveryRequests.id,
        set: {
          status: req.status,
          assignedPartnerId: req.assignedPartnerId ?? null,
          assignedPartnerName: req.assignedPartnerName ?? null,
          preferredDate: req.preferredDate ?? null,
          proposedTimeWindow: req.proposedTimeWindow ?? null,
          statusHistory: req.statusHistory || [],
          pickupContact: req.pickupContact ?? null,
          partnerResponseNotes: req.partnerResponseNotes ?? null,
          driverDetails: req.driverDetails ?? null,
          custodyReceiptId: req.custodyReceiptId ?? null,
          certificateOfDestructionUrl: req.certificateOfDestructionUrl ?? null,
          coordinationGroupId: req.coordinationGroupId ?? null,
        }
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database upsertDbRecoveryRequest error:', error);
    throw new Error('Failed to save recovery request to database.', { cause: error });
  }
}

/**
 * RECOVERY PARTNERS REPOSITORY
 */
export async function getDbPartners(): Promise<RecoveryPartner[]> {
  try {
    const rows = await db.select().from(recoveryPartners);
    return rows.map(r => ({
      id: r.id,
      name: r.name,
      type: r.type,
      serviceArea: r.serviceArea,
      regionsServed: (r.regionsServed as string[]) || [],
      acceptedMaterials: (r.acceptedMaterials as string[]) || [],
      availableServices: (r.availableServices as string[]) || [],
      contactInfo: (r.contactInfo as any) || { phone: '', email: '', facilityAddress: '' },
      verificationStatus: r.verificationStatus as any,
      verificationDetails: r.verificationDetails || '',
      operationalNotes: r.operationalNotes || '',
      minimumLot: r.minimumLot || '',
      minUnits: r.minUnits ?? 1,
      minWeightKg: r.minWeightKg ?? undefined,
      logisticsSupport: r.logisticsSupport || '',
      verifiedBadges: (r.verifiedBadges as string[]) || [],
      description: r.description || '',
      leadTimeDays: r.leadTimeDays ?? 2,
    }));
  } catch (error) {
    console.error('Database getDbPartners error:', error);
    throw new Error('Failed to retrieve partners from database.', { cause: error });
  }
}

export async function upsertDbPartner(partner: RecoveryPartner) {
  try {
    const result = await db.insert(recoveryPartners)
      .values({
        id: partner.id,
        name: partner.name,
        type: partner.type,
        serviceArea: partner.serviceArea,
        regionsServed: partner.regionsServed,
        acceptedMaterials: partner.acceptedMaterials,
        availableServices: partner.availableServices,
        contactInfo: partner.contactInfo,
        verificationStatus: partner.verificationStatus,
        verificationDetails: partner.verificationDetails,
        operationalNotes: partner.operationalNotes,
        minimumLot: partner.minimumLot,
        minUnits: partner.minUnits ?? 1,
        minWeightKg: partner.minWeightKg ?? null,
        logisticsSupport: partner.logisticsSupport,
        verifiedBadges: partner.verifiedBadges,
        description: partner.description,
        leadTimeDays: partner.leadTimeDays,
      })
      .onConflictDoUpdate({
        target: recoveryPartners.id,
        set: {
          name: partner.name,
          type: partner.type,
          serviceArea: partner.serviceArea,
          regionsServed: partner.regionsServed,
          acceptedMaterials: partner.acceptedMaterials,
          availableServices: partner.availableServices,
          contactInfo: partner.contactInfo,
          verificationStatus: partner.verificationStatus,
          verificationDetails: partner.verificationDetails,
          operationalNotes: partner.operationalNotes,
          minimumLot: partner.minimumLot,
          minUnits: partner.minUnits ?? 1,
          minWeightKg: partner.minWeightKg ?? null,
          logisticsSupport: partner.logisticsSupport,
          verifiedBadges: partner.verifiedBadges,
          description: partner.description,
          leadTimeDays: partner.leadTimeDays,
        }
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database upsertDbPartner error:', error);
    throw new Error('Failed to save partner to database.', { cause: error });
  }
}

/**
 * SEEDING INITIAL MOCK DATA IF TABLES ARE EMPTY
 */
export async function seedInitialDataIfEmpty(
  samplePartners: RecoveryPartner[],
  sampleInventory: ResourceInventoryItem[],
  sampleRequests: RecoveryRequest[]
) {
  try {
    // 1. Seed demo user for foreign key constraints
    await db.insert(users)
      .values({
        uid: 'demo-user-1',
        email: 'demo@restock.eco',
        name: 'Enterprise Logistics Demo User',
        role: 'business',
        organization: 'Apex BioLogistics Corp',
        isDemo: true,
      })
      .onConflictDoNothing();

    // 2. Check and seed partners
    const existingPartners = await db.select().from(recoveryPartners);
    if (existingPartners.length === 0 && samplePartners.length > 0) {
      console.log(`[RESTOCK AI Seed] Seeding ${samplePartners.length} recovery partners to PostgreSQL...`);
      for (const p of samplePartners) {
        await upsertDbPartner(p);
      }
    }

    // 3. Check and seed inventory
    const existingInventory = await db.select().from(inventoryItems);
    if (existingInventory.length === 0 && sampleInventory.length > 0) {
      console.log(`[RESTOCK AI Seed] Seeding ${sampleInventory.length} inventory items to PostgreSQL...`);
      for (const item of sampleInventory) {
        await upsertDbInventoryItem(item, 'demo-user-1');
      }
    }

    // 4. Check and seed requests
    const existingRequests = await db.select().from(recoveryRequests);
    if (existingRequests.length === 0 && sampleRequests.length > 0) {
      console.log(`[RESTOCK AI Seed] Seeding ${sampleRequests.length} recovery requests to PostgreSQL...`);
      for (const req of sampleRequests) {
        await upsertDbRecoveryRequest(req, 'demo-user-1');
      }
    }
  } catch (err) {
    console.warn('[RESTOCK AI Seed] Notice during initial database seeding:', err);
  }
}
