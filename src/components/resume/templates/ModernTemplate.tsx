/* ── Modern Template — TWO-COLUMN with Colored Sidebar ───── */
'use client';
import type { ResumeData, ResumeStyle } from '@/types/resume';
import { formatDateRange, formatDate } from '@/lib/utils';

interface P { data: ResumeData; style: ResumeStyle; }

export default function ModernTemplate({ data, style }: P) {
  const { personalInfo: pi, summary, experience, education, skills, projects, certifications, languages, awards, volunteering, publications, references } = data;
  const c = style.primaryColor;
  const hidden = new Set(style.hiddenSections);
  const sidebarSections = new Set(['skills', 'languages', 'certifications', 'awards', 'references']);
  const mainOrder = style.sectionOrder.filter(s => !hidden.has(s) && !sidebarSections.has(s));
  const sideOrder = style.sectionOrder.filter(s => !hidden.has(s) && sidebarSections.has(s));
  const BASE_FONT = style.fontSize === 'small' ? 10 : style.fontSize === 'large' ? 12.5 : 11;
  const fs = (r: number) => `${(BASE_FONT * r).toFixed(1)}px`;
  const sp = style.sectionSpacing ?? 16;
  const psp = style.paragraphSpacing ?? 4;

  return (
    <div style={{ width: '794px', minHeight: '1123px', display: 'flex', background: '#fff', fontFamily: style.fontFamily, fontSize: `${BASE_FONT}px`, lineHeight: style.lineHeight ?? 1.5, color: '#1a1a1a' }}>
      {/* ── LEFT SIDEBAR ── */}
      <div style={{ width: '250px', backgroundColor: c, color: '#fff', padding: '40px 24px', flexShrink: 0 }}>
        {/* Avatar initials */}
        <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs(2.18), fontWeight: 700, marginBottom: '16px' }}>
          {(pi.firstName?.[0] || '')}{(pi.lastName?.[0] || '')}
        </div>
        <h1 style={{ fontSize: fs(2.0), fontWeight: 700, lineHeight: '1.2', margin: 0 }}>{pi.firstName}<br/>{pi.lastName}</h1>
        {pi.title && <p style={{ fontSize: fs(1.0), opacity: 0.85, marginTop: '4px', fontWeight: 500 }}>{pi.title}</p>}

        {/* Contact */}
        <div style={{ marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '16px' }}>
          <h3 style={{ fontSize: fs(0.82), fontWeight: 700, letterSpacing: '2px', opacity: 0.6, marginBottom: '8px' }}>CONTACT</h3>
          {[pi.email, pi.phone, pi.location, pi.linkedin, pi.github, pi.website].filter(Boolean).map((info, i) => (
            <p key={i} style={{ fontSize: fs(0.86), opacity: 0.9, margin: '3px 0', wordBreak: 'break-all' }}>{info}</p>
          ))}
        </div>

        {/* Sidebar sections */}
        {sideOrder.map((key) => {
          switch (key) {
            case 'skills': return skills.length > 0 ? <SideBar key={key} title="SKILLS" bf={BASE_FONT}>{skills.map((s) => (
              <div key={s.id} style={{ marginBottom: '10px' }}>
                <p style={{ fontSize: fs(0.91), fontWeight: 700, opacity: 0.7, letterSpacing: '0.5px', marginBottom: '4px' }}>{s.category}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>{s.items.map((item, j) => (
                  <span key={j} style={{ fontSize: fs(0.82), padding: '2px 8px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'inline-block' }}>{item}</span>
                ))}</div>
              </div>
            ))}</SideBar> : null;
            case 'languages': return languages.length > 0 ? <SideBar key={key} title="LANGUAGES" bf={BASE_FONT}>{languages.map((l) => (
              <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: fs(0.91), margin: '3px 0' }}><span>{l.language}</span><span style={{ opacity: 0.7 }}>{l.proficiency}</span></div>
            ))}</SideBar> : null;
            case 'certifications': return certifications.length > 0 ? <SideBar key={key} title="CERTIFICATIONS" bf={BASE_FONT}>{certifications.map((cert) => (
              <div key={cert.id} style={{ marginBottom: '6px' }}><p style={{ fontSize: fs(0.91), fontWeight: 600 }}>{cert.name}</p><p style={{ fontSize: fs(0.82), opacity: 0.7 }}>{cert.issuer} · {formatDate(cert.date)}</p></div>
            ))}</SideBar> : null;
            case 'awards': return awards.length > 0 ? <SideBar key={key} title="AWARDS" bf={BASE_FONT}>{awards.map((a) => <p key={a.id} style={{ fontSize: fs(0.91), margin: '3px 0' }}>{a.title}</p>)}</SideBar> : null;
            case 'references': return references.length > 0 ? <SideBar key={key} title="REFERENCES" bf={BASE_FONT}>{references.map((r) => <div key={r.id} style={{ marginBottom: '6px', fontSize: fs(0.86) }}><p style={{ fontWeight: 600 }}>{r.name}</p><p style={{ opacity: 0.7 }}>{r.position}, {r.company}</p></div>)}</SideBar> : null;
            default: return null;
          }
        })}
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, padding: `40px ${style.marginRight ?? 36}px 40px 36px` }}>
        {mainOrder.map((key) => {
          switch (key) {
            case 'summary': return summary ? <MainSec key={key} title="About Me" c={c} sp={sp} bf={BASE_FONT}><p style={{ fontSize: fs(1.0), lineHeight: '1.65', color: '#4b5563' }}>{summary}</p></MainSec> : null;
            case 'experience': return experience.length > 0 ? <MainSec key={key} title="Work Experience" c={c} sp={sp} bf={BASE_FONT}>{experience.map((e, i) => (
              <div key={e.id} style={{ marginTop: i > 0 ? '14px' : 0, paddingTop: i > 0 ? '14px' : 0, borderTop: i > 0 ? '1px solid #f3f4f6' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div><h3 style={{ fontSize: fs(1.09), fontWeight: 700, color: '#111', margin: 0 }}>{e.position}</h3><p style={{ fontSize: fs(1.0), fontWeight: 600, color: c, margin: '1px 0 0' }}>{e.company}{e.location ? ` · ${e.location}` : ''}</p></div>
                  <span style={{ fontSize: fs(0.82), padding: '2px 8px', background: '#f3f4f6', borderRadius: '4px', color: '#6b7280', flexShrink: 0, marginLeft: '8px' }}>{formatDateRange(e.startDate, e.endDate, e.current)}</span>
                </div>
                {e.highlights.filter(Boolean).length > 0 && <ul style={{ margin: '6px 0 0', padding: 0, listStyle: 'none' }}>{e.highlights.filter(Boolean).map((h, j) => (
                  <li key={j} style={{ fontSize: fs(0.95), color: '#374151', display: 'flex', gap: '6px', marginTop: `${psp}px` }}><span style={{ marginTop: '5px', width: '5px', height: '5px', borderRadius: '50%', background: `${c}40`, flexShrink: 0 }} /><span>{h}</span></li>
                ))}</ul>}
              </div>
            ))}</MainSec> : null;
            case 'education': return education.length > 0 ? <MainSec key={key} title="Education" c={c} sp={sp} bf={BASE_FONT}>{education.map((e) => (
              <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div><h3 style={{ fontSize: fs(1.09), fontWeight: 700, margin: 0 }}>{e.degree}{e.field ? ` in ${e.field}` : ''}</h3><p style={{ fontSize: fs(1.0), color: c, margin: 0 }}>{e.institution}</p>{e.gpa && <p style={{ fontSize: fs(0.91), color: '#9ca3af', margin: 0 }}>GPA: {e.gpa}</p>}</div>
                <span style={{ fontSize: fs(0.82), padding: '2px 8px', background: '#f3f4f6', borderRadius: '4px', color: '#6b7280' }}>{formatDateRange(e.startDate, e.endDate, false)}</span>
              </div>))}</MainSec> : null;
            case 'projects': return projects.length > 0 ? <MainSec key={key} title="Projects" c={c} sp={sp} bf={BASE_FONT}>{projects.map((p, i) => (
              <div key={p.id} style={{ marginTop: i > 0 ? '10px' : 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}><span style={{ fontWeight: 700, fontSize: fs(1.09) }}>{p.name}</span>{p.url && <span style={{ fontSize: fs(0.82), color: c }}>{p.url}</span>}</div>
                {p.description && <p style={{ fontSize: fs(0.95), color: '#6b7280', margin: '2px 0 0' }}>{p.description}</p>}
                {p.technologies.length > 0 && <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>{p.technologies.map((t, j) => <span key={j} style={{ fontSize: fs(0.82), padding: '1px 6px', background: '#f3f4f6', borderRadius: '3px', color: '#6b7280' }}>{t}</span>)}</div>}
              </div>))}</MainSec> : null;
            case 'volunteering': return volunteering.length > 0 ? <MainSec key={key} title="Volunteering" c={c} sp={sp} bf={BASE_FONT}>{volunteering.map((v) => <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: fs(0.95) }}><span><strong>{v.role}</strong> — {v.organization}</span><span style={{ color: '#9ca3af' }}>{formatDateRange(v.startDate, v.endDate, v.current)}</span></div>)}</MainSec> : null;
            case 'publications': return publications.length > 0 ? <MainSec key={key} title="Publications" c={c} sp={sp} bf={BASE_FONT}>{publications.map((p) => <p key={p.id} style={{ fontSize: fs(0.95) }}><strong>{p.title}</strong> — {p.publisher}, {formatDate(p.date)}</p>)}</MainSec> : null;
            default: return null;
          }
        })}
      </div>
    </div>
  );
}

function SideBar({ title, bf = 11, children }: { title: string; bf?: number; children: React.ReactNode }) {
  return <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '14px' }}><h3 style={{ fontSize: `${(bf * 0.82).toFixed(1)}px`, fontWeight: 700, letterSpacing: '2px', opacity: 0.6, marginBottom: '8px' }}>{title}</h3>{children}</div>;
}

function MainSec({ title, c, sp = 16, bf = 11, children }: { title: string; c: string; sp?: number; bf?: number; children: React.ReactNode }) {
  return <section style={{ marginBottom: `${sp}px` }}><div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: `${Math.min(sp, 12)}px` }}><div style={{ width: '4px', height: '16px', borderRadius: '2px', background: c }} /><h2 style={{ fontSize: `${(bf * 1.27).toFixed(1)}px`, fontWeight: 700, color: '#111', margin: 0 }}>{title}</h2></div>{children}</section>;
}
