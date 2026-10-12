/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { Solutions } from './components/Solutions';
import { AiIntelligence } from './components/AiIntelligence';
import { CategoryGrid } from './components/CategoryGrid';
import { TrustResponsibility } from './components/TrustResponsibility';
import { CaseStudies } from './components/CaseStudies';
import { CtaBanner } from './components/CtaBanner';
import { Footer } from './components/Footer';
import { RegisterModal } from './components/RegisterModal';
import { PartnerExplorerModal } from './components/PartnerExplorerModal';
import { PartnerOnboardingModal } from './components/PartnerOnboardingModal';
import { AuthModal } from './components/AuthModal';
import { ContactModal } from './components/ContactModal';

// Phase 2 Dashboard & Auth Components
import { AuthPage } from './components/auth/AuthPage';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { OverviewView } from './components/dashboard/OverviewView';
import { AiAnalysisView } from './components/dashboard/AiAnalysisView';
import { AddEWasteView } from './components/dashboard/AddEWasteView';
import { InventoryView } from './components/dashboard/InventoryView';
import { RecoveryRequestsView } from './components/dashboard/RecoveryRequestsView';
import { FindPartnersView } from './components/dashboard/FindPartnersView';
import { PickupTrackingView } from './components/dashboard/PickupTrackingView';
import { ReportsView } from './components/dashboard/ReportsView';
import { SettingsView } from './components/dashboard/SettingsView';
import { PartnerMatchingModal } from './components/dashboard/PartnerMatchingModal';
import { DemoGuidedTour } from './components/dashboard/DemoGuidedTour';

import { INITIAL_INVENTORY, INITIAL_REQUESTS } from './data/mockData';
import { 
  CategoryItem, 
  ResourceInventoryItem, 
  RecoveryPartner, 
  RecoveryRequest, 
  RecoveryRequestStatus,
  User 
} from './types';

export default function App() {
  // Navigation View State: 'public' | 'auth' | 'dashboard'
  const [currentView, setCurrentView] = useState<'public' | 'auth' | 'dashboard'>('public');
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [dashboardTab, setDashboardTab] = useState<string>('overview');

  // Active User session (local storage backed)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('restock_ai_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // Inventory state (localStorage backed)
  const [inventory, setInventory] = useState<ResourceInventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('restock_ai_inventory_v2');
      return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
    } catch {
      return INITIAL_INVENTORY;
    }
  });

  // Recovery Requests state (localStorage backed)
  const [requests, setRequests] = useState<RecoveryRequest[]>(() => {
    try {
      const saved = localStorage.getItem('restock_ai_requests_v2');
      return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
    } catch {
      return INITIAL_REQUESTS;
    }
  });

  // Synchronize localStorage
  useEffect(() => {
    try {
      localStorage.setItem('restock_ai_inventory_v2', JSON.stringify(inventory));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [inventory]);

  useEffect(() => {
    try {
      localStorage.setItem('restock_ai_requests_v2', JSON.stringify(requests));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [requests]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('restock_ai_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('restock_ai_user');
      }
    } catch (e) {
      console.warn('User storage error', e);
    }
  }, [currentUser]);

  // Modal visibility states (for public website)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isPartnerExplorerOpen, setIsPartnerExplorerOpen] = useState(false);
  const [isPartnerOnboardOpen, setIsPartnerOnboardOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Modal context states
  const [preselectedCategory, setPreselectedCategory] = useState<CategoryItem | null>(null);
  const [contactSubject, setContactSubject] = useState<string | undefined>(undefined);
  const [initialRequestItemId, setInitialRequestItemId] = useState<string | null>(null);
  const [isMatchmakerOpen, setIsMatchmakerOpen] = useState(false);
  const [selectedMatchmakerItemId, setSelectedMatchmakerItemId] = useState<string | null>(null);

  // Authentication Handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
    setDashboardTab('overview');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('public');
  };

  const handleOpenAuthPage = (mode: 'signin' | 'signup' | 'forgot' = 'signin') => {
    setAuthMode(mode);
    setCurrentView('auth');
  };

  // Inventory Handlers
  const handleAddInventoryItem = (item: ResourceInventoryItem) => {
    setInventory((prev) => [item, ...prev]);
  };

  const handleUpdateInventoryItem = (updatedItem: ResourceInventoryItem) => {
    setInventory((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
  };

  const handleDeleteInventoryItem = (id: string) => {
    setInventory((prev) => prev.filter((item) => item.id !== id));
  };

  // Recovery Requests Handlers
  const handleCreateRequest = (newRequest: RecoveryRequest) => {
    setRequests((prev) => [newRequest, ...prev]);
    // Update inventory item status to 'Request Created'
    setInventory((prev) =>
      prev.map((item) =>
        item.id === newRequest.inventoryItemId ? { ...item, status: 'Request Created' } : item
      )
    );
  };

  const handleUpdateRequestStatus = (
    requestId: string,
    newStatus: RecoveryRequestStatus,
    note?: string
  ) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
          const historyEntry = {
            status: newStatus,
            timestamp: now,
            note: note || `Status updated to ${newStatus}`
          };
          return {
            ...req,
            status: newStatus,
            statusHistory: [...req.statusHistory, historyEntry]
          };
        }
        return req;
      })
    );

    // If request reached 'Pickup Scheduled', update the linked inventory item
    if (newStatus === 'Pickup Scheduled') {
      const targetReq = requests.find((r) => r.id === requestId);
      if (targetReq) {
        setInventory((prev) =>
          prev.map((item) =>
            item.id === targetReq.inventoryItemId ? { ...item, status: 'Scheduled' } : item
          )
        );
      }
    } else if (newStatus === 'Completed' || newStatus === 'Collected') {
      const targetReq = requests.find((r) => r.id === requestId);
      if (targetReq) {
        setInventory((prev) =>
          prev.map((item) =>
            item.id === targetReq.inventoryItemId ? { ...item, status: 'Recovered' } : item
          )
        );
      }
    }
  };

  // Reset Demo Data
  const handleResetDemoData = () => {
    setInventory(INITIAL_INVENTORY);
    setRequests(INITIAL_REQUESTS);
    localStorage.removeItem('restock_ai_inventory_v2');
    localStorage.removeItem('restock_ai_requests_v2');
  };

  // Shortcut from inventory item to requests view
  const handleCreateRequestForItem = (item: ResourceInventoryItem) => {
    setInitialRequestItemId(item.id);
    setDashboardTab('requests');
  };

  // Navigation scroll helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // If in AUTH VIEW
  if (currentView === 'auth') {
    return (
      <AuthPage
        initialMode={authMode}
        onLoginSuccess={handleLoginSuccess}
        onBackToHome={() => setCurrentView('public')}
      />
    );
  }

  // If in DASHBOARD VIEW
  if (currentView === 'dashboard') {
    const activeUser = currentUser || {
      id: 'demo-biz-default',
      name: 'Sarah Jenkins',
      email: 's.jenkins@pacificcloud.io',
      role: 'business',
      organization: 'Pacific Cloud Systems',
      isDemo: true
    };

    return (
      <DashboardLayout
        user={activeUser}
        activeTab={dashboardTab}
        onSelectTab={(tab) => setDashboardTab(tab)}
        onLogout={handleLogout}
        onNavigateToPublic={() => setCurrentView('public')}
      >
        {/* Phase 5 Interactive Guided Demo Tour */}
        <DemoGuidedTour
          currentTab={dashboardTab}
          onNavigateTab={(tab) => setDashboardTab(tab)}
        />

        {dashboardTab === 'overview' && (
          <OverviewView
            user={activeUser}
            inventory={inventory}
            requests={requests}
            onNavigateTab={(tab) => setDashboardTab(tab)}
            onOpenNewRequest={() => {
              setInitialRequestItemId(null);
              setDashboardTab('requests');
            }}
          />
        )}

        {dashboardTab === 'ai-analysis' && (
          <AiAnalysisView
            onSaveItemToInventory={handleAddInventoryItem}
            onNavigateToInventory={() => setDashboardTab('inventory')}
            onNavigateToRequests={() => setDashboardTab('requests')}
          />
        )}

        {dashboardTab === 'add-ewaste' && (
          <AddEWasteView
            onAddItem={handleAddInventoryItem}
            onNavigateToInventory={() => setDashboardTab('inventory')}
            onNavigateToRequests={() => setDashboardTab('requests')}
            onNavigateToAiAnalysis={() => setDashboardTab('ai-analysis')}
          />
        )}

        {dashboardTab === 'inventory' && (
          <InventoryView
            inventory={inventory}
            onUpdateItem={handleUpdateInventoryItem}
            onDeleteItem={handleDeleteInventoryItem}
            onNavigateToAdd={() => setDashboardTab('add-ewaste')}
            onCreateRequestForItem={handleCreateRequestForItem}
          />
        )}

        {dashboardTab === 'requests' && (
          <RecoveryRequestsView
            requests={requests}
            inventory={inventory}
            onCreateRequest={handleCreateRequest}
            onUpdateRequestStatus={handleUpdateRequestStatus}
            initialSelectedItemId={initialRequestItemId}
            onOpenMatchmaker={(item) => {
              setSelectedMatchmakerItemId(item?.id || inventory[0]?.id || null);
              setIsMatchmakerOpen(true);
            }}
          />
        )}

        {dashboardTab === 'find-partners' && (
          <FindPartnersView
            inventory={inventory}
            onSelectPartnerForInquiry={(partner) => {
              setContactSubject(`Partner Intake Request: ${partner.name}`);
              setIsContactOpen(true);
            }}
            onLaunchPartnerMatch={(partner) => {
              setSelectedMatchmakerItemId(inventory[0]?.id || null);
              setIsMatchmakerOpen(true);
            }}
          />
        )}

        {dashboardTab === 'pickup-tracking' && (
          <PickupTrackingView
            requests={requests}
            onNavigateToRequests={() => setDashboardTab('requests')}
            onOpenNewRequest={() => {
              setInitialRequestItemId(null);
              setDashboardTab('requests');
            }}
          />
        )}

        {dashboardTab === 'reports' && (
          <ReportsView
            inventory={inventory}
            requests={requests}
          />
        )}

        {dashboardTab === 'settings' && (
          <SettingsView
            user={activeUser}
            onResetDemoData={handleResetDemoData}
            onUpdateUser={(updated) => {
              if (currentUser) {
                setCurrentUser({ ...currentUser, ...updated });
              }
            }}
          />
        )}

        {/* Phase 4 Partner Matching Modal */}
        <PartnerMatchingModal
          isOpen={isMatchmakerOpen}
          onClose={() => setIsMatchmakerOpen(false)}
          inventory={inventory}
          preselectedItemId={selectedMatchmakerItemId || undefined}
          onSelectPartnerForRequest={(partner, item) => {
            setInitialRequestItemId(item.id);
            setDashboardTab('requests');
          }}
        />
      </DashboardLayout>
    );
  }

  // PUBLIC WEBSITE VIEW
  return (
    <div className="min-h-screen bg-[#F7F4EC] text-[#252A25] flex flex-col font-sans-body selection:bg-[#DCE5D5] selection:text-[#234D35]">
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        onOpenDashboard={() => setCurrentView('dashboard')}
        onOpenRegister={() => handleOpenAuthPage('signup')}
        onOpenSignIn={() => handleOpenAuthPage('signin')}
        onOpenContact={() => {
          setContactSubject('General Inquiry');
          setIsContactOpen(true);
        }}
        onOpenPartnerExplorer={() => setIsPartnerExplorerOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onStartRecovering={() => handleOpenAuthPage('signup')}
          onExploreHowItWorks={() => scrollToSection('how-it-works')}
          onLaunchDemo={() => setCurrentView('dashboard')}
        />

        {/* How It Works */}
        <HowItWorks
          onOpenRegister={() => handleOpenAuthPage('signup')}
          onOpenPartnerExplorer={() => setIsPartnerExplorerOpen(true)}
          onOpenAiExplorer={() => scrollToSection('ai-intelligence')}
        />

        {/* Solutions for 4 Ecosystem Sectors */}
        <Solutions
          onRegisterInterest={(title) => {
            setContactSubject(`Ecosystem Participation: ${title}`);
            setIsContactOpen(true);
          }}
        />

        {/* AI Intelligence Section */}
        <AiIntelligence
          onOpenRegister={() => handleOpenAuthPage('signup')}
        />

        {/* Featured Recovery Categories */}
        <CategoryGrid
          onSelectCategory={(cat) => {
            setPreselectedCategory(cat);
            setIsRegisterOpen(true);
          }}
        />

        {/* Trust & Responsibility */}
        <TrustResponsibility />

        {/* Illustrative Case Studies */}
        <CaseStudies />

        {/* Large Olive Green CTA Banner */}
        <CtaBanner
          onRegisterBusiness={() => handleOpenAuthPage('signup')}
          onBecomePartner={() => setIsPartnerOnboardOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenRegister={() => handleOpenAuthPage('signup')}
        onOpenPartnerExplorer={() => setIsPartnerExplorerOpen(true)}
        onOpenContact={() => {
          setContactSubject('General Inquiry');
          setIsContactOpen(true);
        }}
        onOpenPartnerOnboard={() => setIsPartnerOnboardOpen(true)}
      />

      {/* Interactive Modals & Prototype Dialogs */}
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        inventory={inventory}
        onAddInventoryItem={handleAddInventoryItem}
        onRemoveInventoryItem={handleDeleteInventoryItem}
        preselectedCategory={preselectedCategory}
      />

      <PartnerExplorerModal
        isOpen={isPartnerExplorerOpen}
        onClose={() => setIsPartnerExplorerOpen(false)}
        onSelectPartnerForInquiry={(partner) => {
          setContactSubject(`Intake Dispatch Inquiry: ${partner.name}`);
          setIsContactOpen(true);
        }}
      />

      <PartnerOnboardingModal
        isOpen={isPartnerOnboardOpen}
        onClose={() => setIsPartnerOnboardOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        prefillSubject={contactSubject}
      />
    </div>
  );
}
