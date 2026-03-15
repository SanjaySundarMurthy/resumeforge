/* ── Creative Template ────────────────────────────────────── */
/* Bold, playful, expressive. Best for: Design, Marketing, Media */

'use client';

import type { ResumeData, ResumeStyle } from '@/types/resume';
import { formatDateRange, formatDate } from '@/lib/utils';

interface TemplateProps {
  data: ResumeData;
  style: ResumeStyle;
}

export default function CreativeTemplate({ data, style }: TemplateProps) {
  const { personalInfo: pi, summary, experience, education, skills, projects, certifications, languages, awards, volunteering, publications } = data;
  const color = style.primaryColor;
  const hidden = new Set(style.hiddenSections);

  return (
    <div className="resume-page" style={{ fontFamily: style.fontFamily }}>
      {/* Header — unique creative layout */}
      <header className="mb-6 relative">
        <div className="flex items-end gap-4">
          {/* Large initial letter */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-[28px] font-bold shrink-0"
            style={{ backgroundColor: color }}
          >
            {(pi.firstName?.[0] || '') + (pi.lastName?.[0] || '')}
          </div>
          <div className="flex-1">
            <h1 className="text-[28px] font-bold text-gray-900 leading-tight">
              {pi.firstName} {pi.lastName}
            </h1>
            {pi.title && (
              <p className="text-[13px] font-medium mt-0.5" style={{ color }}>{pi.title}</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 text-[10px] text-gray-500">
          {pi.email && <span className="flex items-center gap-1">✉ {pi.email}</span>}
          {pi.phone && <span className="flex items-center gap-1">☎ {pi.phone}</span>}
          {pi.location && <span className="flex items-center gap-1">📍 {pi.location}</span>}
          {pi.linkedin && <span>🔗 {pi.linkedin}</span>}
          {pi.github && <span>⌨ {pi.github}</span>}
          {pi.website && <span>🌐 {pi.website}</span>}
        </div>
        <div className="mt-3 h-1 rounded-full" style={{ background: `linear-gradient(90deg, ${color}, ${color}40, transparent)` }} />
      </header>

      {style.sectionOrder.filter((s) => !hidden.has(s)).map((section) => {
        switch (section) {
          case 'summary':
            return summary ? (
              <CreativeSection key={section} title="Who I Am" color={color}>
                <p className="text-[11px] leading-[1.6] text-gray-700 italic">{summary}</p>
              </CreativeSection>
            ) : null;

          case 'experience':
            return experience.length > 0 ? (
              <CreativeSection key={section} title="Where I've Worked" color={color}>
                {experience.map((exp, i) => (
                  <div key={exp.id} className={`relative pl-5 ${i > 0 ? 'mt-4' : ''}`}>
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full border-2" style={{ borderColor: color, backgroundColor: i === 0 ? color : 'white' }} />
                    {i < experience.length - 1 && (
                      <div className="absolute left-[4px] top-4 bottom-0 w-px" style={{ backgroundColor: color + '30' }} />
                    )}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-[12px] text-gray-900">{exp.position}</h3>
                        <p className="text-[11px]" style={{ color }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                      </div>
                      <span className="text-[10px] text-gray-400 shrink-0 ml-3">
                        {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                      </span>
                    </div>
                    {exp.highlights.filter(Boolean).length > 0 && (
                      <ul className="mt-1.5 space-y-0.5">
                        {exp.highlights.filter(Boolean).map((h, j) => (
                          <li key={j} className="text-[10.5px] text-gray-600 pl-3 relative">
                            <span className="absolute left-0 top-[6px] w-1 h-1 rounded-full" style={{ backgroundColor: color + '60' }} />
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </CreativeSection>
            ) : null;

          case 'education':
            return education.length > 0 ? (
              <CreativeSection key={section} title="Education" color={color}>
                {education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-baseline">
                    <div>
                      <h3 className="font-bold text-[12px] text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                      <p className="text-[11px]" style={{ color }}>{edu.institution}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</p>
                    </div>
                    <span className="text-[10px] text-gray-400">{formatDateRange(edu.startDate, edu.endDate, false)}</span>
                  </div>
                ))}
              </CreativeSection>
            ) : null;

          case 'skills':
            return skills.length > 0 ? (
              <CreativeSection key={section} title="My Toolkit" color={color}>
                <div className="space-y-2">
                  {skills.map((cat) => (
                    <div key={cat.id}>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">{cat.category}</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.items.map((item, j) => (
                          <span
                            key={j}
                            className="text-[10px] px-2.5 py-1 rounded-full border"
                            style={{ borderColor: color + '30', color: color }}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CreativeSection>
            ) : null;

          case 'projects':
            return projects.length > 0 ? (
              <CreativeSection key={section} title="Cool Projects" color={color}>
                {projects.map((proj, i) => (
                  <div key={proj.id} className={i > 0 ? 'mt-3' : ''}>
                    <h3 className="font-bold text-[12px] text-gray-900">{proj.name}</h3>
                    {proj.description && <p className="text-[10.5px] text-gray-600">{proj.description}</p>}
                    {proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {proj.technologies.map((t, j) => (
                          <span key={j} className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: color + '10', color }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CreativeSection>
            ) : null;

          case 'certifications':
            return certifications.length > 0 ? (
              <CreativeSection key={section} title="Certifications" color={color}>
                {certifications.map((c) => (
                  <div key={c.id} className="flex justify-between text-[10.5px]">
                    <span className="font-semibold text-gray-800">{c.name} — {c.issuer}</span>
                    <span className="text-gray-400">{formatDate(c.date)}</span>
                  </div>
                ))}
              </CreativeSection>
            ) : null;

          case 'languages':
            return languages.length > 0 ? (
              <CreativeSection key={section} title="Languages" color={color}>
                <div className="flex flex-wrap gap-2">
                  {languages.map((l) => (
                    <span key={l.id} className="text-[10.5px] px-2.5 py-1 rounded-full border" style={{ borderColor: color + '30' }}>
                      {l.language} · {l.proficiency}
                    </span>
                  ))}
                </div>
              </CreativeSection>
            ) : null;

          case 'awards':
            return awards.length > 0 ? (
              <CreativeSection key={section} title="Awards" color={color}>
                {awards.map((a) => (
                  <div key={a.id} className="flex justify-between text-[10.5px]">
                    <span className="font-semibold text-gray-800">🏆 {a.title} — {a.issuer}</span>
                    <span className="text-gray-400">{formatDate(a.date)}</span>
                  </div>
                ))}
              </CreativeSection>
            ) : null;

          case 'volunteering':
            return volunteering.length > 0 ? (
              <CreativeSection key={section} title="Giving Back" color={color}>
                {volunteering.map((v) => (
                  <div key={v.id} className="flex justify-between text-[10.5px]">
                    <span className="font-semibold text-gray-800">{v.role} — {v.organization}</span>
                    <span className="text-gray-400">{formatDateRange(v.startDate, v.endDate, v.current || false)}</span>
                  </div>
                ))}
              </CreativeSection>
            ) : null;

          case 'publications':
            return publications.length > 0 ? (
              <CreativeSection key={section} title="Publications" color={color}>
                {publications.map((p) => (
                  <p key={p.id} className="text-[10.5px] text-gray-700">{p.title} — {p.publisher}, {formatDate(p.date)}</p>
                ))}
              </CreativeSection>
            ) : null;

          default:
            return null;
        }
      })}
    </div>
  );
}

function CreativeSection({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <section className="mb-5">
      <h2 className="text-[14px] font-bold mb-2" style={{ color }}>{title}</h2>
      {children}
    </section>
  );
}
