/* ── Technical Template — Terminal / Code Aesthetic ──────── */
'use client';
import type { ResumeData, ResumeStyle, BulletStyle, HeaderStyle } from '@/types/resume';
import { BULLET_SYMBOLS, NAME_SIZE_OPTIONS } from '@/types/resume';
import { formatDateRange, formatDate, ensureUrl } from '@/lib/utils';
import { formatHeaderText } from './template-utils';

interface P { data: ResumeData; style: ResumeStyle; }

export default function TechnicalTemplate({ data, style }: P) {
  const { personalInfo: pi, summary, experience, education, skills, projects, certifications, languages, awards, volunteering, publications, references } = data;
  const c = style.primaryColor;
  const hidden = new Set(style.hiddenSections);
  const order = style.sectionOrder.filter(s => !hidden.has(s));

  const mono = `'Consolas', 'Fira Code', ${style.fontFamily}, monospace`;
  const BASE_FONT = style.fontSize === 'small' ? 10 : style.fontSize === 'large' ? 12.5 : 11;
  const fs = (r: number) => `${(BASE_FONT * r).toFixed(1)}px`;
  const sp = style.sectionSpacing ?? 16;
  const psp = style.paragraphSpacing ?? 4;
  const bulletStyle = style.bulletStyle ?? 'disc';
  const nameMultiplier = NAME_SIZE_OPTIONS.find(n => n.id === (style.nameSize ?? 'large'))?.multiplier ?? 2.55;
  const headerSty = style.headerStyle ?? 'uppercase-underline';
  const headerLetterSp = `${style.headerLetterSpacing ?? 0.5}px`;
  const dateAlign = style.dateAlignment ?? 'right';
  const skillMode = style.skillDisplayMode ?? 'tags';
  const bodyLetterSpacing = `${style.letterSpacing ?? 0}px`;

  return (
    <div style={{ width: '794px', minHeight: '1123px', background: '#fff', fontFamily: style.fontFamily, fontSize: `${BASE_FONT}px`, lineHeight: style.lineHeight ?? 1.55, color: '#1f2937' }}>
      {/* ── HEADER — Dark terminal-style ── */}
      <div style={{ background: '#1e1e2e', color: '#cdd6f4', padding: `32px ${style.marginRight ?? 48}px 32px ${style.marginLeft ?? 48}px`, position: 'relative' }}>
        {/* Fake terminal dots */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f38ba8' }} />
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f9e2af' }} />
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#a6e3a1' }} />
        </div>
        <p style={{ fontFamily: mono, fontSize: fs(1.0), color: '#6c7086', margin: '0 0 4px' }}>
          <span style={{ color: '#a6e3a1' }}>$</span> cat resume.json | jq &apos;.personal&apos;
        </p>
        <h1 style={{ fontSize: fs(Math.max(nameMultiplier, 2.36)), fontWeight: 700, margin: 0, color: '#cdd6f4', fontFamily: mono }}>
          {pi.firstName} {pi.lastName}
        </h1>
        {pi.title && <p style={{ fontSize: fs(1.18), color: c, fontFamily: mono, margin: '2px 0 0' }}>{pi.title}</p>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '10px', fontFamily: mono, fontSize: fs(0.91), color: '#a6adc8' }}>
          {pi.email && <a href={`mailto:${pi.email}`} style={{ color: '#a6adc8', textDecoration: 'none' }}>{pi.email}</a>}
          {pi.phone && <span>{pi.phone}</span>}
          {pi.location && <span>{pi.location}</span>}
          {pi.linkedin && <a href={ensureUrl(pi.linkedin)} target="_blank" rel="noopener noreferrer" style={{ color: '#a6adc8', textDecoration: 'none' }}>{pi.linkedin}</a>}
          {pi.github && <a href={ensureUrl(pi.github)} target="_blank" rel="noopener noreferrer" style={{ color: '#a6adc8', textDecoration: 'none' }}>{pi.github}</a>}
          {pi.website && <a href={ensureUrl(pi.website)} target="_blank" rel="noopener noreferrer" style={{ color: '#a6adc8', textDecoration: 'none' }}>{pi.website}</a>}
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ padding: `28px ${style.marginRight ?? 48}px 28px ${style.marginLeft ?? 48}px` }}>
        {order.map((key) => {
          switch (key) {
            case 'summary': return summary ? <Sec key={key} title="about" c={c} mono={mono} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}><p style={{ fontSize: fs(1.0), lineHeight: '1.7', color: '#6b7280', fontStyle: 'italic', letterSpacing: bodyLetterSpacing }}>{summary}</p></Sec> : null;
            case 'experience': return experience.length > 0 ? <Sec key={key} title="experience" c={c} mono={mono} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>{experience.map((e, i) => (
              <div key={e.id} style={{ marginTop: i > 0 ? '14px' : 0, paddingTop: i > 0 ? '14px' : 0, borderTop: i > 0 ? '1px dashed #e5e7eb' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: dateAlign === 'right' ? 'space-between' : 'flex-start', alignItems: 'flex-start', flexWrap: dateAlign === 'inline' ? 'wrap' : undefined, gap: dateAlign === 'inline' ? '8px' : undefined }}>
                  <div>
                    <h3 style={{ fontSize: fs(1.09), fontWeight: 700, margin: 0, letterSpacing: bodyLetterSpacing }}>{e.position}</h3>
                    <p style={{ fontSize: fs(1.0), fontFamily: mono, color: c, margin: '1px 0 0' }}>{e.company}{e.location ? ` @ ${e.location}` : ''}</p>
                  </div>
                  {dateAlign === 'right' && <span style={{ fontSize: fs(0.91), fontFamily: mono, color: '#9ca3af', padding: '2px 8px', background: '#f9fafb', borderRadius: '3px', border: '1px solid #f3f4f6', flexShrink: 0 }}>{formatDateRange(e.startDate, e.endDate, e.current)}</span>}
                  {dateAlign === 'inline' && <span style={{ fontSize: fs(0.91), fontFamily: mono, color: '#9ca3af' }}>{formatDateRange(e.startDate, e.endDate, e.current)}</span>}
                </div>
                {dateAlign === 'left' && <p style={{ fontSize: fs(0.91), fontFamily: mono, color: '#9ca3af', margin: '1px 0 0' }}>{formatDateRange(e.startDate, e.endDate, e.current)}{e.location ? ` @ ${e.location}` : ''}</p>}
                {e.highlights.filter(Boolean).length > 0 && <ul style={{ margin: '6px 0 0', padding: 0, listStyle: 'none' }}>{e.highlights.filter(Boolean).map((h, j) => (
                  <li key={j} style={{ fontSize: fs(0.95), color: '#4b5563', paddingLeft: '18px', position: 'relative', marginTop: `${psp}px`, fontFamily: mono }}>
                    {bulletStyle === 'disc' ? <span style={{ position: 'absolute', left: 0, color: '#d1d5db', fontWeight: 700 }}>&gt;</span> : bulletStyle !== 'none' ? <span style={{ position: 'absolute', left: 0, color: c, fontWeight: 700 }}>{BULLET_SYMBOLS[bulletStyle]}</span> : null}{h}
                  </li>
                ))}</ul>}
              </div>
            ))}</Sec> : null;
            case 'education': return education.length > 0 ? <Sec key={key} title="education" c={c} mono={mono} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>{education.map(e => (
              <div key={e.id} style={{ display: dateAlign === 'right' ? 'flex' : 'block', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div><h3 style={{ fontSize: fs(1.09), fontWeight: 700, margin: 0, letterSpacing: bodyLetterSpacing }}>{e.degree}{e.field ? ` in ${e.field}` : ''}</h3><p style={{ fontSize: fs(0.95), color: '#6b7280', margin: 0 }}>{e.institution}{e.gpa ? ` · GPA: ${e.gpa}` : ''}</p></div>
                {dateAlign === 'right' && <span style={{ fontSize: fs(0.91), fontFamily: mono, color: '#9ca3af', flexShrink: 0 }}>{formatDateRange(e.startDate, e.endDate, false)}</span>}
                {dateAlign !== 'right' && <p style={{ fontSize: fs(0.91), fontFamily: mono, color: '#9ca3af', margin: '1px 0 0' }}>{formatDateRange(e.startDate, e.endDate, false)}</p>}
              </div>
            ))}</Sec> : null;
            case 'skills': return skills.length > 0 ? <Sec key={key} title="tech_stack" c={c} mono={mono} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>
              {skillMode === 'comma' ? skills.map(s => <div key={s.id} style={{ marginBottom: '6px' }}><span style={{ fontWeight: 700, fontSize: fs(0.95), color: '#999', fontFamily: mono }}>{s.category}: </span><span style={{ fontSize: fs(0.95), color: '#4b5563' }}>{s.items.join(', ')}</span></div>) : skillMode === 'bars' ? skills.map(s => <div key={s.id} style={{ marginBottom: '8px' }}><span style={{ fontWeight: 700, fontSize: fs(0.91), color: '#999', fontFamily: mono, display: 'block', marginBottom: '4px' }}>{s.category}</span>{s.items.map((item, j) => <div key={j} style={{ fontSize: fs(0.82), color: '#4b5563', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px', fontFamily: mono }}><span style={{ minWidth: '90px' }}>{item}</span><div style={{ flex: 1, height: '4px', background: '#e5e7eb', borderRadius: '2px' }}><div style={{ width: `${Math.max(45, 100 - j * 8)}%`, height: '100%', background: c, borderRadius: '2px' }} /></div></div>)}</div>) : <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>{skills.flatMap(s => s.items.map((item, j) => (
              <span key={`${s.id}-${j}`} style={{ fontSize: fs(0.91), fontFamily: mono, padding: '3px 10px', background: '#1e1e2e', color: '#cdd6f4', borderRadius: '4px', fontWeight: 500 }}>{item}</span>
            )))}</div>}
            </Sec> : null;
            case 'projects': return projects.length > 0 ? <Sec key={key} title="projects" c={c} mono={mono} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>{projects.map((p, i) => (
              <div key={p.id} style={{ marginTop: i > 0 ? '10px' : 0, padding: '8px 12px', background: '#fafafa', borderRadius: '6px', border: '1px solid #f3f4f6' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontWeight: 700, fontSize: fs(1.05), fontFamily: mono }}>{p.name}</span>
                  {p.url && <a href={ensureUrl(p.url)} target="_blank" rel="noopener noreferrer" style={{ fontSize: fs(0.82), color: c, fontFamily: mono, textDecoration: 'none' }}>{p.url}</a>}
                </div>
                {p.description && <p style={{ fontSize: fs(0.91), color: '#888', margin: '2px 0 0' }}>{p.description}</p>}
                {p.technologies.length > 0 && <p style={{ fontSize: fs(0.82), color: '#aaa', fontFamily: mono, margin: '4px 0 0' }}>deps: [{p.technologies.join(', ')}]</p>}
              </div>
            ))}</Sec> : null;
            case 'certifications': return certifications.length > 0 ? <Sec key={key} title="certifications" c={c} mono={mono} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>{certifications.map(cert => <p key={cert.id} style={{ fontSize: fs(0.95), margin: '3px 0', fontFamily: mono }}><span style={{ color: c }}>→</span> {cert.name} <span style={{ color: '#aaa' }}>({cert.issuer}, {formatDate(cert.date)})</span></p>)}</Sec> : null;
            case 'languages': return languages.length > 0 ? <Sec key={key} title="languages" c={c} mono={mono} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}><div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>{languages.map(l => <span key={l.id} style={{ fontSize: fs(0.95), fontFamily: mono }}>{l.language}: <span style={{ color: '#9ca3af' }}>{l.proficiency}</span></span>)}</div></Sec> : null;
            case 'awards': return awards.length > 0 ? <Sec key={key} title="awards" c={c} mono={mono} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>{awards.map(a => <p key={a.id} style={{ fontSize: fs(0.95), margin: '3px 0' }}>★ {a.title}{a.issuer ? ` — ${a.issuer}` : ''}</p>)}</Sec> : null;
            case 'volunteering': return volunteering.length > 0 ? <Sec key={key} title="volunteering" c={c} mono={mono} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>{volunteering.map(v => <p key={v.id} style={{ fontSize: fs(0.95), margin: '3px 0' }}>{v.role} @ {v.organization} ({formatDateRange(v.startDate, v.endDate, v.current)})</p>)}</Sec> : null;
            case 'publications': return publications.length > 0 ? <Sec key={key} title="publications" c={c} mono={mono} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>{publications.map(p => <p key={p.id} style={{ fontSize: fs(0.95), fontStyle: 'italic', margin: '3px 0' }}>{p.title} — {p.publisher}, {formatDate(p.date)}</p>)}</Sec> : null;
            case 'references': return references.length > 0 ? <Sec key={key} title="references" c={c} mono={mono} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>{references.map(r => <div key={r.id} style={{ marginBottom: '6px' }}><p style={{ fontSize: fs(0.95), fontWeight: 600, margin: 0 }}>{r.name}</p><p style={{ fontSize: fs(0.86), color: '#999', margin: 0 }}>{r.position}, {r.company}</p></div>)}</Sec> : null;
            default: return null;
          }
        })}
      </div>
    </div>
  );
}

function Sec({ title, c, mono, sp = 16, bf = 11, headerStyle = 'uppercase-underline' as HeaderStyle, headerLetterSpacing = '0.5px', children }: { title: string; c: string; mono: string; sp?: number; bf?: number; headerStyle?: HeaderStyle; headerLetterSpacing?: string; children: React.ReactNode }) {
  const displayText = formatHeaderText(title, headerStyle);
  return (
    <section style={{ marginBottom: `${sp}px` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: `${Math.min(sp, 10)}px` }}>
        <span style={{ fontFamily: mono, fontSize: `${(bf * 1.0).toFixed(1)}px`, color: '#9ca3af' }}>//</span>
        <h2 style={{ fontFamily: mono, fontSize: `${(bf * 1.09).toFixed(1)}px`, fontWeight: 600, color: c, margin: 0, letterSpacing: headerLetterSpacing }}>{displayText}</h2>
        <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
      </div>
      {children}
    </section>
  );
}
