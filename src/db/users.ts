import { db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(
  uid: string, 
  email: string, 
  name?: string, 
  role: string = 'business', 
  organization?: string, 
  isDemo: boolean = false
) {
  try {
    const result = await db.insert(users)
      .values({
        uid,
        email,
        name: name || null,
        role: role || 'business',
        organization: organization || null,
        isDemo: Boolean(isDemo),
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          ...(name ? { name } : {}),
          ...(role ? { role } : {}),
          ...(organization ? { organization } : {}),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error("Database getOrCreateUser query failed:", error);
    throw new Error("Failed to synchronize user in database.", { cause: error });
  }
}

export async function getUserByUid(uid: string) {
  try {
    const result = await db.select().from(users).where(eq(users.uid, uid));
    return result[0] || null;
  } catch (error) {
    console.error("Database getUserByUid query failed:", error);
    throw new Error("Failed to retrieve user from database.", { cause: error });
  }
}
