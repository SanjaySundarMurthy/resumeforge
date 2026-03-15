/* ── Elegant Template — Serif, Centered Dividers, Italic ── */
'use client';
import type { ResumeData, ResumeStyle } from '@/types/resume';
import { formatDateRange, formatDate } from '@/lib/utils';

interface P { data: ResumeData; style: ResumeStyle; }

export default function ElegantTemplate({ data, style }: P) {
  const { personalInfo: pi, summary, experience, education, skills, projects, certifications, languages, awards, volunteering, publications, references } = data;
  const c = style.primaryColor;
  const hidden = new Set(style.hiddenSections);
  const order = style.sectionOrder.filter(s => !hidden.has(s));
  const serif = `'Georgia', 'Playfair Display', ${style.fontFamily}, serif`;
  const BASE_FONT = style.fontSize === 'small' ? 10 : style.fontSize === 'large' ? 12.5 : 11;

  return (
    <div style={{ width: '794px', minHeight: '1123px', padding: `${style.marginTop ?? 52}px ${style.marginRight ?? 64}px ${style.marginBottom ?? 52}px ${style.marginLeft ?? 64}px`, background: '#fff', fontFamily: serif, fontSize: `${BASE_FONT}px`, lineHeight: style.lineHeight ?? 1.65, color: '#2c2c2c' }}>
      {/* ── HEADER — elegant, centered ── */}
      <div style={{ textAlign: 'center', marginBottom: '6px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 400, letterSpacing: '6px', margin: 0, textTransform: 'uppercase', color: '#222' }}>{pi.firstName} {pi.lastName}</h1>
        {pi.title && <p style={{ fontSize: '13px', fontWeight: 400, fontStyle: 'italic', color: c, marginTop: '6px', letterSpacing: '2px' }}>{pi.title}</p>}
        {/* Ornamental divider */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', margin: '12px 0' }}>
          <div style={{ width: '60px', height: '1px', background: '#d4d4d4' }} />
          <span style={{ fontSize: '14px', color: c }}>◆</span>
          <div style={{ width: '60px', height: '1px', background: '#d4d4d4' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '6px', fontSize: '10px', color: '#888' }}>
          {[pi.email, pi.phone, pi.location, pi.linkedin, pi.github, pi.website].filter(Boolean).map((info, i, arr) => (
            <span key={i}>{info}{i < arr.length - 1 ? <span style={{ margin: '0 4px', color: '#d4d4d4' }}>|</span> : ''}</span>
          ))}
        </div>
      </div>

      {/* ── SECTIONS ── */}
      {order.map((key) => {
        switch (key) {
          case 'summary': return summary ? <Sec key={key} title="Profile" c={c}><p style={{ fontSize: '11px', lineHeight: '1.85', color: '#555', textAlign: 'justify', fontStyle: 'italic' }}>{summary}</p></Sec> : null;
          case 'experience': return experience.length > 0 ? <Sec key={key} title="Experience" c={c}>{experience.map((e, i) => (
            <div key={e.id} style={{ marginTop: i > 0 ? '18px' : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <h3 style={{ fontSize: '13px', fontWeight: 700, margin: 0, color: '#222' }}>{e.position}</h3>
                  <p style={{ fontSize: '11.5px', fontStyle: 'italic', color: c, margin: '1px 0 0' }}>{e.company}{e.location ? `, ${e.location}` : ''}</p>
                </div>
                <span style={{ fontSize: '10px', color: '#aaa', flexShrink: 0, fontStyle: 'italic' }}>{formatDateRange(e.startDate, e.endDate, e.current)}</span>
              </div>
              {e.highlights.filter(Boolean).length > 0 && <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>{e.highlights.filter(Boolean).map((h, j) => (
                <li key={j} style={{ fontSize: '10.5px', color: '#555', marginTop: '3px', lineHeight: '1.6' }}>{h}</li>
              ))}</ul>}
            </div>
          ))}</Sec> : null;
          case 'education': return education.length > 0 ? <Sec key={key} title="Education" c={c}>{education.map(e => (
            <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
              <div><span style={{ fontWeight: 700, fontSize: '12px' }}>{e.degree}{e.field ? ` in ${e.field}` : ''}</span><span style={{ fontStyle: 'italic', color: '#888', marginLeft: '4px' }}>— {e.institution}</span>{e.gpa && <span style={{ color: '#aaa' }}> (GPA: {e.gpa})</span>}</div>
              <span style={{ fontSize: '10px', color: '#aaa', fontStyle: 'italic', flexShrink: 0 }}>{formatDateRange(e.startDate, e.endDate, false)}</span>
            </div>
          ))}</Sec> : null;
          case 'skills': return skills.length > 0 ? <Sec key={key} title="Expertise" c={c}>
            {skills.map(s => <div key={s.id} style={{ marginBottom: '6px' }}>
              <span style={{ fontWeight: 700, fontSize: '10.5px', color: '#444' }}>{s.category}: </span>
              <span style={{ fontSize: '10.5px', color: '#666', fontStyle: 'italic' }}>{s.items.join(' · ')}</span>
            </div>)}
          </Sec> : null;
          case 'projects': return projects.length > 0 ? <Sec key={key} title="Notable Projects" c={c}>{projects.map((p, i) => (
            <div key={p.id} style={{ marginTop: i > 0 ? '10px' : 0 }}>
              <span style={{ fontWeight: 700, fontSize: '12px' }}>{p.name}</span>
              {p.url && <span style={{ fontSize: '9.5px', color: c, fontStyle: 'italic', marginLeft: '8px' }}>{p.url}</span>}
              {p.description && <p style={{ fontSize: '10.5px', color: '#777', fontStyle: 'italic', margin: '2px 0 0' }}>{p.description}</p>}
              {p.technologies.length > 0 && <p style={{ fontSize: '9.5px', color: '#999', margin: '2px 0 0' }}>{p.technologies.join(' · ')}</p>}
            </div>
          ))}</Sec> : null;
          case 'certifications': return certifications.length > 0 ? <Sec key={key} title="Certifications" c={c}>{certifications.map(cert => <p key={cert.id} style={{ fontSize: '10.5px', margin: '3px 0' }}>{cert.name} — <em>{cert.issuer}, {formatDate(cert.date)}</em></p>)}</Sec> : null;
          case 'languages': return languages.length > 0 ? <Sec key={key} title="Languages" c={c}><p style={{ fontSize: '10.5px', fontStyle: 'italic', color: '#666' }}>{languages.map(l => `${l.language} (${l.proficiency})`).join(' · ')}</p></Sec> : null;
          case 'awards': return awards.length > 0 ? <Sec key={key} title="Distinctions" c={c}>{awards.map(a => <p key={a.id} style={{ fontSize: '10.5px', margin: '3px 0' }}>{a.title}{a.issuer ? ` — ${a.issuer}` : ''}{a.date ? `, ${formatDate(a.date)}` : ''}</p>)}</Sec> : null;
          case 'volunteering': return volunteering.length > 0 ? <Sec key={key} title="Service" c={c}>{volunteering.map(v => <p key={v.id} style={{ fontSize: '10.5px', margin: '3px 0' }}><em>{v.role}</em> — {v.organization}, {formatDateRange(v.startDate, v.endDate, v.current)}</p>)}</Sec> : null;
          case 'publications': return publications.length > 0 ? <Sec key={key} title="Publications" c={c}>{publications.map(p => <p key={p.id} style={{ fontSize: '10.5px', fontStyle: 'italic', margin: '3px 0' }}>{p.title} — {p.publisher}, {formatDate(p.date)}</p>)}</Sec> : null;
          case 'references': return references.length > 0 ? <Sec key={key} title="References" c={c}>{references.map(r => <div key={r.id} style={{ marginBottom: '6px' }}><p style={{ fontSize: '11px', fontWeight: 600, margin: 0 }}>{r.name}</p><p style={{ fontSize: '10px', fontStyle: 'italic', color: '#999', margin: 0 }}>{r.position}, {r.company}</p></div>)}</Sec> : null;
          default: return null;
        }
      })}
    </div>
  );
}

function Sec({ title, c, children }: { title: string; c: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '20px' }}>
      {/* Centered ornamental divider */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', margin: '4px 0 12px' }}>
        <div style={{ flex: 1, height: '1px', background: '#e5e5e5' }} />
        <h2 style={{ fontSize: '11px', fontWeight: 400, letterSpacing: '3px', textTransform: 'uppercase', color: c, margin: 0, whiteSpace: 'nowrap' }}>— {title} —</h2>
        <div style={{ flex: 1, height: '1px', background: '#e5e5e5' }} />
      </div>
      {children}
    </section>
  );
}
