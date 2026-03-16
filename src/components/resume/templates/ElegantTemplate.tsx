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
  const fs = (r: number) => `${(BASE_FONT * r).toFixed(1)}px`;
  const sp = style.sectionSpacing ?? 16;
  const psp = style.paragraphSpacing ?? 4;

  return (
    <div style={{ width: '794px', minHeight: '1123px', padding: `${style.marginTop ?? 52}px ${style.marginRight ?? 64}px ${style.marginBottom ?? 52}px ${style.marginLeft ?? 64}px`, background: '#fff', fontFamily: serif, fontSize: `${BASE_FONT}px`, lineHeight: style.lineHeight ?? 1.65, color: '#2c2c2c' }}>
      {/* ── HEADER — elegant, centered ── */}
      <div style={{ textAlign: 'center', marginBottom: '6px' }}>
        <h1 style={{ fontSize: fs(2.91), fontWeight: 400, letterSpacing: '6px', margin: 0, textTransform: 'uppercase', color: '#222' }}>{pi.firstName} {pi.lastName}</h1>
        {pi.title && <p style={{ fontSize: fs(1.18), fontWeight: 400, fontStyle: 'italic', color: c, marginTop: '6px', letterSpacing: '2px' }}>{pi.title}</p>}
        {/* Ornamental divider */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', margin: '12px 0' }}>
          <div style={{ width: '60px', height: '1px', background: '#d4d4d4' }} />
          <span style={{ fontSize: fs(1.27), color: c }}>◆</span>
          <div style={{ width: '60px', height: '1px', background: '#d4d4d4' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '6px', fontSize: fs(0.91), color: '#888' }}>
          {[pi.email, pi.phone, pi.location, pi.linkedin, pi.github, pi.website].filter(Boolean).map((info, i, arr) => (
            <span key={i}>{info}{i < arr.length - 1 ? <span style={{ margin: '0 4px', color: '#d4d4d4' }}>|</span> : ''}</span>
          ))}
        </div>
      </div>

      {/* ── SECTIONS ── */}
      {order.map((key) => {
        switch (key) {
          case 'summary': return summary ? <Sec key={key} title="Profile" c={c} sp={sp} bf={BASE_FONT}><p style={{ fontSize: fs(1.0), lineHeight: '1.85', color: '#555', textAlign: 'justify', fontStyle: 'italic' }}>{summary}</p></Sec> : null;
          case 'experience': return experience.length > 0 ? <Sec key={key} title="Experience" c={c} sp={sp} bf={BASE_FONT}>{experience.map((e, i) => (
            <div key={e.id} style={{ marginTop: i > 0 ? '18px' : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <h3 style={{ fontSize: fs(1.18), fontWeight: 700, margin: 0, color: '#222' }}>{e.position}</h3>
                  <p style={{ fontSize: fs(1.05), fontStyle: 'italic', color: c, margin: '1px 0 0' }}>{e.company}{e.location ? `, ${e.location}` : ''}</p>
                </div>
                <span style={{ fontSize: fs(0.91), color: '#aaa', flexShrink: 0, fontStyle: 'italic' }}>{formatDateRange(e.startDate, e.endDate, e.current)}</span>
              </div>
              {e.highlights.filter(Boolean).length > 0 && <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>{e.highlights.filter(Boolean).map((h, j) => (
                <li key={j} style={{ fontSize: fs(0.95), color: '#555', marginTop: `${psp}px`, lineHeight: '1.6' }}>{h}</li>
              ))}</ul>}
            </div>
          ))}</Sec> : null;
          case 'education': return education.length > 0 ? <Sec key={key} title="Education" c={c} sp={sp} bf={BASE_FONT}>{education.map(e => (
            <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
              <div><span style={{ fontWeight: 700, fontSize: fs(1.09) }}>{e.degree}{e.field ? ` in ${e.field}` : ''}</span><span style={{ fontStyle: 'italic', color: '#888', marginLeft: '4px' }}>— {e.institution}</span>{e.gpa && <span style={{ color: '#aaa' }}> (GPA: {e.gpa})</span>}</div>
              <span style={{ fontSize: fs(0.91), color: '#aaa', fontStyle: 'italic', flexShrink: 0 }}>{formatDateRange(e.startDate, e.endDate, false)}</span>
            </div>
          ))}</Sec> : null;
          case 'skills': return skills.length > 0 ? <Sec key={key} title="Expertise" c={c} sp={sp} bf={BASE_FONT}>
            {skills.map(s => <div key={s.id} style={{ marginBottom: '6px' }}>
              <span style={{ fontWeight: 700, fontSize: fs(0.95), color: '#444' }}>{s.category}: </span>
              <span style={{ fontSize: fs(0.95), color: '#666', fontStyle: 'italic' }}>{s.items.join(' · ')}</span>
            </div>)}
          </Sec> : null;
          case 'projects': return projects.length > 0 ? <Sec key={key} title="Notable Projects" c={c} sp={sp} bf={BASE_FONT}>{projects.map((p, i) => (
            <div key={p.id} style={{ marginTop: i > 0 ? '10px' : 0 }}>
              <span style={{ fontWeight: 700, fontSize: fs(1.09) }}>{p.name}</span>
              {p.url && <span style={{ fontSize: fs(0.86), color: c, fontStyle: 'italic', marginLeft: '8px' }}>{p.url}</span>}
              {p.description && <p style={{ fontSize: fs(0.95), color: '#777', fontStyle: 'italic', margin: '2px 0 0' }}>{p.description}</p>}
              {p.technologies.length > 0 && <p style={{ fontSize: fs(0.86), color: '#999', margin: '2px 0 0' }}>{p.technologies.join(' · ')}</p>}
            </div>
          ))}</Sec> : null;
          case 'certifications': return certifications.length > 0 ? <Sec key={key} title="Certifications" c={c} sp={sp} bf={BASE_FONT}>{certifications.map(cert => <p key={cert.id} style={{ fontSize: fs(0.95), margin: '3px 0' }}>{cert.name} — <em>{cert.issuer}, {formatDate(cert.date)}</em></p>)}</Sec> : null;
          case 'languages': return languages.length > 0 ? <Sec key={key} title="Languages" c={c} sp={sp} bf={BASE_FONT}><p style={{ fontSize: fs(0.95), fontStyle: 'italic', color: '#666' }}>{languages.map(l => `${l.language} (${l.proficiency})`).join(' · ')}</p></Sec> : null;
          case 'awards': return awards.length > 0 ? <Sec key={key} title="Distinctions" c={c} sp={sp} bf={BASE_FONT}>{awards.map(a => <p key={a.id} style={{ fontSize: fs(0.95), margin: '3px 0' }}>{a.title}{a.issuer ? ` — ${a.issuer}` : ''}{a.date ? `, ${formatDate(a.date)}` : ''}</p>)}</Sec> : null;
          case 'volunteering': return volunteering.length > 0 ? <Sec key={key} title="Service" c={c} sp={sp} bf={BASE_FONT}>{volunteering.map(v => <p key={v.id} style={{ fontSize: fs(0.95), margin: '3px 0' }}><em>{v.role}</em> — {v.organization}, {formatDateRange(v.startDate, v.endDate, v.current)}</p>)}</Sec> : null;
          case 'publications': return publications.length > 0 ? <Sec key={key} title="Publications" c={c} sp={sp} bf={BASE_FONT}>{publications.map(p => <p key={p.id} style={{ fontSize: fs(0.95), fontStyle: 'italic', margin: '3px 0' }}>{p.title} — {p.publisher}, {formatDate(p.date)}</p>)}</Sec> : null;
          case 'references': return references.length > 0 ? <Sec key={key} title="References" c={c} sp={sp} bf={BASE_FONT}>{references.map(r => <div key={r.id} style={{ marginBottom: '6px' }}><p style={{ fontSize: fs(1.0), fontWeight: 600, margin: 0 }}>{r.name}</p><p style={{ fontSize: fs(0.91), fontStyle: 'italic', color: '#999', margin: 0 }}>{r.position}, {r.company}</p></div>)}</Sec> : null;
          default: return null;
        }
      })}
    </div>
  );
}

function Sec({ title, c, sp = 16, bf = 11, children }: { title: string; c: string; sp?: number; bf?: number; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: `${sp}px` }}>
      {/* Centered ornamental divider */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', margin: `4px 0 ${Math.min(sp, 12)}px` }}>
        <div style={{ flex: 1, height: '1px', background: '#e5e5e5' }} />
        <h2 style={{ fontSize: `${(bf * 1.0).toFixed(1)}px`, fontWeight: 400, letterSpacing: '3px', textTransform: 'uppercase', color: c, margin: 0, whiteSpace: 'nowrap' }}>— {title} —</h2>
        <div style={{ flex: 1, height: '1px', background: '#e5e5e5' }} />
      </div>
      {children}
    </section>
  );
}
