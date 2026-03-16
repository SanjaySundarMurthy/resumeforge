/* ── ResumeForge — Resume Parser ────────────────────────────
 * Extracts resume content from PDF, DOCX, and DOC files.
 * Uses heuristic NLP to map text to resume data fields.
 * ─────────────────────────────────────────────────────────── */

import type { ResumeData, PersonalInfo, Experience, Education, SkillCategory } from '@/types/resume';
import { DEFAULT_RESUME_DATA } from '@/types/resume';

type ParseResult = {
  success: boolean;
  data?: Partial<ResumeData>;
  error?: string;
  rawText?: string;
};

/* ── Entry Point ────────────────────────────────────────── */
export async function parseResumeFile(file: File): Promise<ParseResult> {
  const ext = file.name.toLowerCase().split('.').pop();
  try {
    let text = '';

    if (ext === 'pdf') {
      text = await extractPDFText(file);
    } else if (ext === 'docx') {
      text = await extractDOCXText(file);
    } else if (ext === 'doc') {
      return { success: false, error: 'Legacy .doc format is not supported. Please save as .docx or .pdf and try again.' };
    } else if (ext === 'txt') {
      text = await file.text();
    } else {
      return { success: false, error: `Unsupported format ".${ext}". Please use PDF, DOCX, or TXT.` };
    }

    if (!text || text.trim().length < 50) {
      return { success: false, error: 'Could not extract enough text from the file. Please try a different format.', rawText: text };
    }

    const data = parseResumeText(text);
    return { success: true, data, rawText: text };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

/* ── PDF Text Extraction ────────────────────────────────── */
async function extractPDFText(file: File): Promise<string> {
  try {
    // Dynamically import pdfjs to avoid SSR issues
    const pdfjsLib = await import('pdfjs-dist');

    // Set the worker source — use unpkg CDN for reliable .mjs serving
    // pdfjs v5+ uses ES modules, so we need .mjs worker
    if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    }

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Use useWorkerFetch: false to avoid CORS issues with the worker
    const loadingTask = pdfjsLib.getDocument({
      data: uint8Array,
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
    });

    const pdf = await loadingTask.promise;
    const pages: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text = content.items
        .map((item: any) => {
          if (item.str !== undefined) return item.str;
          return '';
        })
        .join(' ');
      pages.push(text);
    }

    return pages.join('\n\n');
  } catch (err: any) {
    // Fallback: try without worker if the worker failed to load
    console.warn('PDF worker failed, trying without worker:', err.message);
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '';

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
        useWorkerFetch: false,
        isEvalSupported: false,
      }).promise;

      const pages: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        pages.push(content.items.map((item: any) => item.str || '').join(' '));
      }
      return pages.join('\n\n');
    } catch (fallbackErr: any) {
      throw new Error(`PDF parsing failed: ${fallbackErr.message || 'Unable to read PDF file'}. Try saving as a different PDF or use DOCX/TXT format.`);
    }
  }
}

/* ── DOCX Text Extraction ───────────────────────────────── */
async function extractDOCXText(file: File): Promise<string> {
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

/* ── Heuristic Parser ───────────────────────────────────── */
function parseResumeText(text: string): Partial<ResumeData> {
  const lines = text.split(/\n|\r/).map(l => l.trim()).filter(Boolean);
  const fullText = text.toLowerCase();

  const data: Partial<ResumeData> = {
    personalInfo: extractPersonalInfo(lines, text) as PersonalInfo,
    summary: extractSummary(lines, fullText),
    experience: extractExperience(lines, text),
    education: extractEducation(lines, fullText),
    skills: extractSkills(lines, fullText),
  };

  return data;
}

/* ── Personal Info Extractor ────────────────────────────── */
function extractPersonalInfo(lines: string[], text: string): Partial<PersonalInfo> {
  const info: Partial<PersonalInfo> = {};

  // Email
  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[a-z]{2,}/);
  if (emailMatch) info.email = emailMatch[0];

  // Phone
  const phoneMatch = text.match(/(\+?[\d\s\-().]{10,15})/);
  if (phoneMatch) info.phone = phoneMatch[1].trim();

  // LinkedIn
  const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
  if (linkedinMatch) info.linkedin = linkedinMatch[0];

  // GitHub
  const githubMatch = text.match(/github\.com\/[\w-]+/i);
  if (githubMatch) info.github = githubMatch[0];

  // Website
  const webMatch = text.match(/(?:https?:\/\/)?(?:www\.)?[\w-]+\.(?:com|io|dev|me|net|org)(?:\/[\w-]*)?/i);
  if (webMatch && !linkedinMatch?.[0]?.includes(webMatch[0]) && !githubMatch?.[0]?.includes(webMatch[0])) {
    info.website = webMatch[0];
  }

  // Name — usually the longest all-caps-ish line near the start OR the first 1-3 word line
  for (const line of lines.slice(0, 10)) {
    if (line.length < 40 && /^[A-Z][a-zA-Z]+ [A-Z][a-zA-Z]+/.test(line) && !/[@.,(0-9)]/.test(line)) {
      const parts = line.split(' ');
      if (parts.length >= 2 && parts.length <= 4) {
        info.firstName = parts[0];
        info.lastName = parts.slice(1).join(' ');
        break;
      }
    }
  }

  // Professional title — often the second or third line
  for (const line of lines.slice(1, 8)) {
    if (line.length > 5 && line.length < 60 && /engineer|developer|manager|designer|analyst|scientist|architect|director|lead|specialist|consultant|coordinator/i.test(line)) {
      info.title = line;
      break;
    }
  }

  // Location — "City, State" or "City, Country" pattern
  const locationMatch = text.match(/([A-Z][a-zA-Z\s]+,\s*(?:[A-Z]{2}|[A-Za-z]+))/);
  if (locationMatch) info.location = locationMatch[1];

  return info;
}

/* ── Summary Extractor ──────────────────────────────────── */
function extractSummary(lines: string[], fullText: string): string {
  const summaryHeaders = /^(professional\s+)?summary|profile|objective|about(\s+me)?|overview/i;
  const nextSectionHeaders = /^(experience|work\s+history|employment|education|skills|certifications|projects)/i;

  let inSummary = false;
  const summaryLines: string[] = [];

  for (const line of lines) {
    if (summaryHeaders.test(line) && line.length < 30) { inSummary = true; continue; }
    if (inSummary && nextSectionHeaders.test(line) && line.length < 30) break;
    if (inSummary && line.length > 20) summaryLines.push(line);
  }

  return summaryLines.join(' ').slice(0, 800);
}

/* ── Experience Extractor ───────────────────────────────── */
function extractExperience(lines: string[], text: string): Experience[] {
  const experiences: Experience[] = [];
  const expHeaders = /^(experience|work\s+history|employment|professional\s+experience|work\s+experience)/i;
  const nextSection = /^(education|skills|certifications|projects|languages|awards|publications)/i;
  const datePattern = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\s,]+\d{4}|\d{4}\s*[-–]\s*(?:\d{4}|present|current)/i;
  const bulletPattern = /^[-•▪►*·]+\s*/;

  let inExp = false;
  let currentExp: Partial<Experience> | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (expHeaders.test(line) && line.length < 40) { inExp = true; continue; }
    if (inExp && nextSection.test(line) && line.length < 40) {
      if (currentExp?.position || currentExp?.company) experiences.push(finalizeExp(currentExp));
      break;
    }
    if (!inExp) continue;

    // Check if this looks like a new job entry (has a date nearby)
    const hasDates = datePattern.test(line);
    if (hasDates && !bulletPattern.test(line)) {
      if (currentExp?.position || currentExp?.company) experiences.push(finalizeExp(currentExp));
      currentExp = { id: genId(), highlights: [], company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '' };

      // Parse dates
      const dateMatches = line.match(/\b\d{4}\b/g);
      if (dateMatches) {
        currentExp.startDate = dateMatches[0];
        currentExp.endDate = dateMatches[1] || '';
        if (/present|current/i.test(line)) currentExp.current = true;
      }

      // Extract title and company from surrounding lines
      if (!currentExp.position && i > 0 && lines[i-1].length < 60) currentExp.position = lines[i-1];
      if (!currentExp.company && i > 1 && lines[i-2].length < 60 && lines[i-2] !== currentExp.position) currentExp.company = lines[i-2];

      continue;
    }

    if (currentExp && bulletPattern.test(line)) {
      const bullet = line.replace(bulletPattern, '').trim();
      if (bullet.length > 10) currentExp.highlights = [...(currentExp.highlights || []), bullet];
    }
  }

  if (currentExp?.position || currentExp?.company) experiences.push(finalizeExp(currentExp));
  return experiences.slice(0, 10);
}

/* ── Education Extractor ────────────────────────────────── */
function extractEducation(lines: string[], fullText: string): Education[] {
  const educations: Education[] = [];
  const eduHeaders = /^(education|academic|qualifications?|degrees?)/i;
  const nextSection = /^(experience|work|skills|certifications|projects|languages)/i;
  const degreePattern = /\b(bachelor|master|phd|doctorate|associate|b\.?s\.?|m\.?s\.?|b\.?a\.?|m\.?a\.?|m\.?b\.?a\.?|b\.?e\.?|m\.?e\.?|diploma|certificate|honours?)\b/i;

  let inEdu = false;
  let current: Partial<Education> | null = null;

  for (const line of lines) {
    if (eduHeaders.test(line) && line.length < 40) { inEdu = true; continue; }
    if (inEdu && nextSection.test(line) && line.length < 40) {
      if (current?.institution || current?.degree) educations.push(finalizeEdu(current));
      break;
    }
    if (!inEdu) continue;

    const yearMatch = line.match(/\b(19|20)\d{2}\b/);
    const hasDegree = degreePattern.test(line);

    if (hasDegree || yearMatch) {
      if (current?.institution || current?.degree) educations.push(finalizeEdu(current));
      current = { id: genId(), institution: '', degree: '', field: '', startDate: '', endDate: '', location: '', gpa: '', highlights: [] };

      if (hasDegree) {
        const degMatch = line.match(degreePattern);
        if (degMatch) current.degree = degMatch[0];
        const fieldMatch = line.match(/(?:in|of)\s+([A-Za-z\s]+?)(?:\s*,|\s*\d|\s*$)/i);
        if (fieldMatch) current.field = fieldMatch[1].trim();
      }
      if (yearMatch) {
        const years = line.match(/\b\d{4}\b/g);
        if (years) { current.startDate = years[0]; current.endDate = years[1] || ''; }
      }

      const gpaMatch = line.match(/gpa[:\s]+([0-9.]+)/i);
      if (gpaMatch) current.gpa = gpaMatch[1];
    } else if (current && line.length > 3 && line.length < 60 && !current.institution) {
      current.institution = line;
    }
  }

  if (current?.institution || current?.degree) educations.push(finalizeEdu(current));
  return educations.slice(0, 5);
}

/* ── Skills Extractor ───────────────────────────────────── */
function extractSkills(lines: string[], fullText: string): SkillCategory[] {
  const skillHeaders = /^(skills?|technical\s+skills?|core\s+competencies|technologies|tools?|proficiencies)/i;
  const nextSection = /^(experience|work|education|certifications|projects|languages|awards)/i;

  let inSkills = false;
  const skillLines: string[] = [];

  for (const line of lines) {
    if (skillHeaders.test(line) && line.length < 40) { inSkills = true; continue; }
    if (inSkills && nextSection.test(line) && line.length < 40) break;
    if (inSkills && line.length > 3) skillLines.push(line);
  }

  if (!skillLines.length) return [];

  // Try to detect category-based skill listing
  const categories: SkillCategory[] = [];
  let currentCat: SkillCategory | null = null;

  for (const line of skillLines) {
    const isCategory = /^[A-Z][^:]{2,20}:/i.test(line) || (line.endsWith(':') && line.length < 30);
    if (isCategory) {
      if (currentCat) categories.push(currentCat);
      const catName = line.replace(/:.*$/, '').trim();
      const itemsPart = line.includes(':') ? line.split(':')[1] : '';
      const items = itemsPart.split(/[,|•\/]/).map(s => s.trim()).filter(s => s.length > 1);
      currentCat = { id: genId(), category: catName, items };
    } else if (currentCat) {
      const items = line.split(/[,|•\/]/).map(s => s.trim()).filter(s => s.length > 1 && s.length < 30);
      currentCat.items = [...currentCat.items, ...items];
    } else {
      const items = line.split(/[,|•\/]/).map(s => s.trim()).filter(s => s.length > 1 && s.length < 30);
      if (items.length > 1) {
        categories.push({ id: genId(), category: 'Technical Skills', items });
      }
    }
  }

  if (currentCat) categories.push(currentCat);
  return categories.filter(c => c.items.length > 0);
}

/* ── Helpers ────────────────────────────────────────────── */
let idCounter = 0;
function genId(): string { return `parsed-${++idCounter}-${Date.now()}`; }

function finalizeExp(e: Partial<Experience> | null): Experience {
  return {
    id: e?.id || genId(),
    company: e?.company || '',
    position: e?.position || '',
    location: e?.location || '',
    startDate: e?.startDate || '',
    endDate: e?.endDate || '',
    current: e?.current || false,
    description: '',
    highlights: (e?.highlights || []).slice(0, 8),
  };
}

function finalizeEdu(e: Partial<Education> | null): Education {
  return {
    id: e?.id || genId(),
    institution: e?.institution || '',
    degree: e?.degree || '',
    field: e?.field || '',
    location: e?.location || '',
    startDate: e?.startDate || '',
    endDate: e?.endDate || '',
    gpa: e?.gpa || '',
    highlights: [],
  };
}
