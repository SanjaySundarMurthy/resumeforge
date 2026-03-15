/* ── ResumeForge — DOCX Exporter ─────────────────────────────
 * Exports the current resume to a properly formatted .docx file
 * using the `docx` library. ATS-optimized structure.
 * ─────────────────────────────────────────────────────────── */

import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType, convertInchesToTwip, ShadingType, UnderlineType, TabStopPosition, TabStopType } from 'docx';
import { saveAs } from 'file-saver';
import type { ResumeData, ResumeStyle } from '@/types/resume';
import { formatDateRange, formatDate } from '@/lib/utils';

/* ── Colours ── */
const hexToDocx = (hex: string) => hex.replace('#', '');
const GRAY = '6b7280';
const DARK = '111827';
const MID = '374151';

/* ── Main Export Function ───────────────────────────────── */
export async function exportToDOCX(data: ResumeData, style: ResumeStyle, filename = 'resume.docx'): Promise<void> {
  const primaryHex = hexToDocx(style.primaryColor);
  const pi = data.personalInfo;

  const children: Paragraph[] = [];

  /* ── NAME ── */
  children.push(
    new Paragraph({
      children: [new TextRun({ text: `${pi.firstName} ${pi.lastName}`, bold: true, size: 36, color: DARK, font: style.fontFamily })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
    }),
  );

  /* ── TITLE ── */
  if (pi.title) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: pi.title, size: 24, color: primaryHex, font: style.fontFamily })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
      }),
    );
  }

  /* ── CONTACT BAR ── */
  const contacts = [pi.email, pi.phone, pi.location, pi.linkedin, pi.github, pi.website].filter(Boolean);
  if (contacts.length) {
    children.push(
      new Paragraph({
        children: contacts.flatMap((c, i) => [
          new TextRun({ text: c, size: 18, color: GRAY, font: style.fontFamily }),
          ...(i < contacts.length - 1 ? [new TextRun({ text: '  |  ', size: 18, color: 'D1D5DB' })] : []),
        ]),
        alignment: AlignmentType.CENTER,
        spacing: { after: 160 },
      }),
    );
  }

  const hidden = new Set(style.hiddenSections);

  /* ── BUILDER FUNCTION ── */
  const addSection = (title: string, content: Paragraph[]) => {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: title.toUpperCase(), bold: true, size: 22, color: primaryHex, font: style.fontFamily })],
        spacing: { before: 200, after: 80 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: hexToDocx(style.primaryColor), space: 4 } },
      }),
      ...content,
    );
  };

  const bullet = (text: string): Paragraph =>
    new Paragraph({
      children: [new TextRun({ text: '•  ' + text, size: 20, color: MID, font: style.fontFamily })],
      spacing: { after: 40 },
      indent: { left: convertInchesToTwip(0.2) },
    });

  const small = (text: string, color = GRAY): Paragraph =>
    new Paragraph({
      children: [new TextRun({ text, size: 18, color, font: style.fontFamily })],
      spacing: { after: 40 },
    });

  /* ── SUMMARY ── */
  if (data.summary && !hidden.has('summary')) {
    addSection('Professional Summary', [
      new Paragraph({
        children: [new TextRun({ text: data.summary, size: 20, color: MID, font: style.fontFamily })],
        spacing: { after: 80 },
      }),
    ]);
  }

  /* ── EXPERIENCE ── */
  if (data.experience.length && !hidden.has('experience')) {
    const content: Paragraph[] = [];
    data.experience.forEach((e, i) => {
      if (i > 0) content.push(new Paragraph({ spacing: { before: 120 } }));
      content.push(
        new Paragraph({
          children: [
            new TextRun({ text: e.position, bold: true, size: 22, color: DARK, font: style.fontFamily }),
          ],
          spacing: { after: 20 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: e.company, bold: true, size: 20, color: primaryHex, font: style.fontFamily }),
            ...(e.location ? [new TextRun({ text: `  ·  ${e.location}`, size: 20, color: GRAY })] : []),
            new TextRun({ text: `\t${formatDateRange(e.startDate, e.endDate, e.current)}`, size: 18, color: GRAY }),
          ],
          spacing: { after: 60 },
        }),
        ...e.highlights.filter(Boolean).map(h => bullet(h)),
      );
    });
    addSection('Work Experience', content);
  }

  /* ── EDUCATION ── */
  if (data.education.length && !hidden.has('education')) {
    const content: Paragraph[] = [];
    data.education.forEach((e, i) => {
      if (i > 0) content.push(new Paragraph({ spacing: { before: 100 } }));
      content.push(
        new Paragraph({
          children: [new TextRun({ text: `${e.degree}${e.field ? ` in ${e.field}` : ''}`, bold: true, size: 22, color: DARK, font: style.fontFamily })],
          spacing: { after: 20 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: e.institution, size: 20, color: primaryHex, font: style.fontFamily }),
            ...(e.gpa ? [new TextRun({ text: `  ·  GPA: ${e.gpa}`, size: 18, color: GRAY })] : []),
            new TextRun({ text: `\t${formatDateRange(e.startDate, e.endDate, false)}`, size: 18, color: GRAY }),
          ],
          spacing: { after: 60 },
        }),
        ...e.highlights.filter(Boolean).map(h => bullet(h)),
      );
    });
    addSection('Education', content);
  }

  /* ── SKILLS ── */
  if (data.skills.length && !hidden.has('skills')) {
    const content: Paragraph[] = data.skills.map(s =>
      new Paragraph({
        children: [
          new TextRun({ text: `${s.category}: `, bold: true, size: 20, color: DARK, font: style.fontFamily }),
          new TextRun({ text: s.items.join(', '), size: 20, color: MID }),
        ],
        spacing: { after: 60 },
      }),
    );
    addSection('Skills', content);
  }

  /* ── PROJECTS ── */
  if (data.projects.length && !hidden.has('projects')) {
    const content: Paragraph[] = [];
    data.projects.forEach((p, i) => {
      if (i > 0) content.push(new Paragraph({ spacing: { before: 100 } }));
      content.push(
        new Paragraph({
          children: [
            new TextRun({ text: p.name, bold: true, size: 22, color: DARK, font: style.fontFamily }),
            ...(p.url ? [new TextRun({ text: `  ·  ${p.url}`, size: 18, color: primaryHex })] : []),
          ],
          spacing: { after: 20 },
        }),
        ...(p.description ? [small(p.description)] : []),
        ...(p.technologies.length ? [small(`Technologies: ${p.technologies.join(', ')}`)] : []),
        ...p.highlights.filter(Boolean).map(h => bullet(h)),
      );
    });
    addSection('Projects', content);
  }

  /* ── CERTIFICATIONS ── */
  if (data.certifications.length && !hidden.has('certifications')) {
    const content = data.certifications.map(c =>
      new Paragraph({
        children: [
          new TextRun({ text: `${c.name}`, bold: true, size: 20, color: DARK, font: style.fontFamily }),
          new TextRun({ text: ` — ${c.issuer}, ${formatDate(c.date)}`, size: 20, color: GRAY }),
        ],
        spacing: { after: 60 },
      }),
    );
    addSection('Certifications', content);
  }

  /* ── LANGUAGES ── */
  if (data.languages.length && !hidden.has('languages')) {
    const content = [
      new Paragraph({
        children: data.languages.flatMap((l, i) => [
          new TextRun({ text: l.language, bold: true, size: 20, color: DARK, font: style.fontFamily }),
          new TextRun({ text: ` (${l.proficiency})`, size: 20, color: GRAY }),
          ...(i < data.languages.length - 1 ? [new TextRun({ text: '   ', size: 20 })] : []),
        ]),
        spacing: { after: 60 },
      }),
    ];
    addSection('Languages', content);
  }

  /* ── AWARDS ── */
  if (data.awards.length && !hidden.has('awards')) {
    const content = data.awards.map(a =>
      new Paragraph({
        children: [
          new TextRun({ text: a.title, bold: true, size: 20, color: DARK }),
          ...(a.issuer ? [new TextRun({ text: ` — ${a.issuer}`, size: 20, color: GRAY })] : []),
          ...(a.date ? [new TextRun({ text: `, ${formatDate(a.date)}`, size: 18, color: GRAY })] : []),
        ],
        spacing: { after: 60 },
      }),
    );
    addSection('Awards & Honors', content);
  }

  /* ── VOLUNTEERING ── */
  if (data.volunteering.length && !hidden.has('volunteering')) {
    const content: Paragraph[] = [];
    data.volunteering.forEach(v => {
      content.push(
        new Paragraph({ children: [new TextRun({ text: v.role, bold: true, size: 22, color: DARK })], spacing: { after: 20 } }),
        new Paragraph({ children: [new TextRun({ text: `${v.organization}  ·  ${formatDateRange(v.startDate, v.endDate, v.current)}`, size: 20, color: GRAY })], spacing: { after: 60 } }),
      );
    });
    addSection('Volunteering', content);
  }

  /* ── PUBLICATIONS ── */
  if (data.publications.length && !hidden.has('publications')) {
    const content = data.publications.map(p =>
      new Paragraph({
        children: [new TextRun({ text: `${p.title} — ${p.publisher}, ${formatDate(p.date)}`, size: 20, color: MID, italics: true })],
        spacing: { after: 60 },
      }),
    );
    addSection('Publications', content);
  }

  /* ── REFERENCES ── */
  if (data.references.length && !hidden.has('references')) {
    const content = data.references.map(r =>
      new Paragraph({
        children: [
          new TextRun({ text: r.name, bold: true, size: 20, color: DARK }),
          new TextRun({ text: ` — ${r.position}, ${r.company}`, size: 20, color: GRAY }),
          ...(r.email ? [new TextRun({ text: `  ·  ${r.email}`, size: 18, color: GRAY })] : []),
        ],
        spacing: { after: 60 },
      }),
    );
    addSection('References', content);
  }

  /* ── Build Document ── */
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: style.fontFamily, size: 22, color: DARK },
        },
      },
    },
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(0.75),
            bottom: convertInchesToTwip(0.75),
            left: convertInchesToTwip(0.85),
            right: convertInchesToTwip(0.85),
          },
        },
      },
      children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
}
