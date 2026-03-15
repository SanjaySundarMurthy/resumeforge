/* ── Minimal Template — Ultra-Clean, Centered ───────────── */
'use client';
import type { ResumeData, ResumeStyle } from '@/types/resume';
import { formatDateRange, formatDate } from '@/lib/utils';

interface P { data: ResumeData; style: ResumeStyle; }

export default function MinimalTemplate({ data, style }: P) {
  const { personalInfo: pi, summary, experience, education, skills, projects, certifications, languages, awards, volunteering, publications, references } = data;
  const hidden = new Set(style.hiddenSections);
  const order = style.sectionOrder.filter(s => !hidden.has(s));
  const BASE_FONT = style.fontSize === 'small' ? 10 : style.fontSize === 'large' ? 12.5 : 11;

  return (
    <div style={{ width: '794px', minHeight: '1123px', padding: `${style.marginTop ?? 56}px ${style.marginRight ?? 72}px ${style.marginBottom ?? 56}px ${style.marginLeft ?? 72}px`, background: '#fff', fontFamily: style.fontFamily, fontSize: `${BASE_FONT}px`, lineHeight: style.lineHeight ?? 1.6, color: '#2d2d2d' }}>
      {/* ── HEADER — centered, clean ── */}
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 300, letterSpacing: '4px', margin: 0, textTransform: 'uppercase', color: '#111' }}>{pi.firstName} {pi.lastName}</h1>
        {pi.title && <p style={{ fontSize: '12px', fontWeight: 400, color: '#888', letterSpacing: '2px', marginTop: '4px', textTransform: 'uppercase' }}>{pi.title}</p>}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '6px', marginTop: '10px', fontSize: '10px', color: '#666' }}>
          {[pi.email, pi.phone, pi.location, pi.linkedin, pi.github, pi.website].filter(Boolean).map((info, i, arr) => (
            <span key={i}>{info}{i < arr.length - 1 ? <span style={{ margin: '0 4px', opacity: 0.3 }}>|</span> : ''}</span>
          ))}
        </div>
      </div>
      <hr style={{ border: 'none', borderTop: '1px solid #e5e5e5', margin: '14px 0 20px' }} />

      {/* ── SECTIONS ── */}
      {order.map((key) => {
        switch (key) {
          case 'summary': return summary ? <Sec key={key} title="Profile"><p style={{ fontSize: '11px', lineHeight: '1.8', color: '#555', textAlign: 'center' }}>{summary}</p></Sec> : null;
          case 'experience': return experience.length > 0 ? <Sec key={key} title="Experience">{experience.map((e, i) => (
            <div key={e.id} style={{ marginTop: i > 0 ? '16px' : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div><span style={{ fontWeight: 600, fontSize: '12px' }}>{e.position}</span><span style={{ color: '#999', margin: '0 6px' }}>—</span><span style={{ fontSize: '11px', color: '#666' }}>{e.company}{e.location ? `, ${e.location}` : ''}</span></div>
                <span style={{ fontSize: '10px', color: '#999', flexShrink: 0 }}>{formatDateRange(e.startDate, e.endDate, e.current)}</span>
              </div>
              {e.highlights.filter(Boolean).length > 0 && <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>{e.highlights.filter(Boolean).map((h, j) => (
                <li key={j} style={{ fontSize: '10.5px', color: '#555', marginTop: '2px' }}>{h}</li>
              ))}</ul>}
            </div>
          ))}</Sec> : null;
          case 'education': return education.length > 0 ? <Sec key={key} title="Education">{education.map((e) => (
            <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              <div><span style={{ fontWeight: 600, fontSize: '12px' }}>{e.degree}{e.field ? ` in ${e.field}` : ''}</span><span style={{ color: '#999', margin: '0 6px' }}>—</span><span style={{ color: '#666' }}>{e.institution}</span>{e.gpa && <span style={{ color: '#999' }}> (GPA: {e.gpa})</span>}</div>
              <span style={{ fontSize: '10px', color: '#999', flexShrink: 0 }}>{formatDateRange(e.startDate, e.endDate, false)}</span>
            </div>
          ))}</Sec> : null;
          case 'skills': return skills.length > 0 ? <Sec key={key} title="Skills"><div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>{skills.map(s => s.items.map((item, j) => <span key={`${s.id}-${j}`} style={{ fontSize: '10px', color: '#555' }}>{item}{j < s.items.length - 1 || skills.indexOf(s) < skills.length - 1 ? <span style={{ margin: '0 4px', opacity: 0.3 }}>·</span> : ''}</span>))}</div></Sec> : null;
          case 'projects': return projects.length > 0 ? <Sec key={key} title="Projects">{projects.map((p, i) => (
            <div key={p.id} style={{ marginTop: i > 0 ? '10px' : 0 }}>
              <span style={{ fontWeight: 600, fontSize: '11.5px' }}>{p.name}</span>{p.url && <span style={{ fontSize: '9.5px', color: '#999', marginLeft: '8px' }}>{p.url}</span>}
              {p.description && <p style={{ fontSize: '10.5px', color: '#666', margin: '2px 0 0' }}>{p.description}</p>}
              {p.technologies.length > 0 && <p style={{ fontSize: '9.5px', color: '#999', margin: '2px 0 0' }}>Tech: {p.technologies.join(', ')}</p>}
            </div>
          ))}</Sec> : null;
          case 'certifications': return certifications.length > 0 ? <Sec key={key} title="Certifications">{certifications.map((cert) => (
            <p key={cert.id} style={{ fontSize: '10.5px', margin: '3px 0' }}>{cert.name}<span style={{ color: '#999' }}> — {cert.issuer}, {formatDate(cert.date)}</span></p>
          ))}</Sec> : null;
          case 'languages': return languages.length > 0 ? <Sec key={key} title="Languages"><p style={{ fontSize: '10.5px', color: '#555' }}>{languages.map(l => `${l.language} (${l.proficiency})`).join(' · ')}</p></Sec> : null;
          case 'awards': return awards.length > 0 ? <Sec key={key} title="Awards">{awards.map(a => <p key={a.id} style={{ fontSize: '10.5px', margin: '3px 0' }}>{a.title}{a.issuer ? ` — ${a.issuer}` : ''}{a.date ? `, ${formatDate(a.date)}` : ''}</p>)}</Sec> : null;
          case 'volunteering': return volunteering.length > 0 ? <Sec key={key} title="Volunteering">{volunteering.map(v => <p key={v.id} style={{ fontSize: '10.5px', margin: '3px 0' }}><strong>{v.role}</strong> — {v.organization}, {formatDateRange(v.startDate, v.endDate, v.current)}</p>)}</Sec> : null;
          case 'publications': return publications.length > 0 ? <Sec key={key} title="Publications">{publications.map(p => <p key={p.id} style={{ fontSize: '10.5px', margin: '3px 0' }}><em>{p.title}</em> — {p.publisher}, {formatDate(p.date)}</p>)}</Sec> : null;
          case 'references': return references.length > 0 ? <Sec key={key} title="References">{references.map(r => <p key={r.id} style={{ fontSize: '10.5px', margin: '3px 0' }}>{r.name}, {r.position} at {r.company}</p>)}</Sec> : null;
          default: return null;
        }
      })}
    </div>
  );
}

function Sec({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '18px' }}>
      <div style={{ textAlign: 'center', margin: '0 0 10px' }}>
        <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '3px', textTransform: 'uppercase', color: '#999' }}>— {title} —</span>
      </div>
      {children}
    </section>
  );
}
