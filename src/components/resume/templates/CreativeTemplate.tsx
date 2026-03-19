/* ── Creative Template — Reversed Two-Column (65/35) + Timeline ── */
'use client';
import type { ResumeData, ResumeStyle, BulletStyle, HeaderStyle } from '@/types/resume';
import { BULLET_SYMBOLS, NAME_SIZE_OPTIONS } from '@/types/resume';
import { formatDateRange, formatDate, ensureUrl, isLinkable } from '@/lib/utils';
import { formatHeaderText, showHeaderUnderline } from './template-utils';

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
  const bulletStyle = style.bulletStyle ?? 'disc';
  const nameMultiplier = NAME_SIZE_OPTIONS.find(n => n.id === (style.nameSize ?? 'large'))?.multiplier ?? 2.55;
  const headerSty = style.headerStyle ?? 'uppercase-underline';
  const headerLetterSp = `${style.headerLetterSpacing ?? 1.5}px`;
  const dateAlign = style.dateAlignment ?? 'right';
  const skillMode = style.skillDisplayMode ?? 'tags';
  const bodyLetterSpacing = `${style.letterSpacing ?? 0}px`;

  return (
    <div style={{ width: '794px', minHeight: '1123px', background: '#fff', fontFamily: style.fontFamily, fontSize: `${BASE_FONT}px`, lineHeight: style.lineHeight ?? 1.55, color: '#1a1a1a' }}>
      {/* ── TOP HEADER ── */}
      <div style={{ padding: `36px ${style.marginRight ?? 44}px 24px ${style.marginLeft ?? 44}px`, borderBottom: `3px solid ${c}` }}>
        <h1 style={{ fontSize: fs(nameMultiplier), fontWeight: 800, margin: 0, color: '#111' }}>{pi.firstName} <span style={{ color: c }}>{pi.lastName}</span></h1>
        {pi.title && <p style={{ fontSize: fs(1.18), color: '#666', marginTop: '2px', fontWeight: 500 }}>{pi.title}</p>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '8px', fontSize: fs(0.91), color: '#888' }}>
          {[pi.email, pi.phone, pi.location, pi.linkedin, pi.github, pi.website].filter(Boolean).map((info, i) => {
            const linkable = isLinkable(info);
            return linkable
              ? <a key={i} href={ensureUrl(info)} target={info.includes('@') ? undefined : '_blank'} rel={info.includes('@') ? undefined : 'noopener noreferrer'} style={{ color: '#888', textDecoration: 'none' }}>{info}</a>
              : <span key={i}>{info}</span>;
          })}
        </div>
      </div>

      {/* ── TWO-COLUMN BODY ── */}
      <div style={{ display: 'flex' }}>
        {/* ── LEFT MAIN (65%) ── */}
        <div style={{ width: '65%', padding: `24px 24px 24px ${style.marginLeft ?? 44}px`, boxSizing: 'border-box' }}>
          {mainOrder.map((key) => {
            switch (key) {
              case 'summary': return summary ? <MainSec key={key} title="About" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}><p style={{ fontSize: fs(1.0), lineHeight: '1.7', color: '#555', letterSpacing: bodyLetterSpacing }}>{summary}</p></MainSec> : null;
              case 'experience': return experience.length > 0 ? <MainSec key={key} title="Experience" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}><div style={{ position: 'relative', paddingLeft: '20px' }}>
                {/* Timeline line */}
                <div style={{ position: 'absolute', left: '5px', top: '4px', bottom: '4px', width: '2px', background: '#e5e7eb' }} />
                {experience.map((e, i) => (
                  <div key={e.id} style={{ position: 'relative', marginTop: i > 0 ? '16px' : 0 }}>
                    {/* Timeline dot */}
                    <div style={{ position: 'absolute', left: '-20px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', background: '#fff', border: `3px solid ${c}` }} />
                    <div style={{ display: 'flex', justifyContent: dateAlign === 'right' ? 'space-between' : 'flex-start', alignItems: 'flex-start', flexWrap: dateAlign === 'inline' ? 'wrap' : undefined, gap: dateAlign === 'inline' ? '8px' : undefined }}>
                      <div><h3 style={{ fontSize: fs(1.09), fontWeight: 700, margin: 0 }}>{e.position}</h3><p style={{ fontSize: fs(1.0), color: c, fontWeight: 600, margin: '1px 0 0' }}>{e.company}{e.location ? ` · ${e.location}` : ''}</p></div>
                      {dateAlign === 'right' && <span style={{ fontSize: fs(0.82), color: '#9ca3af', flexShrink: 0 }}>{formatDateRange(e.startDate, e.endDate, e.current)}</span>}
                      {dateAlign === 'inline' && <span style={{ fontSize: fs(0.82), color: '#9ca3af' }}>{formatDateRange(e.startDate, e.endDate, e.current)}</span>}
                    </div>
                    {dateAlign === 'left' && <p style={{ fontSize: fs(0.82), color: '#9ca3af', margin: '1px 0 0' }}>{formatDateRange(e.startDate, e.endDate, e.current)}{e.location ? ` · ${e.location}` : ''}</p>}
                    {e.highlights.filter(Boolean).length > 0 && <ul style={{ margin: '4px 0 0 0', padding: 0, listStyle: 'none' }}>{e.highlights.filter(Boolean).map((h, j) => (
                      <li key={j} style={{ fontSize: fs(0.95), color: '#555', paddingLeft: '12px', position: 'relative', marginTop: `${psp}px` }}>
                        {bulletStyle === 'disc' ? <span style={{ position: 'absolute', left: 0, top: '7px', width: '4px', height: '4px', background: '#d1d5db', borderRadius: '50%' }} /> : bulletStyle !== 'none' ? <span style={{ position: 'absolute', left: 0, top: '2px', color: '#999' }}>{BULLET_SYMBOLS[bulletStyle]}</span> : null}{h}
                      </li>
                    ))}</ul>}
                  </div>
                ))}
              </div></MainSec> : null;
              case 'projects': return projects.length > 0 ? <MainSec key={key} title="Projects" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>{projects.map((p, i) => (
                <div key={p.id} style={{ marginTop: i > 0 ? '10px' : 0, padding: '8px 10px', background: '#fafafa', borderRadius: '6px', border: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}><span style={{ fontWeight: 700, fontSize: fs(1.05) }}>{p.name}</span>{p.url && <a href={ensureUrl(p.url)} target="_blank" rel="noopener noreferrer" style={{ fontSize: fs(0.82), color: c, textDecoration: 'none' }}>{p.url}</a>}</div>
                  {p.description && <p style={{ fontSize: fs(0.91), color: '#777', margin: '2px 0 0' }}>{p.description}</p>}
                  {p.technologies.length > 0 && <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '5px' }}>{p.technologies.map((t, j) => <span key={j} style={{ fontSize: fs(0.77), padding: '2px 6px', background: `${c}12`, color: c, borderRadius: '10px', fontWeight: 600 }}>{t}</span>)}</div>}
                </div>
              ))}</MainSec> : null;
              case 'volunteering': return volunteering.length > 0 ? <MainSec key={key} title="Volunteering" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>{volunteering.map(v => <div key={v.id} style={{ fontSize: fs(0.95), margin: '4px 0' }}><strong>{v.role}</strong> — {v.organization} ({formatDateRange(v.startDate, v.endDate, v.current)})</div>)}</MainSec> : null;
              case 'publications': return publications.length > 0 ? <MainSec key={key} title="Publications" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>{publications.map(p => <p key={p.id} style={{ fontSize: fs(0.95), margin: '3px 0' }}><em>{p.title}</em> — {p.publisher}, {formatDate(p.date)}</p>)}</MainSec> : null;
              default: return null;
            }
          })}
        </div>

        {/* ── RIGHT SIDEBAR (35%) ── */}
        <div style={{ width: '35%', background: '#f9fafb', padding: '24px 24px 24px 20px', borderLeft: '1px solid #f0f0f0' }}>
          {sideOrder.map((key) => {
            switch (key) {
              case 'skills': return skills.length > 0 ? <SideSec key={key} title="Skills" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>
                {skillMode === 'comma' ? skills.map(s => (
                  <div key={s.id} style={{ marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: fs(0.82), color: '#999', letterSpacing: '1px', textTransform: 'uppercase' as const }}>{s.category}: </span>
                    <span style={{ fontSize: fs(0.91), color: '#555' }}>{s.items.join(', ')}</span>
                  </div>
                )) : skillMode === 'bars' ? skills.map(s => (
                  <div key={s.id} style={{ marginBottom: '10px' }}>
                    <p style={{ fontSize: fs(0.82), fontWeight: 700, color: '#999', letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: '4px' }}>{s.category}</p>
                    {s.items.map((item, j) => <div key={j} style={{ fontSize: fs(0.82), color: '#555', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}><span style={{ minWidth: '80px' }}>{item}</span><div style={{ flex: 1, height: '3px', background: '#e5e7eb', borderRadius: '2px' }}><div style={{ width: `${Math.max(45, 100 - j * 8)}%`, height: '100%', background: c, borderRadius: '2px' }} /></div></div>)}
                  </div>
                )) : skills.map(s => (
                <div key={s.id} style={{ marginBottom: '10px' }}>
                  <p style={{ fontSize: fs(0.82), fontWeight: 700, color: '#999', letterSpacing: '1px', textTransform: 'uppercase' as const, marginBottom: '4px' }}>{s.category}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>{s.items.map((item, j) => (
                    <span key={j} style={{ fontSize: fs(0.86), padding: '3px 8px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '4px', color: '#555' }}>{item}</span>
                  ))}</div>
                </div>
              ))}
              </SideSec> : null;
              case 'education': return education.length > 0 ? <SideSec key={key} title="Education" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>{education.map(e => (
                <div key={e.id} style={{ marginBottom: '8px', padding: '8px', background: '#fff', borderRadius: '6px', border: '1px solid #f0f0f0' }}>
                  <p style={{ fontSize: fs(1.0), fontWeight: 700, margin: 0 }}>{e.degree}</p>
                  {e.field && <p style={{ fontSize: fs(0.91), color: c, margin: 0 }}>{e.field}</p>}
                  <p style={{ fontSize: fs(0.86), color: '#888', margin: '2px 0 0' }}>{e.institution}</p>
                  <p style={{ fontSize: fs(0.82), color: '#aaa', margin: '1px 0 0' }}>{formatDateRange(e.startDate, e.endDate, false)}{e.gpa ? ` · GPA: ${e.gpa}` : ''}</p>
                </div>
              ))}</SideSec> : null;
              case 'languages': return languages.length > 0 ? <SideSec key={key} title="Languages" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>{languages.map(l => (
                <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: fs(0.95), margin: '3px 0' }}><span>{l.language}</span><span style={{ color: '#aaa' }}>{l.proficiency}</span></div>
              ))}</SideSec> : null;
              case 'certifications': return certifications.length > 0 ? <SideSec key={key} title="Certifications" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>{certifications.map(cert => <div key={cert.id} style={{ marginBottom: '6px' }}><p style={{ fontSize: fs(0.91), fontWeight: 600, margin: 0 }}>{cert.name}</p><p style={{ fontSize: fs(0.82), color: '#999', margin: 0 }}>{cert.issuer} · {formatDate(cert.date)}</p></div>)}</SideSec> : null;
              case 'awards': return awards.length > 0 ? <SideSec key={key} title="Awards" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>{awards.map(a => <p key={a.id} style={{ fontSize: fs(0.91), margin: '3px 0' }}>🏆 {a.title}</p>)}</SideSec> : null;
              case 'references': return references.length > 0 ? <SideSec key={key} title="References" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>{references.map(r => <div key={r.id} style={{ marginBottom: '6px' }}><p style={{ fontSize: fs(0.91), fontWeight: 600, margin: 0 }}>{r.name}</p><p style={{ fontSize: fs(0.82), color: '#999', margin: 0 }}>{r.position}, {r.company}</p></div>)}</SideSec> : null;
              default: return null;
            }
          })}
        </div>
      </div>
    </div>
  );
}

function MainSec({ title, c, sp = 16, bf = 11, headerStyle = 'uppercase-underline' as HeaderStyle, headerLetterSpacing = '1.5px', children }: { title: string; c: string; sp?: number; bf?: number; headerStyle?: HeaderStyle; headerLetterSpacing?: string; children: React.ReactNode }) {
  const displayText = formatHeaderText(title, headerStyle);
  return <section style={{ marginBottom: `${sp}px` }}><h2 style={{ fontSize: `${(bf * 1.18).toFixed(1)}px`, fontWeight: 800, color: c, margin: `0 0 ${Math.min(sp, 10)}px`, textTransform: headerStyle.startsWith('uppercase') ? 'uppercase' : 'none', letterSpacing: headerLetterSpacing }}>{displayText}</h2>{children}</section>;
}

function SideSec({ title, c, sp = 16, bf = 11, headerStyle = 'uppercase-underline' as HeaderStyle, headerLetterSpacing = '1px', children }: { title: string; c: string; sp?: number; bf?: number; headerStyle?: HeaderStyle; headerLetterSpacing?: string; children: React.ReactNode }) {
  const displayText = formatHeaderText(title, headerStyle);
  const showLine = showHeaderUnderline(headerStyle);
  return <section style={{ marginBottom: `${sp}px` }}><h2 style={{ fontSize: `${(bf * 1.0).toFixed(1)}px`, fontWeight: 800, color: c, margin: `0 0 ${Math.min(sp, 8)}px`, textTransform: headerStyle.startsWith('uppercase') ? 'uppercase' : 'none', letterSpacing: headerLetterSpacing, paddingBottom: showLine ? '4px' : '0', borderBottom: showLine ? `2px solid ${c}` : 'none' }}>{displayText}</h2>{children}</section>;
}
