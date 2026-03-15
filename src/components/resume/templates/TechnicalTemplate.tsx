/* ── Technical Template ───────────────────────────────────── */
/* Structured, data-rich, engineering-focused. Best for: SWE, DevOps, SRE */

'use client';

import type { ResumeData, ResumeStyle } from '@/types/resume';
import { formatDateRange, formatDate } from '@/lib/utils';

interface TemplateProps {
  data: ResumeData;
  style: ResumeStyle;
}

export default function TechnicalTemplate({ data, style }: TemplateProps) {
  const { personalInfo: pi, summary, experience, education, skills, projects, certifications, languages, awards, volunteering, publications } = data;
  const color = style.primaryColor;
  const hidden = new Set(style.hiddenSections);

  return (
    <div className="resume-page" style={{ fontFamily: style.fontFamily === 'Inter' ? 'JetBrains Mono, monospace' : style.fontFamily }}>
      {/* Header — code-like aesthetic */}
      <header className="mb-5 pb-3 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-[26px] font-bold text-gray-900">{pi.firstName} {pi.lastName}</h1>
            {pi.title && <p className="text-[12px] font-medium mt-0.5" style={{ color }}>{pi.title}</p>}
          </div>
          <div className="text-right text-[10px] text-gray-500 space-y-0.5">
            {pi.email && <p>{pi.email}</p>}
            {pi.phone && <p>{pi.phone}</p>}
            {pi.location && <p>{pi.location}</p>}
          </div>
        </div>
        <div className="flex gap-3 mt-2 text-[10px]" style={{ color }}>
          {pi.linkedin && <span>{pi.linkedin}</span>}
          {pi.github && <span>{pi.github}</span>}
          {pi.website && <span>{pi.website}</span>}
        </div>
      </header>

      {style.sectionOrder.filter((s) => !hidden.has(s)).map((section) => {
        switch (section) {
          case 'summary':
            return summary ? (
              <TechSection key={section} title="// Summary" color={color}>
                <p className="text-[10.5px] leading-[1.55] text-gray-600">{summary}</p>
              </TechSection>
            ) : null;

          case 'skills':
            // Skills first for technical resumes
            return skills.length > 0 ? (
              <TechSection key={section} title="// Tech Stack" color={color}>
                <div className="space-y-1.5">
                  {skills.map((cat) => (
                    <div key={cat.id} className="flex items-start gap-2">
                      <span className="text-[10px] font-bold shrink-0 w-20 text-right text-gray-400 mt-px">{cat.category}</span>
                      <span className="text-gray-300 mt-px">|</span>
                      <div className="flex flex-wrap gap-1">
                        {cat.items.map((item, j) => (
                          <span
                            key={j}
                            className="text-[10px] px-2 py-0.5 rounded-md font-medium"
                            style={{ backgroundColor: color + '10', color }}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TechSection>
            ) : null;

          case 'experience':
            return experience.length > 0 ? (
              <TechSection key={section} title="// Experience" color={color}>
                {experience.map((exp, i) => (
                  <div key={exp.id} className={i > 0 ? 'mt-3.5' : ''}>
                    <div className="flex justify-between items-baseline">
                      <div>
                        <span className="font-bold text-[12px] text-gray-900">{exp.position}</span>
                        <span className="text-[11px] text-gray-500"> @ </span>
                        <span className="text-[11px] font-semibold" style={{ color }}>{exp.company}</span>
                      </div>
                      <code className="text-[9px] px-2 py-0.5 bg-gray-100 rounded text-gray-500 shrink-0 ml-2">
                        {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                      </code>
                    </div>
                    {exp.location && <p className="text-[10px] text-gray-400">{exp.location}</p>}
                    {exp.highlights.filter(Boolean).length > 0 && (
                      <ul className="mt-1.5 space-y-0.5">
                        {exp.highlights.filter(Boolean).map((h, j) => (
                          <li key={j} className="text-[10.5px] text-gray-700 flex items-start gap-2">
                            <span className="text-gray-300 shrink-0 mt-px">▸</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </TechSection>
            ) : null;

          case 'projects':
            return projects.length > 0 ? (
              <TechSection key={section} title="// Projects" color={color}>
                {projects.map((proj, i) => (
                  <div key={proj.id} className={i > 0 ? 'mt-3' : ''}>
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-[12px] text-gray-900">{proj.name}</span>
                      {proj.url && <code className="text-[9px] px-1.5 py-0.5 bg-gray-100 rounded text-gray-400">{proj.url}</code>}
                    </div>
                    {proj.description && <p className="text-[10.5px] text-gray-600 mt-0.5">{proj.description}</p>}
                    {proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {proj.technologies.map((t, j) => (
                          <code key={j} className="text-[9px] px-1.5 py-0.5 rounded" style={{ backgroundColor: color + '10', color }}>
                            {t}
                          </code>
                        ))}
                      </div>
                    )}
                    {proj.highlights.filter(Boolean).length > 0 && (
                      <ul className="mt-1 space-y-0.5">
                        {proj.highlights.filter(Boolean).map((h, j) => (
                          <li key={j} className="text-[10.5px] text-gray-600 flex items-start gap-2">
                            <span className="text-gray-300 shrink-0 mt-px">▸</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </TechSection>
            ) : null;

          case 'education':
            return education.length > 0 ? (
              <TechSection key={section} title="// Education" color={color}>
                {education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-[12px] text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                      <p className="text-[11px] text-gray-500">{edu.institution}{edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</p>
                    </div>
                    <code className="text-[9px] px-2 py-0.5 bg-gray-100 rounded text-gray-500">
                      {formatDateRange(edu.startDate, edu.endDate, false)}
                    </code>
                  </div>
                ))}
              </TechSection>
            ) : null;

          case 'certifications':
            return certifications.length > 0 ? (
              <TechSection key={section} title="// Certifications" color={color}>
                {certifications.map((c) => (
                  <div key={c.id} className="flex justify-between text-[10.5px]">
                    <span><span className="font-semibold text-gray-800">{c.name}</span> — {c.issuer}</span>
                    <code className="text-[9px] text-gray-400">{formatDate(c.date)}</code>
                  </div>
                ))}
              </TechSection>
            ) : null;

          case 'languages':
            return languages.length > 0 ? (
              <TechSection key={section} title="// Languages" color={color}>
                <div className="flex gap-3">
                  {languages.map((l) => (
                    <span key={l.id} className="text-[10.5px] text-gray-600">{l.language} ({l.proficiency})</span>
                  ))}
                </div>
              </TechSection>
            ) : null;

          case 'awards':
            return awards.length > 0 ? (
              <TechSection key={section} title="// Awards" color={color}>
                {awards.map((a) => (
                  <div key={a.id} className="flex justify-between text-[10.5px]">
                    <span className="font-semibold text-gray-800">{a.title} — {a.issuer}</span>
                    <span className="text-gray-400">{formatDate(a.date)}</span>
                  </div>
                ))}
              </TechSection>
            ) : null;

          case 'volunteering':
            return volunteering.length > 0 ? (
              <TechSection key={section} title="// Volunteering" color={color}>
                {volunteering.map((v) => (
                  <div key={v.id} className="flex justify-between text-[10.5px]">
                    <span className="font-semibold text-gray-800">{v.role} — {v.organization}</span>
                    <span className="text-gray-400">{formatDateRange(v.startDate, v.endDate, v.current || false)}</span>
                  </div>
                ))}
              </TechSection>
            ) : null;

          case 'publications':
            return publications.length > 0 ? (
              <TechSection key={section} title="// Publications" color={color}>
                {publications.map((p) => (
                  <p key={p.id} className="text-[10.5px] text-gray-700">{p.title} — {p.publisher}, {formatDate(p.date)}</p>
                ))}
              </TechSection>
            ) : null;

          default:
            return null;
        }
      })}
    </div>
  );
}

function TechSection({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <section className="mb-4">
      <h2 className="text-[12px] font-bold mb-2 pb-1 border-b border-dashed border-gray-200" style={{ color }}>
        {title}
      </h2>
      {children}
    </section>
  );
}
