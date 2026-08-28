import React from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  TrendingUp,
  Activity
} from 'lucide-react';
import { EventState, HealthScoreBreakdown } from '../../types';
import { calculateEventHealthScore } from '../../utils/eventScoring';

interface HealthScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventState;
}

export const HealthScoreModal: React.FC<HealthScoreModalProps> = ({
  isOpen,
  onClose,
  event,
}) => {
  if (!isOpen) return null;

  const scoreData: HealthScoreBreakdown = calculateEventHealthScore(event);

  const pillars = [
    { label: 'Budget Control', score: scoreData.budgetControl, weight: '30%', desc: 'Adherence to total budget limit without deficit' },
    { label: 'Emergency Buffer', score: scoreData.emergencyBuffer, weight: '20%', desc: 'Adequacy of rainy-day contingency reserve (8–15%)' },
    { label: 'Food Planning', score: scoreData.foodPlanning, weight: '20%', desc: 'Per-guest meal cost realism and menu balance' },
    { label: 'Priority Protection', score: scoreData.priorityProtection, weight: '15%', desc: `Sufficient funding for ${event.priority} focus` },
    { label: 'Flexibility & Quotes', score: scoreData.flexibility, weight: '15%', desc: 'Verified local vendor quotes applied over estimates' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0f172a] border border-slate-700/90 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
              <Activity className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-heading">Event Health Score Breakdown</h2>
              <p className="text-xs text-slate-400">Algorithmic evaluation across 5 operational pillars</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Main Score Hero Box */}
          <div className="p-6 rounded-3xl bg-slate-950/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div
                className="w-24 h-24 rounded-2xl flex flex-col items-center justify-center border shadow-xl"
                style={{
                  backgroundColor: `${scoreData.statusColor}15`,
                  borderColor: `${scoreData.statusColor}50`,
                }}
              >
                <span className="text-3xl font-black" style={{ color: scoreData.statusColor }}>
                  {scoreData.overallScore}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider -mt-1">
                  / 100
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full animate-pulse"
                    style={{ backgroundColor: scoreData.statusColor }}
                  />
                  <h3 className="text-lg font-bold text-white">
                    Status: <span style={{ color: scoreData.statusColor }}>{scoreData.status} Plan</span>
                  </h3>
                </div>
                <p className="text-xs text-slate-400 max-w-xs">
                  {scoreData.overallScore >= 80
                    ? 'Your event budget structure is resilient, realistic, and well protected.'
                    : scoreData.overallScore >= 60
                    ? 'Your budget is tight. Modest unexpected costs may lead to overspending.'
                    : 'High risk of overspending on event day. Immediate adjustments recommended.'}
                </p>
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-slate-800 sm:pl-6">
              <p className="text-[11px] text-slate-500 uppercase font-semibold">Priority Focus</p>
              <p className="text-sm font-bold text-purple-300">{event.priority}</p>
              <p className="text-[11px] text-slate-500 uppercase font-semibold mt-2">Market Locality</p>
              <p className="text-xs font-semibold text-slate-300">{event.city}</p>
            </div>
          </div>

          {/* 5 Pillars Progress Bars */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              5-Pillar Score Assessment
            </h4>
            <div className="space-y-3">
              {pillars.map((pillar, idx) => {
                const getBarColor = (score: number) => {
                  if (score >= 85) return 'bg-emerald-400';
                  if (score >= 65) return 'bg-amber-400';
                  return 'bg-rose-400';
                };

                return (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white">{pillar.label}</span>
                        <span className="text-[10px] text-slate-500 ml-2">({pillar.weight} weight)</span>
                      </div>
                      <span className="font-mono font-bold text-slate-200">{pillar.score}/100</span>
                    </div>

                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getBarColor(pillar.score)} transition-all duration-500 rounded-full`}
                        style={{ width: `${pillar.score}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-slate-400">{pillar.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Diagnostic Explanations */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Why this score was given:
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {scoreData.explanations.map((exp, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                  <span>{exp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actionable Recommendations */}
          {scoreData.recommendations.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                Actionable tips to reach 95+ Health:
              </h4>
              <ul className="space-y-1.5 text-xs text-amber-200/90">
                {scoreData.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">→</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
