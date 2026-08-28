import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  IndianRupee,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Vendor, VendorQuote, CategoryKey } from '../../types';
import { CATEGORIES_INFO } from '../../data/initialData';

interface QuoteManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: Vendor | null;
  onSaveQuote: (quote: VendorQuote) => void;
}

export const QuoteManagerModal: React.FC<QuoteManagerModalProps> = ({
  isOpen,
  onClose,
  vendor,
  onSaveQuote,
}) => {
  const [vendorName, setVendorName] = useState('');
  const [categoryKey, setCategoryKey] = useState<CategoryKey>('dj');
  const [quotedAmount, setQuotedAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (vendor) {
      setVendorName(vendor.name);
      setCategoryKey(vendor.categoryKey);
    } else {
      setVendorName('');
      setCategoryKey('dj');
    }
    setQuotedAmount('');
    setNotes('');
    setError('');
  }, [vendor, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(quotedAmount);

    if (!vendorName.trim()) {
      setError('Please enter vendor / agency name.');
      return;
    }
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid positive quote amount.');
      return;
    }

    const catInfo = CATEGORIES_INFO.find(c => c.key === categoryKey);

    const newQuote: VendorQuote = {
      id: `quote_${Date.now()}`,
      vendorId: vendor?.id,
      vendorName: vendorName.trim(),
      categoryKey,
      categoryName: catInfo?.name || 'Service',
      quotedAmount: amountNum,
      notes: notes.trim(),
      date: new Date().toISOString().split('T')[0],
      applied: false,
    };

    onSaveQuote(newQuote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0f172a] border border-slate-700/90 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-heading">Record Vendor Quotation</h2>
              <p className="text-xs text-slate-400">Save quotes to compare and apply to your plan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Vendor / Business Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              placeholder="e.g. DJ PRANS or Vinayak Caterers"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium text-xs focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Service Category <span className="text-rose-400">*</span>
            </label>
            <select
              value={categoryKey}
              onChange={(e) => setCategoryKey(e.target.value as CategoryKey)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium text-xs focus:border-purple-500"
            >
              {CATEGORIES_INFO.filter(c => c.key !== 'buffer').map((c) => (
                <option key={c.key} value={c.key}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Quoted Amount (₹) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <IndianRupee className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                min="100"
                step="500"
                value={quotedAmount}
                onChange={(e) => setQuotedAmount(e.target.value)}
                placeholder="e.g. 5500"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Quotation Notes & Inclusions
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Includes 2 top speakers, console, lighting, and DJ playlist for 4 hours."
              className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-medium text-xs focus:border-purple-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-md shadow-purple-600/30 active:scale-95 transition-all"
            >
              Save Quote
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
