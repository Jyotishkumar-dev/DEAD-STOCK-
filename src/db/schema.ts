import { pgTable, text, serial, integer, boolean, timestamp, jsonb, doublePrecision } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// 1. Users table (linked to Firebase Auth UID / Demo accounts)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase UID or unique user identifier
  email: text('email').notNull(),
  name: text('name'),
  role: text('role').notNull().default('business'), // 'business' | 'partner'
  organization: text('organization'),
  isDemo: boolean('is_demo').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// 2. Electronic Waste Inventory Items table
export const inventoryItems = pgTable('inventory_items', {
  id: text('id').primaryKey(), // e.g. inv-101, inv-1712...
  userUid: text('user_uid').references(() => users.uid),
  category: text('category').notNull(),
  deviceType: text('device_type').notNull(),
  quantity: integer('quantity').notNull().default(1),
  estimatedWeightKg: doublePrecision('estimated_weight_kg'),
  condition: text('condition').notNull(), // Functional | Minor Wear | Defective | Parts Only
  location: text('location').notNull(),
  description: text('description'),
  notes: text('notes'),
  imageUrl: text('image_url'),
  preferredCollectionDate: text('preferred_collection_date'),
  specialHandlingNotes: text('special_handling_notes'),
  status: text('status').notNull().default('Available'), // Available | Request Created | Scheduled | Recovered
  addedAt: text('added_at').notNull(),
  originalSubmission: jsonb('original_submission'),
  aiRecommendation: jsonb('ai_recommendation'),
  aiAnalysis: jsonb('ai_analysis'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 3. Circular Recovery Requests table
export const recoveryRequests = pgTable('recovery_requests', {
  id: text('id').primaryKey(), // e.g. REQ-2026-0814
  userUid: text('user_uid').references(() => users.uid),
  inventoryItemId: text('inventory_item_id').notNull(),
  itemTitle: text('item_title').notNull(),
  category: text('category').notNull(),
  quantity: integer('quantity').notNull().default(1),
  estimatedWeightKg: doublePrecision('estimated_weight_kg'),
  collectionLocation: text('collection_location').notNull(),
  preferredDate: text('preferred_date'),
  proposedTimeWindow: text('proposed_time_window'),
  specialNotes: text('special_notes'),
  assignedPartnerId: text('assigned_partner_id'),
  assignedPartnerName: text('assigned_partner_name'),
  status: text('status').notNull().default('Request Submitted'),
  statusHistory: jsonb('status_history').notNull().default([]),
  pickupContact: jsonb('pickup_contact'),
  partnerResponseNotes: text('partner_response_notes'),
  driverDetails: jsonb('driver_details'),
  custodyReceiptId: text('custody_receipt_id'),
  certificateOfDestructionUrl: text('certificate_of_destruction_url'),
  coordinationGroupId: text('coordination_group_id'),
  createdAt: text('created_at').notNull(),
});

// 4. Recovery Partners Directory table
export const recoveryPartners = pgTable('recovery_partners', {
  id: text('id').primaryKey(), // e.g. p-1, p-2...
  name: text('name').notNull(),
  type: text('type').notNull(),
  serviceArea: text('service_area').notNull(),
  regionsServed: jsonb('regions_served').notNull().default([]),
  acceptedMaterials: jsonb('accepted_materials').notNull().default([]),
  availableServices: jsonb('available_services').notNull().default([]),
  contactInfo: jsonb('contact_info').notNull(),
  verificationStatus: text('verification_status').notNull().default('Demo Verified'),
  verificationDetails: text('verification_details').default(''),
  operationalNotes: text('operational_notes').default(''),
  minimumLot: text('minimum_lot').default(''),
  minUnits: integer('min_units').default(1),
  minWeightKg: integer('min_weight_kg'),
  logisticsSupport: text('logistics_support').default(''),
  verifiedBadges: jsonb('verified_badges').notNull().default([]),
  description: text('description').default(''),
  leadTimeDays: integer('lead_time_days').default(2),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relationships
export const usersRelations = relations(users, ({ many }) => ({
  inventory: many(inventoryItems),
  requests: many(recoveryRequests),
}));

export const inventoryRelations = relations(inventoryItems, ({ one }) => ({
  owner: one(users, {
    fields: [inventoryItems.userUid],
    references: [users.uid],
  }),
}));

export const requestsRelations = relations(recoveryRequests, ({ one }) => ({
  owner: one(users, {
    fields: [recoveryRequests.userUid],
    references: [users.uid],
  }),
}));
