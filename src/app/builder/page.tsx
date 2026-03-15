/* ── ResumeForge — Builder Page v2 ─────────────────────────── */
'use client';

import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useResumeStore } from '@/store/useResumeStore';
import { generatePDF, generatePNG } from '@/lib/pdf-generator';
import { parseResumeFile } from '@/lib/resume-parser';
import { exportToDOCX } from '@/lib/docx-exporter';
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
  ChevronDown, ZoomIn, ZoomOut, RotateCcw, History, FileType,
  Trash2, RotateCw, Clock, Plus, Check, X, FileUp,
} from 'lucide-react';

/* ── Section Icon Map ──────────────────────────────────────── */
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

type Tab = 'content' | 'design' | 'ats' | 'history';

/* ─────────────────────────────────────────────────────────── */
export default function BuilderPage() {
  const {
    data, style, activeSection, editorTab, previewScale,
    setActiveSection, setEditorTab, setPreviewScale,
    loadSampleData, exportData, importData, importResumeData,
    saveVersion, restoreVersion, deleteVersion, versions,
    getCompletenessScore,
  } = useResumeStore();

  const resumeRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState('');
  const [showImportZone, setShowImportZone] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [versionName, setVersionName] = useState('');
  const [savingVersion, setSavingVersion] = useState(false);
  const [notification, setNotification] = useState('');

  const completeness = useMemo(() => getCompletenessScore(), [data]);

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 2500);
  };

  /* ── Zoom ─────────────────────────────────────────────── */
  const zoomIn = useCallback(() => setPreviewScale(Math.min(previewScale + 0.1, 1.5)), [previewScale, setPreviewScale]);
  const zoomOut = useCallback(() => setPreviewScale(Math.max(previewScale - 0.1, 0.3)), [previewScale, setPreviewScale]);
  const zoomReset = useCallback(() => setPreviewScale(0.55), [setPreviewScale]);

  /* ── Export handlers ──────────────────────────────────── */
  const getFilename = useCallback(() =>
    `${data.personalInfo.firstName || 'resume'}_${data.personalInfo.lastName || 'export'}`.replace(/\s+/g, '_'),
    [data.personalInfo]);

  const handlePDF = useCallback(async () => {
    setExporting(true);
    try { await generatePDF(`${getFilename()}.pdf`); }
    catch (e) { console.error(e); }
    finally { setExporting(false); setShowExportMenu(false); notify('PDF downloaded!'); }
  }, [getFilename]);

  const handlePNG = useCallback(async () => {
    setExporting(true);
    try { await generatePNG(`${getFilename()}.png`); }
    catch (e) { console.error(e); }
    finally { setExporting(false); setShowExportMenu(false); notify('PNG downloaded!'); }
  }, [getFilename]);

  const handleExportJSON = useCallback(() => {
    const blob = new Blob([exportData()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'resume-data.json'; a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false); notify('JSON exported!');
  }, [exportData]);

  const handleExportDOCX = useCallback(async () => {
    setExporting(true);
    try { await exportToDOCX(data, style, `${getFilename()}.docx`); notify('DOCX downloaded!'); }
    catch (e) { console.error(e); }
    finally { setExporting(false); setShowExportMenu(false); }
  }, [data, style, getFilename]);

  /* ── Import handler ───────────────────────────────────── */
  const handleImportFile = useCallback(async (file: File) => {
    if (!file) return;
    setImporting(true); setImportError('');
    try {
      if (file.name.endsWith('.json')) {
        const text = await file.text();
        importData(text);
        notify('JSON imported successfully!');
      } else {
        const result = await parseResumeFile(file);
        if (result.success && result.data) {
          importResumeData(result.data);
          notify(`Resume parsed from ${file.name.split('.').pop()?.toUpperCase()}!`);
        } else {
          setImportError(result.error || 'Could not parse file. Try a simpler format.');
        }
      }
      setShowImportZone(false);
    } catch (e: any) {
      setImportError(e.message || 'Import failed');
    } finally { setImporting(false); }
  }, [importData, importResumeData]);

  const handleDropZone = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImportFile(file);
  }, [handleImportFile]);

  const openFilePicker = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.pdf,.doc,.docx,.txt';
    input.onchange = (e) => {
      const f = (e.target as HTMLInputElement).files?.[0];
      if (f) handleImportFile(f);
    };
    input.click();
  }, [handleImportFile]);

  /* ── Version handlers ─────────────────────────────────── */
  const handleSaveVersion = useCallback(() => {
    saveVersion(versionName || undefined);
    setVersionName('');
    setSavingVersion(false);
    notify('Version saved!');
  }, [saveVersion, versionName]);

  const handleRestoreVersion = useCallback((id: string) => {
    restoreVersion(id);
    notify('Version restored!');
  }, [restoreVersion]);

  /* ── Close export on outside click ───────────────────── */
  useEffect(() => {
    if (!showExportMenu) return;
    const h = () => setShowExportMenu(false);
    const timer = setTimeout(() => document.addEventListener('click', h), 0);
    return () => { clearTimeout(timer); document.removeEventListener('click', h); };
  }, [showExportMenu]);

  const sectionItems = [
    { key: 'personalInfo', label: 'Personal Info' },
    ...style.sectionOrder
      .filter(s => !style.hiddenSections.includes(s))
      .map(s => ({ key: s, label: SECTION_LABELS[s] })),
  ];

  const EditorComponent = SECTION_EDITORS[activeSection] || PersonalInfoEditor;

  const completenessColor = completeness >= 80 ? '#10b981' : completeness >= 60 ? '#3b82f6' : '#f59e0b';

  return (
    <div className="h-screen flex flex-col bg-gray-100">

      {/* ── Toast notification ─────────────────────────── */}
      {notification && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 text-white text-sm px-5 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-green-400" /> {notification}
        </div>
      )}

      {/* ── Import Modal ───────────────────────────────── */}
      {showImportZone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Import Resume</h2>
              <button onClick={() => { setShowImportZone(false); setImportError(''); }} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDropZone}
              onClick={openFilePicker}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }`}
            >
              {importing ? (
                <div className="flex flex-col items-center gap-3">
                  <RotateCw className="w-8 h-8 text-blue-500 animate-spin" />
                  <p className="text-sm text-gray-600">Parsing your resume…</p>
                </div>
              ) : (
                <>
                  <FileUp className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-700">Drop file here, or click to browse</p>
                  <p className="text-xs text-gray-400 mt-2">Supports PDF, DOCX, DOC, TXT, JSON</p>
                </>
              )}
            </div>
            {importError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {importError}
              </div>
            )}
            <div className="mt-5 grid grid-cols-5 gap-2 text-center">
              {['PDF', 'DOCX', 'DOC', 'TXT', 'JSON'].map((fmt) => (
                <div key={fmt} className="py-1.5 rounded-lg bg-gray-100 text-xs font-semibold text-gray-600">{fmt}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TOP BAR ──────────────────────────────────── */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">Back</span>
          </Link>
          <div className="h-5 w-px bg-gray-200" />
          <h1 className="text-sm font-bold text-gray-900">ResumeForge</h1>

          {/* Completeness bar */}
          <div className="hidden md:flex items-center gap-2 ml-2">
            <div className="w-28 h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${completeness}%`, backgroundColor: completenessColor }}
              />
            </div>
            <span className="text-xs font-semibold tabular-nums" style={{ color: completenessColor }}>
              {completeness}%
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom */}
          <div className="hidden md:flex items-center gap-1 mr-2">
            <button onClick={zoomOut} className="btn-ghost p-1.5"><ZoomOut className="w-4 h-4" /></button>
            <span className="text-xs text-gray-500 w-10 text-center">{Math.round(previewScale * 100)}%</span>
            <button onClick={zoomIn} className="btn-ghost p-1.5"><ZoomIn className="w-4 h-4" /></button>
            <button onClick={zoomReset} className="btn-ghost p-1.5"><RotateCcw className="w-3.5 h-3.5" /></button>
          </div>

          <button onClick={loadSampleData} className="btn-ghost text-xs gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Sample
          </button>

          <button onClick={() => setShowImportZone(true)} className="btn-ghost text-xs gap-1.5">
            <Upload className="w-3.5 h-3.5" /> Import
          </button>

          {/* Export dropdown */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowExportMenu(!showExportMenu); }}
              disabled={exporting}
              className="btn-primary text-xs gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              {exporting ? 'Exporting…' : 'Export'}
              <ChevronDown className="w-3 h-3" />
            </button>
            {showExportMenu && (
              <div
                className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-50 animate-fade-in"
                onClick={(e) => e.stopPropagation()}
              >
                <button onClick={handlePDF} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                  <Download className="w-4 h-4 text-red-500" /> Download PDF
                </button>
                <button onClick={handlePNG} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                  <FileImage className="w-4 h-4 text-blue-500" /> Download PNG
                </button>
                <button onClick={handleExportDOCX} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                  <FileType className="w-4 h-4 text-indigo-500" /> Download DOCX
                </button>
                <div className="border-t border-gray-100 my-1" />
                <button onClick={handleExportJSON} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                  <FileJson className="w-4 h-4 text-green-500" /> Export JSON (backup)
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ─────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ─── LEFT PANEL ─── */}
        <div className="w-[420px] bg-white border-r border-gray-200 flex flex-col shrink-0">
          {/* Tab Bar */}
          <div className="flex border-b border-gray-200 shrink-0">
            {([
              { key: 'content' as Tab, label: 'Content', icon: <FileText className="w-3.5 h-3.5" /> },
              { key: 'design' as Tab, label: 'Design', icon: <Palette className="w-3.5 h-3.5" /> },
              { key: 'ats' as Tab, label: 'ATS', icon: <BarChart3 className="w-3.5 h-3.5" /> },
              { key: 'history' as Tab, label: 'History', icon: <History className="w-3.5 h-3.5" /> },
            ]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setEditorTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-1 py-3 text-[11px] font-medium transition-all ${
                  editorTab === tab.key ? 'tab-active' : 'tab-inactive'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.key === 'history' && versions.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[8px] font-bold flex items-center justify-center ml-0.5">
                    {versions.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto scrollbar-thin">

            {/* ── CONTENT TAB ── */}
            {editorTab === 'content' && (
              <div className="flex h-full">
                <div className="w-12 sm:w-14 bg-gray-50 border-r border-gray-100 shrink-0 py-2 flex flex-col gap-0.5">
                  {sectionItems.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setActiveSection(key as SectionKey | 'personalInfo')}
                      title={label}
                      className={`flex flex-col items-center gap-0.5 py-2 px-1 rounded-r-lg text-[8px] leading-tight transition-all ${
                        activeSection === key
                          ? 'bg-blue-50 text-blue-600 border-l-2 border-blue-600'
                          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 border-l-2 border-transparent'
                      }`}
                    >
                      {SECTION_ICONS[key]}
                    </button>
                  ))}
                </div>
                <div className="flex-1 p-4 animate-fade-in overflow-y-auto">
                  <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    {SECTION_ICONS[activeSection]}
                    {activeSection === 'personalInfo' ? 'Personal Info' : SECTION_LABELS[activeSection as SectionKey]}
                  </h2>
                  <EditorComponent />
                </div>
              </div>
            )}

            {/* ── DESIGN TAB ── */}
            {editorTab === 'design' && (
              <div className="p-4 animate-fade-in">
                <DesignPanel />
              </div>
            )}

            {/* ── ATS TAB ── */}
            {editorTab === 'ats' && (
              <div className="p-4 animate-fade-in">
                <ATSScorePanel />
              </div>
            )}

            {/* ── HISTORY TAB ── */}
            {editorTab === 'history' && (
              <div className="p-4 animate-fade-in space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Version History</h3>
                  <p className="text-[10px] text-gray-400 mb-4">Save snapshots to quickly compare or revert to previous versions.</p>

                  {/* Save new version */}
                  {savingVersion ? (
                    <div className="flex items-center gap-2 mb-4">
                      <input
                        type="text"
                        value={versionName}
                        onChange={(e) => setVersionName(e.target.value)}
                        placeholder="Version name (optional)"
                        className="input-field text-xs flex-1"
                        autoFocus
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSaveVersion(); if (e.key === 'Escape') setSavingVersion(false); }}
                      />
                      <button onClick={handleSaveVersion} className="btn-primary text-xs px-3 py-2"><Check className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setSavingVersion(false)} className="btn-ghost text-xs px-3 py-2"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSavingVersion(true)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-gray-300 text-xs font-semibold text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all mb-4"
                    >
                      <Plus className="w-3.5 h-3.5" /> Save current version
                    </button>
                  )}

                  {/* Version list */}
                  {versions.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-xs text-gray-400">No saved versions yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {[...versions].reverse().map((v) => (
                        <div key={v.id} className="flex items-center gap-2 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:border-gray-200 transition-all group">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-800 truncate">{v.name}</p>
                            <p className="text-[10px] text-gray-400">
                              {new Date(v.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                            {v.atsScore !== undefined && (
                              <p className="text-[10px] font-bold text-blue-600">ATS: {v.atsScore}</p>
                            )}
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleRestoreVersion(v.id)}
                              title="Restore"
                              className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600"
                            >
                              <RotateCw className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteVersion(v.id)}
                              title="Delete"
                              className="p-1.5 rounded-lg hover:bg-red-100 text-red-500"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
