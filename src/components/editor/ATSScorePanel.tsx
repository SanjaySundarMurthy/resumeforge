/* ── ResumeForge — ATS Score Panel v3 (Brutal & Honest + Job URL) ── */
'use client';

import { useMemo, useState } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { calculateATSScore, getScoreLabel, getKeywordMatchColor } from '@/lib/ats-scorer';
import type { JobDescription } from '@/types/resume';
import {
  CheckCircle2, AlertTriangle, XCircle, Lightbulb,
  Briefcase, Target, ChevronDown, ChevronUp, Zap,
  Link2, Loader2, Globe, ClipboardPaste,
} from 'lucide-react';

/* ── Brutality tips severity config ─────────────────────── */
const SEV = {
  critical: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Critical', dot: 'bg-red-500' },
  warning:  { icon: AlertTriangle, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Warning', dot: 'bg-amber-500' },
  tip:      { icon: Lightbulb, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Tip', dot: 'bg-blue-500' },
} as const;

/* ─────────────────────────────────────────────────────────── */
export default function ATSScorePanel() {
  const { data, jobDescription, setJobDescription, clearJobDescription, getCompletenessScore } = useResumeStore();

  const [showJDInput, setShowJDInput] = useState(false);
  const [localJD, setLocalJD] = useState<JobDescription>(jobDescription);
  const [expandedTips, setExpandedTips] = useState<Set<number>>(new Set());
  const [jobUrl, setJobUrl] = useState('');
  const [fetchingUrl, setFetchingUrl] = useState(false);
  const [urlError, setUrlError] = useState('');

  const completeness = useMemo(() => getCompletenessScore(), [data]);

  const atsResult = useMemo(
    () => calculateATSScore(data, jobDescription.text ? jobDescription : undefined),
    [data, jobDescription],
  );
  const label = getScoreLabel(atsResult.score);
  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (atsResult.score / 100) * circumference;

  const brutalTips: Array<{severity: string; message: string; section?: string; fix?: string; impact?: string}> = (atsResult as any).brutalTips ?? [];
  const keywordAnalysis: {matched: string[]; missing: string[]; density: number; verdict: string} | undefined = (atsResult as any).keywordAnalysis;

  const criticals = brutalTips.filter((t) => t.severity === 'critical');
  const warnings = brutalTips.filter((t) => t.severity === 'warning');
  const tips = brutalTips.filter((t) => t.severity === 'tip');

  const handleSaveJD = () => {
    setJobDescription(localJD);
    setShowJDInput(false);
  };

  /* ── Job URL fetch — extracts text from a job posting URL ── */
  const handleFetchJobUrl = async () => {
    if (!jobUrl.trim()) return;
    setFetchingUrl(true);
    setUrlError('');
    try {
      // Use a public CORS proxy to fetch the page HTML
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(jobUrl.trim())}`;
      const resp = await fetch(proxyUrl, { signal: AbortSignal.timeout(15000) });
      if (!resp.ok) throw new Error('Failed to fetch page');
      const html = await resp.text();

      // Parse HTML and extract meaningful text
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Remove script, style, nav, header, footer elements
      doc.querySelectorAll('script, style, nav, header, footer, noscript, iframe, svg').forEach(el => el.remove());

      // Try to find job description containers
      const selectors = [
        '[class*="job-description"]', '[class*="jobDescription"]',
        '[class*="job-details"]', '[class*="jobDetails"]',
        '[class*="description__text"]', '[class*="posting-requirements"]',
        '[id*="job-description"]', '[id*="jobDescription"]',
        'article', '[role="main"]', 'main',
      ];

      let jobText = '';
      for (const sel of selectors) {
        const el = doc.querySelector(sel);
        if (el && el.textContent && el.textContent.trim().length > 100) {
          jobText = el.textContent.trim();
          break;
        }
      }

      // Fallback: use body text
      if (!jobText || jobText.length < 100) {
        jobText = doc.body?.textContent?.trim() || '';
      }

      // Clean up whitespace
      jobText = jobText.replace(/\s+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();

      // Try to extract title from page
      const titleEl = doc.querySelector('h1') || doc.querySelector('title');
      const pageTitle = titleEl?.textContent?.trim() || '';

      if (jobText.length < 50) {
        setUrlError('Could not extract enough text from this URL. Try pasting the job description directly.');
      } else {
        // Truncate if too long
        if (jobText.length > 5000) jobText = jobText.slice(0, 5000);

        setLocalJD({
          title: pageTitle.slice(0, 100) || localJD.title,
          company: localJD.company,
          text: jobText,
        });
        setJobUrl('');
      }
    } catch (err: any) {
      if (err.name === 'AbortError' || err.name === 'TimeoutError') {
        setUrlError('Request timed out. Please paste the job description manually.');
      } else {
        setUrlError('Could not fetch URL. Try pasting the job description directly instead.');
      }
    } finally {
      setFetchingUrl(false);
    }
  };

  const toggleTip = (i: number) => {
    setExpandedTips((prev) => {
      const n = new Set(prev);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });
  };

  return (
    <div className="space-y-5 p-1">
      {/* ── Score Circle ── */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 border border-gray-100" role="region" aria-label="ATS Score">
        <div className="flex items-center gap-4">
          <div className="relative w-28 h-28 shrink-0" role="img" aria-label={`ATS Score: ${atsResult.score} out of 100. Rating: ${label.label}`}>
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
              <circle cx="60" cy="60" r="54" stroke="#f1f5f9" strokeWidth="9" fill="none" />
              <circle
                cx="60" cy="60" r="54"
                stroke={label.color}
                strokeWidth="9"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-gray-900">{atsResult.score}</span>
              <span className="text-[9px] font-bold tracking-wide uppercase" style={{ color: label.color }}>{label.label}</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-900">{label.advice}</p>
            <div className="mt-3 space-y-1">
              {criticals.length > 0 && (
                <div className="flex items-center gap-1.5 text-red-600">
                  <XCircle className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-xs font-semibold">{criticals.length} critical issue{criticals.length > 1 ? 's' : ''}</span>
                </div>
              )}
              {warnings.length > 0 && (
                <div className="flex items-center gap-1.5 text-amber-600">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-xs font-semibold">{warnings.length} warning{warnings.length > 1 ? 's' : ''}</span>
                </div>
              )}
              {criticals.length === 0 && warnings.length === 0 && (
                <div className="flex items-center gap-1.5 text-green-600">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-xs font-semibold">No critical issues</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Completeness bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Profile Completeness</span>
            <span className="text-xs font-bold text-gray-700">{completeness}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${completeness}%`,
                backgroundColor: completeness >= 80 ? '#10b981' : completeness >= 60 ? '#3b82f6' : '#f59e0b',
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Job Description Matching ── */}
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <button
          onClick={() => setShowJDInput(!showJDInput)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-bold text-gray-800">Job Description Match</span>
            {jobDescription.text && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-100 text-purple-700">Active</span>
            )}
          </div>
          {showJDInput ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
        </button>

        {showJDInput && (
          <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-3">
            {/* Job URL Import */}
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Globe className="w-3 h-3" /> Import from URL
              </p>
              <p className="text-[9px] text-gray-400 mb-1.5">Job page content is fetched via a third-party proxy (allorigins.win). No personal data is sent.</p>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Paste LinkedIn/Indeed job URL..."
                  value={jobUrl}
                  onChange={(e) => { setJobUrl(e.target.value); setUrlError(''); }}
                  className="input-field text-xs flex-1"
                  onKeyDown={(e) => { if (e.key === 'Enter') handleFetchJobUrl(); }}
                />
                <button
                  onClick={handleFetchJobUrl}
                  disabled={fetchingUrl || !jobUrl.trim()}
                  className="btn-secondary text-xs px-3 py-2 gap-1 shrink-0"
                >
                  {fetchingUrl ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Link2 className="w-3.5 h-3.5" />}
                  {fetchingUrl ? 'Fetching...' : 'Fetch'}
                </button>
              </div>
              {urlError && <p className="text-[10px] text-red-500 mt-1.5">{urlError}</p>}
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <span className="relative bg-gray-50 px-3 text-[9px] text-gray-400 uppercase tracking-wider">or paste manually</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Job Title"
                value={localJD.title}
                onChange={(e) => setLocalJD({ ...localJD, title: e.target.value })}
                className="input-field text-xs"
              />
              <input
                type="text"
                placeholder="Company"
                value={localJD.company}
                onChange={(e) => setLocalJD({ ...localJD, company: e.target.value })}
                className="input-field text-xs"
              />
            </div>
            <textarea
              rows={6}
              placeholder="Paste the full job description here for keyword matching and tailored ATS scoring…"
              value={localJD.text}
              onChange={(e) => setLocalJD({ ...localJD, text: e.target.value })}
              className="input-field text-xs resize-none"
            />
            <div className="flex gap-2">
              <button onClick={handleSaveJD} className="btn-primary text-xs flex-1 gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Analyze Match
              </button>
              {jobDescription.text && (
                <button
                  onClick={() => { clearJobDescription(); setLocalJD({ title: '', company: '', text: '' }); setShowJDInput(false); }}
                  className="btn-ghost text-xs"
                >Clear</button>
              )}
            </div>
          </div>
        )}

        {/* Keyword analysis results */}
        {keywordAnalysis && (
          <div className="p-4 border-t border-gray-100 bg-purple-50/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">Keyword Match</span>
              <span
                className="text-sm font-black"
                style={{ color: getKeywordMatchColor(keywordAnalysis.matched.length / Math.max(keywordAnalysis.matched.length + keywordAnalysis.missing.length, 1)) }}
              >
                {keywordAnalysis.matched.length}/{keywordAnalysis.matched.length + keywordAnalysis.missing.length}
              </span>
            </div>
            {/* density bar */}
            <div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(keywordAnalysis.density * 100, 100)}%`,
                    backgroundColor: '#8b5cf6',
                  }}
                />
              </div>
              <p className="text-[9px] text-gray-500 mt-0.5">{keywordAnalysis.verdict}</p>
            </div>
            {/* matched */}
            {keywordAnalysis.matched.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-green-700 mb-1">✓ Matched Keywords</p>
                <div className="flex flex-wrap gap-1">
                  {keywordAnalysis.matched.map((k: string) => (
                    <span key={k} className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-green-100 text-green-700 border border-green-200">{k}</span>
                  ))}
                </div>
              </div>
            )}
            {/* missing */}
            {keywordAnalysis.missing.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-red-600 mb-1">✗ Missing Keywords</p>
                <div className="flex flex-wrap gap-1">
                  {keywordAnalysis.missing.slice(0, 12).map((k: string) => (
                    <span key={k} className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-red-50 text-red-600 border border-red-200">{k}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Score Breakdown ── */}
      <div>
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Score Breakdown</h3>
        <div className="space-y-2.5">
          {atsResult.breakdown.map((item) => {
            const pct = item.maxScore > 0 ? Math.round((item.score / item.maxScore) * 100) : 0;
            const barColor = pct >= 80 ? '#10b981' : pct >= 60 ? '#3b82f6' : pct >= 40 ? '#f59e0b' : '#ef4444';
            const icon = pct >= 80 ? '✓' : pct >= 60 ? '~' : '✗';
            return (
              <div key={item.category}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs" style={{ color: barColor }}>{icon}</span>
                    <span className="text-xs font-medium text-gray-700">{item.category}</span>
                  </div>
                  <span className="text-xs font-bold tabular-nums" style={{ color: barColor }}>{pct}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-600 ease-out" style={{ width: `${pct}%`, backgroundColor: barColor }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Brutal Feedback ── */}
      {brutalTips.length > 0 && (
        <div>
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Briefcase className="w-3 h-3" /> Brutal Honest Feedback
          </h3>
          <div className="space-y-2">
            {/* Criticals first */}
            {[...criticals, ...warnings, ...tips].map((tip, i: number) => {
              const s = SEV[tip.severity as keyof typeof SEV];
              const Icon = s.icon;
              const expanded = expandedTips.has(i);
              return (
                <div key={i} className={`rounded-xl border ${s.bg} ${s.border} overflow-hidden`}>
                  <button
                    onClick={() => toggleTip(i)}
                    className="w-full flex items-start gap-2.5 p-3 text-left"
                  >
                    <Icon className={`w-3.5 h-3.5 ${s.color} shrink-0 mt-0.5`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${s.color}`}>{s.label}</span>
                        {tip.section && <span className="text-[9px] text-gray-400">— {tip.section}</span>}
                      </div>
                      <p className={`text-xs leading-relaxed ${s.color} font-medium`}>{tip.message}</p>
                    </div>
                    {(tip.fix || tip.impact) && (
                      expanded ? <ChevronUp className="w-3 h-3 text-gray-400 shrink-0 mt-1" /> : <ChevronDown className="w-3 h-3 text-gray-400 shrink-0 mt-1" />
                    )}
                  </button>
                  {expanded && (tip.fix || tip.impact) && (
                    <div className="px-3 pb-3 pl-8 space-y-1">
                      {tip.fix && (
                        <p className="text-[11px] text-gray-600">
                          <span className="font-semibold text-gray-700">Fix: </span>{tip.fix}
                        </p>
                      )}
                      {tip.impact && (
                        <p className="text-[11px] text-gray-500">
                          <span className="font-semibold">Impact: </span>{tip.impact}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {atsResult.score >= 85 && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-green-800">Your resume is ATS-optimized!</p>
            <p className="text-[11px] text-green-600 mt-0.5">Recruiters and ATS systems will love this resume. Stay confident and apply!</p>
          </div>
        </div>
      )}
    </div>
  );
}
