/* ── Elegant Template ─────────────────────────────────────── */
/* Sophisticated, serif typography, refined. Best for: Law, Consulting, Academia */

'use client';

import type { ResumeData, ResumeStyle } from '@/types/resume';
import { formatDateRange, formatDate } from '@/lib/utils';

interface TemplateProps {
  data: ResumeData;
  style: ResumeStyle;
}

export default function ElegantTemplate({ data, style }: TemplateProps) {
  const { personalInfo: pi, summary, experience, education, skills, projects, certifications, languages, awards, volunteering, publications } = data;
  const color = style.primaryColor;
  const hidden = new Set(style.hiddenSections);

  return (
    <div className="resume-page" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Header — elegant centered with decorative borders */}
      <header className="text-center mb-5 pb-4 border-b" style={{ borderColor: color }}>
        <h1 className="text-[30px] font-normal tracking-wide text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
          {pi.firstName} {pi.lastName}
        </h1>
        {pi.title && <p className="text-[13px] italic mt-1.5" style={{ color }}>{pi.title}</p>}
        <div className="flex items-center justify-center flex-wrap gap-x-3 gap-y-0.5 mt-3 text-[10px] text-gray-500">
          {[pi.email, pi.phone, pi.location, pi.linkedin, pi.github, pi.website]
            .filter(Boolean)
            .map((info, i, arr) => (
              <span key={i}>
                {info}
                {i < arr.length - 1 && <span className="ml-3">•</span>}
              </span>
            ))}
        </div>
      </header>

      {style.sectionOrder.filter((s) => !hidden.has(s)).map((section) => {
        switch (section) {
          case 'summary':
            return summary ? (
              <ElegantSection key={section} title="Professional Profile" color={color}>
                <p className="text-[11px] leading-[1.65] text-gray-700 italic">{summary}</p>
              </ElegantSection>
            ) : null;

          case 'experience':
            return experience.length > 0 ? (
              <ElegantSection key={section} title="Professional Experience" color={color}>
                {experience.map((exp, i) => (
                  <div key={exp.id} className={i > 0 ? 'mt-4' : ''}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-[12px] font-bold text-gray-900">{exp.position}</h3>
                      <span className="text-[10px] italic text-gray-500">
                        {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                      </span>
                    </div>
                    <p className="text-[11px] italic" style={{ color }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                    {exp.highlights.filter(Boolean).length > 0 && (
                      <ul className="mt-1.5 space-y-0.5">
                        {exp.highlights.filter(Boolean).map((h, j) => (
                          <li key={j} className="text-[10.5px] text-gray-700 pl-4 relative">
                            <span className="absolute left-0 top-[6px] w-1.5 h-px" style={{ backgroundColor: color }} />
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </ElegantSection>
            ) : null;

          case 'education':
            return education.length > 0 ? (
              <ElegantSection key={section} title="Education" color={color}>
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-[12px] font-bold text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h3>
                      <span className="text-[10px] italic text-gray-500">{formatDateRange(edu.startDate, edu.endDate, false)}</span>
                    </div>
                    <p className="text-[11px] italic" style={{ color }}>{edu.institution}{edu.gpa ? ` — GPA: ${edu.gpa}` : ''}</p>
                  </div>
                ))}
              </ElegantSection>
            ) : null;

          case 'skills':
            return skills.length > 0 ? (
              <ElegantSection key={section} title="Areas of Expertise" color={color}>
                <div className="space-y-1">
                  {skills.map((cat) => (
                    <p key={cat.id} className="text-[10.5px] text-gray-700">
                      <span className="font-bold">{cat.category}:</span>{' '}
                      <span className="italic">{cat.items.join(', ')}</span>
                    </p>
                  ))}
                </div>
              </ElegantSection>
            ) : null;

          case 'projects':
            return projects.length > 0 ? (
              <ElegantSection key={section} title="Notable Projects" color={color}>
                {projects.map((proj, i) => (
                  <div key={proj.id} className={i > 0 ? 'mt-2' : ''}>
                    <h3 className="font-bold text-[12px] text-gray-900">{proj.name}</h3>
                    {proj.description && <p className="text-[10.5px] text-gray-600 italic">{proj.description}</p>}
                    {proj.technologies.length > 0 && (
                      <p className="text-[10px] text-gray-400 mt-0.5">{proj.technologies.join(' · ')}</p>
                    )}
                  </div>
                ))}
              </ElegantSection>
            ) : null;

          case 'certifications':
            return certifications.length > 0 ? (
              <ElegantSection key={section} title="Certifications" color={color}>
                {certifications.map((c) => (
                  <div key={c.id} className="flex justify-between text-[10.5px]">
                    <span className="text-gray-800">{c.name} — <span className="italic">{c.issuer}</span></span>
                    <span className="text-gray-400 italic">{formatDate(c.date)}</span>
                  </div>
                ))}
              </ElegantSection>
            ) : null;

          case 'languages':
            return languages.length > 0 ? (
              <ElegantSection key={section} title="Languages" color={color}>
                <p className="text-[10.5px] text-gray-700 italic">
                  {languages.map((l) => `${l.language} (${l.proficiency})`).join(' · ')}
                </p>
              </ElegantSection>
            ) : null;

          case 'awards':
            return awards.length > 0 ? (
              <ElegantSection key={section} title="Honors & Awards" color={color}>
                {awards.map((a) => (
                  <div key={a.id} className="flex justify-between text-[10.5px]">
                    <span className="text-gray-800">{a.title} — <span className="italic">{a.issuer}</span></span>
                    <span className="text-gray-400 italic">{formatDate(a.date)}</span>
                  </div>
                ))}
              </ElegantSection>
            ) : null;

          case 'volunteering':
            return volunteering.length > 0 ? (
              <ElegantSection key={section} title="Community Service" color={color}>
                {volunteering.map((v) => (
                  <div key={v.id} className="flex justify-between text-[10.5px]">
                    <span className="text-gray-800">{v.role} — <span className="italic">{v.organization}</span></span>
                    <span className="text-gray-400 italic">{formatDateRange(v.startDate, v.endDate, v.current || false)}</span>
                  </div>
                ))}
              </ElegantSection>
            ) : null;

          case 'publications':
            return publications.length > 0 ? (
              <ElegantSection key={section} title="Publications" color={color}>
                {publications.map((p) => (
                  <p key={p.id} className="text-[10.5px] text-gray-700 italic">{p.title} — {p.publisher}, {formatDate(p.date)}</p>
                ))}
              </ElegantSection>
            ) : null;

          default:
            return null;
        }
      })}
    </div>
  );
}

function ElegantSection({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <section className="mb-5">
      <h2 className="text-[12px] font-bold uppercase tracking-[0.2em] mb-2 text-center" style={{ color }}>
        — {title} —
      </h2>
      {children}
    </section>
  );
}
