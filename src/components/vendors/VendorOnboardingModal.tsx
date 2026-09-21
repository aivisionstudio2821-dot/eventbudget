import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Store,
  User,
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
  submitVendorApplication,
} from '../../services/vendorRepository';

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
  const [submissionError, setSubmissionError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const updateField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.businessName.trim() || !form.ownerName.trim() || !form.description.trim() || !form.isAccurate) {
      return;
    }

    setSubmissionError('');
    setIsSubmitting(true);

    try {
      await submitVendorApplication({
        ...form,
        startingPrice: Number(form.startingPrice) || 0,
        packagePrice: Number(form.packagePrice) || 0,
      });

      setIsSubmitted(true);
      setForm(createEmptyForm());
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Vendor application could not be submitted.';
      setSubmissionError(message);
      console.error(message, error);
    } finally {
      setIsSubmitting(false);
    }
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
                  Application submitted. EventBudget will review your listing before it is published.
                </div>
              </div>
            )}

            {submissionError && (
              <div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
                {submissionError}
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
                disabled={isSubmitting}
                className="rounded-xl bg-gradient-to-r from-[#c89542] via-[#f0d890] to-[#c89542] px-5 py-2.5 text-sm font-black text-[#1b140e] shadow-[0_8px_22px_rgba(192,144,67,0.3)]"
              >
                {isSubmitting ? 'Submitting...' : 'Submit for Review'}
              </button>
            </div>

            <p className="text-[11px] text-[#d8c5a2]">
              Your application will be reviewed before it is published.
            </p>
          </form>

          <aside className="space-y-4 rounded-[24px] border border-[#2d241d] bg-[#17120f] p-4">
            <div className="rounded-2xl border border-[#d9b770]/20 bg-[#f6e9cd]/5 p-4">
              <div className="mb-3 flex items-center gap-2 text-[#f0ce7e]">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.18em]">Vendor Pilot</span>
              </div>
              <p className="text-sm text-[#f4ebdb]">
                EventBudget is currently onboarding selected vendors for its Ahmedabad pilot. Submitted information is reviewed before a listing is published.
              </p>
            </div>

            <div className="space-y-2 rounded-2xl border border-[#2d241d] bg-[#100d0b] p-4 text-sm text-[#eadcc3]">
              <div className="mb-2 flex items-center gap-2 text-[#f0ce7e]">
                <Sparkles className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.18em]">Why list on EventBudget?</span>
              </div>
              <p className="flex items-center gap-2"><User className="h-4 w-4 text-[#d0a864]" /> Free pilot listing</p>
              <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#d0a864]" /> Direct customer enquiries</p>
              <p className="flex items-center gap-2"><CircleDollarSign className="h-4 w-4 text-[#d0a864]" /> Package visibility</p>
              <p className="flex items-center gap-2"><Smartphone className="h-4 w-4 text-[#d0a864]" /> Quote requests</p>
              <p className="flex items-center gap-2"><Globe className="h-4 w-4 text-[#d0a864]" /> Review before publishing</p>
            </div>

            <div className="space-y-2 rounded-2xl border border-[#2d241d] bg-[#100d0b] p-4 text-sm text-[#eadcc3]">
              <p className="flex items-center gap-2"><User className="h-4 w-4 text-[#d0a864]" /> Business name + owner info</p>
              <p className="flex items-center gap-2"><Smartphone className="h-4 w-4 text-[#d0a864]" /> Contact and WhatsApp</p>
              <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#d0a864]" /> Email and pricing details</p>
              <p className="flex items-center gap-2"><Globe className="h-4 w-4 text-[#d0a864]" /> Instagram / website link</p>
              <p className="flex items-center gap-2"><CircleDollarSign className="h-4 w-4 text-[#d0a864]" /> Package pricing and start price</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
