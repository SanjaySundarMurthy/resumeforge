/* ── ResumeForge — Section Editors ────────────────────────── */
/* All section editor components in a single file for efficiency */

'use client';

import { useState, useId, memo } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import {
  Plus, Trash2, GripVertical, ChevronDown, ChevronUp, ExternalLink,
} from 'lucide-react';

/* ── Shared Components ───────────────────────────────────── */

function Input({ label, value, onChange, placeholder, type = 'text', pattern, title: inputTitle, required }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; pattern?: string; title?: string; required?: boolean;
}) {
  const uid = useId();
  const id = `input-${uid}-${label.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <div>
      <label htmlFor={id} className="input-label">{label}{required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        pattern={pattern}
        title={inputTitle}
        className="input-field"
        aria-label={label}
        required={required}
        aria-required={required}
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder, rows = 3 }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  const uid = useId();
  const id = `textarea-${uid}-${label.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <div>
      <label htmlFor={id} className="input-label">{label}</label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="textarea-field"
        aria-label={label}
      />
    </div>
  );
}

function Toggle({ label, checked, onChange }: {
  label: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2 cursor-pointer bg-transparent border-none p-0"
    >
      <div
        className={`w-9 h-5 rounded-full transition-colors relative ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}
      >
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </div>
      <span className="text-xs text-gray-600">{label}</span>
    </button>
  );
}

function ArrayEditor({ items, onChange, placeholder }: {
  items: string[]; onChange: (items: string[]) => void; placeholder?: string;
}) {
  const update = (i: number, val: string) => {
    const newItems = [...items];
    newItems[i] = val;
    onChange(newItems);
  };
  const remove = (i: number) => onChange(items.filter((_, j) => j !== i));
  const add = () => onChange([...items, '']);

  return (
    <div className="space-y-1.5" role="list" aria-label="Bullet points">
      {items.map((item, i) => (
        <div key={`bullet-${i}-${items.length}`} className="flex gap-1.5" role="listitem">
          <input
            value={item}
            onChange={(e) => update(i, e.target.value)}
            placeholder={placeholder || `Item ${i + 1}`}
            className="input-field flex-1"
            aria-label={`Bullet point ${i + 1}`}
          />
          <button onClick={() => remove(i)} className="p-2 text-gray-400 hover:text-red-500 transition-colors" aria-label={`Remove bullet ${i + 1}`}>
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium mt-1">
        <Plus className="w-3.5 h-3.5" /> Add bullet point
      </button>
    </div>
  );
}

function SectionCard({ title, children, onRemove, defaultOpen = true }: {
  title: string; children: React.ReactNode; onRemove?: () => void; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-100">
        <button onClick={() => setOpen(!open)} className="flex items-center gap-2 text-sm font-medium text-gray-700 flex-1 text-left" aria-expanded={open}>
          <GripVertical className="w-3.5 h-3.5 text-gray-300" />
          {title}
        </button>
        <div className="flex items-center gap-1">
          {onRemove && (
            <button onClick={onRemove} className="p-1 text-gray-400 hover:text-red-500 transition-colors" aria-label={`Remove ${title}`}>
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button onClick={() => setOpen(!open)} className="p-1 text-gray-400" aria-expanded={open} aria-label={open ? 'Collapse section' : 'Expand section'}>
            {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
      {open && <div className="p-3 space-y-3">{children}</div>}
    </div>
  );
}

/* ── Personal Info Editor ────────────────────────────────── */

export const PersonalInfoEditor = memo(function PersonalInfoEditor() {
  const pi = useResumeStore((s) => s.data.personalInfo);
  const updatePersonalInfo = useResumeStore((s) => s.updatePersonalInfo);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Input label="First Name" value={pi.firstName} onChange={(v) => updatePersonalInfo({ firstName: v })} placeholder="John" required />
        <Input label="Last Name" value={pi.lastName} onChange={(v) => updatePersonalInfo({ lastName: v })} placeholder="Doe" />
      </div>
      <Input label="Professional Title" value={pi.title} onChange={(v) => updatePersonalInfo({ title: v })} placeholder="Senior Software Engineer" />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Email" value={pi.email} onChange={(v) => updatePersonalInfo({ email: v })} placeholder="john@email.com" type="email" required />
        <Input label="Phone" value={pi.phone} onChange={(v) => updatePersonalInfo({ phone: v })} placeholder="+1 (555) 123-4567" type="tel" />
      </div>
      <Input label="Location" value={pi.location} onChange={(v) => updatePersonalInfo({ location: v })} placeholder="San Francisco, CA" />
      <Input label="LinkedIn" value={pi.linkedin} onChange={(v) => updatePersonalInfo({ linkedin: v })} placeholder="linkedin.com/in/johndoe" type="url" />
      <div className="grid grid-cols-2 gap-3">
        <Input label="GitHub" value={pi.github} onChange={(v) => updatePersonalInfo({ github: v })} placeholder="github.com/johndoe" type="url" />
        <Input label="Website" value={pi.website} onChange={(v) => updatePersonalInfo({ website: v })} placeholder="johndoe.dev" type="url" />
      </div>
    </div>
  );
});

/* ── Summary Editor ──────────────────────────────────────── */

export const SummaryEditor = memo(function SummaryEditor() {
  const summary = useResumeStore((s) => s.data.summary);
  const updateSummary = useResumeStore((s) => s.updateSummary);

  return (
    <div>
      <TextArea
        label="Professional Summary"
        value={summary}
        onChange={updateSummary}
        placeholder="Results-driven professional with X+ years of experience..."
        rows={4}
      />
      <p className="text-[10px] text-gray-400 mt-1">Aim for 30-80 words. Start with a role descriptor and include key achievements.</p>
    </div>
  );
});

/* ── Experience Editor ───────────────────────────────────── */

export const ExperienceEditor = memo(function ExperienceEditor() {
  const experience = useResumeStore((s) => s.data.experience);
  const addExperience = useResumeStore((s) => s.addExperience);
  const updateExperience = useResumeStore((s) => s.updateExperience);
  const removeExperience = useResumeStore((s) => s.removeExperience);

  return (
    <div className="space-y-3">
      {experience.map((exp, i) => (
        <SectionCard
          key={exp.id}
          title={exp.position || exp.company || `Experience ${i + 1}`}
          onRemove={() => removeExperience(exp.id)}
          defaultOpen={i === 0}
        >
          <div className="grid grid-cols-2 gap-3">
            <Input label="Position" value={exp.position} onChange={(v) => updateExperience(exp.id, { position: v })} placeholder="Software Engineer" />
            <Input label="Company" value={exp.company} onChange={(v) => updateExperience(exp.id, { company: v })} placeholder="TechCorp Inc." />
          </div>
          <Input label="Location" value={exp.location} onChange={(v) => updateExperience(exp.id, { location: v })} placeholder="San Francisco, CA" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start Date" value={exp.startDate} onChange={(v) => updateExperience(exp.id, { startDate: v })} placeholder="2020-01" type="month" />
            <Input label="End Date" value={exp.endDate} onChange={(v) => updateExperience(exp.id, { endDate: v })} placeholder="2023-06" type="month" />
          </div>
          <Toggle label="I currently work here" checked={exp.current} onChange={(v) => updateExperience(exp.id, { current: v, ...(v ? { endDate: '' } : {}) })} />
          <div>
            <label className="input-label">Achievements & Highlights</label>
            <ArrayEditor
              items={exp.highlights}
              onChange={(highlights) => updateExperience(exp.id, { highlights })}
              placeholder="Led a team of 5 engineers to deliver..."
            />
          </div>
        </SectionCard>
      ))}
      <button onClick={addExperience} className="btn-secondary w-full text-sm">
        <Plus className="w-4 h-4" /> Add Experience
      </button>
    </div>
  );
});

/* ── Education Editor ────────────────────────────────────── */

export const EducationEditor = memo(function EducationEditor() {
  const education = useResumeStore((s) => s.data.education);
  const addEducation = useResumeStore((s) => s.addEducation);
  const updateEducation = useResumeStore((s) => s.updateEducation);
  const removeEducation = useResumeStore((s) => s.removeEducation);

  return (
    <div className="space-y-3">
      {education.map((edu, i) => (
        <SectionCard
          key={edu.id}
          title={edu.institution || `Education ${i + 1}`}
          onRemove={() => removeEducation(edu.id)}
          defaultOpen={i === 0}
        >
          <Input label="Institution" value={edu.institution} onChange={(v) => updateEducation(edu.id, { institution: v })} placeholder="Stanford University" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Degree" value={edu.degree} onChange={(v) => updateEducation(edu.id, { degree: v })} placeholder="Bachelor of Science" />
            <Input label="Field of Study" value={edu.field} onChange={(v) => updateEducation(edu.id, { field: v })} placeholder="Computer Science" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start Date" value={edu.startDate} onChange={(v) => updateEducation(edu.id, { startDate: v })} placeholder="2016-08" type="month" />
            <Input label="End Date" value={edu.endDate} onChange={(v) => updateEducation(edu.id, { endDate: v })} placeholder="2020-05" type="month" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="GPA" value={edu.gpa} onChange={(v) => updateEducation(edu.id, { gpa: v })} placeholder="3.8" />
            <Input label="Location" value={edu.location} onChange={(v) => updateEducation(edu.id, { location: v })} placeholder="Stanford, CA" />
          </div>
          <div>
            <label className="input-label">Highlights</label>
            <ArrayEditor
              items={edu.highlights}
              onChange={(highlights) => updateEducation(edu.id, { highlights })}
              placeholder="Dean's List, relevant coursework..."
            />
          </div>
        </SectionCard>
      ))}
      <button onClick={addEducation} className="btn-secondary w-full text-sm">
        <Plus className="w-4 h-4" /> Add Education
      </button>
    </div>
  );
});

/* ── Skills Editor ───────────────────────────────────────── */

export const SkillsEditor = memo(function SkillsEditor() {
  const skills = useResumeStore((s) => s.data.skills);
  const addSkillCategory = useResumeStore((s) => s.addSkillCategory);
  const updateSkillCategory = useResumeStore((s) => s.updateSkillCategory);
  const removeSkillCategory = useResumeStore((s) => s.removeSkillCategory);

  return (
    <div className="space-y-3">
      {skills.map((cat, i) => (
        <SectionCard
          key={cat.id}
          title={cat.category || `Category ${i + 1}`}
          onRemove={() => removeSkillCategory(cat.id)}
          defaultOpen={true}
        >
          <Input label="Category Name" value={cat.category} onChange={(v) => updateSkillCategory(cat.id, { category: v })} placeholder="Programming Languages" />
          <div>
            <label className="input-label">Skills (comma-separated)</label>
            <input
              value={cat.items.join(', ')}
              onChange={(e) => updateSkillCategory(cat.id, { items: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
              placeholder="JavaScript, TypeScript, Python, Go"
              className="input-field"
            />
          </div>
        </SectionCard>
      ))}
      <button onClick={addSkillCategory} className="btn-secondary w-full text-sm">
        <Plus className="w-4 h-4" /> Add Skill Category
      </button>
    </div>
  );
});

/* ── Projects Editor ─────────────────────────────────────── */

export const ProjectsEditor = memo(function ProjectsEditor() {
  const projects = useResumeStore((s) => s.data.projects);
  const addProject = useResumeStore((s) => s.addProject);
  const updateProject = useResumeStore((s) => s.updateProject);
  const removeProject = useResumeStore((s) => s.removeProject);

  return (
    <div className="space-y-3">
      {projects.map((proj, i) => (
        <SectionCard
          key={proj.id}
          title={proj.name || `Project ${i + 1}`}
          onRemove={() => removeProject(proj.id)}
          defaultOpen={i === 0}
        >
          <Input label="Project Name" value={proj.name} onChange={(v) => updateProject(proj.id, { name: v })} placeholder="My Awesome Project" />
          <TextArea label="Description" value={proj.description} onChange={(v) => updateProject(proj.id, { description: v })} placeholder="Brief description..." rows={2} />
          <Input label="URL" value={proj.url} onChange={(v) => updateProject(proj.id, { url: v })} placeholder="github.com/user/project" type="url" />
          <div>
            <label className="input-label">Technologies (comma-separated)</label>
            <input
              value={proj.technologies.join(', ')}
              onChange={(e) => updateProject(proj.id, { technologies: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
              placeholder="React, Node.js, PostgreSQL"
              className="input-field"
            />
          </div>
          <div>
            <label className="input-label">Highlights</label>
            <ArrayEditor
              items={proj.highlights}
              onChange={(highlights) => updateProject(proj.id, { highlights })}
              placeholder="Key achievement or feature..."
            />
          </div>
        </SectionCard>
      ))}
      <button onClick={addProject} className="btn-secondary w-full text-sm">
        <Plus className="w-4 h-4" /> Add Project
      </button>
    </div>
  );
});

/* ── Certifications Editor ───────────────────────────────── */

export const CertificationsEditor = memo(function CertificationsEditor() {
  const certifications = useResumeStore((s) => s.data.certifications);
  const addCertification = useResumeStore((s) => s.addCertification);
  const updateCertification = useResumeStore((s) => s.updateCertification);
  const removeCertification = useResumeStore((s) => s.removeCertification);

  return (
    <div className="space-y-3">
      {certifications.map((cert, i) => (
        <SectionCard
          key={cert.id}
          title={cert.name || `Certification ${i + 1}`}
          onRemove={() => removeCertification(cert.id)}
          defaultOpen={true}
        >
          <Input label="Certification Name" value={cert.name} onChange={(v) => updateCertification(cert.id, { name: v })} placeholder="AWS Solutions Architect" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Issuer" value={cert.issuer} onChange={(v) => updateCertification(cert.id, { issuer: v })} placeholder="Amazon Web Services" />
            <Input label="Date" value={cert.date} onChange={(v) => updateCertification(cert.id, { date: v })} placeholder="2023-06" type="month" />
          </div>
          <Input label="URL" value={cert.url} onChange={(v) => updateCertification(cert.id, { url: v })} placeholder="credential URL" type="url" />
        </SectionCard>
      ))}
      <button onClick={addCertification} className="btn-secondary w-full text-sm">
        <Plus className="w-4 h-4" /> Add Certification
      </button>
    </div>
  );
});

/* ── Languages Editor ────────────────────────────────────── */

export const LanguagesEditor = memo(function LanguagesEditor() {
  const languages = useResumeStore((s) => s.data.languages);
  const addLanguage = useResumeStore((s) => s.addLanguage);
  const updateLanguage = useResumeStore((s) => s.updateLanguage);
  const removeLanguage = useResumeStore((s) => s.removeLanguage);

  return (
    <div className="space-y-3">
      {languages.map((lang, i) => (
        <SectionCard
          key={lang.id}
          title={lang.language || `Language ${i + 1}`}
          onRemove={() => removeLanguage(lang.id)}
          defaultOpen={true}
        >
          <div className="grid grid-cols-2 gap-3">
            <Input label="Language" value={lang.language} onChange={(v) => updateLanguage(lang.id, { language: v })} placeholder="English" />
            <div>
              <label className="input-label">Proficiency</label>
              <select
                value={lang.proficiency}
                onChange={(e) => updateLanguage(lang.id, { proficiency: e.target.value })}
                className="input-field"
              >
                <option value="Native">Native</option>
                <option value="Fluent">Fluent</option>
                <option value="Advanced">Advanced</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Basic">Basic</option>
              </select>
            </div>
          </div>
        </SectionCard>
      ))}
      <button onClick={addLanguage} className="btn-secondary w-full text-sm">
        <Plus className="w-4 h-4" /> Add Language
      </button>
    </div>
  );
});

/* ── Awards Editor ───────────────────────────────────────── */

export const AwardsEditor = memo(function AwardsEditor() {
  const awards = useResumeStore((s) => s.data.awards);
  const addAward = useResumeStore((s) => s.addAward);
  const updateAward = useResumeStore((s) => s.updateAward);
  const removeAward = useResumeStore((s) => s.removeAward);

  return (
    <div className="space-y-3">
      {awards.map((award, i) => (
        <SectionCard
          key={award.id}
          title={award.title || `Award ${i + 1}`}
          onRemove={() => removeAward(award.id)}
          defaultOpen={true}
        >
          <Input label="Title" value={award.title} onChange={(v) => updateAward(award.id, { title: v })} placeholder="Employee of the Year" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Issuer" value={award.issuer} onChange={(v) => updateAward(award.id, { issuer: v })} placeholder="Company Name" />
            <Input label="Date" value={award.date} onChange={(v) => updateAward(award.id, { date: v })} placeholder="2023-01" type="month" />
          </div>
          <TextArea label="Description" value={award.description} onChange={(v) => updateAward(award.id, { description: v })} placeholder="Brief description..." rows={2} />
        </SectionCard>
      ))}
      <button onClick={addAward} className="btn-secondary w-full text-sm">
        <Plus className="w-4 h-4" /> Add Award
      </button>
    </div>
  );
});

/* ── Volunteering Editor ─────────────────────────────────── */

export const VolunteeringEditor = memo(function VolunteeringEditor() {
  const volunteering = useResumeStore((s) => s.data.volunteering);
  const addVolunteering = useResumeStore((s) => s.addVolunteering);
  const updateVolunteering = useResumeStore((s) => s.updateVolunteering);
  const removeVolunteering = useResumeStore((s) => s.removeVolunteering);

  return (
    <div className="space-y-3">
      {volunteering.map((vol, i) => (
        <SectionCard
          key={vol.id}
          title={vol.organization || `Volunteering ${i + 1}`}
          onRemove={() => removeVolunteering(vol.id)}
          defaultOpen={true}
        >
          <Input label="Organization" value={vol.organization} onChange={(v) => updateVolunteering(vol.id, { organization: v })} placeholder="Red Cross" />
          <Input label="Role" value={vol.role} onChange={(v) => updateVolunteering(vol.id, { role: v })} placeholder="Volunteer Coordinator" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start Date" value={vol.startDate} onChange={(v) => updateVolunteering(vol.id, { startDate: v })} placeholder="2022-01" type="month" />
            <Input label="End Date" value={vol.endDate} onChange={(v) => updateVolunteering(vol.id, { endDate: v })} placeholder="2023-06" type="month" />
          </div>
          <Toggle label="I currently volunteer here" checked={vol.current} onChange={(v) => updateVolunteering(vol.id, { current: v })} />
          <TextArea label="Description" value={vol.description} onChange={(v) => updateVolunteering(vol.id, { description: v })} placeholder="What you did..." rows={2} />
        </SectionCard>
      ))}
      <button onClick={addVolunteering} className="btn-secondary w-full text-sm">
        <Plus className="w-4 h-4" /> Add Volunteering
      </button>
    </div>
  );
});

/* ── Publications Editor ─────────────────────────────────── */

export const PublicationsEditor = memo(function PublicationsEditor() {
  const publications = useResumeStore((s) => s.data.publications);
  const addPublication = useResumeStore((s) => s.addPublication);
  const updatePublication = useResumeStore((s) => s.updatePublication);
  const removePublication = useResumeStore((s) => s.removePublication);

  return (
    <div className="space-y-3">
      {publications.map((pub, i) => (
        <SectionCard
          key={pub.id}
          title={pub.title || `Publication ${i + 1}`}
          onRemove={() => removePublication(pub.id)}
          defaultOpen={true}
        >
          <Input label="Title" value={pub.title} onChange={(v) => updatePublication(pub.id, { title: v })} placeholder="Paper title" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Publisher" value={pub.publisher} onChange={(v) => updatePublication(pub.id, { publisher: v })} placeholder="Journal/Conference" />
            <Input label="Date" value={pub.date} onChange={(v) => updatePublication(pub.id, { date: v })} placeholder="2023-06" type="month" />
          </div>
          <Input label="URL" value={pub.url} onChange={(v) => updatePublication(pub.id, { url: v })} placeholder="doi.org/..." type="url" />
          <TextArea label="Description" value={pub.description} onChange={(v) => updatePublication(pub.id, { description: v })} placeholder="Brief summary of the publication..." rows={2} />
        </SectionCard>
      ))}
      <button onClick={addPublication} className="btn-secondary w-full text-sm">
        <Plus className="w-4 h-4" /> Add Publication
      </button>
    </div>
  );
});

/* ── References Editor ───────────────────────────────────── */

export const ReferencesEditor = memo(function ReferencesEditor() {
  const references = useResumeStore((s) => s.data.references);
  const addReference = useResumeStore((s) => s.addReference);
  const updateReference = useResumeStore((s) => s.updateReference);
  const removeReference = useResumeStore((s) => s.removeReference);

  return (
    <div className="space-y-3">
      {references.map((ref, i) => (
        <SectionCard
          key={ref.id}
          title={ref.name || `Reference ${i + 1}`}
          onRemove={() => removeReference(ref.id)}
          defaultOpen={true}
        >
          <Input label="Name" value={ref.name} onChange={(v) => updateReference(ref.id, { name: v })} placeholder="Jane Smith" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Position" value={ref.position} onChange={(v) => updateReference(ref.id, { position: v })} placeholder="Engineering Manager" />
            <Input label="Company" value={ref.company} onChange={(v) => updateReference(ref.id, { company: v })} placeholder="TechCorp" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Email" value={ref.email} onChange={(v) => updateReference(ref.id, { email: v })} placeholder="jane@email.com" />
            <Input label="Phone" value={ref.phone} onChange={(v) => updateReference(ref.id, { phone: v })} placeholder="+1 555-0100" />
          </div>
          <Input label="Relationship" value={ref.relationship} onChange={(v) => updateReference(ref.id, { relationship: v })} placeholder="Direct supervisor for 2 years" />
        </SectionCard>
      ))}
      <button onClick={addReference} className="btn-secondary w-full text-sm">
        <Plus className="w-4 h-4" /> Add Reference
      </button>
    </div>
  );
});
