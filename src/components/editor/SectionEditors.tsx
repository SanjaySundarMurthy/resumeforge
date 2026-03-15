/* ── ResumeForge — Section Editors ────────────────────────── */
/* All section editor components in a single file for efficiency */

'use client';

import { useState } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import {
  Plus, Trash2, GripVertical, ChevronDown, ChevronUp, ExternalLink,
} from 'lucide-react';

/* ── Shared Components ───────────────────────────────────── */

function Input({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="input-label">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder, rows = 3 }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <div>
      <label className="input-label">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="textarea-field"
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
    <div className="space-y-1.5">
      {items.map((item, i) => (
        <div key={i} className="flex gap-1.5">
          <input
            value={item}
            onChange={(e) => update(i, e.target.value)}
            placeholder={placeholder || `Item ${i + 1}`}
            className="input-field flex-1"
          />
          <button onClick={() => remove(i)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
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
        <button onClick={() => setOpen(!open)} className="flex items-center gap-2 text-sm font-medium text-gray-700 flex-1 text-left">
          <GripVertical className="w-3.5 h-3.5 text-gray-300" />
          {title}
        </button>
        <div className="flex items-center gap-1">
          {onRemove && (
            <button onClick={onRemove} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button onClick={() => setOpen(!open)} className="p-1 text-gray-400">
            {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
      {open && <div className="p-3 space-y-3">{children}</div>}
    </div>
  );
}

/* ── Personal Info Editor ────────────────────────────────── */

export function PersonalInfoEditor() {
  const { data, updatePersonalInfo } = useResumeStore();
  const pi = data.personalInfo;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Input label="First Name" value={pi.firstName} onChange={(v) => updatePersonalInfo({ firstName: v })} placeholder="John" />
        <Input label="Last Name" value={pi.lastName} onChange={(v) => updatePersonalInfo({ lastName: v })} placeholder="Doe" />
      </div>
      <Input label="Professional Title" value={pi.title} onChange={(v) => updatePersonalInfo({ title: v })} placeholder="Senior Software Engineer" />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Email" value={pi.email} onChange={(v) => updatePersonalInfo({ email: v })} placeholder="john@email.com" type="email" />
        <Input label="Phone" value={pi.phone} onChange={(v) => updatePersonalInfo({ phone: v })} placeholder="+1 (555) 123-4567" />
      </div>
      <Input label="Location" value={pi.location} onChange={(v) => updatePersonalInfo({ location: v })} placeholder="San Francisco, CA" />
      <Input label="LinkedIn" value={pi.linkedin} onChange={(v) => updatePersonalInfo({ linkedin: v })} placeholder="linkedin.com/in/johndoe" />
      <div className="grid grid-cols-2 gap-3">
        <Input label="GitHub" value={pi.github} onChange={(v) => updatePersonalInfo({ github: v })} placeholder="github.com/johndoe" />
        <Input label="Website" value={pi.website} onChange={(v) => updatePersonalInfo({ website: v })} placeholder="johndoe.dev" />
      </div>
    </div>
  );
}

/* ── Summary Editor ──────────────────────────────────────── */

export function SummaryEditor() {
  const { data, updateSummary } = useResumeStore();

  return (
    <div>
      <TextArea
        label="Professional Summary"
        value={data.summary}
        onChange={updateSummary}
        placeholder="Results-driven professional with X+ years of experience..."
        rows={4}
      />
      <p className="text-[10px] text-gray-400 mt-1">Aim for 30-80 words. Start with a role descriptor and include key achievements.</p>
    </div>
  );
}

/* ── Experience Editor ───────────────────────────────────── */

export function ExperienceEditor() {
  const { data, addExperience, updateExperience, removeExperience } = useResumeStore();

  return (
    <div className="space-y-3">
      {data.experience.map((exp, i) => (
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
            <Input label="Start Date" value={exp.startDate} onChange={(v) => updateExperience(exp.id, { startDate: v })} placeholder="2020-01" />
            <Input label="End Date" value={exp.endDate} onChange={(v) => updateExperience(exp.id, { endDate: v })} placeholder="2023-06" />
          </div>
          <Toggle label="I currently work here" checked={exp.current} onChange={(v) => updateExperience(exp.id, { current: v })} />
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
}

/* ── Education Editor ────────────────────────────────────── */

export function EducationEditor() {
  const { data, addEducation, updateEducation, removeEducation } = useResumeStore();

  return (
    <div className="space-y-3">
      {data.education.map((edu, i) => (
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
            <Input label="Start Date" value={edu.startDate} onChange={(v) => updateEducation(edu.id, { startDate: v })} placeholder="2016-08" />
            <Input label="End Date" value={edu.endDate} onChange={(v) => updateEducation(edu.id, { endDate: v })} placeholder="2020-05" />
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
}

/* ── Skills Editor ───────────────────────────────────────── */

export function SkillsEditor() {
  const { data, addSkillCategory, updateSkillCategory, removeSkillCategory } = useResumeStore();

  return (
    <div className="space-y-3">
      {data.skills.map((cat, i) => (
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
}

/* ── Projects Editor ─────────────────────────────────────── */

export function ProjectsEditor() {
  const { data, addProject, updateProject, removeProject } = useResumeStore();

  return (
    <div className="space-y-3">
      {data.projects.map((proj, i) => (
        <SectionCard
          key={proj.id}
          title={proj.name || `Project ${i + 1}`}
          onRemove={() => removeProject(proj.id)}
          defaultOpen={i === 0}
        >
          <Input label="Project Name" value={proj.name} onChange={(v) => updateProject(proj.id, { name: v })} placeholder="My Awesome Project" />
          <TextArea label="Description" value={proj.description} onChange={(v) => updateProject(proj.id, { description: v })} placeholder="Brief description..." rows={2} />
          <Input label="URL" value={proj.url} onChange={(v) => updateProject(proj.id, { url: v })} placeholder="github.com/user/project" />
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
}

/* ── Certifications Editor ───────────────────────────────── */

export function CertificationsEditor() {
  const { data, addCertification, updateCertification, removeCertification } = useResumeStore();

  return (
    <div className="space-y-3">
      {data.certifications.map((cert, i) => (
        <SectionCard
          key={cert.id}
          title={cert.name || `Certification ${i + 1}`}
          onRemove={() => removeCertification(cert.id)}
          defaultOpen={true}
        >
          <Input label="Certification Name" value={cert.name} onChange={(v) => updateCertification(cert.id, { name: v })} placeholder="AWS Solutions Architect" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Issuer" value={cert.issuer} onChange={(v) => updateCertification(cert.id, { issuer: v })} placeholder="Amazon Web Services" />
            <Input label="Date" value={cert.date} onChange={(v) => updateCertification(cert.id, { date: v })} placeholder="2023-06" />
          </div>
          <Input label="URL" value={cert.url} onChange={(v) => updateCertification(cert.id, { url: v })} placeholder="credential URL" />
        </SectionCard>
      ))}
      <button onClick={addCertification} className="btn-secondary w-full text-sm">
        <Plus className="w-4 h-4" /> Add Certification
      </button>
    </div>
  );
}

/* ── Languages Editor ────────────────────────────────────── */

export function LanguagesEditor() {
  const { data, addLanguage, updateLanguage, removeLanguage } = useResumeStore();

  return (
    <div className="space-y-3">
      {data.languages.map((lang, i) => (
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
}

/* ── Awards Editor ───────────────────────────────────────── */

export function AwardsEditor() {
  const { data, addAward, updateAward, removeAward } = useResumeStore();

  return (
    <div className="space-y-3">
      {data.awards.map((award, i) => (
        <SectionCard
          key={award.id}
          title={award.title || `Award ${i + 1}`}
          onRemove={() => removeAward(award.id)}
          defaultOpen={true}
        >
          <Input label="Title" value={award.title} onChange={(v) => updateAward(award.id, { title: v })} placeholder="Employee of the Year" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Issuer" value={award.issuer} onChange={(v) => updateAward(award.id, { issuer: v })} placeholder="Company Name" />
            <Input label="Date" value={award.date} onChange={(v) => updateAward(award.id, { date: v })} placeholder="2023-01" />
          </div>
          <TextArea label="Description" value={award.description} onChange={(v) => updateAward(award.id, { description: v })} placeholder="Brief description..." rows={2} />
        </SectionCard>
      ))}
      <button onClick={addAward} className="btn-secondary w-full text-sm">
        <Plus className="w-4 h-4" /> Add Award
      </button>
    </div>
  );
}

/* ── Volunteering Editor ─────────────────────────────────── */

export function VolunteeringEditor() {
  const { data, addVolunteering, updateVolunteering, removeVolunteering } = useResumeStore();

  return (
    <div className="space-y-3">
      {data.volunteering.map((vol, i) => (
        <SectionCard
          key={vol.id}
          title={vol.organization || `Volunteering ${i + 1}`}
          onRemove={() => removeVolunteering(vol.id)}
          defaultOpen={true}
        >
          <Input label="Organization" value={vol.organization} onChange={(v) => updateVolunteering(vol.id, { organization: v })} placeholder="Red Cross" />
          <Input label="Role" value={vol.role} onChange={(v) => updateVolunteering(vol.id, { role: v })} placeholder="Volunteer Coordinator" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start Date" value={vol.startDate} onChange={(v) => updateVolunteering(vol.id, { startDate: v })} placeholder="2022-01" />
            <Input label="End Date" value={vol.endDate} onChange={(v) => updateVolunteering(vol.id, { endDate: v })} placeholder="2023-06" />
          </div>
          <TextArea label="Description" value={vol.description} onChange={(v) => updateVolunteering(vol.id, { description: v })} placeholder="What you did..." rows={2} />
        </SectionCard>
      ))}
      <button onClick={addVolunteering} className="btn-secondary w-full text-sm">
        <Plus className="w-4 h-4" /> Add Volunteering
      </button>
    </div>
  );
}

/* ── Publications Editor ─────────────────────────────────── */

export function PublicationsEditor() {
  const { data, addPublication, updatePublication, removePublication } = useResumeStore();

  return (
    <div className="space-y-3">
      {data.publications.map((pub, i) => (
        <SectionCard
          key={pub.id}
          title={pub.title || `Publication ${i + 1}`}
          onRemove={() => removePublication(pub.id)}
          defaultOpen={true}
        >
          <Input label="Title" value={pub.title} onChange={(v) => updatePublication(pub.id, { title: v })} placeholder="Paper title" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Publisher" value={pub.publisher} onChange={(v) => updatePublication(pub.id, { publisher: v })} placeholder="Journal/Conference" />
            <Input label="Date" value={pub.date} onChange={(v) => updatePublication(pub.id, { date: v })} placeholder="2023-06" />
          </div>
          <Input label="URL" value={pub.url} onChange={(v) => updatePublication(pub.id, { url: v })} placeholder="doi.org/..." />
        </SectionCard>
      ))}
      <button onClick={addPublication} className="btn-secondary w-full text-sm">
        <Plus className="w-4 h-4" /> Add Publication
      </button>
    </div>
  );
}

/* ── References Editor ───────────────────────────────────── */

export function ReferencesEditor() {
  const { data, addReference, updateReference, removeReference } = useResumeStore();

  return (
    <div className="space-y-3">
      {data.references.map((ref, i) => (
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
}
