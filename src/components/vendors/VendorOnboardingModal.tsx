import React, { useMemo, useState } from 'react';
import {
  X,
  CheckCircle2,
  Store,
  User,
  BellRing,
  Mail,
  Smartphone,
  Globe,
  CircleDollarSign,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { VendorCategory } from '../../types';
import {
  VendorApplicationInput,
  getStoredVendorApplications,
  saveVendorApplications,
} from './vendorPrototype';

const categoryOptions: Exclude<VendorCategory, 'ALL'>[] = [
  'DJ',
  'CATERING',
  'EVENT MANAGEMENT',
  'DECORATION',
  'PHOTOGRAPHY',
  'VENUE',
];

const createEmptyForm = (): Omit<VendorApplicationInput, 'id' | 'createdAt' | 'status' | 'source'> => ({
  businessName: '',
  ownerName: '',
  category: 'DJ',
  city: 'Ahmedabad',
  area: '',
  phone: '',
  whatsapp: '',
  email: '',
  description: '',
  startingPrice: 0,
  packageName: '',
  packagePrice: 0,
  packageDescription: '',
  websiteOrInstagram: '',
  isAccurate: false,
});

const numberInputClass = 'w-full rounded-xl border border-[#d7c39e] bg-[#fdf9f2] px-3.5 py-2.5 text-sm text-[#241d15] placeholder:text-[#867c69] focus:border-[#b88943] focus:outline-none';

interface VendorOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VendorOnboardingModal: React.FC<VendorOnboardingModalProps> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState(createEmptyForm());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isReviewVisible, setIsReviewVisible] = useState(false);

  const pendingVendors = useMemo(() => getStoredVendorApplications().filter((entry) => entry.status === 'pending'), []);

  if (!isOpen) return null;

  const updateField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.businessName.trim() || !form.ownerName.trim() || !form.description.trim() || !form.isAccurate) {
      return;
    }

    const submission: VendorApplicationInput = {
      id: `vendor_app_${Date.now()}`,
      ...form,
      startingPrice: Number(form.startingPrice) || 0,
      packagePrice: Number(form.packagePrice) || 0,
      status: 'pending',
      createdAt: new Date().toISOString(),
      source: 'submitted',
    };

    const existing = getStoredVendorApplications();
    saveVendorApplications([submission, ...existing]);
    setIsSubmitted(true);
    setIsReviewVisible(true);
    setForm(createEmptyForm());
  };

  const handleToggleReview = () => {
    setIsReviewVisible((prev) => !prev);
  };

  const handleDecision = (vendorId: string, status: 'approved' | 'rejected') => {
    const all = getStoredVendorApplications();
    const updated = all.map((entry) => (entry.id === vendorId ? { ...entry, status } : entry));
    saveVendorApplications(updated);
    setIsReviewVisible((prev) => !prev);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#080b0d]/80 p-3 backdrop-blur-md sm:p-6">
      <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[28px] border border-[#d7b67a]/25 bg-[#130f0d] shadow-[0_28px_80px_rgba(0,0,0,0.45)]">
        <div className="flex items-center justify-between border-b border-[#30261b] bg-gradient-to-r from-[#1b150f] via-[#1f1913] to-[#150f0c] px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d9b770]/30 bg-[#d9b770]/10 text-[#f3d18a]">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d0a864]">For Vendors</p>
              <h2 className="text-xl font-black text-[#fff6e5]">List Your Business</h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#4b3d2b] bg-[#17120f] p-2 text-[#e8d7b5] transition hover:border-[#deba76] hover:text-white"
            aria-label="Close vendor onboarding"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-6 p-5 sm:p-6 xl:grid-cols-[1.5fr_0.9fr]">
          <form onSubmit={handleSubmit} className="space-y-5">
            {isSubmitted && (
              <div className="rounded-2xl border border-[#d0a864]/25 bg-[#f5e7bf]/10 p-4 text-sm text-[#f7df9e]">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="h-4 w-4" />
                  Application submitted. Our team will review your business before it appears on EventBudget.
                </div>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 sm:col-span-1">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#d0a864]">Business name</span>
                <input
                  value={form.businessName}
                  onChange={(e) => updateField('businessName', e.target.value)}
                  className={numberInputClass}
                  placeholder="e.g. Jaipur Wedding Decor"
                />
              </label>

              <label className="space-y-1.5 sm:col-span-1">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#d0a864]">Owner / contact name</span>
                <input
                  value={form.ownerName}
                  onChange={(e) => updateField('ownerName', e.target.value)}
                  className={numberInputClass}
                  placeholder="Name of the business owner"
                />
              </label>

              <label className="space-y-1.5 sm:col-span-1">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#d0a864]">Vendor category</span>
                <select
                  value={form.category}
                  onChange={(e) => updateField('category', e.target.value as Exclude<VendorCategory, 'ALL'>)}
                  className={numberInputClass}
                >
                  {categoryOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-1.5 sm:col-span-1">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#d0a864]">City / service area</span>
                <input
                  value={form.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  className={numberInputClass}
                  placeholder="Ahmedabad"
                />
              </label>

              <label className="space-y-1.5 sm:col-span-1">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#d0a864]">Business area</span>
                <input
                  value={form.area}
                  onChange={(e) => updateField('area', e.target.value)}
                  className={numberInputClass}
                  placeholder="Satellite / Bodakdev"
                />
              </label>

              <label className="space-y-1.5 sm:col-span-1">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#d0a864]">Phone</span>
                <input
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className={numberInputClass}
                  placeholder="+91 98765 43210"
                />
              </label>

              <label className="space-y-1.5 sm:col-span-1">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#d0a864]">WhatsApp</span>
                <input
                  value={form.whatsapp}
                  onChange={(e) => updateField('whatsapp', e.target.value)}
                  className={numberInputClass}
                  placeholder="+91 98765 43210"
                />
              </label>

              <label className="space-y-1.5 sm:col-span-2">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#d0a864]">Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className={numberInputClass}
                  placeholder="hello@business.com"
                />
              </label>

              <label className="space-y-1.5 sm:col-span-2">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#d0a864]">Business description</span>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  className={numberInputClass}
                  placeholder="Tell couples and planners what your business offers."
                />
              </label>

              <label className="space-y-1.5 sm:col-span-1">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#d0a864]">Starting price</span>
                <input
                  type="number"
                  min="0"
                  value={form.startingPrice}
                  onChange={(e) => updateField('startingPrice', Number(e.target.value))}
                  className={numberInputClass}
                  placeholder="15000"
                />
              </label>

              <label className="space-y-1.5 sm:col-span-1">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#d0a864]">Package name</span>
                <input
                  value={form.packageName}
                  onChange={(e) => updateField('packageName', e.target.value)}
                  className={numberInputClass}
                  placeholder="Wedding DJ Package"
                />
              </label>

              <label className="space-y-1.5 sm:col-span-1">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#d0a864]">Package price</span>
                <input
                  type="number"
                  min="0"
                  value={form.packagePrice}
                  onChange={(e) => updateField('packagePrice', Number(e.target.value))}
                  className={numberInputClass}
                  placeholder="25000"
                />
              </label>

              <label className="space-y-1.5 sm:col-span-1">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#d0a864]">Instagram / website</span>
                <input
                  value={form.websiteOrInstagram}
                  onChange={(e) => updateField('websiteOrInstagram', e.target.value)}
                  className={numberInputClass}
                  placeholder="instagram.com/yourbusiness"
                />
              </label>

              <label className="space-y-1.5 sm:col-span-2">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#d0a864]">Package description</span>
                <textarea
                  rows={3}
                  value={form.packageDescription}
                  onChange={(e) => updateField('packageDescription', e.target.value)}
                  className={numberInputClass}
                  placeholder="Describe inclusions, service duration, equipment, or what guests receive."
                />
              </label>
            </div>

            <label className="flex items-start gap-3 rounded-2xl border border-[#d7c39e] bg-[#f7f1e7] p-3 text-sm text-[#241d15]">
              <input
                type="checkbox"
                checked={form.isAccurate}
                onChange={(e) => updateField('isAccurate', e.target.checked)}
                className="mt-1 h-4 w-4 accent-[#b88943]"
              />
              <span>I confirm the information submitted above is accurate and I understand it will be reviewed before appearing on EventBudget.</span>
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-[#4b3d2b] bg-[#17120f] px-4 py-2.5 text-sm font-bold text-[#f2e2b5]"
              >
                Close
              </button>
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-[#c89542] via-[#f0d890] to-[#c89542] px-5 py-2.5 text-sm font-black text-[#1b140e] shadow-[0_8px_22px_rgba(192,144,67,0.3)]"
              >
                Submit for Review
              </button>
            </div>
          </form>

          <aside className="space-y-4 rounded-[24px] border border-[#2d241d] bg-[#17120f] p-4">
            <div className="rounded-2xl border border-[#d9b770]/20 bg-[#f6e9cd]/5 p-4">
              <div className="mb-3 flex items-center gap-2 text-[#f0ce7e]">
                <BellRing className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.18em]">Prototype</span>
              </div>
              <p className="text-sm text-[#f4ebdb]">
                This is a local prototype only. Submissions are stored in the browser and are not sent to a live backend.
              </p>
            </div>

            <div className="rounded-2xl border border-[#2d241d] bg-[#100d0b] p-4">
              <div className="mb-3 flex items-center gap-2 text-[#f0ce7e]">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.18em]">Admin prototype</span>
              </div>

              <button
                type="button"
                onClick={handleToggleReview}
                className="w-full rounded-xl border border-[#d7c39e] bg-[#f9f4ee] px-3 py-2 text-xs font-black uppercase tracking-[0.15em] text-[#241d15]"
              >
                {isReviewVisible ? 'Hide Pending Review' : 'View Pending Review'}
              </button>

              {isReviewVisible && (
                <div className="mt-3 space-y-3">
                  {pendingVendors.length === 0 ? (
                    <p className="text-xs text-[#d7c39e]">No pending vendor applications yet.</p>
                  ) : (
                    pendingVendors.map((vendor) => (
                      <div key={vendor.id} className="rounded-xl border border-[#d7c39e]/25 bg-[#201a14] p-3">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className="text-sm font-black text-[#fff5d6]">{vendor.businessName}</p>
                            <p className="text-[10px] uppercase tracking-[0.15em] text-[#d0a864]">{vendor.category}</p>
                          </div>
                          <span className="rounded-full border border-[#f0ce7e]/30 bg-[#f0ce7e]/10 px-2 py-1 text-[9px] font-black uppercase tracking-[0.15em] text-[#f3d18a]">
                            Pending Review
                          </span>
                        </div>

                        <div className="mt-2 flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleDecision(vendor.id, 'approved')}
                            className="flex-1 rounded-lg bg-[#d9b770]/20 px-2 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#f5d999]"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDecision(vendor.id, 'rejected')}
                            className="flex-1 rounded-lg bg-[#3a2a22] px-2 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#f5c4a1]"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2 rounded-2xl border border-[#2d241d] bg-[#100d0b] p-4 text-sm text-[#eadcc3]">
              <p className="flex items-center gap-2"><User className="h-4 w-4 text-[#d0a864]" /> Business name + owner info</p>
              <p className="flex items-center gap-2"><Smartphone className="h-4 w-4 text-[#d0a864]" /> Contact and WhatsApp</p>
              <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#d0a864]" /> Email and pricing details</p>
              <p className="flex items-center gap-2"><Globe className="h-4 w-4 text-[#d0a864]" /> Instagram / website link</p>
              <p className="flex items-center gap-2"><CircleDollarSign className="h-4 w-4 text-[#d0a864]" /> Package pricing and start price</p>
              <p className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#d0a864]" /> Review before appearance</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
