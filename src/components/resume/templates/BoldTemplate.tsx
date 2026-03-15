/* ── Bold Template ────────────────────────────────────────── */
/* High-impact, strong visual presence. Best for: Sales, Management, Entrepreneurship */

'use client';

import type { ResumeData, ResumeStyle } from '@/types/resume';
import { formatDateRange, formatDate } from '@/lib/utils';

interface TemplateProps {
  data: ResumeData;
  style: ResumeStyle;
}

export default function BoldTemplate({ data, style }: TemplateProps) {
  const { personalInfo: pi, summary, experience, education, skills, projects, certifications, languages, awards, volunteering, publications } = data;
  const color = style.primaryColor;
  const hidden = new Set(style.hiddenSections);

  return (
    <div className="resume-page" style={{ fontFamily: style.fontFamily }}>
      {/* Header — full width, bold design */}
      <header className="mb-5">
        <h1 className="text-[36px] font-black leading-none text-gray-900">
          {pi.firstName}
          <span className="block" style={{ color }}>{pi.lastName}</span>
        </h1>
        {pi.title && (
          <p className="text-[14px] font-bold uppercase tracking-wider text-gray-400 mt-2">{pi.title}</p>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-3 text-[10px] text-gray-500">
          {pi.email && <span>{pi.email}</span>}
          {pi.phone && <span>{pi.phone}</span>}
          {pi.location && <span>{pi.location}</span>}
          {pi.linkedin && <span>{pi.linkedin}</span>}
          {pi.github && <span>{pi.github}</span>}
          {pi.website && <span>{pi.website}</span>}
        </div>
        <div className="mt-3 h-[3px] rounded-full" style={{ backgroundColor: color }} />
      </header>

      {style.sectionOrder.filter((s) => !hidden.has(s)).map((section) => {
        switch (section) {
          case 'summary':
            return summary ? (
              <BoldSection key={section} title="ABOUT" color={color}>
                <p className="text-[11px] leading-[1.6] text-gray-700">{summary}</p>
              </BoldSection>
            ) : null;

          case 'experience':
            return experience.length > 0 ? (
              <BoldSection key={section} title="EXPERIENCE" color={color}>
                {experience.map((exp, i) => (
                  <div key={exp.id} className={i > 0 ? 'mt-4' : ''}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-[13px] font-black text-gray-900">{exp.position}</h3>
                        <p className="text-[11px] font-bold" style={{ color }}>{exp.company}</p>
                        {exp.location && <p className="text-[10px] text-gray-400">{exp.location}</p>}
                      </div>
                      <div className="text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ml-2" style={{ backgroundColor: color + '10', color }}>
                        {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                      </div>
                    </div>
                    {exp.highlights.filter(Boolean).length > 0 && (
                      <ul className="mt-1.5 space-y-0.5">
                        {exp.highlights.filter(Boolean).map((h, j) => (
                          <li key={j} className="text-[10.5px] text-gray-700 flex items-start gap-2">
                            <span className="mt-[5px] w-1.5 h-1.5 rounded-sm shrink-0" style={{ backgroundColor: color }} />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </BoldSection>
            ) : null;

          case 'education':
            return education.length > 0 ? (
              <BoldSection key={section} title="EDUCATION" color={color}>
                {education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[12px] font-black text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                      <p className="text-[11px] font-bold" style={{ color }}>{edu.institution}</p>
                      {edu.gpa && <p className="text-[10px] text-gray-400">GPA: {edu.gpa}</p>}
                    </div>
                    <span className="text-[10px] font-bold text-gray-400">{formatDateRange(edu.startDate, edu.endDate, false)}</span>
                  </div>
                ))}
              </BoldSection>
            ) : null;

          case 'skills':
            return skills.length > 0 ? (
              <BoldSection key={section} title="SKILLS" color={color}>
                <div className="space-y-2">
                  {skills.map((cat) => (
                    <div key={cat.id}>
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">{cat.category}</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.items.map((item, j) => (
                          <span
                            key={j}
                            className="text-[10px] font-bold px-2.5 py-1 rounded"
                            style={{ backgroundColor: color + '10', color }}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </BoldSection>
            ) : null;

          case 'projects':
            return projects.length > 0 ? (
              <BoldSection key={section} title="PROJECTS" color={color}>
                {projects.map((proj, i) => (
                  <div key={proj.id} className={i > 0 ? 'mt-3' : ''}>
                    <h3 className="text-[12px] font-black text-gray-900">{proj.name}</h3>
                    {proj.description && <p className="text-[10.5px] text-gray-600">{proj.description}</p>}
                    {proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {proj.technologies.map((t, j) => (
                          <span key={j} className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: color + '10', color }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </BoldSection>
            ) : null;

          case 'certifications':
            return certifications.length > 0 ? (
              <BoldSection key={section} title="CERTIFICATIONS" color={color}>
                {certifications.map((c) => (
                  <div key={c.id} className="flex justify-between text-[10.5px]">
                    <span className="font-bold text-gray-800">{c.name} — {c.issuer}</span>
                    <span className="text-gray-400 font-bold">{formatDate(c.date)}</span>
                  </div>
                ))}
              </BoldSection>
            ) : null;

          case 'languages':
            return languages.length > 0 ? (
              <BoldSection key={section} title="LANGUAGES" color={color}>
                <div className="flex flex-wrap gap-2">
                  {languages.map((l) => (
                    <span key={l.id} className="text-[10.5px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: color + '10', color }}>
                      {l.language} — {l.proficiency}
                    </span>
                  ))}
                </div>
              </BoldSection>
            ) : null;

          case 'awards':
            return awards.length > 0 ? (
              <BoldSection key={section} title="AWARDS" color={color}>
                {awards.map((a) => (
                  <div key={a.id} className="flex justify-between text-[10.5px]">
                    <span className="font-bold text-gray-800">{a.title} — {a.issuer}</span>
                    <span className="text-gray-400">{formatDate(a.date)}</span>
                  </div>
                ))}
              </BoldSection>
            ) : null;

          case 'volunteering':
            return volunteering.length > 0 ? (
              <BoldSection key={section} title="VOLUNTEERING" color={color}>
                {volunteering.map((v) => (
                  <div key={v.id} className="flex justify-between text-[10.5px]">
                    <span className="font-bold text-gray-800">{v.role} — {v.organization}</span>
                    <span className="text-gray-400">{formatDateRange(v.startDate, v.endDate, v.current || false)}</span>
                  </div>
                ))}
              </BoldSection>
            ) : null;

          case 'publications':
            return publications.length > 0 ? (
              <BoldSection key={section} title="PUBLICATIONS" color={color}>
                {publications.map((p) => (
                  <p key={p.id} className="text-[10.5px] text-gray-700 font-bold">{p.title} — {p.publisher}, {formatDate(p.date)}</p>
                ))}
              </BoldSection>
            ) : null;

          default:
            return null;
        }
      })}
    </div>
  );
}

function BoldSection({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <section className="mb-5">
      <h2 className="text-[14px] font-black tracking-wider mb-2 flex items-center gap-2" style={{ color }}>
        <span className="w-2 h-5 rounded-sm" style={{ backgroundColor: color }} />
        {title}
      </h2>
      {children}
    </section>
  );
}
