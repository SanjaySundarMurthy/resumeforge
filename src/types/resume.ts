/* ── ResumeForge — Core Data Types ─────────────────────────── */

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
  photo: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  highlights: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
  highlights: string[];
}

export interface SkillCategory {
  id: string;
  category: string;
  items: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url: string;
  highlights: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
  expiryDate: string;
}

export interface LanguageSkill {
  id: string;
  language: string;
  proficiency: 'Native' | 'Fluent' | 'Advanced' | 'Intermediate' | 'Basic' | string;
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface Volunteering {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Publication {
  id: string;
  title: string;
  publisher: string;
  date: string;
  url: string;
  description: string;
}

export interface Reference {
  id: string;
  name: string;
  position: string;
  company: string;
  email: string;
  phone: string;
  relationship: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: {
    id: string;
    title: string;
    subtitle: string;
    date: string;
    description: string;
  }[];
}

/* ── Resume Data Model ───────────────────────────────────── */

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: SkillCategory[];
  projects: Project[];
  certifications: Certification[];
  languages: LanguageSkill[];
  awards: Award[];
  volunteering: Volunteering[];
  publications: Publication[];
  references: Reference[];
  customSections: CustomSection[];
}

/* ── Styling & Config ────────────────────────────────────── */

export type TemplateId =
  | 'professional'
  | 'modern'
  | 'minimal'
  | 'executive'
  | 'creative'
  | 'technical'
  | 'elegant'
  | 'bold';

export type FontFamily = 'Inter' | 'Merriweather' | 'Georgia' | 'Helvetica' | 'Times New Roman' | 'Calibri';

export type FontSize = 'small' | 'medium' | 'large';

export type SectionKey =
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'languages'
  | 'awards'
  | 'volunteering'
  | 'publications'
  | 'references'
  | 'customSections';

export type PageMode = 'auto' | 'single' | 'double' | 'triple';

export interface ResumeStyle {
  template: TemplateId;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: FontFamily;
  fontSize: FontSize;
  lineHeight: number;
  sectionSpacing: number;
  showPhoto: boolean;
  showIcons: boolean;
  sectionOrder: SectionKey[];
  hiddenSections: SectionKey[];
  pageMargin: number;
  // Advanced formatting
  pageMode: PageMode;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  paragraphSpacing: number;
  showPageBreakIndicators: boolean;
}

export interface ResumeDocument {
  id: string;
  name: string;
  data: ResumeData;
  style: ResumeStyle;
  createdAt: string;
  updatedAt: string;
}

/* ── Job Description ────────────────────────────────────── */

export interface JobDescription {
  title: string;
  company: string;
  text: string;
}

/* ── Version History ─────────────────────────────────────── */

export interface VersionSnapshot {
  id: string;
  name: string;
  timestamp: string;
  data: ResumeData;
  style: ResumeStyle;
  atsScore?: number;
}

/* ── ATS Score ───────────────────────────────────────────── */

export type ATSSeverity = 'critical' | 'warning' | 'tip';

export interface BrutalTip {
  severity: ATSSeverity;
  section: string;
  message: string;
  fix: string;
  impact: number; // estimated score improvement if fixed
}

export interface KeywordAnalysis {
  matched: string[];
  missing: string[];
  recommended: string[];
  density: number;
  verdict: string;
}

export interface ATSScore {
  score: number;
  tips: string[];
  breakdown: {
    category: string;
    score: number;
    maxScore: number;
    tips: string[];
  }[];
}

/* ── Template Registry ───────────────────────────────────── */

export interface TemplateInfo {
  id: TemplateId;
  name: string;
  description: string;
  category: 'professional' | 'modern' | 'creative' | 'academic';
  atsScore: 'excellent' | 'good' | 'moderate';
  preview: string;
  features: string[];
  recommended: string[];
}

/* ── Color Presets ───────────────────────────────────────── */

export interface ColorPreset {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
}

/* ── Defaults ────────────────────────────────────────────── */

export const DEFAULT_PERSONAL_INFO: PersonalInfo = {
  firstName: '',
  lastName: '',
  title: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  github: '',
  website: '',
  photo: '',
};

export const DEFAULT_STYLE: ResumeStyle = {
  template: 'professional',
  primaryColor: '#1e40af',
  secondaryColor: '#1e293b',
  accentColor: '#3b82f6',
  fontFamily: 'Inter',
  fontSize: 'medium',
  lineHeight: 1.5,
  sectionSpacing: 16,
  showPhoto: false,
  showIcons: true,
  sectionOrder: [
    'summary',
    'experience',
    'education',
    'skills',
    'projects',
    'certifications',
    'languages',
    'awards',
    'volunteering',
    'publications',
    'references',
  ],
  hiddenSections: ['references', 'publications', 'volunteering', 'awards'],
  pageMargin: 40,
  pageMode: 'auto',
  marginTop: 48,
  marginBottom: 48,
  marginLeft: 56,
  marginRight: 56,
  paragraphSpacing: 4,
  showPageBreakIndicators: true,
};

export const DEFAULT_RESUME_DATA: ResumeData = {
  personalInfo: DEFAULT_PERSONAL_INFO,
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  awards: [],
  volunteering: [],
  publications: [],
  references: [],
  customSections: [],
};

export const COLOR_PRESETS: ColorPreset[] = [
  { id: 'royal-blue', name: 'Royal Blue', primary: '#1e40af', secondary: '#1e293b', accent: '#3b82f6' },
  { id: 'emerald', name: 'Emerald', primary: '#065f46', secondary: '#1e293b', accent: '#10b981' },
  { id: 'crimson', name: 'Crimson', primary: '#991b1b', secondary: '#1e293b', accent: '#ef4444' },
  { id: 'purple', name: 'Royal Purple', primary: '#5b21b6', secondary: '#1e293b', accent: '#8b5cf6' },
  { id: 'teal', name: 'Ocean Teal', primary: '#115e59', secondary: '#1e293b', accent: '#14b8a6' },
  { id: 'amber', name: 'Warm Amber', primary: '#92400e', secondary: '#1e293b', accent: '#f59e0b' },
  { id: 'slate', name: 'Executive Slate', primary: '#334155', secondary: '#0f172a', accent: '#64748b' },
  { id: 'rose', name: 'Rose Pink', primary: '#9f1239', secondary: '#1e293b', accent: '#fb7185' },
  { id: 'indigo', name: 'Deep Indigo', primary: '#3730a3', secondary: '#1e293b', accent: '#6366f1' },
  { id: 'charcoal', name: 'Classic Black', primary: '#171717', secondary: '#262626', accent: '#525252' },
];

export const FONT_OPTIONS: { value: FontFamily; label: string; category: string }[] = [
  { value: 'Inter', label: 'Inter', category: 'Sans-serif' },
  { value: 'Merriweather', label: 'Merriweather', category: 'Serif' },
  { value: 'Georgia', label: 'Georgia', category: 'Serif' },
  { value: 'Helvetica', label: 'Helvetica', category: 'Sans-serif' },
  { value: 'Times New Roman', label: 'Times New Roman', category: 'Serif' },
  { value: 'Calibri', label: 'Calibri', category: 'Sans-serif' },
];

export const SECTION_LABELS: Record<SectionKey, string> = {
  summary: 'Professional Summary',
  experience: 'Work Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
  languages: 'Languages',
  awards: 'Awards & Honors',
  volunteering: 'Volunteering',
  publications: 'Publications',
  references: 'References',
  customSections: 'Custom Sections',
};
