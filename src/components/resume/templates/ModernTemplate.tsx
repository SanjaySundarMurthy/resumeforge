/* ── Modern Template ──────────────────────────────────────── */
/* Contemporary, vibrant, eye-catching. Best for: Tech, Startups, Marketing */

'use client';

import type { ResumeData, ResumeStyle } from '@/types/resume';
import { formatDateRange, formatDate } from '@/lib/utils';

interface TemplateProps {
  data: ResumeData;
  style: ResumeStyle;
}

export default function ModernTemplate({ data, style }: TemplateProps) {
  const { personalInfo: pi, summary, experience, education, skills, projects, certifications, languages, awards, volunteering, publications } = data;
  const color = style.primaryColor;
  const hidden = new Set(style.hiddenSections);

  return (
    <div className="resume-page" style={{ fontFamily: style.fontFamily }}>
      {/* Header with colored background */}
      <header className="rounded-lg p-5 mb-5 -mx-2 -mt-2" style={{ backgroundColor: color + '0a' }}>
        <h1 className="text-[28px] font-bold" style={{ color }}>
          {pi.firstName} {pi.lastName}
        </h1>
        {pi.title && (
          <p className="text-[14px] text-gray-600 mt-0.5 font-medium">{pi.title}</p>
        )}
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3">
          {[pi.email, pi.phone, pi.location, pi.linkedin, pi.github, pi.website]
            .filter(Boolean)
            .map((info, i) => (
              <span
                key={i}
                className="inline-flex items-center text-[10px] px-2 py-0.5 rounded-full"
                style={{ backgroundColor: color + '12', color: color }}
              >
                {info}
              </span>
            ))}
        </div>
      </header>

      {style.sectionOrder.filter((s) => !hidden.has(s)).map((section) => {
        switch (section) {
          case 'summary':
            return summary ? (
              <ModernSection key={section} title="About Me" color={color}>
                <p className="text-[11px] leading-[1.6] text-gray-700">{summary}</p>
              </ModernSection>
            ) : null;

          case 'experience':
            return experience.length > 0 ? (
              <ModernSection key={section} title="Work Experience" color={color}>
                {experience.map((exp, i) => (
                  <div key={exp.id} className={i > 0 ? 'mt-3.5 pt-3.5 border-t border-gray-100' : ''}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-[12px] text-gray-900">{exp.position}</h3>
                        <p className="text-[11px] font-medium" style={{ color }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                      </div>
                      <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded shrink-0 ml-2">
                        {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                      </span>
                    </div>
                    {exp.highlights.filter(Boolean).length > 0 && (
                      <ul className="mt-1.5 space-y-1">
                        {exp.highlights.filter(Boolean).map((h, j) => (
                          <li key={j} className="text-[10.5px] text-gray-700 flex items-start gap-2">
                            <span className="mt-[5px] w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color + '40' }} />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </ModernSection>
            ) : null;

          case 'education':
            return education.length > 0 ? (
              <ModernSection key={section} title="Education" color={color}>
                {education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-[12px] text-gray-900">
                        {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                      </h3>
                      <p className="text-[11px]" style={{ color }}>{edu.institution}</p>
                      {edu.gpa && <p className="text-[10px] text-gray-400">GPA: {edu.gpa}</p>}
                    </div>
                    <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                      {formatDateRange(edu.startDate, edu.endDate, false)}
                    </span>
                  </div>
                ))}
              </ModernSection>
            ) : null;

          case 'skills':
            return skills.length > 0 ? (
              <ModernSection key={section} title="Skills" color={color}>
                <div className="space-y-2">
                  {skills.map((cat) => (
                    <div key={cat.id}>
                      <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">{cat.category}</h4>
                      <div className="flex flex-wrap gap-1">
                        {cat.items.map((item, j) => (
                          <span
                            key={j}
                            className="text-[10px] px-2 py-0.5 rounded-md"
                            style={{ backgroundColor: color + '10', color: color + 'cc' }}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ModernSection>
            ) : null;

          case 'projects':
            return projects.length > 0 ? (
              <ModernSection key={section} title="Projects" color={color}>
                {projects.map((proj, i) => (
                  <div key={proj.id} className={i > 0 ? 'mt-2.5 pt-2.5 border-t border-gray-100' : ''}>
                    <div className="flex items-baseline gap-2">
                      <h3 className="font-bold text-[12px] text-gray-900">{proj.name}</h3>
                      {proj.url && <span className="text-[9px]" style={{ color }}>{proj.url}</span>}
                    </div>
                    {proj.description && <p className="text-[10.5px] text-gray-600 mt-0.5">{proj.description}</p>}
                    {proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {proj.technologies.map((t, j) => (
                          <span key={j} className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </ModernSection>
            ) : null;

          case 'certifications':
            return certifications.length > 0 ? (
              <ModernSection key={section} title="Certifications" color={color}>
                <div className="space-y-1">
                  {certifications.map((c) => (
                    <div key={c.id} className="flex justify-between text-[10.5px]">
                      <span><span className="font-semibold text-gray-800">{c.name}</span> · {c.issuer}</span>
                      <span className="text-gray-400">{formatDate(c.date)}</span>
                    </div>
                  ))}
                </div>
              </ModernSection>
            ) : null;

          case 'languages':
            return languages.length > 0 ? (
              <ModernSection key={section} title="Languages" color={color}>
                <div className="flex flex-wrap gap-2">
                  {languages.map((l) => (
                    <span key={l.id} className="text-[10.5px] px-2 py-0.5 rounded-md bg-gray-50 text-gray-700">
                      {l.language} <span className="text-gray-400">— {l.proficiency}</span>
                    </span>
                  ))}
                </div>
              </ModernSection>
            ) : null;

          case 'awards':
            return awards.length > 0 ? (
              <ModernSection key={section} title="Awards" color={color}>
                {awards.map((a) => (
                  <div key={a.id} className="flex justify-between text-[10.5px]">
                    <span className="font-semibold text-gray-800">{a.title} — {a.issuer}</span>
                    <span className="text-gray-400">{formatDate(a.date)}</span>
                  </div>
                ))}
              </ModernSection>
            ) : null;

          case 'volunteering':
            return volunteering.length > 0 ? (
              <ModernSection key={section} title="Volunteering" color={color}>
                {volunteering.map((v) => (
                  <div key={v.id} className="flex justify-between text-[10.5px]">
                    <span className="font-semibold text-gray-800">{v.role} — {v.organization}</span>
                    <span className="text-gray-400">{formatDateRange(v.startDate, v.endDate, v.current || false)}</span>
                  </div>
                ))}
              </ModernSection>
            ) : null;

          case 'publications':
            return publications.length > 0 ? (
              <ModernSection key={section} title="Publications" color={color}>
                {publications.map((p) => (
                  <div key={p.id} className="text-[10.5px]">
                    <span className="font-semibold text-gray-800">{p.title}</span> — {p.publisher}, {formatDate(p.date)}
                  </div>
                ))}
              </ModernSection>
            ) : null;

          default:
            return null;
        }
      })}
    </div>
  );
}

function ModernSection({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <section className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1 h-4 rounded-full" style={{ backgroundColor: color }} />
        <h2 className="text-[13px] font-bold text-gray-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}
