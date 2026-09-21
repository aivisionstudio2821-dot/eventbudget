import React, { useEffect, useState } from 'react';
import {
  Store,
  Search,
  ShieldAlert,
  Sparkles,
  Lock,
  Crown,
  FileText,
} from 'lucide-react';
import { Vendor, VendorCategory, EventState, VendorQuote } from '../../types';
import { VendorCard } from './VendorCard';
import { QuoteManagerModal } from './QuoteManagerModal';
import { QuoteComparison } from './QuoteComparison';
import { getApprovedMarketplaceVendors, getDemoVendors } from '../../services/vendorRepository';

interface VendorMarketplaceProps {
  event: EventState | null;
  isProActive: boolean;
  onUpgradeClick: () => void;
  onSaveQuote: (quote: VendorQuote) => void;
  onApplyQuote: (quote: VendorQuote) => void;
  onRemoveQuote: (quoteId: string) => void;
  onFixMyBudget: () => void;
}

const CATEGORY_FILTERS: { id: VendorCategory; label: string }[] = [
  { id: 'ALL', label: 'All Services' },
  { id: 'DJ', label: 'DJ & Sound' },
  { id: 'CATERING', label: 'Catering & Food' },
  { id: 'EVENT MANAGEMENT', label: 'Event Management' },
  { id: 'DECORATION', label: 'Decoration & Props' },
  { id: 'PHOTOGRAPHY', label: 'Photography & Film' },
  { id: 'VENUE', label: 'Venues & Halls' },
];

export const VendorMarketplace: React.FC<VendorMarketplaceProps> = ({
  event,
  isProActive,
  onUpgradeClick,
  onSaveQuote,
  onApplyQuote,
  onRemoveQuote,
  onFixMyBudget,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<VendorCategory>('ALL');
  const [selectedVendorForQuote, setSelectedVendorForQuote] = useState<Vendor | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'directory' | 'quotes'>('directory');
  const [marketplaceVendors, setMarketplaceVendors] = useState(getDemoVendors);

  useEffect(() => {
    let isMounted = true;

    getApprovedMarketplaceVendors()
      .then((vendors) => {
        if (isMounted) setMarketplaceVendors(vendors);
      })
      .catch((error) => {
        console.error('Vendor marketplace is using demo listings:', error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredVendors = marketplaceVendors.filter((vendor) => {
    const matchesCategory = selectedCategory === 'ALL' || vendor.category === selectedCategory;
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const handleOpenQuoteModal = (vendor: Vendor) => {
    setSelectedVendorForQuote(vendor);
    setIsQuoteModalOpen(true);
  };

  const handleOpenCustomQuote = () => {
    if (!isProActive) {
      onUpgradeClick();
      return;
    }

    setSelectedVendorForQuote(null);
    setIsQuoteModalOpen(true);
  };

  const handleVendorAction = (vendor: Vendor) => {
    if (!isProActive) {
      onUpgradeClick();
      return;
    }

    handleOpenQuoteModal(vendor);
  };

  const renderUpgradeGate = (title: string, description: string) => (
    <div className="rounded-[28px] border border-[#d9b770]/30 bg-gradient-to-br from-[#18130e] via-[#1d1711] to-[#110d0a] p-7 text-center shadow-[0_18px_50px_rgba(9,7,5,0.35)]">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#d9b770]/30 bg-[#f3d18a]/10 text-[#f3d18a]">
        <Lock className="h-8 w-8" />
      </div>
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#d9b770]/25 bg-[#d9b770]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#f3d18a]">
        <Crown className="h-3.5 w-3.5" />
        EventBudget PRO
      </div>
      <h3 className="text-2xl font-black text-[#fff8ef]">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-[#d5c4a7]">{description}</p>
      <button
        type="button"
        onClick={onUpgradeClick}
        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#c89542] via-[#f0d890] to-[#c89542] px-5 py-3 text-sm font-black text-[#1b140e] shadow-[0_12px_30px_rgba(195,147,76,0.33)] transition hover:brightness-110 active:scale-[0.99]"
      >
        <Sparkles className="h-4 w-4" />
        Unlock EventBudget PRO
      </button>
    </div>
  );

  return (
    <section id="vendors-section" className="py-12 sm:py-16 space-y-8">
      
      {/* Header & Mode Switcher */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/40 border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Store className="w-3.5 h-3.5 text-purple-400" />
            Hyperlocal Marketplace Pilot
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            FIND SERVICES FOR YOUR EVENT IN <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">AHMEDABAD</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Connect directly with verified local service providers via pre-filled WhatsApp quotes or phone calls.
          </p>
        </div>

        <div className="flex rounded-2xl bg-slate-950 p-1.5 border border-slate-800 self-start md:self-auto shrink-0">
          <button
            onClick={() => setViewMode('directory')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'directory'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🏢 Local Directory ({marketplaceVendors.length})
          </button>
          <button
            onClick={() => (isProActive ? setViewMode('quotes') : onUpgradeClick())}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'quotes'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="flex items-center gap-2">
              {isProActive ? `Compare Quotes (${event?.quotes?.length || 0})` : 'Compare Quotes'}
              {!isProActive && <Lock className="h-3.5 w-3.5" />}
            </span>
          </button>
        </div>
      </div>

      {/* Vendor Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-300">Vendor Disclaimer:</strong> Vendor details, pricing and availability may change. Please verify information directly with the service provider before booking. We do not claim exclusive partnerships.
        </p>
      </div>

      {!isProActive && viewMode === 'directory' && (
        renderUpgradeGate(
          'Vendor marketplace is a PRO feature',
          'Unlock real vendor discovery, quote capture, and quote comparisons to plan with local service providers.'
        )
      )}

      {!isProActive && viewMode === 'quotes' && (
        renderUpgradeGate(
          'Quote comparison is a PRO feature',
          'Track received vendor bids, compare pricing, and apply the best quote to your event plan.'
        )
      )}

      {/* View Mode 1: Directory */}
      {isProActive && viewMode === 'directory' && (
        <div className="space-y-6">
          
          {/* Search & Category Filter Chips */}
          <div className="space-y-4">
            
            {/* Search Input */}
            <div className="relative max-w-xl">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vendors or services in Ahmedabad (e.g. DJ PRANS, Gurukul, Dhol...)"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-white font-medium text-xs sm:text-sm focus:border-purple-500 placeholder:text-slate-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-2">
              {CATEGORY_FILTERS.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

          </div>

          {/* Vendors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredVendors.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                event={event}
                onOpenQuoteModal={handleVendorAction}
              />
            ))}
          </div>

          {filteredVendors.length === 0 && (
            <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800">
              <p className="text-sm font-bold text-slate-300">No vendors found matching "{searchQuery}"</p>
              <p className="text-xs text-slate-500 mt-1">Try searching for other areas or clear category filters.</p>
            </div>
          )}

        </div>
      )}

      {/* View Mode 2: Quote Comparison & Application */}
      {isProActive && viewMode === 'quotes' && event && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={handleOpenCustomQuote}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>+ Record New Quote</span>
            </button>
          </div>

          <QuoteComparison
            event={event}
            onApplyQuote={onApplyQuote}
            onRemoveQuote={onRemoveQuote}
            onFixMyBudget={onFixMyBudget}
          />
        </div>
      )}

      {/* Quote Manager Modal */}
      <QuoteManagerModal
        isOpen={isProActive && isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        vendor={selectedVendorForQuote}
        onSaveQuote={onSaveQuote}
      />

    </section>
  );
};
