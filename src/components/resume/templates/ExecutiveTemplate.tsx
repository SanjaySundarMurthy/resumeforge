/* ── Executive Template ───────────────────────────────────── */
/* Commanding and authoritative. Best for: C-Suite, Directors, Senior Mgmt */

'use client';

import type { ResumeData, ResumeStyle } from '@/types/resume';
import { formatDateRange, formatDate } from '@/lib/utils';

interface TemplateProps {
  data: ResumeData;
  style: ResumeStyle;
}

export default function ExecutiveTemplate({ data, style }: TemplateProps) {
  const { personalInfo: pi, summary, experience, education, skills, projects, certifications, languages, awards, volunteering, publications } = data;
  const color = style.primaryColor;
  const hidden = new Set(style.hiddenSections);

  return (
    <div className="resume-page" style={{ fontFamily: style.fontFamily }}>
      {/* Header — full-width colored bar */}
      <header className="rounded-md p-6 mb-5 -mx-3 -mt-3 text-white" style={{ backgroundColor: color }}>
        <h1 className="text-[30px] font-bold tracking-tight">{pi.firstName} {pi.lastName}</h1>
        {pi.title && <p className="text-[14px] mt-1 opacity-90 font-medium">{pi.title}</p>}
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-3 text-[10px] opacity-80">
          {pi.email && <span>{pi.email}</span>}
          {pi.phone && <span>{pi.phone}</span>}
          {pi.location && <span>{pi.location}</span>}
          {pi.linkedin && <span>{pi.linkedin}</span>}
          {pi.github && <span>{pi.github}</span>}
          {pi.website && <span>{pi.website}</span>}
        </div>
      </header>

      {style.sectionOrder.filter((s) => !hidden.has(s)).map((section) => {
        switch (section) {
          case 'summary':
            return summary ? (
              <ExecSection key={section} title="Executive Summary" color={color}>
                <p className="text-[11px] leading-[1.6] text-gray-700 border-l-3 pl-3" style={{ borderColor: color + '40' }}>{summary}</p>
              </ExecSection>
            ) : null;

          case 'experience':
            return experience.length > 0 ? (
              <ExecSection key={section} title="Professional Experience" color={color}>
                {experience.map((exp, i) => (
                  <div key={exp.id} className={i > 0 ? 'mt-4 pt-3 border-t border-gray-100' : ''}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-[13px] font-bold text-gray-900">{exp.position}</h3>
                        <p className="text-[11px] font-semibold" style={{ color }}>{exp.company}</p>
                        {exp.location && <p className="text-[10px] text-gray-400">{exp.location}</p>}
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <span className="text-[10px] font-semibold text-gray-600">
                          {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                        </span>
                      </div>
                    </div>
                    {exp.description && <p className="text-[10.5px] text-gray-600 mt-1">{exp.description}</p>}
                    {exp.highlights.filter(Boolean).length > 0 && (
                      <ul className="mt-1.5 space-y-0.5">
                        {exp.highlights.filter(Boolean).map((h, j) => (
                          <li key={j} className="text-[10.5px] text-gray-700 flex items-start gap-2">
                            <span className="text-[10px] mt-[1px] shrink-0" style={{ color }}>&#9654;</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </ExecSection>
            ) : null;

          case 'education':
            return education.length > 0 ? (
              <ExecSection key={section} title="Education" color={color}>
                {education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-[12px] text-gray-900">
                        {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                      </h3>
                      <p className="text-[11px]" style={{ color }}>{edu.institution}</p>
                      {edu.gpa && <p className="text-[10px] text-gray-400">GPA: {edu.gpa}</p>}
                    </div>
                    <span className="text-[10px] font-semibold text-gray-600">
                      {formatDateRange(edu.startDate, edu.endDate, false)}
                    </span>
                  </div>
                ))}
              </ExecSection>
            ) : null;

          case 'skills':
            return skills.length > 0 ? (
              <ExecSection key={section} title="Core Competencies" color={color}>
                <div className="grid grid-cols-2 gap-x-8 gap-y-1.5">
                  {skills.map((cat) => (
                    <div key={cat.id}>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color }}>{cat.category}</h4>
                      <p className="text-[10.5px] text-gray-600">{cat.items.join(', ')}</p>
                    </div>
                  ))}
                </div>
              </ExecSection>
            ) : null;

          case 'projects':
            return projects.length > 0 ? (
              <ExecSection key={section} title="Key Projects" color={color}>
                {projects.map((proj, i) => (
                  <div key={proj.id} className={i > 0 ? 'mt-2' : ''}>
                    <h3 className="font-bold text-[12px] text-gray-900">{proj.name}</h3>
                    {proj.description && <p className="text-[10.5px] text-gray-600">{proj.description}</p>}
                    {proj.technologies.length > 0 && (
                      <p className="text-[10px] text-gray-400 mt-0.5">{proj.technologies.join(' | ')}</p>
                    )}
                  </div>
                ))}
              </ExecSection>
            ) : null;

          case 'certifications':
            return certifications.length > 0 ? (
              <ExecSection key={section} title="Certifications" color={color}>
                {certifications.map((c) => (
                  <div key={c.id} className="flex justify-between text-[10.5px]">
                    <span className="font-semibold text-gray-800">{c.name} — {c.issuer}</span>
                    <span className="text-gray-400">{formatDate(c.date)}</span>
                  </div>
                ))}
              </ExecSection>
            ) : null;

          case 'languages':
            return languages.length > 0 ? (
              <ExecSection key={section} title="Languages" color={color}>
                <div className="flex gap-4">
                  {languages.map((l) => (
                    <span key={l.id} className="text-[10.5px] text-gray-700">{l.language} ({l.proficiency})</span>
                  ))}
                </div>
              </ExecSection>
            ) : null;

          case 'awards':
            return awards.length > 0 ? (
              <ExecSection key={section} title="Awards & Recognition" color={color}>
                {awards.map((a) => (
                  <div key={a.id} className="flex justify-between text-[10.5px]">
                    <span className="font-semibold text-gray-800">{a.title} — {a.issuer}</span>
                    <span className="text-gray-400">{formatDate(a.date)}</span>
                  </div>
                ))}
              </ExecSection>
            ) : null;

          case 'volunteering':
            return volunteering.length > 0 ? (
              <ExecSection key={section} title="Community Leadership" color={color}>
                {volunteering.map((v) => (
                  <div key={v.id} className="flex justify-between text-[10.5px]">
                    <span className="font-semibold text-gray-800">{v.role} — {v.organization}</span>
                    <span className="text-gray-400">{formatDateRange(v.startDate, v.endDate, v.current || false)}</span>
                  </div>
                ))}
              </ExecSection>
            ) : null;

          case 'publications':
            return publications.length > 0 ? (
              <ExecSection key={section} title="Publications" color={color}>
                {publications.map((p) => (
                  <p key={p.id} className="text-[10.5px] text-gray-700">{p.title} — {p.publisher}, {formatDate(p.date)}</p>
                ))}
              </ExecSection>
            ) : null;

          default:
            return null;
        }
      })}
    </div>
  );
}

function ExecSection({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <section className="mb-4">
      <h2 className="text-[12px] font-bold uppercase tracking-[0.12em] mb-2 pb-1 border-b-2" style={{ color, borderColor: color }}>
        {title}
      </h2>
      {children}
    </section>
  );
}
