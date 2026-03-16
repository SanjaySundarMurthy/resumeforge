/* ── Creative Template — Reversed Two-Column (65/35) + Timeline ── */
'use client';
import type { ResumeData, ResumeStyle } from '@/types/resume';
import { formatDateRange, formatDate } from '@/lib/utils';

interface P { data: ResumeData; style: ResumeStyle; }

export default function CreativeTemplate({ data, style }: P) {
  const { personalInfo: pi, summary, experience, education, skills, projects, certifications, languages, awards, volunteering, publications, references } = data;
  const c = style.primaryColor;
  const hidden = new Set(style.hiddenSections);
  const sideKeys = new Set(['skills', 'education', 'languages', 'certifications', 'awards', 'references']);
  const mainOrder = style.sectionOrder.filter(s => !hidden.has(s) && !sideKeys.has(s));
  const sideOrder = style.sectionOrder.filter(s => !hidden.has(s) && sideKeys.has(s));
  const BASE_FONT = style.fontSize === 'small' ? 10 : style.fontSize === 'large' ? 12.5 : 11;
  const fs = (r: number) => `${(BASE_FONT * r).toFixed(1)}px`;
  const sp = style.sectionSpacing ?? 16;
  const psp = style.paragraphSpacing ?? 4;

  return (
    <div style={{ width: '794px', minHeight: '1123px', background: '#fff', fontFamily: style.fontFamily, fontSize: `${BASE_FONT}px`, lineHeight: style.lineHeight ?? 1.55, color: '#1a1a1a' }}>
      {/* ── TOP HEADER ── */}
      <div style={{ padding: `36px ${style.marginRight ?? 44}px 24px ${style.marginLeft ?? 44}px`, borderBottom: `3px solid ${c}` }}>
        <h1 style={{ fontSize: fs(2.55), fontWeight: 800, margin: 0, color: '#111' }}>{pi.firstName} <span style={{ color: c }}>{pi.lastName}</span></h1>
        {pi.title && <p style={{ fontSize: fs(1.18), color: '#666', marginTop: '2px', fontWeight: 500 }}>{pi.title}</p>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '8px', fontSize: fs(0.91), color: '#888' }}>
          {[pi.email, pi.phone, pi.location, pi.linkedin, pi.github, pi.website].filter(Boolean).map((info, i) => <span key={i}>{info}</span>)}
        </div>
      </div>

      {/* ── TWO-COLUMN BODY ── */}
      <div style={{ display: 'flex' }}>
        {/* ── LEFT MAIN (65%) ── */}
        <div style={{ width: '65%', padding: `24px 24px 24px ${style.marginLeft ?? 44}px`, boxSizing: 'border-box' }}>
          {mainOrder.map((key) => {
            switch (key) {
              case 'summary': return summary ? <MainSec key={key} title="About" c={c} sp={sp} bf={BASE_FONT}><p style={{ fontSize: fs(1.0), lineHeight: '1.7', color: '#555' }}>{summary}</p></MainSec> : null;
              case 'experience': return experience.length > 0 ? <MainSec key={key} title="Experience" c={c} sp={sp} bf={BASE_FONT}><div style={{ position: 'relative', paddingLeft: '20px' }}>
                {/* Timeline line */}
                <div style={{ position: 'absolute', left: '5px', top: '4px', bottom: '4px', width: '2px', background: '#e5e7eb' }} />
                {experience.map((e, i) => (
                  <div key={e.id} style={{ position: 'relative', marginTop: i > 0 ? '16px' : 0 }}>
                    {/* Timeline dot */}
                    <div style={{ position: 'absolute', left: '-20px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', background: '#fff', border: `3px solid ${c}` }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div><h3 style={{ fontSize: fs(1.09), fontWeight: 700, margin: 0 }}>{e.position}</h3><p style={{ fontSize: fs(1.0), color: c, fontWeight: 600, margin: '1px 0 0' }}>{e.company}{e.location ? ` · ${e.location}` : ''}</p></div>
                      <span style={{ fontSize: fs(0.82), color: '#9ca3af', flexShrink: 0 }}>{formatDateRange(e.startDate, e.endDate, e.current)}</span>
                    </div>
                    {e.highlights.filter(Boolean).length > 0 && <ul style={{ margin: '4px 0 0 0', padding: 0, listStyle: 'none' }}>{e.highlights.filter(Boolean).map((h, j) => (
                      <li key={j} style={{ fontSize: fs(0.95), color: '#555', paddingLeft: '12px', position: 'relative', marginTop: `${psp}px` }}>
                        <span style={{ position: 'absolute', left: 0, top: '7px', width: '4px', height: '4px', background: '#d1d5db', borderRadius: '50%' }} />{h}
                      </li>
                    ))}</ul>}
                  </div>
                ))}
              </div></MainSec> : null;
              case 'projects': return projects.length > 0 ? <MainSec key={key} title="Projects" c={c} sp={sp} bf={BASE_FONT}>{projects.map((p, i) => (
                <div key={p.id} style={{ marginTop: i > 0 ? '10px' : 0, padding: '8px 10px', background: '#fafafa', borderRadius: '6px', border: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}><span style={{ fontWeight: 700, fontSize: fs(1.05) }}>{p.name}</span>{p.url && <span style={{ fontSize: fs(0.82), color: c }}>{p.url}</span>}</div>
                  {p.description && <p style={{ fontSize: fs(0.91), color: '#777', margin: '2px 0 0' }}>{p.description}</p>}
                  {p.technologies.length > 0 && <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '5px' }}>{p.technologies.map((t, j) => <span key={j} style={{ fontSize: fs(0.77), padding: '2px 6px', background: `${c}12`, color: c, borderRadius: '10px', fontWeight: 600 }}>{t}</span>)}</div>}
                </div>
              ))}</MainSec> : null;
              case 'volunteering': return volunteering.length > 0 ? <MainSec key={key} title="Volunteering" c={c} sp={sp} bf={BASE_FONT}>{volunteering.map(v => <div key={v.id} style={{ fontSize: fs(0.95), margin: '4px 0' }}><strong>{v.role}</strong> — {v.organization} ({formatDateRange(v.startDate, v.endDate, v.current)})</div>)}</MainSec> : null;
              case 'publications': return publications.length > 0 ? <MainSec key={key} title="Publications" c={c} sp={sp} bf={BASE_FONT}>{publications.map(p => <p key={p.id} style={{ fontSize: fs(0.95), margin: '3px 0' }}><em>{p.title}</em> — {p.publisher}, {formatDate(p.date)}</p>)}</MainSec> : null;
              default: return null;
            }
          })}
        </div>

        {/* ── RIGHT SIDEBAR (35%) ── */}
        <div style={{ width: '35%', background: '#f9fafb', padding: '24px 24px 24px 20px', borderLeft: '1px solid #f0f0f0' }}>
          {sideOrder.map((key) => {
            switch (key) {
              case 'skills': return skills.length > 0 ? <SideSec key={key} title="Skills" c={c} sp={sp} bf={BASE_FONT}>{skills.map(s => (
                <div key={s.id} style={{ marginBottom: '10px' }}>
                  <p style={{ fontSize: fs(0.82), fontWeight: 700, color: '#999', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>{s.category}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>{s.items.map((item, j) => (
                    <span key={j} style={{ fontSize: fs(0.86), padding: '3px 8px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '4px', color: '#555' }}>{item}</span>
                  ))}</div>
                </div>
              ))}</SideSec> : null;
              case 'education': return education.length > 0 ? <SideSec key={key} title="Education" c={c} sp={sp} bf={BASE_FONT}>{education.map(e => (
                <div key={e.id} style={{ marginBottom: '8px', padding: '8px', background: '#fff', borderRadius: '6px', border: '1px solid #f0f0f0' }}>
                  <p style={{ fontSize: fs(1.0), fontWeight: 700, margin: 0 }}>{e.degree}</p>
                  {e.field && <p style={{ fontSize: fs(0.91), color: c, margin: 0 }}>{e.field}</p>}
                  <p style={{ fontSize: fs(0.86), color: '#888', margin: '2px 0 0' }}>{e.institution}</p>
                  <p style={{ fontSize: fs(0.82), color: '#aaa', margin: '1px 0 0' }}>{formatDateRange(e.startDate, e.endDate, false)}{e.gpa ? ` · GPA: ${e.gpa}` : ''}</p>
                </div>
              ))}</SideSec> : null;
              case 'languages': return languages.length > 0 ? <SideSec key={key} title="Languages" c={c} sp={sp} bf={BASE_FONT}>{languages.map(l => (
                <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: fs(0.95), margin: '3px 0' }}><span>{l.language}</span><span style={{ color: '#aaa' }}>{l.proficiency}</span></div>
              ))}</SideSec> : null;
              case 'certifications': return certifications.length > 0 ? <SideSec key={key} title="Certifications" c={c} sp={sp} bf={BASE_FONT}>{certifications.map(cert => <div key={cert.id} style={{ marginBottom: '6px' }}><p style={{ fontSize: fs(0.91), fontWeight: 600, margin: 0 }}>{cert.name}</p><p style={{ fontSize: fs(0.82), color: '#999', margin: 0 }}>{cert.issuer} · {formatDate(cert.date)}</p></div>)}</SideSec> : null;
              case 'awards': return awards.length > 0 ? <SideSec key={key} title="Awards" c={c} sp={sp} bf={BASE_FONT}>{awards.map(a => <p key={a.id} style={{ fontSize: fs(0.91), margin: '3px 0' }}>🏆 {a.title}</p>)}</SideSec> : null;
              case 'references': return references.length > 0 ? <SideSec key={key} title="References" c={c} sp={sp} bf={BASE_FONT}>{references.map(r => <div key={r.id} style={{ marginBottom: '6px' }}><p style={{ fontSize: fs(0.91), fontWeight: 600, margin: 0 }}>{r.name}</p><p style={{ fontSize: fs(0.82), color: '#999', margin: 0 }}>{r.position}, {r.company}</p></div>)}</SideSec> : null;
              default: return null;
            }
          })}
        </div>
      </div>
    </div>
  );
}

function MainSec({ title, c, sp = 16, bf = 11, children }: { title: string; c: string; sp?: number; bf?: number; children: React.ReactNode }) {
  return <section style={{ marginBottom: `${sp}px` }}><h2 style={{ fontSize: `${(bf * 1.18).toFixed(1)}px`, fontWeight: 800, color: c, margin: `0 0 ${Math.min(sp, 10)}px`, textTransform: 'uppercase', letterSpacing: '1.5px' }}>{title}</h2>{children}</section>;
}

function SideSec({ title, c, sp = 16, bf = 11, children }: { title: string; c: string; sp?: number; bf?: number; children: React.ReactNode }) {
  return <section style={{ marginBottom: `${sp}px` }}><h2 style={{ fontSize: `${(bf * 1.0).toFixed(1)}px`, fontWeight: 800, color: c, margin: `0 0 ${Math.min(sp, 8)}px`, textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: '4px', borderBottom: `2px solid ${c}` }}>{title}</h2>{children}</section>;
}
