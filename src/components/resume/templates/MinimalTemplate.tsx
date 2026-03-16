/* ── Minimal Template — Ultra-Clean, Centered ───────────── */
'use client';
import type { ResumeData, ResumeStyle, BulletStyle } from '@/types/resume';
import { BULLET_SYMBOLS, NAME_SIZE_OPTIONS } from '@/types/resume';
import { formatDateRange, formatDate, ensureUrl, isLinkable } from '@/lib/utils';

interface P { data: ResumeData; style: ResumeStyle; }

export default function MinimalTemplate({ data, style }: P) {
  const { personalInfo: pi, summary, experience, education, skills, projects, certifications, languages, awards, volunteering, publications, references } = data;
  const hidden = new Set(style.hiddenSections);
  const order = style.sectionOrder.filter(s => !hidden.has(s));
  const BASE_FONT = style.fontSize === 'small' ? 10 : style.fontSize === 'large' ? 12.5 : 11;
  const fs = (r: number) => `${(BASE_FONT * r).toFixed(1)}px`;
  const sp = style.sectionSpacing ?? 16;
  const psp = style.paragraphSpacing ?? 4;
  const bulletStyle = style.bulletStyle ?? 'disc';
  const nameMultiplier = NAME_SIZE_OPTIONS.find(n => n.id === (style.nameSize ?? 'large'))?.multiplier ?? 2.55;
  const bodyLetterSpacing = `${style.letterSpacing ?? 0}px`;

  const renderBullet = (h: string, j: number) => {
    const sym = BULLET_SYMBOLS[bulletStyle];
    return (
      <li key={j} style={{ fontSize: fs(0.95), color: '#555', marginTop: `${psp}px`, display: bulletStyle === 'none' ? 'list-item' : 'flex', gap: '6px', letterSpacing: bodyLetterSpacing }}>
        {bulletStyle !== 'none' && bulletStyle !== 'disc' && <span style={{ color: '#999', flexShrink: 0 }}>{sym}</span>}
        {bulletStyle === 'disc' && <span style={{ marginTop: '6px', width: '4px', height: '4px', borderRadius: '50%', background: '#999', flexShrink: 0 }} />}
        <span>{h}</span>
      </li>
    );
  };

  return (
    <div style={{ width: '794px', minHeight: '1123px', padding: `${style.marginTop ?? 56}px ${style.marginRight ?? 72}px ${style.marginBottom ?? 56}px ${style.marginLeft ?? 72}px`, background: '#fff', fontFamily: style.fontFamily, fontSize: `${BASE_FONT}px`, lineHeight: style.lineHeight ?? 1.6, color: '#2d2d2d', letterSpacing: bodyLetterSpacing }}>
      {/* ── HEADER — centered, clean ── */}
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <h1 style={{ fontSize: fs(nameMultiplier), fontWeight: 300, letterSpacing: '4px', margin: 0, textTransform: 'uppercase', color: '#111' }}>{pi.firstName} {pi.lastName}</h1>
        {pi.title && <p style={{ fontSize: fs(1.09), fontWeight: 400, color: '#888', letterSpacing: '2px', marginTop: '4px', textTransform: 'uppercase' }}>{pi.title}</p>}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '6px', marginTop: '10px', fontSize: fs(0.91), color: '#666' }}>
          {[pi.email, pi.phone, pi.location, pi.linkedin, pi.github, pi.website].filter(Boolean).map((info, i, arr) => {
            const linkable = isLinkable(info);
            return <span key={i}>{linkable ? <a href={ensureUrl(info)} target={info.includes('@') ? undefined : '_blank'} rel={info.includes('@') ? undefined : 'noopener noreferrer'} style={{ color: 'inherit', textDecoration: 'none' }}>{info}</a> : info}{i < arr.length - 1 ? <span style={{ margin: '0 4px', opacity: 0.3 }}>|</span> : ''}</span>;
          })}
        </div>
      </div>
      <hr style={{ border: 'none', borderTop: '1px solid #e5e5e5', margin: '14px 0 20px' }} />

      {/* ── SECTIONS ── */}
      {order.map((key) => {
        switch (key) {
          case 'summary': return summary ? <Sec key={key} title="Profile" sp={sp} bf={BASE_FONT}><p style={{ fontSize: fs(1.0), lineHeight: '1.8', color: '#555', textAlign: 'center' }}>{summary}</p></Sec> : null;
          case 'experience': return experience.length > 0 ? <Sec key={key} title="Experience" sp={sp} bf={BASE_FONT}>{experience.map((e, i) => (
            <div key={e.id} style={{ marginTop: i > 0 ? '16px' : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div><span style={{ fontWeight: 600, fontSize: fs(1.09) }}>{e.position}</span><span style={{ color: '#999', margin: '0 6px' }}>—</span><span style={{ fontSize: fs(1.0), color: '#666' }}>{e.company}{e.location ? `, ${e.location}` : ''}</span></div>
                <span style={{ fontSize: fs(0.91), color: '#999', flexShrink: 0 }}>{formatDateRange(e.startDate, e.endDate, e.current)}</span>
              </div>
              {e.highlights.filter(Boolean).length > 0 && <ul style={{ margin: '4px 0 0', padding: bulletStyle === 'none' ? '0 0 0 16px' : 0, listStyle: bulletStyle === 'none' ? 'disc' : 'none' }}>{e.highlights.filter(Boolean).map((h, j) => renderBullet(h, j))}</ul>}
            </div>
          ))}</Sec> : null;
          case 'education': return education.length > 0 ? <Sec key={key} title="Education" sp={sp} bf={BASE_FONT}>{education.map((e) => (
            <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              <div><span style={{ fontWeight: 600, fontSize: fs(1.09) }}>{e.degree}{e.field ? ` in ${e.field}` : ''}</span><span style={{ color: '#999', margin: '0 6px' }}>—</span><span style={{ color: '#666' }}>{e.institution}</span>{e.gpa && <span style={{ color: '#999' }}> (GPA: {e.gpa})</span>}</div>
              <span style={{ fontSize: fs(0.91), color: '#999', flexShrink: 0 }}>{formatDateRange(e.startDate, e.endDate, false)}</span>
            </div>
          ))}</Sec> : null;
          case 'skills': return skills.length > 0 ? <Sec key={key} title="Skills" sp={sp} bf={BASE_FONT}><div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>{skills.map(s => s.items.map((item, j) => <span key={`${s.id}-${j}`} style={{ fontSize: fs(0.91), color: '#555' }}>{item}{j < s.items.length - 1 || skills.indexOf(s) < skills.length - 1 ? <span style={{ margin: '0 4px', opacity: 0.3 }}>·</span> : ''}</span>))}</div></Sec> : null;
          case 'projects': return projects.length > 0 ? <Sec key={key} title="Projects" sp={sp} bf={BASE_FONT}>{projects.map((p, i) => (
            <div key={p.id} style={{ marginTop: i > 0 ? '10px' : 0 }}>
              <span style={{ fontWeight: 600, fontSize: fs(1.05) }}>{p.name}</span>{p.url && <a href={ensureUrl(p.url)} target="_blank" rel="noopener noreferrer" style={{ fontSize: fs(0.86), color: '#999', marginLeft: '8px', textDecoration: 'none' }}>{p.url}</a>}
              {p.description && <p style={{ fontSize: fs(0.95), color: '#666', margin: '2px 0 0' }}>{p.description}</p>}
              {p.technologies.length > 0 && <p style={{ fontSize: fs(0.86), color: '#999', margin: '2px 0 0' }}>Tech: {p.technologies.join(', ')}</p>}
            </div>
          ))}</Sec> : null;
          case 'certifications': return certifications.length > 0 ? <Sec key={key} title="Certifications" sp={sp} bf={BASE_FONT}>{certifications.map((cert) => (
            <p key={cert.id} style={{ fontSize: fs(0.95), margin: '3px 0' }}>{cert.name}<span style={{ color: '#999' }}> — {cert.issuer}, {formatDate(cert.date)}</span></p>
          ))}</Sec> : null;
          case 'languages': return languages.length > 0 ? <Sec key={key} title="Languages" sp={sp} bf={BASE_FONT}><p style={{ fontSize: fs(0.95), color: '#555' }}>{languages.map(l => `${l.language} (${l.proficiency})`).join(' · ')}</p></Sec> : null;
          case 'awards': return awards.length > 0 ? <Sec key={key} title="Awards" sp={sp} bf={BASE_FONT}>{awards.map(a => <p key={a.id} style={{ fontSize: fs(0.95), margin: '3px 0' }}>{a.title}{a.issuer ? ` — ${a.issuer}` : ''}{a.date ? `, ${formatDate(a.date)}` : ''}</p>)}</Sec> : null;
          case 'volunteering': return volunteering.length > 0 ? <Sec key={key} title="Volunteering" sp={sp} bf={BASE_FONT}>{volunteering.map(v => <p key={v.id} style={{ fontSize: fs(0.95), margin: '3px 0' }}><strong>{v.role}</strong> — {v.organization}, {formatDateRange(v.startDate, v.endDate, v.current)}</p>)}</Sec> : null;
          case 'publications': return publications.length > 0 ? <Sec key={key} title="Publications" sp={sp} bf={BASE_FONT}>{publications.map(p => <p key={p.id} style={{ fontSize: fs(0.95), margin: '3px 0' }}><em>{p.title}</em> — {p.publisher}, {formatDate(p.date)}</p>)}</Sec> : null;
          case 'references': return references.length > 0 ? <Sec key={key} title="References" sp={sp} bf={BASE_FONT}>{references.map(r => <p key={r.id} style={{ fontSize: fs(0.95), margin: '3px 0' }}>{r.name}, {r.position} at {r.company}</p>)}</Sec> : null;
          default: return null;
        }
      })}
    </div>
  );
}

function Sec({ title, sp = 16, bf = 11, children }: { title: string; sp?: number; bf?: number; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: `${sp}px` }}>
      <div style={{ textAlign: 'center', margin: `0 0 ${Math.min(sp, 12)}px` }}>
        <span style={{ fontSize: `${(bf * 0.91).toFixed(1)}px`, fontWeight: 500, letterSpacing: '3px', textTransform: 'uppercase', color: '#999' }}>— {title} —</span>
      </div>
      {children}
    </section>
  );
}
