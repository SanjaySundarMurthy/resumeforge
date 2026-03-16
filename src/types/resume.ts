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

export type FontFamily = 'Inter' | 'Merriweather' | 'Georgia' | 'Helvetica' | 'Times New Roman' | 'Calibri' | 'Lato' | 'Roboto' | 'Source Sans Pro' | 'Playfair Display';

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

export type BulletStyle = 'disc' | 'dash' | 'triangle' | 'square' | 'diamond' | 'arrow' | 'star' | 'none';
export type HeaderStyle = 'uppercase-underline' | 'uppercase' | 'capitalize-underline' | 'capitalize' | 'bold-only';
export type SkillDisplayMode = 'comma' | 'tags' | 'bars';
export type DateAlignment = 'right' | 'left' | 'inline';
export type NameSize = 'small' | 'medium' | 'large' | 'xlarge';

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
  // Extended formatting controls
  bulletStyle: BulletStyle;
  headerStyle: HeaderStyle;
  skillDisplayMode: SkillDisplayMode;
  dateAlignment: DateAlignment;
  nameSize: NameSize;
  letterSpacing: number;
  headerLetterSpacing: number;
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
  // Extended formatting defaults
  bulletStyle: 'disc',
  headerStyle: 'uppercase-underline',
  skillDisplayMode: 'comma',
  dateAlignment: 'right',
  nameSize: 'large',
  letterSpacing: 0,
  headerLetterSpacing: 1.5,
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
  { value: 'Lato', label: 'Lato', category: 'Sans-serif' },
  { value: 'Roboto', label: 'Roboto', category: 'Sans-serif' },
  { value: 'Source Sans Pro', label: 'Source Sans Pro', category: 'Sans-serif' },
  { value: 'Playfair Display', label: 'Playfair Display', category: 'Serif' },
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

/* ── Bullet Style Symbols ─────────────────────────────────── */
export const BULLET_SYMBOLS: Record<BulletStyle, string> = {
  disc: '•',
  dash: '–',
  triangle: '▸',
  square: '▪',
  diamond: '◆',
  arrow: '→',
  star: '★',
  none: '',
};

export const BULLET_OPTIONS: { id: BulletStyle; label: string; symbol: string }[] = [
  { id: 'disc', label: 'Circle', symbol: '•' },
  { id: 'dash', label: 'Dash', symbol: '–' },
  { id: 'triangle', label: 'Triangle', symbol: '▸' },
  { id: 'square', label: 'Square', symbol: '▪' },
  { id: 'diamond', label: 'Diamond', symbol: '◆' },
  { id: 'arrow', label: 'Arrow', symbol: '→' },
  { id: 'star', label: 'Star', symbol: '★' },
  { id: 'none', label: 'None', symbol: '—' },
];

export const HEADER_STYLE_OPTIONS: { id: HeaderStyle; label: string; desc: string }[] = [
  { id: 'uppercase-underline', label: 'UPPERCASE + Line', desc: 'Classic ATS style' },
  { id: 'uppercase', label: 'UPPERCASE', desc: 'Bold headers no line' },
  { id: 'capitalize-underline', label: 'Capitalize + Line', desc: 'Elegant style' },
  { id: 'capitalize', label: 'Capitalize', desc: 'Clean and simple' },
  { id: 'bold-only', label: 'Bold Only', desc: 'Minimal approach' },
];

export const SKILL_DISPLAY_OPTIONS: { id: SkillDisplayMode; label: string; desc: string }[] = [
  { id: 'comma', label: 'Comma List', desc: 'Category: Skill, Skill, Skill' },
  { id: 'tags', label: 'Tags / Badges', desc: 'Visual keyword pills' },
  { id: 'bars', label: 'Progress Bars', desc: 'Visual proficiency levels' },
];

export const DATE_ALIGNMENT_OPTIONS: { id: DateAlignment; label: string }[] = [
  { id: 'right', label: 'Right-aligned' },
  { id: 'left', label: 'Left (below title)' },
  { id: 'inline', label: 'Inline with title' },
];

export const NAME_SIZE_OPTIONS: { id: NameSize; label: string; multiplier: number }[] = [
  { id: 'small', label: 'Small', multiplier: 2.0 },
  { id: 'medium', label: 'Medium', multiplier: 2.35 },
  { id: 'large', label: 'Large', multiplier: 2.55 },
  { id: 'xlarge', label: 'Extra Large', multiplier: 3.0 },
];
