/* ── Professional Template — Classic Corporate Single-Column ── */
'use client';
import type { ResumeData, ResumeStyle } from '@/types/resume';
import { formatDateRange, formatDate } from '@/lib/utils';

interface P { data: ResumeData; style: ResumeStyle; }

export default function ProfessionalTemplate({ data, style }: P) {
  const { personalInfo: pi, summary, experience, education, skills, projects, certifications, languages, awards, volunteering, publications, references } = data;
  const c = style.primaryColor;
  const hidden = new Set(style.hiddenSections);
  const BASE_FONT = style.fontSize === 'small' ? 10 : style.fontSize === 'large' ? 12.5 : 11;
  const fs = (r: number) => `${(BASE_FONT * r).toFixed(1)}px`;
  const sp = style.sectionSpacing ?? 16;
  const psp = style.paragraphSpacing ?? 4;

  const renderSection = (key: string) => {
    switch (key) {
      case 'summary': return summary ? <Sec key={key} t="PROFESSIONAL SUMMARY" c={c} sp={sp} bf={BASE_FONT}><p style={{ fontSize: fs(1.0), lineHeight: '1.65', color: '#374151' }}>{summary}</p></Sec> : null;
      case 'experience': return experience.length > 0 ? <Sec key={key} t="WORK EXPERIENCE" c={c} sp={sp} bf={BASE_FONT}>{experience.map((e, i) => (
        <div key={e.id} style={{ marginTop: i > 0 ? '14px' : 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div><span style={{ fontWeight: 700, fontSize: fs(1.09), color: '#111' }}>{e.position}</span>{e.company && <span style={{ fontSize: fs(1.0), color: '#6b7280' }}>{' '}| {e.company}</span>}</div>
            <span style={{ fontSize: fs(0.91), color: '#9ca3af', flexShrink: 0, marginLeft: '12px' }}>{formatDateRange(e.startDate, e.endDate, e.current)}</span>
          </div>
          {e.location && <p style={{ fontSize: fs(0.91), color: '#9ca3af' }}>{e.location}</p>}
          {e.highlights.filter(Boolean).length > 0 && <ul style={{ margin: '4px 0 0', padding: 0, listStyle: 'none' }}>{e.highlights.filter(Boolean).map((h, j) => (
            <li key={j} style={{ fontSize: fs(0.95), color: '#374151', display: 'flex', gap: '6px', marginTop: `${psp}px` }}><span style={{ marginTop: '5px', width: '4px', height: '4px', borderRadius: '50%', background: c, flexShrink: 0 }} /><span>{h}</span></li>
          ))}</ul>}
        </div>))}</Sec> : null;
      case 'education': return education.length > 0 ? <Sec key={key} t="EDUCATION" c={c} sp={sp} bf={BASE_FONT}>{education.map((e) => (
        <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div><span style={{ fontWeight: 700, fontSize: fs(1.09) }}>{e.degree}{e.field ? ` in ${e.field}` : ''}</span><span style={{ color: '#6b7280', fontSize: fs(1.0) }}> — {e.institution}</span>{e.gpa && <span style={{ color: '#9ca3af', fontSize: fs(0.91), marginLeft: '6px' }}>GPA: {e.gpa}</span>}</div>
          <span style={{ fontSize: fs(0.91), color: '#9ca3af', flexShrink: 0 }}>{formatDateRange(e.startDate, e.endDate, false)}</span></div>
      ))}</Sec> : null;
      case 'skills': return skills.length > 0 ? <Sec key={key} t="TECHNICAL SKILLS" c={c} sp={sp} bf={BASE_FONT}>{skills.map((s) => <div key={s.id} style={{ fontSize: fs(0.95), marginTop: `${psp}px` }}><span style={{ fontWeight: 700, color: '#1f2937' }}>{s.category}: </span><span style={{ color: '#4b5563' }}>{s.items.join(', ')}</span></div>)}</Sec> : null;
      case 'projects': return projects.length > 0 ? <Sec key={key} t="PROJECTS" c={c} sp={sp} bf={BASE_FONT}>{projects.map((p, i) => (
        <div key={p.id} style={{ marginTop: i > 0 ? '10px' : 0 }}>
          <span style={{ fontWeight: 700, fontSize: fs(1.09) }}>{p.name}</span>{p.url && <span style={{ fontSize: fs(0.82), color: '#9ca3af', marginLeft: '6px' }}>{p.url}</span>}
          {p.description && <p style={{ fontSize: fs(0.95), color: '#4b5563', margin: '2px 0 0' }}>{p.description}</p>}
          {p.technologies.length > 0 && <p style={{ fontSize: fs(0.91), color: '#9ca3af' }}>Tech: {p.technologies.join(', ')}</p>}
          {p.highlights.filter(Boolean).length > 0 && <ul style={{ margin: '2px 0 0', padding: 0, listStyle: 'none' }}>{p.highlights.filter(Boolean).map((h, j) => <li key={j} style={{ fontSize: fs(0.95), color: '#374151', display: 'flex', gap: '6px', marginTop: `${psp}px` }}><span style={{ marginTop: '5px', width: '4px', height: '4px', borderRadius: '50%', background: c, flexShrink: 0 }} /><span>{h}</span></li>)}</ul>}
        </div>))}</Sec> : null;
      case 'certifications': return certifications.length > 0 ? <Sec key={key} t="CERTIFICATIONS" c={c} sp={sp} bf={BASE_FONT}>{certifications.map((cert) => <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: fs(0.95) }}><span><strong>{cert.name}</strong> — {cert.issuer}</span><span style={{ color: '#9ca3af' }}>{formatDate(cert.date)}</span></div>)}</Sec> : null;
      case 'languages': return languages.length > 0 ? <Sec key={key} t="LANGUAGES" c={c} sp={sp} bf={BASE_FONT}><div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: fs(0.95) }}>{languages.map((l) => <span key={l.id}><strong>{l.language}</strong> — {l.proficiency}</span>)}</div></Sec> : null;
      case 'awards': return awards.length > 0 ? <Sec key={key} t="AWARDS" c={c} sp={sp} bf={BASE_FONT}>{awards.map((a) => <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: fs(0.95) }}><span><strong>{a.title}</strong> — {a.issuer}</span><span style={{ color: '#9ca3af' }}>{formatDate(a.date)}</span></div>)}</Sec> : null;
      case 'volunteering': return volunteering.length > 0 ? <Sec key={key} t="VOLUNTEERING" c={c} sp={sp} bf={BASE_FONT}>{volunteering.map((v) => <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: fs(0.95) }}><span><strong>{v.role}</strong> — {v.organization}</span><span style={{ color: '#9ca3af' }}>{formatDateRange(v.startDate, v.endDate, v.current)}</span></div>)}</Sec> : null;
      case 'publications': return publications.length > 0 ? <Sec key={key} t="PUBLICATIONS" c={c} sp={sp} bf={BASE_FONT}>{publications.map((p) => <p key={p.id} style={{ fontSize: fs(0.95) }}><strong>{p.title}</strong> — {p.publisher}, {formatDate(p.date)}</p>)}</Sec> : null;
      case 'references': return references.length > 0 ? <Sec key={key} t="REFERENCES" c={c} sp={sp} bf={BASE_FONT}>{references.map((r) => <div key={r.id} style={{ fontSize: fs(0.95) }}><strong>{r.name}</strong>, {r.position} at {r.company} — {r.email}</div>)}</Sec> : null;
      default: return null;
    }
  };

  return (
    <div style={{ width: '794px', minHeight: '1123px', padding: `${style.marginTop ?? 48}px ${style.marginRight ?? 56}px ${style.marginBottom ?? 48}px ${style.marginLeft ?? 56}px`, background: '#fff', fontFamily: style.fontFamily, color: '#1a1a1a', fontSize: `${BASE_FONT}px`, lineHeight: style.lineHeight ?? 1.5 }}>
      <header style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: fs(2.55), fontWeight: 700, color: c, margin: 0 }}>{pi.firstName} {pi.lastName}</h1>
        {pi.title && <p style={{ fontSize: fs(1.18), fontWeight: 500, color: '#6b7280', margin: '2px 0 0' }}>{pi.title}</p>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', marginTop: '8px', fontSize: fs(0.91), color: '#6b7280' }}>
          {pi.email && <span>{pi.email}</span>}{pi.phone && <span>{pi.phone}</span>}{pi.location && <span>{pi.location}</span>}
          {pi.linkedin && <span>{pi.linkedin}</span>}{pi.github && <span>{pi.github}</span>}{pi.website && <span>{pi.website}</span>}
        </div>
        <div style={{ marginTop: '12px', height: '2px', background: c }} />
      </header>
      {style.sectionOrder.filter((s) => !hidden.has(s)).map(renderSection)}
    </div>
  );
}

function Sec({ t, c, sp = 16, bf = 11, children }: { t: string; c: string; sp?: number; bf?: number; children: React.ReactNode }) {
  return <section style={{ marginBottom: `${sp}px` }}><h2 style={{ fontSize: `${(bf * 1.09).toFixed(1)}px`, fontWeight: 700, letterSpacing: '1.5px', color: c, borderBottom: `1px solid ${c}30`, paddingBottom: '3px', marginBottom: '8px', margin: '0 0 8px' }}>{t}</h2>{children}</section>;
}
