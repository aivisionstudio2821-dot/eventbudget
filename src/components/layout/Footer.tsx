import React from 'react';
import { Sparkles, ShieldAlert, Heart, MapPin, Phone, MessageSquare } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#05070d] border-t border-slate-800/80 pt-16 pb-12 text-slate-400 text-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand & Pitch */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 p-[2px]">
                <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Event<span className="text-purple-400">Budget</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              “You set the budget. We plan the celebration.”
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              India’s premier intelligent event-budgeting & vendor marketplace platform. Designed to eliminate stress, stop silent overspending, and deliver transparent local execution.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Pilot City: Ahmedabad, Gujarat</span>
            </div>
          </div>

          {/* Quick Feature Navigation */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Smart Tools</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#dashboard-section" className="hover:text-purple-400 transition-colors">Smart Budget Allocation Engine</a></li>
              <li><a href="#planners-section" className="hover:text-purple-400 transition-colors">Food Menu & Live Counter Builder</a></li>
              <li><a href="#planners-section" className="hover:text-purple-400 transition-colors">10+ Decor Themes & Stage Customizer</a></li>
              <li><a href="#dashboard-section" className="hover:text-purple-400 transition-colors">Interactive Rebalance & “Fix My Budget”</a></li>
              <li><a href="#dashboard-section" className="hover:text-purple-400 transition-colors">“Can I Add This?” Expense Simulator</a></li>
              <li><a href="#dashboard-section" className="hover:text-purple-400 transition-colors">5-Pillar Event Health Score</a></li>
            </ul>
          </div>

          {/* Local Marketplace Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Ahmedabad Marketplace</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#vendors-section" className="hover:text-purple-400 transition-colors">DJ & Concert Sound (Ranip, SBR, Central)</a></li>
              <li><a href="#vendors-section" className="hover:text-purple-400 transition-colors">Pure Veg Gujarati & Punjabi Caterers (Gurukul)</a></li>
              <li><a href="#vendors-section" className="hover:text-purple-400 transition-colors">Theme & Stage Decorators (Bodakdev, Maninagar)</a></li>
              <li><a href="#vendors-section" className="hover:text-purple-400 transition-colors">Candid & Drone Photographers (Vastrapur)</a></li>
              <li><a href="#vendors-section" className="hover:text-purple-400 transition-colors">AC Party & Banquet Halls (Sindhu Bhavan)</a></li>
              <li><a href="#vendors-section" className="hover:text-purple-400 transition-colors">Multi-Vendor Quotation Comparison</a></li>
            </ul>
          </div>

          {/* Disclaimer Box */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Pricing & Vendor Disclaimer</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              All shown item prices inside Food, Decoration, DJ, Photography, and Venue are estimated market ranges. Final pricing and availability depend on vendor confirmation, exact date, guest count, and location customization. Please verify directly with service providers.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} <span className="text-slate-300 font-semibold">EventBudget</span> — Plan smarter. Celebrate better.
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-slate-400">
              Crafted with <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" /> for Next-Gen Event Tech
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
