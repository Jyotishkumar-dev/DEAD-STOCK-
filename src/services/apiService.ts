import { ResourceInventoryItem, RecoveryRequest, RecoveryPartner, User } from '../types';
import { auth, googleAuthProvider } from '../lib/firebase';
import { signInWithPopup, signOut as fbSignOut } from 'firebase/auth';

/**
 * RESTOCK AI Database & Backend Service
 * Interacts with PostgreSQL backend (Cloud SQL / Drizzle)
 */

let currentAuthToken: string | null = null;
let currentDemoEmail: string | null = null;

export function setApiAuthToken(token: string | null, demoEmail?: string) {
  currentAuthToken = token;
  currentDemoEmail = demoEmail || null;
}

function getHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (currentAuthToken) {
    headers['Authorization'] = `Bearer ${currentAuthToken}`;
  }
  if (currentDemoEmail) {
    headers['x-demo-user-email'] = currentDemoEmail;
  }
  return headers;
}

// 1. Authenticate with Google via Firebase OAuth
export async function signInWithGoogle(): Promise<User> {
  try {
    const credential = await signInWithPopup(auth, googleAuthProvider);
    const fbUser = credential.user;
    const token = await fbUser.getIdToken();
    setApiAuthToken(token);

    // Sync to PostgreSQL backend
    const res = await fetch('/api/auth/sync-user', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        uid: fbUser.uid,
        email: fbUser.email,
        name: fbUser.displayName || 'Authorized User',
        role: 'business',
        organization: 'Enterprise Resource Partner',
        isDemo: false
      })
    });

    if (res.ok) {
      const data = await res.json();
      return {
        id: data.user.uid || fbUser.uid,
        name: data.user.name || fbUser.displayName || 'Authorized User',
        email: data.user.email || fbUser.email || '',
        role: (data.user.role as any) || 'business',
        organization: data.user.organization || 'Enterprise Resource Partner',
        isDemo: false
      };
    }

    return {
      id: fbUser.uid,
      name: fbUser.displayName || 'Authorized User',
      email: fbUser.email || '',
      role: 'business',
      organization: 'Enterprise Resource Partner',
      isDemo: false
    };
  } catch (error: any) {
    console.error('Firebase Google sign-in failed:', error);
    throw error;
  }
}

// 2. Sync demo/email user to PostgreSQL
export async function syncUserToDb(user: User): Promise<User> {
  try {
    const demoToken = user.isDemo ? `demo-token-${user.id}` : null;
    if (demoToken) {
      setApiAuthToken(demoToken, user.email);
    }

    const res = await fetch('/api/auth/sync-user', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        uid: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organization: user.organization,
        isDemo: user.isDemo
      })
    });

    if (res.ok) {
      const data = await res.json();
      return {
        ...user,
        organization: data.user.organization || user.organization
      };
    }
  } catch (err) {
    console.warn('User sync notice:', err);
  }
  return user;
}

// 3. Inventory Operations
export async function apiFetchInventory(): Promise<ResourceInventoryItem[]> {
  try {
    const res = await fetch('/api/inventory', {
      headers: getHeaders()
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('apiFetchInventory fallback to local:', err);
  }
  return [];
}

export async function apiSaveInventoryItem(item: ResourceInventoryItem): Promise<void> {
  try {
    await fetch('/api/inventory', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(item)
    });
  } catch (err) {
    console.warn('apiSaveInventoryItem notice:', err);
  }
}

export async function apiDeleteInventoryItem(id: string): Promise<void> {
  try {
    await fetch(`/api/inventory/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
  } catch (err) {
    console.warn('apiDeleteInventoryItem notice:', err);
  }
}

// 4. Recovery Requests Operations
export async function apiFetchRecoveryRequests(): Promise<RecoveryRequest[]> {
  try {
    const res = await fetch('/api/requests', {
      headers: getHeaders()
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('apiFetchRecoveryRequests fallback to local:', err);
  }
  return [];
}

export async function apiSaveRecoveryRequest(req: RecoveryRequest): Promise<void> {
  try {
    await fetch('/api/requests', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(req)
    });
  } catch (err) {
    console.warn('apiSaveRecoveryRequest notice:', err);
  }
}

export async function apiUpdateRecoveryRequest(id: string, updates: Partial<RecoveryRequest>): Promise<void> {
  try {
    await fetch(`/api/requests/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates)
    });
  } catch (err) {
    console.warn('apiUpdateRecoveryRequest notice:', err);
  }
}

// 5. Recovery Partners Operations
export async function apiFetchPartners(): Promise<RecoveryPartner[]> {
  try {
    const res = await fetch('/api/partners');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('apiFetchPartners fallback:', err);
  }
  return [];
}
