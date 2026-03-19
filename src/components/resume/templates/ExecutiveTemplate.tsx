/* ── Executive Template — Full-Width Banner + Thick Borders ── */
'use client';
import type { ResumeData, ResumeStyle, BulletStyle, HeaderStyle } from '@/types/resume';
import { BULLET_SYMBOLS, NAME_SIZE_OPTIONS } from '@/types/resume';
import { formatDateRange, formatDate, ensureUrl } from '@/lib/utils';
import { formatHeaderText, showHeaderUnderline } from './template-utils';

interface P { data: ResumeData; style: ResumeStyle; }

export default function ExecutiveTemplate({ data, style }: P) {
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
  const headerLetterSp = `${style.headerLetterSpacing ?? 1}px`;
  const dateAlign = style.dateAlignment ?? 'right';
  const skillMode = style.skillDisplayMode ?? 'comma';
  const bodyLetterSpacing = `${style.letterSpacing ?? 0}px`;

  return (
    <div style={{ width: '794px', minHeight: '1123px', background: '#fff', fontFamily: style.fontFamily, fontSize: `${BASE_FONT}px`, lineHeight: style.lineHeight ?? 1.55, color: '#1a1a1a' }}>
      {/* ── HEADER BANNER ── */}
      <div style={{ background: c, color: '#fff', padding: `36px ${style.marginRight ?? 56}px 36px ${style.marginLeft ?? 56}px`, position: 'relative' }}>
        <h1 style={{ fontSize: fs(Math.max(nameMultiplier, 2.55)), fontWeight: 700, margin: 0, letterSpacing: '1px' }}>{pi.firstName} {pi.lastName}</h1>
        {pi.title && <p style={{ fontSize: fs(1.27), fontWeight: 400, opacity: 0.85, margin: '4px 0 0', letterSpacing: '1px' }}>{pi.title}</p>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '12px', fontSize: fs(0.91), opacity: 0.8 }}>
          {pi.email && <a href={`mailto:${pi.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>✉ {pi.email}</a>}
          {pi.phone && <span>☎ {pi.phone}</span>}
          {pi.location && <span>📍 {pi.location}</span>}
          {pi.linkedin && <a href={ensureUrl(pi.linkedin)} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>{pi.linkedin}</a>}
          {pi.github && <a href={ensureUrl(pi.github)} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>{pi.github}</a>}
          {pi.website && <a href={ensureUrl(pi.website)} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>{pi.website}</a>}
        </div>
        {/* Decorative bottom strip */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: 'rgba(0,0,0,0.15)' }} />
      </div>

      {/* ── BODY ── */}
      <div style={{ padding: `32px ${style.marginRight ?? 56}px 32px ${style.marginLeft ?? 56}px` }}>
        {order.map((key) => {
          switch (key) {
            case 'summary': return summary ? <Sec key={key} title="Executive Summary" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}><p style={{ fontSize: fs(1.0), lineHeight: '1.7', color: '#4b5563', letterSpacing: bodyLetterSpacing }}>{summary}</p></Sec> : null;
            case 'experience': return experience.length > 0 ? <Sec key={key} title="Professional Experience" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>{experience.map((e, i) => (
              <div key={e.id} style={{ marginTop: i > 0 ? '16px' : 0, paddingTop: i > 0 ? '16px' : 0, borderTop: i > 0 ? '1px solid #f3f4f6' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: dateAlign === 'right' ? 'space-between' : 'flex-start', alignItems: 'flex-start', flexWrap: dateAlign === 'inline' ? 'wrap' : undefined, gap: dateAlign === 'inline' ? '8px' : undefined }}>
                  <div><h3 style={{ fontSize: fs(1.18), fontWeight: 700, color: '#111', margin: 0, letterSpacing: bodyLetterSpacing }}>{e.position}</h3><p style={{ fontSize: fs(1.05), fontWeight: 600, color: c, margin: '1px 0 0' }}>{e.company}{e.location ? `, ${e.location}` : ''}</p></div>
                  {dateAlign === 'right' && <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '12px' }}><span style={{ fontSize: fs(0.91), background: `${c}15`, color: c, padding: '3px 10px', borderRadius: '4px', fontWeight: 600 }}>{formatDateRange(e.startDate, e.endDate, e.current)}</span></div>}
                  {dateAlign === 'inline' && <span style={{ fontSize: fs(0.91), background: `${c}15`, color: c, padding: '3px 10px', borderRadius: '4px', fontWeight: 600 }}>{formatDateRange(e.startDate, e.endDate, e.current)}</span>}
                </div>
                {dateAlign === 'left' && <p style={{ fontSize: fs(0.91), color: c, fontWeight: 600, margin: '2px 0 0' }}>{formatDateRange(e.startDate, e.endDate, e.current)}{e.location ? ` · ${e.location}` : ''}</p>}
                {e.highlights.filter(Boolean).length > 0 && <ul style={{ margin: '8px 0 0 0', padding: 0, listStyle: 'none' }}>{e.highlights.filter(Boolean).map((h, j) => (
                  <li key={j} style={{ fontSize: fs(0.95), color: '#374151', paddingLeft: '14px', position: 'relative', marginTop: `${psp}px` }}>{bulletStyle === 'disc' ? <span style={{ position: 'absolute', left: 0, top: '6px', width: '4px', height: '4px', background: c, borderRadius: '50%' }} /> : bulletStyle !== 'none' ? <span style={{ position: 'absolute', left: 0, top: '2px', color: c }}>{BULLET_SYMBOLS[bulletStyle]}</span> : null}{h}</li>
                ))}</ul>}
              </div>
            ))}</Sec> : null;
            case 'education': return education.length > 0 ? <Sec key={key} title="Education" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>{education.map((e) => (
              <div key={e.id} style={{ display: dateAlign === 'right' ? 'flex' : 'block', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div><h3 style={{ fontSize: fs(1.09), fontWeight: 700, margin: 0, letterSpacing: bodyLetterSpacing }}>{e.degree}{e.field ? ` in ${e.field}` : ''}</h3><p style={{ fontSize: fs(1.0), color: '#6b7280', margin: 0 }}>{e.institution}{e.gpa ? ` · GPA: ${e.gpa}` : ''}</p></div>
                {dateAlign === 'right' && <span style={{ fontSize: fs(0.91), color: c, fontWeight: 600, flexShrink: 0 }}>{formatDateRange(e.startDate, e.endDate, false)}</span>}
                {dateAlign !== 'right' && <p style={{ fontSize: fs(0.91), color: c, fontWeight: 600, margin: '1px 0 0' }}>{formatDateRange(e.startDate, e.endDate, false)}</p>}
              </div>
            ))}</Sec> : null;
            case 'skills': return skills.length > 0 ? <Sec key={key} title="Core Competencies" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>
              {skillMode === 'tags' ? <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>{skills.map(s => s.items.map((item, j) => <span key={`${s.id}-${j}`} style={{ fontSize: fs(0.91), padding: '3px 10px', background: `${c}10`, color: c, borderRadius: '4px', fontWeight: 500, border: `1px solid ${c}30` }}>{item}</span>))}</div> : skillMode === 'bars' ? <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>{skills.map(s => <div key={s.id}><p style={{ fontSize: fs(0.91), fontWeight: 700, color: c, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.category}</p>{s.items.map((item, j) => <div key={j} style={{ fontSize: fs(0.82), color: '#555', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}><span style={{ minWidth: '80px' }}>{item}</span><div style={{ flex: 1, height: '4px', background: '#e5e7eb', borderRadius: '2px' }}><div style={{ width: `${Math.max(45, 100 - j * 8)}%`, height: '100%', background: c, borderRadius: '2px' }} /></div></div>)}</div>)}</div> : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>{skills.map(s => (
              <div key={s.id}><p style={{ fontSize: fs(0.91), fontWeight: 700, color: c, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.category}</p><p style={{ fontSize: fs(0.95), color: '#555' }}>{s.items.join(' · ')}</p></div>
            ))}</div>}
            </Sec> : null;
            case 'projects': return projects.length > 0 ? <Sec key={key} title="Key Projects" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>{projects.map((p, i) => (
              <div key={p.id} style={{ marginTop: i > 0 ? '10px' : 0 }}>
                <span style={{ fontWeight: 700, fontSize: fs(1.09) }}>{p.name}</span>{p.url && <a href={ensureUrl(p.url)} target="_blank" rel="noopener noreferrer" style={{ fontSize: fs(0.86), color: c, marginLeft: '8px', textDecoration: 'none' }}>{p.url}</a>}
                {p.description && <p style={{ fontSize: fs(0.95), color: '#6b7280', margin: '2px 0 0' }}>{p.description}</p>}
                {p.technologies.length > 0 && <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>{p.technologies.map((t, j) => <span key={j} style={{ fontSize: fs(0.82), padding: '2px 8px', background: `${c}10`, color: c, borderRadius: '3px', fontWeight: 500 }}>{t}</span>)}</div>}
              </div>
            ))}</Sec> : null;
            case 'certifications': return certifications.length > 0 ? <Sec key={key} title="Certifications" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>{certifications.map(cert => <p key={cert.id} style={{ fontSize: fs(0.95), margin: '4px 0' }}><strong>{cert.name}</strong> — {cert.issuer}, {formatDate(cert.date)}</p>)}</Sec> : null;
            case 'languages': return languages.length > 0 ? <Sec key={key} title="Languages" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}><div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>{languages.map(l => <span key={l.id} style={{ fontSize: fs(0.95) }}><strong>{l.language}</strong> — {l.proficiency}</span>)}</div></Sec> : null;
            case 'awards': return awards.length > 0 ? <Sec key={key} title="Honors & Awards" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>{awards.map(a => <p key={a.id} style={{ fontSize: fs(0.95), margin: '3px 0' }}><strong>{a.title}</strong>{a.issuer ? ` — ${a.issuer}` : ''}{a.date ? `, ${formatDate(a.date)}` : ''}</p>)}</Sec> : null;
            case 'volunteering': return volunteering.length > 0 ? <Sec key={key} title="Community Leadership" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>{volunteering.map(v => <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: fs(0.95), margin: '3px 0' }}><span><strong>{v.role}</strong> — {v.organization}</span><span style={{ color: '#9ca3af' }}>{formatDateRange(v.startDate, v.endDate, v.current)}</span></div>)}</Sec> : null;
            case 'publications': return publications.length > 0 ? <Sec key={key} title="Publications" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>{publications.map(p => <p key={p.id} style={{ fontSize: fs(0.95), margin: '3px 0' }}><em>{p.title}</em> — {p.publisher}, {formatDate(p.date)}</p>)}</Sec> : null;
            case 'references': return references.length > 0 ? <Sec key={key} title="References" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>{references.map(r => <div key={r.id} style={{ marginBottom: '6px' }}><p style={{ fontSize: fs(1.0), fontWeight: 600 }}>{r.name}</p><p style={{ fontSize: fs(0.91), color: '#6b7280' }}>{r.position}, {r.company}{r.email ? ` · ${r.email}` : ''}{r.phone ? ` · ${r.phone}` : ''}</p></div>)}</Sec> : null;
            default: return null;
          }
        })}
      </div>
    </div>
  );
}

function Sec({ title, c, sp = 16, bf = 11, headerStyle = 'uppercase-underline' as HeaderStyle, headerLetterSpacing = '1px', children }: { title: string; c: string; sp?: number; bf?: number; headerStyle?: HeaderStyle; headerLetterSpacing?: string; children: React.ReactNode }) {
  const displayText = formatHeaderText(title, headerStyle);
  const showLine = showHeaderUnderline(headerStyle);
  return (
    <section style={{ marginBottom: `${sp}px` }}>
      <div style={{ borderLeft: showLine ? `4px solid ${c}` : 'none', paddingLeft: showLine ? '12px' : '0', marginBottom: `${Math.min(sp, 12)}px` }}>
        <h2 style={{ fontSize: `${(bf * 1.27).toFixed(1)}px`, fontWeight: 700, color: '#111', margin: 0, textTransform: headerStyle.startsWith('uppercase') ? 'uppercase' : 'none', letterSpacing: headerLetterSpacing }}>{displayText}</h2>
      </div>
      {children}
    </section>
  );
}
