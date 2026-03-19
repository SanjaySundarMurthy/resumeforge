/* ── ResumeForge — Builder Page v4 ─────────────────────────── */
/* Features: drag-drop reorder, mobile responsive, auto-save,
   undo/redo, job URL import, lazy-loaded tabs, keyboard shortcuts */
'use client';

import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useResumeStore, useHasHydrated } from '@/store/useResumeStore';
import { generatePDF, generatePNG } from '@/lib/pdf-generator';
import { parseResumeFile } from '@/lib/resume-parser';
import { exportToDOCX } from '@/lib/docx-exporter';
import { SECTION_LABELS } from '@/types/resume';
import type { SectionKey } from '@/types/resume';
import ResumePreview from '@/components/resume/ResumePreview';
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
  Trash2, RotateCw, Clock, Plus, Check, X, FileUp, Eraser,
  AlertTriangle, Keyboard, GripVertical, Undo2, Redo2,
  Eye, Loader2, PanelLeftClose, PanelLeft, Moon, Sun,
  Maximize2,
} from 'lucide-react';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

/* ── Lazy-loaded heavy panels ────────────────────────────── */
const DesignPanel = dynamic(() => import('@/components/editor/DesignPanel'), {
  loading: () => <PanelSkeleton />,
});
const ATSScorePanel = dynamic(() => import('@/components/editor/ATSScorePanel'), {
  loading: () => <PanelSkeleton />,
});

function PanelSkeleton() {
  return (
    <div className="space-y-4 p-1 animate-pulse">
      <div className="h-4 w-24 bg-gray-200 rounded" />
      <div className="grid grid-cols-2 gap-3">
        {[1,2,3,4].map(i => <div key={i} className="h-28 bg-gray-100 rounded-xl" />)}
      </div>
      <div className="h-4 w-20 bg-gray-200 rounded" />
      <div className="space-y-2">
        {[1,2,3].map(i => <div key={i} className="h-10 bg-gray-100 rounded-lg" />)}
      </div>
    </div>
  );
}

/* ── Section Icons ────────────────────────────────────────── */
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

/* ── Undo/Redo Hook ──────────────────────────────────────── */
function useUndoRedo(maxHistory = 30) {
  const [past, setPast] = useState<string[]>([]);
  const [future, setFuture] = useState<string[]>([]);
  const lastSnap = useRef('');

  const snapshot = useCallback((dataJson: string) => {
    if (dataJson === lastSnap.current) return;
    setPast(p => [...p.slice(-(maxHistory - 1)), lastSnap.current]);
    setFuture([]);
    lastSnap.current = dataJson;
  }, [maxHistory]);

  const init = useCallback((dataJson: string) => {
    lastSnap.current = dataJson;
  }, []);

  const undo = useCallback(() => {
    if (past.length === 0) return null;
    const prev = past[past.length - 1];
    setPast(p => p.slice(0, -1));
    setFuture(f => [lastSnap.current, ...f]);
    lastSnap.current = prev;
    return prev;
  }, [past]);

  const redo = useCallback(() => {
    if (future.length === 0) return null;
    const next = future[0];
    setFuture(f => f.slice(1));
    setPast(p => [...p, lastSnap.current]);
    lastSnap.current = next;
    return next;
  }, [future]);

  return { snapshot, init, undo, redo, canUndo: past.length > 0, canRedo: future.length > 0 };
}

/* ─────────────────────────────────────────────────────────── */
export default function BuilderPage() {
  const hydrated = useHasHydrated();

  /* Granular Zustand selectors — prevent full re-render on every keystroke */
  const data = useResumeStore((s) => s.data);
  const style = useResumeStore((s) => s.style);
  const activeSection = useResumeStore((s) => s.activeSection);
  const editorTab = useResumeStore((s) => s.editorTab);
  const previewScale = useResumeStore((s) => s.previewScale);
  const versions = useResumeStore((s) => s.versions);
  const setActiveSection = useResumeStore((s) => s.setActiveSection);
  const setEditorTab = useResumeStore((s) => s.setEditorTab);
  const setPreviewScale = useResumeStore((s) => s.setPreviewScale);
  const loadSampleData = useResumeStore((s) => s.loadSampleData);
  const exportData = useResumeStore((s) => s.exportData);
  const importData = useResumeStore((s) => s.importData);
  const importResumeData = useResumeStore((s) => s.importResumeData);
  const saveVersion = useResumeStore((s) => s.saveVersion);
  const restoreVersion = useResumeStore((s) => s.restoreVersion);
  const deleteVersion = useResumeStore((s) => s.deleteVersion);
  const getCompletenessScore = useResumeStore((s) => s.getCompletenessScore);
  const resetData = useResumeStore((s) => s.resetData);
  const reorderSections = useResumeStore((s) => s.reorderSections);

  const resumeRef = useRef<HTMLDivElement>(null);
  const { isDark, toggle: toggleDarkMode } = useDarkMode();
  const [exporting, setExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');
  const [showImportZone, setShowImportZone] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [versionName, setVersionName] = useState('');
  const [savingVersion, setSavingVersion] = useState(false);
  const [notification, setNotification] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [sectionKey, setSectionKey] = useState(0);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  /* ── Mobile state ── */
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');
  const [showMobilePanel, setShowMobilePanel] = useState(true);

  /* ── Auto-save state ── */
  const autoSaveStatus = useAutoSave([data, style]);

  /* ── Drag-drop state ── */
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  /* ── Undo/Redo ── */
  const { snapshot, init, undo, redo, canUndo, canRedo } = useUndoRedo();

  // Initialize undo history
  useEffect(() => {
    init(JSON.stringify(data));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Take undo snapshot on data changes (debounced)
  const snapshotTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (snapshotTimer.current) clearTimeout(snapshotTimer.current);
    snapshotTimer.current = setTimeout(() => {
      snapshot(JSON.stringify(data));
    }, 800);
    return () => { if (snapshotTimer.current) clearTimeout(snapshotTimer.current); };
  }, [data, snapshot]);

  const handleUndo = useCallback(() => {
    const prev = undo();
    if (prev) {
      try {
        const parsed = JSON.parse(prev);
        if (parsed && typeof parsed === 'object') {
          importResumeData(parsed);
          notify('Undone!');
        }
      } catch (e) { console.warn('Undo failed:', e); }
    }
  }, [undo, importResumeData]);

  const handleRedo = useCallback(() => {
    const next = redo();
    if (next) {
      try {
        const parsed = JSON.parse(next);
        if (parsed && typeof parsed === 'object') {
          importResumeData(parsed);
          notify('Redone!');
        }
      } catch (e) { console.warn('Redo failed:', e); }
    }
  }, [redo, importResumeData]);

  const completeness = useMemo(() => getCompletenessScore(), [data, getCompletenessScore]);

  const notify = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  }, []);

  /* ── Section change animation ── */
  useEffect(() => { setSectionKey(k => k + 1); }, [activeSection]);

  /* ── Zoom ── */
  const zoomIn = useCallback(() => setPreviewScale(Math.min(previewScale + 0.1, 1.5)), [previewScale, setPreviewScale]);
  const zoomOut = useCallback(() => setPreviewScale(Math.max(previewScale - 0.1, 0.3)), [previewScale, setPreviewScale]);
  const zoomReset = useCallback(() => setPreviewScale(0.6), [setPreviewScale]);

  const getFilename = useCallback(() =>
    `${data.personalInfo.firstName || 'resume'}_${data.personalInfo.lastName || 'export'}`.replace(/\s+/g, '_'),
    [data.personalInfo]);

  /* ── Export handlers ── */
  const handlePDF = useCallback(async () => {
    setExporting(true);
    try { await generatePDF(`${getFilename()}.pdf`); notify('PDF downloaded!'); }
    catch (e) { console.error(e); notify('Export failed — try again'); }
    finally { setExporting(false); setShowExportMenu(false); }
  }, [getFilename]);

  const handlePNG = useCallback(async () => {
    setExporting(true);
    try { await generatePNG(`${getFilename()}.png`); notify('PNG downloaded!'); }
    catch (e) { console.error(e); notify('PNG export failed — try again'); }
    finally { setExporting(false); setShowExportMenu(false); }
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
    catch (e) { console.error(e); notify('DOCX export failed — try again'); }
    finally { setExporting(false); setShowExportMenu(false); }
  }, [data, style, getFilename]);

  /* ── Import handler ── */
  const handleImportFile = useCallback(async (file: File) => {
    if (!file) return;
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
    if (file.size > MAX_FILE_SIZE) {
      setImportError(`File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum size is 10 MB.`);
      return;
    }
    setImporting(true); setImportError(''); setImportSuccess('');
    try {
      if (file.name.endsWith('.json')) {
        const text = await file.text();
        importData(text);
        setImportSuccess('JSON imported successfully!');
        notify('JSON imported!');
      } else {
        const result = await parseResumeFile(file);
        if (result.success && result.data) {
          importResumeData(result.data);
          const pi = result.data.personalInfo;
          const parts: string[] = [];
          if (pi?.firstName || pi?.lastName) parts.push(`Name: ${pi.firstName || ''} ${pi.lastName || ''}`);
          if (pi?.email) parts.push(`Email: ${pi.email}`);
          const expCount = result.data.experience?.length || 0;
          const eduCount = result.data.education?.length || 0;
          if (expCount > 0) parts.push(`${expCount} experience${expCount > 1 ? 's' : ''}`);
          if (eduCount > 0) parts.push(`${eduCount} education`);
          setImportSuccess(parts.length > 0 ? `Extracted: ${parts.join(' · ')}` : 'File parsed. Edit sections manually.');
          notify(`Resume parsed from ${file.name.split('.').pop()?.toUpperCase()}!`);
        } else {
          setImportError(result.error || 'Could not parse file.');
        }
      }
    } catch (e: any) {
      setImportError(e.message || 'Import failed.');
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

  const handleClearAll = useCallback(() => {
    resetData(); setShowClearConfirm(false); notify('All data cleared!');
  }, [resetData]);

  const handleSaveVersion = useCallback(() => {
    saveVersion(versionName || undefined);
    setVersionName(''); setSavingVersion(false); notify('Version saved!');
  }, [saveVersion, versionName]);

  const handleRestoreVersion = useCallback((id: string) => {
    restoreVersion(id); notify('Version restored!');
  }, [restoreVersion]);

  /* ── Keyboard Shortcuts (extracted) ── */
  useKeyboardShortcuts({
    onSave: () => { saveVersion(); notify('Version saved!'); },
    onExport: handlePDF,
    onImport: () => setShowImportZone(true),
    onUndo: handleUndo,
    onRedo: handleRedo,
    onEscape: () => { setShowImportZone(false); setShowClearConfirm(false); setShowExportMenu(false); setShowShortcuts(false); },
    onToggleShortcuts: () => setShowShortcuts(s => !s),
    onTabSwitch: (i) => { const tabs: Tab[] = ['content', 'design', 'ats', 'history']; setEditorTab(tabs[i]); },
  });

  /* ── Close export on outside click ── */
  useEffect(() => {
    if (!showExportMenu) return;
    const h = () => setShowExportMenu(false);
    const timer = setTimeout(() => document.addEventListener('click', h), 0);
    return () => { clearTimeout(timer); document.removeEventListener('click', h); };
  }, [showExportMenu]);

  /* ── Section list (with drag-drop support) ── */
  const sectionItems = useMemo(() => [
    { key: 'personalInfo', label: 'Personal Info', isDraggable: false },
    ...style.sectionOrder
      .filter(s => !style.hiddenSections.includes(s))
      .map(s => ({ key: s, label: SECTION_LABELS[s], isDraggable: true })),
  ], [style.sectionOrder, style.hiddenSections]);

  const EditorComponent = SECTION_EDITORS[activeSection] || PersonalInfoEditor;
  const completenessColor = completeness >= 80 ? '#10b981' : completeness >= 60 ? '#3b82f6' : '#f59e0b';

  /* ── Drag-drop handlers for section sidebar ── */
  const handleDragStart = useCallback((idx: number) => { setDragIdx(idx); }, []);
  const handleDragOver = useCallback((e: React.DragEvent, idx: number) => { e.preventDefault(); setDragOverIdx(idx); }, []);
  const handleDrop = useCallback((targetIdx: number) => {
    if (dragIdx !== null && dragIdx !== targetIdx) {
      const fromSection = dragIdx - 1;
      const toSection = targetIdx - 1;
      if (fromSection >= 0 && toSection >= 0) {
        reorderSections(fromSection, toSection);
        notify('Sections reordered!');
      }
    }
    setDragIdx(null); setDragOverIdx(null);
  }, [dragIdx, reorderSections]);
  const handleDragEnd = useCallback(() => { setDragIdx(null); setDragOverIdx(null); }, []);

  /* ── Section completion helper ── */
  const sectionHasContent = (key: string): boolean => {
    const pi = data.personalInfo;
    switch (key) {
      case 'personalInfo': return !!(pi.firstName || pi.email);
      case 'summary': return data.summary.length > 20;
      case 'experience': return data.experience.length > 0;
      case 'education': return data.education.length > 0;
      case 'skills': return data.skills.length > 0 && data.skills.some(s => s.items.length > 0);
      case 'projects': return data.projects.length > 0;
      case 'certifications': return data.certifications.length > 0;
      case 'languages': return data.languages.length > 0;
      case 'awards': return data.awards.length > 0;
      case 'volunteering': return data.volunteering.length > 0;
      case 'publications': return data.publications.length > 0;
      case 'references': return data.references.length > 0;
      default: return false;
    }
  };

  // Gate rendering until Zustand has rehydrated from localStorage to avoid
  // React hydration mismatches between server defaults and persisted state.
  if (!hydrated) {
    return (
      <div className="h-screen flex flex-col bg-gray-100 animate-pulse">
        <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-16 h-4 bg-gray-200 rounded" />
            <div className="w-px h-5 bg-gray-200" />
            <div className="w-24 h-4 bg-gray-200 rounded" />
            <div className="w-32 h-2 bg-gray-200 rounded-full ml-2" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-lg" />
            <div className="w-8 h-8 bg-gray-200 rounded-lg" />
            <div className="w-24 h-8 bg-blue-200 rounded-lg" />
          </div>
        </div>
        <div className="flex-1 flex overflow-hidden">
          <div className="w-[420px] bg-white border-r border-gray-200 hidden md:flex flex-col">
            <div className="flex border-b border-gray-200 px-2 py-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-1 flex justify-center"><div className="w-12 h-3 bg-gray-200 rounded" /></div>
              ))}
            </div>
            <div className="p-4 space-y-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-10 bg-gray-100 rounded-lg" />
              ))}
            </div>
          </div>
          <div className="flex-1 bg-gray-100 flex items-start justify-center p-8">
            <div className="bg-white rounded-sm shadow-lg w-[476px]" style={{ aspectRatio: '794/1123' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary fallbackMessage="The resume builder encountered an error. Your data is safe.">
      <div className="h-screen flex flex-col bg-gray-100">

      {/* ── Skip Navigation ── */}
      <a href="#resume-editor" className="sr-only focus:not-sr-only focus:absolute focus:z-[200] focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium">
        Skip to editor
      </a>

      {/* ── Toast ── */}
      {notification && (
        <div role="status" aria-live="polite" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 text-white text-sm px-5 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-toast-slide">
          <Check className="w-4 h-4 text-green-400" /> {notification}
        </div>
      )}

      {/* ── Clear Confirmation ── */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="clear-title">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 animate-bounce-in">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 id="clear-title" className="text-sm font-bold text-gray-900">Clear all data?</h3>
                <p className="text-xs text-gray-500 mt-0.5">This cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowClearConfirm(false)} className="btn-ghost flex-1 text-xs">Cancel</button>
              <button onClick={handleClearAll} className="btn-danger flex-1 text-xs gap-1.5"><Trash2 className="w-3.5 h-3.5" /> Clear Everything</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Keyboard Shortcuts Modal ── */}
      {showShortcuts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="shortcuts-title" onClick={() => setShowShortcuts(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 animate-bounce-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-blue-600" />
                <h3 id="shortcuts-title" className="text-sm font-bold text-gray-900">Keyboard Shortcuts</h3>
              </div>
              <button onClick={() => setShowShortcuts(false)} className="text-gray-400 hover:text-gray-700"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-1.5">
              {[
                { keys: ['Ctrl', 'Z'], desc: 'Undo' },
                { keys: ['Ctrl', 'Shift', 'Z'], desc: 'Redo' },
                { keys: ['Ctrl', 'S'], desc: 'Save version' },
                { keys: ['Ctrl', 'E'], desc: 'Export as PDF' },
                { keys: ['Ctrl', 'I'], desc: 'Import resume' },
                { keys: ['Ctrl', '/'], desc: 'Show shortcuts' },
                { keys: ['1-4'], desc: 'Switch tabs' },
                { keys: ['Esc'], desc: 'Close modal' },
              ].map((shortcut, i) => (
                <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50">
                  <span className="text-xs text-gray-600">{shortcut.desc}</span>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((k, j) => (
                      <kbd key={j} className="px-2 py-0.5 text-[10px] font-mono bg-gray-100 border border-gray-200 rounded text-gray-700">{k}</kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Full-Screen Preview Modal ── */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex flex-col bg-gray-900/95 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Resume preview">
          {/* Preview toolbar */}
          <div className="flex items-center justify-between px-6 py-3 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <Maximize2 className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-bold text-white">Full-Screen Preview</h3>
              <span className="text-xs text-gray-400 hidden sm:inline">This is how your resume will look when exported</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handlePDF} className="btn-primary text-xs gap-1.5 px-4 py-2">
                <Download className="w-3.5 h-3.5" /> Download PDF
              </button>
              <button onClick={handleExportDOCX} className="btn-secondary text-xs gap-1.5 px-4 py-2 text-white border-gray-600 hover:bg-gray-700">
                <FileType className="w-3.5 h-3.5" /> DOCX
              </button>
              <button onClick={() => setShowPreview(false)} className="btn-ghost text-white p-2 hover:bg-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          {/* Preview body */}
          <div className="flex-1 overflow-auto flex justify-center items-start py-8 px-4">
            <div className="shadow-2xl shadow-black/50">
              <ResumePreview data={data} style={style} scale={0.85} />
            </div>
          </div>
        </div>
      )}

      {/* ── Import Modal ── */}
      {showImportZone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="import-title">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-lg mx-4 animate-bounce-in">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 id="import-title" className="text-lg font-bold text-gray-900">Import Resume</h2>
                <p className="text-xs text-gray-400 mt-0.5">Upload a file to populate all fields</p>
              </div>
              <button onClick={() => { setShowImportZone(false); setImportError(''); setImportSuccess(''); }} className="text-gray-400 hover:text-gray-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDropZone}
              onClick={openFilePicker}
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all ${
                dragging ? 'border-blue-500 bg-blue-50 scale-[1.02]' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'
              }`}
            >
              {importing ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                  <p className="text-sm font-medium text-gray-600">Parsing your resume...</p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileUp className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-sm font-bold text-gray-700">Drop your resume here, or click to browse</p>
                  <p className="text-xs text-gray-400 mt-2">We&apos;ll extract all your content automatically</p>
                </>
              )}
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              {['PDF', 'DOCX', 'TXT', 'JSON'].map((fmt) => (
                <span key={fmt} className="px-3 py-1.5 rounded-lg bg-gray-100 text-[10px] font-bold text-gray-600">{fmt}</span>
              ))}
            </div>

            {importError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /><div>{importError}</div>
              </div>
            )}
            {importSuccess && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 flex items-start gap-2">
                <Check className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">Import successful!</p>
                  <p className="text-xs text-green-600">{importSuccess}</p>
                </div>
              </div>
            )}

            <div className="mt-4 p-3 bg-gray-50 rounded-xl">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">How import works</p>
              <ul className="text-[11px] text-gray-500 space-y-1">
                <li>• <strong>PDF/DOCX/TXT</strong>: Smart parsing to detect sections</li>
                <li>• <strong>JSON</strong>: Loads previously exported data</li>
                <li>• All imported data is <strong>fully editable</strong></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ── TOP BAR ── */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-3 sm:px-4 shrink-0 z-20" role="banner">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile panel toggle */}
          <button onClick={() => setShowMobilePanel(!showMobilePanel)} className="md:hidden btn-ghost p-1.5">
            {showMobilePanel ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
          </button>

          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">Back</span>
          </Link>
          <div className="h-5 w-px bg-gray-200 hidden sm:block" />
          <h1 className="text-sm font-bold text-gray-900 hidden sm:block">ResumeForge</h1>

          {/* Completeness */}
          <div className="hidden lg:flex items-center gap-2 ml-2">
            <div className="w-32 h-2 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${completeness}%`, backgroundColor: completenessColor }} />
            </div>
            <span className="text-xs font-bold tabular-nums" style={{ color: completenessColor }}>{completeness}%</span>
          </div>

          {/* Auto-save indicator */}
          <div className="hidden sm:flex items-center gap-1 ml-2">
            {autoSaveStatus === 'saved' && <span className="text-[10px] text-green-600 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Saved</span>}
            {autoSaveStatus === 'saving' && <span className="text-[10px] text-blue-600 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Saving...</span>}
            {autoSaveStatus === 'unsaved' && <span className="text-[10px] text-amber-600 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> Unsaved</span>}
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Undo / Redo */}
          <button onClick={handleUndo} disabled={!canUndo} className="btn-ghost p-1.5" title="Undo (Ctrl+Z)" aria-label="Undo">
            <Undo2 className={`w-4 h-4 ${canUndo ? '' : 'opacity-30'}`} />
          </button>
          <button onClick={handleRedo} disabled={!canRedo} className="btn-ghost p-1.5" title="Redo (Ctrl+Shift+Z)" aria-label="Redo">
            <Redo2 className={`w-4 h-4 ${canRedo ? '' : 'opacity-30'}`} />
          </button>

          <div className="h-5 w-px bg-gray-200 hidden sm:block" />

          {/* Zoom (desktop) */}
          <div className="hidden lg:flex items-center gap-0.5 mr-1" role="group" aria-label="Zoom controls">
            <button onClick={zoomOut} className="btn-ghost p-1.5" aria-label="Zoom out"><ZoomOut className="w-4 h-4" /></button>
            <span className="text-xs text-gray-500 w-10 text-center tabular-nums" aria-label={`Zoom ${Math.round(previewScale * 100)}%`}>{Math.round(previewScale * 100)}%</span>
            <button onClick={zoomIn} className="btn-ghost p-1.5" aria-label="Zoom in"><ZoomIn className="w-4 h-4" /></button>
            <button onClick={zoomReset} className="btn-ghost p-1.5" aria-label="Reset zoom"><RotateCcw className="w-3.5 h-3.5" /></button>
          </div>

          <button onClick={() => setShowClearConfirm(true)} className="btn-ghost text-xs gap-1 text-red-500 hover:text-red-600 hover:bg-red-50 hidden sm:inline-flex" title="Clear all data">
            <Eraser className="w-3.5 h-3.5" /> <span className="hidden lg:inline">Clear</span>
          </button>

          <button onClick={loadSampleData} className="btn-ghost text-xs gap-1.5 hidden sm:inline-flex" aria-label="Load sample resume data">
            <Sparkles className="w-3.5 h-3.5" /> <span className="hidden lg:inline">Sample</span>
          </button>

          <button onClick={() => setShowImportZone(true)} className="btn-ghost text-xs gap-1.5" aria-label="Import resume">
            <Upload className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Import</span>
          </button>

          <button onClick={toggleDarkMode} className="btn-ghost p-1.5" title={isDark ? 'Switch to light mode' : 'Switch to dark mode'} aria-label="Toggle dark mode">
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button onClick={() => setShowShortcuts(true)} className="btn-ghost p-1.5 hidden lg:flex" title="Keyboard shortcuts (Ctrl+/)">
            <Keyboard className="w-4 h-4" />
          </button>

          {/* Mobile preview toggle */}
          <button onClick={() => setMobileView(mobileView === 'editor' ? 'preview' : 'editor')} className="md:hidden btn-ghost p-1.5" title="Toggle preview">
            <Eye className="w-4 h-4" />
          </button>

          {/* Export dropdown */}
          <div className="relative">
            <button onClick={(e) => { e.stopPropagation(); setShowExportMenu(!showExportMenu); }} disabled={exporting} className="btn-primary text-xs gap-1.5" aria-haspopup="true" aria-expanded={showExportMenu}>
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{exporting ? 'Exporting...' : 'Export'}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {showExportMenu && (
              <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-50 animate-fade-in" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => { setShowPreview(true); setShowExportMenu(false); }} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                  <Maximize2 className="w-4 h-4 text-purple-500" /> Preview Before Export
                </button>
                <div className="border-t border-gray-100 my-1" />
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
                  <FileJson className="w-4 h-4 text-green-500" /> Export JSON
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main id="resume-editor" className="flex-1 flex overflow-hidden">

        {/* ── LEFT PANEL (responsive) ── */}
        <div className={`${showMobilePanel ? 'flex' : 'hidden'} md:flex ${mobileView === 'preview' ? 'hidden md:flex' : ''} w-full md:w-[420px] bg-white border-r border-gray-200 flex-col shrink-0`} role="region" aria-label="Resume editor">
          {/* Tab bar */}
          <nav className="flex border-b border-gray-200 shrink-0" role="tablist" aria-label="Editor tabs">
            {([
              { key: 'content' as Tab, label: 'Content', icon: <FileText className="w-3.5 h-3.5" /> },
              { key: 'design' as Tab, label: 'Design', icon: <Palette className="w-3.5 h-3.5" /> },
              { key: 'ats' as Tab, label: 'ATS', icon: <BarChart3 className="w-3.5 h-3.5" /> },
              { key: 'history' as Tab, label: 'History', icon: <History className="w-3.5 h-3.5" /> },
            ]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setEditorTab(tab.key)}
                role="tab"
                aria-selected={editorTab === tab.key}
                aria-controls={`tabpanel-${tab.key}`}
                className={`flex-1 flex items-center justify-center gap-1 py-3 text-[11px] font-medium transition-all ${editorTab === tab.key ? 'tab-active' : 'tab-inactive'}`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.key === 'history' && versions.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[8px] font-bold flex items-center justify-center ml-0.5">{versions.length}</span>
                )}
              </button>
            ))}
          </nav>

          {/* Panel content */}
          <div className="flex-1 overflow-y-auto scrollbar-thin">

            {/* CONTENT TAB */}
            {editorTab === 'content' && (
              <div id="tabpanel-content" role="tabpanel" aria-labelledby="tab-content" className="flex h-full">
                {/* Section sidebar with drag-drop */}
                <div className="w-12 sm:w-14 bg-gray-50 border-r border-gray-100 shrink-0 py-2 flex flex-col gap-0.5 overflow-y-auto scrollbar-hide">
                  {sectionItems.map(({ key, label, isDraggable }, idx) => (
                    <button
                      key={key}
                      onClick={() => setActiveSection(key as SectionKey | 'personalInfo')}
                      title={`${label}${isDraggable ? ' (drag to reorder)' : ''}`}
                      aria-label={`Edit ${label} section`}
                      aria-current={activeSection === key ? 'true' : undefined}
                      draggable={isDraggable}
                      onDragStart={isDraggable ? () => handleDragStart(idx) : undefined}
                      onDragOver={isDraggable ? (e) => handleDragOver(e, idx) : undefined}
                      onDrop={isDraggable ? () => handleDrop(idx) : undefined}
                      onDragEnd={handleDragEnd}
                      className={`relative flex flex-col items-center gap-0.5 py-2 px-1 rounded-r-lg text-[8px] leading-tight transition-all group ${
                        dragOverIdx === idx ? 'bg-blue-100 border-l-2 border-blue-400' :
                        activeSection === key
                          ? 'bg-blue-50 text-blue-600 border-l-2 border-blue-600'
                          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 border-l-2 border-transparent'
                      } ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
                    >
                      {isDraggable && (
                        <GripVertical className="w-2.5 h-2.5 text-gray-300 absolute -top-0.5 right-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                      {SECTION_ICONS[key]}
                      {sectionHasContent(key) && (
                        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      )}
                    </button>
                  ))}
                </div>
                <div key={sectionKey} className="flex-1 p-3 sm:p-4 section-enter overflow-y-auto">
                  <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    {SECTION_ICONS[activeSection]}
                    {activeSection === 'personalInfo' ? 'Personal Info' : SECTION_LABELS[activeSection as SectionKey]}
                  </h2>
                  <EditorComponent />
                </div>
              </div>
            )}

            {/* DESIGN TAB (lazy-loaded) */}
            {editorTab === 'design' && (
              <div id="tabpanel-design" role="tabpanel" aria-labelledby="tab-design" className="p-4 animate-fade-in"><DesignPanel /></div>
            )}

            {/* ATS TAB (lazy-loaded) */}
            {editorTab === 'ats' && (
              <div id="tabpanel-ats" role="tabpanel" aria-labelledby="tab-ats" className="p-4 animate-fade-in"><ATSScorePanel /></div>
            )}

            {/* HISTORY TAB */}
            {editorTab === 'history' && (
              <div id="tabpanel-history" role="tabpanel" aria-labelledby="tab-history" className="p-4 animate-fade-in space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Version History</h3>
                  <p className="text-[10px] text-gray-400 mb-4">Save snapshots to compare or revert. Auto-save keeps your work safe.</p>

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

                  {versions.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-xs text-gray-400">No saved versions yet.</p>
                      <p className="text-[10px] text-gray-300 mt-1">Use Ctrl+S or the button above.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {[...versions].reverse().map((v) => (
                        <div key={v.id} className="flex items-center gap-2 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:border-gray-200 hover:shadow-sm transition-all group">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-800 truncate">{v.name}</p>
                            <p className="text-[10px] text-gray-400">
                              {new Date(v.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                            {v.atsScore !== undefined && <p className="text-[10px] font-bold text-blue-600">ATS: {v.atsScore}</p>}
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleRestoreVersion(v.id)} title="Restore" className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600"><RotateCw className="w-3.5 h-3.5" /></button>
                            <button onClick={() => deleteVersion(v.id)} title="Delete" className="p-1.5 rounded-lg hover:bg-red-100 text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
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

        {/* ── RIGHT PANEL: Preview ── */}
        <div className={`flex-1 overflow-auto bg-gray-100 p-4 sm:p-6 flex justify-center ${mobileView === 'editor' ? 'hidden md:flex' : 'flex'}`} role="region" aria-label="Resume preview">
          <div className="animate-fade-in">
            <ResumePreview ref={resumeRef} data={data} style={style} scale={previewScale} />
          </div>
        </div>
      </main>
      </div>
    </ErrorBoundary>
  );
}
