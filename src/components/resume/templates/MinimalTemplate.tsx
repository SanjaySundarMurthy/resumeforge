/* ── Minimal Template ─────────────────────────────────────── */
/* Clean, elegant, content-focused. Best for: Any field, maximum readability */

'use client';

import type { ResumeData, ResumeStyle } from '@/types/resume';
import { formatDateRange, formatDate } from '@/lib/utils';

interface TemplateProps {
  data: ResumeData;
  style: ResumeStyle;
}

export default function MinimalTemplate({ data, style }: TemplateProps) {
  const { personalInfo: pi, summary, experience, education, skills, projects, certifications, languages, awards, volunteering, publications } = data;
  const color = style.primaryColor;
  const hidden = new Set(style.hiddenSections);

  return (
    <div className="resume-page" style={{ fontFamily: style.fontFamily }}>
      {/* Header — centered, minimal */}
      <header className="text-center mb-6">
        <h1 className="text-[28px] font-light tracking-wide text-gray-900">
          {pi.firstName} <span className="font-semibold">{pi.lastName}</span>
        </h1>
        {pi.title && (
          <p className="text-[12px] text-gray-500 mt-1 tracking-wider uppercase">{pi.title}</p>
        )}
        <div className="flex items-center justify-center flex-wrap gap-x-2 gap-y-0.5 mt-3 text-[10px] text-gray-400">
          {[pi.email, pi.phone, pi.location, pi.linkedin, pi.github, pi.website]
            .filter(Boolean)
            .map((info, i, arr) => (
              <span key={i}>
                {info}
                {i < arr.length - 1 && <span className="ml-2 text-gray-300">|</span>}
              </span>
            ))}
        </div>
      </header>

      {style.sectionOrder.filter((s) => !hidden.has(s)).map((section) => {
        switch (section) {
          case 'summary':
            return summary ? (
              <MinSection key={section} title="Summary" color={color}>
                <p className="text-[11px] leading-[1.6] text-gray-600 text-center">{summary}</p>
              </MinSection>
            ) : null;

          case 'experience':
            return experience.length > 0 ? (
              <MinSection key={section} title="Experience" color={color}>
                {experience.map((exp, i) => (
                  <div key={exp.id} className={i > 0 ? 'mt-4' : ''}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-[12px] font-semibold text-gray-900">{exp.position}</h3>
                      <span className="text-[10px] text-gray-400">
                        {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                    {exp.highlights.filter(Boolean).length > 0 && (
                      <ul className="mt-1.5 space-y-0.5">
                        {exp.highlights.filter(Boolean).map((h, j) => (
                          <li key={j} className="text-[10.5px] text-gray-600 pl-3 relative before:content-['–'] before:absolute before:left-0 before:text-gray-300">
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </MinSection>
            ) : null;

          case 'education':
            return education.length > 0 ? (
              <MinSection key={section} title="Education" color={color}>
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-[12px] font-semibold text-gray-900">
                        {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                      </h3>
                      <span className="text-[10px] text-gray-400">
                        {formatDateRange(edu.startDate, edu.endDate, false)}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      {edu.institution}
                      {edu.gpa ? ` — GPA: ${edu.gpa}` : ''}
                    </p>
                  </div>
                ))}
              </MinSection>
            ) : null;

          case 'skills':
            return skills.length > 0 ? (
              <MinSection key={section} title="Skills" color={color}>
                <div className="space-y-1">
                  {skills.map((cat) => (
                    <p key={cat.id} className="text-[10.5px] text-gray-600">
                      <span className="font-medium text-gray-800">{cat.category}:</span> {cat.items.join(' · ')}
                    </p>
                  ))}
                </div>
              </MinSection>
            ) : null;

          case 'projects':
            return projects.length > 0 ? (
              <MinSection key={section} title="Projects" color={color}>
                {projects.map((proj, i) => (
                  <div key={proj.id} className={i > 0 ? 'mt-2' : ''}>
                    <h3 className="text-[12px] font-semibold text-gray-900">{proj.name}</h3>
                    {proj.description && <p className="text-[10.5px] text-gray-600">{proj.description}</p>}
                    {proj.technologies.length > 0 && (
                      <p className="text-[10px] text-gray-400 mt-0.5">{proj.technologies.join(' · ')}</p>
                    )}
                  </div>
                ))}
              </MinSection>
            ) : null;

          case 'certifications':
            return certifications.length > 0 ? (
              <MinSection key={section} title="Certifications" color={color}>
                {certifications.map((c) => (
                  <div key={c.id} className="flex justify-between text-[10.5px]">
                    <span className="text-gray-700">{c.name} — {c.issuer}</span>
                    <span className="text-gray-400">{formatDate(c.date)}</span>
                  </div>
                ))}
              </MinSection>
            ) : null;

          case 'languages':
            return languages.length > 0 ? (
              <MinSection key={section} title="Languages" color={color}>
                <p className="text-[10.5px] text-gray-600">
                  {languages.map((l) => `${l.language} (${l.proficiency})`).join(' · ')}
                </p>
              </MinSection>
            ) : null;

          case 'awards':
            return awards.length > 0 ? (
              <MinSection key={section} title="Awards" color={color}>
                {awards.map((a) => (
                  <div key={a.id} className="flex justify-between text-[10.5px]">
                    <span className="text-gray-700">{a.title} — {a.issuer}</span>
                    <span className="text-gray-400">{formatDate(a.date)}</span>
                  </div>
                ))}
              </MinSection>
            ) : null;

          case 'volunteering':
            return volunteering.length > 0 ? (
              <MinSection key={section} title="Volunteering" color={color}>
                {volunteering.map((v) => (
                  <div key={v.id} className="flex justify-between text-[10.5px]">
                    <span className="text-gray-700">{v.role} — {v.organization}</span>
                    <span className="text-gray-400">{formatDateRange(v.startDate, v.endDate, v.current || false)}</span>
                  </div>
                ))}
              </MinSection>
            ) : null;

          case 'publications':
            return publications.length > 0 ? (
              <MinSection key={section} title="Publications" color={color}>
                {publications.map((p) => (
                  <p key={p.id} className="text-[10.5px] text-gray-700">
                    {p.title} — {p.publisher}, {formatDate(p.date)}
                  </p>
                ))}
              </MinSection>
            ) : null;

          default:
            return null;
        }
      })}
    </div>
  );
}

function MinSection({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <section className="mb-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex-1 h-px bg-gray-200" />
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-500">{title}</h2>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      {children}
    </section>
  );
}
