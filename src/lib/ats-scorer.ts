/* ── ResumeForge — ATS Scoring Engine ────────────────────── */

import type { ResumeData, ATSScore, SectionKey } from '@/types/resume';
import { wordCount, stripHtml } from '@/lib/utils';

/* ── Weights ─────────────────────────────────────────────── */

const WEIGHTS = {
  contactInfo: 10,
  summary: 10,
  experience: 25,
  education: 10,
  skills: 15,
  formatting: 10,
  keywords: 10,
  length: 5,
  actionVerbs: 5,
};

/* ── Action Verbs List ───────────────────────────────────── */

const ACTION_VERBS = new Set([
  'achieved', 'administered', 'advanced', 'analyzed', 'architected', 'automated',
  'built', 'championed', 'coached', 'collaborated', 'completed', 'conducted',
  'consolidated', 'contributed', 'coordinated', 'created', 'customized',
  'decreased', 'delivered', 'demonstrated', 'designed', 'developed', 'directed',
  'drove', 'earned', 'eliminated', 'enabled', 'engineered', 'enhanced',
  'established', 'evaluated', 'exceeded', 'executed', 'expanded', 'expedited',
  'facilitated', 'formulated', 'founded', 'generated', 'grew', 'guided',
  'headed', 'identified', 'implemented', 'improved', 'increased', 'influenced',
  'initiated', 'innovated', 'integrated', 'introduced', 'launched', 'led',
  'leveraged', 'managed', 'maximized', 'mentored', 'migrated', 'minimized',
  'modernized', 'monitored', 'negotiated', 'operated', 'optimized', 'orchestrated',
  'organized', 'overhauled', 'oversaw', 'partnered', 'performed', 'pioneered',
  'planned', 'presented', 'prioritized', 'produced', 'programmed', 'promoted',
  'proposed', 'provided', 'published', 'raised', 'recommended', 'reconciled',
  'recruited', 'redesigned', 'reduced', 'refined', 'replaced', 'resolved',
  'restructured', 'revamped', 'reviewed', 'revitalized', 'saved', 'scaled',
  'secured', 'simplified', 'solved', 'spearheaded', 'standardized', 'streamlined',
  'strengthened', 'supervised', 'surpassed', 'taught', 'trained', 'transformed',
  'unified', 'upgraded', 'utilized', 'validated', 'visualized', 'wrote',
]);

/* ── Quantifiable Metrics Regex ──────────────────────────── */

const METRICS_PATTERN = /\b(\d+[%+KkMm]?|\$[\d,.]+[KkMmBb]?)\b/;

/* ── Scoring Functions ───────────────────────────────────── */

function scoreContactInfo(data: ResumeData): { score: number; tips: string[] } {
  const tips: string[] = [];
  const pi = data.personalInfo;
  let score = 0;
  const checks = [
    { val: pi.firstName && pi.lastName, tip: 'Add your full name' },
    { val: pi.email, tip: 'Add your email address' },
    { val: pi.phone, tip: 'Add your phone number' },
    { val: pi.location, tip: 'Add your location (city, state)' },
    { val: pi.linkedin, tip: 'Add your LinkedIn profile URL — most recruiters check LinkedIn' },
  ];
  checks.forEach(({ val, tip }) => {
    if (val) score += 20;
    else tips.push(tip);
  });
  return { score, tips };
}

function scoreSummary(data: ResumeData): { score: number; tips: string[] } {
  const tips: string[] = [];
  const summary = data.summary.trim();
  if (!summary) {
    tips.push('Add a professional summary — it\'s the first thing recruiters read');
    return { score: 0, tips };
  }
  let score = 40; // has summary
  const wc = wordCount(summary);
  if (wc >= 30 && wc <= 80) {
    score += 30;
  } else if (wc < 30) {
    tips.push('Expand your summary to 30-80 words for optimal impact');
  } else {
    tips.push('Shorten your summary to 30-80 words — keep it concise');
  }
  const hasActionVerb = summary.toLowerCase().split(/\s+/).some((w) => ACTION_VERBS.has(w));
  if (hasActionVerb) score += 15;
  else tips.push('Start your summary with a strong action verb or role descriptor');
  if (METRICS_PATTERN.test(summary)) score += 15;
  else tips.push('Include quantifiable achievements in your summary (e.g., "7+ years", "50K+ users")');
  return { score: Math.min(score, 100), tips };
}

function scoreExperience(data: ResumeData): { score: number; tips: string[] } {
  const tips: string[] = [];
  if (data.experience.length === 0) {
    tips.push('Add at least one work experience entry');
    return { score: 0, tips };
  }
  let score = 20;
  // Check each experience
  let totalHighlights = 0;
  let highlightsWithMetrics = 0;
  let highlightsWithActionVerbs = 0;

  data.experience.forEach((exp, i) => {
    const label = exp.position || `Experience #${i + 1}`;
    if (!exp.company) tips.push(`Add company name for "${label}"`);
    if (!exp.position) tips.push(`Add position title for experience at "${exp.company || `#${i + 1}`}"`);
    if (!exp.startDate) tips.push(`Add start date for "${label}"`);

    exp.highlights.filter(Boolean).forEach((h) => {
      totalHighlights++;
      if (METRICS_PATTERN.test(h)) highlightsWithMetrics++;
      const firstWord = h.trim().split(/\s/)[0]?.toLowerCase();
      if (firstWord && ACTION_VERBS.has(firstWord)) highlightsWithActionVerbs++;
    });
  });

  // Quantity of highlights
  if (totalHighlights >= 6) score += 20;
  else if (totalHighlights >= 3) score += 10;
  else tips.push('Add at least 3-5 bullet points per role describing achievements');

  // Metrics in highlights
  const metricRatio = totalHighlights > 0 ? highlightsWithMetrics / totalHighlights : 0;
  if (metricRatio >= 0.5) score += 25;
  else if (metricRatio >= 0.25) score += 15;
  else tips.push('Add quantifiable metrics to at least 50% of bullet points (numbers, %, $)');

  // Action verbs
  const verbRatio = totalHighlights > 0 ? highlightsWithActionVerbs / totalHighlights : 0;
  if (verbRatio >= 0.7) score += 20;
  else if (verbRatio >= 0.4) score += 10;
  else tips.push('Start each bullet point with a strong action verb (Led, Built, Increased, etc.)');

  // Multiple roles
  if (data.experience.length >= 2) score += 15;
  else tips.push('Include at least 2 relevant work experiences if possible');

  return { score: Math.min(score, 100), tips };
}

function scoreEducation(data: ResumeData): { score: number; tips: string[] } {
  const tips: string[] = [];
  if (data.education.length === 0) {
    tips.push('Add your educational background');
    return { score: 0, tips };
  }
  let score = 50;
  const edu = data.education[0];
  if (edu.degree) score += 15;
  else tips.push('Specify your degree type (e.g., Bachelor of Science)');
  if (edu.field) score += 15;
  else tips.push('Add your field of study');
  if (edu.institution) score += 10;
  if (edu.startDate || edu.endDate) score += 10;
  return { score: Math.min(score, 100), tips };
}

function scoreSkills(data: ResumeData): { score: number; tips: string[] } {
  const tips: string[] = [];
  if (data.skills.length === 0) {
    tips.push('Add a skills section — it\'s critical for ATS keyword matching');
    return { score: 0, tips };
  }
  let totalSkills = 0;
  data.skills.forEach((cat) => {
    totalSkills += cat.items.length;
  });
  let score = 30;
  if (totalSkills >= 12) score += 30;
  else if (totalSkills >= 8) score += 20;
  else tips.push('Add more technical skills — aim for 12-20 relevant skills');

  if (data.skills.length >= 3) score += 20;
  else tips.push('Organize skills into 3-4 categories (e.g., Languages, Frameworks, Cloud)');

  const hasCategories = data.skills.every((s) => s.category.trim().length > 0);
  if (hasCategories) score += 20;
  else tips.push('Name each skill category for better organization');

  return { score: Math.min(score, 100), tips };
}

function scoreFormatting(data: ResumeData): { score: number; tips: string[] } {
  const tips: string[] = [];
  let score = 0;

  // Check section completeness
  const sections: { key: string; filled: boolean; tip: string }[] = [
    { key: 'summary', filled: !!data.summary.trim(), tip: 'Add a professional summary section' },
    { key: 'experience', filled: data.experience.length > 0, tip: 'Add work experience' },
    { key: 'education', filled: data.education.length > 0, tip: 'Add education' },
    { key: 'skills', filled: data.skills.length > 0, tip: 'Add a skills section' },
  ];

  const filled = sections.filter((s) => s.filled).length;
  score = (filled / sections.length) * 50;
  sections.filter((s) => !s.filled).forEach((s) => tips.push(s.tip));

  // Check for projects or certifications (bonus)
  if (data.projects.length > 0 || data.certifications.length > 0) {
    score += 25;
  } else {
    tips.push('Consider adding projects or certifications to strengthen your resume');
  }

  // Check personal info completeness
  const pi = data.personalInfo;
  if (pi.firstName && pi.lastName && pi.title) score += 25;
  else tips.push('Add your professional title below your name');

  return { score: Math.min(score, 100), tips };
}

function scoreLength(data: ResumeData): { score: number; tips: string[] } {
  const tips: string[] = [];
  // Estimate total content length
  let totalWords = 0;
  totalWords += wordCount(data.summary);
  data.experience.forEach((e) => {
    totalWords += wordCount(e.description);
    e.highlights.forEach((h) => (totalWords += wordCount(h)));
  });
  data.education.forEach((e) => {
    e.highlights.forEach((h) => (totalWords += wordCount(h)));
  });
  data.projects.forEach((p) => {
    totalWords += wordCount(p.description);
    p.highlights.forEach((h) => (totalWords += wordCount(h)));
  });

  if (totalWords >= 200 && totalWords <= 700) {
    return { score: 100, tips };
  } else if (totalWords < 200) {
    tips.push(`Your resume has ~${totalWords} words. Aim for 300-600 words for a 1-page resume`);
    return { score: Math.max((totalWords / 200) * 60, 10), tips };
  } else {
    tips.push(`Your resume has ~${totalWords} words. Consider trimming to 600 words to fit one page`);
    return { score: Math.max(100 - ((totalWords - 700) / 300) * 40, 40), tips };
  }
}

/* ── Main Scoring Function ───────────────────────────────── */

export function calculateATSScore(data: ResumeData): ATSScore {
  const contactResult = scoreContactInfo(data);
  const summaryResult = scoreSummary(data);
  const experienceResult = scoreExperience(data);
  const educationResult = scoreEducation(data);
  const skillsResult = scoreSkills(data);
  const formattingResult = scoreFormatting(data);
  const lengthResult = scoreLength(data);

  const tips = [
    ...contactResult.tips,
    ...summaryResult.tips,
    ...experienceResult.tips,
    ...educationResult.tips,
    ...skillsResult.tips,
    ...formattingResult.tips,
    ...lengthResult.tips,
  ];

  // Weighted average
  const score = Math.round(
    (contactResult.score * WEIGHTS.contactInfo +
      summaryResult.score * WEIGHTS.summary +
      experienceResult.score * WEIGHTS.experience +
      educationResult.score * WEIGHTS.education +
      skillsResult.score * WEIGHTS.skills +
      formattingResult.score * WEIGHTS.formatting +
      lengthResult.score * WEIGHTS.length) /
      Object.values(WEIGHTS).reduce((a, b) => a + b, 0)
  );

  const breakdown: ATSScore['breakdown'] = [
    { category: 'Contact Information', score: Math.round(contactResult.score), maxScore: 100, tips: contactResult.tips },
    { category: 'Professional Summary', score: Math.round(summaryResult.score), maxScore: 100, tips: summaryResult.tips },
    { category: 'Work Experience', score: Math.round(experienceResult.score), maxScore: 100, tips: experienceResult.tips },
    { category: 'Education', score: Math.round(educationResult.score), maxScore: 100, tips: educationResult.tips },
    { category: 'Skills', score: Math.round(skillsResult.score), maxScore: 100, tips: skillsResult.tips },
    { category: 'Formatting & Structure', score: Math.round(formattingResult.score), maxScore: 100, tips: formattingResult.tips },
    { category: 'Content Length', score: Math.round(lengthResult.score), maxScore: 100, tips: lengthResult.tips },
  ];

  return { score, tips, breakdown };
}

/**
 * Get a label for the ATS score
 */
export function getScoreLabel(score: number): { label: string; color: string; description: string } {
  if (score >= 90) return { label: 'Excellent', color: '#10b981', description: 'Your resume is highly optimized for ATS systems' };
  if (score >= 75) return { label: 'Good', color: '#3b82f6', description: 'Your resume is well-structured but has room for improvement' };
  if (score >= 60) return { label: 'Fair', color: '#f59e0b', description: 'Your resume needs some improvements for better ATS compatibility' };
  if (score >= 40) return { label: 'Needs Work', color: '#f97316', description: 'Several areas need attention to pass ATS screening' };
  return { label: 'Poor', color: '#ef4444', description: 'Significant improvements needed for ATS compatibility' };
}
