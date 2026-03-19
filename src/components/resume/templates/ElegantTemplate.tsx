/* ── Elegant Template — Serif, Centered Dividers, Italic ── */
'use client';
import type { ResumeData, ResumeStyle, BulletStyle, HeaderStyle } from '@/types/resume';
import { BULLET_SYMBOLS, NAME_SIZE_OPTIONS } from '@/types/resume';
import { formatDateRange, formatDate, ensureUrl, isLinkable } from '@/lib/utils';
import { formatHeaderText, showHeaderUnderline } from './template-utils';

interface P { data: ResumeData; style: ResumeStyle; }

export default function ElegantTemplate({ data, style }: P) {
  const { personalInfo: pi, summary, experience, education, skills, projects, certifications, languages, awards, volunteering, publications, references } = data;
  const c = style.primaryColor;
  const hidden = new Set(style.hiddenSections);
  const order = style.sectionOrder.filter(s => !hidden.has(s));
  const serif = `'Georgia', 'Playfair Display', ${style.fontFamily}, serif`;
  const BASE_FONT = style.fontSize === 'small' ? 10 : style.fontSize === 'large' ? 12.5 : 11;
  const fs = (r: number) => `${(BASE_FONT * r).toFixed(1)}px`;
  const sp = style.sectionSpacing ?? 16;
  const psp = style.paragraphSpacing ?? 4;
  const bulletStyle = style.bulletStyle ?? 'disc';
  const nameMultiplier = NAME_SIZE_OPTIONS.find(n => n.id === (style.nameSize ?? 'large'))?.multiplier ?? 2.55;
  const headerSty = style.headerStyle ?? 'uppercase-underline';
  const headerLetterSp = `${style.headerLetterSpacing ?? 3}px`;
  const dateAlign = style.dateAlignment ?? 'right';
  const skillMode = style.skillDisplayMode ?? 'comma';
  const bodyLetterSpacing = `${style.letterSpacing ?? 0}px`;

  return (
    <div style={{ width: '794px', minHeight: '1123px', padding: `${style.marginTop ?? 52}px ${style.marginRight ?? 64}px ${style.marginBottom ?? 52}px ${style.marginLeft ?? 64}px`, background: '#fff', fontFamily: serif, fontSize: `${BASE_FONT}px`, lineHeight: style.lineHeight ?? 1.65, color: '#2c2c2c' }}>
      {/* ── HEADER — elegant, centered ── */}
      <div style={{ textAlign: 'center', marginBottom: '6px' }}>
        <h1 style={{ fontSize: fs(Math.max(nameMultiplier, 2.55)), fontWeight: 400, letterSpacing: '6px', margin: 0, textTransform: 'uppercase', color: '#222' }}>{pi.firstName} {pi.lastName}</h1>
        {pi.title && <p style={{ fontSize: fs(1.18), fontWeight: 400, fontStyle: 'italic', color: c, marginTop: '6px', letterSpacing: '2px' }}>{pi.title}</p>}
        {/* Ornamental divider */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', margin: '12px 0' }}>
          <div style={{ width: '60px', height: '1px', background: '#d4d4d4' }} />
          <span style={{ fontSize: fs(1.27), color: c }}>◆</span>
          <div style={{ width: '60px', height: '1px', background: '#d4d4d4' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '6px', fontSize: fs(0.91), color: '#888' }}>
          {[pi.email, pi.phone, pi.location, pi.linkedin, pi.github, pi.website].filter(Boolean).map((info, i, arr) => {
            const linkable = isLinkable(info);
            return <span key={i}>{linkable ? <a href={ensureUrl(info)} target={info.includes('@') ? undefined : '_blank'} rel={info.includes('@') ? undefined : 'noopener noreferrer'} style={{ color: 'inherit', textDecoration: 'none' }}>{info}</a> : info}{i < arr.length - 1 ? <span style={{ margin: '0 4px', color: '#d4d4d4' }}>|</span> : ''}</span>;
          })}
        </div>
      </div>

      {/* ── SECTIONS ── */}
      {order.map((key) => {
        switch (key) {
          case 'summary': return summary ? <Sec key={key} title="Profile" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}><p style={{ fontSize: fs(1.0), lineHeight: '1.85', color: '#555', textAlign: 'justify', fontStyle: 'italic', letterSpacing: bodyLetterSpacing }}>{summary}</p></Sec> : null;
          case 'experience': return experience.length > 0 ? <Sec key={key} title="Experience" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>{experience.map((e, i) => (
            <div key={e.id} style={{ marginTop: i > 0 ? '18px' : 0 }}>
              <div style={{ display: 'flex', justifyContent: dateAlign === 'right' ? 'space-between' : 'flex-start', alignItems: 'baseline', flexWrap: dateAlign === 'inline' ? 'wrap' : undefined, gap: dateAlign === 'inline' ? '8px' : undefined }}>
                <div>
                  <h3 style={{ fontSize: fs(1.18), fontWeight: 700, margin: 0, color: '#222', letterSpacing: bodyLetterSpacing }}>{e.position}</h3>
                  <p style={{ fontSize: fs(1.05), fontStyle: 'italic', color: c, margin: '1px 0 0' }}>{e.company}{e.location ? `, ${e.location}` : ''}</p>
                </div>
                {dateAlign === 'right' && <span style={{ fontSize: fs(0.91), color: '#aaa', flexShrink: 0, fontStyle: 'italic', marginLeft: '12px' }}>{formatDateRange(e.startDate, e.endDate, e.current)}</span>}
                {dateAlign === 'inline' && <span style={{ fontSize: fs(0.91), color: '#aaa', fontStyle: 'italic' }}>{formatDateRange(e.startDate, e.endDate, e.current)}</span>}
              </div>
              {dateAlign === 'left' && <p style={{ fontSize: fs(0.91), color: '#aaa', fontStyle: 'italic', margin: '1px 0 0' }}>{formatDateRange(e.startDate, e.endDate, e.current)}{e.location ? ` · ${e.location}` : ''}</p>}
              {e.highlights.filter(Boolean).length > 0 && <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>{e.highlights.filter(Boolean).map((h, j) => (
                <li key={j} style={{ fontSize: fs(0.95), color: '#555', marginTop: `${psp}px`, lineHeight: '1.6', listStyleType: bulletStyle === 'none' ? 'none' : bulletStyle === 'disc' ? 'disc' : 'none', paddingLeft: bulletStyle !== 'disc' && bulletStyle !== 'none' ? '0' : undefined }}>
                  {bulletStyle !== 'disc' && bulletStyle !== 'none' ? <span style={{ marginRight: '4px', color: c }}>{BULLET_SYMBOLS[bulletStyle]}</span> : null}{h}
                </li>
              ))}</ul>}
            </div>
          ))}</Sec> : null;
          case 'education': return education.length > 0 ? <Sec key={key} title="Education" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>{education.map(e => (
            <div key={e.id} style={{ display: dateAlign === 'right' ? 'flex' : 'block', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
              <div><span style={{ fontWeight: 700, fontSize: fs(1.09), letterSpacing: bodyLetterSpacing }}>{e.degree}{e.field ? ` in ${e.field}` : ''}</span><span style={{ fontStyle: 'italic', color: '#888', marginLeft: '4px' }}>— {e.institution}</span>{e.gpa && <span style={{ color: '#aaa' }}> (GPA: {e.gpa})</span>}</div>
              {dateAlign === 'right' && <span style={{ fontSize: fs(0.91), color: '#aaa', fontStyle: 'italic', flexShrink: 0 }}>{formatDateRange(e.startDate, e.endDate, false)}</span>}
              {dateAlign !== 'right' && <p style={{ fontSize: fs(0.91), color: '#aaa', fontStyle: 'italic', margin: '1px 0 0' }}>{formatDateRange(e.startDate, e.endDate, false)}</p>}
            </div>
          ))}</Sec> : null;
          case 'skills': return skills.length > 0 ? <Sec key={key} title="Expertise" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>
            {skillMode === 'tags' ? skills.map(s => <div key={s.id} style={{ marginBottom: '8px' }}><span style={{ fontWeight: 700, fontSize: fs(0.95), color: '#444', display: 'block', marginBottom: '4px' }}>{s.category}</span><div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>{s.items.map((item, j) => <span key={j} style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontSize: fs(0.82), background: `${c}12`, color: c, border: `1px solid ${c}30`, fontWeight: 500 }}>{item}</span>)}</div></div>) : skillMode === 'bars' ? skills.map(s => <div key={s.id} style={{ marginBottom: '8px' }}><span style={{ fontWeight: 700, fontSize: fs(0.95), color: '#444', display: 'block', marginBottom: '4px' }}>{s.category}</span><div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px' }}>{s.items.map((item, j) => <div key={j} style={{ fontSize: fs(0.82), color: '#666', display: 'flex', alignItems: 'center', gap: '6px', minWidth: '120px' }}><span>{item}</span><div style={{ flex: 1, height: '4px', background: '#e5e7eb', borderRadius: '2px', minWidth: '40px' }}><div style={{ width: `${Math.max(45, 100 - j * 8)}%`, height: '100%', background: c, borderRadius: '2px' }} /></div></div>)}</div></div>) : skills.map(s => <div key={s.id} style={{ marginBottom: '6px' }}>
              <span style={{ fontWeight: 700, fontSize: fs(0.95), color: '#444' }}>{s.category}: </span>
              <span style={{ fontSize: fs(0.95), color: '#666', fontStyle: 'italic' }}>{s.items.join(' · ')}</span>
            </div>)}
          </Sec> : null;
          case 'projects': return projects.length > 0 ? <Sec key={key} title="Notable Projects" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>{projects.map((p, i) => (
            <div key={p.id} style={{ marginTop: i > 0 ? '10px' : 0 }}>
              <span style={{ fontWeight: 700, fontSize: fs(1.09) }}>{p.name}</span>
              {p.url && <a href={ensureUrl(p.url)} target="_blank" rel="noopener noreferrer" style={{ fontSize: fs(0.86), color: c, fontStyle: 'italic', marginLeft: '8px', textDecoration: 'none' }}>{p.url}</a>}
              {p.description && <p style={{ fontSize: fs(0.95), color: '#777', fontStyle: 'italic', margin: '2px 0 0' }}>{p.description}</p>}
              {p.technologies.length > 0 && <p style={{ fontSize: fs(0.86), color: '#999', margin: '2px 0 0' }}>{p.technologies.join(' · ')}</p>}
            </div>
          ))}</Sec> : null;
          case 'certifications': return certifications.length > 0 ? <Sec key={key} title="Certifications" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>{certifications.map(cert => <p key={cert.id} style={{ fontSize: fs(0.95), margin: '3px 0' }}>{cert.name} — <em>{cert.issuer}, {formatDate(cert.date)}</em></p>)}</Sec> : null;
          case 'languages': return languages.length > 0 ? <Sec key={key} title="Languages" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}><p style={{ fontSize: fs(0.95), fontStyle: 'italic', color: '#666' }}>{languages.map(l => `${l.language} (${l.proficiency})`).join(' · ')}</p></Sec> : null;
          case 'awards': return awards.length > 0 ? <Sec key={key} title="Distinctions" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>{awards.map(a => <p key={a.id} style={{ fontSize: fs(0.95), margin: '3px 0' }}>{a.title}{a.issuer ? ` — ${a.issuer}` : ''}{a.date ? `, ${formatDate(a.date)}` : ''}</p>)}</Sec> : null;
          case 'volunteering': return volunteering.length > 0 ? <Sec key={key} title="Service" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>{volunteering.map(v => <p key={v.id} style={{ fontSize: fs(0.95), margin: '3px 0' }}><em>{v.role}</em> — {v.organization}, {formatDateRange(v.startDate, v.endDate, v.current)}</p>)}</Sec> : null;
          case 'publications': return publications.length > 0 ? <Sec key={key} title="Publications" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>{publications.map(p => <p key={p.id} style={{ fontSize: fs(0.95), fontStyle: 'italic', margin: '3px 0' }}>{p.title} — {p.publisher}, {formatDate(p.date)}</p>)}</Sec> : null;
          case 'references': return references.length > 0 ? <Sec key={key} title="References" c={c} sp={sp} bf={BASE_FONT} headerStyle={headerSty} headerLetterSpacing={headerLetterSp}>{references.map(r => <div key={r.id} style={{ marginBottom: '6px' }}><p style={{ fontSize: fs(1.0), fontWeight: 600, margin: 0 }}>{r.name}</p><p style={{ fontSize: fs(0.91), fontStyle: 'italic', color: '#999', margin: 0 }}>{r.position}, {r.company}</p></div>)}</Sec> : null;
          default: return null;
        }
      })}
    </div>
  );
}

function Sec({ title, c, sp = 16, bf = 11, headerStyle = 'uppercase-underline' as HeaderStyle, headerLetterSpacing = '3px', children }: { title: string; c: string; sp?: number; bf?: number; headerStyle?: HeaderStyle; headerLetterSpacing?: string; children: React.ReactNode }) {
  const displayText = formatHeaderText(title, headerStyle);
  const showLine = showHeaderUnderline(headerStyle);
  return (
    <section style={{ marginBottom: `${sp}px` }}>
      {/* Centered ornamental divider */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', margin: `4px 0 ${Math.min(sp, 12)}px` }}>
        {showLine && <div style={{ flex: 1, height: '1px', background: '#e5e5e5' }} />}
        <h2 style={{ fontSize: `${(bf * 1.0).toFixed(1)}px`, fontWeight: headerStyle === 'bold-only' ? 700 : 400, letterSpacing: headerLetterSpacing, textTransform: headerStyle.startsWith('uppercase') ? 'uppercase' : 'none', color: c, margin: 0, whiteSpace: 'nowrap' }}>{showLine ? `— ${displayText} —` : displayText}</h2>
        {showLine && <div style={{ flex: 1, height: '1px', background: '#e5e5e5' }} />}
      </div>
      {children}
    </section>
  );
}
