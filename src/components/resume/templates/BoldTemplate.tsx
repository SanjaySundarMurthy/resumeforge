/* ── Bold Template — Big Name, Thick Bars, Chunky Badges ── */
'use client';
import type { ResumeData, ResumeStyle, BulletStyle, HeaderStyle } from '@/types/resume';
import { BULLET_SYMBOLS, NAME_SIZE_OPTIONS } from '@/types/resume';
import { formatDateRange, formatDate, ensureUrl, isLinkable } from '@/lib/utils';
import { formatHeaderText, showHeaderUnderline } from './template-utils';

interface P { data: ResumeData; style: ResumeStyle; }

export default function BoldTemplate({ data, style }: P) {
  const { personalInfo: pi, summary, experience, education, skills, projects, certifications, languages, awards, volunteering, publications, references } = data;
  const c = style.primaryColor;
  const hidden = new Set(style.hiddenSections);
  const order = style.sectionOrder.filter(s => !hidden.has(s));
  const BASE_FONT = style.fontSize === 'small' ? 10 : style.fontSize === 'large' ? 12.5 : 11;
  const fs = (r: number) => `${(BASE_FONT * r).toFixed(1)}px`;
  const sp = style.sectionSpacing ?? 16;
  const psp = style.paragraphSpacing ?? 4;
  const bulletStyle = style.bulletStyle ?? 'disc';
  const nameMultiplier = NAME_SIZE_OPTIONS.find(n => n.id === (style.nameSize ?? 'large'))?.multiplier ?? 2.55;
  const headerSty = style.headerStyle ?? 'uppercase-underline';
  const headerLetterSp = `${style.headerLetterSpacing ?? 2}px`;
  const dateAlign = style.dateAlignment ?? 'right';
  const skillMode = style.skillDisplayMode ?? 'tags';
  const bodyLetterSpacing = `${style.letterSpacing ?? 0}px`;

  return (
    <div style={{ width: '794px', minHeight: '1123px', background: '#fff', fontFamily: style.fontFamily, fontSize: `${BASE_FONT}px`, lineHeight: style.lineHeight ?? 1.55, color: '#1a1a1a' }}>
      {/* ── HEADER — Bold split name ── */}
      <div style={{ padding: `40px ${style.marginRight ?? 48}px 28px ${style.marginLeft ?? 48}px`, borderBottom: `6px solid ${c}` }}>
        <h1 style={{ fontSize: fs(Math.max(nameMultiplier, 3.0)), fontWeight: 900, margin: 0, lineHeight: 1 }}>
          <span style={{ color: '#111' }}>{pi.firstName}</span>{' '}
          <span style={{ color: c }}>{pi.lastName}</span>
        </h1>
        {pi.title && <p style={{ fontSize: fs(1.45), fontWeight: 600, color: '#6b7280', marginTop: '6px', letterSpacing: '1px', textTransform: 'uppercase' }}>{pi.title}</p>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
          {[pi.email, pi.phone, pi.location, pi.linkedin, pi.github, pi.website].filter(Boolean).map((info, i) => {
            const linkable = isLinkable(info);
            const inner = <span key={i} style={{ fontSize: fs(0.91), padding: '4px 12px', background: '#f3f4f6', borderRadius: '20px', color: '#555' }}>{info}</span>;
            return linkable
              ? <a key={i} href={ensureUrl(info)} target={info.includes('@') ? undefined : '_blank'} rel={info.includes('@') ? undefined : 'noopener noreferrer'} style={{ textDecoration: 'none' }}>{inner}</a>
              : inner;
          })}
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ padding: `24px ${style.marginRight ?? 48}px 24px ${style.marginLeft ?? 48}px` }}>
        {order.map((key) => {
          switch (key) {
            case 'summary': return summary ? <Sec key={key} title="ABOUT ME" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}><p style={{ fontSize: fs(1.05), lineHeight: '1.75', color: '#555', borderLeft: `4px solid ${c}20`, paddingLeft: '14px', letterSpacing: bodyLetterSpacing }}>{summary}</p></Sec> : null;
            case 'experience': return experience.length > 0 ? <Sec key={key} title="WORK EXPERIENCE" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>{experience.map((e, i) => (
              <div key={e.id} style={{ marginTop: i > 0 ? '16px' : 0, paddingTop: i > 0 ? '16px' : 0, borderTop: i > 0 ? '2px solid #f3f4f6' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: dateAlign === 'right' ? 'space-between' : 'flex-start', alignItems: 'flex-start', flexWrap: dateAlign === 'inline' ? 'wrap' : undefined, gap: dateAlign === 'inline' ? '8px' : undefined }}>
                  <div>
                    <h3 style={{ fontSize: fs(1.27), fontWeight: 800, color: '#111', margin: 0, letterSpacing: bodyLetterSpacing }}>{e.position}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                      <span style={{ fontSize: fs(1.05), fontWeight: 700, color: c }}>{e.company}</span>
                      {e.location && <span style={{ fontSize: fs(0.91), color: '#9ca3af' }}>• {e.location}</span>}
                    </div>
                  </div>
                  {dateAlign === 'right' && <span style={{ fontSize: fs(0.91), fontWeight: 700, color: '#fff', padding: '4px 12px', background: c, borderRadius: '4px', flexShrink: 0 }}>{formatDateRange(e.startDate, e.endDate, e.current)}</span>}
                  {dateAlign === 'inline' && <span style={{ fontSize: fs(0.91), fontWeight: 700, color: c }}>{formatDateRange(e.startDate, e.endDate, e.current)}</span>}
                </div>
                {dateAlign === 'left' && <p style={{ fontSize: fs(0.91), fontWeight: 700, color: c, margin: '2px 0 0' }}>{formatDateRange(e.startDate, e.endDate, e.current)}{e.location ? ` · ${e.location}` : ''}</p>}
                {e.highlights.filter(Boolean).length > 0 && <ul style={{ margin: '8px 0 0 0', padding: 0, listStyle: 'none' }}>{e.highlights.filter(Boolean).map((h, j) => (
                  <li key={j} style={{ fontSize: fs(0.95), color: '#4b5563', paddingLeft: '16px', position: 'relative', marginTop: `${psp}px` }}>
                    {bulletStyle === 'disc' ? <span style={{ position: 'absolute', left: 0, top: '3px', width: '8px', height: '8px', background: `${c}20`, borderRadius: '2px' }} /> : bulletStyle !== 'none' ? <span style={{ position: 'absolute', left: 0, top: '1px', color: c, fontWeight: 700 }}>{BULLET_SYMBOLS[bulletStyle]}</span> : null}{h}
                  </li>
                ))}</ul>}
              </div>
            ))}</Sec> : null;
            case 'education': return education.length > 0 ? <Sec key={key} title="EDUCATION" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>{education.map(e => (
              <div key={e.id} style={{ display: dateAlign === 'right' ? 'flex' : 'block', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <h3 style={{ fontSize: fs(1.18), fontWeight: 800, margin: 0, letterSpacing: bodyLetterSpacing }}>{e.degree}{e.field ? ` in ${e.field}` : ''}</h3>
                  <p style={{ fontSize: fs(1.0), color: c, fontWeight: 700, margin: 0 }}>{e.institution}</p>
                  {e.gpa && <p style={{ fontSize: fs(0.91), color: '#9ca3af', margin: 0 }}>GPA: {e.gpa}</p>}
                </div>
                {dateAlign === 'right' && <span style={{ fontSize: fs(0.91), fontWeight: 700, color: '#fff', padding: '4px 12px', background: c, borderRadius: '4px', flexShrink: 0 }}>{formatDateRange(e.startDate, e.endDate, false)}</span>}
                {dateAlign !== 'right' && <p style={{ fontSize: fs(0.91), fontWeight: 700, color: c, margin: '2px 0 0' }}>{formatDateRange(e.startDate, e.endDate, false)}</p>}
              </div>
            ))}</Sec> : null;
            case 'skills': return skills.length > 0 ? <Sec key={key} title="SKILLS" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>
              {skillMode === 'comma' ? skills.map(s => <div key={s.id} style={{ marginBottom: '6px' }}><span style={{ fontWeight: 800, fontSize: fs(0.91), color: '#666', letterSpacing: '1px', textTransform: 'uppercase' }}>{s.category}: </span><span style={{ fontSize: fs(0.95), color: '#555' }}>{s.items.join(', ')}</span></div>) : skillMode === 'bars' ? skills.map(s => <div key={s.id} style={{ marginBottom: '10px' }}><p style={{ fontSize: fs(0.91), fontWeight: 800, color: '#666', letterSpacing: '1px', marginBottom: '5px', textTransform: 'uppercase' }}>{s.category}</p>{s.items.map((item, j) => <div key={j} style={{ fontSize: fs(0.82), color: '#555', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}><span style={{ minWidth: '100px', fontWeight: 600 }}>{item}</span><div style={{ flex: 1, height: '6px', background: '#e5e7eb', borderRadius: '3px' }}><div style={{ width: `${Math.max(45, 100 - j * 8)}%`, height: '100%', background: c, borderRadius: '3px' }} /></div></div>)}</div>) : skills.map(s => (
              <div key={s.id} style={{ marginBottom: '10px' }}>
                <p style={{ fontSize: fs(0.91), fontWeight: 800, color: '#666', letterSpacing: '1px', marginBottom: '5px', textTransform: 'uppercase' }}>{s.category}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>{s.items.map((item, j) => (
                  <span key={j} style={{ fontSize: fs(0.91), fontWeight: 600, padding: '4px 12px', background: c, color: '#fff', borderRadius: '4px' }}>{item}</span>
                ))}</div>
              </div>
            ))}
            </Sec> : null;
            case 'projects': return projects.length > 0 ? <Sec key={key} title="PROJECTS" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>{projects.map((p, i) => (
              <div key={p.id} style={{ marginTop: i > 0 ? '12px' : 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontWeight: 800, fontSize: fs(1.09) }}>{p.name}</span>
                  {p.url && <a href={ensureUrl(p.url)} target="_blank" rel="noopener noreferrer" style={{ fontSize: fs(0.82), color: c, fontWeight: 600, textDecoration: 'none' }}>{p.url}</a>}
                </div>
                {p.description && <p style={{ fontSize: fs(0.95), color: '#6b7280', margin: '2px 0' }}>{p.description}</p>}
                {p.technologies.length > 0 && <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>{p.technologies.map((t, j) => <span key={j} style={{ fontSize: fs(0.82), fontWeight: 600, padding: '3px 8px', border: `2px solid ${c}`, color: c, borderRadius: '4px' }}>{t}</span>)}</div>}
              </div>
            ))}</Sec> : null;
            case 'certifications': return certifications.length > 0 ? <Sec key={key} title="CERTIFICATIONS" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>{certifications.map(cert => (
              <div key={cert.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div style={{ width: '6px', height: '6px', background: c, borderRadius: '1px', flexShrink: 0 }} />
                <span style={{ fontSize: fs(1.0), fontWeight: 700 }}>{cert.name}</span>
                <span style={{ fontSize: fs(0.91), color: '#9ca3af' }}>— {cert.issuer}, {formatDate(cert.date)}</span>
              </div>
            ))}</Sec> : null;
            case 'languages': return languages.length > 0 ? <Sec key={key} title="LANGUAGES" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}><div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>{languages.map(l => (
              <span key={l.id} style={{ fontSize: fs(0.95), padding: '4px 14px', background: '#f3f4f6', borderRadius: '20px', fontWeight: 600 }}>{l.language} <span style={{ color: '#9ca3af', fontWeight: 400 }}>({l.proficiency})</span></span>
            ))}</div></Sec> : null;
            case 'awards': return awards.length > 0 ? <Sec key={key} title="AWARDS" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>{awards.map(a => <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}><div style={{ width: '6px', height: '6px', background: c, borderRadius: '1px' }} /><span style={{ fontSize: fs(0.95) }}><strong>{a.title}</strong>{a.issuer ? ` — ${a.issuer}` : ''}</span></div>)}</Sec> : null;
            case 'volunteering': return volunteering.length > 0 ? <Sec key={key} title="VOLUNTEERING" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>{volunteering.map(v => <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: fs(0.95), margin: '4px 0' }}><span><strong>{v.role}</strong> — {v.organization}</span><span style={{ color: '#9ca3af', fontWeight: 600 }}>{formatDateRange(v.startDate, v.endDate, v.current)}</span></div>)}</Sec> : null;
            case 'publications': return publications.length > 0 ? <Sec key={key} title="PUBLICATIONS" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>{publications.map(p => <p key={p.id} style={{ fontSize: fs(0.95), margin: '3px 0' }}><strong>{p.title}</strong> — {p.publisher}, {formatDate(p.date)}</p>)}</Sec> : null;
            case 'references': return references.length > 0 ? <Sec key={key} title="REFERENCES" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>{references.map(r => <div key={r.id} style={{ marginBottom: '6px' }}><p style={{ fontSize: fs(1.0), fontWeight: 800, margin: 0 }}>{r.name}</p><p style={{ fontSize: fs(0.91), color: '#6b7280', margin: 0 }}>{r.position}, {r.company}</p></div>)}</Sec> : null;
            default: return null;
          }
        })}
      </div>
    </div>
  );
}

function Sec({ title, c, sp = 16, bf = 11, headerStyle = 'uppercase-underline' as HeaderStyle, headerLetterSpacing = '2px', children }: { title: string; c: string; sp?: number; bf?: number; headerStyle?: HeaderStyle; headerLetterSpacing?: string; children: React.ReactNode }) {
  const displayText = formatHeaderText(title, headerStyle);
  const showLine = showHeaderUnderline(headerStyle);
  return (
    <section style={{ marginBottom: `${sp}px` }}>
      <div style={{ marginBottom: `${Math.min(sp, 12)}px` }}>
        <h2 style={{ fontSize: `${(bf * 1.27).toFixed(1)}px`, fontWeight: 900, letterSpacing: headerLetterSpacing, color: '#111', margin: 0, display: 'inline-block' }}>{displayText}</h2>
        {showLine && <div style={{ height: '4px', background: c, marginTop: '4px', borderRadius: '2px' }} />}
      </div>
      {children}
    </section>
  );
}
