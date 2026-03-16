/* ── ResumeForge — Zustand State Store ────────────────────── */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type {
  ResumeData,
  ResumeStyle,
  ResumeDocument,
  PersonalInfo,
  Experience,
  Education,
  SkillCategory,
  Project,
  Certification,
  LanguageSkill,
  Award,
  Volunteering,
  Publication,
  Reference,
  SectionKey,
  TemplateId,
  FontFamily,
  JobDescription,
  VersionSnapshot,
} from '@/types/resume';

import {
  DEFAULT_RESUME_DATA as defaultData,
  DEFAULT_STYLE as defaultStyle,
} from '@/types/resume';

/* ── Editor State ────────────────────────────────────────── */

type EditorTab = 'content' | 'design' | 'ats' | 'history';

interface ResumeState {
  // Current resume
  currentId: string;
  data: ResumeData;
  style: ResumeStyle;

  // Editor state
  activeSection: SectionKey | 'personalInfo';
  editorTab: EditorTab;
  previewScale: number;
  isDirty: boolean;

  // Job description for ATS matching
  jobDescription: JobDescription;

  // Version history
  versions: VersionSnapshot[];

  // All resumes
  documents: ResumeDocument[];

  // Actions — Personal Info
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  updateSummary: (summary: string) => void;

  // Actions — Experience
  addExperience: () => void;
  updateExperience: (id: string, data: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  reorderExperience: (fromIndex: number, toIndex: number) => void;

  // Actions — Education
  addEducation: () => void;
  updateEducation: (id: string, data: Partial<Education>) => void;
  removeEducation: (id: string) => void;

  // Actions — Skills
  addSkillCategory: () => void;
  updateSkillCategory: (id: string, data: Partial<SkillCategory>) => void;
  removeSkillCategory: (id: string) => void;

  // Actions — Projects
  addProject: () => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  removeProject: (id: string) => void;

  // Actions — Certifications
  addCertification: () => void;
  updateCertification: (id: string, data: Partial<Certification>) => void;
  removeCertification: (id: string) => void;

  // Actions — Languages
  addLanguage: () => void;
  updateLanguage: (id: string, data: Partial<LanguageSkill>) => void;
  removeLanguage: (id: string) => void;

  // Actions — Awards
  addAward: () => void;
  updateAward: (id: string, data: Partial<Award>) => void;
  removeAward: (id: string) => void;

  // Actions — Volunteering
  addVolunteering: () => void;
  updateVolunteering: (id: string, data: Partial<Volunteering>) => void;
  removeVolunteering: (id: string) => void;

  // Actions — Publications
  addPublication: () => void;
  updatePublication: (id: string, data: Partial<Publication>) => void;
  removePublication: (id: string) => void;

  // Actions — References
  addReference: () => void;
  updateReference: (id: string, data: Partial<Reference>) => void;
  removeReference: (id: string) => void;

  // Actions — Style
  updateStyle: (style: Partial<ResumeStyle>) => void;
  setTemplate: (template: TemplateId) => void;
  setColor: (primary: string, secondary?: string, accent?: string) => void;
  setFont: (font: FontFamily) => void;
  toggleSection: (section: SectionKey) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;

  // Actions — Editor
  setActiveSection: (section: SectionKey | 'personalInfo') => void;
  setEditorTab: (tab: EditorTab) => void;
  setPreviewScale: (scale: number) => void;

  // Actions — Documents
  saveDocument: () => void;
  loadDocument: (id: string) => void;
  createNewResume: (name?: string) => void;
  deleteDocument: (id: string) => void;
  duplicateDocument: (id: string) => void;

  // Actions — Import/Export
  exportData: () => string;
  importData: (json: string) => void;
  importResumeData: (data: Partial<ResumeData>) => void;
  loadSampleData: () => void;
  resetData: () => void;

  // Actions — Job Description
  setJobDescription: (jd: Partial<JobDescription>) => void;
  clearJobDescription: () => void;

  // Actions — Versions
  saveVersion: (name?: string) => void;
  restoreVersion: (id: string) => void;
  deleteVersion: (id: string) => void;

  // Computed
  getCompletenessScore: () => number;
}

/* ── Helper: Reorder Array ───────────────────────────────── */

function reorder<T>(list: T[], from: number, to: number): T[] {
  const result = [...list];
  const [removed] = result.splice(from, 1);
  result.splice(to, 0, removed);
  return result;
}

/* ── Sample Data ─────────────────────────────────────────── */

const SAMPLE_DATA: ResumeData = {
  personalInfo: {
    firstName: 'Alex',
    lastName: 'Mitchell',
    title: 'Senior Software Engineer',
    email: 'alex.mitchell@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexmitchell',
    github: 'github.com/alexmitchell',
    website: 'alexmitchell.dev',
    photo: '',
  },
  summary:
    'Results-driven Senior Software Engineer with 7+ years of experience building scalable web applications and distributed systems. Expert in React, TypeScript, Node.js, and cloud-native architectures. Led teams of 5-8 engineers, delivering products that serve 2M+ users. Passionate about clean code, DevOps best practices, and mentoring junior developers.',
  experience: [
    {
      id: '1',
      company: 'TechCorp Inc.',
      position: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      startDate: '2021-03',
      endDate: '',
      current: true,
      description: 'Lead engineer for the core platform team building high-performance microservices.',
      highlights: [
        'Architected and deployed a real-time data pipeline processing 10M+ events/day using Kafka and Redis, reducing latency by 65%',
        'Led migration from monolith to microservices architecture, improving deployment frequency from monthly to daily releases',
        'Mentored 5 junior engineers through code reviews, pair programming, and technical design sessions',
        'Implemented comprehensive CI/CD pipelines with GitHub Actions, achieving 99.9% deployment success rate',
      ],
    },
    {
      id: '2',
      company: 'StartupXYZ',
      position: 'Full Stack Developer',
      location: 'Remote',
      startDate: '2018-06',
      endDate: '2021-02',
      current: false,
      description: 'Full-stack development for a SaaS analytics platform serving 50K+ businesses.',
      highlights: [
        'Built customer-facing dashboard using React and D3.js, increasing user engagement by 40%',
        'Designed and implemented RESTful APIs serving 5M+ daily requests with 99.95% uptime',
        'Optimized PostgreSQL queries reducing average response time from 800ms to 120ms',
        'Introduced automated testing culture, achieving 92% code coverage across the platform',
      ],
    },
    {
      id: '3',
      company: 'Digital Solutions LLC',
      position: 'Software Developer',
      location: 'Austin, TX',
      startDate: '2016-08',
      endDate: '2018-05',
      current: false,
      description: 'Developed enterprise web applications for Fortune 500 clients.',
      highlights: [
        'Developed responsive web applications using Angular and .NET Core for 3 enterprise clients',
        'Reduced page load time by 55% through code splitting, lazy loading, and CDN optimization',
        'Created reusable component library used across 8 projects, saving 200+ development hours',
      ],
    },
  ],
  education: [
    {
      id: '1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      location: 'Berkeley, CA',
      startDate: '2012-08',
      endDate: '2016-05',
      gpa: '3.8',
      highlights: ["Dean's List — 6 semesters", 'Senior project: Distributed task scheduler using Go'],
    },
  ],
  skills: [
    {
      id: '1',
      category: 'Languages',
      items: ['TypeScript', 'JavaScript', 'Python', 'Go', 'SQL', 'HTML/CSS'],
    },
    {
      id: '2',
      category: 'Frontend',
      items: ['React', 'Next.js', 'Vue.js', 'Tailwind CSS', 'Redux', 'GraphQL'],
    },
    {
      id: '3',
      category: 'Backend',
      items: ['Node.js', 'Express', 'FastAPI', 'PostgreSQL', 'MongoDB', 'Redis'],
    },
    {
      id: '4',
      category: 'DevOps & Cloud',
      items: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'Datadog'],
    },
  ],
  projects: [
    {
      id: '1',
      name: 'CloudDeploy',
      description: 'Open-source CLI tool for automated multi-cloud deployments',
      technologies: ['Go', 'AWS SDK', 'Terraform', 'Docker'],
      url: 'github.com/alexmitchell/clouddeploy',
      highlights: [
        '2.5K+ GitHub stars, 150+ contributors',
        'Reduces deployment time by 80% compared to manual processes',
      ],
    },
    {
      id: '2',
      name: 'DataFlow',
      description: 'Real-time data visualization dashboard for IoT devices',
      technologies: ['React', 'D3.js', 'WebSocket', 'InfluxDB'],
      url: 'dataflow.alexmitchell.dev',
      highlights: [
        'Handles 100K+ concurrent WebSocket connections',
        'Featured in JavaScript Weekly newsletter',
      ],
    },
  ],
  certifications: [
    { id: '1', name: 'AWS Solutions Architect Professional', issuer: 'Amazon Web Services', date: '2023-06', url: '', expiryDate: '2026-06' },
    { id: '2', name: 'Certified Kubernetes Administrator', issuer: 'CNCF', date: '2022-11', url: '', expiryDate: '2025-11' },
  ],
  languages: [
    { id: '1', language: 'English', proficiency: 'Native' },
    { id: '2', language: 'Spanish', proficiency: 'Intermediate' },
  ],
  awards: [],
  volunteering: [],
  publications: [],
  references: [],
  customSections: [],
};

/* ── Store ───────────────────────────────────────────────── */

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => ({
      currentId: '',
      data: { ...defaultData },
      style: { ...defaultStyle },
      activeSection: 'personalInfo',
      editorTab: 'content',
      previewScale: 0.6,
      isDirty: false,
      documents: [],
      jobDescription: { title: '', company: '', text: '' },
      versions: [],

      // Personal Info
      updatePersonalInfo: (info) =>
        set((s) => ({
          data: { ...s.data, personalInfo: { ...s.data.personalInfo, ...info } },
          isDirty: true,
        })),

      updateSummary: (summary) =>
        set((s) => ({ data: { ...s.data, summary }, isDirty: true })),

      // Experience
      addExperience: () =>
        set((s) => ({
          data: {
            ...s.data,
            experience: [
              ...s.data.experience,
              { id: uuidv4(), company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '', highlights: [''] },
            ],
          },
          isDirty: true,
        })),

      updateExperience: (id, data) =>
        set((s) => ({
          data: {
            ...s.data,
            experience: s.data.experience.map((e) => (e.id === id ? { ...e, ...data } : e)),
          },
          isDirty: true,
        })),

      removeExperience: (id) =>
        set((s) => ({
          data: { ...s.data, experience: s.data.experience.filter((e) => e.id !== id) },
          isDirty: true,
        })),

      reorderExperience: (from, to) =>
        set((s) => ({
          data: { ...s.data, experience: reorder(s.data.experience, from, to) },
          isDirty: true,
        })),

      // Education
      addEducation: () =>
        set((s) => ({
          data: {
            ...s.data,
            education: [
              ...s.data.education,
              { id: uuidv4(), institution: '', degree: '', field: '', location: '', startDate: '', endDate: '', gpa: '', highlights: [] },
            ],
          },
          isDirty: true,
        })),

      updateEducation: (id, data) =>
        set((s) => ({
          data: {
            ...s.data,
            education: s.data.education.map((e) => (e.id === id ? { ...e, ...data } : e)),
          },
          isDirty: true,
        })),

      removeEducation: (id) =>
        set((s) => ({
          data: { ...s.data, education: s.data.education.filter((e) => e.id !== id) },
          isDirty: true,
        })),

      // Skills
      addSkillCategory: () =>
        set((s) => ({
          data: {
            ...s.data,
            skills: [...s.data.skills, { id: uuidv4(), category: '', items: [] }],
          },
          isDirty: true,
        })),

      updateSkillCategory: (id, data) =>
        set((s) => ({
          data: {
            ...s.data,
            skills: s.data.skills.map((sk) => (sk.id === id ? { ...sk, ...data } : sk)),
          },
          isDirty: true,
        })),

      removeSkillCategory: (id) =>
        set((s) => ({
          data: { ...s.data, skills: s.data.skills.filter((sk) => sk.id !== id) },
          isDirty: true,
        })),

      // Projects
      addProject: () =>
        set((s) => ({
          data: {
            ...s.data,
            projects: [
              ...s.data.projects,
              { id: uuidv4(), name: '', description: '', technologies: [], url: '', highlights: [''] },
            ],
          },
          isDirty: true,
        })),

      updateProject: (id, data) =>
        set((s) => ({
          data: {
            ...s.data,
            projects: s.data.projects.map((p) => (p.id === id ? { ...p, ...data } : p)),
          },
          isDirty: true,
        })),

      removeProject: (id) =>
        set((s) => ({
          data: { ...s.data, projects: s.data.projects.filter((p) => p.id !== id) },
          isDirty: true,
        })),

      // Certifications
      addCertification: () =>
        set((s) => ({
          data: {
            ...s.data,
            certifications: [
              ...s.data.certifications,
              { id: uuidv4(), name: '', issuer: '', date: '', url: '', expiryDate: '' },
            ],
          },
          isDirty: true,
        })),

      updateCertification: (id, data) =>
        set((s) => ({
          data: {
            ...s.data,
            certifications: s.data.certifications.map((c) => (c.id === id ? { ...c, ...data } : c)),
          },
          isDirty: true,
        })),

      removeCertification: (id) =>
        set((s) => ({
          data: { ...s.data, certifications: s.data.certifications.filter((c) => c.id !== id) },
          isDirty: true,
        })),

      // Languages
      addLanguage: () =>
        set((s) => ({
          data: {
            ...s.data,
            languages: [...s.data.languages, { id: uuidv4(), language: '', proficiency: 'Intermediate' }],
          },
          isDirty: true,
        })),

      updateLanguage: (id, data) =>
        set((s) => ({
          data: {
            ...s.data,
            languages: s.data.languages.map((l) => (l.id === id ? { ...l, ...data } : l)),
          },
          isDirty: true,
        })),

      removeLanguage: (id) =>
        set((s) => ({
          data: { ...s.data, languages: s.data.languages.filter((l) => l.id !== id) },
          isDirty: true,
        })),

      // Awards
      addAward: () =>
        set((s) => ({
          data: {
            ...s.data,
            awards: [...s.data.awards, { id: uuidv4(), title: '', issuer: '', date: '', description: '' }],
          },
          isDirty: true,
        })),

      updateAward: (id, data) =>
        set((s) => ({
          data: { ...s.data, awards: s.data.awards.map((a) => (a.id === id ? { ...a, ...data } : a)) },
          isDirty: true,
        })),

      removeAward: (id) =>
        set((s) => ({
          data: { ...s.data, awards: s.data.awards.filter((a) => a.id !== id) },
          isDirty: true,
        })),

      // Volunteering
      addVolunteering: () =>
        set((s) => ({
          data: {
            ...s.data,
            volunteering: [
              ...s.data.volunteering,
              { id: uuidv4(), organization: '', role: '', startDate: '', endDate: '', current: false, description: '' },
            ],
          },
          isDirty: true,
        })),

      updateVolunteering: (id, data) =>
        set((s) => ({
          data: {
            ...s.data,
            volunteering: s.data.volunteering.map((v) => (v.id === id ? { ...v, ...data } : v)),
          },
          isDirty: true,
        })),

      removeVolunteering: (id) =>
        set((s) => ({
          data: { ...s.data, volunteering: s.data.volunteering.filter((v) => v.id !== id) },
          isDirty: true,
        })),

      // Publications
      addPublication: () =>
        set((s) => ({
          data: {
            ...s.data,
            publications: [
              ...s.data.publications,
              { id: uuidv4(), title: '', publisher: '', date: '', url: '', description: '' },
            ],
          },
          isDirty: true,
        })),

      updatePublication: (id, data) =>
        set((s) => ({
          data: {
            ...s.data,
            publications: s.data.publications.map((p) => (p.id === id ? { ...p, ...data } : p)),
          },
          isDirty: true,
        })),

      removePublication: (id) =>
        set((s) => ({
          data: { ...s.data, publications: s.data.publications.filter((p) => p.id !== id) },
          isDirty: true,
        })),

      // References
      addReference: () =>
        set((s) => ({
          data: {
            ...s.data,
            references: [
              ...s.data.references,
              { id: uuidv4(), name: '', position: '', company: '', email: '', phone: '', relationship: '' },
            ],
          },
          isDirty: true,
        })),

      updateReference: (id, data) =>
        set((s) => ({
          data: {
            ...s.data,
            references: s.data.references.map((r) => (r.id === id ? { ...r, ...data } : r)),
          },
          isDirty: true,
        })),

      removeReference: (id) =>
        set((s) => ({
          data: { ...s.data, references: s.data.references.filter((r) => r.id !== id) },
          isDirty: true,
        })),

      // Style
      updateStyle: (style) =>
        set((s) => ({ style: { ...s.style, ...style }, isDirty: true })),

      setTemplate: (template) =>
        set((s) => ({ style: { ...s.style, template }, isDirty: true })),

      setColor: (primary, secondary, accent) =>
        set((s) => ({
          style: {
            ...s.style,
            primaryColor: primary,
            ...(secondary && { secondaryColor: secondary }),
            ...(accent && { accentColor: accent }),
          },
          isDirty: true,
        })),

      setFont: (fontFamily) =>
        set((s) => ({ style: { ...s.style, fontFamily }, isDirty: true })),

      toggleSection: (section) =>
        set((s) => {
          const hidden = s.style.hiddenSections.includes(section)
            ? s.style.hiddenSections.filter((h) => h !== section)
            : [...s.style.hiddenSections, section];
          return { style: { ...s.style, hiddenSections: hidden }, isDirty: true };
        }),

      reorderSections: (from, to) =>
        set((s) => ({
          style: { ...s.style, sectionOrder: reorder(s.style.sectionOrder, from, to) },
          isDirty: true,
        })),

      // Editor
      setActiveSection: (section) => set({ activeSection: section }),
      setEditorTab: (tab) => set({ editorTab: tab }),
      setPreviewScale: (scale) => set({ previewScale: scale }),

      // Documents
      saveDocument: () =>
        set((s) => {
          const now = new Date().toISOString();
          const doc: ResumeDocument = {
            id: s.currentId || uuidv4(),
            name: `${s.data.personalInfo.firstName || 'Untitled'} ${s.data.personalInfo.lastName || 'Resume'}`.trim(),
            data: s.data,
            style: s.style,
            createdAt: s.documents.find((d) => d.id === s.currentId)?.createdAt || now,
            updatedAt: now,
          };
          const docs = s.documents.filter((d) => d.id !== doc.id);
          return { documents: [doc, ...docs], currentId: doc.id, isDirty: false };
        }),

      loadDocument: (id) => {
        const doc = get().documents.find((d) => d.id === id);
        if (doc) {
          set({ currentId: doc.id, data: doc.data, style: doc.style, isDirty: false });
        }
      },

      createNewResume: (name) =>
        set({
          currentId: uuidv4(),
          data: { ...defaultData },
          style: { ...defaultStyle },
          isDirty: false,
        }),

      deleteDocument: (id) =>
        set((s) => ({
          documents: s.documents.filter((d) => d.id !== id),
          ...(s.currentId === id && { currentId: '', data: { ...defaultData }, style: { ...defaultStyle } }),
        })),

      duplicateDocument: (id) =>
        set((s) => {
          const doc = s.documents.find((d) => d.id === id);
          if (!doc) return {};
          const newDoc: ResumeDocument = {
            ...doc,
            id: uuidv4(),
            name: `${doc.name} (Copy)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          return { documents: [newDoc, ...s.documents] };
        }),

      // Import / Export
      exportData: () => {
        const { data, style } = get();
        return JSON.stringify({ data, style }, null, 2);
      },

      importData: (json) => {
        try {
          const parsed = JSON.parse(json);
          if (parsed.data) {
            set({ data: { ...defaultData, ...parsed.data }, isDirty: true });
          }
          if (parsed.style) {
            set({ style: { ...defaultStyle, ...parsed.style } });
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          console.error('Invalid JSON import:', message);
          throw new Error(`Failed to import resume: ${message}`);
        }
      },

      loadSampleData: () =>
        set({ data: SAMPLE_DATA, isDirty: true }),

      resetData: () =>
        set({
          data: JSON.parse(JSON.stringify(defaultData)),
          style: JSON.parse(JSON.stringify(defaultStyle)),
          jobDescription: { title: '', company: '', text: '' },
          versions: [],
          isDirty: false,
        }),

      importResumeData: (partialData) => {
        // Deep merge: start from blank defaults, then overlay parsed data
        const base = JSON.parse(JSON.stringify(defaultData)) as ResumeData;
        const merged: ResumeData = {
          ...base,
          personalInfo: { ...base.personalInfo, ...(partialData.personalInfo || {}) },
          summary: partialData.summary ?? base.summary,
          experience: partialData.experience && partialData.experience.length > 0 ? partialData.experience : base.experience,
          education: partialData.education && partialData.education.length > 0 ? partialData.education : base.education,
          skills: partialData.skills && partialData.skills.length > 0 ? partialData.skills : base.skills,
          projects: partialData.projects && partialData.projects.length > 0 ? partialData.projects : base.projects,
          certifications: partialData.certifications && partialData.certifications.length > 0 ? partialData.certifications : base.certifications,
          languages: partialData.languages && partialData.languages.length > 0 ? partialData.languages : base.languages,
          awards: partialData.awards && partialData.awards.length > 0 ? partialData.awards : base.awards,
          volunteering: partialData.volunteering && partialData.volunteering.length > 0 ? partialData.volunteering : base.volunteering,
          publications: partialData.publications && partialData.publications.length > 0 ? partialData.publications : base.publications,
          references: partialData.references && partialData.references.length > 0 ? partialData.references : base.references,
          customSections: partialData.customSections && partialData.customSections.length > 0 ? partialData.customSections : base.customSections,
        };
        set({ data: merged, isDirty: true });
      },

      setJobDescription: (jd) =>
        set((s) => ({ jobDescription: { ...s.jobDescription, ...jd } })),

      clearJobDescription: () =>
        set({ jobDescription: { title: '', company: '', text: '' } }),

      saveVersion: (name) =>
        set((s) => {
          const snap: VersionSnapshot = {
            id: uuidv4(),
            name: name || `Snapshot ${new Date().toLocaleString()}`,
            timestamp: new Date().toISOString(),
            data: JSON.parse(JSON.stringify(s.data)),
            style: JSON.parse(JSON.stringify(s.style)),
          };
          return { versions: [snap, ...s.versions].slice(0, 20) };
        }),

      restoreVersion: (id) =>
        set((s) => {
          const snap = s.versions.find((v) => v.id === id);
          if (!snap) return {};
          return { data: snap.data, style: snap.style, isDirty: true };
        }),

      deleteVersion: (id) =>
        set((s) => ({ versions: s.versions.filter((v) => v.id !== id) })),

      getCompletenessScore: () => {
        const { data } = get();
        const pi = data.personalInfo;
        let score = 0;
        const total = 100;
        if (pi.firstName && pi.lastName) score += 8;
        if (pi.email) score += 8;
        if (pi.phone) score += 5;
        if (pi.location) score += 5;
        if (pi.linkedin) score += 5;
        if (pi.title) score += 5;
        if (pi.github || pi.website) score += 4;
        if (data.summary && data.summary.length > 50) score += 12;
        if (data.experience.length > 0) score += data.experience.length >= 2 ? 15 : 10;
        if (data.education.length > 0) score += 8;
        if (data.skills.length > 0 && data.skills.some(s => s.items.length > 0)) score += 10;
        if (data.projects.length > 0) score += 6;
        if (data.certifications.length > 0) score += 5;
        if (data.languages.length > 0) score += 4;
        return Math.min(score, total);
      },
    }),
    {
      name: 'resumeforge-storage',
      partialize: (state) => ({
        documents: state.documents,
        currentId: state.currentId,
        data: state.data,
        style: state.style,
        jobDescription: state.jobDescription,
        versions: state.versions,
      }),
    }
  )
);
