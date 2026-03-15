/* ── Professional Template ────────────────────────────────── */
/* Classic, clean, corporate-ready. Best for: Business, Finance, Law */

'use client';

import type { ResumeData, ResumeStyle } from '@/types/resume';
import { formatDateRange, formatDate } from '@/lib/utils';

interface TemplateProps {
  data: ResumeData;
  style: ResumeStyle;
}

export default function ProfessionalTemplate({ data, style }: TemplateProps) {
  const { personalInfo: pi, summary, experience, education, skills, projects, certifications, languages, awards, volunteering, publications } = data;
  const color = style.primaryColor;
  const hidden = new Set(style.hiddenSections);

  return (
    <div className="resume-page" style={{ fontFamily: style.fontFamily }}>
      {/* Header */}
      <header className="mb-5">
        <h1 className="text-[26px] font-bold tracking-tight" style={{ color }}>
          {pi.firstName} {pi.lastName}
        </h1>
        {pi.title && (
          <p className="text-[13px] font-medium text-gray-600 mt-0.5">{pi.title}</p>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-2 text-[10px] text-gray-500">
          {pi.email && <span>{pi.email}</span>}
          {pi.phone && <span>{pi.phone}</span>}
          {pi.location && <span>{pi.location}</span>}
          {pi.linkedin && <span>{pi.linkedin}</span>}
          {pi.github && <span>{pi.github}</span>}
          {pi.website && <span>{pi.website}</span>}
        </div>
        <div className="mt-3 h-[2px]" style={{ backgroundColor: color }} />
      </header>

      {/* Sections rendered by order */}
      {style.sectionOrder.filter((s) => !hidden.has(s)).map((section) => {
        switch (section) {
          case 'summary':
            return summary ? (
              <Section key={section} title="Professional Summary" color={color}>
                <p className="text-[11px] leading-[1.55] text-gray-700">{summary}</p>
              </Section>
            ) : null;

          case 'experience':
            return experience.length > 0 ? (
              <Section key={section} title="Experience" color={color}>
                {experience.map((exp, i) => (
                  <div key={exp.id} className={i > 0 ? 'mt-3' : ''}>
                    <div className="flex justify-between items-baseline">
                      <div>
                        <span className="font-semibold text-[12px] text-gray-900">{exp.position}</span>
                        {exp.company && <span className="text-[11px] text-gray-600"> — {exp.company}</span>}
                      </div>
                      <span className="text-[10px] text-gray-500 shrink-0 ml-4">
                        {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                      </span>
                    </div>
                    {exp.location && <p className="text-[10px] text-gray-400">{exp.location}</p>}
                    {exp.highlights.filter(Boolean).length > 0 && (
                      <ul className="mt-1 space-y-0.5">
                        {exp.highlights.filter(Boolean).map((h, j) => (
                          <li key={j} className="text-[10.5px] text-gray-700 flex items-start gap-1.5">
                            <span className="mt-[5px] w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: color }} />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </Section>
            ) : null;

          case 'education':
            return education.length > 0 ? (
              <Section key={section} title="Education" color={color}>
                {education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-baseline">
                    <div>
                      <span className="font-semibold text-[12px] text-gray-900">
                        {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                      </span>
                      <span className="text-[11px] text-gray-600"> — {edu.institution}</span>
                      {edu.gpa && <span className="text-[10px] text-gray-400 ml-2">GPA: {edu.gpa}</span>}
                    </div>
                    <span className="text-[10px] text-gray-500 shrink-0 ml-4">
                      {formatDateRange(edu.startDate, edu.endDate, false)}
                    </span>
                  </div>
                ))}
              </Section>
            ) : null;

          case 'skills':
            return skills.length > 0 ? (
              <Section key={section} title="Skills" color={color}>
                <div className="space-y-1">
                  {skills.map((cat) => (
                    <div key={cat.id} className="text-[10.5px]">
                      <span className="font-semibold text-gray-800">{cat.category}: </span>
                      <span className="text-gray-600">{cat.items.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </Section>
            ) : null;

          case 'projects':
            return projects.length > 0 ? (
              <Section key={section} title="Projects" color={color}>
                {projects.map((proj, i) => (
                  <div key={proj.id} className={i > 0 ? 'mt-2' : ''}>
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-[12px] text-gray-900">{proj.name}</span>
                      {proj.url && <span className="text-[9px] text-gray-400">{proj.url}</span>}
                    </div>
                    {proj.description && <p className="text-[10.5px] text-gray-600">{proj.description}</p>}
                    {proj.technologies.length > 0 && (
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        <span className="font-medium">Tech:</span> {proj.technologies.join(', ')}
                      </p>
                    )}
                    {proj.highlights.filter(Boolean).length > 0 && (
                      <ul className="mt-1 space-y-0.5">
                        {proj.highlights.filter(Boolean).map((h, j) => (
                          <li key={j} className="text-[10.5px] text-gray-700 flex items-start gap-1.5">
                            <span className="mt-[5px] w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: color }} />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </Section>
            ) : null;

          case 'certifications':
            return certifications.length > 0 ? (
              <Section key={section} title="Certifications" color={color}>
                {certifications.map((c) => (
                  <div key={c.id} className="flex justify-between text-[10.5px]">
                    <span><span className="font-semibold text-gray-800">{c.name}</span> — {c.issuer}</span>
                    <span className="text-gray-500">{formatDate(c.date)}</span>
                  </div>
                ))}
              </Section>
            ) : null;

          case 'languages':
            return languages.length > 0 ? (
              <Section key={section} title="Languages" color={color}>
                <div className="flex flex-wrap gap-x-6 gap-y-0.5 text-[10.5px]">
                  {languages.map((l) => (
                    <span key={l.id}><span className="font-semibold text-gray-800">{l.language}</span> — {l.proficiency}</span>
                  ))}
                </div>
              </Section>
            ) : null;

          case 'awards':
            return awards.length > 0 ? (
              <Section key={section} title="Awards" color={color}>
                {awards.map((a) => (
                  <div key={a.id} className="flex justify-between text-[10.5px]">
                    <span><span className="font-semibold text-gray-800">{a.title}</span> — {a.issuer}</span>
                    <span className="text-gray-500">{formatDate(a.date)}</span>
                  </div>
                ))}
              </Section>
            ) : null;

          case 'volunteering':
            return volunteering.length > 0 ? (
              <Section key={section} title="Volunteering" color={color}>
                {volunteering.map((v) => (
                  <div key={v.id} className="flex justify-between text-[10.5px]">
                    <span><span className="font-semibold text-gray-800">{v.role}</span> — {v.organization}</span>
                    <span className="text-gray-500">{formatDateRange(v.startDate, v.endDate, v.current || false)}</span>
                  </div>
                ))}
              </Section>
            ) : null;

          case 'publications':
            return publications.length > 0 ? (
              <Section key={section} title="Publications" color={color}>
                {publications.map((p) => (
                  <div key={p.id} className="text-[10.5px]">
                    <span className="font-semibold text-gray-800">{p.title}</span> — {p.publisher}, {formatDate(p.date)}
                  </div>
                ))}
              </Section>
            ) : null;

          default:
            return null;
        }
      })}
    </div>
  );
}

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <section className="mb-4">
      <h2 className="text-[13px] font-bold uppercase tracking-wider mb-1.5 pb-0.5 border-b" style={{ color, borderColor: color + '30' }}>
        {title}
      </h2>
      {children}
    </section>
  );
}
