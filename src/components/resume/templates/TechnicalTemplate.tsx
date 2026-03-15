/* ── Technical Template — Terminal / Code Aesthetic ──────── */
'use client';
import type { ResumeData, ResumeStyle } from '@/types/resume';
import { formatDateRange, formatDate } from '@/lib/utils';

interface P { data: ResumeData; style: ResumeStyle; }

export default function TechnicalTemplate({ data, style }: P) {
  const { personalInfo: pi, summary, experience, education, skills, projects, certifications, languages, awards, volunteering, publications, references } = data;
  const c = style.primaryColor;
  const hidden = new Set(style.hiddenSections);
  const order = style.sectionOrder.filter(s => !hidden.has(s));

  const mono = `'Consolas', 'Fira Code', ${style.fontFamily}, monospace`;

  return (
    <div style={{ width: '794px', minHeight: '1123px', background: '#fff', fontFamily: style.fontFamily, fontSize: '11px', lineHeight: '1.55', color: '#1f2937' }}>
      {/* ── HEADER — Dark terminal-style ── */}
      <div style={{ background: '#1e1e2e', color: '#cdd6f4', padding: '32px 48px', position: 'relative' }}>
        {/* Fake terminal dots */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f38ba8' }} />
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f9e2af' }} />
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#a6e3a1' }} />
        </div>
        <p style={{ fontFamily: mono, fontSize: '11px', color: '#6c7086', margin: '0 0 4px' }}>
          <span style={{ color: '#a6e3a1' }}>$</span> cat resume.json | jq &apos;.personal&apos;
        </p>
        <h1 style={{ fontSize: '26px', fontWeight: 700, margin: 0, color: '#cdd6f4', fontFamily: mono }}>
          {pi.firstName} {pi.lastName}
        </h1>
        {pi.title && <p style={{ fontSize: '13px', color: c, fontFamily: mono, margin: '2px 0 0' }}>{pi.title}</p>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '10px', fontFamily: mono, fontSize: '10px', color: '#a6adc8' }}>
          {pi.email && <span>{pi.email}</span>}
          {pi.phone && <span>{pi.phone}</span>}
          {pi.location && <span>{pi.location}</span>}
          {pi.linkedin && <span>{pi.linkedin}</span>}
          {pi.github && <span>{pi.github}</span>}
          {pi.website && <span>{pi.website}</span>}
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ padding: '28px 48px' }}>
        {order.map((key) => {
          switch (key) {
            case 'summary': return summary ? <Sec key={key} title="about" c={c} mono={mono}><p style={{ fontSize: '11px', lineHeight: '1.7', color: '#6b7280', fontStyle: 'italic' }}>{summary}</p></Sec> : null;
            case 'experience': return experience.length > 0 ? <Sec key={key} title="experience" c={c} mono={mono}>{experience.map((e, i) => (
              <div key={e.id} style={{ marginTop: i > 0 ? '14px' : 0, paddingTop: i > 0 ? '14px' : 0, borderTop: i > 0 ? '1px dashed #e5e7eb' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '12px', fontWeight: 700, margin: 0 }}>{e.position}</h3>
                    <p style={{ fontSize: '11px', fontFamily: mono, color: c, margin: '1px 0 0' }}>{e.company}{e.location ? ` @ ${e.location}` : ''}</p>
                  </div>
                  <span style={{ fontSize: '10px', fontFamily: mono, color: '#9ca3af', padding: '2px 8px', background: '#f9fafb', borderRadius: '3px', border: '1px solid #f3f4f6' }}>{formatDateRange(e.startDate, e.endDate, e.current)}</span>
                </div>
                {e.highlights.filter(Boolean).length > 0 && <ul style={{ margin: '6px 0 0', padding: 0, listStyle: 'none' }}>{e.highlights.filter(Boolean).map((h, j) => (
                  <li key={j} style={{ fontSize: '10.5px', color: '#4b5563', paddingLeft: '18px', position: 'relative', marginTop: '3px', fontFamily: mono }}>
                    <span style={{ position: 'absolute', left: 0, color: '#d1d5db', fontWeight: 700 }}>&gt;</span>{h}
                  </li>
                ))}</ul>}
              </div>
            ))}</Sec> : null;
            case 'education': return education.length > 0 ? <Sec key={key} title="education" c={c} mono={mono}>{education.map(e => (
              <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div><h3 style={{ fontSize: '12px', fontWeight: 700, margin: 0 }}>{e.degree}{e.field ? ` in ${e.field}` : ''}</h3><p style={{ fontSize: '10.5px', color: '#6b7280', margin: 0 }}>{e.institution}{e.gpa ? ` · GPA: ${e.gpa}` : ''}</p></div>
                <span style={{ fontSize: '10px', fontFamily: mono, color: '#9ca3af' }}>{formatDateRange(e.startDate, e.endDate, false)}</span>
              </div>
            ))}</Sec> : null;
            case 'skills': return skills.length > 0 ? <Sec key={key} title="tech_stack" c={c} mono={mono}><div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>{skills.flatMap(s => s.items.map((item, j) => (
              <span key={`${s.id}-${j}`} style={{ fontSize: '10px', fontFamily: mono, padding: '3px 10px', background: '#1e1e2e', color: '#cdd6f4', borderRadius: '4px', fontWeight: 500 }}>{item}</span>
            )))}</div></Sec> : null;
            case 'projects': return projects.length > 0 ? <Sec key={key} title="projects" c={c} mono={mono}>{projects.map((p, i) => (
              <div key={p.id} style={{ marginTop: i > 0 ? '10px' : 0, padding: '8px 12px', background: '#fafafa', borderRadius: '6px', border: '1px solid #f3f4f6' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontWeight: 700, fontSize: '11.5px', fontFamily: mono }}>{p.name}</span>
                  {p.url && <span style={{ fontSize: '9px', color: c, fontFamily: mono }}>{p.url}</span>}
                </div>
                {p.description && <p style={{ fontSize: '10px', color: '#888', margin: '2px 0 0' }}>{p.description}</p>}
                {p.technologies.length > 0 && <p style={{ fontSize: '9px', color: '#aaa', fontFamily: mono, margin: '4px 0 0' }}>deps: [{p.technologies.join(', ')}]</p>}
              </div>
            ))}</Sec> : null;
            case 'certifications': return certifications.length > 0 ? <Sec key={key} title="certifications" c={c} mono={mono}>{certifications.map(cert => <p key={cert.id} style={{ fontSize: '10.5px', margin: '3px 0', fontFamily: mono }}><span style={{ color: c }}>→</span> {cert.name} <span style={{ color: '#aaa' }}>({cert.issuer}, {formatDate(cert.date)})</span></p>)}</Sec> : null;
            case 'languages': return languages.length > 0 ? <Sec key={key} title="languages" c={c} mono={mono}><div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>{languages.map(l => <span key={l.id} style={{ fontSize: '10.5px', fontFamily: mono }}>{l.language}: <span style={{ color: '#9ca3af' }}>{l.proficiency}</span></span>)}</div></Sec> : null;
            case 'awards': return awards.length > 0 ? <Sec key={key} title="awards" c={c} mono={mono}>{awards.map(a => <p key={a.id} style={{ fontSize: '10.5px', margin: '3px 0' }}>★ {a.title}{a.issuer ? ` — ${a.issuer}` : ''}</p>)}</Sec> : null;
            case 'volunteering': return volunteering.length > 0 ? <Sec key={key} title="volunteering" c={c} mono={mono}>{volunteering.map(v => <p key={v.id} style={{ fontSize: '10.5px', margin: '3px 0' }}>{v.role} @ {v.organization} ({formatDateRange(v.startDate, v.endDate, v.current)})</p>)}</Sec> : null;
            case 'publications': return publications.length > 0 ? <Sec key={key} title="publications" c={c} mono={mono}>{publications.map(p => <p key={p.id} style={{ fontSize: '10.5px', fontStyle: 'italic', margin: '3px 0' }}>{p.title} — {p.publisher}, {formatDate(p.date)}</p>)}</Sec> : null;
            case 'references': return references.length > 0 ? <Sec key={key} title="references" c={c} mono={mono}>{references.map(r => <div key={r.id} style={{ marginBottom: '6px' }}><p style={{ fontSize: '10.5px', fontWeight: 600, margin: 0 }}>{r.name}</p><p style={{ fontSize: '9.5px', color: '#999', margin: 0 }}>{r.position}, {r.company}</p></div>)}</Sec> : null;
            default: return null;
          }
        })}
      </div>
    </div>
  );
}

function Sec({ title, c, mono, children }: { title: string; c: string; mono: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <span style={{ fontFamily: mono, fontSize: '11px', color: '#9ca3af' }}>//</span>
        <h2 style={{ fontFamily: mono, fontSize: '12px', fontWeight: 600, color: c, margin: 0, letterSpacing: '0.5px' }}>{title}</h2>
        <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
      </div>
      {children}
    </section>
  );
}
