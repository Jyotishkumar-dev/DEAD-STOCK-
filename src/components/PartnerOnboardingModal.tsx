import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

interface PartnerOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PartnerOnboardingModal: React.FC<PartnerOnboardingModalProps> = ({
  isOpen,
  onClose
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    facilityLocation: '',
    specialty: 'Certified ITAD & Refurbishment',
    certifications: 'R2v3 / ISO 14001',
    minLot: '1 Pallet / 25 Units'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#FFFEFA] border border-[#E6E2D8] rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden my-auto relative">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E6E2D8] flex items-center justify-between bg-[#F7F4EC]">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#626B45]">
              PARTNER ECOSYSTEM ONBOARDING
            </div>
            <h3 className="font-serif-heading text-2xl text-[#252A25]">
              Become a Recovery Partner
            </h3>
          </div>

          <button
            onClick={() => {
              setSubmitted(false);
              onClose();
            }}
            className="p-2 text-[#777A72] hover:text-[#252A25] rounded-full hover:bg-white transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#DCE5D5] text-[#234D35] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h4 className="font-serif-heading text-2xl text-[#252A25]">
                Application Received
              </h4>

              <p className="text-xs text-[#777A72] max-w-sm mx-auto leading-relaxed">
                Thank you for applying to the RESTOCK AI recovery network. Our compliance team will review your credentials and contact you within 2 business days.
              </p>

              <div className="pt-4">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    onClose();
                  }}
                  className="px-6 py-2.5 text-xs font-semibold text-[#FFFEFA] bg-[#234D35] hover:bg-[#1a3a28] rounded-full transition-colors cursor-pointer"
                >
                  Return to Platform
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-[#777A72] leading-relaxed mb-2">
                Join our network of authorized recyclers, refurbishers, and component specialists to receive qualified material batches and pickup requests.
              </p>

              <div>
                <label className="block text-xs font-semibold text-[#252A25] mb-1">
                  Organization / Facility Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Apex Recycling Solutions"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#252A25] focus:border-[#234D35] focus:ring-1 focus:ring-[#234D35]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#252A25] mb-1">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="First & Last Name"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#252A25] focus:border-[#234D35] focus:ring-1 focus:ring-[#234D35]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#252A25] mb-1">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="intake@partner.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#252A25] focus:border-[#234D35] focus:ring-1 focus:ring-[#234D35]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#252A25] mb-1">
                    Primary Operational Focus *
                  </label>
                  <select
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#252A25] focus:border-[#234D35] focus:ring-1 focus:ring-[#234D35]"
                  >
                    <option value="Certified ITAD & Refurbishment">Certified ITAD & Refurbishment</option>
                    <option value="Component Harvesting & Micro-Repair">Component Harvesting & Micro-Repair</option>
                    <option value="Precious Metal Refining & Smelting">Precious Metal Refining & Smelting</option>
                    <option value="Universal E-Waste Shredding / Aggregator">Universal E-Waste Shredding</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#252A25] mb-1">
                    Facility Service Region *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Pacific NW, Midwest, Regional"
                    value={formData.facilityLocation}
                    onChange={(e) => setFormData({ ...formData, facilityLocation: e.target.value })}
                    className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#252A25] focus:border-[#234D35] focus:ring-1 focus:ring-[#234D35]"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-[#777A72]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-semibold text-[#FFFEFA] bg-[#234D35] hover:bg-[#1a3a28] rounded-full transition-colors cursor-pointer shadow-sm"
                >
                  Submit Application
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
