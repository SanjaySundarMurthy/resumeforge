/* ── ResumeForge — Builder Page ────────────────────────────── */
'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useResumeStore } from '@/store/useResumeStore';
import { generatePDF, generatePNG } from '@/lib/pdf-generator';
import { SECTION_LABELS } from '@/types/resume';
import type { SectionKey } from '@/types/resume';
import ResumePreview from '@/components/resume/ResumePreview';
import DesignPanel from '@/components/editor/DesignPanel';
import ATSScorePanel from '@/components/editor/ATSScorePanel';
import {
  PersonalInfoEditor, SummaryEditor, ExperienceEditor, EducationEditor,
  SkillsEditor, ProjectsEditor, CertificationsEditor, LanguagesEditor,
  AwardsEditor, VolunteeringEditor, PublicationsEditor, ReferencesEditor,
} from '@/components/editor/SectionEditors';
import {
  ArrowLeft, Download, FileImage, FileJson, Upload, Sparkles,
  User, FileText, Briefcase, GraduationCap, Code2, FolderKanban,
  Award, Languages, Star, Heart, BookOpen, Users, Palette, BarChart3,
  ChevronDown, Undo2, Redo2, ZoomIn, ZoomOut, RotateCcw,
} from 'lucide-react';

/* ── Section Icon Map ────────────────────────────────────── */
const SECTION_ICONS: Record<string, React.ReactNode> = {
  personalInfo: <User className="w-4 h-4" />,
  summary: <FileText className="w-4 h-4" />,
  experience: <Briefcase className="w-4 h-4" />,
  education: <GraduationCap className="w-4 h-4" />,
  skills: <Code2 className="w-4 h-4" />,
  projects: <FolderKanban className="w-4 h-4" />,
  certifications: <Award className="w-4 h-4" />,
  languages: <Languages className="w-4 h-4" />,
  awards: <Star className="w-4 h-4" />,
  volunteering: <Heart className="w-4 h-4" />,
  publications: <BookOpen className="w-4 h-4" />,
  references: <Users className="w-4 h-4" />,
};

/* ── Editor Component Map ────────────────────────────────── */
const SECTION_EDITORS: Record<string, React.ComponentType> = {
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

/* ── Tab type ────────────────────────────────────────────── */
type Tab = 'content' | 'design' | 'ats';

/* ─────────────────────────────────────────────────────────── */
export default function BuilderPage() {
  const {
    data, style, activeSection, editorTab, previewScale,
    setActiveSection, setEditorTab, setPreviewScale,
    loadSampleData, exportData, importData,
  } = useResumeStore();

  const resumeRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  /* ── Zoom helpers ── */
  const zoomIn = useCallback(() => setPreviewScale(Math.min(previewScale + 0.1, 1.5)), [previewScale, setPreviewScale]);
  const zoomOut = useCallback(() => setPreviewScale(Math.max(previewScale - 0.1, 0.3)), [previewScale, setPreviewScale]);
  const zoomReset = useCallback(() => setPreviewScale(0.55), [setPreviewScale]);

  /* ── Export handlers ── */
  const handlePDF = useCallback(async () => {
    setExporting(true);
    try {
      const name = `${data.personalInfo.firstName || 'resume'}_${data.personalInfo.lastName || 'export'}`.replace(/\s+/g, '_');
      await generatePDF(`${name}.pdf`);
    } catch (e) { console.error('PDF export failed', e); }
    finally { setExporting(false); setShowExportMenu(false); }
  }, [data.personalInfo]);

  const handlePNG = useCallback(async () => {
    setExporting(true);
    try {
      const name = `${data.personalInfo.firstName || 'resume'}_${data.personalInfo.lastName || 'export'}`.replace(/\s+/g, '_');
      await generatePNG(`${name}.png`);
    } catch (e) { console.error('PNG export failed', e); }
    finally { setExporting(false); setShowExportMenu(false); }
  }, [data.personalInfo]);

  const handleExportJSON = useCallback(() => {
    const json = exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume-data.json';
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  }, [exportData]);

  const handleImportJSON = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try { importData(reader.result as string); } catch { alert('Invalid JSON file'); }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [importData]);

  /* ── Section nav items ── */
  const sectionItems: { key: string; label: string }[] = [
    { key: 'personalInfo', label: 'Personal Info' },
    ...style.sectionOrder
      .filter(s => !style.hiddenSections.includes(s))
      .map(s => ({ key: s, label: SECTION_LABELS[s] })),
  ];

  const EditorComponent = SECTION_EDITORS[activeSection] || PersonalInfoEditor;

  /* ── Close export menu on outside click ── */
  useEffect(() => {
    if (!showExportMenu) return;
    const h = () => setShowExportMenu(false);
    const timer = setTimeout(() => document.addEventListener('click', h), 0);
    return () => { clearTimeout(timer); document.removeEventListener('click', h); };
  }, [showExportMenu]);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* ───────── TOP BAR ───────── */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">Back</span>
          </Link>
          <div className="h-5 w-px bg-gray-200" />
          <h1 className="text-sm font-bold text-gray-900">ResumeForge</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="hidden md:flex items-center gap-1 mr-2">
            <button onClick={zoomOut} className="btn-ghost p-1.5" title="Zoom out"><ZoomOut className="w-4 h-4" /></button>
            <span className="text-xs text-gray-500 w-10 text-center">{Math.round(previewScale * 100)}%</span>
            <button onClick={zoomIn} className="btn-ghost p-1.5" title="Zoom in"><ZoomIn className="w-4 h-4" /></button>
            <button onClick={zoomReset} className="btn-ghost p-1.5" title="Fit"><RotateCcw className="w-3.5 h-3.5" /></button>
          </div>

          <button onClick={loadSampleData} className="btn-ghost text-xs gap-1.5" title="Load sample data">
            <Sparkles className="w-3.5 h-3.5" /> Sample
          </button>

          <button onClick={handleImportJSON} className="btn-ghost text-xs gap-1.5" title="Import JSON">
            <Upload className="w-3.5 h-3.5" /> Import
          </button>

          {/* Export dropdown */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowExportMenu(!showExportMenu); }}
              disabled={exporting}
              className="btn-primary text-xs gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> {exporting ? 'Exporting…' : 'Export'} <ChevronDown className="w-3 h-3" />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 animate-fade-in" onClick={(e) => e.stopPropagation()}>
                <button onClick={handlePDF} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <Download className="w-4 h-4 text-red-500" /> Download PDF
                </button>
                <button onClick={handlePNG} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <FileImage className="w-4 h-4 text-blue-500" /> Download PNG
                </button>
                <div className="border-t border-gray-100 my-1" />
                <button onClick={handleExportJSON} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <FileJson className="w-4 h-4 text-green-500" /> Export JSON
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ───────── MAIN CONTENT ───────── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ─── LEFT PANEL: Editor ─── */}
        <div className="w-[420px] bg-white border-r border-gray-200 flex flex-col shrink-0">
          {/* Tab Bar */}
          <div className="flex border-b border-gray-200 shrink-0">
            {([
              { key: 'content' as Tab, label: 'Content', icon: <FileText className="w-3.5 h-3.5" /> },
              { key: 'design' as Tab, label: 'Design', icon: <Palette className="w-3.5 h-3.5" /> },
              { key: 'ats' as Tab, label: 'ATS Score', icon: <BarChart3 className="w-3.5 h-3.5" /> },
            ]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setEditorTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-all ${
                  editorTab === tab.key ? 'tab-active' : 'tab-inactive'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {editorTab === 'content' && (
              <div className="flex">
                {/* Section nav sidebar — always visible */}
                <div className="w-12 sm:w-14 bg-gray-50 border-r border-gray-100 shrink-0 py-2 flex flex-col gap-0.5">
                  {sectionItems.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setActiveSection(key as SectionKey | 'personalInfo')}
                      className={`flex flex-col items-center gap-0.5 py-2 px-1 rounded-r-lg text-[8px] leading-tight transition-all ${
                        activeSection === key
                          ? 'bg-blue-50 text-blue-600 border-l-2 border-blue-600'
                          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 border-l-2 border-transparent'
                      }`}
                      title={label}
                    >
                      {SECTION_ICONS[key]}
                    </button>
                  ))}
                </div>

                {/* Active editor */}
                <div className="flex-1 p-4 animate-fade-in">
                  <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    {SECTION_ICONS[activeSection]}
                    {activeSection === 'personalInfo' ? 'Personal Info' : SECTION_LABELS[activeSection as SectionKey]}
                  </h2>
                  <EditorComponent />
                </div>
              </div>
            )}

            {editorTab === 'design' && (
              <div className="p-4 animate-fade-in">
                <DesignPanel />
              </div>
            )}

            {editorTab === 'ats' && (
              <div className="p-4 animate-fade-in">
                <ATSScorePanel />
              </div>
            )}
          </div>
        </div>

        {/* ─── RIGHT PANEL: Preview ─── */}
        <div className="flex-1 overflow-auto bg-gray-100 p-6 flex justify-center">
          <div className="animate-fade-in">
            <ResumePreview
              ref={resumeRef}
              data={data}
              style={style}
              scale={previewScale}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
