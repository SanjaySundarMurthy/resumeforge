/* ── ResumeForge — Builder Page ───────────────────────────── */

'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useResumeStore } from '@/store/useResumeStore';
import ResumePreview from '@/components/resume/ResumePreview';
import DesignPanel from '@/components/editor/DesignPanel';
import ATSScorePanel from '@/components/editor/ATSScorePanel';
import {
  PersonalInfoEditor,
  SummaryEditor,
  ExperienceEditor,
  EducationEditor,
  SkillsEditor,
  ProjectsEditor,
  CertificationsEditor,
  LanguagesEditor,
  AwardsEditor,
  VolunteeringEditor,
  PublicationsEditor,
  ReferencesEditor,
} from '@/components/editor/SectionEditors';
import {
  FileText, User, AlignLeft, Briefcase, GraduationCap, Wrench,
  FolderOpen, Award, Globe, Trophy, Heart, BookOpen, Users,
  Palette, BarChart3, Download, Save, ZoomIn, ZoomOut, Plus,
  ChevronDown, Upload, FileDown, Sparkles, ArrowLeft,
} from 'lucide-react';
import { downloadPDF } from '@/lib/pdf-generator';
import { downloadText } from '@/lib/utils';
import type { SectionKey } from '@/types/resume';

/* ── Sidebar Navigation ──────────────────────────────────── */

interface NavItem {
  id: string;
  label: string;
  icon: React.FC<{ className?: string }>;
}

const contentNav: NavItem[] = [
  { id: 'personalInfo', label: 'Personal Info', icon: User },
  { id: 'summary', label: 'Summary', icon: AlignLeft },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'certifications', label: 'Certifications', icon: Award },
  { id: 'languages', label: 'Languages', icon: Globe },
  { id: 'awards', label: 'Awards', icon: Trophy },
  { id: 'volunteering', label: 'Volunteering', icon: Heart },
  { id: 'publications', label: 'Publications', icon: BookOpen },
  { id: 'references', label: 'References', icon: Users },
];

/* ── Section Renderer ────────────────────────────────────── */

const sectionEditors: Record<string, React.FC> = {
  personalInfo: PersonalInfoEditor,
  summary: SummaryEditor,
  experience: ExperienceEditor,
  education: EducationEditor,
  skills: SkillsEditor,
  projects: ProjectsEditor,
  certifications: CertificationsEditor,
  languages: LanguagesEditor,
  awards: AwardsEditor,
  volunteering: VolunteeringEditor,
  publications: PublicationsEditor,
  references: ReferencesEditor,
};

/* ── Builder Page Component ──────────────────────────────── */

export default function BuilderPage() {
  const resumeRef = useRef<HTMLDivElement>(null);
  const {
    data, style, editorTab, activeSection,
    setActiveSection, setEditorTab, saveDocument,
    exportData, importData, loadSampleData,
  } = useResumeStore();

  const [scale, setScale] = useState(0.55);
  const [exporting, setExporting] = useState(false);
  const [showActions, setShowActions] = useState(false);

  // Handle PDF export
  const handleExportPDF = useCallback(async () => {
    if (!resumeRef.current) return;
    setExporting(true);
    try {
      const name = `${data.personalInfo.firstName || 'Resume'}_${data.personalInfo.lastName || ''}_Resume`.replace(/\s+/g, '_');
      await downloadPDF(resumeRef.current, `${name}.pdf`, { scale: 2 });
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setExporting(false);
    }
  }, [data.personalInfo.firstName, data.personalInfo.lastName]);

  // Handle JSON export
  const handleExportJSON = useCallback(() => {
    const json = exportData();
    const name = `${data.personalInfo.firstName || 'resume'}_data.json`;
    downloadText(json, name);
  }, [data.personalInfo.firstName, exportData]);

  // Handle JSON import
  const handleImportJSON = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        if (text) importData(text);
      };
      reader.readAsText(file);
    };
    input.click();
  }, [importData]);

  // Active section editor
  const ActiveEditor = sectionEditors[activeSection] || PersonalInfoEditor;
  const activeNavItem = contentNav.find((n) => n.id === activeSection);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-gray-900">ResumeForge</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          {[
            { id: 'content' as const, label: 'Content', icon: AlignLeft },
            { id: 'design' as const, label: 'Design', icon: Palette },
            { id: 'ats' as const, label: 'ATS Score', icon: BarChart3 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setEditorTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                editorTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-1.5 py-0.5">
            <button
              onClick={() => setScale(Math.max(0.3, scale - 0.1))}
              className="p-1 text-gray-500 hover:text-gray-700"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs text-gray-500 w-10 text-center">{Math.round(scale * 100)}%</span>
            <button
              onClick={() => setScale(Math.min(1, scale + 0.1))}
              className="p-1 text-gray-500 hover:text-gray-700"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* More actions dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="btn-ghost text-xs px-2.5 py-1.5"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {showActions && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowActions(false)} />
                <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl border border-gray-200 shadow-xl py-1.5 z-40">
                  <button onClick={() => { loadSampleData(); setShowActions(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" /> Load Sample Data
                  </button>
                  <button onClick={() => { saveDocument(); setShowActions(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50">
                    <Save className="w-3.5 h-3.5" /> Save Resume
                  </button>
                  <hr className="my-1 border-gray-100" />
                  <button onClick={() => { handleExportJSON(); setShowActions(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50">
                    <FileDown className="w-3.5 h-3.5" /> Export JSON
                  </button>
                  <button onClick={() => { handleImportJSON(); setShowActions(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50">
                    <Upload className="w-3.5 h-3.5" /> Import JSON
                  </button>
                </div>
              </>
            )}
          </div>

          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="btn-primary text-xs px-4 py-2"
          >
            <Download className="w-3.5 h-3.5" />
            {exporting ? 'Exporting...' : 'Download PDF'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar — Section Nav (content tab only) */}
        {editorTab === 'content' && (
          <aside className="w-48 bg-white border-r border-gray-200 overflow-y-auto shrink-0">
            <nav className="p-2 space-y-0.5">
              {contentNav.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as SectionKey | 'personalInfo')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-all ${
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                  }`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>
        )}

        {/* Editor Panel */}
        <div className="w-[380px] bg-white border-r border-gray-200 overflow-y-auto shrink-0">
          <div className="p-4">
            {editorTab === 'content' && (
              <>
                <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  {activeNavItem && <activeNavItem.icon className="w-4 h-4 text-blue-600" />}
                  {activeNavItem?.label || 'Personal Info'}
                </h2>
                <ActiveEditor />
              </>
            )}
            {editorTab === 'design' && (
              <>
                <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-blue-600" />
                  Design & Layout
                </h2>
                <DesignPanel />
              </>
            )}
            {editorTab === 'ats' && (
              <>
                <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  ATS Score
                </h2>
                <ATSScorePanel />
              </>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex-1 overflow-auto bg-gray-100/70 flex justify-center p-8">
          <div className="inline-block">
            <ResumePreview
              ref={resumeRef}
              data={data}
              style={style}
              scale={scale}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
