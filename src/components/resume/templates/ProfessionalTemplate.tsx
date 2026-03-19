/* ── Professional Template — Classic Corporate Single-Column ── */
'use client';
import type { ResumeData, ResumeStyle, BulletStyle, HeaderStyle } from '@/types/resume';
import { BULLET_SYMBOLS, NAME_SIZE_OPTIONS } from '@/types/resume';
import { formatDateRange, formatDate, ensureUrl } from '@/lib/utils';

interface P { data: ResumeData; style: ResumeStyle; }

/* ── Bullet renderer ── */
function Bullet({ bulletStyle, color, size }: { bulletStyle: BulletStyle; color: string; size: number }) {
  if (bulletStyle === 'none') return null;
  const sym = BULLET_SYMBOLS[bulletStyle] || '•';
  if (bulletStyle === 'disc') {
    return <span style={{ marginTop: `${size * 0.45}px`, width: `${size * 0.36}px`, height: `${size * 0.36}px`, borderRadius: '50%', background: color, flexShrink: 0, display: 'inline-block' }} />;
  }
  return <span style={{ color, flexShrink: 0, fontSize: `${size * 0.85}px`, lineHeight: 1 }}>{sym}</span>;
}

/* ── Skills renderers by display mode ── */
function SkillsComma({ skills, fs, psp, c }: { skills: ResumeData['skills']; fs: (r: number) => string; psp: number; c: string }) {
  return <>{skills.map((s) => <div key={s.id} style={{ fontSize: fs(0.95), marginTop: `${psp}px` }}><span style={{ fontWeight: 700, color: '#1f2937' }}>{s.category}: </span><span style={{ color: '#4b5563' }}>{s.items.join(', ')}</span></div>)}</>;
}

function SkillsTags({ skills, fs, psp, c }: { skills: ResumeData['skills']; fs: (r: number) => string; psp: number; c: string }) {
  return <>{skills.map((s) => (
    <div key={s.id} style={{ marginTop: `${psp + 4}px` }}>
      <span style={{ fontWeight: 700, color: '#1f2937', fontSize: fs(0.95), display: 'block', marginBottom: '4px' }}>{s.category}</span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {s.items.map((item, j) => (
          <span key={j} style={{
            display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontSize: fs(0.82),
            background: `${c}12`, color: c, border: `1px solid ${c}30`, fontWeight: 500,
          }}>{item}</span>
        ))}
      </div>
    </div>
  ))}</>;
}

function SkillsBars({ skills, fs, psp, c }: { skills: ResumeData['skills']; fs: (r: number) => string; psp: number; c: string }) {
  return <>{skills.map((s) => (
    <div key={s.id} style={{ marginTop: `${psp + 4}px` }}>
      <span style={{ fontWeight: 700, color: '#1f2937', fontSize: fs(0.95), display: 'block', marginBottom: '4px' }}>{s.category}</span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px' }}>
        {s.items.map((item, j) => (
          <div key={j} style={{ fontSize: fs(0.82), color: '#4b5563', display: 'flex', alignItems: 'center', gap: '6px', minWidth: '120px' }}>
            <span>{item}</span>
            <div style={{ flex: 1, height: '4px', background: '#e5e7eb', borderRadius: '2px', minWidth: '40px' }}>
              <div style={{ width: `${Math.max(45, 100 - j * 8)}%`, height: '100%', background: c, borderRadius: '2px' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  ))}</>;
}

export default function ProfessionalTemplate({ data, style }: P) {
  const { personalInfo: pi, summary, experience, education, skills, projects, certifications, languages, awards, volunteering, publications, references } = data;
  const c = style.primaryColor;
  const hidden = new Set(style.hiddenSections);
  const BASE_FONT = style.fontSize === 'small' ? 10 : style.fontSize === 'large' ? 12.5 : 11;
  const fs = (r: number) => `${(BASE_FONT * r).toFixed(1)}px`;
  const sp = style.sectionSpacing ?? 16;
  const psp = style.paragraphSpacing ?? 4;
  const bulletStyle = style.bulletStyle ?? 'disc';
  const headerSty = style.headerStyle ?? 'uppercase-underline';
  const skillMode = style.skillDisplayMode ?? 'comma';
  const dateAlign = style.dateAlignment ?? 'right';
  const nameMultiplier = NAME_SIZE_OPTIONS.find(n => n.id === (style.nameSize ?? 'large'))?.multiplier ?? 2.55;
  const bodyLetterSpacing = `${style.letterSpacing ?? 0}px`;
  const headerLetterSpacing = `${style.headerLetterSpacing ?? 1.5}px`;

  const renderSection = (key: string) => {
    switch (key) {
      case 'summary': return summary ? <Sec key={key} t="Professional Summary" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSpacing}><p style={{ fontSize: fs(1), lineHeight: '1.65', color: '#374151', letterSpacing: bodyLetterSpacing }}>{summary}</p></Sec> : null;
      case 'experience': return experience.length > 0 ? <Sec key={key} t="Work Experience" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSpacing}>{experience.map((e, i) => (
        <div key={e.id} style={{ marginTop: i > 0 ? '14px' : 0 }}>
          <div style={{ display: 'flex', justifyContent: dateAlign === 'right' ? 'space-between' : 'flex-start', alignItems: 'baseline', flexWrap: dateAlign === 'inline' ? 'wrap' : undefined, gap: dateAlign === 'inline' ? '8px' : undefined }}>
            <div><span style={{ fontWeight: 700, fontSize: fs(1.09), color: '#111', letterSpacing: bodyLetterSpacing }}>{e.position}</span>{e.company && <span style={{ fontSize: fs(1), color: '#6b7280' }}>{' '}| {e.company}</span>}</div>
            {dateAlign === 'right' && <span style={{ fontSize: fs(0.91), color: '#9ca3af', flexShrink: 0, marginLeft: '12px' }}>{formatDateRange(e.startDate, e.endDate, e.current)}</span>}
            {dateAlign === 'inline' && <span style={{ fontSize: fs(0.91), color: '#9ca3af' }}>{formatDateRange(e.startDate, e.endDate, e.current)}</span>}
          </div>
          {dateAlign === 'left' && <p style={{ fontSize: fs(0.91), color: '#9ca3af', margin: '1px 0 0' }}>{formatDateRange(e.startDate, e.endDate, e.current)}{e.location ? ` · ${e.location}` : ''}</p>}
          {dateAlign !== 'left' && e.location && <p style={{ fontSize: fs(0.91), color: '#9ca3af' }}>{e.location}</p>}
          {e.highlights.filter(Boolean).length > 0 && <ul style={{ margin: '4px 0 0', padding: 0, listStyle: 'none' }}>{e.highlights.filter(Boolean).map((h, j) => (
            <li key={j} style={{ fontSize: fs(0.95), color: '#374151', display: 'flex', gap: '6px', marginTop: `${psp}px`, letterSpacing: bodyLetterSpacing }}><Bullet bulletStyle={bulletStyle} color={c} size={BASE_FONT} /><span>{h}</span></li>
          ))}</ul>}
        </div>))}</Sec> : null;
      case 'education': return education.length > 0 ? <Sec key={key} t="Education" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSpacing}>{education.map((e) => (
        <div key={e.id} style={{ display: dateAlign === 'right' ? 'flex' : 'block', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div><span style={{ fontWeight: 700, fontSize: fs(1.09), letterSpacing: bodyLetterSpacing }}>{e.degree}{e.field ? ` in ${e.field}` : ''}</span><span style={{ color: '#6b7280', fontSize: fs(1) }}> — {e.institution}</span>{e.gpa && <span style={{ color: '#9ca3af', fontSize: fs(0.91), marginLeft: '6px' }}>GPA: {e.gpa}</span>}</div>
          {dateAlign === 'right' && <span style={{ fontSize: fs(0.91), color: '#9ca3af', flexShrink: 0 }}>{formatDateRange(e.startDate, e.endDate, false)}</span>}
          {dateAlign !== 'right' && <p style={{ fontSize: fs(0.91), color: '#9ca3af', margin: '1px 0 0' }}>{formatDateRange(e.startDate, e.endDate, false)}</p>}
        </div>
      ))}</Sec> : null;
      case 'skills': return skills.length > 0 ? <Sec key={key} t="Technical Skills" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSpacing}>
        {skillMode === 'tags' ? <SkillsTags skills={skills} fs={fs} psp={psp} c={c} /> :
         skillMode === 'bars' ? <SkillsBars skills={skills} fs={fs} psp={psp} c={c} /> :
         <SkillsComma skills={skills} fs={fs} psp={psp} c={c} />}
      </Sec> : null;
      case 'projects': return projects.length > 0 ? <Sec key={key} t="Projects" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSpacing}>{projects.map((p, i) => (
        <div key={p.id} style={{ marginTop: i > 0 ? '10px' : 0 }}>
          <span style={{ fontWeight: 700, fontSize: fs(1.09), letterSpacing: bodyLetterSpacing }}>{p.name}</span>{p.url && <a href={ensureUrl(p.url)} target="_blank" rel="noopener noreferrer" style={{ fontSize: fs(0.82), color: '#9ca3af', marginLeft: '6px', textDecoration: 'none' }}>{p.url}</a>}
          {p.description && <p style={{ fontSize: fs(0.95), color: '#4b5563', margin: '2px 0 0', letterSpacing: bodyLetterSpacing }}>{p.description}</p>}
          {p.technologies.length > 0 && <p style={{ fontSize: fs(0.91), color: '#9ca3af' }}>Tech: {p.technologies.join(', ')}</p>}
          {p.highlights.filter(Boolean).length > 0 && <ul style={{ margin: '2px 0 0', padding: 0, listStyle: 'none' }}>{p.highlights.filter(Boolean).map((h, j) => <li key={j} style={{ fontSize: fs(0.95), color: '#374151', display: 'flex', gap: '6px', marginTop: `${psp}px`, letterSpacing: bodyLetterSpacing }}><Bullet bulletStyle={bulletStyle} color={c} size={BASE_FONT} /><span>{h}</span></li>)}</ul>}
        </div>))}</Sec> : null;
      case 'certifications': return certifications.length > 0 ? <Sec key={key} t="Certifications" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSpacing}>{certifications.map((cert) => <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: fs(0.95), letterSpacing: bodyLetterSpacing }}><span><strong>{cert.name}</strong> — {cert.issuer}</span><span style={{ color: '#9ca3af' }}>{formatDate(cert.date)}</span></div>)}</Sec> : null;
      case 'languages': return languages.length > 0 ? <Sec key={key} t="Languages" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSpacing}><div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: fs(0.95) }}>{languages.map((l) => <span key={l.id}><strong>{l.language}</strong> — {l.proficiency}</span>)}</div></Sec> : null;
      case 'awards': return awards.length > 0 ? <Sec key={key} t="Awards" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSpacing}>{awards.map((a) => <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: fs(0.95) }}><span><strong>{a.title}</strong> — {a.issuer}</span><span style={{ color: '#9ca3af' }}>{formatDate(a.date)}</span></div>)}</Sec> : null;
      case 'volunteering': return volunteering.length > 0 ? <Sec key={key} t="Volunteering" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSpacing}>{volunteering.map((v) => <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: fs(0.95) }}><span><strong>{v.role}</strong> — {v.organization}</span><span style={{ color: '#9ca3af' }}>{formatDateRange(v.startDate, v.endDate, v.current)}</span></div>)}</Sec> : null;
      case 'publications': return publications.length > 0 ? <Sec key={key} t="Publications" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSpacing}>{publications.map((p) => <p key={p.id} style={{ fontSize: fs(0.95) }}><strong>{p.title}</strong> — {p.publisher}, {formatDate(p.date)}</p>)}</Sec> : null;
      case 'references': return references.length > 0 ? <Sec key={key} t="References" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSpacing}>{references.map((r) => <div key={r.id} style={{ fontSize: fs(0.95) }}><strong>{r.name}</strong>, {r.position} at {r.company} — {r.email}</div>)}</Sec> : null;
      default: return null;
    }
  };

  return (
    <div style={{ width: '794px', minHeight: '1123px', padding: `${style.marginTop ?? 48}px ${style.marginRight ?? 56}px ${style.marginBottom ?? 48}px ${style.marginLeft ?? 56}px`, background: '#fff', fontFamily: style.fontFamily, color: '#1a1a1a', fontSize: `${BASE_FONT}px`, lineHeight: style.lineHeight ?? 1.5, letterSpacing: bodyLetterSpacing }}>
      <header style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: fs(nameMultiplier), fontWeight: 700, color: c, margin: 0, letterSpacing: `${(style.letterSpacing ?? 0) + 0.5}px` }}>{pi.firstName} {pi.lastName}</h1>
        {pi.title && <p style={{ fontSize: fs(1.18), fontWeight: 500, color: '#6b7280', margin: '2px 0 0' }}>{pi.title}</p>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', marginTop: '8px', fontSize: fs(0.91), color: '#6b7280' }}>
          {pi.email && <a href={`mailto:${pi.email}`} style={{ color: '#6b7280', textDecoration: 'none' }}>{pi.email}</a>}{pi.phone && <span>{pi.phone}</span>}{pi.location && <span>{pi.location}</span>}
          {pi.linkedin && <a href={ensureUrl(pi.linkedin)} target="_blank" rel="noopener noreferrer" style={{ color: '#6b7280', textDecoration: 'none' }}>{pi.linkedin}</a>}
          {pi.github && <a href={ensureUrl(pi.github)} target="_blank" rel="noopener noreferrer" style={{ color: '#6b7280', textDecoration: 'none' }}>{pi.github}</a>}
          {pi.website && <a href={ensureUrl(pi.website)} target="_blank" rel="noopener noreferrer" style={{ color: '#6b7280', textDecoration: 'none' }}>{pi.website}</a>}
        </div>
        <div style={{ marginTop: '12px', height: '2px', background: c }} />
      </header>
      {style.sectionOrder.filter((s) => !hidden.has(s)).map(renderSection)}
    </div>
  );
}

function formatHeaderText(text: string, headerStyle: HeaderStyle): string {
  switch (headerStyle) {
    case 'uppercase-underline':
    case 'uppercase': return text.toUpperCase();
    case 'capitalize-underline':
    case 'capitalize': return text;
    case 'bold-only': return text;
    default: return text.toUpperCase();
  }
}

function Sec({ t, c, sp = 16, bf = 11, headerStyle = 'uppercase-underline' as HeaderStyle, headerLetterSpacing = '1.5px', children }: { t: string; c: string; sp?: number; bf?: number; headerStyle?: HeaderStyle; headerLetterSpacing?: string; children: React.ReactNode }) {
  const showUnderline = headerStyle === 'uppercase-underline' || headerStyle === 'capitalize-underline';
  const displayText = formatHeaderText(t, headerStyle);
  return (
    <section style={{ marginBottom: `${sp}px` }}>
      <h2 style={{
        fontSize: `${(bf * 1.09).toFixed(1)}px`,
        fontWeight: 700,
        letterSpacing: headerLetterSpacing,
        color: c,
        borderBottom: showUnderline ? `1px solid ${c}30` : 'none',
        paddingBottom: showUnderline ? '3px' : '0',
        margin: `0 0 ${Math.min(sp, 10)}px`,
      }}>{displayText}</h2>
      {children}
    </section>
  );
}
