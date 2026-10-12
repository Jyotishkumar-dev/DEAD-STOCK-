import React, { useState } from 'react';
import { X, CheckCircle2, Mail, Phone, MapPin, Send } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillSubject?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  prefillSubject
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [subject, setSubject] = useState(prefillSubject || 'General Platform Inquiry');
  const [message, setMessage] = useState('');

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
              GET IN TOUCH
            </div>
            <h3 className="font-serif-heading text-2xl text-[#252A25]">
              Contact RESTOCK AI
            </h3>
            <p className="text-xs text-[#777A72]">
              Inquire regarding institutional recovery, bulk ITAD coordination, or partner verification
            </p>
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
                Inquiry Transmitted
              </h4>

              <p className="text-xs text-[#777A72] max-w-sm mx-auto leading-relaxed">
                Thank you, {name}. A member of our resource coordination team has received your message and will respond to {email} promptly.
              </p>

              <div className="pt-4">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    onClose();
                  }}
                  className="px-6 py-2.5 text-xs font-semibold text-[#FFFEFA] bg-[#234D35] hover:bg-[#1a3a28] rounded-full transition-colors cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#252A25] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#252A25] focus:border-[#234D35] focus:ring-1 focus:ring-[#234D35]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#252A25] mb-1">
                    Organization / Entity
                  </label>
                  <input
                    type="text"
                    placeholder="Company, University, or Facility"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#252A25] focus:border-[#234D35] focus:ring-1 focus:ring-[#234D35]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#252A25] mb-1">
                    Inquiry Topic *
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#252A25] focus:border-[#234D35] focus:ring-1 focus:ring-[#234D35]"
                  >
                    <option value="General Platform Inquiry">General Platform Inquiry</option>
                    <option value="Enterprise Hardware Refresh Coordination">Enterprise Hardware Refresh</option>
                    <option value="Campus & Institutional E-Waste Pickup">Campus & Institutional E-Waste</option>
                    <option value="Authorized Recycler Partner Questions">Authorized Recycler Questions</option>
                    <option value="Regulatory & Compliance Verification">Regulatory & Compliance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#252A25] mb-1">
                  Message / Equipment Scope *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your equipment types, estimated lot quantities, or operational inquiries..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full text-xs bg-[#F7F4EC] border border-[#E6E2D8] rounded-xl px-3.5 py-2.5 text-[#252A25] focus:border-[#234D35] focus:ring-1 focus:ring-[#234D35]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-[#777A72]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-semibold text-[#FFFEFA] bg-[#234D35] hover:bg-[#1a3a28] rounded-full transition-colors cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
