/* ── ResumeForge — Brutal Honest ATS Scorer v2.0 ──────────── */
/* No sugarcoating. No participation trophies. Pure brutal truth. */

import type { ResumeData, ATSScore, BrutalTip, KeywordAnalysis, JobDescription } from '@/types/resume';

/* ── Industry Keyword Banks ─────────────────────────────── */
const TECH_KEYWORDS = new Set([
  'javascript','typescript','python','java','go','golang','rust','c++','c#','php','ruby','swift','kotlin',
  'react','vue','angular','nextjs','nuxt','svelte','nodejs','express','fastapi','django','flask','spring',
  'postgresql','mysql','mongodb','redis','elasticsearch','dynamodb','sqlite','cassandra','snowflake',
  'docker','kubernetes','terraform','ansible','jenkins','github actions','circleci','gitlab ci',
  'aws','azure','gcp','cloud','microservices','serverless','rest','graphql','grpc','kafka','rabbitmq',
  'git','agile','scrum','devops','ci/cd','machine learning','ai','deep learning','tensorflow','pytorch',
  'api','linux','nginx','webpack','vite','jest','pytest','cypress','playwright','selenium',
  'system design','distributed systems','caching','load balancing','scalability','high availability',
  'security','oauth','jwt','encryption','ssl','penetration testing','soc2','gdpr','hipaa',
  'data pipeline','etl','airflow','spark','hadoop','dbt','tableau','power bi','looker',
]);

const MANAGEMENT_KEYWORDS = new Set([
  'leadership','team lead','managed','cross-functional','stakeholders','strategy','roadmap','okr','kpi',
  'budget','revenue','growth','product management','agile','scrum','executive','mentor','hiring',
  'performance review','organizational','change management','transformation','due diligence','fundraising',
  'p&l','operations','process improvement','six sigma','lean','project management','pmp',
]);

const ACTION_VERBS = new Set([
  'achieved','accelerated','accomplished','architected','automated','built','championed','collaborated',
  'crafted','created','debugged','delivered','deployed','designed','developed','decreased','drove',
  'eliminated','engineered','enhanced','established','executed','expanded','generated','grew','guided',
  'implemented','improved','increased','initiated','integrated','launched','led','mentored','migrated',
  'optimized','orchestrated','owned','pioneered','reduced','refactored','released','resolved','scaled',
  'shipped','simplified','spearheaded','streamlined','transformed','unified','upgraded','validated',
]);

const METRICS_PATTERN = /(\d+[x%+]|\d+\s*(million|billion|thousand|k\b|x\b)|(\$|€|£)\s*\d+|\d+\/\d+|\d+\s*(users|customers|engineers|hours|days|weeks|minutes|seconds|ms|requests|transactions|deployments|releases|clients))/gi;

const FILLER_PHRASES = [
  'responsible for','worked on','helped with','assisted in','involved in','participated in',
  'was part of','duties included','tasked with','assigned to','team player','hard worker',
  'go-getter','self-starter','results-oriented professional','motivated individual',
];

const WEAK_VERBS = ['worked','helped','assisted','did','made','used','tried','got','had','done'];

/* ── Score Weights ──────────────────────────────────────── */
const W = { contact: 10, summary: 15, experience: 30, education: 10, skills: 15, format: 10, length: 5, jd: 10 };

/* ── Main Scoring Function ──────────────────────────────── */
export function calculateATSScore(
  data: ResumeData,
  jobDescription?: JobDescription,
): ATSScore & { brutalTips: BrutalTip[]; keywordAnalysis?: KeywordAnalysis } {
  const brutalTips: BrutalTip[] = [];
  const breakdown: ATSScore['breakdown'] = [];

  /* ── 1. CONTACT ── */
  {
    let s = 0;
    const t: BrutalTip[] = [];
    const pi = data.personalInfo;

    if (pi.firstName && pi.lastName) s += 2; else t.push({ severity: 'critical', section: 'Contact', message: 'Missing your name — ATS cannot identify this resume', fix: 'Add your first and last name at the top', impact: 2 });
    if (pi.email) { s += 3; if (!pi.email.includes('@')) t.push({ severity: 'critical', section: 'Contact', message: 'Invalid email format — recruiters cannot reach you', fix: 'Fix your email address (must contain @)', impact: 3 }); }
    else t.push({ severity: 'critical', section: 'Contact', message: 'No email — #1 reason resumes get ghosted. Recruiters email first.', fix: 'Add a professional email address (no nicknames, no birth year)', impact: 3 });

    if (pi.phone) s += 2; else t.push({ severity: 'warning', section: 'Contact', message: 'No phone number — 68% of recruiters call before extending an offer', fix: 'Add phone with country code: +1 (555) 123-4567', impact: 2 });
    if (pi.location) s += 1; else t.push({ severity: 'warning', section: 'Contact', message: 'No location — ATS geo-filters will skip you for on-site/hybrid roles', fix: 'Add City, State or "Remote" if fully remote', impact: 1 });
    if (pi.linkedin) s += 1; else t.push({ severity: 'warning', section: 'Contact', message: 'No LinkedIn — 87% of recruiters check LinkedIn before responding. Missing = mystery candidate.', fix: 'Add your LinkedIn URL: linkedin.com/in/yourname', impact: 1 });
    if (pi.title) s += 1; else t.push({ severity: 'warning', section: 'Contact', message: 'No professional title — ATS cannot categorize your seniority level', fix: 'Add a clear title: "Senior Software Engineer" or "Product Manager"', impact: 1 });

    brutalTips.push(...t);
    breakdown.push({ category: 'Contact Information', score: Math.min(s, W.contact), maxScore: W.contact, tips: t.map(x => x.message) });
  }

  /* ── 2. SUMMARY ── */
  {
    let s = 0;
    const t: BrutalTip[] = [];
    const txt = (data.summary || '').trim();
    const words = txt.split(/\s+/).filter(Boolean);

    if (!txt) {
      t.push({ severity: 'critical', section: 'Summary', message: 'No summary — recruiters spend 6 seconds on a resume. No hook = no call.', fix: 'Write 50-80 words: "[Role] with [X]yrs in [specialty]. Led/Built/Scaled [achievement with number]. Expert in [top 3 skills]."', impact: 12 });
    } else {
      if (words.length < 30) { s += 5; t.push({ severity: 'warning', section: 'Summary', message: `Only ${words.length} words — too thin to rank. Recruiters judge depth from the summary.`, fix: 'Expand to 50-80 words with a specific achievement and target role', impact: 7 }); }
      else if (words.length > 120) { s += 8; t.push({ severity: 'warning', section: 'Summary', message: `${words.length} words is too long — recruiter stops reading after 80 words`, fix: 'Cut generic filler. Keep: role + years + top achievement + 2-3 key skills', impact: 3 }); }
      else { s += 12; }

      if (METRICS_PATTERN.test(txt)) s += 3;
      else t.push({ severity: 'warning', section: 'Summary', message: 'Summary has zero numbers — "improved performance" means nothing without proof', fix: 'Add one metric: "reduced churn by 23%" or "led team of 8" or "serving 500K+ users"', impact: 3 });

      FILLER_PHRASES.forEach(p => { if (txt.toLowerCase().includes(p)) t.push({ severity: 'warning', section: 'Summary', message: `Weak phrase: "${p}" — sounds like every other candidate`, fix: `Remove "${p}". Replace with a specific achievement.`, impact: 2 }); });
    }

    brutalTips.push(...t);
    breakdown.push({ category: 'Professional Summary', score: Math.min(s, W.summary), maxScore: W.summary, tips: t.map(x => x.message) });
  }

  /* ── 3. EXPERIENCE ── */
  {
    let s = 0;
    const t: BrutalTip[] = [];
    const exp = data.experience;

    if (!exp.length) {
      t.push({ severity: 'critical', section: 'Experience', message: 'Zero work experience — ATS auto-rejects this for 95% of roles', fix: 'Add internships, freelance, open-source, volunteer tech work — anything relevant', impact: 28 });
    } else {
      s += 4;
      if (exp.length < 2) t.push({ severity: 'warning', section: 'Experience', message: 'Only 1 job listed — appears entry-level even if you\'re not', fix: 'Add ALL roles: part-time, contract, consulting, side projects as "Freelance [Role]"', impact: 3 });
      else s += 4;

      let totalBullets = 0, metricBullets = 0, weakBullets = 0, fillerBullets = 0, missingDates = 0;

      exp.forEach((e, i) => {
        const bullets = e.highlights.filter(Boolean);
        totalBullets += bullets.length;
        if (!e.company || !e.position) t.push({ severity: 'critical', section: 'Experience', message: `Job ${i+1} missing ${!e.company ? 'company name' : 'job title'} — ATS cannot parse incomplete entries`, fix: 'Fill in every field: title, company, dates, and at least 3 bullet points', impact: 3 });
        if (!e.startDate) missingDates++;

        if (!bullets.length) t.push({ severity: 'critical', section: 'Experience', message: `"${e.position || `Job ${i+1}`}" has no bullet points — scored 0/30 for this role`, fix: 'Add 3-6 bullets using CAR format: Context → Action → Result with metric', impact: 6 });
        else if (bullets.length < 3) t.push({ severity: 'warning', section: 'Experience', message: `"${e.position || `Job ${i+1}`}" only has ${bullets.length} bullet — 3-6 expected`, fix: 'Add more quantified achievements. What did you build, improve, or launch?', impact: 3 });

        bullets.forEach(b => {
          if (METRICS_PATTERN.test(b)) metricBullets++;
          const l = b.toLowerCase();
          if (WEAK_VERBS.some(v => l.startsWith(v+' '))) weakBullets++;
          if (FILLER_PHRASES.some(f => l.includes(f))) fillerBullets++;
        });
      });

      if (missingDates > 0) t.push({ severity: 'warning', section: 'Experience', message: `${missingDates} job(s) missing dates — ATS cannot calculate total experience years`, fix: 'Add start/end dates to every role (YYYY-MM format)', impact: 3 });

      const ratio = totalBullets > 0 ? metricBullets / totalBullets : 0;
      if (ratio < 0.25) {
        t.push({ severity: 'critical', section: 'Experience', message: `Only ${Math.round(ratio*100)}% of bullets have measurable results — below the 40% threshold. Your resume reads like a job description, not a track record.`, fix: `Convert 3+ bullets to metrics NOW: "optimized queries" → "optimized SQL queries, reducing p99 latency from 2.1s → 340ms (84% faster)"`, impact: 10 });
        s += 4;
      } else if (ratio < 0.5) {
        t.push({ severity: 'warning', section: 'Experience', message: `${Math.round(ratio*100)}% bullets have metrics — good but aim for 50%+. Top 10% candidates hit 65%.`, fix: 'Pick 3 more bullets and add numbers: users, %, $, speed, team size, time saved', impact: 5 });
        s += 9;
      } else { s += 14; }

      if (weakBullets > 1) t.push({ severity: 'warning', section: 'Experience', message: `${weakBullets} bullets use passive verbs (worked/helped/made) — screams junior mindset`, fix: 'Use power verbs: "worked on X" → "Engineered X, reducing cost by 30%"', impact: 3 });
      if (fillerBullets > 0) t.push({ severity: 'warning', section: 'Experience', message: `${fillerBullets} bullets use filler phrases ("responsible for...") — ranks you average`, fix: 'Delete "Responsible for". Start with the action, end with the impact.', impact: 3 });

      const allText = exp.flatMap(e => e.highlights).join(' ').toLowerCase();
      const usedVerbCount = Array.from(ACTION_VERBS).filter(v => allText.includes(v)).length;
      if (usedVerbCount < 5 && totalBullets > 5) t.push({ severity: 'tip', section: 'Experience', message: `Low verb variety (${usedVerbCount} unique power verbs) — ATS flags keyword monotony`, fix: 'Vary opening verbs: architected, championed, orchestrated, pioneered, scaled, unified', impact: 2 });
      else if (totalBullets > 0) s += 3;
    }

    brutalTips.push(...t);
    breakdown.push({ category: 'Work Experience', score: Math.min(s, W.experience), maxScore: W.experience, tips: t.map(x => x.message) });
  }

  /* ── 4. EDUCATION ── */
  {
    let s = 0;
    const t: BrutalTip[] = [];
    if (!data.education.length) {
      t.push({ severity: 'warning', section: 'Education', message: 'No education listed — ATS degree filters will exclude you from 40%+ of corporate job postings', fix: 'Add all education: degrees, bootcamps, online certs (Coursera, Udemy), trade school', impact: 6 });
    } else {
      s += 5;
      data.education.forEach((e, i) => {
        if (!e.degree) t.push({ severity: 'warning', section: 'Education', message: `Education ${i+1}: Missing degree type — ATS \'degree required\' filters won\'t match`, fix: 'Specify: B.S., M.S., Ph.D., Associate, or Certification', impact: 2 });
        if (!e.institution) t.push({ severity: 'warning', section: 'Education', message: `Education ${i+1}: Missing school name — incomplete entry looks like a data error to ATS`, fix: 'Add the full institution name', impact: 1 });
        if (e.startDate || e.endDate) s += 2;
        else t.push({ severity: 'tip', section: 'Education', message: `Education ${i+1}: No graduation dates — ATS cannot verify recency of your degree`, fix: 'Add graduation year or "Expected: Month YYYY" for ongoing degrees', impact: 1 });
        if (e.gpa && parseFloat(e.gpa) >= 3.5) s += 3;
      });
    }
    brutalTips.push(...t);
    breakdown.push({ category: 'Education', score: Math.min(s, W.education), maxScore: W.education, tips: t.map(x => x.message) });
  }

  /* ── 5. SKILLS ── */
  {
    let s = 0;
    const t: BrutalTip[] = [];
    const allSkills = data.skills.flatMap(sk => sk.items.map(i => i.toLowerCase()));

    if (!allSkills.length) {
      t.push({ severity: 'critical', section: 'Skills', message: 'No skills section — ATS keyword match returns 0%. This resume is invisible to automated filters.', fix: 'Add a skills section with 15-25 skills grouped by category: Languages, Frameworks, Cloud, Tools, Soft Skills', impact: 15 });
    } else {
      if (allSkills.length < 8) { s += 5; t.push({ severity: 'warning', section: 'Skills', message: `Only ${allSkills.length} skills — most competitive resumes list 20-30+. You\'re missing keyword coverage.`, fix: 'Add: cloud platforms, testing frameworks, project tools, methodologies, databases you\'ve used', impact: 7 }); }
      else if (allSkills.length < 15) { s += 9; t.push({ severity: 'tip', section: 'Skills', message: `${allSkills.length} skills — decent but top candidates list 20-30. Add more tech stack specifics.`, fix: 'Add sub-tools: "AWS" → add "AWS Lambda, S3, RDS, CloudWatch, IAM" as separate skills', impact: 3 }); }
      else { s += 13; }
      if (data.certifications.length > 0) s += 2;
      else t.push({ severity: 'tip', section: 'Skills', message: 'No certifications — verified credentials rank 3x higher than unvalidated skills', fix: 'Add any certs: AWS, Google Cloud, Azure, PMP, CISSP, Scrum Master, LinkedIn Learning', impact: 2 });
    }

    brutalTips.push(...t);
    breakdown.push({ category: 'Skills & Credentials', score: Math.min(s, W.skills), maxScore: W.skills, tips: t.map(x => x.message) });
  }

  /* ── 6. FORMAT ── */
  {
    let s = 0;
    const t: BrutalTip[] = [];
    const totalItems = data.experience.reduce((a, e) => a + e.highlights.filter(Boolean).length, 0) + data.skills.length + data.education.length;

    if (totalItems < 5) t.push({ severity: 'critical', section: 'Format', message: 'Resume is nearly empty — will rank last in every ATS stack', fix: 'Complete all sections before submitting to any role', impact: 8 });
    else s += 6;

    if (data.personalInfo.email && data.personalInfo.phone) s += 4;
    else t.push({ severity: 'critical', section: 'Format', message: 'Missing essential contact details — ATS parser fails on incomplete headers', fix: 'Email + Phone must be in the header. Non-negotiable.', impact: 4 });

    brutalTips.push(...t);
    breakdown.push({ category: 'Formatting & Completeness', score: Math.min(s, W.format), maxScore: W.format, tips: t.map(x => x.message) });
  }

  /* ── 7. LENGTH ── */
  {
    let s = 0;
    const t: BrutalTip[] = [];
    const allText = [data.summary, ...data.experience.flatMap(e => [...e.highlights, e.description]), ...data.skills.flatMap(sk => sk.items)].join(' ');
    const wc = allText.split(/\s+/).filter(Boolean).length;

    if (wc < 150) { t.push({ severity: 'critical', section: 'Length', message: `Only ~${wc} words — ATS parsing finds almost nothing to analyze`, fix: 'A strong resume needs 400-800 words of real content', impact: 4 }); }
    else if (wc > 1300) { s += 3; t.push({ severity: 'warning', section: 'Length', message: `~${wc} words exceeds the ideal 1-2 page range. Recruiters stop reading.`, fix: 'Cut roles older than 10 years. Remove generic bullets. Focus on impact.', impact: 2 }); }
    else { s += 5; }

    brutalTips.push(...t);
    breakdown.push({ category: 'Content Length & Depth', score: Math.min(s, W.length), maxScore: W.length, tips: t.map(x => x.message) });
  }

  /* ── 8. JOB DESCRIPTION MATCH ── */
  let keywordAnalysis: KeywordAnalysis | undefined;
  if (jobDescription?.text && jobDescription.text.length > 30) {
    const jdKws = extractKeywords(jobDescription.text);
    const resumeText = buildResumeText(data);
    const matched = jdKws.filter(k => resumeText.includes(k));
    const missing = jdKws.filter(k => !resumeText.includes(k));
    const density = jdKws.length > 0 ? matched.length / jdKws.length : 0;

    keywordAnalysis = {
      matched,
      missing: missing.slice(0, 20),
      recommended: missing.filter(k => TECH_KEYWORDS.has(k) || MANAGEMENT_KEYWORDS.has(k)).slice(0, 12),
      density,
      verdict: density >= 0.7 ? '🟢 Excellent match' : density >= 0.5 ? '🔵 Good match' : density >= 0.3 ? '🟡 Partial match' : '🔴 Poor match — will likely be rejected',
    };

    const jdScore = Math.round(density * W.jd);
    if (density < 0.3) brutalTips.push({ severity: 'critical', section: 'JD Match', message: `Only ${Math.round(density*100)}% keyword match — ATS will reject before a human sees this`, fix: `Immediately add these keywords: ${missing.slice(0,6).join(', ')}`, impact: 15 });
    else if (density < 0.6) brutalTips.push({ severity: 'warning', section: 'JD Match', message: `${Math.round(density*100)}% match — below the 60% threshold most enterprise ATS require`, fix: `Weave in: ${missing.slice(0,4).join(', ')}`, impact: 8 });

    breakdown.push({ category: 'Job Description Match', score: jdScore, maxScore: W.jd, tips: [`${Math.round(density*100)}% match · ${matched.length} of ${jdKws.length} keywords found`] });
  }

  /* ── Final Calculation ── */
  const raw = breakdown.reduce((a, b) => a + b.score, 0);
  const max = breakdown.reduce((a, b) => a + b.maxScore, 0);
  const finalScore = Math.min(100, Math.round((raw / max) * 100));

  const sorted = [...brutalTips].sort((a, b) => {
    const o: Record<string, number> = { critical: 0, warning: 1, tip: 2 };
    return (o[a.severity] ?? 3) - (o[b.severity] ?? 3);
  });

  return {
    score: finalScore,
    tips: sorted.map(t => `[${t.section}] ${t.message}`),
    breakdown,
    brutalTips: sorted,
    keywordAnalysis,
  } as ATSScore & { brutalTips: BrutalTip[]; keywordAnalysis?: KeywordAnalysis };
}

function extractKeywords(text: string): string[] {
  const lower = text.toLowerCase().replace(/[^\w\s.#+]/g, ' ');
  const stop = new Set(['the','a','an','and','or','in','on','at','to','for','of','with','is','are','was','were','be','have','has','do','will','this','that','we','you','they','our','their','it','i','no','not','as','by','from','very','just','now','up','out','any','etc','also','such','more','most','some','all','both']);
  const multi = ['machine learning','deep learning','data science','product management','project management','full stack','back end','front end','cloud computing','system design','distributed systems','continuous integration','continuous deployment','natural language processing','computer vision','big data','object oriented','functional programming','microservices architecture','event driven'];
  const found: string[] = [];
  multi.forEach(m => { if (lower.includes(m)) found.push(m); });
  lower.split(/\s+/).filter(w => w.length > 2 && !stop.has(w) && !/^\d+$/.test(w)).forEach(w => found.push(w));
  return Array.from(new Set(found)).filter(w => TECH_KEYWORDS.has(w) || MANAGEMENT_KEYWORDS.has(w) || w.length > 4).slice(0, 60);
}

function buildResumeText(data: ResumeData): string {
  return [
    data.summary, data.personalInfo.title,
    ...data.experience.flatMap(e => [e.position, e.company, ...e.highlights, e.description]),
    ...data.education.map(e => `${e.degree} ${e.field} ${e.institution}`),
    ...data.skills.flatMap(s => [s.category, ...s.items]),
    ...data.projects.flatMap(p => [p.name, p.description, ...p.technologies]),
    ...data.certifications.map(c => c.name),
  ].join(' ').toLowerCase();
}

export function getScoreLabel(score: number): { label: string; color: string; emoji: string; advice: string } {
  if (score >= 90) return { label: 'ATS Champion', color: '#059669', emoji: '🏆', advice: 'Elite. This resume will pass virtually every ATS filter and impress recruiters.' };
  if (score >= 80) return { label: 'Strong', color: '#10b981', emoji: '✅', advice: 'Very competitive. Address remaining warnings to dominate the stack.' };
  if (score >= 70) return { label: 'Good', color: '#3b82f6', emoji: '👍', advice: 'Above average. Fix the warnings and you\'re in the top 25%.' };
  if (score >= 60) return { label: 'Needs Work', color: '#f59e0b', emoji: '⚠️', advice: 'Mediocre. Recruiters pass on resumes like this daily. Fix critical issues now.' };
  if (score >= 45) return { label: 'High Risk', color: '#ef4444', emoji: '🚨', advice: 'Will be rejected by most ATS. This needs significant work before submitting.' };
  return { label: 'Will Be Rejected', color: '#7f1d1d', emoji: '💀', advice: 'Auto-rejected by 95% of ATS. Do not submit this anywhere. Fix everything first.' };
}

export function getKeywordMatchColor(density: number): string {
  if (density >= 0.7) return '#059669';
  if (density >= 0.5) return '#3b82f6';
  if (density >= 0.3) return '#f59e0b';
  return '#ef4444';
}
