import React, { useState } from 'react';
import {
  Store,
  Search,
  Filter,
  ShieldAlert,
  Sparkles,
  MapPin,
  FileText,
  CheckCircle2
} from 'lucide-react';
import { Vendor, VendorCategory, EventState, VendorQuote } from '../../types';
import { DEMO_VENDORS } from '../../data/demoVendors';
import { VendorCard } from './VendorCard';
import { QuoteManagerModal } from './QuoteManagerModal';
import { QuoteComparison } from './QuoteComparison';
import { formatINR } from '../../utils/currencyFormatter';

interface VendorMarketplaceProps {
  event: EventState | null;
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

  const filteredVendors = DEMO_VENDORS.filter((vendor) => {
    const matchesCategory = selectedCategory === 'ALL' || vendor.category === selectedCategory;
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const handleOpenQuoteModal = (vendor: Vendor) => {
    setSelectedVendorForQuote(vendor);
    setIsQuoteModalOpen(true);
  };

  const handleOpenCustomQuote = () => {
    setSelectedVendorForQuote(null);
    setIsQuoteModalOpen(true);
  };

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
            🏢 Local Directory ({DEMO_VENDORS.length})
          </button>
          <button
            onClick={() => setViewMode('quotes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'quotes'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Compare Quotes ({event?.quotes?.length || 0})</span>
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

      {/* View Mode 1: Directory */}
      {viewMode === 'directory' && (
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
                onOpenQuoteModal={handleOpenQuoteModal}
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
      {viewMode === 'quotes' && event && (
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
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        vendor={selectedVendorForQuote}
        onSaveQuote={onSaveQuote}
      />

    </section>
  );
};
