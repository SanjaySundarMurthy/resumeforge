/* ── Bold Template — Big Name, Thick Bars, Chunky Badges ── */
'use client';
import type { ResumeData, ResumeStyle } from '@/types/resume';
import { formatDateRange, formatDate } from '@/lib/utils';

interface P { data: ResumeData; style: ResumeStyle; }

export default function BoldTemplate({ data, style }: P) {
  const { personalInfo: pi, summary, experience, education, skills, projects, certifications, languages, awards, volunteering, publications, references } = data;
  const c = style.primaryColor;
  const hidden = new Set(style.hiddenSections);
  const order = style.sectionOrder.filter(s => !hidden.has(s));
  const BASE_FONT = style.fontSize === 'small' ? 10 : style.fontSize === 'large' ? 12.5 : 11;

  return (
    <div style={{ width: '794px', minHeight: '1123px', background: '#fff', fontFamily: style.fontFamily, fontSize: `${BASE_FONT}px`, lineHeight: style.lineHeight ?? 1.55, color: '#1a1a1a' }}>
      {/* ── HEADER — Bold split name ── */}
      <div style={{ padding: '40px 48px 28px', borderBottom: `6px solid ${c}` }}>
        <h1 style={{ fontSize: '42px', fontWeight: 900, margin: 0, lineHeight: 1 }}>
          <span style={{ color: '#111' }}>{pi.firstName}</span>{' '}
          <span style={{ color: c }}>{pi.lastName}</span>
        </h1>
        {pi.title && <p style={{ fontSize: '16px', fontWeight: 600, color: '#6b7280', marginTop: '6px', letterSpacing: '1px', textTransform: 'uppercase' }}>{pi.title}</p>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
          {[pi.email, pi.phone, pi.location, pi.linkedin, pi.github, pi.website].filter(Boolean).map((info, i) => (
            <span key={i} style={{ fontSize: '10px', padding: '4px 12px', background: '#f3f4f6', borderRadius: '20px', color: '#555' }}>{info}</span>
          ))}
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ padding: `24px ${style.marginLeft ?? 48}px` }}>
        {order.map((key) => {
          switch (key) {
            case 'summary': return summary ? <Sec key={key} title="ABOUT ME" c={c}><p style={{ fontSize: '11.5px', lineHeight: '1.75', color: '#555', borderLeft: `4px solid ${c}20`, paddingLeft: '14px' }}>{summary}</p></Sec> : null;
            case 'experience': return experience.length > 0 ? <Sec key={key} title="WORK EXPERIENCE" c={c}>{experience.map((e, i) => (
              <div key={e.id} style={{ marginTop: i > 0 ? '16px' : 0, paddingTop: i > 0 ? '16px' : 0, borderTop: i > 0 ? '2px solid #f3f4f6' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#111', margin: 0 }}>{e.position}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: c }}>{e.company}</span>
                      {e.location && <span style={{ fontSize: '10px', color: '#9ca3af' }}>• {e.location}</span>}
                    </div>
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#fff', padding: '4px 12px', background: c, borderRadius: '4px', flexShrink: 0 }}>{formatDateRange(e.startDate, e.endDate, e.current)}</span>
                </div>
                {e.highlights.filter(Boolean).length > 0 && <ul style={{ margin: '8px 0 0 0', padding: 0, listStyle: 'none' }}>{e.highlights.filter(Boolean).map((h, j) => (
                  <li key={j} style={{ fontSize: '10.5px', color: '#4b5563', paddingLeft: '16px', position: 'relative', marginTop: '4px' }}>
                    <span style={{ position: 'absolute', left: 0, top: '3px', width: '8px', height: '8px', background: `${c}20`, borderRadius: '2px' }} />{h}
                  </li>
                ))}</ul>}
              </div>
            ))}</Sec> : null;
            case 'education': return education.length > 0 ? <Sec key={key} title="EDUCATION" c={c}>{education.map(e => (
              <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '13px', fontWeight: 800, margin: 0 }}>{e.degree}{e.field ? ` in ${e.field}` : ''}</h3>
                  <p style={{ fontSize: '11px', color: c, fontWeight: 700, margin: 0 }}>{e.institution}</p>
                  {e.gpa && <p style={{ fontSize: '10px', color: '#9ca3af', margin: 0 }}>GPA: {e.gpa}</p>}
                </div>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#fff', padding: '4px 12px', background: c, borderRadius: '4px', flexShrink: 0 }}>{formatDateRange(e.startDate, e.endDate, false)}</span>
              </div>
            ))}</Sec> : null;
            case 'skills': return skills.length > 0 ? <Sec key={key} title="SKILLS" c={c}>{skills.map(s => (
              <div key={s.id} style={{ marginBottom: '10px' }}>
                <p style={{ fontSize: '10px', fontWeight: 800, color: '#666', letterSpacing: '1px', marginBottom: '5px', textTransform: 'uppercase' }}>{s.category}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>{s.items.map((item, j) => (
                  <span key={j} style={{ fontSize: '10px', fontWeight: 600, padding: '4px 12px', background: c, color: '#fff', borderRadius: '4px' }}>{item}</span>
                ))}</div>
              </div>
            ))}</Sec> : null;
            case 'projects': return projects.length > 0 ? <Sec key={key} title="PROJECTS" c={c}>{projects.map((p, i) => (
              <div key={p.id} style={{ marginTop: i > 0 ? '12px' : 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontWeight: 800, fontSize: '12px' }}>{p.name}</span>
                  {p.url && <span style={{ fontSize: '9px', color: c, fontWeight: 600 }}>{p.url}</span>}
                </div>
                {p.description && <p style={{ fontSize: '10.5px', color: '#6b7280', margin: '2px 0' }}>{p.description}</p>}
                {p.technologies.length > 0 && <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>{p.technologies.map((t, j) => <span key={j} style={{ fontSize: '9px', fontWeight: 600, padding: '3px 8px', border: `2px solid ${c}`, color: c, borderRadius: '4px' }}>{t}</span>)}</div>}
              </div>
            ))}</Sec> : null;
            case 'certifications': return certifications.length > 0 ? <Sec key={key} title="CERTIFICATIONS" c={c}>{certifications.map(cert => (
              <div key={cert.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div style={{ width: '6px', height: '6px', background: c, borderRadius: '1px', flexShrink: 0 }} />
                <span style={{ fontSize: '11px', fontWeight: 700 }}>{cert.name}</span>
                <span style={{ fontSize: '10px', color: '#9ca3af' }}>— {cert.issuer}, {formatDate(cert.date)}</span>
              </div>
            ))}</Sec> : null;
            case 'languages': return languages.length > 0 ? <Sec key={key} title="LANGUAGES" c={c}><div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>{languages.map(l => (
              <span key={l.id} style={{ fontSize: '10.5px', padding: '4px 14px', background: '#f3f4f6', borderRadius: '20px', fontWeight: 600 }}>{l.language} <span style={{ color: '#9ca3af', fontWeight: 400 }}>({l.proficiency})</span></span>
            ))}</div></Sec> : null;
            case 'awards': return awards.length > 0 ? <Sec key={key} title="AWARDS" c={c}>{awards.map(a => <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}><div style={{ width: '6px', height: '6px', background: c, borderRadius: '1px' }} /><span style={{ fontSize: '10.5px' }}><strong>{a.title}</strong>{a.issuer ? ` — ${a.issuer}` : ''}</span></div>)}</Sec> : null;
            case 'volunteering': return volunteering.length > 0 ? <Sec key={key} title="VOLUNTEERING" c={c}>{volunteering.map(v => <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', margin: '4px 0' }}><span><strong>{v.role}</strong> — {v.organization}</span><span style={{ color: '#9ca3af', fontWeight: 600 }}>{formatDateRange(v.startDate, v.endDate, v.current)}</span></div>)}</Sec> : null;
            case 'publications': return publications.length > 0 ? <Sec key={key} title="PUBLICATIONS" c={c}>{publications.map(p => <p key={p.id} style={{ fontSize: '10.5px', margin: '3px 0' }}><strong>{p.title}</strong> — {p.publisher}, {formatDate(p.date)}</p>)}</Sec> : null;
            case 'references': return references.length > 0 ? <Sec key={key} title="REFERENCES" c={c}>{references.map(r => <div key={r.id} style={{ marginBottom: '6px' }}><p style={{ fontSize: '11px', fontWeight: 800, margin: 0 }}>{r.name}</p><p style={{ fontSize: '10px', color: '#6b7280', margin: 0 }}>{r.position}, {r.company}</p></div>)}</Sec> : null;
            default: return null;
          }
        })}
      </div>
    </div>
  );
}

function Sec({ title, c, children }: { title: string; c: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '22px' }}>
      <div style={{ marginBottom: '10px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 900, letterSpacing: '2px', color: '#111', margin: 0, display: 'inline-block' }}>{title}</h2>
        <div style={{ height: '4px', background: c, marginTop: '4px', borderRadius: '2px' }} />
      </div>
      {children}
    </section>
  );
}
