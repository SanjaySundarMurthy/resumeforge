/* ── ResumeForge — ATS Score Panel ────────────────────────── */

'use client';

import { useMemo } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { calculateATSScore, getScoreLabel } from '@/lib/ats-scorer';
import { CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';

export default function ATSScorePanel() {
  const data = useResumeStore((s) => s.data);
  const atsResult = useMemo(() => calculateATSScore(data), [data]);
  const label = getScoreLabel(atsResult.score);

  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (atsResult.score / 100) * circumference;

  return (
    <div className="space-y-5 p-1">
      {/* Score circle */}
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" stroke="#f3f4f6" strokeWidth="8" fill="none" />
            <circle
              cx="60" cy="60" r="54"
              stroke={label.color}
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900">{atsResult.score}</span>
            <span className="text-xs font-semibold" style={{ color: label.color }}>{label.label}</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 text-center mt-2 max-w-xs">{label.description}</p>
      </div>

      {/* Breakdown */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Score Breakdown</h3>
        {atsResult.breakdown.map((item) => {
          const pct = Math.round(item.score);
          const barColor = pct >= 80 ? '#10b981' : pct >= 60 ? '#3b82f6' : pct >= 40 ? '#f59e0b' : '#ef4444';
          return (
            <div key={item.category}>
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-xs text-gray-700">{item.category}</span>
                <span className="text-xs font-semibold" style={{ color: barColor }}>{pct}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${pct}%`, backgroundColor: barColor }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips */}
      {atsResult.tips.length > 0 && (
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Improvement Tips</h3>
          {atsResult.tips.slice(0, 8).map((tip, i) => (
            <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-amber-50 border border-amber-100">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span className="text-[11px] text-amber-800 leading-relaxed">{tip}</span>
            </div>
          ))}
        </div>
      )}

      {atsResult.score >= 80 && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-green-50 border border-green-100">
          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
          <span className="text-xs text-green-800">Your resume is well-optimized for ATS systems. Keep up the great work!</span>
        </div>
      )}
    </div>
  );
}
