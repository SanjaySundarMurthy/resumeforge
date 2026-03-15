/* ── Executive Template — Full-Width Banner + Thick Borders ── */
'use client';
import type { ResumeData, ResumeStyle } from '@/types/resume';
import { formatDateRange, formatDate } from '@/lib/utils';

interface P { data: ResumeData; style: ResumeStyle; }

export default function ExecutiveTemplate({ data, style }: P) {
  const { personalInfo: pi, summary, experience, education, skills, projects, certifications, languages, awards, volunteering, publications, references } = data;
  const c = style.primaryColor;
  const hidden = new Set(style.hiddenSections);
  const order = style.sectionOrder.filter(s => !hidden.has(s));

  return (
    <div style={{ width: '794px', minHeight: '1123px', background: '#fff', fontFamily: style.fontFamily, fontSize: '11px', lineHeight: '1.55', color: '#1a1a1a' }}>
      {/* ── HEADER BANNER ── */}
      <div style={{ background: c, color: '#fff', padding: '36px 56px', position: 'relative' }}>
        <h1 style={{ fontSize: '30px', fontWeight: 700, margin: 0, letterSpacing: '1px' }}>{pi.firstName} {pi.lastName}</h1>
        {pi.title && <p style={{ fontSize: '14px', fontWeight: 400, opacity: 0.85, margin: '4px 0 0', letterSpacing: '1px' }}>{pi.title}</p>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '12px', fontSize: '10px', opacity: 0.8 }}>
          {pi.email && <span>✉ {pi.email}</span>}
          {pi.phone && <span>☎ {pi.phone}</span>}
          {pi.location && <span>📍 {pi.location}</span>}
          {pi.linkedin && <span>{pi.linkedin}</span>}
          {pi.github && <span>{pi.github}</span>}
          {pi.website && <span>{pi.website}</span>}
        </div>
        {/* Decorative bottom strip */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: 'rgba(0,0,0,0.15)' }} />
      </div>

      {/* ── BODY ── */}
      <div style={{ padding: '32px 56px' }}>
        {order.map((key) => {
          switch (key) {
            case 'summary': return summary ? <Sec key={key} title="Executive Summary" c={c}><p style={{ fontSize: '11px', lineHeight: '1.7', color: '#4b5563' }}>{summary}</p></Sec> : null;
            case 'experience': return experience.length > 0 ? <Sec key={key} title="Professional Experience" c={c}>{experience.map((e, i) => (
              <div key={e.id} style={{ marginTop: i > 0 ? '16px' : 0, paddingTop: i > 0 ? '16px' : 0, borderTop: i > 0 ? '1px solid #f3f4f6' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div><h3 style={{ fontSize: '13px', fontWeight: 700, color: '#111', margin: 0 }}>{e.position}</h3><p style={{ fontSize: '11.5px', fontWeight: 600, color: c, margin: '1px 0 0' }}>{e.company}{e.location ? `, ${e.location}` : ''}</p></div>
                  <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '12px' }}><span style={{ fontSize: '10px', background: `${c}15`, color: c, padding: '3px 10px', borderRadius: '4px', fontWeight: 600 }}>{formatDateRange(e.startDate, e.endDate, e.current)}</span></div>
                </div>
                {e.highlights.filter(Boolean).length > 0 && <ul style={{ margin: '8px 0 0 0', padding: 0, listStyle: 'none' }}>{e.highlights.filter(Boolean).map((h, j) => (
                  <li key={j} style={{ fontSize: '10.5px', color: '#374151', paddingLeft: '14px', position: 'relative', marginTop: '3px' }}><span style={{ position: 'absolute', left: 0, top: '6px', width: '4px', height: '4px', background: c, borderRadius: '50%' }} />{h}</li>
                ))}</ul>}
              </div>
            ))}</Sec> : null;
            case 'education': return education.length > 0 ? <Sec key={key} title="Education" c={c}>{education.map((e) => (
              <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div><h3 style={{ fontSize: '12px', fontWeight: 700, margin: 0 }}>{e.degree}{e.field ? ` in ${e.field}` : ''}</h3><p style={{ fontSize: '11px', color: '#6b7280', margin: 0 }}>{e.institution}{e.gpa ? ` · GPA: ${e.gpa}` : ''}</p></div>
                <span style={{ fontSize: '10px', color: c, fontWeight: 600 }}>{formatDateRange(e.startDate, e.endDate, false)}</span>
              </div>
            ))}</Sec> : null;
            case 'skills': return skills.length > 0 ? <Sec key={key} title="Core Competencies" c={c}><div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>{skills.map(s => (
              <div key={s.id}><p style={{ fontSize: '10px', fontWeight: 700, color: c, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.category}</p><p style={{ fontSize: '10.5px', color: '#555' }}>{s.items.join(' · ')}</p></div>
            ))}</div></Sec> : null;
            case 'projects': return projects.length > 0 ? <Sec key={key} title="Key Projects" c={c}>{projects.map((p, i) => (
              <div key={p.id} style={{ marginTop: i > 0 ? '10px' : 0 }}>
                <span style={{ fontWeight: 700, fontSize: '12px' }}>{p.name}</span>{p.url && <span style={{ fontSize: '9.5px', color: c, marginLeft: '8px' }}>{p.url}</span>}
                {p.description && <p style={{ fontSize: '10.5px', color: '#6b7280', margin: '2px 0 0' }}>{p.description}</p>}
                {p.technologies.length > 0 && <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>{p.technologies.map((t, j) => <span key={j} style={{ fontSize: '9px', padding: '2px 8px', background: `${c}10`, color: c, borderRadius: '3px', fontWeight: 500 }}>{t}</span>)}</div>}
              </div>
            ))}</Sec> : null;
            case 'certifications': return certifications.length > 0 ? <Sec key={key} title="Certifications" c={c}>{certifications.map(cert => <p key={cert.id} style={{ fontSize: '10.5px', margin: '4px 0' }}><strong>{cert.name}</strong> — {cert.issuer}, {formatDate(cert.date)}</p>)}</Sec> : null;
            case 'languages': return languages.length > 0 ? <Sec key={key} title="Languages" c={c}><div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>{languages.map(l => <span key={l.id} style={{ fontSize: '10.5px' }}><strong>{l.language}</strong> — {l.proficiency}</span>)}</div></Sec> : null;
            case 'awards': return awards.length > 0 ? <Sec key={key} title="Honors & Awards" c={c}>{awards.map(a => <p key={a.id} style={{ fontSize: '10.5px', margin: '3px 0' }}><strong>{a.title}</strong>{a.issuer ? ` — ${a.issuer}` : ''}{a.date ? `, ${formatDate(a.date)}` : ''}</p>)}</Sec> : null;
            case 'volunteering': return volunteering.length > 0 ? <Sec key={key} title="Community Leadership" c={c}>{volunteering.map(v => <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', margin: '3px 0' }}><span><strong>{v.role}</strong> — {v.organization}</span><span style={{ color: '#9ca3af' }}>{formatDateRange(v.startDate, v.endDate, v.current)}</span></div>)}</Sec> : null;
            case 'publications': return publications.length > 0 ? <Sec key={key} title="Publications" c={c}>{publications.map(p => <p key={p.id} style={{ fontSize: '10.5px', margin: '3px 0' }}><em>{p.title}</em> — {p.publisher}, {formatDate(p.date)}</p>)}</Sec> : null;
            case 'references': return references.length > 0 ? <Sec key={key} title="References" c={c}>{references.map(r => <div key={r.id} style={{ marginBottom: '6px' }}><p style={{ fontSize: '11px', fontWeight: 600 }}>{r.name}</p><p style={{ fontSize: '10px', color: '#6b7280' }}>{r.position}, {r.company}{r.email ? ` · ${r.email}` : ''}{r.phone ? ` · ${r.phone}` : ''}</p></div>)}</Sec> : null;
            default: return null;
          }
        })}
      </div>
    </div>
  );
}

function Sec({ title, c, children }: { title: string; c: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '20px' }}>
      <div style={{ borderLeft: `4px solid ${c}`, paddingLeft: '12px', marginBottom: '10px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#111', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</h2>
      </div>
      {children}
    </section>
  );
}
